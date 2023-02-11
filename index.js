const express = require("express");
const app = express();

app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.listen(3000, () => console.log("Server Up and running"));

app.get('/',(req, res) => {
    // res.send('Hello World!');
    res.render('todo.ejs')
});

app.post('/',(req, res) => {
    console.log(req.body);
    });