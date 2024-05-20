const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const studentRoutes = require("./routes/student-routes");
const facultyRoutes = require("./routes/faculty-routes");

mongoose
    .connect("mongodb://127.0.0.1/exampleDB")
    .then(() => {
        console.log("成功連結mongoDB");
    })
    .catch(e => {
        console.log(e);
    });

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use("/students", studentRoutes);
app.use("/faculty", facultyRoutes);

app.use((err, req, res, next) => {
    return res.status(400).render("error");
});

app.listen(3000, () => {
    console.log("伺服器正在聆聽port 3000");
});
