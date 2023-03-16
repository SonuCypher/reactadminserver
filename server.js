const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "JWTSECRET";

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/api", (req, res) => {
  res.json({ users: ["user1", "user2", "user31"] });
});

app.get("/signup", async (req, res) => {
  try {
    // const { name,role}= req.body
    const allTodo = await pool.query(`SELECT * FROM users`);

    res.json(allTodo.rows);
    console.log(allTodo.rows);
  } catch (err) {
    console.error(err.message);
  }
});
app.post("/signup", async (req, res) => {
  // const client = await pool.connect()
  try {
    const { username, password, email } = req.body;
    const newUser = await pool.query(
      "INSERT INTO users (name,role,password,email) VALUES ($1,$2,$3,$4) RETURNING *",
      [`${username}`, "client", `${password}`, `${email}`]
    ); 
    const token = jwt.sign(
      { username: newUser.rows[0].name, id: newUser.rows[0].user_id },
      SECRET_KEY
    );
    // res.cookie("jwt",token,{httpOnly:true})

    res.json({...newUser.rows[0],token:token});
    console.log(newUser.rows[0]);
  } catch (err) {
    console.error(err.stack);
  }
});
app.post("/login", async (req, res) => {
  // const client = await pool.connect()
  try {
    const { username, password } = req.body;
    const validuser = await pool.query("SELECT * FROM users WHERE name=$1", [
      `${username}`,
    ]); //    await client.query(`INSERT INTO users (name,role,password) VALUES ('${username}','client','${password}')`)
    console.log(validuser.rows[0]);
    if (validuser.rows[0]) {
      if (validuser.rows[0].password === password) {
        const token = jwt.sign(
            validuser.rows[0],
            SECRET_KEY
          );
          //  res.cookie("jwt",token)
            console.log(token)
        res.json({...validuser.rows[0],token:token});
        console.log({...validuser.rows[0],token:token});
      }
      return res.json(false);
    } else {
      return res.json(false);
    }
  } catch (err) {
    console.error(err.stack);
  }
});

app.post("/logout", (req, res) => {
    res.clearCookie("jwt")
  res.json(false);
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
