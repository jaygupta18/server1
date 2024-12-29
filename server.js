const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Initialize Express App
const app = express();
app.use(bodyParser.json());
app.use(cors());
const URL='mongodb+srv://Jaygupta:Jaygupta@ecom.i8wuogo.mongodb.net/?retryWrites=true&w=majority&appName=ECOM'
// Connect to MongoDB
mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

  const itemSchema = new mongoose.Schema({
    name: String,
    count: { type: Number, default: 0 },
  });
    
  const Item = mongoose.model("Item", itemSchema);
 
  app.get("/items", async (req, res) => {
    try {
      const items = await Item.find({});
      res.status(200).json(items);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  app.post("/add", async (req, res) => {
    try {
      const { name } = req.body;
      const item = await Item.findOneAndUpdate(
        { name },
        { $inc: { count: 1 } },
        { new: true }
      );
      if (item) {
        console.log("hello");
        res.status(200).json({ count: item.count }); // Return a successful status
      } 
    } catch (error) {
      
      res.status(500).json({ error: error.message }); // Internal server error
    }
  });
  
  app.post("/remove", async (req, res) => {
    try {
      const { name } = req.body;
      const item = await Item.findOne({ name });
      if (item.count > 0) {
        const updatedItem = await Item.findOneAndUpdate({ name }, { $inc: { count: -1 } }, { new: true });
        res.status(200).json(updatedItem);
      } else {
        console.log("Count cannot go below 0");
      }
    } catch (err) {
      console.log('helloar remove')
      res.status(500).send(err.message);
    }
  });
  
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));