/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Metadata } from 'next'
import VcardClientComponent from "./VcardClientComponent";

export const metadata: Metadata = {
  title: 'Trang thông tin Vcard',
  description: 'Trang hiển thị thông tin của Vcard',
}

export default async function VcardPage({params}: {params: {username: string}}) {
    const { username } = await params
 return <VcardClientComponent username={username} />
}
