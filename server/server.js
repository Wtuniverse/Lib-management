const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


//登陆
const usersFilePath = './data/users.json';
const adminsFilePath = './data/admins.json';

// 读取用户或管理员数据
function readData(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

// 写入用户或管理员数据
function writeData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// 用户注册
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username, password: hashedPassword, email };

  const users = readData(usersFilePath);
  const existingUser = users.find(user => user.username === username);
  if (existingUser) return res.status(400).send('User already exists');

  users.push(newUser);
  writeData(usersFilePath, users);
  res.status(201).send('User registered successfully');
});

// 用户登录
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readData(usersFilePath);

  const user = users.find(user => user.username === username);
  if (!user) return res.status(400).send('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Invalid credentials');

  // 返回 user 数据或 token，视需要而定
  res.json({ message: 'Login successful!', username });
});

// 在管理员注册时添加安全码
app.post('/admin/register', async (req, res) => {
  const { username, password, securityCode } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = { username, password: hashedPassword, securityCode };

  const admins = readData(adminsFilePath);
  const existingAdmin = admins.find(admin => admin.username === username);
  if (existingAdmin) return res.status(400).send('Admin already exists');

  admins.push(newAdmin);
  writeData(adminsFilePath, admins);
  res.status(201).send('Admin registered successfully');
});

// 在管理员登录时添加安全码的验证
app.post('/admin/login', async (req, res) => {
  const { username, password, securityCode } = req.body;
  const admins = readData(adminsFilePath);

  const admin = admins.find(admin => admin.username === username);
  if (!admin) return res.status(400).send('Invalid credentials');

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).send('Invalid credentials');

  // 验证安全码，仅在注册时要求
  if (securityCode && admin.securityCode !== securityCode) {
    return res.status(400).send('Invalid security code');
  }

  const token = jwt.sign({ username: admin.username }, 'your_jwt_secret');
  res.json({ message: 'Login successful!', token });
});










//书的管理
const booksFilePath = path.join(__dirname, '/data/books.json');

// 读取图书数据
const readBooksData = () => {
    if (fs.existsSync(booksFilePath)) {
        const data = fs.readFileSync(booksFilePath);
        return JSON.parse(data);
    }
    return [];
};

// 写入图书数据
const writeBooksData = (data) => {
    fs.writeFileSync(booksFilePath, JSON.stringify(data, null, 2));
};

// 获取图书列表
app.get('/api/books', (req, res) => {
    const books = readBooksData();
    res.json(books);
});

// 添加新的图书
app.post('/api/books', (req, res) => {
    const newBook = {...req.body, bookId: Date.now() }; // 使用当前时间戳作为 bookId
    const books = readBooksData();
    books.push(newBook);
    writeBooksData(books);
    res.status(201).json(newBook);
});

// 编辑图书
app.put('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const books = readBooksData();
    const index = books.findIndex(book => book.bookId === parseInt(id));

    if (index !== -1) {
        books[index] = { ...books[index], ...req.body };
        writeBooksData(books);
        res.json(books[index]);
    } else {
        res.status(404).send('Book not found');
    }
});

// 删除图书
app.delete('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const books = readBooksData();
    const index = books.findIndex(book => book.bookId === parseInt(id));

    if (index !== -1) {
        const deletedBook = books.splice(index, 1);
        writeBooksData(books);
        res.json(deletedBook[0]);
    } else {
        res.status(404).send('Book not found');
    }
});





// 启动服务器
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
