const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

// Inicializar la aplicación
const app = express();
const port = process.env.PORT || 3000;

// Configurar EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Usar layouts de EJS
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Rutas
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
