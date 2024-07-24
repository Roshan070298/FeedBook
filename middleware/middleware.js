const jwt = require('jsonwebtoken');


const { JWT_SECRET } = require('../config/secrets');

function roleRequired(role) {
    return function (req, res, next) {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(403).json({ msg: 'No token provided' });
        }
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(500).json({ msg: 'Failed to authenticate token' });
            }
            if (decoded.role === 'Admin' || decoded.role === role) {
                req.user = decoded;
                next();
            } else {
                return res.status(403).json({ msg: 'Permission denied' });
            }
        });
    };
}

module.exports = roleRequired;
