const express = require("express");
const hbs = require("hbs");
const fs = require("fs");

const port = process.env.PORT || 3000;
var app = express();

//set up to allow us to use partials for templating
//use for reusable pieces
hbs.registerPartials(__dirname + "/views/partials");

//can set configurations
//set key, value pairs
app.set("view engine", "hbs");

//use function takes three arguments: request, response, next
//next tells express when middleware function is done
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile("server.log", log + "\n", err => {
    if (err) {
      console.log("Unable to append to server.log");
    }
  });
  next();
});

//app.use are applied in the order they are in the file
// app.use((req, res, next) => {
//   res.render("maintenance.hbs");
// });

//apply middleware using app.use - takes a function
//static takes absolute path to folder to serve up
//__dirname is variable that stores path to project's directory
app.use(express.static(__dirname + "/public"));

//registerHelper takes two arguments: helper and function that returns what we want to render
hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear();
});

//helpers can take arguments
hbs.registerHelper("screamIt", text => text.toUpperCase());

//app.get sets up routes
//take two arguments: url and function
//function takes two arguments: request and response
app.get("/", (req, res) => {
  //can send html or json in response
  // res.send("<h1>Hello Express!</h1>");
  // res.send({
  //   name: "Jennifer",
  //   likes: ["chocolate", "yoga"]
  // });
  res.render("home.hbs", {
    pageTitle: "Home Page",
    welcomeMessage: "Welcome!"
  });
});

app.get("/about", (req, res) => {
  //render takes one argument - page to render
  //second argument is object with data for page
  res.render("about.hbs", {
    pageTitle: "About Page"
  });
});

app.get("/bad", (req, res) => {
  res.send({
    errorMessage: "Unable to fulfill this request"
  });
});

//binds application to localhost
//second optional argument - function
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
