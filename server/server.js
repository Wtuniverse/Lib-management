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
const BOOKS_FILE = path.join(__dirname, 'data', 'books.json');

// 读取书籍数据
function readBooks() {
  try {
    const data = fs.readFileSync(BOOKS_FILE);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading books file:', error);
    return [];
  }
}

// 写入书籍数据
function writeBooks(books) {
  try {
    fs.writeFileSync(BOOKS_FILE, JSON.stringify(books, null, 2));
  } catch (error) {
    console.error('Error writing to books file:', error);
  }
}

// 获取所有书籍
app.get('/api/books', (req, res) => {
  const books = readBooks();
  res.json(books);
});

// 更新书籍
app.put('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const updatedBook = req.body;
  let books = readBooks();
  const index = books.findIndex(book => book.bookId === bookId);

  if (index !== -1) {
    books[index] = { bookId, ...updatedBook };
    writeBooks(books);
    res.status(200).json(books[index]);
  } else {
    res.status(404).send('Book not found');
  }
});

// 删除书籍
app.delete('/api/books/:id', async (req, res) => {
  const bookId = parseInt(req.params.id);

  try {
    let books = await readBooks();
    const index = books.findIndex(book => book.bookId === bookId);

    if (index === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // 使用 splice 方法删除找到的书籍
    books.splice(index, 1);

    // 写入更新后的数据
    await writeBooks(books);

    res.status(200).json({ message: `Book with ID ${bookId} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// 启动服务器
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
