const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

async function authToken(req, res, next) {
    try {
        // Generar un ID de sesión persistente
        if (!req.cookies.sessionId) {
            const newSessionId = `guest-${uuidv4()}`;
            res.cookie('sessionId', newSessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
                sameSite: 'lax'
            });
            req.sessionId = newSessionId;
        } else {
            req.sessionId = req.cookies.sessionId;
        }

        const token = req.cookies?.token;

        const handleUnauthenticatedUser = () => {
            req.userId = req.sessionId;
            req.isAuthenticated = false;
        };

        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
                if (err) {
                    console.warn('Token inválido', err);
                    handleUnauthenticatedUser();
                } else {
                    req.userId = decoded._id;
                    req.isAuthenticated = true;
                }
                next();
            });
        } else {
            handleUnauthenticatedUser();
            next();
        }
    } catch (err) {
        console.error('Error en authToken:', err);
        
        const fallbackSessionId = `guest-${uuidv4()}`;
        req.userId = fallbackSessionId;
        req.sessionId = fallbackSessionId;
        req.isAuthenticated = false;
        
        next();
    }
}

module.exports = authToken;