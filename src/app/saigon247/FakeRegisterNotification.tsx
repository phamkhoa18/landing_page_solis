"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaUserCheck } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

const names = [
  "Nguyễn Anh Tuấn",
  "Trần Thị Hồng Nhung",
  "Lê Văn Nam",
  "Phạm Thị Mai",
  "Đặng Quốc Huy",
  "Võ Thị Thanh Trúc",
  "Bùi Minh Khoa",
  "Ngô Thị Bích Ngọc",
  "Trịnh Công Danh",
  "Dương Thùy Trang",
  "Hoàng Văn Phúc",
  "Lý Thị Mỹ Linh",
  "Mai Nhật Quang",
  "Nguyễn Thảo Vy",
  "Phan Văn Khải",
  "Tạ Quỳnh Chi",
  "Vũ Hữu Đạt",
  "Huỳnh Thanh Tùng",
  "Lâm Thị Cẩm Tú",
  "Châu Minh Tuấn",
  "Lương Hồng Sơn",
  "Cao Kim Ngân",
  "Trần Văn Lợi",
  "Đỗ Ngọc Bảo Trân",
  "Nguyễn Đức Mạnh",
];

const cities = [
  "Melbourne",
  "Sydney",
  "Brisbane",
  "Adelaide",
  "Perth",
  "Canberra",
  "Hobart",
  "Darwin",
  "Gold Coast",
  "Newcastle",
  "Wollongong",
  "Geelong",
  "Townsville",
];

type Notification = {
  id: number;
  name: string;
  city: string;
};

export default function FakeSignupNotifications() {
  const [notifications, setNotifications] = useState<Notification | null>(null);
  const [idCounter, setIdCounter] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: idCounter,
        name: names[Math.floor(Math.random() * names.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
      };

      setNotifications(newNotification);  // Chỉ hiển thị một notification
      setIdCounter((prev) => prev + 1);

      // Xóa thông báo sau 5 giây
      setTimeout(() => {
        setNotifications(null);  // Xóa thông báo
      }, 5000);

    }, 3000); // Mỗi 3 giây sẽ thêm một thông báo mới

    return () => clearInterval(interval);
  }, [idCounter]);

  return (
    <div className="fixed bottom-5 left-6 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {notifications && (
          <motion.div
            key={notifications.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 w-[300px] border-l-4 border-yellow-400"
          >
            <FaUserCheck className="text-green-600 text-xl" />
            <div>
              <p className="text-xs font-semibold text-black">
                {notifications.name} vừa đăng ký tư vấn
              </p>
              <div className="flex items-center text-gray-600 text-xs mt-1">
                <MdLocationOn className="mr-1 text-red-500" />
                <span>{notifications.city}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
