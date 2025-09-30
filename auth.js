const jwt = require('jsonwebtoken');
const user =  require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const token = authHeader.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

            //get user from the token
        const user = await User.findById(decoded.userid).select('-password');   
        if (!user) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};