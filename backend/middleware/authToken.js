const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

async function authToken(req, res, next) {
    try {
        // Generar un ID de invitado persistente si no existe
        if (!req.session.guestId) {
            req.session.guestId = `guest-${uuidv4()}`;
        }

        // Almacenar el sessionID para usuarios invitados
        const sessionID = req.sessionID;
        const token = req.cookies?.token;

        // Función interna para manejar usuarios no autenticados
        const handleUnauthenticatedUser = () => {
            req.userId = req.session.guestId;
            req.sessionId = sessionID;
            req.isAuthenticated = false;
        };

        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
                if (err) {
                    // Token inválido, tratar como invitado
                    console.warn('Token inválido', err);
                    handleUnauthenticatedUser();
                } else {
                    // Usuario autenticado
                    req.userId = decoded._id;
                    req.sessionId = sessionID;
                    req.isAuthenticated = true;
                }
                next();
            });
        } else {
            // Sin token, manejar como invitado
            handleUnauthenticatedUser();
            next();
        }
    } catch (err) {
        console.error('Error en authToken:', err);
        
        // Último recurso de seguridad
        req.userId = `guest-${uuidv4()}`;
        req.sessionId = req.sessionID || `session-${uuidv4()}`;
        req.isAuthenticated = false;
        
        next();
    }
}

module.exports = authToken;