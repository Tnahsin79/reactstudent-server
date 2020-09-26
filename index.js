const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const cors = require("cors");
require('dotenv').config();
//const url="mongodb://localhost:27017";
app.use(bodyParser.json());
app.use(cors({
  origin: "https://reactstudent.netlify.app/"
}));
//origin:"https://mentor-and-student.netlify.app"
//origin:"http://127.0.0.1:5500"

//student data
console.log(process.env.URL);
app.get("/students", async function (req, res) {
  try {
    let client = await mongoClient.connect(process.env.URL);
    let db = client.db("react-student");
    let studentArray = await db.collection("student").find().toArray();
    client.close();
    res.json(studentArray);
  }
  catch (error) {
    client.close();
    console.log(error);
    res.json({
      message: error
    });
  }
});
app.post("/student", async function (req, res) {
  try {
    let client = await mongoClient.connect(process.env.URL);
    let db = client.db("react-student");
    let insertedStudent = await db.collection("student").insertOne({
      first_name: req.body.fname,
      last_name: req.body.lname,
      age: req.body.age,
    });
    console.log(insertedStudent.insertedId);
    client.close();
    res.json({
      message: "Student created",
      id: insertedStudent.insertedId
    });
  }
  catch (error) {
    client.close();
    res.json({
      message: error
    });
  }
});

app.put("/update", async function (req, res) {
  try {
    let sid = req.body.sid;
    let client = await mongoClient.connect(process.env.URL);
    let db = client.db("react-student");

    let student = await db.collection("student")
      .findOne({ _id: mongodb.ObjectID(sid) });

    if (student) {
      await db.collection("student")
        .findOneAndUpdate(
          { _id: mongodb.ObjectID(sid) },
          {
            $set: {
              first_name: req.body.fname,
              last_name: req.body.lname,
              age: req.body.age
            }
          }
        );
      res.json({
        message: "Database updated"
      });
    }
    else {
      res.json({
        message: "No student found"
      });
    }
    client.close();
  }
  catch (error) {
    client.close();
    res.json({
      message: error
    });
  }
});

app.delete("/delete", async function (req, res) {
  try {
    let sid = req.body.delsid;
    let client = await mongoClient.connect(process.env.URL);
    let db = client.db("react-student");

    let student = await db.collection("student")
      .findOne({ _id: mongodb.ObjectID(sid) });

    if (student) {
      await db.collection("student")
        .deleteOne(
          { _id: mongodb.ObjectID(sid) }
        );
      res.json({
        message: "Data deleted"
      });
    }
    else {
      res.json({
        message: "No student found"
      });
    }
    client.close();
  }
  catch (error) {
    client.close();
    res.json({
      message: error
    });
  }
});
const port = process.env.PORT || 3000;
app.listen(port);