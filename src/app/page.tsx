"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import md5 from 'md5';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FakeRegisterNotification from "./FakeRegisterNotification";
import { useState } from "react";
import Header from "./Header";
import Image from "next/image";

// Xác thực với zod
const formSchema = z.object({
  username: z.string().min(2, "Họ và tên tối thiểu 2 ký tự"),
  phone: z.string().min(8, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  consultationField: z.string().min(1, "Lĩnh vực cần tư vấn là bắt buộc"),
  message: z.string().optional(),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      phone: "",
      email: "",
      consultationField: "",
    },
  });


  function generateNonce() {
    return Math.random().toString(36).substring(2, 15);
  }

  function getCurrentStime() {
    return Date.now();
  }

  function createSignature(nonce: string, stime: number, key: string): string {
    const message = `${nonce}${stime}${key}`;
    return md5(message) ;
  }
  

  const [, setSubmitted] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false); // Thêm trạng thái cho popup
  const [showError, setShowError] = useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitted(true);  // Hiển thị thông báo xác nhận sau khi submit

    // Tạo nonce, stime và signature
    const nonce = generateNonce();
    const stime = getCurrentStime();
    const key = 'phaplyvietnam'; // Thay bằng khóa bí mật thực tế
    const signature = createSignature(nonce, stime, key);

    // Tạo dữ liệu gửi đi
    const arraycontent = [
      {  'username': values.username , 
         'phone': values.phone,
         'email': values.email,
         'consultationField': values.consultationField
       },
    ];
    const data = {
      name: values.username,
      title: 'THÔNG TIN KHÁCH HÀNG',
      content: JSON.stringify(arraycontent),
      posision: 'free',
    };
    
    // Gửi dữ liệu qua API
    fetch('https://saigon247.au/api/addform', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Nonce': nonce,
        'X-Stime': stime.toString(),
        'X-Signature': signature,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.status == '200') {
          setShowSuccess(true); // Hiển thị popup thành công
          form.reset() ;
          
        } else {
          setShowError(true);   // ❌ popup lỗi từ API
        }

      })
      .catch((error) => {
        console.error('Error:', error);
        setShowError(true);   // ❌ popup lỗi từ API
      });
  }

  return (
    <>
    <Header></Header>
        <div
      className="lg:py-16 pb-20 pt-20 lg:pt-16 min-h-screen w-full bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url('/assets/banner.png')` }}
    >
      <div className="container mx-auto flex flex-col lg:flex-row items-center px-4 gap-16 justify-center">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/2 text-white space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide 
            bg-gradient-to-b from-[#ffe1af] to-[#fab23d] text-transparent bg-clip-text 
            leading-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
            CẦN LUẬT SƯ GIÚP ĐỠ TẠI ÚC?
          </h2>
          <p className="text-lg md:text-xl">
            Văn phòng <span className="font-semibold tracking-wide 
            bg-gradient-to-b from-[#ffe1af] to-[#fab23d] text-transparent bg-clip-text drop-shadow-md">Solis Lawyers</span> hỗ trợ người Việt tại{" "}
            <span className="font-semibold">Melbourne, Sydney, Brisbane</span> trong các lĩnh vực:
          </p>
          <ul className="text-lg space-y-3 font-semibold">
            <li className="flex items-center gap-3 tracking-wide 
            bg-gradient-to-b from-[#ffe1af] to-[#fab23d] text-transparent bg-clip-text 
            leading-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
              <Image src="/assets/check.svg" alt="check" width={20}  height={20} />
              <span className=" tracking-wide 
              bg-gradient-to-b from-[#ffe1af] to-[#fab23d] text-transparent bg-clip-text drop-shadow-md">Luật Hình Sự</span>
            </li>
            <li className="flex items-center gap-3  tracking-wide 
            bg-gradient-to-b from-[#ffe1af] to-[#fab23d] bg-clip-text 
            leading-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
            <Image src="/assets/check.svg" alt="check" width={20} height={20} />
            <span className=" tracking-wide 
              bg-gradient-to-b from-[#ffe1af] to-[#fab23d] text-transparent bg-clip-text drop-shadow-md">Luật Gia Đình</span>
            </li>
            <li className="flex items-center gap-3 tracking-wide 
            bg-gradient-to-b from-[#ffe1af] to-[#fab23d] bg-clip-text 
            leading-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
            <Image src="/assets/check.svg" alt="check" width={20} height={20} />
            <span className=" tracking-wide 
              bg-gradient-to-b from-[#ffe1af] to-[#fab23d] text-transparent bg-clip-text drop-shadow-md">Luật Di Trú</span>
            </li>
          </ul>
          <p className="text-lg">
            Nhận ngay <span className="font-semibold tracking-wide 
            bg-gradient-to-b from-[#ffe1af] to-[#fab23d] text-transparent bg-clip-text drop-shadow-md">60 phút tư vấn MIỄN PHÍ</span> cho khó khăn pháp lý bạn đang gặp phải.
          </p>
          <p className="text-lg italic">{"\"Chúng tôi hiểu – và chúng tôi ở đây để giúp bạn.\""} </p>
        </motion.div>

        {/* FORM */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full lg:w-[450px] bg-[#b30000db] backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-2xl"
        >
          <h1 className="font-extrabold text-3xl md:text-4xl text-center mb-4 tracking-wide 
            bg-gradient-to-b from-[#ffe1af] to-[#fab23d] text-transparent bg-clip-text drop-shadow-md">
            ĐĂNG KÝ NGAY
          </h1>
          <p className="text-lg text-white text-center mb-6 font-semibold">
            TƯ VẤN TRỰC TUYẾN <span className="font-bold">60 PHÚT MIỄN PHÍ</span>
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Họ và tên */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={`bg-white rounded-sm p-4 py-6 text-black shadow-md ${form.formState.errors.username ? 'border-2 border-red-500' : ''}`}
                        placeholder="HỌ VÀ TÊN"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Số điện thoại */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={`bg-white rounded-sm p-4 py-6 text-black shadow-md ${form.formState.errors.phone ? 'border-2 border-red-500' : ''}`}
                        placeholder="SỐ ĐIỆN THOẠI"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={`bg-white rounded-sm p-4 py-6 text-black shadow-md ${form.formState.errors.email ? 'border-2 border-red-500' : ''}`}
                        placeholder="EMAIL"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Lĩnh vực cần tư vấn (ShadCN Select) */}
              <FormField
                control={form.control}
                name="consultationField"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange} >
                        <SelectTrigger className={`bg-white w-full rounded-sm p-4 py-6 text-black shadow-md ${form.formState.errors.consultationField ? 'border-2 border-red-500' : ''}`}>
                          <SelectValue placeholder="CHỌN LĨNH VỰC CẦN TƯ VẤN" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem  value="Hình sự">HÌNH SỰ</SelectItem>
                          <SelectItem value="Hôn nhân gia đình">HÔN NHÂN GIA ĐÌNH</SelectItem>
                          <SelectItem value="Di trú">DI TRÚ</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-[linear-gradient(180deg,#ffe1af,#fab23d)] cursor-pointer hover:bg-yellow-400 text-black font-bold py-3 rounded-sm transition-all duration-300 shadow-md hover:shadow-yellow-400/60"
              >
                GỬI YÊU CẦU TƯ VẤN
              </Button>

              {/* Thông báo lỗi toàn cục */}
              {Object.values(form.formState.errors).length > 0 && (
                <div className="mt-4 tracking-wide font-bold
                  bg-gradient-to-b from-[#ffe1af] to-[#fab23d] text-transparent bg-clip-text drop-shadow-md">
                  <ul>
                    {form.formState.errors.username && (
                      <li>Không bỏ trống Họ và Tên</li>
                    )}
                    {form.formState.errors.phone && (
                      <li>Không bỏ trống Số điện thoại</li>
                    )}
                    {form.formState.errors.email && (
                      <li>Email không hợp lệ</li>
                    )}
                    {form.formState.errors.consultationField && (
                      <li>Lĩnh vực cần tư vấn là bắt buộc</li>
                    )}
                  </ul>
                </div>
              )}
            </form>
          </Form>

        </motion.div>
      </div>

      {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-center"
            >
              <div className="text-green-500 text-4xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-600">Đăng ký thành công!</h2>
              <p className="text-base text-gray-700 mt-3">
                Cảm ơn bạn đã đăng ký. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
              </p>
              <Button
                onClick={() => setShowSuccess(false)}
                className="mt-6 bg-green-500 hover:bg-green-400 text-white px-6 py-3 rounded-xl transition-all shadow-md"
              >
                Đóng
              </Button>
            </motion.div>
          </motion.div>
        )}

      {showError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-center"
          >
            <div className="text-red-500 text-4xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-600">Gửi không thành công!</h2>
            <p className="text-base text-gray-700 mt-3">
              Có lỗi xảy ra trong quá trình gửi thông tin. Vui lòng thử lại sau.
            </p>
            <Button
              onClick={() => setShowError(false)}
              className="mt-6 bg-red-500 hover:bg-red-400 text-white px-6 py-3 rounded-xl transition-all shadow-md"
            >
              Đóng
            </Button>
          </motion.div>
        </motion.div>
      )}

      <FakeRegisterNotification />
    </div>
    </>
  );
}
