"use client";

import { ProductProps } from '@/interfaces';
import Filter from '../layouts/Filter';
import CustomPagination from '../layouts/CustomPagination';
import ProductItem from './ProductItem';

interface ListProductsProps {
  data: {
    resPerPage: number;
    productCount: number;
    filteredProductsCount: number;
    products: ProductProps[];
  }
}

const ListProducts = ({ data }: ListProductsProps) => {

  if (!data) return <div className="text-center text-gray-600">Loading...</div>

  if (!data.products || data.products.length === 0) {
    return <div className="text-center text-gray">No Product Available.</div>
  }

  return (
    <section className='py-12'>
      <div className="container max-w-screen-xl m-auto px-4">
        <div className="flex flex-col md:flex-row -mx-4">
          <Filter />

          <main className="md:w-2/3 lg:w-3/4 px-3">
            {data.products?.map((product) => (
              <ProductItem product={product} key={product._id}/>
            ))}

            <CustomPagination resPerPage={data?.resPerPage} productCount={data?.filteredProductsCount} />

          </main>
        </div>
      </div>
    </section>
  )
}

export default ListProducts