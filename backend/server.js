const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');  // Import morgan

const app = express();

// Cho phép frontend (Next.js) gọi từ domain khác
app.use(morgan('common'));
app.use(cors());
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const PORT = process.env.PORT_IMAGE;
// Thư mục lưu ảnh
const uploadDir = path.join(__dirname, 'uploads');

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình Multer lưu ảnh vào bộ nhớ RAM (sẽ xử lý bằng sharp sau)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint upload ảnh
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1e9)}-vcard.png`;
    const filePath = path.join(uploadDir, fileName);

    await sharp(req.file.buffer).png().toFile(filePath);
    fs.chmodSync(filePath, 0o666); // cấp quyền đọc/ghi ảnh

    const publicUrl = `/uploads/${fileName}`;
    res.status(200).json({ url: publicUrl });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Route truy xuất ảnh
app.use('/uploads', express.static(uploadDir));

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`✅ Server image đang chạy tại http://localhost:${PORT}`);
});
