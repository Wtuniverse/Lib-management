const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const usersFilePath = './users.json';

// 读取用户数据
function readUserData() {
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(usersFilePath);
  return JSON.parse(data);
}

// 写入用户数据
function writeUserData(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// 注册用户
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  // 每个新用户的初始 isadmin 属性设置为 false
  const newUser = { username, password: hashedPassword, email, isadmin: false };

  const users = readUserData();
  const existingUser = users.find(user => user.username === username);
  if (existingUser) return res.status(400).send('User already exists');

  users.push(newUser);
  writeUserData(users);
  res.status(201).send('User registered successfully');
});

// 登录用户
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readUserData();
  const user = users.find(user => user.username === username);

  if (!user) return res.status(400).send('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Invalid credentials');

  // 返回 token，并包含 isadmin 信息
  const token = jwt.sign({ id: user.username, isadmin: user.isadmin }, 'your_jwt_secret');
  res.json({ token });
});

// 启动服务器
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
