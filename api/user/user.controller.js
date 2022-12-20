const { genSaltSync, hashSync, compareSync } = require("bcryptjs");
const { create, getUserByUsername } = require("./user.service");
const { sign } = require("jsonwebtoken");
const rediscl = require("../../db/cache");

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        create(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error",
                });
            }
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
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record not Found",
                });
            }
            return res.json({
                success: 1,
                data: results,
            });
        });
    },

    login: (req, res) => {
        const body = req.body;
        console.log("request received");
        getUserByUsername(body.username, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                return res.json({
                    success: 0,
                    data: "Invalid username or password",
                });
            }
            const result = compareSync(body.password, results.password);

            if (result) {
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
                rediscl.set(
                    results.id,
                    JSON.stringify({
                        refresh_token: refreshToken,
                        expires_in: process.env.JWT_REFRESH_TIME,
                    })
                );
                return res.json({
                    success: 1,
                    message: "login successfully",
                    id: results.id,
                    username: results.username,
                    token: jsontoken,
                });
            } else {
                return res.json({
                    success: 0,
                    data: "Invalid email or password",
                });
            }
        });
    },
};
