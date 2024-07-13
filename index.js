const { faker } = require('@faker-js/faker');
const mysql      = require('mysql2');
const express = require('express');
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const exp = require('constants');

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname, "/views"));


const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'rj02lb0854',
    database : 'amitdb'
});

let createRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

//home route
app.get("/",(req, res) => {
  let q = `SELECT count(*) FROM user`;
  try{
      connection.query(q,(err, result) => {
        if(err) throw err;
        let count = result[0]['count(*)'];
        res.render("home.ejs" , {count});
      });
    } catch(err) {
        console.log(err);
        res.send("some err in db");
    }
});

//show route

app.get("/user",(req, res) =>{
  let q = `select * from user`;
  try{
    connection.query(q,(err, result) => {
      if(err) throw err;
      res.render("users.ejs",{result});
    });
  } catch(err) {
      console.log(err);
      res.send("some err in db");
  }
})

//edit route

app.get("/user/:id/edit",(req, res) =>{
  let {id} = req.params;
  let q = `select * from user WHERE id='${id}'`;
  try{
    connection.query(q,(err, result) => {
      if(err) throw err;
      let user=result[0];
      res.render("edit.ejs",{user});
    });
  } catch(err) {
      console.log(err);
      res.send("some err in db");
  }
});

//UPDATE ROUTE

app.patch("/user/:id",(req, res) =>{
  let {id} = req.params;
  let {password: formPass, username: newusername} = req.body;
  let q = `select * from user WHERE id='${id}'`;
  try{
    connection.query(q,(err, result) => {
      if(err) throw err;
      let user=result[0];
      if(formPass != user.password){
        res.send("wrong password ")
      }else{
        let q2 = `UPDATE user SET username = '${newusername}' WHERE id='${id}'`;
        try{
          connection.query(q2,(err, result) => {
            if(err) throw err;
            res.send(result);
          });
        } catch(err) {
            console.log(err);
            res.send("some err in db");
        }
      }
    });
  } catch(err) {
      console.log(err);
      res.send("some err in db");
  }
});

//newuser

app.get("/user/newuser",(req, res) =>{
  res.render("newuser.ejs");
});

app.post("/newuser",(req, res) => {
  let {username, id, email, password} = req.body;
  let q= "INSERT INTO user (id, username,email, password) VALUES (?, ?, ?, ?)";
  let data = [username, id ,email, password];
  try{
    connection.query(q,data,(err, result) => {
      if(err) throw err;
      res.send("sucessfully login");
    });
  } catch(err) {
      console.log(err);
      res.send("some err in db");
  }
  
});
app.get("/user/:id/delete", (req, res) => {
  let {id} = req.params;
  let q = `delete from user WHERE id='${id}'`;
  try{
    connection.query(q,(err, result) => {
      if(err) throw err;
      res.send("sucessfully login");
    });
  } catch(err) {
      console.log(err);
      res.send("some err in db");
  }
})

app.listen("8080", () => {
  console.log("server is listning");

});

// try{
//     connection.query(q, [data],(err, result) => {
//         if(err) throw err;
//         console.log(result);
//         console.log(result[0]);
//         console.log(result[1]);
//     });
// } catch(err) {
//     console.log(err);
// }

// connection.end();

// let q= "INSERT INTO user (id, username,email, password) VALUES ?";

// let data = [];
// for(let i =1;i<=100; i++){
//   data.push(createRandomUser());
// }



