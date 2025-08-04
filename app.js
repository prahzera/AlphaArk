const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Middleware para JSON
app.use(express.json());

// Rutas
const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/api');

app.use('/', indexRoutes);
app.use('/api', apiRoutes);

// Ruta de prueba para verificar que el servidor funciona
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Página no encontrada',
        activeTab: 'none'
    });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('error', {
        title: 'Error del servidor',
        activeTab: 'none',
        error: err.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor ALPHA ARK iniciado en puerto ${PORT}`);
    console.log(`📱 Accede a: http://localhost:${PORT}`);
    console.log(`🔧 API disponible en: http://localhost:${PORT}/api`);
});
