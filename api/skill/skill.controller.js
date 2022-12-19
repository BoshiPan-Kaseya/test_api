const { getSkillLevel } = require("./skill.service");

module.exports = {
    getAllSkill: (req, res) => {
        getSkillLevel((err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results
            });
        })
    }
}