const fs = require("fs");
const csv = require("csv-parser");
const bodyParser = require("body-parser");
const url = require("url");

let classes = [];

function loadClasses() {
  fs.createReadStream("class.csv")
    .pipe(csv())
    .on("data", (row) => {
      classes.push(row);
    })
    .on("end", () => {
      console.log("Classes CSV loaded");
    });
}

function getClasses() {
  return classes;
}

function getClassById(classId) {
  return classes.find(
    (c) => c.id.toString().trim() === classId.toString().trim()
  );
}

function addClass(newClass) {
  classes.push(newClass);
}

function updateClass(classId, updatedData) {
  const index = classes.findIndex(
    (c) => c && c.id && c.id.toString().trim() === classId.toString().trim()
  );

  if (index !== -1) {
    classes[index] = { ...classes[index], ...updatedData };
  }
}

function deleteClass(classId) {
  const index = classes.findIndex(
    (c) => c && c.id && c.id.toString().trim() === classId.toString().trim()
  );

  if (index !== -1) {
    classes.splice(index, 1);
  }
}

function handleClassRequest(req, res) {
  // /class (GET)
  if (req.url === "/class") {
    if (req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(getClasses()));
    }
  }

  // /class/{id} (GET)
  const urlParts = req.url.split("/");
  if (urlParts[1] === "class" && urlParts[2] && req.method === "GET") {
    const classId = parseInt(urlParts[2], 10);
    const classDetail = getClassById(classId);

    if (classDetail) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(classDetail));
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Class not found");
    }
  }

  // /class/add (POST)
  if (req.url === "/class/add" && req.method === "POST") {
    bodyParser.json()(req, res, () => {
      const newClass = req.body;
      const newId =
        classes.length > 0 ? Math.max(...classes.map((c) => c.id)) + 1 : 1;
      newClass.id = newId;

      addClass(newClass);
      saveClassesToFile();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(getClasses()));
    });
  }

  // /class/modify/{id} (PATCH)
  const urlParts2 = url.parse(req.url, true);
  const pathParts = urlParts2.pathname.split("/");

  if (
    pathParts[1] === "class" &&
    pathParts[2] === "modify" &&
    pathParts[3] &&
    req.method === "PATCH"
  ) {
    const classId = parseInt(pathParts[3], 10);

    bodyParser.json()(req, res, () => {
      const updates = req.body;
      updateClass(classId, updates);
      saveClassesToFile();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(getClasses()));
    });
  }

  // /class/delete/{id}
  if (
    pathParts[1] === "class" &&
    pathParts[2] === "delete" &&
    pathParts[3] &&
    req.method === "DELETE"
  ) {
    const classIdToDelete = parseInt(pathParts[3], 10);

    if (getClassById(classIdToDelete)) {
      deleteClass(classIdToDelete);
      saveClassesToFile();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(getClasses()));
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Class not found");
    }
  }
}

function saveClassesToFile() {
  const csvData = [
    "id,name,level",
    ...classes.map((c) => `${c.id},${c.name},${c.level}`),
  ].join("\n");
  fs.writeFileSync("class.csv", csvData);
  console.log("Classes saved to CSV file");
}

module.exports = {
  loadClasses,
  handleClassRequest,
};
