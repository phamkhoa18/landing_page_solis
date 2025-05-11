
import type { Metadata } from 'next'
import DashboardComponent from './DashboardComponent'

export const metadata: Metadata = {
  title: 'Trang quản lý thông tin Vcard',
  description: 'Trang quản lý thông tin của Vcard',
}

export default function Dashboard() {
    return (
      <DashboardComponent></DashboardComponent>
    )
}
