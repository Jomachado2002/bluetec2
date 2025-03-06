const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();
const connectDB = require('./config/db');
const router = require('./routes');
const generateSitemap = require('./controller/product/generateSitemap');

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
    saveUninitialized: true, // Aseguramos que las sesiones de invitados se guarden
    name: 'sessionId',
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
        httpOnly: true, // No accesible desde JavaScript en el cliente
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
        sameSite: 'none' // Permite cookies en solicitudes cross-site
    },
    store: new session.MemoryStore() // Considera usar un store más robusto para producción
}));

// Ruta del sitemap antes de las rutas API
app.get("/sitemap.xml", generateSitemap);

// Rutas API
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