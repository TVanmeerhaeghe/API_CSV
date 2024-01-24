const express = require("express");
const app = express();
const http = require("http");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const studentsRouter = require("./routers/students");
const classesRouter = require("./routers/classes");

const port = 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/docs", (req, res) => {
  const filePath = path.join(__dirname, "docs/docs.yaml");
  const fileContents = fs.readFileSync(filePath, "utf-8");

  const swaggerSpec = YAML.parse(fileContents);

  const swaggerUiHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>API MDS Docs</title>
      <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3.52.1/swagger-ui.css">
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@3.52.1/swagger-ui-bundle.js"></script>
      <script>
        const spec = ${JSON.stringify(swaggerSpec)};
        SwaggerUIBundle({
          spec: spec,
          dom_id: '#swagger-ui',
        });
      </script>
    </body>
    </html>
  `;

  res.status(200).send(swaggerUiHtml);
});

app.use("/students", studentsRouter);
app.use("/class", classesRouter);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
