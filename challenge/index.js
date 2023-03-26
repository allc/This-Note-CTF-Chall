require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");


const route = require("./routes/app");
const { cleanNotes } = require("./data");

const app = express();

app.use("/static", express.static(path.join(__dirname, "static")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: crypto.randomBytes(64).toString("hex"),
    resave: true,
    saveUninitialized: false,
  })
);
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'none';");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
//   res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.set("view engine", "pug");

app.use(route);

app.listen(1337, "0.0.0.0", async () => {
  console.log(`Listening on port 1337`);
});

setInterval(cleanNotes, 60000);
