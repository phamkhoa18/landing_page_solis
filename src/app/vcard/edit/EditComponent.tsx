/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import React, { useState, useCallback, useEffect } from 'react'
import { RotateCcw, ChevronDown, ChevronUp, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from "next/link"
import Cropper  from 'react-easy-crop'
import { showError, showSuccess } from "../NotificationOverlay"
import { useRouter } from 'next/navigation'
import { getCroppedImg } from "../cropImage"

interface Vcard {
  _id: string
  vcardName: string
  slug: string
  name: string
  lastname: string
  phone: string
  altPhone: string
  email: string
  website: string
  company: string
  profession: string
  summary: string
  street: string
  postal: string
  city: string
  state: string
  country: string
  facebook: string
  instagram: string
  zalo: string
  whatsapp: string
  image: string
  primaryColor: string
  secondaryColor: string
  socials: string[]
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function EditComponent({ id }: { id: string }) {

  const router = useRouter()
  const colorSchemes = [
    { primary: '#4A90E2', secondary: '#ffffff' },
    { primary: '#50C878', secondary: '#ffffff' },
    { primary: '#EDC472', secondary: '#ffffff' },
    { primary: '#F28C8C', secondary: '#ffffff' },
    { primary: '#A77BCA', secondary: '#ffffff' },
    { primary: '#FFA07A', secondary: '#ffffff' },
    { primary: '#00BFFF', secondary: '#ffffff' },
    { primary: '#FF69B4', secondary: '#ffffff' },
    { primary: '#40E0D0', secondary: '#ffffff' },
    { primary: '#FFB347', secondary: '#ffffff' },
  ]

  const [selectedScheme, setSelectedScheme] = useState(colorSchemes[5])
  const [selectedSocials, setSelectedSocials] = useState<string[]>([])
  
  const [isOpenMap, setIsOpenMap] = useState({
    vcard: true,
    design: true,
    personal: true,
    contact: true,
    company: true,
    summary: true,
    address: true,
    social: true,
    welcome: true,
  })
  const [formData, setFormData] = useState({
    vcardName: '',
    slug: '',
    name: '',
    lastname: '',
    phone: '',
    altPhone: '',
    email: '',
    website: '',
    company: '',
    profession: '',
    summary: '',
    street: '',
    postal: '',
    city: '',
    state: '',
    country: '',
    facebook: '',
    instagram: '',
    zalo: '',
    whatsapp: '',
  })
  const [image, setImage] = useState<File | null>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [existingImage, setExistingImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch Vcard data on mount
  useEffect(() => {
    const fetchVcard = async () => {
      try {
        const response = await fetch(`/api/vcard/${id}`)
        if (!response.ok) throw new Error('Không thể tải dữ liệu Vcard')
        const data: Vcard = await response.json()
        setFormData({
          vcardName: data.vcardName || '',
          slug: data.slug || '',
          name: data.name || '',
          lastname: data.lastname || '',
          phone: data.phone || '',
          altPhone: data.altPhone || '',
          email: data.email || '',
          website: data.website || '',
          company: data.company || '',
          profession: data.profession || '',
          summary: data.summary || '',
          street: data.street || '',
          postal: data.postal || '',
          city: data.city || '',
          state: data.state || '',
          country: data.country || '',
          facebook: data.facebook || '',
          instagram: data.instagram || '',
          zalo: data.zalo || '',
          whatsapp: data.whatsapp || '',
        })
        setSelectedScheme({
          primary: data.primaryColor || colorSchemes[5].primary,
          secondary: data.secondaryColor || colorSchemes[5].secondary,
        })
        setSelectedSocials(data.socials || [])
        setExistingImage(data.image || null)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        showError('Không thể tải dữ liệu Vcard')
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu')
      }
    }

    fetchVcard() ;
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size <= 5 * 1024 * 1024 && ['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result as string)
        setIsCropping(true)
      }
      reader.readAsDataURL(file)
    } else {
      alert('Vui lòng chọn file .jpg, .png hoặc .svg có kích thước tối đa 5MB')
    }
  }

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
  setCroppedAreaPixels(croppedAreaPixels);
}, []);

  const handleCrop = useCallback(async () => {
    try {
      if (!croppedAreaPixels || croppedAreaPixels.width < 120 || croppedAreaPixels.height < 120) {
        alert('Kích thước cắt phải tối thiểu 120x120px')
        return
      }
      const croppedImage = await getCroppedImg(imageSrc!, croppedAreaPixels)
      const file = new File([croppedImage], 'cropped-image.jpg', { type: 'image/jpeg' })
      setImage(file)
      setIsCropping(false)
      setImageSrc(null)
    } catch (e) {
      console.error(e)
      alert('Đã xảy ra lỗi khi cắt ảnh')
    }
  }, [imageSrc, croppedAreaPixels])

  const handleReset = () => {
    setSelectedScheme(colorSchemes[5])
  }

  const toggleSection = (section: keyof typeof isOpenMap) => {
    setIsOpenMap(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    const formDataToSend = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'string' && value.trim() !== '') {
        formDataToSend.append(key, value)
      }
    })

    if (image) formDataToSend.append('image', image)
    formDataToSend.append('primaryColor', selectedScheme.primary)
    formDataToSend.append('secondaryColor', selectedScheme.secondary)
    formDataToSend.append('socials', JSON.stringify(selectedSocials))

    try {
      const response = await fetch(`/api/vcard/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      })

      const result = await response.json()
      if (!response.ok) {
        showError("Không thể cập nhật dữ liệu.")
        throw new Error(result.error || 'Đã xảy ra lỗi khi cập nhật Vcard')
      }
      showSuccess("Cập nhật dữ liệu thành công!")
      setSuccess('Vcard đã được cập nhật thành công!')
      router.push('/vcard/dashboard')
    } catch (err: any) {
      showError("Không thể cập nhật dữ liệu.")
      setError(err.message || 'Đã xảy ra lỗi khi cập nhật dữ liệu')
    } finally {
      setIsLoading(false)
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  const chevronVariants = {
    open: { rotate: 0, transition: { duration: 0.3 } },
    closed: { rotate: 180, transition: { duration: 0.3 } },
  }

  return (
    <section className="vcard bg-gray-50 py-12">
      <div className="container mx-auto max-w-[600px] px-[15px]">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <motion.h3
            className="font-bold text-2xl text-gray-800"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            Chỉnh sửa Vcard
          </motion.h3>

          <Link href="/vcard/dashboard">
            <Button
              variant="outline"
              className="flex cursor-pointer items-center gap-2 text-sm border-gray-300 hover:border-gray-400 hover:bg-muted transition-all shadow-sm"
            >
              <Settings className="w-4 h-4" />
              Quản lý Vcard
            </Button>
          </Link>
        </div>

        {error && (
          <motion.div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="body">
            <div className="w-full">
              {/* Vcard Name */}
              <motion.div variants={cardVariants} initial="hidden" animate="visible">
                <Collapsible open={isOpenMap.vcard} onOpenChange={() => toggleSection('vcard')}>
                  <Card className="shadow-md rounded-lg py-0 gap-0">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="flex flex-row items-center justify-between cursor-pointer px-4 py-3">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-800">Tên Vcard</CardTitle>
                          <CardDescription className="text-sm text-gray-600">Tên để quản lý Vcard</CardDescription>
                        </div>
                        <motion.div variants={chevronVariants} animate={isOpenMap.vcard ? 'open' : 'closed'}>
                          {isOpenMap.vcard ? <ChevronUp className="h-4 w-4 text-gray-700" /> : <ChevronDown className="h-4 w-4 text-gray-700" />}
                        </motion.div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <AnimatePresence>
                      {isOpenMap.vcard && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <CardContent className="px-4 py-3">
                            <Input
                              id="vcardName"
                              value={formData.vcardName}
                              onChange={handleInputChange}
                              className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                              type="text"
                              placeholder="Nhập tên Vcard"
                              required
                            />
                            <div className="mt-2.5">
                              <Label htmlFor="slug" className="text-sm text-gray-700 mb-1.5">
                                Link Vcard
                              </Label>
                              <Input
                                id="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                placeholder="dev-web-it"
                                className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                              />
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </Collapsible>
              </motion.div>

              {/* Design */}
              <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                <Collapsible open={isOpenMap.design} onOpenChange={() => toggleSection('design')}>
                  <Card className="mt-4 shadow-md rounded-lg py-0 gap-0">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="flex flex-row items-center justify-between cursor-pointer px-4 py-3">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-800">Chọn thiết kế</CardTitle>
                          <CardDescription className="text-sm text-gray-600">Vui lòng chọn mã màu</CardDescription>
                        </div>
                        <motion.div variants={chevronVariants} animate={isOpenMap.design ? 'open' : 'closed'}>
                          {isOpenMap.design ? <ChevronUp className="h-4 w-4 text-gray-700" /> : <ChevronDown className="h-4 w-4 text-gray-700" />}
                        </motion.div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <AnimatePresence>
                      {isOpenMap.design && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <CardContent className="px-4 py-3">
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              {colorSchemes.map((scheme, index) => (
                                <motion.div
                                  key={index}
                                  className={`flex flex-col rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                                    selectedScheme.primary === scheme.primary &&
                                    selectedScheme.secondary === scheme.secondary
                                      ? 'border-blue-500 shadow-md'
                                      : 'border-transparent'
                                  }`}
                                  onClick={() => setSelectedScheme(scheme)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <div className="h-10" style={{ backgroundColor: scheme.primary }} />
                                  <div className="h-10" style={{ backgroundColor: scheme.secondary }} />
                                </motion.div>
                              ))}
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-base font-medium text-gray-800">Màu chính</p>
                                <p className="text-base text-gray-600">{selectedScheme.primary}</p>
                              </div>
                              <div>
                                <p className="text-base font-medium text-gray-800">Màu phụ</p>
                                <p className="text-base text-gray-600">{selectedScheme.secondary}</p>
                              </div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-full border-gray-300 hover:bg-gray-100"
                                  onClick={handleReset}
                                >
                                  <RotateCcw className="h-4 w-4 text-gray-700" />
                                </Button>
                              </motion.div>
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </Collapsible>
              </motion.div>

              {/* Personal Information */}
              <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                <Collapsible open={isOpenMap.personal} onOpenChange={() => toggleSection('personal')}>
                  <Card className="mt-4 shadow-md rounded-lg py-0 gap-0">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="flex flex-row items-center justify-between cursor-pointer px-4 py-3">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-800">Thông tin cá nhân</CardTitle>
                        </div>
                        <motion.div variants={chevronVariants} animate={isOpenMap.personal ? 'open' : 'closed'}>
                          {isOpenMap.personal ? <ChevronUp className="h-4 w-4 text-gray-700" /> : <ChevronDown className="h-4 w-4 text-gray-700" />}
                        </motion.div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <AnimatePresence>
                      {isOpenMap.personal && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <CardContent className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="name" className="text-sm text-gray-700 mb-1.5">
                                Tên *
                              </Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g. Minh"
                                className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastname" className="text-sm text-gray-700 mb-1.5">
                                Họ và tên lót
                              </Label>
                              <Input
                                id="lastname"
                                value={formData.lastname}
                                onChange={handleInputChange}
                                placeholder="e.g. Nguyễn Văn"
                                className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="image" className="text-sm text-gray-700 mb-1.5">
                                Hình ảnh
                              </Label>
                              <motion.div
                                className="border border-dashed rounded-md p-3 text-center border-gray-300"
                                whileHover={{ borderColor: '#3B82F6' }}
                                transition={{ duration: 0.3 }}
                              >
                                <p className="text-sm text-gray-600 mb-2">
                                  Upload image (.jpg, .png, .svg) <br />
                                  Maximum size: 5 MB
                                </p>
                                <Input
                                  id="image"
                                  type="file"
                                  accept=".jpg,.png,.svg"
                                  onChange={handleFileChange}
                                  className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                                />
                              </motion.div>
                              {(image || existingImage) && (
                                <motion.img
                                  src={image ? URL.createObjectURL(image) : existingImage || ''}
                                  alt="Preview"
                                  className="mt-2 max-w-[120px] max-h-[120px] rounded-md object-cover aspect-square"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                />
                              )}
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </Collapsible>
              </motion.div>

              {/* Image Cropping Modal */}
              <Dialog open={isCropping} onOpenChange={setIsCropping}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Cắt ảnh</DialogTitle>
                  </DialogHeader>
                  <div className="relative h-[400px] w-full">
                    {imageSrc && (
                      <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        minZoom={0.5}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        restrictPosition={false}
                      />
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="zoom">Phóng to:</Label>
                      <Input
                        id="zoom"
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-[150px]"
                      />
                    </div>
                    <Button onClick={handleCrop} className="bg-blue-500 hover:bg-blue-600">
                      Xác nhận
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Contact */}
              <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                <Collapsible open={isOpenMap.contact} onOpenChange={() => toggleSection('contact')}>
                  <Card className="mt-4 shadow-md rounded-lg py-0 gap-0">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="flex flex-row items-center justify-between cursor-pointer px-4 py-3">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-800">Liên hệ</CardTitle>
                        </div>
                        <motion.div variants={chevronVariants} animate={isOpenMap.contact ? 'open' : 'closed'}>
                          {isOpenMap.contact ? <ChevronUp className="h-4 w-4 text-gray-700" /> : <ChevronDown className="h-4 w-4 text-gray-700" />}
                        </motion.div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <AnimatePresence>
                      {isOpenMap.contact && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <CardContent className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="phone" className="text-sm text-gray-700 mb-1.5">
                                Số điện thoại
                              </Label>
                              <Input
                                id="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="e.g. +84912345678"
                                className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="altPhone" className="text-sm text-gray-700 mb-1.5">
                                Số điện thoại khác
                              </Label>
                              <Input
                                id="altPhone"
                                value={formData.altPhone}
                                onChange={handleInputChange}
                                placeholder="e.g. +84987654321"
                                className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email" className="text-sm text-gray-700 mb-1.5">
                                Email
                              </Label>
                              <Input
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="e.g. minh.nguyen@email.com"
                                className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                                type="email"
                              />
                            </div>
                            <div>
                              <Label htmlFor="website" className="text-sm text-gray-700 mb-1.5">
                                Website
                              </Label>
                              <Input
                                id="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                placeholder="e.g. https://minhnguyen.com"
                                className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                              />
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </Collapsible>
              </motion.div>

              {/* Company */}
              <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
                <Collapsible open={isOpenMap.company} onOpenChange={() => toggleSection('company')}>
                  <Card className="mt-4 shadow-md rounded-lg py-0 gap-0">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="flex flex-row items-center justify-between cursor-pointer px-4 py-3">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-800">Thông tin công ty</CardTitle>
                        </div>
                        <motion.div variants={chevronVariants} animate={isOpenMap.company ? 'open' : 'closed'}>
                          {isOpenMap.company ? <ChevronUp className="h-4 w-4 text-gray-700" /> : <ChevronDown className="h-4 w-4 text-gray-700" />}
                        </motion.div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <AnimatePresence>
                      {isOpenMap.company && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <CardContent className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="company" className="text-sm text-gray-700 mb-1.5">
                                Tên công ty
                              </Label>
                              <Input
                                id="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                placeholder="e.g. Công ty TNHH Minh Nguyễn"
                                className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="profession" className="text-sm text-gray-700 mb-1.5">
                                Nghề nghiệp
                              </Label>
                              <Input
                                id="profession"
                                value={formData.profession}
                                onChange={handleInputChange}
                                placeholder="e.g. Kỹ sư phần mềm"
                                className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                              />
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </Collapsible>
              </motion.div>

              {/* Summary */}
              <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
                <Collapsible open={isOpenMap.summary} onOpenChange={() => toggleSection('summary')}>
                  <Card className="mt-4 shadow-md rounded-lg py-0 gap-0">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="flex flex-row items-center justify-between cursor-pointer px-4 py-3">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-800">Tóm tắt</CardTitle>
                        </div>
                        <motion.div variants={chevronVariants} animate={isOpenMap.summary ? 'open' : 'closed'}>
                          {isOpenMap.summary ? <ChevronUp className="h-4 w-4 text-gray-700" /> : <ChevronDown className="h-4 w-4 text-gray-700" />}
                        </motion.div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <AnimatePresence>
                      {isOpenMap.summary && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <CardContent className="px-4 py-3">
                            <Label htmlFor="summary" className="text-sm text-gray-700 mb-1.5">
                              Tóm tắt cá nhân
                            </Label>
                            <Input
                              id="summary"
                              value={formData.summary}
                              onChange={handleInputChange}
                              placeholder="e.g. Kỹ sư phần mềm với 5 năm kinh nghiệm"
                              className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                            />
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </Collapsible>
              </motion.div>

              {/* Address */}
              <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.6 }}>
                <Collapsible open={isOpenMap.address} onOpenChange={() => toggleSection('address')}>
                  <Card className="mt-4 shadow-md rounded-lg py-0 gap-0">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="flex flex-row items-center justify-between cursor-pointer px-4 py-3">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-800">Địa chỉ</CardTitle>
                        </div>
                        <motion.div variants={chevronVariants} animate={isOpenMap.address ? 'open' : 'closed'}>
                          {isOpenMap.address ? <ChevronUp className="h-4 w-4 text-gray-700" /> : <ChevronDown className="h-4 w-4 text-gray-700" />}
                        </motion.div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <AnimatePresence>
                      {isOpenMap.address && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <CardContent className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="street" className="text-sm text-gray-700 mb-1.5">
                                Đường
                              </Label>
                              <Input
                                id="street"
                                value={formData.street}
                                onChange={handleInputChange}
                                placeholder="e.g. 123 Đường Láng"
                                className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="postal" className="text-sm text-gray-700 mb-1.5">
                                Mã bưu điện
                              </Label>
                              <Input
                                id="postal"
                                value={formData.postal}
                                onChange={handleInputChange}
                                placeholder="e.g. 100000"
                                className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="city" className="text-sm text-gray-700 mb-1.5">
                                Thành phố
                              </Label>
                              <Input
                                id="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="e.g. Hà Nội"
                                className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="state" className="text-sm text-gray-700 mb-1.5">
                                Tỉnh/Thành
                              </Label>
                              <Input
                                id="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                placeholder="e.g. Hà Nội"
                                className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="country" className="text-sm text-gray-700 mb-1.5">
                                Quốc gia
                              </Label>
                              <Input
                                id="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                placeholder="e.g. Việt Nam"
                                className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                              />
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </Collapsible>
              </motion.div>

              {/* Social Media */}
              <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.7 }}>
                <Collapsible open={isOpenMap.social} onOpenChange={() => toggleSection('social')}>
                  <Card className="mt-4 shadow-md rounded-lg py-0 gap-0">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="flex flex-row items-center justify-between cursor-pointer px-4 py-3">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-800">Mạng xã hội</CardTitle>
                          <CardDescription className="text-sm text-gray-600">Nhập thông tin mạng xã hội</CardDescription>
                        </div>
                        <motion.div variants={chevronVariants} animate={isOpenMap.social ? 'open' : 'closed'}>
                          {isOpenMap.social ? <ChevronUp className="h-4 w-4 text-gray-700" /> : <ChevronDown className="h-4 w-4 text-gray-700" />}
                        </motion.div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <AnimatePresence>
                      {isOpenMap.social && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <CardContent className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="facebook" className="text-sm text-gray-700 mb-1.5">
                                Facebook Link
                              </Label>
                              <Input
                                id="facebook"
                                value={formData.facebook}
                                onChange={handleInputChange}
                                placeholder="e.g. https://facebook.com/minhnguyen"
                                className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="instagram" className="text-sm text-gray-700 mb-1.5">
                                Instagram Link
                              </Label>
                              <Input
                                id="instagram"
                                value={formData.instagram}
                                onChange={handleInputChange}
                                placeholder="e.g. https://instagram.com/minhnguyen"
                                className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="zalo" className="text-sm text-gray-700 mb-1.5">
                                Zalo Link
                              </Label>
                              <Input
                                id="zalo"
                                value={formData.zalo}
                                onChange={handleInputChange}
                                placeholder="e.g. https://zalo.me/minhnguyen"
                                className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="whatsapp" className="text-sm text-gray-700 mb-1.5">
                                Whatsapp Link
                              </Label>
                              <Input
                                id="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleInputChange}
                                placeholder="e.g. https://wa.me/+84912345678"
                                className="text-base p-2 rounded-md border-gray-300 focus:ring-gray-500"
                              />
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </Collapsible>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                className="mt-6 flex justify-end"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.9 }}
              >
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang cập nhật...' : 'Cập nhật Vcard'}
                </Button>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}