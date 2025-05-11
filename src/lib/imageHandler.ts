/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { NextRequest } from 'next/server';

// Cấu hình Multer để lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Đường dẫn thư mục: public/Uploads/
    const uploadDir = path.join(process.cwd(), 'public', 'Uploads');
    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Tạo tên file duy nhất: timestamp + số ngẫu nhiên + đuôi file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extname = path.extname(file.originalname);
    cb(null, uniqueSuffix + extname);
  },
});

// Khởi tạo Multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  fileFilter: (req, file, cb) => {
    // Chỉ cho phép .jpg, .png, .svg
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file .jpg, .png, hoặc .svg'), false);
    }
  },
});

class ImageHandler {
  // Hàm parse file từ NextRequest
  private static async parseFormData(
    request: NextRequest,
    fieldName: string
  ): Promise<{ fields: any; file: any }> {
    return new Promise((resolve, reject) => {
      // Tạo middleware Multer cho trường cụ thể (ví dụ: 'background')
      const multerUpload = upload.single(fieldName);

      // Lấy buffer từ request
      request.arrayBuffer().then((buffer) => {
        // Tạo req giả để Multer sử dụng
        const req: any = {
          headers: Object.fromEntries(request.headers.entries()),
          method: request.method,
          body: Buffer.from(buffer),
        };

        // Tạo res giả
        const res: any = {
          setHeader: () => {},
          status: () => res,
          json: () => res,
        };

        // Parse dữ liệu với Multer
        multerUpload(req, res, (err) => {
          if (err) return reject(err);
          resolve({
            fields: req.body || {}, // Dữ liệu văn bản
            file: req.file || null, // File (ví dụ: background)
          });
        });
      }).catch(reject);
    });
  }

  // Hàm chính: Xử lý và lưu file ảnh
  static async handleImage(
    request: NextRequest,
    fieldName: string = 'image' // Trường mặc định là 'image'
  ): Promise<{
    fields: any;
    filePath: string | null; // Đường dẫn file (ví dụ: /Uploads/123.jpg)
    fileName: string | null; // Tên file (ví dụ: 123.jpg)
  }> {
    try {
      // Bước 1: Parse FormData để lấy fields và file
      const { fields, file } = await this.parseFormData(request, fieldName);

      // Bước 2: Nếu không có file, trả về fields và null
      if (!file) {
        return {
          fields,
          filePath: null,
          fileName: null,
        };
      }

      // Bước 3: Tạo đường dẫn file để lưu vào DB (dùng trong URL)
      const filePath = `/Uploads/${file.filename}`;

      // Bước 4: Trả về thông tin
      return {
        fields, // Các trường văn bản (name, description, v.v.)
        filePath, // Đường dẫn file (ví dụ: /Uploads/123456789.jpg)
        fileName: file.filename, // Tên file (ví dụ: 123456789.jpg)
      };
    } catch (error: any) {
      throw new Error(`Lỗi khi xử lý file ảnh: ${error.message}`);
    }
  }
}

export default ImageHandler;