'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Image from 'next/image'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'

interface Vcard {
  _id: string
  name: string
  vcardName: string
  slug?: string
  email?: string
  phone?: string
  createdAt: string
  image?: string
}


function VcardSkeleton() {
  return (
    <div className="bg-white rounded-xl border p-6 animate-pulse space-y-4 shadow">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="w-1/3 h-4 bg-gray-300 rounded" />
          <div className="w-1/4 h-3 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  )
}



export default function DashboardComponent() {
  
  const [vcards, setVcards] = useState<Vcard[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [, setShowDialog] = useState(false)
  const [selectedVcardId, setSelectedVcardId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchVcards = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/vcard')
        const data = await res.json()        
        setVcards(data)
      } catch (error) {
        console.error('Failed to fetch vcards:', error)
        toast.error('Không thể tải danh sách Vcard')
      } finally {
        setLoading(false)
      }
    }

    fetchVcards()
  }, [])

  const handleDelete = async () => {
    if (!selectedVcardId) return
    try {
      setDeletingId(selectedVcardId)
      const res = await fetch(`/api/vcard/${selectedVcardId}`, { method: 'DELETE' })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Lỗi xoá Vcard')
        return
      }

      setVcards((prev) => prev.filter((v) => v._id !== selectedVcardId))
      toast.success('Xoá Vcard thành công!')
    } catch (error) {
      console.error('Lỗi khi xoá:', error)
      toast.error('Xoá không thành công')
    } finally {
      setShowDialog(false)
      setDeletingId(null)
    }
  }

  return (
    <section className="dashboard vcard py-12 bg-gray-100 min-h-screen">
      <div className="container mx-auto max-w-3xl px-4">
        <div className='flex justify-between items-center mb-8'>
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-800">📇 Quản lý Vcard</h1>
          <Link href="/vcard">
            <Button 
              className="flex cursor-pointer items-center gap-2 rounded-2xl px-5 py-2 text-white bg-primary hover:bg-primary/90 transition-all shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              Tạo Vcard
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <VcardSkeleton key={i} />)}
          </div>
        ) : vcards.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">Chưa có Vcard nào.</p>
        ) : (
          <div className="space-y-6">
            {vcards.map((vcard) => (
              <Card key={vcard._id} className="bg-white shadow-md rounded-xl border border-gray-200 transition hover:shadow-lg">
                <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {vcard.image ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_LINK_IMAGE}${vcard.image}`}
                        alt={vcard.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                        {vcard.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <div className="text-xl font-semibold text-gray-800">{vcard.name}</div>
                      <div className="text-sm text-gray-500">{vcard.vcardName}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Tạo lúc: {new Date(vcard.createdAt).toLocaleString()}
                  </div>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>Email: <span className="font-medium">{vcard.email || 'Không có'}</span></div>
                  <div>Điện thoại: <span className="font-medium">{vcard.phone || 'Không có'}</span></div>
                  {vcard.slug && (
                    <div className="md:col-span-2">Slug: <span className="font-medium">{vcard.slug}</span></div>
                  )}
                </CardContent>

                <CardFooter className="flex justify-end space-x-2">
                  <Link href={'/vcard/' + vcard.slug} target='_blank'>
                  <Button
                    variant="outline"
                    className="text-sm cursor-pointer"
                  >
                    Xem
                  </Button>
                  </Link>

                  <Link href={'/vcard/edit/' + vcard._id}>
                  <Button
                    variant="outline"
                    className="text-sm cursor-pointer"
                  >
                    Sửa
                  </Button>
                  </Link>


                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="text-sm"
                        onClick={() => {
                          setSelectedVcardId(vcard._id)
                          setShowDialog(true)
                        }}
                        disabled={deletingId === vcard._id}
                      >
                        {deletingId === vcard._id ? 'Đang xoá...' : 'Xoá'}
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Xoá Vcard</DialogTitle>
                      </DialogHeader>
                      <p>Bạn có chắc chắn muốn xoá Vcard này không? Đây là hành động không thể hoàn tác.</p>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDialog(false)}>Huỷ</Button>
                        <Button variant="destructive" onClick={handleDelete}>Xoá</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
