import { useEffect, useState } from "react";
import { Follow, UnFollow, UserFolowers } from '../../../services/API functions/UserApi';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface LikedUser {
    liked: boolean;
    userId: {
        _id: string;
        profileImg: string
        UserName: string
    };
}
interface postdatas {
    data: {
        likes: {
            LikedUsers: LikedUser[];
        }
    }
}
export interface followers {
    _id: string;
    userId?: {
        _id: string;
    };
}


function LikeSection({ data }: postdatas) {
    const Navigate = useNavigate();
    const { username } = useSelector((state: any) => state.user);
    const [isOpen, setIsOpen] = useState(false);
    const [followedUsers, setFollowedUsers] = useState<followers[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { userId } = useSelector((state: any) => state.user);
    useEffect(() => {
        const fetchUser = async () => {
            const data = await UserFolowers();
            setFollowedUsers(data?.data?.Userfollowers);
        }
        fetchUser();
    }, [isOpen])

    const openModal = () => {
        setIsOpen(true);
    };
    useEffect(()=>{
console.log(data?.likes    ,'data');

    },[])

    const closeModal = () => {
        setIsOpen(false);
    };
    const Folllowing = async (FollowId: string) => {
        const res = await Follow(FollowId);
        setFollowedUsers(res?.data?.Userfollowers);
        const data = await UserFolowers();
        setFollowedUsers(data?.data?.Userfollowers);

    }
    const UnFolllowing = async (UnFollowId: string) => {
        const res = await UnFollow(UnFollowId);
        setFollowedUsers(res?.data?.Userfollowers);
        const data = await UserFolowers();
        setFollowedUsers(data?.data?.Userfollowers);
    }

    // onClick={() =>{ username ? Navigate('/Community'): setIsModalOpen(true)} }

    return (
        <>
            <div className="flex mb-4 -space-x-4">
                {data?.likes?.LikedUsers?.slice(0, 8).reverse().map((user) => (
                    <div className="flex items-center cursor-pointer">
                        <img onClick={openModal}
                            className="w-7 h-7 cursor-pointer border-2 border-white rounded-full"
                            src={user?.userId?.profileImg || 'https://img.favpng.com/22/0/21/computer-icons-user-profile-clip-art-png-favpng-MhMHJ0Fw21MJadYjpvDQbzu5S.jpg'}
                            alt={user?.userId?.profileImg || 'User'}
                        />
                    </div>
                ))}
            </div>


            {isOpen && (
                <>

                    <div className="fixed top-0 left-0 right-0 z-50 w-full h-screen  overflow-auto flex items-center justify-center">
                        <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div>
                        <div className="relative bg-white rounded-lg shadow p-6 w-full max-w-2xl max-h-full ">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-900"
                            >
                                <svg
                                    className="w-5 h-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M14.293 5.293a1 1 0 00-1.414-1.414L10 8.586 6.121 4.707a1 1 0 10-1.414 1.414L8.586 10l-3.889 3.879a1 1 0 101.414 1.414L10 11.414l3.879 3.889a1 1 0 101.414-1.414L11.414 10l3.879-3.889z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Liked Users</h3>
                            <hr className="my-2 border-t border-gray-300" />
                            {data?.likes?.LikedUsers?.map((user, index) => (
                                <div className="space-y-4 overflow-y-auto max-h-96 my-2 "  >
                                    <>
                                        <div key={index} className="flex items-center space-x-2  " >

                                            <img onClick={() =>{username ? Navigate('/profile', { state: user?.userId?._id }) : setIsModalOpen(true)}}
                                                className="w-10 h-10 rounded-full cursor-pointer"
                                                src={user?.userId?.profileImg || 'https://img.favpng.com/22/0/21/computer-icons-user-profile-clip-art-png-favpng-MhMHJ0Fw21MJadYjpvDQbzu5S.jpg'}
                                                alt={user?.userId?.profileImg || 'User'}
                                            />
                                            <span onClick={() => Navigate('/profile', { state: user?.userId?._id })} className="text-gray-700 cursor-pointer  overflow-ellipsis  break-all">{user?.userId?.UserName}</span>
                                            <div onClick={() => Navigate('/profile', { state: user?.userId?._id })} className="flex-grow cursor-pointer left-10 relative" />


                                            <div className="flex  right-3 relative">
                                                {followedUsers?.some((followedUser) => followedUser?._id === user?.userId?._id) ? (
                                                    <button
                                                        onClick={() =>{username ?  UnFolllowing(user?.userId?._id):setIsModalOpen(true)}}
                                                        type="button"
                                                        className="bg-rose-500 text-white md:px-3  md:py-1 px-2 rounded-md hover:bg-rose-700 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
                                                    >
                                                        Unfollow
                                                    </button>
                                                ) : (
                                                    <>
                                                        {user?.userId?._id === userId ? (
                                                            <h1 className="text-2xl font-bold text-green-600 py-1 px-6">You</h1>
                                                        ) : (
                                                            <button
                                                                onClick={() =>{username ? Folllowing(user?.userId?._id):setIsModalOpen(true)}}
                                                                type="button"
                                                                className="bg-blue-500 text-white md:px-3  md:py-1 px-2 rounded-md hover:bg-blue-600 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
                                                            >
                                                                Follow
                                                            </button>
                                                        )}

                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                </div>
                            ))}
                        </div>
                    </div>

                </>
            )}

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
                                            onClick={()=>setIsModalOpen(false)}
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

export default LikeSection