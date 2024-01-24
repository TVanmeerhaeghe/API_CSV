const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const {
  getClasses,
  getClassById,
  addClass,
  updateClass,
  deleteClass,
} = require("../models/class-functions");

router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.json(getClasses());
});

router.get("/:id", (req, res) => {
  const classId = parseInt(req.params.id, 10);
  const classDetail = getClassById(classId);

  if (classDetail) {
    res.json(classDetail);
  } else {
    res.status(404).send("Class not found");
  }
});

router.post("/add", (req, res) => {
  const newClass = req.body;
  addClass(newClass);
  res.json(getClasses());
});

router.patch("/modify/:id", (req, res) => {
  const classId = parseInt(req.params.id, 10);
  const updates = req.body;
  updateClass(classId, updates);
  res.json(getClasses());
});

router.delete("/delete/:id", (req, res) => {
  const classIdToDelete = parseInt(req.params.id, 10);

  if (getClassById(classIdToDelete)) {
    deleteClass(classIdToDelete);
    res.json(getClasses());
  } else {
    res.status(404).send("Class not found");
  }
});

module.exports = router;
