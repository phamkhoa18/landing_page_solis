"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion} from "framer-motion";
import md5 from 'md5';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FaCheck } from "react-icons/fa";
import Header from "./Header";

// Form Schema
const formSchema = z.object({
  username: z.string().min(2, "Họ và tên tối thiểu 2 ký tự"),
  phone: z.string().min(8, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  code: z.string(),
  message: z.string().optional(),
});

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const formVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.3 } },
};

export default function Saigon247TourPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      phone: "",
      code: '',
      email: "",
      message: "",
    },
  });

  // API Functions
  function generateNonce() {
    return Math.random().toString(36).substring(2, 15);
  }

  function getCurrentStime() {
    return Date.now();
  }

  function createSignature(nonce: string, stime: number, key: string): string {
    const message = `${nonce}${stime}${key}`;
    return md5(message);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const nonce = generateNonce();
    const stime = getCurrentStime();
    const key = 'phaplyvietnam';
    const signature = createSignature(nonce, stime, key);

    const arraycontent = [{
      username: values.username,
      phone: values.phone,
      code: values.code,
      email: values.email,
      message: values.message,
    }];

    const data = {
      name: values.username,
      title: 'THÔNG TIN KHÁCH HÀNG TOUR ÚC',
      content: JSON.stringify(arraycontent),
      posision : 'saigon247',
    };

    console.log(data);
    

    fetch('http://saigon247.au/api/addform', {
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
        if (data.status == '200') {
          setShowSuccess(true);
          form.reset();
        } else {
          setShowError(true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setShowError(true);
      });
  }

  return (
    <>
    <Header></Header>
       <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center pb-12 pt-[100px] md:pt-12  px-4 relative"
      style={{
        backgroundImage: `url('/assets/banner_saigon247.png')`,
      }}
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/70 to-blue-500/10 z-0" />

      <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-12 relative z-10">
        {/* LEFT CONTENT */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-1/2 space-y-8 text-white"
        >
 <h1 
  className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 drop-shadow-lg"
  style={{ 
    WebkitTextStroke: '1px white', // Tạo outline trắng
    textShadow: '0 0 10px rgba(255, 105, 180, 0.8), 0 0 20px rgba(147, 51, 234, 0.6)' // Giữ glow effect
  }}
>
  Khám Phá Úc Cùng Saigon247
</h1>
          <p className="text-xl italic text-white mb-3">
            Hành trình đến xứ sở chuột túi với những điểm đến tuyệt đẹp:
          </p>
<ul className="text-lg mb-2">
  {[
    { text: "Great Ocean Road & Twelve Apostles", icon: <FaCheck className="text-yellow-300 text-2xl" />, highlight: false },
    { text: "Phillip Island", icon: <FaCheck className="text-yellow-300 text-2xl" />, highlight: false },
    { text: "Mt Buller", icon: <FaCheck className="text-yellow-300 text-2xl" />, highlight: false },
    { text: "Dandenong Ranges", icon: <FaCheck className="text-yellow-300 text-2xl" />, highlight: false },
    { text: "và nhiều địa điểm đặc biệt khác", icon: <FaCheck className="text-yellow-300 text-2xl" />, highlight: false },
  ].map((item, index) => (
    <motion.li
      key={index}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 * index, duration: 0.5 }}
      className="flex items-center gap-2 mb-1"
    >
      {item.icon}
      <span
        className="bg-clip-text text-transparent bg-gradient-to-r font-bold from-yellow-300 to-white drop-shadow-lg shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        {item.text}
      </span>
    </motion.li>
  ))}
</ul>


<motion.p
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.6 }}
  className="text-lg font-semibold text-white"
>
  Đăng ký và nhập code{" "}
  <span
    className="lg:text-4xl text-3xl font-extrabold tracking-tight leading-tight text-pink-400 drop-shadow-md"
    style={{
      WebkitTextStroke: "0.5px white", // Outline trắng mỏng hơn nữa
    }}
  >
    giảm 20%
  </span>{" "}
  cho tour ngay!
</motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-lg italic"
          >
            &quot;Chạm đến giấc mơ nước Úc cùng Saigon247!&quot;
          </motion.p>
        </motion.div>

        {/* FORM */}
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-[450px] bg-white backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-2xl"
        >
          <h2 className="font-extrabold uppercase text-2xl md:text-3xl bg-clip-text text-center text-transparent bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
            Đăng Ký Tour Ngay
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Nhận tư vấn miễn phí và ưu đãi đặc biệt từ Saigon247!
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={`bg-white rounded-sm p-3 py-5 text-black shadow-md ${form.formState.errors.username ? 'border-2 border-red-500' : ''}`}
                        placeholder="HỌ VÀ TÊN"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={`bg-white rounded-sm p-3 py-5 text-black shadow-md ${form.formState.errors.phone ? 'border-2 border-red-500' : ''}`}
                        placeholder="SỐ ĐIỆN THOẠI"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={`bg-white rounded-sm p-3 py-5 text-black shadow-md ${form.formState.errors.email ? 'border-2 border-red-500' : ''}`}
                        placeholder="EMAIL"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={`bg-white rounded-sm p-3 py-5 text-black shadow-md`}
                        placeholder="Mã code (nếu có)"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea
                        className={`w-full border bg-white rounded-sm outline-none p-3 py-5 text-black shadow-md transition-all duration-300 focus:ring-2 focus:ring-purple-500 resize-none h-32}`}
                        placeholder="Thông tin thêm (tuỳ chọn)"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full p-4 bg-gradient-to-r from-pink-500 cursor-pointer to-purple-600 text-white font-bold rounded-lg hover:from-yellow-400 hover:to-pink-300 transition-colors duration-300"
              >
                Đăng ký ngay
              </Button>

              {/* Thông báo lỗi toàn cục */}
              {Object.values(form.formState.errors).length > 0 && (
                <div className="mt-4 tracking-wide font-bold
                  bg-gradient-to-b from-pink-500 cursor-pointer to-purple-600 text-transparent bg-clip-text drop-shadow-md">
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
    </div>
    </>
  );
}
