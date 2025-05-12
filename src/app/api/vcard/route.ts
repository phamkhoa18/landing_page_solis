/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import Vcard from '../../../../models/Vcard';
import connectDB from '../../../../lib/mongodb';
import path from 'path';
import sharp from 'sharp';
import slugify from 'slugify';
import fs from 'fs';
import mime from 'mime-types';  // Thêm thư viện mime-types để kiểm tra kiểu dữ liệu

// Tắt bodyParser của Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const data = await request.formData();

    const vcardName = data.get('vcardName') as string;
    const name = data.get('name') as string;

    if (!vcardName || !name) {
      return new Response('Missing required fields: vcardName or name', { status: 400 });
    }

    const vcard = new Vcard({
      vcardName,
      name,
      slug: data.get('slug') as string,
      lastname: data.get('lastname') ?? '',
      phone: data.get('phone') ?? '',
      altPhone: data.get('altPhone') ?? '',
      email: data.get('email') ?? '',
      website: data.get('website') ?? '',
      company: data.get('company') ?? '',
      profession: data.get('profession') ?? '',
      summary: data.get('summary') ?? '',
      street: data.get('street') ?? '',
      postal: data.get('postal') ?? '',
      city: data.get('city') ?? '',
      state: data.get('state') ?? '',
      country: data.get('country') ?? '',
      facebook: data.get('facebook') ?? '',
      instagram: data.get('instagram') ?? '',
      zalo: data.get('zalo') ?? '',
      whatsapp: data.get('whatsapp') ?? '',
      primaryColor: data.get('primaryColor') ?? '',
      secondaryColor: data.get('secondaryColor') ?? '',
    });

    const image = data.get('image') as File;
    let imagePath: string | null = null;

    // Kiểm tra ảnh trước khi xử lý
    if (image) {
      const mimeType = mime.lookup(image.name);
      if (!mimeType || !mimeType.startsWith('image')) {
        console.error('Uploaded file is not an image', mimeType);
        return new Response('Uploaded file is not an image', { status: 400 });
      }

      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1e9)}-vcard.png`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');

      // Tạo thư mục nếu chưa tồn tại
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      console.log('Saving image to:', filePath);

      await sharp(buffer).png().toFile(filePath);
      fs.chmodSync(filePath, 0o666); // quyền đọc/ghi cho mọi user

      // Lưu đường dẫn tương đối vào DB (sau này truy cập qua API hoặc route proxy)
      imagePath = `/uploads/${fileName}`;
    }

    if (!vcard.slug || vcard.slug === '') {
      vcard.slug = slugify(vcard.vcardName, {
        lower: true,
        strict: true,
        locale: 'vi',
      });
    }

    vcard.image = imagePath;

    await vcard.save();

    return NextResponse.json({ message: 'Vcard created successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating vcard:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const vcards = await Vcard.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(vcards, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching vcards:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
