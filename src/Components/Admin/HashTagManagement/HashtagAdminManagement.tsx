import { useEffect, useState } from "react";
import NavbarSidebar from "../NavbarSidebar/NavbarSidebar"
import { api } from "../../../services/axios";
import { HashtagVAlidation } from "../../../utils/adminValidation/adminLoginValidation";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import UserPostHashtagManage from "./UserPostHashtagManage";
import { BiLeftArrowAlt } from "react-icons/bi";



interface IHashtag {
    _id: string,
    Hashtag: string;
    createdAt: string;
}


function HashtagAdminManagement() {
    const navigate = useNavigate()
    const [selectedDate, setSelectedDate] = useState<string | undefined>();
    const [hashtag, setHashtag] = useState<string>('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [fetchHashTag, setfetchHashTag] = useState<IHashtag[]>([])
    const [DeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState('');
    const [PostHashtag, setPostHashtag] = useState(false)
  

    const HandleDate = (DAte: string | undefined) => {
        setSelectedDate(DAte)
    }

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };




    const HashtagERror = (err: string | undefined) => toast.error(err, {
        position: "bottom-right"
    })
    const HashtagSucess = (success: string) => {
        toast.success(success, {
            position: 'bottom-right',
        });
    }


    const submitForm = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const DateStr = selectedDate?.toString()
            const ErrORtrue = HashtagVAlidation(hashtag, DateStr);

            if (ErrORtrue === 'Invalid') {
                HashtagERror('Invalid hashtag format')
            }
            if (ErrORtrue === 'Date') {
                HashtagERror('Invalid date format. Please use DD-MM-YYYY')
            }

            if (ErrORtrue === true) {

                const response = await api.post('/admin/AddHashtag', { selectedDate, hashtag }, { withCredentials: true });


                if (response) {
                    HashtagSucess('successfully added');
                    closeModal();
                    setSelectedDate('')
                }
            }

        } catch (error) {

            console.error('Error:', error);
        }
    };


    const formatDate = (isoDate: string | undefined): string => {
        if (!isoDate) {
            return '';
        }

        const originalDate = new Date(isoDate);

        const year = originalDate.getFullYear();
        const month = originalDate.getMonth() + 1; // Months are zero-indexed
        const day = originalDate.getDate();
        const hours = originalDate.getHours();
        const minutes = originalDate.getMinutes();
        const seconds = originalDate.getSeconds();

        return `${year}-${month}-${day}   ${hours}:${minutes}:${seconds}`;
    };




    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setDeleteItemId('');
    };

    const openDeleteModal = (id: string) => {
        setDeleteModalOpen(true);
        setDeleteItemId(id);
    };

    const sureDelete = async () => {
        try {
            await DeleteTAg();

        } catch (error) {

        } finally {
            setDeleteModalOpen(false);
        }
    };



    const DeleteTAg = async () => {

        try {


            if (deleteItemId) {

                console.log('Deleting item with ID:', deleteItemId);

                const response = await api.post(`/admin/AddHashtag/Delete/${deleteItemId}`, { withCredentials: true });

                if (response) {

                    HashtagSucess('deleted successfully')
                }

            }

        } catch (error) {

        }
    }



    useEffect(() => {

        const fetchHashtags = async () => {
            try {

                const Hashtags = await api.get('/admin/HashTagManageMent', { withCredentials: true });
                console.log(Hashtags, 'hahshsh');

                setfetchHashTag(Hashtags.data)
            } catch (error) {
                const errorWithResponse = error as { response?: { data?: { error?: string } } };
                console.log(error, 'eere');

                if (errorWithResponse?.response?.data?.error === 'Invalid token.') {
                    localStorage.removeItem('admin');
                    navigate('/admin/login')
                }

            }

        }

        fetchHashtags()

    }, [deleteItemId, DeleteModalOpen, isModalOpen]);

   



    return (
        <>


            <NavbarSidebar />


            <div className="p-4 sm:ml-64">
                <div className="p-6 mt-20">

                    <button onClick={openModal}
                        type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Add HashTag</button>


                    {PostHashtag ? (
                        <>
                            <button
                                onClick={() => setPostHashtag(false)}
                                type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                                <BiLeftArrowAlt className="mr-1 text-xl  inline-block" />
                                Admin HashTag
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setPostHashtag(true)}
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            Post HashTag <FaArrowRight className="ml-1 inline-block" />
                        </button>
                    )}








                    <div className="flex-1 pt-3 pl-3 overflow-x-auto">
                        <div>
                            {isModalOpen && (
                                <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
                                    <div className=" p-1 rounded-lg w-[50rem] left-10 relative shadow-lg  max-w-2xl max-h-full">
                                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-">
                                            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    Add Hashtag
                                                </h3>
                                                <button onClick={closeModal}
                                                    type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="staticModal">
                                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                    </svg>
                                                    <span className="sr-only">Close modal</span>
                                                </button>
                                            </div>



                                            <form onSubmit={submitForm}
                                                className="p-10 relative">
                                                <div className="grid md:grid-cols-2 p-4  md:gap-6">
                                                    <div className="relative z-0 w-full mb-6  group">
                                                        <input onChange={(e) => { setHashtag(e.target.value) }}

                                                            type="text" name="floating_first_name" id="floating_first_name" className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                                        <label htmlFor="floating_first_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">#HashTag</label>
                                                    </div>

                                                    <div className="relative z-0  mb-6 group">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                                            </svg>
                                                        </div>
                                                        <input
                                                            type="date"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            placeholder="Select date"
                                                            onChange={(e) => HandleDate(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="pl-4">
                                                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>

                                                </div>
                                            </form>
                                        </div>
                                        <ToastContainer />
                                    </div>
                                </div>

                            )}
                        </div>








                        {DeleteModalOpen && (
                            <div
                                id="popup-modal"

                                className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
                            >
                                <div className="relative w-full max-w-md max-h-full">
                                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                        <button
                                            type="button"
                                            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                            onClick={closeDeleteModal}
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
                                        <div className="p-6 text-center">
                                            <svg
                                                className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
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
                                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                Are you sure you want to delete this #HashTag?
                                            </h3>
                                            <button
                                                onClick={sureDelete}
                                                data-modal-hide="popup-modal"
                                                type="button"
                                                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                                            >
                                                Yes, I'm sure
                                            </button>
                                            <button
                                                data-modal-hide="popup-modal"
                                                type="button"
                                                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                                onClick={closeDeleteModal}
                                            >
                                                No, cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}







                        <ToastContainer />
                    </div>





                    {PostHashtag ? (
                        <>
                            <UserPostHashtagManage  />
                        </>
                    ) : (

                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>

                                        <th scope="col" className="px-6 py-3">
                                            # HashTags
                                        </th>


                                        <th scope="col" className="px-6 py-3">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Delete
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>



                                    {fetchHashTag && fetchHashTag.map((tag, index) => (
                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">


                                            <td className="px-6 py-4">
                                                {tag?.Hashtag}
                                            </td>

                                            <td className="px-6 py-4">
                                                {formatDate(tag?.createdAt)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    //  onClick={() => DeleteTAg(tag?._id)}
                                                    onClick={() => openDeleteModal(tag?._id)}
                                                    type="button" className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
                                                    Delete</button>
                                            </td>

                                        </tr>
                                    ))}



                                </tbody>
                            </table>

                        </div>

                    )}





                </div>
            </div>
           
        </>
    )
}

export default HashtagAdminManagement