 
import type { Metadata } from 'next';
import VcardClientComponent from './VcardClientComponent';

export const metadata: Metadata = {
  title: 'Trang thông tin Vcard',
  description: 'Trang hiển thị thông tin của Vcard',
};

// Define the props type to match Next.js dynamic route expectations
type VcardPageProps = {
  params: Promise<{ username: string }>; // Use Promise to satisfy PageProps
};

// Use async to handle the Promise-based params
export default async function VcardPage({ params }: VcardPageProps) {
  const resolvedParams = await params; // Resolve the Promise
  const { username } = resolvedParams;
  return <VcardClientComponent username={username} />;
}