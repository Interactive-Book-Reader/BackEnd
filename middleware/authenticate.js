const jwt=require('jsonwebtoken');

const authenticate = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'verySecretValue');
        req.userData = decoded;
        next();
    }
    catch(error){
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                message: "Your session has expired. Please login again.",
            });
        }
        res.json({
            message: "Authentication failed!"
        });
    }
};

module.exports = authenticate;