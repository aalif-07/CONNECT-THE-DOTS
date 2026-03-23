const express = require('express');
const mongoose = require('mongoose');
const Minio = require('minio');
const multer = require('multer');

const app = express();
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI);

// MinIO client
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

// Metadata schema
const Metadata = mongoose.model('Metadata', new mongoose.Schema({
  title: String,
  description: String,
  filePath: String,
}));

const upload = multer({ storage: multer.memoryStorage() });

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Metadata
app.post('/metadata', async (req, res) => {
  const doc = await Metadata.create(req.body);
  res.json(doc);
});

app.get('/metadata', async (req, res) => {
  const docs = await Metadata.find();
  res.json(docs);
});

// File upload
app.post('/upload-file', upload.single('file'), async (req, res) => {
  const { originalname, buffer, mimetype } = req.file;
  await minioClient.putObject(process.env.MINIO_BUCKET, originalname, buffer, { 'Content-Type': mimetype });
  res.json({ filePath: `/storage/${process.env.MINIO_BUCKET}/${originalname}` });
});

// File retrieval
app.get('/get-file', async (req, res) => {
  const stream = await minioClient.getObject(process.env.MINIO_BUCKET, req.query.name);
  stream.pipe(res);
});

app.listen(3000, () => console.log('Backend running on :3000'));