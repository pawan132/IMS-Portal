const express = require("express");
const cors = require("cors");
const { dbConnect, sequelize } = require("./config/database");
const path = require("path");
const { auth } = require("./middlewares/Auth");

const app = express();
require("dotenv").config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnect();

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,POST",
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.get("/ims/api", (req, res) => {
  res.send("API working....");
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/ims/api/auth", require("./routes/AuthRoutes"));

app.use((req, res, next) => {
  const publicPaths = ["/login", "/signup"];
  if (publicPaths.includes(req.path)) {
    return next();
  }
  auth(req, res, next);
});

// Routes
app.use("/ims/api/user", require("./routes/UserRoutes"));
app.use("/ims/api/institute", require("./routes/InstitutesRoutes"));
app.use("/ims/api/branch", require("./routes/BranchRoutes"));
app.use("/ims/api/faculty", require("./routes/FacultyRoutes"));
app.use("/ims/api/faculty", require("./routes/FacultyScheduleRoutes"));
app.use("/ims/api/course", require("./routes/CourseRoutes"));
app.use("/ims/api/batch", require("./routes/BatchRoutes"));
app.use("/ims/api/module", require("./routes/ModuleRoutes"));
app.use("/ims/api/student", require("./routes/StudentRoutes"));
app.use("/ims/api/dashboard", require("./routes/DashboardRoutes"));
app.use("/ims/api/master", require("./routes/MasterRoutes"));
app.use("/ims/api/registerStudent", require("./routes/StudentRegistration"));

app.listen(PORT, () => {
  console.clear();
  console.log(`Server running on port ${PORT}`);
});
