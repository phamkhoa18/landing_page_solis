import type { Metadata } from 'next'
import Saigon247TourPage from "./saigon247Component";


export const metadata: Metadata = {
  title: 'Tour Du Lịch Saigon247',
  description: 'Trang đăng ký Tour du lịch Saigon247',
}


export default function saigon247() {
    return <Saigon247TourPage></Saigon247TourPage>
}
