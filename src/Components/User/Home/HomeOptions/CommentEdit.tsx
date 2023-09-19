import { SetStateAction, useState } from "react";
import { FaEdit, FaEllipsisH } from "react-icons/fa";
import { Comment } from "../../../../utils/interfaceModel/comment";
import { EditComment } from "../../../../services/API functions/UserApi";
import Loading from "../../isLoading/Loading";
import LoaderAbsolute from "../../isLoading/LoaderAbsolute";



interface CommentEditProps {
    data: Comment; // Replace with the actual data type you want to pass
    // isOpen: boolean;
    onClose: () => void;
}

const CommentEdit: React.FC<CommentEditProps> = ({ data, onClose }) => {


    const [showModal, setShowModal] = useState(false);
    const [inputValue, setInputValue] = useState(data?.Comment);
    const [showEditButton, setShowEditButton] = useState(false);
    const [isLoading, setLoading] = useState(false)
    const toggleModalComment = () => {
        setShowModal(!showModal);
    };

    const handleInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setInputValue(e?.target?.value);
    };

    const handleUpdate = async () => {
        setLoading(true)
        if (data && data._id) {
            console.log('rrrrrr');

            const res = await EditComment(inputValue, data._id);
            if (res){
                onClose(), setShowEditButton(!showEditButton);
                setTimeout(() => {
                    setLoading(false)
                }, 500);
            } 
        }

        toggleModalComment();
    };

    const toggleEditButton = () => {
        setShowEditButton(!showEditButton);
    };


    return (
        <>

            <div>

                <button
                    onClick={toggleEditButton}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <FaEllipsisH className="w-5 h-5" />
                </button>

                {/* Modal */}

                {showEditButton && (
                    <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            {/* <button
                                onClick={handleEditClick}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                  <FaEdit className="w-5 h-5" />
                                Edit
                            </button> */}
                            <button
                                onClick={toggleModalComment}
                                className="block w-full text-left px-4 py-2 text-sm text-blue-500 hover:text-blue-700 focus:outline-none focus:ring focus:ring-blue-300 rounded-md bg-white shadow-md hover:shadow-lg"
                            >
                                <div className="flex items-center">
                                    <FaEdit className="w-5 h-5 mr-1" />
                                    <p className="text-gray-800">Edit</p>
                                </div>
                            </button>

                        </div>
                    </div>
                )}
                {showModal && (
                    <div
                        id="popup-modal"
                        tabIndex={-1}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50"
                    >
                        <div className="relative w-full max-w-md">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-300">
                                <div className="p-4 text-center">
                                    <h3 className="mb-3 text-2xl font-normal text-gray-900 dark:text-gray-900">
                                        Edit Comment
                                    </h3>
                                    <div className="mb-4">
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"

                                            value={inputValue}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="flex justify-center items-center space-x-3">
                                        <button
                                            data-modal-hide="popup-modal"
                                            type="button"
                                            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-4 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                            onClick={toggleModalComment}
                                        >
                                            Close
                                        </button>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                            onClick={() => handleUpdate()}
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {isLoading && (
                    <div
                        id="popup-modal"
                        tabIndex={-1}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-30"
                    >
                        <div className="relative">
                            <LoaderAbsolute />
                        </div>

                    </div>
                )}
            </div>




        </>
    )
}

export default CommentEdit