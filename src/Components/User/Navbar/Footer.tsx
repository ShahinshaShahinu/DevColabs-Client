import { useState } from 'react';
import { AiFillHome } from 'react-icons/ai'
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  SelectCategory: (data: string) => void;
  ClickedHashtag: (data: string) => void;
}

function Footer({ SelectCategory, ClickedHashtag }: FooterProps) {
  const Navigate = useNavigate();
  const { userId } = useSelector((state: any) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div>
        <footer className="bg-gray-800 md:hidden text-white p-4 fixed bottom-0 left-0 w-full">
          <nav className="container mx-auto flex items-center justify-center">
            <div className="md:hidden">
              <div className="flex space-x-4">
                <a className="hover:text-gray-400">
                  <AiFillHome className='text-2xl mx-5 cursor-pointer' onClick={() => { Navigate('/'), SelectCategory('Latest'), ClickedHashtag('') }} />
                </a>
                <a className="hover:text-gray-400">
                  <HiOutlineUserGroup className='text-2xl mx-5 cursor-pointer' onClick={() =>{userId ? Navigate('/Commuity'): setIsModalOpen(!isModalOpen)} } />
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <span className="text-sm">
                © 2023 DevColab. All rights reserved.
              </span>
            </div>
          </nav>
        </footer>
      </div>


      {isModalOpen && (
        <div
          id="popup-modal"
          tabIndex={-1}
          className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50"
        >
          <div className="relative w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-300">
              <div className="p-2 text-center ">
                <div className="border-2 border-gray-500 rounded-md p-2">
                  <svg
                    className="mx-auto mb-4 text-red-800 w-12 h-12 dark:text-gr"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <h3 className="mb-5 text-2xl font-normal text-gray-900 dark:text-gray-900">
                    Please Login to Proceed
                  </h3>
                  <div className="flex justify-center items-center">
                    <button
                      data-modal-hide="popup-modal"
                      type="button"
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                      onClick={()=>setIsModalOpen(!isModalOpen)}
                    >
                      Close
                    </button>
                    <button
                      className="ml-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                      onClick={() => Navigate('/login')}
                    >
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </>

  )
}

export default Footer