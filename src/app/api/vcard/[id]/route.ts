/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import Vcard from '../../../../../models/Vcard'
import connectDB from '../../../../../lib/mongodb'
import slugify from 'slugify';
// Tắt bodyParser của Next.js
export const config = {
  api: {
    bodyParser: false,
  },
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }>  }) {
  try {
    const { id } = await params // Await params to get the id
    await connectDB()
    const vcard = await Vcard.findById(id)

    if (!vcard) {
      return NextResponse.json({ error: 'Vcard not found' }, { status: 404 })
    }

    return NextResponse.json(vcard, { status: 200 })
  } catch (error) {
    console.error('Error fetching vcard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    
    // Đọc formData từ request
    const data = await req.formData();
    
    // Kiểm tra Vcard tồn tại
    const existingVcard = await Vcard.findById(id);
    if (!existingVcard) {
      return NextResponse.json({ error: 'Vcard not found' }, { status: 404 });
    }

    // Lấy giá trị và đảm bảo không rỗng
    const vcardName = data.get('vcardName') as string;
    const name = data.get('name') as string;

    if (!vcardName || !name) {
      console.error('Missing required fields: vcardName or name');
      return new Response('Missing required fields: vcardName or name', { status: 400 });
    }

    // Chuẩn bị dữ liệu cập nhật
    const updateData: {
      vcardName: string;
      name: string;
      slug: string;
      lastname: string;
      phone: string;
      altPhone: string;
      email: string;
      website: string;
      company: string;
      profession: string;
      summary: string;
      street: string;
      postal: string;
      city: string;
      state: string;
      country: string;
      facebook: string;
      instagram: string;
      zalo: string;
      whatsapp: string;
      primaryColor: string;
      secondaryColor: string;
      image?: string | null; // Đảm bảo thêm image vào kiểu dữ liệu
    } = {
      vcardName: vcardName,
      name: name,
      slug: (data.get('slug') as string) || existingVcard.slug,
      lastname: (data.get('lastname') as string) ?? existingVcard.lastname,
      phone: (data.get('phone') as string) ?? existingVcard.phone,
      altPhone: (data.get('altPhone') as string) ?? existingVcard.altPhone,
      email: (data.get('email') as string) ?? existingVcard.email,
      website: (data.get('website') as string) ?? existingVcard.website,
      company: (data.get('company') as string) ?? existingVcard.company,
      profession: (data.get('profession') as string) ?? existingVcard.profession,
      summary: (data.get('summary') as string) ?? existingVcard.summary,
      street: (data.get('street') as string) ?? existingVcard.street,
      postal: (data.get('postal') as string) ?? existingVcard.postal,
      city: (data.get('city') as string) ?? existingVcard.city,
      state: (data.get('state') as string) ?? existingVcard.state,
      country: (data.get('country') as string) ?? existingVcard.country,
      facebook: (data.get('facebook') as string) ?? existingVcard.facebook,
      instagram: (data.get('instagram') as string) ?? existingVcard.instagram,
      zalo: (data.get('zalo') as string) ?? existingVcard.zalo,
      whatsapp: (data.get('whatsapp') as string) ?? existingVcard.whatsapp,
      primaryColor: (data.get('primaryColor') as string) ?? existingVcard.primaryColor,
      secondaryColor: (data.get('secondaryColor') as string) ?? existingVcard.secondaryColor,
    };

        // Xử lý image
    const image = data.get('image') as File;
    let imagePath: string | null = existingVcard.image;

    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());

      // Gửi ảnh sang server upload
      const form = new FormData();
      form.append('image', new Blob([buffer]), 'vcard.png');

      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_LINK_IMAGE}/upload`, {
        method: 'POST',
        body: form
      });

      if (!uploadRes.ok) {
        throw new Error('Upload image failed');
      }

      const result = await uploadRes.json();
      imagePath = result.url; // Nhận URL từ server.js trả về, ví dụ: /uploads/xyz.png
    }

    // Tạo slug nếu không có
    if (!updateData.slug) {
      updateData.slug = slugify(vcardName, {
        lower: true,
        strict: true,
        locale: 'vi'
      });
    }

    // Cập nhật dữ liệu
    updateData.image = imagePath;

    const updatedVcard = await Vcard.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    return NextResponse.json(
      { message: 'Vcard updated successfully', vcard: updatedVcard },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating vcard:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params // Await params to get the id
    await connectDB()
    const deleted = await Vcard.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ error: 'Vcard not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Vcard deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting vcard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}