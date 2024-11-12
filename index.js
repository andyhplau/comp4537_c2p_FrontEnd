require("dotenv").config();
const express = require("express");
const session = require("express-session");

const app = express();
const port = 3000;
const node_session_secret = process.env.NODE_SESSION_SECRET;
const path = require("path");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const cookieParser = require("cookie-parser");

app.use("/views", express.static(path.join(__dirname, "views")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const bcrypt = require("bcrypt");

// ███████╗ ███████╗ ███████╗ ███████╗ ██╗  ██████╗  ███╗   ██╗ ███████╗
// ██╔════╝ ██╔════╝ ██╔════╝ ██╔════╝ ██║ ██╔═══██╗ ████╗  ██║ ██╔════╝
// ███████╗ █████╗   ███████╗ ███████╗ ██║ ██║   ██║ ██╔██╗ ██║ ███████╗
// ╚════██║ ██╔══╝   ╚════██║ ╚════██║ ██║ ██║   ██║ ██║╚██╗██║ ╚════██║
// ███████║ ███████╗ ███████║ ███████║ ██║ ╚██████╔╝ ██║ ╚████║ ███████║

app.use(
  session({
    secret: node_session_secret,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false, // @TODO: set to true if using https
      maxAge: 60 * 60 * 1000,
    },
  })
);

/**
 * Helper: sets current session identifer level
 *
 * @param {string} identifer
 */
function setAuthLevel(identifer, req) {
  if (identifer === process.env.ADMIN_IDENTIFIER) {
    req.session.userLevel = "admin";
  } else if (identifer === process.env.USER_IDENTIFIER) {
    req.session.userLevel = "user";
  }
}

/**
 * Middleware: checks if user level is admin
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
function checkAdmin(req, res, next) {
  if (req.session.userLevel === "admin") {
    return next();
  } else {
    return res.redirect("/401");
  }
}

// ██╗  ██╗  ██████╗  ███╗   ███╗ ███████╗         ██╗
// ██║  ██║ ██╔═══██╗ ████╗ ████║ ██╔════╝        ██╔╝
// ███████║ ██║   ██║ ██╔████╔██║ █████╗         ██╔╝
// ██╔══██║ ██║   ██║ ██║╚██╔╝██║ ██╔══╝        ██╔╝
// ██║  ██║ ╚██████╔╝ ██║ ╚═╝ ██║ ███████╗     ██╔╝
// ╚═╝  ╚═╝  ╚═════╝  ╚═╝     ╚═╝ ╚══════╝     ╚═╝

app.get("/home", (req, res) => {
  if (!req.session.authToken || !req.session.userLevel) {
    return res.redirect("/login"); // If no valid session, redirect to login
  }
  console.log("current session level:", req.session.userLevel);
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/", (req, res) => {
  if (req.session.authToken) {
    return res.redirect("/home");
  }
  res.redirect("/login");
});

//   ██████╗  ███████╗  ██████╗  ██╗ ███████╗ ████████╗ ███████╗ ██████╗
//   ██╔══██╗ ██╔════╝ ██╔════╝  ██║ ██╔════╝ ╚══██╔══╝ ██╔════╝ ██╔══██╗
//   ██████╔╝ █████╗   ██║  ███╗ ██║ ███████╗    ██║    █████╗   ██████╔╝
//   ██╔══██╗ ██╔══╝   ██║   ██║ ██║ ╚════██║    ██║    ██╔══╝   ██╔══██╗
//   ██║  ██║ ███████╗ ╚██████╔╝ ██║ ███████║    ██║    ███████╗ ██║  ██║
//   ╚═╝  ╚═╝ ╚══════╝  ╚═════╝  ╚═╝ ╚══════╝    ╚═╝    ╚══════╝ ╚═╝  ╚═╝

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

app.post("/register", async (req, res) => {
  // TODO
});

// ██╗       ██████╗   ██████╗  ██╗ ███╗   ██╗
// ██║      ██╔═══██╗ ██╔════╝  ██║ ████╗  ██║
// ██║      ██║   ██║ ██║  ███╗ ██║ ██╔██╗ ██║
// ██║      ██║   ██║ ██║   ██║ ██║ ██║╚██╗██║
// ███████╗ ╚██████╔╝ ╚██████╔╝ ██║ ██║ ╚████║
// ╚══════╝  ╚═════╝   ╚═════╝  ╚═╝ ╚═╝  ╚═══╝

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("email:", email);
  console.log("password:", password);
  if (!email || !password) {
    return res
      .status(400)
      .send({ error: "Both email and password are required." });
  }

  try {
    const response = await axios.post(
      // "https://comp4537-c2p-api-server-1.onrender.com/api/v1/user/login/",
      "http://127.0.0.1:8000/api/v1/user/login/",
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { success, message, userId, jwtToken, identifier } = response.data;

    if (success) {
      console.log("is success:", success);
      console.log("Login successful:", message);
      req.session.authToken = jwtToken;
      req.session.userId = userId;
      setAuthLevel(identifier, req);
      console.log("current session level:", req.session.userLevel);
      console.log("Redirecting...");
      if (req.session.userLevel === "admin") {
        return res.redirect("/admin");
      } else if (req.session.userLevel === "user") {
        return res.redirect("/home");
      } else {
        return res.status(401).send({ error: "Invalid user level." });
      }
    } else {
      return res.status(401).send({ error: "Invalid email or password." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .send({ error: "Something went wrong. Please try again." });
  }
});

//  █████╗  ██╗     ███████╗ ███╗   ██╗ ██████╗  ██████╗   ██████╗  ██╗ ███╗   ██╗ ████████╗ ███████╗
// ██╔══██╗ ██║     ██╔════╝ ████╗  ██║ ██╔══██╗ ██╔══██╗ ██╔═══██╗ ██║ ████╗  ██║ ╚══██╔══╝ ██╔════╝
// ███████║ ██║     █████╗   ██╔██╗ ██║ ██║  ██║ ██████╔╝ ██║   ██║ ██║ ██╔██╗ ██║    ██║    ███████╗
// ██╔══██║ ██║     ██╔══╝   ██║╚██╗██║ ██║  ██║ ██╔═══╝  ██║   ██║ ██║ ██║╚██╗██║    ██║    ╚════██║
// ██║  ██║ ██║     ███████╗ ██║ ╚████║ ██████╔╝ ██║      ╚██████╔╝ ██║ ██║ ╚████║    ██║    ███████║
// ╚═╝  ╚═╝ ╚═╝     ╚══════╝ ╚═╝  ╚═══╝ ╚═════╝  ╚═╝       ╚═════╝  ╚═╝ ╚═╝  ╚═══╝    ╚═╝    ╚══════╝

app.get("/ai", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "ai.html"));
});

app.post("/createPage", async (req, res) => {
  const { name } = req.body;

  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/api/v1/bot/${req.session.userId}/page/`,
      {
        name,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${req.session.authToken}`,
        },
      }
    );

    return res.redirect("/ai");
  } catch (error) {
    console.error("Error during fetch:", error.response.data.error);
    return res.status(500).send({ error: error.response.data.error });
  }
});

// ██████╗  ██████╗   ██████╗  ████████╗ ███████╗  ██████╗ ████████╗ ███████╗ ██████╗
// ██╔══██╗ ██╔══██╗ ██╔═══██╗ ╚══██╔══╝ ██╔════╝ ██╔════╝ ╚══██╔══╝ ██╔════╝ ██╔══██╗
// ██████╔╝ ██████╔╝ ██║   ██║    ██║    █████╗   ██║         ██║    █████╗   ██║  ██║
// ██╔═══╝  ██╔══██╗ ██║   ██║    ██║    ██╔══╝   ██║         ██║    ██╔══╝   ██║  ██║
// ██║      ██║  ██║ ╚██████╔╝    ██║    ███████╗ ╚██████╗    ██║    ███████╗ ██████╔╝
// ╚═╝      ╚═╝  ╚═╝  ╚═════╝     ╚═╝    ╚══════╝  ╚═════╝    ╚═╝    ╚══════╝ ╚═════╝

app.get("/admin", checkAdmin, (req, res) => {
  console.log("current session level:", req.session.userLevel);
  res.sendFile(path.join(__dirname, "views", "admin.html"));
});

app.get("/getAllUsersStats", checkAdmin, async (req, res) => {
  try {
    const response = await axios.get(
      // "https://comp4537-c2p-api-server-1.onrender.com/api/v1/user/userStats/",
      "http://127.0.0.1:8000/api/v1/user/userStats/",
      {
        headers: {
          Authorization: `Bearer ${req.session.authToken}`,
        },
      }
    );
    const data = response.data;

    res.send(data);
  } catch (error) {
    console.error("Error during fetch:", error);
    return res
      .status(500)
      .send({ error: "Something went wrong. Please try again." });
  }
});

app.get("/user", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "user.html"));
});

app.get("/getUserStats", async (req, res) => {
  try {
    const response = await axios.get(
      // "https://comp4537-c2p-api-server-1.onrender.com/api/v1/user/stats/:id",
      `http://127.0.0.1:8000/api/v1/user/stats/${req.session.userId}/`,
      {
        headers: {
          Authorization: `Bearer ${req.session.authToken}`,
        },
      }
    );
    const data = response.data;
    console.log("data:", data);
    res.send(data);
  } catch (error) {
    console.error("Error during fetch:", error);
    return res
      .status(500)
      .send({ error: "Something went wrong. Please try again." });
  }
});

// ██╗       ██████╗   ██████╗   ██████╗  ██╗   ██╗ ████████╗
// ██║      ██╔═══██╗ ██╔════╝  ██╔═══██╗ ██║   ██║ ╚══██╔══╝
// ██║      ██║   ██║ ██║  ███╗ ██║   ██║ ██║   ██║    ██║
// ██║      ██║   ██║ ██║   ██║ ██║   ██║ ██║   ██║    ██║
// ███████╗ ╚██████╔╝ ╚██████╔╝ ╚██████╔╝ ╚██████╔╝    ██║
// ╚══════╝  ╚═════╝   ╚═════╝   ╚═════╝   ╚═════╝     ╚═╝

app.post("/logout", (req, res) => {
  console.log("Logging out...");
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out, try again later.");
    }
    res.redirect("/login"); // Redirect to login page after successful logout
  });
});

// 401 page
app.get("/401", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "401.html"));
});

// // Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
