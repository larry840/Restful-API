const express = require("express");
const router = express.Router();
const Student = require("../models/student");

router.get("/", async (req, res, next) => {
    try {
        let studentData = await Student.find().exec();
        return res.render("students", { studentData });
    } catch (e) {
        // return res.status(500).send("尋找資料時發生錯誤");
        next(e);
    }
});

router.get("/new", (req, res) => {
    return res.render("new-student-form");
});

router.get("/:_id", async (req, res, next) => {
    let { _id } = req.params;
    try {
        let foundStudent = await Student.findOne({ _id }).exec();
        if (foundStudent != null) {
            return res.render("student-page", { foundStudent });
        } else {
            return res.status(400).render("student-not-found");
        }
    } catch (e) {
        // return res.status(400).render("student-not-found");
        next(e);
    }
});

router.get("/:_id/edit", async (req, res, next) => {
    let { _id } = req.params;
    try {
        let foundStudent = await Student.findOne({ _id }).exec();
        if (foundStudent != null) {
            return res.render("edit-student", { foundStudent });
        } else {
            return res.status(400).render("student-not-found");
        }
    } catch (e) {
        // return res.status(400).render("student-not-found");
        next(e);
    }
});

router.post("/", async (req, res) => {
    try {
        let { name, age, merit, other } = req.body;
        let newStudent = new Student({
            name,
            age,
            scholarship: {
                merit,
                other,
            },
        });
        let savedStudent = await newStudent.save();
        return res.render("student-save-success", { savedStudent });
    } catch (e) {
        return res.status(400).render("student-save-fail");
    }
});

router.put("/:_id", async (req, res) => {
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
        return res.render("student-update-success", { newData });
    } catch (e) {
        return res.status(400).send(e.message);
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

router.patch("/:_id", async (req, res) => {
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
        return res.status(400).send(e.message);
    }
});

router.delete("/:_id", async (req, res) => {
    try {
        let { _id } = req.params;
        let deleteResult = await Student.deleteOne({ _id });
        return res.send(deleteResult);
    } catch (e) {
        return res.status(500).send("無法刪除學生資料");
    }
});

module.exports = router;
