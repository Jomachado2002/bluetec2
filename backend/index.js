const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();
const connectDB = require('./config/db');
const router = require('./routes');

const app = express();

// Verificar variables de entorno requeridas
const requiredEnvVars = ['SESSION_SECRET', 'MONGODB_URI', 'TOKEN_SECRET_KEY', 'FRONTEND_URL'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Error: ${envVar} no está definida en el archivo .env`);
        process.exit(1);
    }
}

// Configuración de CORS mejorada con múltiples orígenes permitidos
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET));

// Configuración de sesión mejorada para invitados
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true, // Cambiado a true para asegurar sesiones de invitados
    name: 'sessionId',
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días para mejor experiencia
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    },
    store: new session.MemoryStore() // Mantenemos MemoryStore por simplicidad
}));

// Rutas
app.use("/api", router);

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
        const PORT = process.env.PORT || 8080;
        
        // Conectar a la base de datos
        await connectDB();
        console.log('Conexión a la base de datos establecida');
        
        // Iniciar el servidor
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en el puerto ${PORT}`);
        });
        
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Iniciar el servidor
startServer();