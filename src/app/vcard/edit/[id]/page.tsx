// app/vcard/edit/[id]/page.tsx

import type { Metadata } from 'next';
import EditComponent from '../EditComponent';

// Metadata
export const metadata: Metadata = {
  title: 'Trang chỉnh sửa thông tin Vcard',
  description: 'Trang chỉnh sửa thông tin của Vcard',
};

// Define the props type explicitly
interface VcardEditPageProps {
  params: Promise<{ id: string }>; // Wrap params in Promise
}

export default async function VcardEditPage({ params }: VcardEditPageProps) {
  const resolvedParams = await params; // Await the params Promise
  const id = resolvedParams.id;
  console.log(id);

  return <EditComponent id={id} />;
}