const mysql = require("mysql");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
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

let classes = [];

function loadClasses() {
  const query = "SELECT * FROM classes";

  connection.query(query, (err, results) => {
    if (err) {
      console.error(
        "Erreur lors du chargement des classes depuis la base de données:",
        err.message
      );
    } else {
      classes = results;
      console.log("Classes chargées depuis la base de données");
    }
  });
}

function getClasses() {
  return classes;
}

function getClassById(classId) {
  return classes.find((classItem) => classItem.id === classId);
}

function addClass(newClass) {
  const query = "INSERT INTO classes SET ?";

  connection.query(query, newClass, (err, result) => {
    if (err) {
      console.error(
        "Erreur lors de l'ajout de la classe dans la base de données:",
        err.message
      );
    } else {
      loadClasses();
      console.log("Classe ajoutée avec succès");
    }
  });
}

function updateClass(classId, updatedData) {
  const query = "UPDATE classes SET ? WHERE id = ?";

  connection.query(query, [updatedData, classId], (err, result) => {
    if (err) {
      console.error(
        "Erreur lors de la mise à jour de la classe dans la base de données:",
        err.message
      );
    } else {
      loadClasses();
      console.log("Classe mise à jour avec succès");
    }
  });
}

function deleteClass(classId) {
  const query = "DELETE FROM classes WHERE id = ?";

  connection.query(query, classId, (err, result) => {
    if (err) {
      console.error(
        "Erreur lors de la suppression de la classe dans la base de données:",
        err.message
      );
    } else {
      loadClasses();
      console.log("Classe supprimée avec succès");
    }
  });
}

module.exports = {
  loadClasses,
  getClasses,
  getClassById,
  addClass,
  updateClass,
  deleteClass,
};
