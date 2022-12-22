const log = require("../../log/log");
const { getSkillLevel } = require("./skill.service");

module.exports = {
    getAllSkill: (req, res) => {
        getSkillLevel((err, results) => {
            if (err) {
                log.error("skill.controller.getAllSkill", err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error",
                });
            }

            if (req.payload) {
                log.log("skill.controller.getAllSkill", "new token has appended to response")
                return res.status(200).json({
                    success: 1,
                    token: req.payload,
                    data: results,
                });
            }
            log.log("skill.controller.getAllSkill", "skill response successfully")
            return res.status(200).json({
                success: 1,
                data: results,
            });
        });
    },
};
