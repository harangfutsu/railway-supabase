const express = require('express');
const path = require('path');
const cors = require('cors'); // ✅ tambahkan ini
const app = express();

const routes = require('./routes');
const config = require('./config');

// ✅ Tambahkan middleware cors sebelum routes
app.use(cors({
  origin: "http://localhost:5173", // alamat frontend kamu
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Izinkan folder uploads diakses publik
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Gunakan routes utama
app.use('/', routes);

app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
});
