import UploadImages from '@/components/admin/UploadImages'
import React from 'react'

interface HomePageProps {
    params: {
        id: string
    }
}

const HomePage = ({ params }: HomePageProps) => {
  return <UploadImages id={params.id} />
}

export default HomePage