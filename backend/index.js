const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors middleware
const path = require('path');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

//mongodb+srv://devshreyamishra:UMPNBEzQr2ejsHuX@backend.ig4rf0f.mongodb.net/?retryWrites=true&w=majority
//mongodb+srv://devrishabhmishra:86dmh46YLaHFtNgu@cluster0.71hcr4x.mongodb.net/?retryWrites=true&w=majority
// Connect to MongoDB
mongoose.connect('mongodb+srv://devshreyamishra:UMPNBEzQr2ejsHuX@backend.ig4rf0f.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(() => {
  console.log("Couldn't connect to MongoDB");
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
