const express = require('express');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 5000;

// URL MongoDB dan nama basis data
const url = 'mongodb://localhost:27017';
const dbName = 'akademik';

// Atur direktori tempat file HTML Anda disimpan
const publicDirectoryPath = path.join(__dirname, 'public');

// Gunakan middleware untuk menyajikan file statis (HTML, CSS, JavaScript)
app.use(express.static(publicDirectoryPath));

// Rute untuk menampilkan file HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(publicDirectoryPath, 'home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(publicDirectoryPath, 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(publicDirectoryPath, 'dashboard.html'));
});

app.get('/mahasiswa', async (req, res) => {
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

// Jalankan server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
