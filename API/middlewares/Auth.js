const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.auth = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];

        if (!token || !token.startsWith("JWT ")) {
            console.error("Forbidden: No token provided");
            return res.status(403).json({ error: "Forbidden: No token provided" });
        }

        const jwtToken = token.split(" ")[1];

        jwt.verify(jwtToken, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                console.error("Token invalid: ", error);

                if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: "TokenExpiredError: jwt expired" });
                }

                return res.status(403).json({ error: "Forbidden: Invalid token" });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            error: error.message,
            message: `Something went wrong while validating the token`,
        });
    }
};