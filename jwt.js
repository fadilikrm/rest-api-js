const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// URL MongoDB dan nama basis data
const url = 'mongodb://localhost:27017';
const dbName = 'akademik';
const secretKey = 'node';

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Pastikan ada data username dan password dalam permintaan
    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password diperlukan' });
    }

    if (username === 'admin' && password === '123') {
        const user = { username: 'admin' };

        // Create a token with the user information and send it as a response
        jwt.sign({ user }, secretKey, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                return res.status(500).json({ message: 'Error creating token' });
            }
            res.json({ token });
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Token tidak diberikan' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token tidak valid' });
    }
};

app.get('/mahasiswa', verifyToken, async (req, res) => {
    let client;
    try {
        // Dapatkan _id dari query params
        const { _id } = req.query;

        // Buat koneksi ke server MongoDB
        client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);

        // Koleksi Mahasiswa
        const mahasiswaCollection = db.collection('mhs');

        // Jika _id ada, ambil data Mahasiswa berdasarkan _id
        if (_id) {
            const mahasiswa = await mahasiswaCollection.findOne({ _id: new ObjectId(_id) });

            // Periksa apakah data Mahasiswa ditemukan
            if (mahasiswa) {
                res.json(mahasiswa);
            } else {
                res.status(404).json('Data not found');
            }
        } else {
            // Jika _id tidak ada, ambil seluruh data Mahasiswa
            const mahasiswaList = await mahasiswaCollection.find().toArray();

            // Kirim data Mahasiswa sebagai respons
            res.json(mahasiswaList);
        }
    } catch (err) {
        // Tangani kesalahan
        console.error('Error fetching data from MongoDB:', err);
        res.status(500).json('Internal Server Error');
    } finally {
        // Tutup koneksi ke database
        if (client) {
            client.close();
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
