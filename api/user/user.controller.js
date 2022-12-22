const { genSaltSync, hashSync, compareSync } = require("bcryptjs");
const { create, getUserByUsername } = require("./user.service");
const { sign } = require("jsonwebtoken");
const rediscl = require("../../db/cache");
const log = require("../../log/log");

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        create(body, (err, results) => {
            if (err) {
                log.error("user.controller.createUser", err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error",
                });
            }
            log.log("user.controller.createUser", "new admin users has been created")
            return res.status(200).json({
                success: 1,
                data: results,
            });
        });
    },

    getUserByName: (req, res) => {
        const username = req.params.username;
        getUserByUsername(username, (err, results) => {
            if (err) {
                log.err("user.controller.getUserByName", err);
                return;
            }
            if (!results) {
                log.error("user.controller.getUserByName", "username is not found")
                return res.json({
                    success: 0,
                    message: "Record not Found",
                });
            }
            log.log("user.controller.getUserByName", "record found")
            return res.json({
                success: 1,
                data: results,
            });
        });
    },

    login: (req, res) => {
        const body = req.body;
        log.log("user.controller.login", `user ${body.username} is trying to login`)
        getUserByUsername(body.username, (err, results) => {
            if (err) {
                log.error("user.controller.login", err);
            }
            if (!results) {
                log.error("user.controller.login", `user with username ${body.username} is not found`)
                return res.json({
                    success: 0,
                    data: "Invalid username or password",
                });
            }
            const result = compareSync(body.password, results.password);

            if (result) {
                log.log("user.controller.login", "user authentication matches")
                results.password = undefined;
                const jsontoken = sign(
                    { result: results },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: process.env.JWT_ACCESS_TIME,
                    }
                );
                const refreshToken = sign(
                    { result: results },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: process.env.JWT_REFRESH_TIME,
                    }
                );
                log.log("user.controller.login", "tokens has generated")
                rediscl.set(
                    results.id,
                    JSON.stringify({
                        refresh_token: refreshToken,
                        expires_in: process.env.JWT_REFRESH_TIME,
                    })
                );
                log.log("user.controller.login", "refresh token has been stored in Redis")
                return res.json({
                    success: 1,
                    message: "login successfully",
                    id: results.id,
                    username: results.username,
                    token: jsontoken,
                });
            } else {
                log.error("user.controller.login", "invalid username or password")
                return res.json({
                    success: 0,
                    data: "Invalid username or password",
                });
            }
        });
    },
};
