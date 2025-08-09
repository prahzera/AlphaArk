const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { getAllPlayerData, getAllTribeData, getGeneralStats } = require('../utils/database');

// Ruta principal - Inicio
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'ALPHA ARK - Inicio',
    activeTab: 'inicio'
  });
});

// Ruta para la tienda
router.get('/store', (req, res) => {
  /* res.render('storse', { 
    title: 'ALPHA ARK - Tienda',
    activeTab: 'store'
  }); */
  res.redirect('https://alphaark.tip4serv.com');
});

// Ruta para IPs
router.get('/ips', (req, res) => {
  res.render('ips', { 
    title: 'ALPHA ARK - IPs de Servidores',
    activeTab: 'ips'
  });
});

// Ruta para configuraciones
router.get('/settings', (req, res) => {
  res.render('coming-soon', { 
    title: 'ALPHA ARK - Settings - Coming Soon',
    activeTab: 'settings'
  });
});

// Ruta para tabla de clasificación
router.get('/leaderboard', async (req, res) => {
  try {
    const playerOrderBy = req.query.playerOrderBy || 'PlayTime';
    const playerOrderDirection = req.query.playerOrderDirection || 'DESC';
    const tribeOrderBy = req.query.tribeOrderBy || 'DamageScore';
    const tribeOrderDirection = req.query.tribeOrderDirection || 'DESC';

    // Obtener todos los datos de jugadores y tribus
    const [playerData, tribeData, generalStats] = await Promise.all([
      getAllPlayerData(playerOrderBy, playerOrderDirection),
      getAllTribeData(tribeOrderBy, tribeOrderDirection),
      getGeneralStats()
    ]);

    res.render('leaderboard', {
      title: 'ALPHA ARK - Leaderboard',
      activeTab: 'leaderboard',
      playerData: playerData.players,
      tribeData: tribeData.tribes,
      totalPlayers: playerData.totalPlayers,
      totalTribes: tribeData.totalTribes,
      generalStats: generalStats,
      currentFilters: {
        playerOrderBy,
        playerOrderDirection,
        tribeOrderBy,
        tribeOrderDirection
      },
      query: req.query
    });
  } catch (error) {
    console.error('Error loading leaderboard data:', error);
    res.render('leaderboard', {
      title: 'ALPHA ARK - Leaderboard',
      activeTab: 'leaderboard',
      playerData: [],
      tribeData: [],
      totalPlayers: 0,
      totalTribes: 0,
      generalStats: null,
      currentFilters: {},
      error: 'Error al cargar los datos del leaderboard',
      query: req.query
    });
  }
});

// Ruta para mods de cuevas
router.get('/cave-mods', (req, res) => {
  try {
    // Leer el archivo caves.json
    const cavesPath = path.join(__dirname, '../data/caves.json');
    const cavesData = fs.readFileSync(cavesPath, 'utf8');
    const caves = JSON.parse(cavesData);
    
    res.render('cave-mods', { 
      title: 'ALPHA ARK - Mods de Cuevas',
      activeTab: 'cave-mods',
      caves: caves
    });
  } catch (error) {
    console.error('Error loading caves data:', error);
    res.render('cave-mods', { 
      title: 'ALPHA ARK - Mods de Cuevas',
      activeTab: 'cave-mods',
      caves: null
    });
  }
});

module.exports = router;