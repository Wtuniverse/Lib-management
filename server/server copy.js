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
const SECRET_KEY = '12345678';

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

// 中间件：验证 JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
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

  const token = jwt.sign({ username: user.username, role: 'user' }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ message: 'Login successful!', token });
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


// 管理员登录
app.post('/admin/login', async (req, res) => {
  const { username, password, securityCode } = req.body;
  const admins = readData(adminsFilePath);
  const admin = admins.find(admin => admin.username === username);
  if (!admin) return res.status(400).send('Invalid credentials');

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).send('Invalid credentials');

  if (securityCode && admin.securityCode !== securityCode) {
    return res.status(400).send('Invalid security code');
  }

  const token = jwt.sign({ username: admin.username, role: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ message: 'Login successful!', token });
});

// 获取当前用户
app.get('/api/user/current_user', authenticateToken, (req, res) => {
  if (req.user.role === 'user') {
    res.json({ username: req.user.username });
  } else {
    res.status(403).send('Access denied');
  }
});

// 获取当前管理员
app.get('/api/admin/current_user', authenticateToken, (req, res) => {
  if (req.user.role === 'admin') {
    res.json({ username: req.user.username });
  } else {
    res.status(403).send('Access denied');
  }
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

// 读取lend_list.json文件的内容
function readLendList() {
  try {
    // 确保路径正确指向你的 lend_list.json 文件
    const data = fs.readFileSync(path.join(__dirname, 'data', 'lend_list.json'));
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading lend_list.json file:', error);
    return [];
  }
}

// 路由：获取lend_list.json文件的内容
app.get('/api/lend_list', (req, res) => {
  console.log('Fetching lend list...');
  const lendList = readLendList();
  console.log('Lend list:', lendList); // 打印借阅列表到控制台
  res.json(lendList);
});


// 确保所有数据文件存在并初始化
function ensureDataFilesExist() {
  const files = [usersFilePath, adminsFilePath, path.join(__dirname, 'data', 'books.json'), path.join(__dirname, 'data', 'lend_list.json')];
  files.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
    }
  });
}

ensureDataFilesExist();

// 写入借阅数据
function writeLendList(lendList) {
  try {
    fs.writeFileSync(path.join(__dirname, 'data', 'lend_list.json'), JSON.stringify(lendList, null, 2));
  } catch (error) {
    console.error('Error writing to lend_list.json file:', error);
  }
}

app.post('/api/lend', async (req, res) => {
  const { bookId, lendDate, returnDate } = req.body;

  let lendList = readLendList();
  const newLendRecord = {
    bookId,
    lendDate,
    returnDate,
  };

  lendList.push(newLendRecord);
  writeLendList(lendList);

  res.status(201).json({ message: 'Book lent successfully!', lendRecord: newLendRecord });
});



// 启动服务器
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
