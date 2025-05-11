import { NextRequest, NextResponse } from 'next/server'
import Vcard from '../../../../models/Vcard'
import connectDB from '../../../../lib/mongodb'
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import slugify from 'slugify';
// Tắt bodyParser của Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

// API xử lý POST /api/vcard
export async function POST(request: NextRequest) {
  try {
    // Bước 1: Kết nối MongoDB
    await connectDB();
    const data = await request.formData() // Đọc body JSON
    console.log(data.get('slug') as string);

    // Lấy giá trị và đảm bảo nó không rỗng
    const vcardName = data.get('vcardName') as string;
    const name = data.get('name') as string;

    // Kiểm tra nếu dữ liệu cần thiết không có thì trả về lỗi
    if (!vcardName || !name) {
        console.error('Missing required fields: vcardName or name');
        return new Response('Missing required fields: vcardName or name', { status: 400 });
    }

    const vcard = await new Vcard({
        vcardName: (data.get('vcardName') as string),
        name: (data.get('name') as string),
        slug: (data.get('slug') as string),
        lastname: (data.get('lastname') as string) ?? '',
        phone: (data.get('phone') as string) ?? '',
        altPhone: (data.get('altPhone') as string) ?? '',
        email: (data.get('email') as string) ?? '',
        website: (data.get('website') as string) ?? '',
        company: (data.get('company') as string) ?? '',
        profession: (data.get('profession') as string) ?? '',
        summary: (data.get('summary') as string) ?? '',
        street: (data.get('street') as string) ?? '',
        postal: (data.get('postal') as string) ?? '',
        city: (data.get('city') as string) ?? '',
        state: (data.get('state') as string) ?? '',
        country: (data.get('country') as string) ?? '',
        facebook: (data.get('facebook') as string) ?? '',
        instagram: (data.get('instagram') as string) ?? '',
        zalo: (data.get('zalo') as string) ?? '',
        whatsapp: (data.get('whatsapp') as string) ?? '',
        primaryColor: (data.get('primaryColor') as string) ?? '',
        secondaryColor: (data.get('secondaryColor') as string) ?? '',
    })

    const image = await data.get('image') as File;
    let imagePath: string | null = null;
    
    const welcomeImage = await data.get('welcomeImage') as File;
    let welcomeImagePath: string | null = null;

    // Xử lý image
    if (image) {
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1e9)}-vcard.png`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

    await sharp(buffer)
        .png()
        .toFile(filePath); // Convert và save dưới dạng PNG

    imagePath = `/uploads/${fileName}`;
    }

    // Tương tự cho welcomeImage
    if (welcomeImage) {
    const arrayBuffer = await welcomeImage.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1e9)}-vcard.png`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

    await sharp(buffer)
        .png()
        .toFile(filePath);

    welcomeImagePath = `/uploads/${fileName}`;
    }
    
    if(vcard.slug == '') {
        vcard.slug = slugify(vcard.vcardName, {
                lower: true,      // viết thường hết
                strict: true,     // loại bỏ ký tự đặc biệt
                locale: 'vi'      // hỗ trợ tiếng Việt
        });
    }
    
    vcard.image = imagePath 
    vcard.welcomeImage = welcomeImagePath

    await vcard.save() ;
    return NextResponse.json(
      { message: 'Vcard created successfully'},
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating vcard:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/vcard – Lấy danh sách các vcard đã lưu
export async function GET() {
  try {
    await connectDB();

    const vcards = await Vcard.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(vcards, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching vcards:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
