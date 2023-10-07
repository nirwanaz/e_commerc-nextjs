import Image from 'next/image'

import axios from 'axios'
import ListProducts from '@/components/products/ListProducts';

import queryString from 'query-string';

type HomeProps = {
  searchParams: URLSearchParams;
}

const getProducts = async (searchParams: any) => {

  const urlParams = {
    keyword: searchParams.keyword,
    page: searchParams.page,
    category: searchParams.category,
    "price[gte]": searchParams.min,
    "price[lte]": searchParams.max,
    "ratings[gte]": searchParams.ratings,
  }

  const searchQuery = queryString.stringify(urlParams)

  try {
    const { data } = await axios.get(`${process.env.API_URL}/api/products?${searchQuery}`);
    return data;

  } catch (error) {
    throw error;
  }
}

export default async function Home({ searchParams }: HomeProps) {
  const productsData = await getProducts(searchParams)
  
  return (
    <main className="overflow-hidden">
      <ListProducts data={productsData} />
    </main>
  )
}
