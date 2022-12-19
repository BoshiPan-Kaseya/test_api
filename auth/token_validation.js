const { verify, decode, sign } = require("jsonwebtoken");
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
                        const { refresh_token, expires_in } = JSON.parse(
                            await rediscl.get(decoded_info.result.id)
                        );
                        verify(
                            refresh_token,
                            process.env.SECRET_KEY,
                            async (
                                refresh_token_err,
                                refresh_token_decoded
                            ) => {
                                if (refresh_token_err) {
                                    if (
                                        refresh_token_err.name ===
                                        "TokenExpiredError"
                                    ) {
                                        res.status(401).json({
                                            success: 0,
                                            message: "Token has expired",
                                        });
                                    } else {
                                        res.status(404).json({
                                            success: 0,
                                            message:
                                                "Access Token has expired, Refresh Token is still working",
                                        });
                                    }
                                }
                            }
                        );

                        if (!refresh_token) {
                            res.status(401).json({
                                success: 0,
                                message: "Token has expired",
                            });
                        }
                    }
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
                message: "Access denied! Authorized token required.",
            });
        }
    },
};
