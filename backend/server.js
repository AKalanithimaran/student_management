const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const { initSocket } = require('./socket/socket');

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ status: 'Students API running' });
});

app.use('/api/students', studentRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  initSocket(server);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
