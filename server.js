const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const URL='mongodb+srv://Jaygupta:Jaygupta@ecom.i8wuogo.mongodb.net/?retryWrites=true&w=majority&appName=ECOM';
app.use(express.json());
app.use(cors());


mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, },
});

const Item = mongoose.model('Item', itemSchema);

// Routes
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).send('Error fetching items');
  }
});

app.post('/api/add', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).send('Item added');
  } catch (error) {
    res.status(500).send('Error adding item');
  }
});

app.delete('/api/remove/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.send('Item deleted');
  } catch (error) {
    res.status(500).send('Error deleting item');
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));