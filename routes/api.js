const express = require('express');
const router = express.Router();
const serverCache = require('../utils/serverCache');

// Ruta para obtener todos los servidores
router.get('/servers', async (req, res) => {
    try {
        const data = await serverCache.getServers();
        res.json({
            success: true,
            data: data.servers,
            lastUpdate: data.lastUpdate,
            cacheAge: data.cacheAge
        });
    } catch (error) {
        console.error('Error getting servers:', error);
        res.status(500).json({
            success: false,
            error: 'Error obteniendo datos de servidores'
        });
    }
});

// Ruta para obtener estadísticas de servidores
router.get('/servers/stats', async (req, res) => {
    try {
        const stats = serverCache.getServerStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error getting server stats:', error);
        res.status(500).json({
            success: false,
            error: 'Error obteniendo estadísticas'
        });
    }
});

// Ruta para forzar actualización de cache
router.post('/servers/refresh', async (req, res) => {
    try {
        const updatedServers = await serverCache.forceUpdate();
        res.json({
            success: true,
            message: 'Cache actualizado exitosamente',
            data: updatedServers
        });
    } catch (error) {
        console.error('Error refreshing servers:', error);
        res.status(500).json({
            success: false,
            error: 'Error actualizando cache'
        });
    }
});

// Ruta para obtener estado de cache
router.get('/servers/cache-status', (req, res) => {
    try {
        const cacheData = serverCache.getServersFromCache();
        res.json({
            success: true,
            data: {
                lastUpdate: cacheData.lastUpdate,
                cacheAge: cacheData.cacheAge,
                serverCount: cacheData.servers.length,
                onlineCount: cacheData.servers.filter(s => s.status === 'online').length
            }
        });
    } catch (error) {
        console.error('Error getting cache status:', error);
        res.status(500).json({
            success: false,
            error: 'Error obteniendo estado de cache'
        });
    }
});

module.exports = router; 