import React from "react";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

interface BreadCrumbsProps {
    breadCrumbs: {
        name: string,
        url: string
    }[]
}

const BreadCrumbs = ({ breadCrumbs }: BreadCrumbsProps) => {
  return (
    <section className="py-5 sm:py-7 bg-blue-100">
      <div className="container max-w-screen-xl mx-auto px-4">
        <ol className="inline-flex flex-wrap text-gray-600 space-x-1 md:space-x-3 items-center">
          {breadCrumbs?.map((breadCrumb, index) => (
            <li key={index} className="inline-flex items-center">
              <Link
                href={breadCrumb.url}
                className="text-gray-600 hover:text-blue-600"
              >
                {breadCrumb.name}
              </Link>
              {breadCrumbs?.length - 1 !== index && (
                <div className="ml-3 text-gray-400">
                  <FaChevronRight />
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default BreadCrumbs;