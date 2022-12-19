const { getAllEmployee, createEmployee, deleteEmployee, updateEmployee } = require("./empolyee.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

router.get("/", checkToken, getAllEmployee);
router.post("/", checkToken, createEmployee);
router.delete("/:employee_id", checkToken, deleteEmployee);
router.put("/:employee_id", checkToken, updateEmployee);

module.exports = router;