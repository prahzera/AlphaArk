const mysql = require('mysql2/promise');

// Configuración de la base de datos
const dbConfig = {
  host: '185.115.205.200',
  port: 30030,
  user: 'prah',
  password: '1234',
  database: 'tribescore',
  connectionLimit: 10
};

// Pool de conexiones
let pool = null;

// Función para obtener el pool de conexiones
function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Función para obtener datos de jugadores con paginación y ordenamiento
async function getPlayerData(page = 1, limit = 10, orderBy = 'PlayTime', orderDirection = 'DESC') {
  const connection = await getPool().getConnection();
  try {
    // Asegurar que page y limit sean números válidos y positivos
    const validPage = Math.max(1, isNaN(parseInt(page)) ? 1 : parseInt(page));
    const validLimit = Math.max(1, Math.min(100, isNaN(parseInt(limit)) ? 10 : parseInt(limit))); // Máximo 100 registros por página
    const offset = (validPage - 1) * validLimit;
    
    // Validar y sanitizar el ordenamiento
    const validColumns = ['PlayTime', 'PlayerKills', 'DinoKills', 'DinosTamed', 'DeathByPlayer', 'SteamID', 'TribeID', 'W'];
    const validDirections = ['ASC', 'DESC'];
    
    const safeOrderBy = validColumns.includes(orderBy) ? orderBy : 'PlayTime';
    const safeOrderDirection = validDirections.includes(orderDirection.toUpperCase()) ? orderDirection.toUpperCase() : 'DESC';
    
    const query = `
      SELECT 
        SteamID,
        PlayerName,
        SteamName,
        TribeName,
        TribeID,
        PlayTime,
        PlayerKills,
        DinoKills,
        DinosTamed,
        DeathByPlayer
      FROM advancedachievements_playerdata 
      WHERE PlayerName IS NOT NULL AND PlayerName != ''
      ORDER BY ${safeOrderBy} ${safeOrderDirection}
      LIMIT ? OFFSET ?
    `;
    
    // Debug: verificar los valores que se pasan a la consulta
    console.log('Debug - validLimit:', validLimit, 'offset:', offset, 'type validLimit:', typeof validLimit, 'type offset:', typeof offset);
    
    const [rows] = await connection.query(query, [validLimit, offset]);
    
    // Obtener el total de registros para la paginación
    const [countResult] = await connection.query(
      'SELECT COUNT(*) as total FROM advancedachievements_playerdata WHERE PlayerName IS NOT NULL AND PlayerName != ""'
    );
    
    const totalPlayers = countResult[0].total;
    const totalPages = Math.ceil(totalPlayers / validLimit);
    
    return {
      players: rows,
      pagination: {
        currentPage: validPage,
        totalPages: totalPages,
        totalPlayers: totalPlayers,
        limit: validLimit
      }
    };
  } finally {
    connection.release();
  }
}

// Función para obtener todos los datos de jugadores sin paginación
async function getAllPlayerData(orderBy = 'PlayTime', orderDirection = 'DESC') {
  const connection = await getPool().getConnection();
  try {
    // Validar y sanitizar el ordenamiento
    const validColumns = ['PlayTime', 'PlayerKills', 'DinoKills', 'DinosTamed', 'DeathByPlayer', 'SteamID', 'TribeID', 'W'];
    const validDirections = ['ASC', 'DESC'];
    
    const safeOrderBy = validColumns.includes(orderBy) ? orderBy : 'PlayTime';
    const safeOrderDirection = validDirections.includes(orderDirection.toUpperCase()) ? orderDirection.toUpperCase() : 'DESC';
    
    const query = `
      SELECT 
        SteamID,
        PlayerName,
        SteamName,
        TribeName,
        TribeID,
        PlayTime,
        PlayerKills,
        DinoKills,
        DinosTamed,
        DeathByPlayer
      FROM advancedachievements_playerdata 
      WHERE PlayerName IS NOT NULL AND PlayerName != ''
      ORDER BY ${safeOrderBy} ${safeOrderDirection}
    `;
    
    const [rows] = await connection.query(query);
    
    return {
      players: rows,
      totalPlayers: rows.length
    };
  } finally {
    connection.release();
  }
}

// Función para obtener datos de tribus con paginación y ordenamiento
async function getTribeData(page = 1, limit = 10, orderBy = 'DamageScore', orderDirection = 'DESC') {
  const connection = await getPool().getConnection();
  try {
    // Asegurar que page y limit sean números válidos y positivos
    const validPage = Math.max(1, isNaN(parseInt(page)) ? 1 : parseInt(page));
    const validLimit = Math.max(1, Math.min(100, isNaN(parseInt(limit)) ? 10 : parseInt(limit))); // Máximo 100 registros por página
    const offset = (validPage - 1) * validLimit;
    
    // Validar y sanitizar el ordenamiento
    const validColumns = ['DamageScore'];
    const validDirections = ['ASC', 'DESC'];
    
    const safeOrderBy = validColumns.includes(orderBy) ? orderBy : 'DamageScore';
    const safeOrderDirection = validDirections.includes(orderDirection.toUpperCase()) ? orderDirection.toUpperCase() : 'DESC';
    
    const query = `
      SELECT 
        TribeName,
        DamageScore
      FROM advancedachievements_tribedata 
      WHERE TribeName IS NOT NULL AND TribeName != ''
      ORDER BY ${safeOrderBy} ${safeOrderDirection}
      LIMIT ? OFFSET ?
    `;
    
    // Debug: verificar los valores que se pasan a la consulta
    console.log('Debug getTribeData - validLimit:', validLimit, 'offset:', offset, 'type validLimit:', typeof validLimit, 'type offset:', typeof offset);
    
    // Primero verificar si la tabla existe y tiene datos
    try {
      const [tableCheck] = await connection.query('SELECT COUNT(*) as count FROM advancedachievements_tribedata');
      console.log('Debug - Tabla tribedata existe, registros:', tableCheck[0].count);
    } catch (error) {
      console.error('Error verificando tabla tribedata:', error.message);
      throw error;
    }
    
    try {
      const [rows] = await connection.query(query, [validLimit, offset]);
      
      // Obtener el total de registros para la paginación
      const [countResult] = await connection.query(
        'SELECT COUNT(*) as total FROM advancedachievements_tribedata WHERE TribeName IS NOT NULL AND TribeName != ""'
      );
      
      const totalTribes = countResult[0].total;
      const totalPages = Math.ceil(totalTribes / validLimit);
      
      return {
        tribes: rows,
        pagination: {
          currentPage: validPage,
          totalPages: totalPages,
          totalTribes: totalTribes,
          limit: validLimit
        }
      };
    } catch (error) {
      console.error('Error en consulta getTribeData:', error.message);
      console.error('Query:', query);
      console.error('Parámetros:', [validLimit, offset]);
      throw error;
    }
  } finally {
    connection.release();
  }
}

// Función para obtener todos los datos de tribus sin paginación
async function getAllTribeData(orderBy = 'DamageScore', orderDirection = 'DESC') {
  const connection = await getPool().getConnection();
  try {
    // Validar y sanitizar el ordenamiento
    const validColumns = ['DamageScore'];
    const validDirections = ['ASC', 'DESC'];
    
    const safeOrderBy = validColumns.includes(orderBy) ? orderBy : 'DamageScore';
    const safeOrderDirection = validDirections.includes(orderDirection.toUpperCase()) ? orderDirection.toUpperCase() : 'DESC';
    
    const query = `
      SELECT 
        TribeName,
        DamageScore
      FROM advancedachievements_tribedata 
      WHERE TribeName IS NOT NULL AND TribeName != ''
      ORDER BY ${safeOrderBy} ${safeOrderDirection}
    `;
    
    const [rows] = await connection.query(query);
    
    return {
      tribes: rows,
      totalTribes: rows.length
    };
  } finally {
    connection.release();
  }
}

// Función para obtener estadísticas generales
async function getGeneralStats() {
  const connection = await getPool().getConnection();
  try {
    const [playerStats] = await connection.query(`
      SELECT 
        COUNT(*) as totalPlayers,
        SUM(PlayTime) as totalPlayTime,
        SUM(PlayerKills) as totalPlayerKills,
        SUM(DinoKills) as totalDinoKills,
        SUM(DinosTamed) as totalDinosTamed,
        SUM(DeathByPlayer) as totalDeathsByPlayer
      FROM advancedachievements_playerdata 
      WHERE PlayerName IS NOT NULL AND PlayerName != ''
    `);
    
    const [tribeStats] = await connection.query(`
      SELECT 
        COUNT(*) as totalTribes,
        SUM(DamageScore) as totalDamageScore
      FROM advancedachievements_tribedata 
      WHERE TribeName IS NOT NULL AND TribeName != ''
    `);
    
    return {
      players: playerStats[0],
      tribes: tribeStats[0]
    };
  } finally {
    connection.release();
  }
}

// Función para cerrar el pool de conexiones
function closePool() {
  if (pool) {
    pool.end();
    pool = null;
  }
}

module.exports = {
  getPlayerData,
  getTribeData,
  getAllPlayerData,
  getAllTribeData,
  getGeneralStats,
  closePool
};
