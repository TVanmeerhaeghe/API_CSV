document.addEventListener("DOMContentLoaded", function () {
  const classTableElement = document.getElementById("classTable");
  const studentTableElement = document.getElementById("studentTable");
  const classForm = document.getElementById("classForm");
  const studentForm = document.getElementById("studentForm");

  const fetchClasses = async () => {
    try {
      const response = await fetch("http://localhost:3000/class");
      const classes = await response.json();

      renderClasses(classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:3000/students");
      const students = await response.json();

      renderStudents(students);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const renderClasses = (classes) => {
    classTableElement.innerHTML = "";

    const tableHeader = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = ["ID", "Name", "Level", "Modify", "Delete"];

    headers.forEach((headerText) => {
      const header = document.createElement("th");
      header.textContent = headerText;
      headerRow.appendChild(header);
    });

    tableHeader.appendChild(headerRow);
    classTableElement.appendChild(tableHeader);

    const tableBody = document.createElement("tbody");
    classes.forEach((c) => {
      const row = document.createElement("tr");

      ["id", "name", "level"].forEach((field) => {
        const cell = document.createElement("td");
        cell.dataset.field = field;
        cell.textContent = c[field] || "N/A";
        row.appendChild(cell);
      });

      const modifyCell = document.createElement("td");
      const modifyButton = document.createElement("button");
      modifyButton.innerHTML = '<i class="fas fa-edit"></i>';
      modifyButton.addEventListener("click", () =>
        openModal(c.id, c.name, c.level)
      );
      modifyCell.appendChild(modifyButton);
      row.appendChild(modifyCell);

      const deleteCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
      deleteButton.addEventListener("click", () => deleteClass(c.id));
      deleteCell.appendChild(deleteButton);
      row.appendChild(deleteCell);

      tableBody.appendChild(row);
    });

    classTableElement.appendChild(tableBody);
  };

  const renderStudents = (students) => {
    studentTableElement.innerHTML = "";

    const tableHeader = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = [
      "ID",
      "Last Name",
      "First Name",
      "Email",
      "Phone",
      "Address",
      "ZIP",
      "City",
      "Class",
      "Modify",
      "Delete",
    ];

    headers.forEach((headerText) => {
      const header = document.createElement("th");
      header.textContent = headerText;
      headerRow.appendChild(header);
    });

    tableHeader.appendChild(headerRow);
    studentTableElement.appendChild(tableHeader);

    const tableBody = document.createElement("tbody");
    students.forEach((s) => {
      const row = document.createElement("tr");

      [
        "id",
        "lastname",
        "firstname",
        "email",
        "phone",
        "address",
        "zip",
        "city",
        "class",
      ].forEach((field) => {
        const cell = document.createElement("td");
        cell.dataset.field = field;
        cell.textContent = s[field] || "N/A";
        row.appendChild(cell);
      });

      const modifyCell = document.createElement("td");
      const modifyButton = document.createElement("button");
      modifyButton.innerHTML = '<i class="fas fa-edit"></i>';
      modifyButton.addEventListener("click", () =>
        openStudentModal(
          s.id,
          s.lastname,
          s.firstname,
          s.email,
          s.phone,
          s.address,
          s.zip,
          s.city,
          s.class
        )
      );
      modifyCell.appendChild(modifyButton);
      row.appendChild(modifyCell);

      const deleteCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
      deleteButton.addEventListener("click", () => deleteStudent(s.id));
      deleteCell.appendChild(deleteButton);
      row.appendChild(deleteCell);

      tableBody.appendChild(row);
    });

    studentTableElement.appendChild(tableBody);
  };

  const createClass = async (classData) => {
    try {
      const response = await fetch("http://localhost:3000/class/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classData),
      });

      if (response.ok) {
        console.log("Class created successfully");
        fetchClasses();
      } else {
        console.error("Error creating class:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating class:", error);
    }
  };

  classForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const className = document.getElementById("className").value;
    const classLevel = document.getElementById("classLevel").value;

    const classData = {
      name: className,
      level: classLevel,
    };

    createClass(classData);
  });

  const createStudent = async (studentData) => {
    try {
      const response = await fetch("http://localhost:3000/student/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      if (response.ok) {
        console.log("Student created successfully");
        fetchStudents();
      } else {
        console.error("Error creating student:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating student:", error);
    }
  };

  studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const lastName = document.getElementById("lastName").value;
    const firstName = document.getElementById("firstName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const zip = document.getElementById("zip").value;
    const city = document.getElementById("city").value;
    const studentClass = document.getElementById("studentClass").value;

    const studentData = {
      lastname: lastName,
      firstname: firstName,
      email: email,
      phone: phone,
      address: address,
      zip: zip,
      city: city,
      class: studentClass,
    };

    createStudent(studentData);
  });

  const deleteClass = async (classId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/class/delete/${classId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(`Class with ID ${classId} deleted successfully`);
        fetchClasses();
      } else {
        console.error("Error deleting class:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  const deleteStudent = async (studentId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/student/delete/${studentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(`Student with ID ${studentId} deleted successfully`);
        fetchStudents();
      } else {
        console.error("Error deleting student:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const modifyClass = async (classId, className, classLevel) => {
    try {
      const response = await fetch(
        `http://localhost:3000/class/modify/${classId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: className, level: classLevel }),
        }
      );

      if (response.ok) {
        console.log(`Class with ID ${classId} modified successfully`);
        fetchClasses();
        closeModal();
      } else {
        console.error("Error modifying class:", response.statusText);
      }
    } catch (error) {
      console.error("Error modifying class:", error);
    }
  };

  const modifyStudent = async (
    studentId,
    lastName,
    firstName,
    email,
    phone,
    address,
    zip,
    city,
    studentClass
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3000/student/modify/${studentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lastname: lastName,
            firstname: firstName,
            email: email,
            phone: phone,
            address: address,
            zip: zip,
            city: city,
            class: studentClass,
          }),
        }
      );

      if (response.ok) {
        console.log(`Student with ID ${studentId} modified successfully`);
        fetchStudents();
        closeModal();
      } else {
        console.error("Error modifying student:", response.statusText);
      }
    } catch (error) {
      console.error("Error modifying student:", error);
    }
  };

  const openModal = (classId, className, classLevel) => {
    document.getElementById("modifyClassName").value = className;
    document.getElementById("modifyClassLevel").value = classLevel;

    overlayClass.style.display = "block";
    modalClass.style.display = "block";

    modifyClassForm.onsubmit = function (event) {
      event.preventDefault();

      const modifiedClassName =
        document.getElementById("modifyClassName").value;
      const modifiedClassLevel =
        document.getElementById("modifyClassLevel").value;

      modifyClass(classId, modifiedClassName, modifiedClassLevel);
    };
  };

  const openStudentModal = (
    studentId,
    lastName,
    firstName,
    email,
    phone,
    address,
    zip,
    city,
    studentClass
  ) => {
    document.getElementById("modifyLastName").value = lastName;
    document.getElementById("modifyFirstName").value = firstName;
    document.getElementById("modifyEmail").value = email;
    document.getElementById("modifyPhone").value = phone;
    document.getElementById("modifyAddress").value = address;
    document.getElementById("modifyZip").value = zip;
    document.getElementById("modifyCity").value = city;
    document.getElementById("modifyStudentClass").value = studentClass;

    overlayClass.style.display = "block";
    modal.style.display = "block";

    modifyStudentForm.onsubmit = function (event) {
      event.preventDefault();

      const modifiedLastName = document.getElementById("modifyLastName").value;
      const modifiedFirstName =
        document.getElementById("modifyFirstName").value;
      const modifiedEmail = document.getElementById("modifyEmail").value;
      const modifiedPhone = document.getElementById("modifyPhone").value;
      const modifiedAddress = document.getElementById("modifyAddress").value;
      const modifiedZip = document.getElementById("modifyZip").value;
      const modifiedCity = document.getElementById("modifyCity").value;
      const modifiedStudentClass =
        document.getElementById("modifyStudentClass").value;

      modifyStudent(
        studentId,
        modifiedLastName,
        modifiedFirstName,
        modifiedEmail,
        modifiedPhone,
        modifiedAddress,
        modifiedZip,
        modifiedCity,
        modifiedStudentClass
      );
    };
  };

  window.closeModal = function () {
    overlayClass.style.display = "none";
    modal.style.display = "none";
    modalClass.style.display = "none";
  };

  fetchClasses();
  fetchStudents();
});
