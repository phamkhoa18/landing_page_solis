


import type { Metadata } from 'next'
import EditComponent from '../EditComponent';


export const metadata: Metadata = {
  title: 'Trang chỉnh sửa thông tin Vcard',
  description: 'Trang chỉnh sửa thông tin của Vcard',
}

export default async function VcardEditPage({ params }: { params: { id: string } }) {
    const { id } = await params
    return (
      <EditComponent id={id}></EditComponent>
    )
}