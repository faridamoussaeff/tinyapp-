//All the requirements
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const PORT = 8080; // default port 8080

//Listen port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//This tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//Cookies
app.use(cookieParser());

//The Database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// The Functions: 
// Implement a function that returns a string of 6 random alphanumeric characters.
function generateRandomString() {
  let text = '';
   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   for (let i = 0; i < 6; i++)
     text += possible.charAt(Math.floor(Math.random() * possible.length));
   return text;
}

//Set up GET requests:

app.get("/", (req, res) => {
  const templateVars = {
    urls: urlDatabase, 
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase, 
    username: req.cookies["username"],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username:req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL; 
  const templateVars = {
    shortURL, 
    longURL: urlDatabase[shortURL],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
      
//Set up POST requests:  
app.post("/urls", (req, res) => {
  const shortString = generateRandomString();
  urlDatabase[shortString] = req.body.longURL;
  res.redirect(`/urls/${shortString}`);
});
      
app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id; 
  const longURL = req.body.newURL;
  urlDatabase[shortURL] = longURL;
  res.redirect('/urls');
}); 
      
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});
      
//Set up endpoint to handle POST to login: 
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
}); 

app.post("/logout", (req, res) => {
  res.clearCookie('username', req.body.username);
  res.redirect('urls');
});
  