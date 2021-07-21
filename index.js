require("dotenv").config();
const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const session = require("express-session");

const port = process.env.PORT || 4000;
const app = express();
require("./connection/connection.js");

app.use(express.urlencoded({
    extended: true // if the incoming request are string or array then it convert to json
}));

app.use(express.json()); // the incoming request is an json
app.use(session({
    secret: "this is secret",
    saveUninitialized: true,
    resave: false,
}));
app.use((req, res, next) => {
    res.locals.message = req.session.message,
        delete req.session.message
    next();
})
app.use(express.static("uploads"));
app.use(expressEjsLayouts)
app.set("view engine", "ejs");
app.use("", require("./routes/routes.js"));



app.listen(port, () => {
    console.log(`server is runing on localhost ${port}`)
})