// Pagination.tsx

import React from 'react';
import ReactPaginate from 'react-paginate';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'; // Example icons from react-icons

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedPage: number) => void;
}

const CustomPagination: React.FC<PaginationProps> = ({ pageCount, onPageChange }) => {
  const handlePageClick = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1); // React-paginate uses zero-based indexing
  };

  return (
    <div className='relative '>
       <ReactPaginate
      previousLabel={<FaAngleLeft />}
      nextLabel={<FaAngleRight />}
      breakLabel={'...'}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={handlePageClick}
      containerClassName={'flex items-center justify-center mt-4'}
      pageClassName={'inline-block mx-2  rounded-full p-2 border border-blue-500 hover:bg-blue-500 hover:text-white cursor-pointer'}
      activeClassName={'bg-blue-500 text-white'}
      previousLinkClassName={' text-blue-700 rounded-full p-2'}
      nextLinkClassName={' text-blue-700 rounded-full p-2'}
      breakLinkClassName={'bg-blue-200 text-blue-700 rounded-full p-2'}
      disabledClassName={'text-gray-400 cursor-not-allowed'}
    />   
    </div>
  
  );
};

export default CustomPagination;
