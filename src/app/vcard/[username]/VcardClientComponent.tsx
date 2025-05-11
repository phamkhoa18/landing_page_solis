'use client'


import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin, Facebook, Instagram, Building2, Globe, Briefcase, MessageCircle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { FaPlus } from 'react-icons/fa'
import Image from 'next/image';

// Define the Vcard type based on the schema
interface VCard {
  _id: string;
  name: string;
  lastname: string;
  vcardName: string;
  phone: string;
  altPhone?: string;
  email: string;
  street: string;
  city: string;
  state: string;
  postal: string;
  country: string;
  company: string;
  profession: string;
  summary: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  zalo?: string;
  socials: string[]; // Array of social links (if any)
  image: string;
  welcomeImage: string;
  primaryColor: string;
  secondaryColor: string;
  slug: string;
  createdAt: string;
  updatedAt?: string; // Optional, if present
}

export default function VcardClientComponent({ username }: { username: string }) {
  // Client-side logic, hooks, v.v.

  
  const [vcard, setVcard] = useState<VCard | null>(null);
  // Fetch Vcard data when the component mounts or when `username` changes
  useEffect(() => {
    async function fetchVcard() {
      const response = await fetch(`/api/vcard/detail/${username}`);
      const data = await response.json();
      console.log(data);
      
      setVcard(data);
    const root = document.documentElement;
    root.style.setProperty('--primary', data.primaryColor); // Cập nhật giá trị biến
    root.style.setProperty('--secondary', data.secondaryColor); // Cập nhật giá trị biến   
    }
    
    fetchVcard();
  }, [username]);

  // Đảm bảo rằng bạn gọi hook này mỗi lần render
  if (!vcard) return <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{
          scale: [0.95, 1, 0.98, 1],
          opacity: 1,
        }}
        transition={{
          duration: 1.2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Card className="shadow-xl border-2 border-gray-200 p-8 flex flex-col items-center gap-4 rounded-2xl">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg font-semibold text-gray-800 animate-pulse">
            Đang tải dữ liệu, vui lòng chờ...
          </p>
        </Card>
      </motion.div>
    </motion.div>



  return (
    <section className='profile relative min-h-[100vh] flex w-full'>
            <style>
            {`
            :root {
                --primary: ${vcard.primaryColor}; 
                --secondary: ${vcard.secondaryColor}
            }
            [data-state="active"] {
                color: var(--primary);
                background-color: var(--secondary); /* Ví dụ, thay đổi nền bằng biến */
            }
            .contact {
                color: var(--primary);
                font-size: 0.8rem ;
            }
            `}
        </style>
            <div className="absolute hidden lg:block top-0 left-0 w-full h-[45%] -z-10 bg-(--primary)"></div>
            <div className="container mx-auto max-w-[680px] my-0 lg:my-[40px] rounded-2xl relative flex flex-col bg-(--secondary)" style={{boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'}}>
                    <div className="item">
                        <div className="profile_1 bg-(--primary)">
                            <div className="user pt-[40px] pb-[30px] md:px-[40px] px-[20px]  lg:px-[60px] flex flex-col gap-2 justify-center items-center">
                                <div className="avatar w-fit">
                                    {vcard.image ? (
                                        <Image
                                        src={vcard.image}
                                        alt={vcard.name}
                                        className="rounded-xl"
                                        width={120}
                                        height={120}
                                        priority
                                        />
                                    ) : (
                                        <div className="w-[120px] h-[120px] bg-white rounded-xl flex items-center justify-center text-[--primary] text-4xl font-semibold">
                                        {vcard.name?.charAt(0).toUpperCase() || "?"}
                                        </div>
                                    )}
                                    </div>
                                
                                <div className="name text-white font-bold text-2xl">
                                    {vcard.name}
                                </div>
    

                                {vcard.summary && (
                                    <div className="vcard-summary text-xs text-white italic font-medium max-w-xl mx-auto text-center">
                                            &quot; {vcard.summary} &quot;
                                    </div>
                                ) }

                                <Button
                                    variant="ghost"
                                    className="px-2 py-1 font-semibold border cursor-pointer border-white/50 text-white hover:text-black hover:bg-white rounded-md flex items-center gap-2 transition-colors duration-200"
                                    style={{fontSize: '0.7rem'}}
                                    >
                                    <FaPlus  style={{width: '0.5rem' , height: '.5rem'}} />
                                    Add Contact
                                </Button>
                            </div>

                            <div className="tab w-full">
                            <Tabs defaultValue="contact" className="w-full flex items-center gap-0 p-0">
                            <TabsList className="flex w-full rounded-md max-w-[350px] mb-[-1px] p-0 bg-(--primary)" >
                                <TabsTrigger value="contact" className='font-bold cursor-pointer text-sm text-white' style={{borderRadius: '8px 8px 0px 0px'}}>Contact</TabsTrigger>
                                <TabsTrigger value="company" className='font-bold cursor-pointer text-sm text-white' style={{borderRadius: '8px 8px 0px 0px'}}>Company</TabsTrigger>
                                <TabsTrigger value="socials" className='font-bold cursor-pointer text-sm text-white' style={{borderRadius: '8px 8px 0px 0px'}}>Socials</TabsTrigger>
                            </TabsList>

                            <TabsContent value="contact" className="space-y-3 p-[40px] w-full h-full bg-(--secondary)">
                                <div className="space-y-4 flex flex-col gap-2 text-black">
                                    {vcard.phone && (
                                        <div className="flex items-start border-b border-[#f0f0f0] gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                            <Phone className="w-5 h-5 text-black" />
                                            </div>
                                            <div>
                                            <div className="text-xs font-bold mb-0.5">Phone number</div>
                                            <a href={`tel:${vcard.phone}`} className="text-base contact hover:underline ">
                                                {vcard.phone}
                                            </a>
                                            </div>
                                        </div>
                                        )}
                                    {/* Vcard phone more */}
                                    {vcard.altPhone && (
                                        <div className="flex items-start border-b border-[#f0f0f0] gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                            <Phone className="w-5 h-5 text-black" />
                                            </div>
                                            <div>
                                            <div className="text-xs font-bold mb-0.5">Alternative phone</div>
                                            <a href={`tel:${vcard.altPhone}`} className="text-base contact hover:underline ">
                                                {vcard.altPhone}
                                            </a>
                                            </div>
                                        </div>
                                        )}


                                    {/* Email */}
                                    {vcard.email && (
                                        <div className="flex items-start border-b border-[#f0f0f0] gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                            <Mail className="w-5 h-5 text-black" />
                                            </div>
                                            <div>
                                            <div className="text-xs font-bold mb-0.5">Email</div>
                                            <a href={`tel:${vcard.email}`} className="text-base contact hover:underline ">
                                                {vcard.email}
                                            </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Location */}
                                    {vcard.state && (
                                        <div className="flex items-start border-b border-[#f0f0f0] gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                            <MapPin className="w-5 h-5 text-black" />
                                            </div>
                                            <div>
                                            <div className="text-xs font-bold mb-0.5">Location</div>
                                            <a
                                                className="text-base contact hover:underline "
                                            >
                                                {vcard.street}, {vcard.state}, {vcard.city}, {vcard.country}
                                            </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Website */}
                                    {vcard.website && (
                                        <div className="flex items-start border-b border-[#f0f0f0] gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                            <Globe className="w-5 h-5 text-black" />
                                            </div>
                                            <div>
                                            <div className="text-xs font-bold mb-0.5">Website</div>
                                            <a href={`${vcard.website}`} target='_blank' className="text-base contact hover:underline ">
                                                Website Link
                                            </a>
                                            </div>
                                        </div>
                                    )}
                                    </div>

                            </TabsContent>

                            <TabsContent value="company" className="space-y-3 bg-white p-[40px] w-full h-full">
                               <div className="space-y-4 flex flex-col gap-2 text-black">
                                    {vcard.company && (
                                        <div className="flex items-start border-b border-[#f0f0f0] gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                            <Building2 className="w-5 h-5 text-black" />
                                            </div>
                                            <div>
                                            <div className="text-xs font-bold mb-0.5">Company</div>
                                            <a className="text-base contact hover:underline ">
                                                {vcard.company}
                                            </a>
                                            </div>
                                        </div>
                                    )}

                                    {vcard.profession && (
                                        <div className="flex items-start border-b border-[#f0f0f0] gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                            <Briefcase className="w-5 h-5 text-black" />
                                            </div>
                                            <div>
                                            <div className="text-xs font-bold mb-0.5">Profession</div>
                                            <a className="text-base contact hover:underline ">
                                                {vcard.profession}
                                            </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="socials" className="space-y-3 bg-white p-[40px] w-full h-full">
                                <div className="space-y-4 flex flex-col gap-2 text-black">
                                    {/* Social Links */}
                                    <div className="pt-2 space-y-3">
                                    {vcard.facebook && (
                                        <div className="flex items-center gap-3">
                                        <Facebook className="w-5 h-5 text-blue-600" />
                                        <a href={vcard.facebook} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                            Facebook
                                        </a>
                                        </div>
                                    )}
                                    {vcard.instagram && (
                                        <div className="flex items-center gap-3">
                                        <Instagram className="w-5 h-5 text-pink-500" />
                                        <a href={vcard.instagram} target="_blank" rel="noopener noreferrer" className="text-xs text-pink-500 hover:underline">
                                            Instagram
                                        </a>
                                        </div>
                                    )}
                                    {vcard.whatsapp && (
                                        <div className="flex items-center gap-3">
                                        <MessageCircle className="w-5 h-5 text-green-600" />
                                        <a
                                            href={`https://wa.me/${vcard.whatsapp.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs hover:underline text-green-600"
                                        >
                                            WhatsApp
                                        </a>
                                        </div>
                                    )}
                                    </div>
                                </div>
                            </TabsContent>
                            </Tabs>
                        </div>
                        </div>

                    </div>
            </div>
    </section>
  );
}