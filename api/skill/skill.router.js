const { getAllSkill } = require("./skill.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

router.get("/", checkToken, getAllSkill);

module.exports = router;