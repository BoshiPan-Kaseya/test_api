const db = require("../../db/db");

module.exports = {
    getSkillLevel: callBack => {

        db.query(
            `select BIN_TO_UUID(skill_level) as skill_level, skill_name, skill_desc from skill`,
            [],
            (error, results, field) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    }
};