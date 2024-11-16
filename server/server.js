const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 用户模型
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model('User', UserSchema);

// 注册用户
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, email });
  await newUser.save();
  res.status(201).send('User registered successfully');
});

// 登录用户
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
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
