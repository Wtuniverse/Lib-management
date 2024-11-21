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

// 检查 ISBN 是否已存在
app.get('/api/check-isbn', (req, res) => {
  const isbn = req.query.isbn;
  const books = readBooks();
  const isISBNExists = books.some(book => book.isbn === isbn);
  res.json({ exists: isISBNExists });
});

// 添加书籍
app.post('/api/books', (req, res) => {
  const newBook = req.body;

  // 读取现有书籍数据
  let books = readBooks();

  // 检查 ISBN 是否已存在
  const isISBNExists = books.some(book => book.isbn === newBook.isbn);
  if (isISBNExists) {
    return res.status(400).json({ error: 'ISBN already exists' });
  }

  // 生成一个新的 bookId
  const newBookId = books.length > 0 ? books[books.length - 1].bookId + 1 : 1;
  newBook.bookId = newBookId;

  // 添加新书
  books.push(newBook);

  // 写入更新后的书籍数据
  writeBooks(books);

  res.status(201).json(newBook);
});

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

const BORROWER_FILE = path.join(__dirname, 'data', 'borrower.json');

// 读取借阅记录数据
function readBorrowers() {
  try {
    const data = fs.readFileSync(BORROWER_FILE);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading borrower file:', error);
    return [];
  }
}

// 写入借阅记录数据
function writeBorrowers(borrowers) {
  try {
    fs.writeFileSync(BORROWER_FILE, JSON.stringify(borrowers, null, 2));
  } catch (error) {
    console.error('Error writing to borrower file:', error);
  }
}

// 检查借阅记录是否存在
app.get('/api/check-borrower', (req, res) => {
  const borrowerId = req.query.borrowerId;
  const borrowers = readBorrowers();
  const isBorrowerExists = borrowers.some(borrower => borrower.borrowerId === borrowerId);
  res.json({ exists: isBorrowerExists });
});

// 添加借阅记录
app.post('/api/borrower', (req, res) => {
  const newBorrower = req.body;

  // 读取现有借阅记录数据
  let borrowers = readBorrowers();

  // 检查 borrowerId 是否已存在
  const isBorrowerExists = borrowers.some(borrower => borrower.borrowerId === newBorrower.borrowerId);
  if (isBorrowerExists) {
    return res.status(400).json({ error: 'Borrower ID already exists' });
  }

  // 生成一个新的 borrowerId
  const newBorrowerId = borrowers.length > 0 ? borrowers[borrwers.length - 1].borrowerId + 1 : 1;
  newBorrower.borrowerId = newBorrowerId;

  // 添加新的借阅记录
  borrowers.push(newBorrower);

  // 写入更新后的借阅记录数据
  writeBorrowers(borrowers);

  res.status(201).json(newBorrower);
});

// 获取所有借阅记录
app.get('/api/borrower', (req, res) => {
  const borrowers = readBorrowers();
  res.json(borrowers);
});

// 更新借阅记录
app.put('/api/borrower/:id', (req, res) => {
  const borrowerId = parseInt(req.params.id);
  const updatedBorrower = req.body;
  let borrowers = readBorrowers();
  const index = borrowers.findIndex(borrower => borrower.borrowerId === borrowerId);

  if (index !== -1) {
    borrowers[index] = { borrowerId, ...updatedBorrower };
    writeBorrowers(borrowers);
    res.status(200).json(borrowers[index]);
  } else {
    res.status(404).send('Borrower not found');
  }
});

// 删除借阅记录
app.delete('/api/borrower/:id', async (req, res) => {
  const borrowerId = parseInt(req.params.id);

  try {
    let borrowers = await readBorrowers();
    const index = borrowers.findIndex(borrower => borrower.borrowerId === borrowerId);

    if (index === -1) {
      return res.status(404).json({ error: 'Borrower not found' });
    }

    // 使用 splice 方法删除找到的借阅记录
    borrowers.splice(index, 1);

    // 写入更新后的数据
    await writeBorrowers(borrowers);

    res.status(200).json({ message: `Borrower with ID ${borrowerId} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// 启动服务器
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
