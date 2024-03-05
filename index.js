const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 4000;

const url = 'mongodb://localhost:27017';
const dbName = 'lms_db';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let client;

(async function() {
  try {
    client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

    const db = client.db(dbName);

    app.get('/admin', async (req, res) => {
      try {
        const adminCollection = db.collection('admin');
        const admins = await adminCollection.find().toArray();
        res.json(admins);
      } catch (err) {
        console.error('Error fetching admins:', err);
        res.status(500).json('Internal Server Error');
      }
    });

    app.post('/admin', async (req, res) => {
      try {
        const adminCollection = db.collection('admin');
        const { id_admin, name, email, password } = req.body;
        const result = await adminCollection.insertOne({ id_admin, name, email, password });
        res.status(201).json('Admin successfully added');
      } catch (err) {
        console.error('Error adding admin:', err);
        res.status(500).json('Internal Server Error');
      }
    });

    app.put('/admin/:id', async (req, res) => {
      try {
        const adminCollection = db.collection('admin');
        const { id_admin, name, email, password } = req.body;
        const result = await adminCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: { id_admin, name, email, password } }
        );
        res.json('Admin successfully updated');
      } catch (err) {
        console.error('Error updating admin:', err);
        res.status(500).json('Internal Server Error');
      }
    });

    app.delete('/admin/:id', async (req, res) => {
      try {
        const adminCollection = db.collection('admin');
        const result = await adminCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json('Admin successfully deleted');
      } catch (err) {
        console.error('Error deleting admin:', err);
        res.status(500).json('Internal Server Error');
      }
    });

    app.get('/trainer', async (req, res) => {
      try {
        const trainerCollection = db.collection('trainer');
        const trainers = await trainerCollection.find().toArray();
        res.json(trainers);
      } catch (err) {
        console.error('Error fetching trainers:', err);
        res.status(500).json('Internal Server Error');
      }
    });

    app.post('/trainer', async (req, res) => {
      try {
        const trainerCollection = db.collection('trainer');
        const { id_trainer, name, email, password } = req.body;
        const result = await trainerCollection.insertOne({ id_trainer, name, email, password });
        res.status(201).json('Trainer successfully added');
      } catch (err) {
        console.error('Error adding trainer:', err);
        res.status(500).json('Internal Server Error');
      }
    });

    app.put('/trainer/:id', async (req, res) => {
      try {
        const trainerCollection = db.collection('trainer');
        const { id_trainer, name, email, password } = req.body;
        const result = await trainerCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: { id_trainer, name, email, password } }
        );
        res.json('Trainer successfully updated');
      } catch (err) {
        console.error('Error updating trainer:', err);
        res.status(500).json('Internal Server Error');
      }
    });

    app.delete('/trainer/:id', async (req, res) => {
      try {
        const trainerCollection = db.collection('trainer');
        const result = await trainerCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json('Trainer successfully deleted');
      } catch (err) {
        console.error('Error deleting trainer:', err);
        res.status(500).json('Internal Server Error');
      }
    });

    app.get('/trainee', async (req, res) => {
      try {
        const traineeCollection = db.collection('trainee');
        const trainees = await traineeCollection.find().toArray();
        res.json(trainees);
      } catch (err) {
        console.error('Error fetching trainees:', err);
        res.status(500).json('Internal Server Error');
      }
    });

    app.post('/trainee', async (req, res) => {
      try {
        const traineeCollection = db.collection('trainee');
        const { id_trainee, name, email, password } = req.body;
        const result = await traineeCollection.insertOne({ id_trainee, name, email, password });
        res.status(201).json('Trainee successfully added');
      } catch (err) {
        console.error('Error adding trainee:', err);
        res.status(500).json('Internal Server Error');
      }
    });

    app.put('/trainee/:id', async (req, res) => {
      try {
        const traineeCollection = db.collection('trainee');
        const { id_trainee, name, email, password } = req.body;
        const result = await traineeCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: { id_trainee, name, email, password } }
        );
        res.json('Trainee successfully updated');
      } catch (err) {
        console.error('Error updating trainee:', err);
        res.status(500).json('Internal Server Error');
      }
    });

    app.delete('/trainee/:id', async (req, res) => {
      try {
        const traineeCollection = db.collection('trainee');
        const result = await traineeCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json('Trainee successfully deleted');
      } catch (err) {
        console.error('Error deleting trainee:', err);
        res.status(500).json('Internal Server Error');
      }
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
})();

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});
