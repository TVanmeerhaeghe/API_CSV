const mysql = require("mysql");

const dbConfig = {
  host: "db",
  user: "user",
  password: "password",
  database: "docker_api",
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données:", err.message);
  } else {
    console.log("Connexion à la base de données établie");
  }
});

let students = [];

function loadStudents() {
  const query = "SELECT * FROM students";

  connection.query(query, (err, results) => {
    if (err) {
      console.error(
        "Erreur lors du chargement des étudiants depuis la base de données:",
        err.message
      );
    } else {
      students = results;
      console.log("Étudiants chargés depuis la base de données");
    }
  });
}

function getStudents() {
  return students;
}

function getStudentById(studentId) {
  return students.find((student) => student.id === studentId);
}

function addStudent(newStudent) {
  const query = "INSERT INTO students SET ?";

  connection.query(query, newStudent, (err, result) => {
    if (err) {
      console.error(
        "Erreur lors de l'ajout de l'étudiant dans la base de données:",
        err.message
      );
    } else {
      loadStudents();
      console.log("Étudiant ajouté avec succès");
    }
  });
}

function updateStudent(studentId, updatedData) {
  const query = "UPDATE students SET ? WHERE id = ?";

  connection.query(query, [updatedData, studentId], (err, result) => {
    if (err) {
      console.error(
        "Erreur lors de la mise à jour de l'étudiant dans la base de données:",
        err.message
      );
    } else {
      loadStudents();
      console.log("Étudiant mis à jour avec succès");
    }
  });
}

function deleteStudent(studentId) {
  const query = "DELETE FROM students WHERE id = ?";

  connection.query(query, studentId, (err, result) => {
    if (err) {
      console.error(
        "Erreur lors de la suppression de l'étudiant dans la base de données:",
        err.message
      );
    } else {
      loadStudents();
      console.log("Étudiant supprimé avec succès");
    }
  });
}

module.exports = {
  loadStudents,
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
};
