// components/Header.tsx
"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-transparent text-white min-h-[60px] absolute w-full flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        {/* Logo / Brand */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-[linear-gradient(180deg,#ffe1af,#fab23d)] rounded-[10px] p-2"
        >
          <Image src="/assets/logo.png" alt="Logo" width={80} height={80} />
        </motion.div>

        {/* Nav Buttons */}
        <motion.nav
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-3 flex-wrap justify-center"
        >
            <Button
            className="bg-[linear-gradient(180deg,#ffe1af,#fab23d)] hover:shadow-yellow-400/60 cursor-pointer text-black font-bold text-sm md:text-base px-6 py-2 rounded-full shadow-lg hover:scale-105 hover:bg-[#ffcb5c] transition-all duration-300 flex items-center gap-2"
            >
            <a className="flex items-center gap-2" href="tel:0413 06 06 06">
            <span>Liên hệ</span>
            <span className="text-lg md:text-xl font-extrabold tracking-wide text-[red]">
                0413 06 06 06
            </span>
            </a>
            </Button>
        </motion.nav>
      </div>
    </header>
  );
}
