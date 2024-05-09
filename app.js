const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Student = require("./models/student.js");

app.set("view engine", "ejs");

mongoose
    .connect("mongodb://127.0.0.1/exampleDB")
    .then(() => {
        console.log("成功連結mongoDB");
    })
    .catch(e => {
        console.log(e);
    });

app.get("/students", async (req, res) => {
    try {
        let studentData = await Student.find().exec();
        return res.send(studentData);
    } catch (e) {
        return res.status(500).send("尋找資料時發生錯誤");
    }
});

app.get("/students/:_id", async (req, res) => {
    let { _id } = req.params;
    try {
        let foundStudent = await Student.findOne({ _id }).exec();
        return res.send(foundStudent);
    } catch (e) {
        return res.status(500).send("尋找資料時發生錯誤");
    }
});

app.listen(3000, () => {
    console.log("伺服器正在聆聽port 3000");
});
