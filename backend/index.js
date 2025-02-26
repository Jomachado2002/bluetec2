const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const connectDB = require('./config/db');
const router = require('./routes');

const app = express();

// Verificar variables de entorno requeridas
const requiredEnvVars = ['SESSION_SECRET', 'MONGODB_URI', 'TOKEN_SECRET_KEY', 'FRONTEND_URL'];
requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        console.error(`Error: ${envVar} no está definida en el archivo .env`);
        process.exit(1);
    }
});

// Definir si estamos en producción
const isProduction = process.env.NODE_ENV === 'production';

// Configuración de CORS
app.use(cors({
    origin: process.env.FRONTEND_URL.split(','), // Permite múltiples orígenes separados por comas
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET));

// Configuración de sesión con MongoDB como store
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'sessionId',
    cookie: {
        secure: isProduction,
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: isProduction ? 'none' : 'lax'
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 30 * 24 * 60 * 60,
        autoRemove: 'interval',
        autoRemoveInterval: 10
    })
}));

// Rutas
app.use("/api", router);

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({
        message: "Ruta no encontrada",
        error: true,
        success: false
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: "Error interno del servidor",
        error: true,
        success: false
    });
});

// Función para iniciar el servidor
const startServer = async () => {
    try {
        await connectDB();
        console.log('✅ Conexión a la base de datos establecida');
        
        // Modificación para Vercel
        const PORT = process.env.PORT || process.env.VERCEL_PORT || 3000;
        
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Exportar la app para Vercel
module.exports = app;

// Iniciar el servidor
startServer();