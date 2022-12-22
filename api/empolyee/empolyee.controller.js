const log = require("../../log/log");
const {
    getAllEmpolyee,
    createEmployee,
    deleteEmployeeByID,
    updateEmployeeByID,
} = require("./empolyee.service");

module.exports = {
    getAllEmployee: (req, res) => {
        getAllEmpolyee((err, results) => {
            if (err) {
                log.error("employee.controller.getAllEmployee", err)
                res.status(500).json({
                    success: 0,
                    message: "Database Connection Error",
                });
            }

            if (req.payload) {
                log.log("employee.controller.getAllEmployee", "new token append into response.")
                return res.status(200).json({
                    success: 1,
                    token: req.payload,
                    data: results,
                });
            } else {
                log.log("employee.controller.getAllEmployee", "response sent successfully")
                return res.status(200).json({
                    success: 1,
                    data: results,
                });
            }
        });
    },

    createEmployee: (req, res) => {
        const body = req.body;
        createEmployee(body, (err, results) => {
            if (err) {
                log.error("employee.controller.createEmployee", err)
                return res.status(500).json({
                    successs: 0,
                    message: "Database Connection Error",
                });
            }
            if (req.payload) {
                log.log("employee.controller.createEmployee", "new token has appened to reponse")
                return res.status(201).json({
                    success: 1,
                    token: req.payload,
                    message: "New Employee Has Added to database",
                    data: results,
                });
            } else {
                log.log("employee.controller.createEmployee", "new record has been inserted into database")
                return res.status(201).json({
                    success: 1,
                    message: "New Employee Has Added to database",
                    data: results,
                });
            }
        });
    },

    deleteEmployee: (req, res) => {
        const employee_id = req.params.employee_id;
        deleteEmployeeByID(employee_id, (err, results) => {
            if (err) {
                log.error("employee.controller.deleteEmployee", err);
                return res.status(500).json({
                    success: 0,
                    message: "Database Connection Error",
                });
            }
            if (req.payload) {
                log.log("employee.controller.deleteEmployee", "new token has appened to reponse")
                return res.status(201).json({
                    success: 1,
                    token: req.payload,
                    message: `Employee ${employee_id} has been removed from system`,
                    data: results,
                });
            } else {
                log.log("employee.controller.deleteEmployee", `employee ${employee_id} has been removed from databse`)
                return res.status(201).json({
                    success: 1,
                    message: `Employee ${employee_id} has been removed from system`,
                    data: results,
                });
            }
        });
    },

    updateEmployee: (req, res) => {
        const employee_id = req.params.employee_id;
        const body = req.body;
        updateEmployeeByID({ employee_id, body }, (err, results) => {
            if (err) {
                log.error("employee.controller.updateEmployee", err);
                return res.status(500).json({
                    success: 0,
                    message: "Database Connection Error",
                });
            }
            if (req.payload) {
                log.log("employee.controller.updateEmployee", "new token has appened to reponse")
                return res.status(200).json({
                    success: 1,
                    token: req.payload,
                    message: `Employee ${employee_id}, Info has been updated`,
                    data: results,
                });
            } else {
                log.log("employee.controller.updateEmployee", `employee ${employee_id} has been updated in databse`)
                return res.status(200).json({
                    success: 1,
                    message: `Employee ${employee_id}, Info has been updated`,
                    data: results,
                });
            }
        });
    },
};
