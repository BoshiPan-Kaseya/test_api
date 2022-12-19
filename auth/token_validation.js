const { verify, decode } = require("jsonwebtoken");
const rediscl = require("../db/cache");

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            token = token.slice(7);
            const decoded_info = decode(token);
            verify(token, process.env.SECRET_KEY, async (err, decoded) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        const refresh_token = await rediscl.get(
                            decoded_info.result.id
                        );
                        console.log(refresh_token);
                        if (!refresh_token) {
                            res.status(401).json({
                                success: 0,
                                message: "Token has expired",
                            });
                        }
                    }
                    console.log(err);
                    res.status(401).json({
                        success: 0,
                        message: "Invalid token",
                    });
                } else {
                    next();
                }
            });
        } else {
            res.status(401).json({
                success: 0,
                message: "Access denied! unauthorized user",
            });
        }
    },
};
