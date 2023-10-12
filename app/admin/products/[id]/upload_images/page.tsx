import UploadImages from '@/components/admin/UploadImages'
import mongoose from 'mongoose'
import { redirect } from 'next/navigation';
import React from 'react'

const HomePage = ({ params }: { params: { id: string }}) => {
  const isValidId = mongoose.isValidObjectId(params?.id);

  if (!isValidId) redirect('/admin/products');

  return <UploadImages id={params.id} />
}

export default HomePage