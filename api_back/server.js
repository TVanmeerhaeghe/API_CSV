const http = require("http");
const classesModule = require("./classes");
const studentsModule = require("./students");

classesModule.loadClasses();
studentsModule.loadStudents();

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  classesModule.handleClassRequest(req, res);
  studentsModule.handleStudentRequest(req, res);
});

const port = 3000;

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
