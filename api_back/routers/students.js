const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const {
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
} = require("../models/student-functions");

router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.json(getStudents());
});

router.get("/:id", (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const studentDetail = getStudentById(studentId);

  if (studentDetail) {
    res.json(studentDetail);
  } else {
    res.status(404).send("Student not found");
  }
});

router.post("/add", (req, res) => {
  const newStudent = req.body;
  addStudent(newStudent);
  res.json(getStudents());
});

router.patch("/modify/:id", (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const updates = req.body;
  updateStudent(studentId, updates);
  res.json(getStudents());
});

router.delete("/delete/:id", (req, res) => {
  const studentIdToDelete = parseInt(req.params.id, 10);

  if (getStudentById(studentIdToDelete)) {
    deleteStudent(studentIdToDelete);
    res.json(getStudents());
  } else {
    res.status(404).send("Student not found");
  }
});

module.exports = router;
