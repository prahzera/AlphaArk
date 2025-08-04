const express = require('express');
const router = express.Router();

// Ruta principal - Inicio
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'ALPHA ARK - Inicio',
    activeTab: 'inicio'
  });
});

// Ruta para la tienda
router.get('/store', (req, res) => {
  res.render('store', { 
    title: 'ALPHA ARK - Tienda',
    activeTab: 'store'
  });
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
  res.render('settings', { 
    title: 'ALPHA ARK - Configuraciones',
    activeTab: 'settings'
  });
});

// Ruta para tabla de clasificación
router.get('/leaderboard', (req, res) => {
  res.render('leaderboard', { 
    title: 'ALPHA ARK - Tabla de Clasificación',
    activeTab: 'leaderboard'
  });
});

// Ruta para mods de cuevas
router.get('/cave-mods', (req, res) => {
  res.render('cave-mods', { 
    title: 'ALPHA ARK - Mods de Cuevas',
    activeTab: 'cave-mods'
  });
});

module.exports = router;