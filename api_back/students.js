const fs = require("fs");
const csv = require("csv-parser");
const bodyParser = require("body-parser");
const url = require("url");

let students = [];

function loadStudents() {
  fs.createReadStream("students.csv")
    .pipe(csv())
    .on("data", (row) => {
      students.push(row);
    })
    .on("end", () => {
      console.log("Students CSV loaded");
    });
}

function getStudents() {
  return students;
}

function getStudentById(studentId) {
  return students.find(
    (s) => s.id.toString().trim() === studentId.toString().trim()
  );
}

function addStudent(newStudent) {
  students.push(newStudent);
}

function updateStudent(studentId, updatedData) {
  const index = students.findIndex(
    (s) => s && s.id && s.id.toString().trim() === studentId.toString().trim()
  );

  if (index !== -1) {
    students[index] = { ...students[index], ...updatedData };
  }
}

function deleteStudent(studentId) {
  const index = students.findIndex(
    (s) => s && s.id && s.id.toString().trim() === studentId.toString().trim()
  );

  if (index !== -1) {
    students.splice(index, 1);
  }
}

function handleStudentRequest(req, res) {
  // /students (GET)
  if (req.url === "/students") {
    if (req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(getStudents()));
    }
  }

  // /student/{id} (GET)
  const studentUrlParts = req.url.split("/");
  if (
    studentUrlParts[1] === "student" &&
    studentUrlParts[2] &&
    req.method === "GET"
  ) {
    const studentId = parseInt(studentUrlParts[2], 10);
    const studentDetail = getStudentById(studentId);

    if (studentDetail) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(studentDetail));
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Student not found");
    }
  }

  // /student/add (POST)
  if (req.url === "/student/add" && req.method === "POST") {
    bodyParser.json()(req, res, () => {
      const newStudent = req.body;
      const newId =
        students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;
      newStudent.id = newId;

      addStudent(newStudent);
      saveStudentsToFile();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(getStudents()));
    });
  }

  // /student/modify/{id} (PATCH)
  const urlParts2 = url.parse(req.url, true);
  const pathParts = urlParts2.pathname.split("/");

  if (
    pathParts[1] === "student" &&
    pathParts[2] === "modify" &&
    pathParts[3] &&
    req.method === "PATCH"
  ) {
    const studentId = parseInt(pathParts[3], 10);

    bodyParser.json()(req, res, () => {
      const updates = req.body;
      updateStudent(studentId, updates);
      saveStudentsToFile();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(getStudents()));
    });
  }

  // /student/delete/{id} (DELETE)
  if (
    pathParts[1] === "student" &&
    pathParts[2] === "delete" &&
    pathParts[3] &&
    req.method === "DELETE"
  ) {
    const studentIdToDelete = parseInt(pathParts[3], 10);

    if (getStudentById(studentIdToDelete)) {
      deleteStudent(studentIdToDelete);
      saveStudentsToFile();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(getStudents()));
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Student not found");
    }
  }
}

function saveStudentsToFile() {
  const csvData = [
    "id,lastname,firstname,email,phone,address,zip,city,class",
    ...students.map(
      (s) =>
        `${s.id},${s.lastname},${s.firstname},${s.email},${s.phone},${s.address},${s.zip},${s.city},${s.class}`
    ),
  ].join("\n");
  fs.writeFileSync("students.csv", csvData);
  console.log("Students saved to CSV file");
}

module.exports = {
  loadStudents,
  handleStudentRequest,
};
