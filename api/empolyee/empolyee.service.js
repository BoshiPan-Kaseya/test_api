const db = require("../../db/db");

module.exports = {
    getAllEmpolyee: callBack => {
        db.query (
            `select BIN_TO_UUID(e.employee_id) as employee_id, e.first_name, e.last_name, e.DOB, e.email, s.skill_name, e.active, e.age
             from employee e, skill s 
             where s.skill_level = e.skill_level`,
             [],
             (error, results, field) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
             }
        )
    },

    createEmployee: (data, callBack) => {
        db.query(
            `insert into employee values(UUID_TO_BIN(UUID()), ?, ?, ?, ?, UUID_TO_BIN(?), ?, ?)`,
            [
                data.first_name,
                data.last_name,
                data.DOB,
                data.email,
                data.skill_level,
                data.active,
                data.age
            ],
            (error, results, field) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        )
    },

    deleteEmployeeByID: (employee_id, callBack) => {
        db.query(
            `delete from employee where employee_id = UUID_TO_BIN(?)`,
            [employee_id],
            (error, results, field) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        )
    },

    updateEmployeeByID: ({employee_id, body}, callBack) => {
        db.query(
            `update employee set first_name = ?, last_name = ?, DOB = ?, email = ?, skill_level = UUID_TO_BIN(?), active = ?, age = ?
             where employee_id = UUID_TO_BIN(?)`,
            [
                body.first_name,
                body.last_name,
                body.DOB,
                body.email,
                body.skill_level,
                body.active,
                body.age,
                employee_id,
            ],
            (error, results, field) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        )
    }
}