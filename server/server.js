const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const pdfRoutes = require('./routes/pdfRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo error:', err));

app.use('/', pdfRoutes);
app.get('/',(req,res)=>{
  res.json('Hello from server!');
}
)

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
