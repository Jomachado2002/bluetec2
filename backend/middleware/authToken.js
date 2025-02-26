const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

async function authToken(req, res, next) {
    try {
        // Asegurarse de que hay una sesión de invitado
        if (!req.session.guestId) {
            req.session.guestId = `guest-${uuidv4()}`;
        }

        // Almacenar el sessionID para usuarios invitados
        const sessionID = req.sessionID;
        
        const token = req.cookies?.token;

        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
                if (err) {
                    // Token inválido, usar ID de invitado
                    req.userId = req.session.guestId;
                    req.sessionId = sessionID;
                    req.isAuthenticated = false;
                } else {
                    // Usuario autenticado
                    req.userId = decoded._id;
                    req.isAuthenticated = true;
                }
                next();
            });
        } else {
            // Usuario no autenticado
            req.userId = req.session.guestId;
            req.sessionId = sessionID;
            req.isAuthenticated = false;
            next();
        }
    } catch (err) {
        console.error('Error en authToken:', err);
        req.userId = req.session.guestId || `guest-${uuidv4()}`;
        req.sessionId = req.sessionID;
        req.isAuthenticated = false;
        next();
    }
}

module.exports = authToken;