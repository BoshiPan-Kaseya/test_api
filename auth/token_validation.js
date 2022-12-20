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
                                        res.status(401).json({
                                            success: 0,
                                            message:
                                                "Access denied, Credential infomation has expired.",
                                        });
                                    } else {
                                        res.status(401).json({
                                            success: 0,
                                            message:
                                                "Token received, something went wrong.",
                                        });
                                    }
                                } else {
                                    console.log(
                                        "Access token has expired, but refresh token is still working"
                                    );
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
                                        new_refresh_token
                                    );
                                    // res.status(200).json({
                                    //     success: 1,
                                    //     token: new_access_token
                                    // })
                                    req.payload = new_access_token;
                                    console.log(
                                        "new token has generated and pass"
                                    );
                                    next();
                                }
                            }
                        );
                    }
                } else {
                    console.log("pass");
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
