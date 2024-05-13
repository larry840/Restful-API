const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Student = require("./models/student");

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

app.post("/students", async (req, res) => {
    try {
        let { name, age, major, merit, other } = req.body;
        let newStudent = new Student({
            name,
            age,
            major,
            scholarship: {
                merit,
                other,
            },
        });
        let savedStudent = await newStudent.save();
        return res.send({
            msg: "資料儲存成功",
            savedObject: savedStudent,
        });
    } catch (e) {
        return res.status(400).send(e.message);
    }
});

app.put("/students/:_id", async (req, res) => {
    try {
        let { _id } = req.params;
        let { name, age, major, merit, other } = req.body;
        let newData = await Student.findOneAndUpdate(
            { _id },
            { name, age, major, scholarship: { merit, other } },
            {
                new: true,
                runValidators: true,
                overwrite: true,
                // 因為HTTP PUT request要求client提供所有數據，
                // 所以我們需要根據client所提供的數據，來更新db內的資料
            }
        );

        res.send({ msg: "成功更新學生資料！", updatedData: newData });
    } catch (e) {
        res.status(400).send(e);
    }
});

class NewData {
    constructor() {}
    setProperty(key, value) {
        if (key !== "merit" && key !== "other") {
            this[key] = value;
        } else {
            this[`scholarship.${key}`] = value;
        }
    }
}

app.patch("/students/:_id", async (req, res) => {
    try {
        let { _id } = req.params;
        let newObject = new NewData();
        for (let property in req.body) {
            newObject.setProperty(property, req.body[property]);
        }

        let newData = await Student.findByIdAndUpdate({ _id }, newObject, {
            new: true,
            runValidators: true,
            // 這裡不可以寫overwrite: true，因為newObject會被覆蓋掉！
            // 沒有寫才會選擇性的蓋掉
        });
        res.send({ msg: "成功更新學生資料!", updatedData: newData });
    } catch (e) {
        res.status(400).send(e);
    }
});

app.delete("/students/:_id", async (req, res) => {
    try {
        let { _id } = req.params;
        let deleteResult = await Student.deleteOne({ _id });
        console.log(deleteResult);
    } catch (e) {
        res.status(500).send("無法刪除學生資料");
    }
});

app.listen(3000, () => {
    console.log("伺服器正在聆聽port 3000");
});
