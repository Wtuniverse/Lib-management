const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://2496971295:Hu200310@clustere.shfrw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('Lib');
    const usersCollection = database.collection('users');

    // 注册用户
    app.post('/register', async (req, res) => {
      const { username, password, email } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { username, password: hashedPassword, email };
      await usersCollection.insertOne(newUser);
      res.status(201).send('User registered successfully');
    });

    // 登录用户
    app.post('/login', async (req, res) => {
      const { username, password } = req.body;
      const user = await usersCollection.findOne({ username });
      if (!user) return res.status(400).send('Invalid credentials');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).send('Invalid credentials');

      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, 'your_jwt_secret');
      res.json({ token, isAdmin: user.isAdmin });
    });

    // 启动服务器
    app.listen(5000, () => {
      console.log('Server is running on http://localhost:5000');
    });
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.error);
