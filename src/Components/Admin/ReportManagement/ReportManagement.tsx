import { useEffect, useState } from "react"
import { BlockReportedPost, DeleteRePortPost, UnBlockReportedPost, getReportedPosts } from "../../../services/API functions/AdminApi"
import { ReportPostData } from '../../../../../DevColab-Server/src/domain/models/ReportPost';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

function ReportManagement() {


  const [ReportPosts, setReportPosts] = useState<ReportPostData[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<number | null>(null);
  const [Refresh, setRefresh] = useState(false);

  const [isOpenUserModal, setisOpenUserModal] = useState(Boolean);

  useEffect(() => {
    const fetchReportPosts = async () => {
      try {
        const ReportedPosts = await getReportedPosts();
        setReportPosts(ReportedPosts.data); // Access the data property from API response
        console.log(ReportedPosts.data);

      } catch (error) {
        console.error(error);
      }
    };
    fetchReportPosts();
    setRefresh(false);
  }, [Refresh, setRefresh]);

  const toggleDropdown = (index: number) => {
    if (isDropdownOpen === index) {
      setIsDropdownOpen(null);
    } else {
      setIsDropdownOpen(index);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState('');
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const toggleModal = (postId: string) => {
    setSelectedPost(postId);
    setIsModalOpen(!isModalOpen);
  };

  const deleteReportPosts = async (PostId: string) => {
    try {
      console.log(PostId);
      
     const deleted= await DeleteRePortPost(PostId)
     console.log(deleted);
     setRefresh(true)
    } catch (error) {
      console.log(error);

    }
  }
  const handleDeleteClick = () => {
  console.log('dele clicked modal opern');
    setIsDeleteConfirmationOpen(true);
  };
  const handleCancelDelete = () => {
    setIsDeleteConfirmationOpen(false);
  };






  return (
    <>
      <div className="p-4 sm:ml-64">
        <div className="p-6 mt-20">
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>

                  <th scope="col" className="px-6 py-3">
                    Reported Post
                  </th>


                  <th scope="col" className="px-6 py-3">
                    Reason
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Block/Unblock
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Options
                  </th>
                </tr>
              </thead>

              <tbody>
                {ReportPosts && ReportPosts.map((ReportPost, index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td key={ReportPost?._id} className="px-6 py-4">
                      {ReportPost?.PostId?.title}
                    </td>
                    <td className="px-6 py-4">
                      {ReportPost?.ReportReason}
                    </td>
                    <td className="px-6 py-4">
                      {ReportPost?.ReportDate}
                    </td>
                    <td className="px-6 flex py-4">
                      {ReportPost?.PostId?.status ? <span className="active-status">Active</span> : <span className="inactive-status">Inactive</span>}
                    </td>
                    <td className="px-6 py-4">
                      {ReportPost?.PostId?.status ?
                        <button
                          onClick={() => { BlockReportedPost(ReportPost?.PostId?._id), setRefresh(true) }}
                          type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Inactive</button>
                        :
                        <button
                          onClick={() => { UnBlockReportedPost(ReportPost?.PostId?._id), setRefresh(true) }}
                          type="button" className="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Active</button>
                      }
                    </td>

                    <td className="px-6 py-4">
                      <div className="relative  inline-block">
                        <button
                          onClick={() => toggleDropdown(index)}
                          className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                          type="button"
                        >
                          {isDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
                          <span>Options</span>
                        </button>
                        {isDropdownOpen === index && (
                          <div className="z-50  bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 top-2">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                              <li>

                              </li>
                              <li className="flex justify-center">
                                <button
                                  onClick={handleDeleteClick}
                                  type="button" className="focus:outline-none py-2 px-4 rounded-full text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium  text-sm  mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
                                  Delete</button>
                              </li>
                              <li className="flex justify-center">
                                <button
                                  onClick={() => { toggleModal(ReportPost?.PostId?._id) }}
                                  className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                                  View
                                </button>
                              </li>
                            </ul>


                            {isDeleteConfirmationOpen && (
                              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                                <div className="bg-white p-8 rounded-lg shadow-lg">
                                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-900">
                                        View Post
                                      </h3>
                                  </div>
                                  <p className="p-10 font-serif text-black" >Are you sure you want to delete this?</p>
                                  <button onClick={() =>{deleteReportPosts(ReportPost?.PostId?._id),setIsDeleteConfirmationOpen(false);} } className="mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                                    Confirm Delete
                                  </button>
                                  <button onClick={handleCancelDelete} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded">
                                    Cancel
                                  </button>
                                </div>
                               
                              </div>
                            )}





                            {isModalOpen && selectedPost && (
                              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                                <div className="flex w-full max-w-2xl h-full pt-10 pb-10 mb-10  relative">
                                  <div className="relative dark:bg-white rounded-lg bg-gray-700 overflow-auto">
                                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-900">
                                        View Post
                                      </h3>
                                      <button
                                        onClick={() => setIsModalOpen(false)}
                                        type="button"
                                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                      >
                                        <svg
                                          className="w-3 h-3"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 14 14"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                          />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                      </button>
                                    </div>
                                    <div className="p-6 space-y-6">
                                      <img

                                        src={ReportPost?.PostId?.image}
                                        alt="Main Post"
                                        className="mb-4 w-52"
                                      />
                                      <div className="border-t border-gray-300 my-4"></div>
                                      <p className="text-black font-semibold text-lg top-1 relative">Reported user</p>
                                      <div className="flex items-center space-x-4">
                                        <img
                                          onClick={() => setisOpenUserModal(true)}
                                          src={ReportPost?.userId?.profileImg}
                                          alt="User"
                                          className="w-10 cursor-pointer h-10 rounded-full"
                                        />
                                        <div className="flex flex-col">
                                          <span className="text-gray-700">
                                            {ReportPost?.userId?.UserName}
                                          </span>
                                          <span className="text-gray-400">
                                            {ReportPost?.ReportDate}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="border-t border-gray-300 my-4"></div>
                                      <p className="text-black font-semibold text-lg top-1 relative">Posted by </p>
                                      <div className="flex items-center space-x-4">
                                        <img
                                          src={ReportPost?.PostId?.userId?.profileImg}
                                          alt="User"
                                          className="w-10 cursor-pointer h-10 rounded-full"
                                        />
                                        <div className="flex flex-col">
                                          <span className="text-gray-700">
                                            {ReportPost?.PostId?.userId?.UserName}
                                          </span>
                                          <span className="text-gray-400">
                                            {ReportPost?.PostId?.Date}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="border-t border-gray-300 my-4"></div>
                                      <div className="flex flex-col space-y-4">
                                        <h4 className="text-gray-900 text-lg font-semibold">
                                          Title: {ReportPost?.PostId?.title}
                                        </h4>
                                        <div
                                          className="pl-3 border-l-4 border-gray-500"
                                          dangerouslySetInnerHTML={{ __html: ReportPost?.PostId?.content }} />

                                        <div className="border-t border-gray-300 my-4"></div>
                                        <button
                                          onClick={() => setIsModalOpen(false)}
                                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-full"
                                        >
                                          Close
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            )}





                            {isOpenUserModal && (
                              <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-8 rounded-lg w-[50rem] left-10 relative shadow-lg">

                                  <h2 className="text-2xl font-semibold mb-2">User Profile</h2>

                                  <div className="w-[100%] h-20 rounded-sm overflow-hidden mb-4">
                                    <img
                                      src={ReportPost?.userId?.UserBackgroundImage}
                                      alt="Background Image"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="border-b-2 mb-4"></div>


                                  <div className="w-11 h-11 rounded-full overflow-hidden mb-4 inline-block">
                                    <img
                                      src={ReportPost?.userId?.profileImg}
                                      alt="User Profile"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>


                                  <p className="font-semibold text-lg bottom-8 left-2 relative inline">{ReportPost?.userId?.UserName}</p>
                                  <p className="font-semibold text-sm bottom-8 left-3 relative inline-block">  ({ReportPost?.userId?.profile?.Pronouns || 'No Pronouns available'})</p>
                                  <div>
                                    <p className="inline bottom-2 relative">FirstName: </p> <p className="inline font-semibold text-md bottom-2 relative ">{ReportPost?.userId?.profile?.FirstName || 'No FirstName available'}</p>
                                  </div>
                                  <div>
                                    <p className="inline  relative">LastName: </p> <p className="inline-block font-semibold text-md mb-2">{ReportPost?.userId?.profile?.LastName || 'No LastName available'}</p>

                                  </div>
                                  <div>
                                    /<p className="inline  relative">Headline : </p> <p className="inline-block font-semibold text-md mb-2">{ReportPost?.userId?.profile?.Headline || 'No Headline   available'}</p>

                                  </div>
                                  <div>
                                    <p className="inline-block  relative">Hashtags : </p>  <p className="inline-block font-semibold text-md mb-2">{ReportPost?.userId?.profile?.Hashtags || 'No Hashtags   available'}</p>

                                  </div>



                                  <p className="font-semibold text-lg mb-2 inline">About Me:</p>
                                  <p className="inline-block">

                                    {ReportPost?.userId?.profile?.AboutMe ? (
                                      <p>{ReportPost?.userId?.profile?.profile?.AboutMe}</p>
                                    ) : (
                                      <p className="text-gray-500">&nbsp; No information available</p>
                                    )}
                                  </p>
                                  <div>
                                    <button
                                      onClick={() => setisOpenUserModal(false)}
                                      className="mt-6 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
                                    >
                                      Close
                                    </button>
                                  </div>

                                </div>
                              </div>
                            )}




                          </div>

                        )}
                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>

          </div>
        </div>
      </div>

    </>
  )
}

export default ReportManagement







