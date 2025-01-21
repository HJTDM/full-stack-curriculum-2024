// Importing required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require('firebase-admin');

// Creating an instance of Express
const app = express();

// Loading environment variables from a .env file into process.env
require("dotenv").config();

// Importing the Firestore database instance from firebase.js
const db = require("./firebase");

const corsOptions = {
  origin: 'https://full-stack-curriculum-2024-rwql.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middlewares to handle cross-origin requests and to parse the body of incoming requests to JSON
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Authentication Middleware
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token

  if (!token) {
    return res.status(401).json({ msg: "Token was not found in header" });
  }

  try {
    console.log('Received token:', token); // Log the token for debugging
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Your API routes will go here...

app.get("/", (req, res) => {
	console.log("Hello to the server!")
	res.send("Hello to the client!")
})

// GET: Endpoint to retrieve all tasks
app.get("/tasks", async (req, res) => {
  try {
    // Fetching all documents from the "tasks" collection in Firestore
    const snapshot = await db.collection("tasks").get();
    
    let tasks = [];
    // Looping through each document and collecting data
    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,  // Document ID from Firestore
        ...doc.data(),  // Document data
      });
    });
    
    // Sending a successful response with the tasks data
    res.status(200).send(tasks);
  } catch (error) {
    // Sending an error response in case of an exception
    res.status(500).send(error.message);
  }
});

// GET: Endpoint to retrieve all tasks for a user
app.get("/user-tasks", auth, async (req, res) => {
  try {
    // Fetching all documents from the "tasks" collection in Firestore
    const snapshot = await db.collection("tasks").where("user", "==", req.user.uid).get()
    
    if (snapshot.empty) {
      return res.status(404).send('No tasks found for this user');
    }
    
    let tasks = [];
    // Looping through each document and collecting data
    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,  // Document ID from Firestore
        ...doc.data(),  // Document data
      });
    });
    
    // Sending a successful response with the tasks data
    res.status(200).send(tasks);
  } catch (error) {
    // Sending an error response in case of an exception
    res.status(500).send(error.message);
  }
});

// POST: Endpoint to add a new task
app.post("/tasks", auth, async (req, res) => {
  try{
    const newTask = {
      finished: false,
      name: req.body.name,
      user: req.user.uid
    };

    const addedTask = await db.collection("tasks").add(newTask);
    res.status(201).send({
      id: addedTask.id,
      ...newTask,
    });
  }
  catch(error){
    res.status(500).send(error.message);
  }
});

// DELETE: Endpoint to remove a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const taskRef = db.collection("tasks").doc(req.params.id)
    const task = await taskRef.get()

    if (!task.exists) {
      return res.status(404).send('Task not found');
    }

    await taskRef.delete();
    res.status(200).json({ msg: `Task with ID ${req.params.id} deleted successfully` });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Setting the port for the server to listen on
const PORT = process.env.PORT || 3001;
// Starting the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});