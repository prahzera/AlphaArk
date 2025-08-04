const { GameDig } = require('gamedig');

// Cache para almacenar los datos de los servidores
let serverCache = [];
let lastUpdate = null;
const CACHE_DURATION = 15000; // 15 segundos

// Función para obtener el estado de un servidor individual
async function queryServer(server) {
    try {
        const result = await GameDig.query({
            type: 'ase',
            host: server.ip,
            port: server.port,
            timeout: 5000 // 5 segundos de timeout
        });
        // Extraer versión del nombre del servidor (patrón: (vXXX.XX) al final)
        const versionMatch = result.name.match(/\(v([^)]+)\)$/);
        const version = versionMatch ? versionMatch[1] : 'Unknown';
        
        return {
            ...server,
            name: result.name,
            status: 'online',
            players: result.players.length,
            maxPlayers: result.maxplayers,
            map: result.map,
            version: version,
            ping: result.ping,
            lastQuery: new Date().toISOString()
        };
        
    } catch (error) {
        console.log(`Error querying server ${server.name} (${server.ip}:${server.port}):`, error.message);
        
        return {
            ...server,
            status: 'offline',
            players: 0,
            maxPlayers: 0,
            map: server.name,
            version: 'Unknown',
            ping: null,
            lastQuery: new Date().toISOString(),
            error: error.message
        };
    }
}

// Función para actualizar todos los servidores
async function updateAllServers() {
    try {
        console.log('🔄 Actualizando estado de servidores...');
        
        // Cargar la lista de servidores desde el JSON
        const servers = require('../data/servers.json');
        
        // Consultar todos los servidores en paralelo
        const serverPromises = servers.map(server => queryServer(server));
        const results = await Promise.allSettled(serverPromises);
        
        // Procesar resultados
        const updatedServers = results.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            } else {
                // Si falló la consulta, crear un objeto de servidor offline
                const server = servers[index];
                return {
                    ...server,
                    status: 'offline',
                    players: 0,
                    maxPlayers: 0,
                    map: server.name,
                    version: 'Unknown',
                    ping: null,
                    lastQuery: new Date().toISOString(),
                    error: result.reason?.message || 'Query failed'
                };
            }
        });
        
        // Actualizar cache
        serverCache = updatedServers;
        lastUpdate = new Date();
        
        console.log(`✅ Cache actualizado: ${updatedServers.filter(s => s.status === 'online').length}/${updatedServers.length} servidores online`);
        
        return updatedServers;
    } catch (error) {
        console.error('❌ Error actualizando servidores:', error);
        return serverCache; // Retornar cache anterior si hay error
    }
}

// Función para obtener servidores desde cache
function getServersFromCache() {
    return {
        servers: serverCache,
        lastUpdate: lastUpdate,
        cacheAge: lastUpdate ? Date.now() - lastUpdate.getTime() : null
    };
}

// Función para verificar si el cache necesita actualización
function needsUpdate() {
    if (!lastUpdate) return true;
    return Date.now() - lastUpdate.getTime() > CACHE_DURATION;
}

// Función para obtener servidores (actualiza si es necesario)
async function getServers() {
    if (needsUpdate()) {
        await updateAllServers();
    }
    return getServersFromCache();
}

// Función para forzar actualización
async function forceUpdate() {
    return await updateAllServers();
}

// Función para obtener estadísticas generales
function getServerStats() {
    const onlineServers = serverCache.filter(s => s.status === 'online');
    const totalPlayers = onlineServers.reduce((sum, s) => sum + s.players, 0);
    const maxPlayers = onlineServers.reduce((sum, s) => sum + s.maxPlayers, 0);
    
    return {
        totalServers: serverCache.length,
        onlineServers: onlineServers.length,
        offlineServers: serverCache.length - onlineServers.length,
        totalPlayers,
        maxPlayers,
        lastUpdate: lastUpdate
    };
}

// Inicializar cache al cargar el módulo
updateAllServers().then(() => {
    console.log('🚀 Cache de servidores inicializado');
    
    // Configurar actualización automática cada 15 segundos
    setInterval(async () => {
        await updateAllServers();
    }, CACHE_DURATION);
    
    console.log(`⏰ Actualización automática configurada cada ${CACHE_DURATION/1000} segundos`);
}).catch(error => {
    console.error('❌ Error inicializando cache:', error);
});

module.exports = {
    getServers,
    getServersFromCache,
    forceUpdate,
    getServerStats,
    updateAllServers
}; 