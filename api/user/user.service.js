const db = require("../../db/db");

module.exports = {
    create: (data, callBack) => {
        db.query(
            `insert into user (user_id, username, password) values (UUID_TO_BIN(UUID()), ?, ?)`,
            [
                data.username,
                data.password
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }
        )
    },
    
    getUserByUsername: (username, callBack) => {

        db.query(
            `select BIN_TO_UUID(user_id) as id, username, password from user where username = ?`,
            [username],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        )  
    }
}