"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import Pagination from 'react-paginate';

type CustomPaginationProps = {
  resPerPage: number;
  productCount: number;
}

const CustomPagination = ({ resPerPage, productCount }: CustomPaginationProps) => {

  const router = useRouter()
  const searchParams = useSearchParams()

  let page = searchParams?.get('page') || 1;
  page = Number(page) - 1
  
  let pageCount = Math.ceil(productCount / resPerPage);
  let queryParams;

  const handlePageChange = (currentPage: { selected: number }) => {
    if (typeof window !== "undefined") {
      queryParams = new URLSearchParams(window.location.search);

      let thisPage = String(currentPage.selected + 1);
      
      if (queryParams.has("page")) {
        queryParams.set("page", thisPage);
      } else {
        queryParams.append("page", thisPage);
      }

      const path = window.location.pathname + "?" + queryParams.toString();

      router.push(path);
    }
  }

  return (
    <div className="flex mt-20 justify-center">
      <Pagination
        initialPage={page}
        nextLabel="next >"
        onPageChange={handlePageChange}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="< previous"
        pageClassName="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
        pageLinkClassName="page-link"
        previousClassName="relative inline-flex items-center border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 focus:z-20"
        previousLinkClassName="page-link"
        nextClassName="relative inline-flex items-center border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-500 hover:bg-blue-50 focus:z-20"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="relative inline-flex items-center border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-500 hover:bg-green-50 focus:z-20"
        breakLinkClassName="page-link"
        activeClassName="z-10 border border-indigo-500 bg-indigo-50 text-indigo-600"
        renderOnZeroPageCount={null}
      />
    </div>
  )
}

export default CustomPagination