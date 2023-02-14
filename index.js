const express = require("express");
const path = require("path");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

// models
const TodoTask = require("./models/TodoTask");

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const mongoose = require("mongoose");
// connection to db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, (err) => {
  if (err) return console.error(err);
  console.log("Connected to db!");
  app.listen(3000, () => console.log("Server Up and running"));
});

// GET METHOD
app.get("/", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
  });
});

// POST METHOD
app.post("/", async (req, res) => {
  console.log(req.body);
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    console.log("saved");
    res.redirect("/");
  } catch (err) {
    console.log("error");
    console.log(err);
    res.redirect("/");
  }
});

// UPDATE
app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });

// DELETE
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});
