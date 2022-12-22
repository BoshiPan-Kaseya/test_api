const { verify, decode, sign } = require("jsonwebtoken");
const rediscl = require("../db/cache");
const log = require("../log/log.js");

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            token = token.slice(7);
            const decoded_info = decode(token);
            verify(token, process.env.SECRET_KEY, async (err, decoded) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        const redis_info = await rediscl.get(
                            decoded_info.result.id
                        );
                        const { refresh_token, expires_in } =
                            JSON.parse(redis_info);
                        verify(
                            refresh_token,
                            process.env.SECRET_KEY,
                            (refresh_token_err, decode) => {
                                if (refresh_token_err) {
                                    if (
                                        refresh_token_err.name ===
                                        "TokenExpiredError"
                                    ) {
                                        log.error("token_validation", refresh_token_err.name);
                                        res.status(401).json({
                                            success: 0,
                                            message:
                                                "Access denied, Credential infomation has expired.",
                                        });
                                    } else {
                                        log.error("token_validation", refresh_token_err.name)
                                        res.status(401).json({
                                            success: 0,
                                            message:
                                                "Token received, something went wrong.",
                                        });
                                    }
                                } else {
                                    log.log("token_validation", "access_token expired, generating from refresh token")
                                    const new_access_token = sign(
                                        { result: decode.result },
                                        process.env.SECRET_KEY,
                                        {
                                            expiresIn:
                                                process.env.JWT_ACCESS_TIME,
                                        }
                                    );

                                    const new_refresh_token = sign(
                                        { result: decode.result },
                                        process.env.SECRET_KEY,
                                        {
                                            expiresIn:
                                                process.env.JWT_REFRESH_TIME,
                                        }
                                    );

                                    rediscl.set(
                                        decode.result.id,
                                        JSON.stringify({
                                            refresh_token: new_refresh_token,
                                            expires_in:
                                                process.env.JWT_REFRESH_TIME,
                                        })
                                    );
                                    log.log("token_validation", "refresh token updated")

                                    req.payload = new_access_token;
                                    log.log("token_validation", "new access token generated")
                                    next();
                                }
                            }
                        );
                    }
                } else {
                    log.log("token_validation", "validate successful")
                    next();
                }
            });
        } else {
            log.error("token_validation", "unauthorized user trying to get access")
            res.status(401).json({
                success: 0,
                message: "Access denied! Authorized token required.",
            });
        }
    },
};
