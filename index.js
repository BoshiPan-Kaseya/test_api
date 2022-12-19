require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const rediscl = require("./db/cache");


app.use(cors());
app.use(express.json());
const userRouter = require("./api/user/user.router");
const skillRouter = require("./api/skill/skill.router");
const employeeRouter = require("./api/empolyee/empolyee.router");

app.use("/api", userRouter);
app.use("/api/skill", skillRouter);
app.use("/api/employees", employeeRouter);

rediscl.connect();
rediscl.on("connect", () => {
    console.log("Redis has connected");
})

app.listen(process.env.PORT, () => {
    console.log("Server up and running at port: ", process.env.PORT);
});