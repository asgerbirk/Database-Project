import express from 'express';
import bodyParser from 'body-parser';
import { mongodbConnect } from '../mongoConnection.js';
import { ObjectId } from 'mongodb';

const app = express();
app.use(bodyParser.json());

const db = await mongodbConnect();

const usersCollection = db.collection('users');

app.get('/users', async (req, res) => {
  try {
    const users = await usersCollection.find().toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Error fetching users");
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).send("Error fetching user");
  }
});

app.post('/users', async (req, res) => {
  try {
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send("Error creating user");
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send("User updated successfully");
    }
  } catch (error) {
    res.status(500).send("Error updating user");
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const result = await usersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send("User deleted successfully");
    }
  } catch (error) {
    res.status(500).send("Error deleting user");
  }
});
