import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { AiFillDelete, AiOutlineHome, AiOutlineUser } from "react-icons/ai"
import { BiEdit } from "react-icons/bi"
import { BsFillInfoCircleFill } from "react-icons/bs"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { api } from "../../../services/axios"
import { ProfileValidation } from "../../../utils/userValidation/userProfileValidation"
import { toast, ToastContainer } from "react-toastify"
import { TextField } from "@material-ui/core"
import { Data } from '../../../utils/interfaceModel/PostsInfra';
import { uploadImage } from "../../../services/Cloudinary/Cloud"
import { Posts } from '../../../utils/interfaceModel/PostsInfra';
import { useSocket } from '../../../Context/WebsocketContext';
import { googleLogout } from '@react-oauth/google';
import { updateUser } from '../../../redux/user/userSlice';
import { HiOutlineUserGroup } from 'react-icons/hi2';


function Profile() {
    const Navigate = useNavigate();
    const dispatch = useDispatch();
    const { userId, username } = useSelector((state: any) => state.user);
    const socket = useSocket();
    const [sockets, setSocket] = useState('')
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userProfileData, setUserProfileData] = useState<Data | null>(null);
    const [userProfile, setUserProfile] = useState({
        FirstName: "",
        LastName: "",
        Pronouns: "Please select",
        Headline: "",
        Hashtags: "Please select",
        AboutMe: ''
    })
    const [images, setImage] = useState<File | null>(null);
    const [Postcount, setCount] = useState<number>(0);
    const [Proimages, setProImage] = useState<File | null | string>(null);
    const location = useLocation()
    const [UserPost, setUserPost] = useState<any[]>([]);
    const [deletePostId, setDeletePostId] = useState<Posts | string>();
    const [userHshTagSelectedTags, setUserHshTagSelectedTags] = useState<any | Array<TemplateStringsArray>>([]);
    const clickDataUserId = location?.state

    useEffect(() => {
        socket.on('adminMessage', () => {
            UserProfileSuccess('Notification')
            setSocket('notificatonsdsss')
        });


        return () => {
            socket.off('adminMessage');
        };
    }, [socket, sockets])


    useEffect(() => {
        socket.on('adminMessage', (data) => {
            console.log('Admin message received:', data);

        });

        const fetchData = async () => {
            try {
                if (clickDataUserId) {

                    const userResponse: any = await api.get(`/profile/${clickDataUserId}`, { withCredentials: true });
                    console.log(userResponse, 'uuuuuuuuuusssssssssss');

                    const user: Data = userResponse?.data;
                    if (user) {
                        console.log(user, 'yyyyyyyyyyyyy');

                    }

                    setUserProfileData(user)
                    setCount(user.count)
                    setUserPost(user.UserPosts);


                } else {
                    const userResponse = await api.get(`/profile/${userId}`, { withCredentials: true });
                    const user: Data = userResponse.data;
                    console.log(userResponse.data, 'resss');
                    setUserHshTagSelectedTags(userResponse.data.userProfileData.UserHshTag.SelectedTags);
                    setUserProfileData(user)
                    setCount(user.count)
                    setUserPost(user.UserPosts);
                    console.log(userProfileData, 'userProfileData');

                }

            } catch (error) {
                const errorWithResponse = error as { response?: { data?: { error?: string } } };
                console.log(error, 'erere');
                if (errorWithResponse?.response?.data?.error === 'Invalid token.') {
                    localStorage.removeItem('user');
                    dispatch(updateUser({}));
                    googleLogout();
                    Navigate('/login')
                }



            }
        }


        fetchData();
    }, [Proimages, images, isLoading, userId, socket, sockets, setSocket]);


    useEffect(() => {
        if (userProfileData) {
            setUserProfile((prevUserProfile) => ({
                ...prevUserProfile,
                FirstName: userProfileData?.userProfileData?.profile?.FirstName || '',
                LastName: userProfileData?.userProfileData?.profile?.LastName || '',
                Pronouns: userProfileData?.userProfileData?.profile?.Pronouns || 'Please select',
                Headline: userProfileData?.userProfileData?.profile?.Headline || '',
                Hashtags: userProfileData?.userProfileData?.profile?.Hashtags || 'Please select',
                AboutMe: userProfileData?.userProfileData?.profile?.AboutMe || '',
            }));
        }
    }, [userProfileData]);



    const handleProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsLoading(true);
            const ProfileImgUrl = await uploadImage(file);
            if (ProfileImgUrl) {
                const EncodedProfileUrl = encodeURIComponent(ProfileImgUrl)
                api.post(`/profileImageChange/${EncodedProfileUrl}/${userId}`, { withCredentials: true });
                setProImage(file);
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000)
            }
        }
    }




    const handleBGImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {


        const file = e.target.files?.[0];


        if (file) {
            setIsLoading(true);
            const BGimgUrl = await uploadImage(file);
            if (BGimgUrl) {

                const EncodedUrl = encodeURIComponent(BGimgUrl)

                api.post(`/profileBg_image/${EncodedUrl}/${userId}`, { withCredentials: true });
                setImage(file);

                setTimeout(() => {
                    setIsLoading(false);

                }, 1000);
            }
        }
    };



    const UserProfileError = (err: string | undefined) => toast.error(err, {
        position: "bottom-right"
    })
    const UserProfileSuccess = (success: string) => {
        toast.success(success, {
            position: 'bottom-right',
        });
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
        e.preventDefault();
        try {

            const Validate = ProfileValidation(userProfile);
            console.log(Validate, 'checkid vali');

            if (Validate === 'success') {
                setIsLoading(true);
                setTimeout(() => {
                    setIsLoading(false);
                    handleModalToggle();
                }, 1000);

                UserProfileSuccess('Profile updated successfully!');

                console.log('valiss');


                const data = await api.post(`/profile/${userId}`, { ...userProfile }, { withCredentials: true })
                console.log('after vass');

                if (data) console.log('s');


            } else {

                UserProfileError(Validate)
            }


        } catch (error) {

        }




    }



    const user = () => {
        console.log(userProfile);

    }
    const handleModalToggle = () => {
        setShowModal(!showModal);
    };

    const SavePostSucess = (success: string) => {
        toast.success(success, {
            position: 'bottom-right',
            autoClose: 2000
        });
    }

    const SavePost = async (PostId: Posts) => {

        const SavingPost = await api.post(`/SavingPosts/${userId}/${PostId}`, { withCredentials: true });
        if (SavingPost?.data === 'AlreadySaved') {
            SavePostSucess('AlreadySaved')
        } else {

            SavePostSucess('Seved');
        }

    };

    const DaletePost = (PostId: Posts | string) => {
        console.log(PostId, 'postid', UserPost, 'UserPost');
        setIsLoading(true);
        api.post(`/DeletePost/${PostId}`, { withCredentials: true });
        setDeletePostId(PostId);
        setTimeout(() => {
            setIsLoading(false);

        }, 1000);
    }

    useEffect(() => {

        if (deletePostId) {
            DaletePost(deletePostId);
            SavePostSucess('Deleted');
        }
    }, [deletePostId]);








    return (
        <>


            <div className=" relative z-20 ">
                <Navbar />

            </div>

            <div >


                <div className="min-h-screen grid top-20 relative items-center justify-center  ">
                    <div style={{ zIndex: '0' }}
                        className="">
                        <div className="hidden md:block mx-2 xl:mx-5 relative sm:w-66 md:w-82 lg:w-66 sm:w-72  md:w-ful xl:w-66 2xl:w-68">
                            <div className="fixed top-0 left-0 right-10  h-full hidden md:block  lg:max-w-[900px]  xl:w-[23rem] 2xl:w-[20 rem] md:w-[18rem] overflow-hidden lg:mx-7 xl:mx-10 md:mx-2 z-10">
                                <div className="h-full overflow-y-auto  relative bg-  border-r-2 px-2 ">
                                    <nav className="flex flex-col top-44 relative bg-white mr-3 border-2 p-2 pr-2 justify-around rounded-lg shadow-lg">
                                        <ul>
                                            <li onClick={() => Navigate('/')} className="flex cursor-pointer items-center w-auto h-12 space-x-2 hover:bg-sky- rounded-xl hover:bg-sky-100">
                                                <AiOutlineHome className="text-3xl text-gray-800  ml-3 " />
                                                <h1 onClick={() => Navigate('/')} className="font-bold text-base">Home</h1>
                                            </li>
                                            <li onClick={() => Navigate('/Community')} className="flex cursor-pointer items-center h-12 space-x-2 hover:bg-sky-100 rounded-xl">
                                                <HiOutlineUserGroup className="text-3xl text-gray-800 ml-3 mr-1" />
                                                <h1 className="font-bold text-base">Community</h1>
                                            </li>
                                            <li onClick={() => Navigate('/profile')} className="flex cursor-pointer items-center h-12 space-x-2 bg-sky-100 rounded-xl">
                                                <AiOutlineUser className="text-3xl text-gray-800 ml-3" />
                                                <h1 onClick={() => Navigate('/profile')} className="font-bold text-base">Profile</h1>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>






                    <div className=' md:right-0    w-[904px ]   -z-0 left-1  right-0 relative    md:mx-44 md:left-28 lg:mx-72 xl:mx-2 xl:ml-6 xl:max-w-[100%] max-w-3xl:w-[100%] lg:right-0 border-1  '>
                        <div className="relative grid grid-cols-1 md:grid-cols-2 m-auto h-[550px]  bg-gray-100   overflow-hidden     shadow-md  w-[904px] rounded-xl ">
                            <div className="max-w-sm p-6 top-32 absolute   ">

                                {userProfileData?.userProfileData?.UserName ? (

                                    <h5 className="mb-2 pt-3 text-xl font-bold tracking-tight text-gray-950 inline-block">{userProfileData?.userProfileData?.UserName} </h5>
                                ) : (

                                    <h5 className="mb-2 pt-3 text-xl font-bold tracking-tight text-gray-950 inline-block">{username} </h5>

                                )}

                                {userProfileData?.userProfileData?.profile?.Pronouns && (
                                    <>
                                        <p className="inline font-serif text-gray-900 opacity-100 text-base">  ({userProfileData?.userProfileData?.profile?.Pronouns})  </p>
                                        <p className=" font-bold">
                                            {userProfileData?.userProfileData?.profile?.FirstName}
                                            {userProfileData?.userProfileData?.profile?.LastName}
                                        </p>
                                    </>
                                )}

                                <p className="mb-3 font-medium text-gray-950 ">{userProfileData?.userProfileData?.profile?.Headline}</p>
                                <p className=" font-serif    text-gray-950 ">{userProfileData?.userProfileData?.profile?.Hashtags}  </p>
                                <div>
                                    <div>
                                        {userHshTagSelectedTags.map((tag: any, index: any) => (
                                            <p key={index} className='inline-block'>
                                                {tag.HshTagId.Hashtag}  &nbsp;
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="max-w-sm p-4 absolute  mx-6  top-72 max-h-44 h-auto  border border-gray-200 rounded-lg shadow bg-[#E4FCFF] dark:border-gray-500">
                                <a href="#">
                                    <BsFillInfoCircleFill className="w-7 h-auto bottom-1    relative text-blue-500 inline" />
                                    <h5 className="mb-2 inline text-xl font-bold tracking-tight text-gray-900 ">&nbsp;  About Me</h5>
                                </a>
                                <p className=" font-serif dark:text-gray-950">{userProfileData?.userProfileData?.profile?.AboutMe}</p>
                                <button onClick={user}></button>
                            </div>
                            <div className="max-w-sm  px-4  bottom-1 mx-6 absolute bg-white border border-gray-200 rounded-lg shadow  ">
                                <p className="mb-3 font-normal text-gray-800 dark:text-gray-600 inline-flex">&nbsp;  {Postcount} posts published</p>
                                <p className="mb-3 font-normal text-gray-800 dark:text-gray-600 inline-flex">&nbsp;   0 tags followed</p>
                            </div>
                            <div className="h-20 flex   w-screen relative justify-end">
                                <div className="md:col-span-2  z-10 flex  items-center md:items-stretch md:w-16 md:mr-2">
                                    {(userProfileData?.userProfileData?._id === userId) && (
                                        <>
                                            <BiEdit className=" md:left-2/4 md:ml-[6rem] top-1  font-bold text-2xl w-7 h-7 md:w-7 md:h-7 bottom-2 md:bottom-0 bg-beige text-white bg-yellow-500 rounded-full p-1 md:absolute  md:self-center md:mx-auto overflow-hidden" />

                                            <div className="relative cursor-pointer  right-96 top-11">
                                                <input
                                                    onChange={handleBGImageChange}
                                                    accept="image/*"
                                                    className="  z-0 text-sm       right-56 opacity-0 bottom-10 w-12  relative  text-gray-900 border border-gray-300 rounded-lg cursor-pointer  dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input1" type="file" />
                                            </div></>
                                    )}
                                </div>
                            </div>
                            <div className='flex items-center justify-end relative bottom-32 min-h-screen'> <p></p>
                                <div className="m-5 ">
                                    {(userProfileData?.userProfileData?._id === userId) && (
                                        <button onClick={handleModalToggle} className="flex p-2.5 bg-yellow-500 rounded-xl hover:rounded-3xl hover:bg-yellow-600 transition-all duration-300 text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    )}

                                </div>
                            </div>
                            <div className="flex absolute top-0 left-0 w- h-32 bg-opacity-50 ">
                                <img src={userProfileData?.userProfileData?.UserBackgroundImage} alt="Background Image"
                                    className=" h-32 object-cover md:h-full w-screen md:object-center" />
                            </div>

                            <div className="w-20 mx-auto md:w-24 absolute flex justify-start top-20  left-16  md:left-16">

                                <div className="relative md:justify-start  lg:left-3 md:left-3 ">
                                    {(userProfileData?.userProfileData?._id === userId) && (
                                        <BiEdit className="ml-2  cursor-pointer  font-bold text-2xl w-10 h-10 md:w-8 md:h-8 absolute bottom-1 md:bottom-8 text-white md:left-16 border-2 bg-beige bg-yellow-500 rounded-full p-1" />)}
                                    <img src={userProfileData?.userProfileData?.profileImg} alt="User Image" className="w-20 h-20  rounded-full border-4  shadow-lg" />
                                    {(userProfileData?.userProfileData?._id === userId) && (
                                        <input
                                            accept="image/*"
                                            onChange={handleProfileImage}
                                            className="block w-full   text-sm opacity-0 bottom-9 left-10 relative text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input2" type="file" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>






                    <div className=" xl:-mx-9 sm:left-0  flex-wrap justify-end xl:left-36 xl:w-scroll-m lg:left-52 lg: md:left-32  md:-mx-40   left-0 relative rounded-sm">
                        {UserPost &&
                            UserPost.map((post: any, index) => (
                                (userProfileData?.userProfileData?._id === userId) ? (
                                    <>
                                        <div key={index} className="relative p-4 mx-1 lg:mx-2  hover:shadow-lg">
                                            <div className="relative right-0">
                                                <div className="bg-white rounded-lg m-auto relative shadow-md shadow-black ">
                                                    <div className="flex justify-between items-center p-3">
                                                        <div
                                                            onClick={() => Navigate('/profile', { state: post?.PostId?.userId?._id })}
                                                            className="flex items-center cursor-pointer hover:text-blue-600"
                                                        >
                                                            <img
                                                                onClick={() => Navigate('/profile', { state: post?.PostId?.userId?._id })}
                                                                src={userProfileData?.userProfileData?.profileImg}
                                                                alt="User Profile"
                                                                className="w-9 h-9 cursor-pointer rounded-full mr-2"
                                                            />
                                                            <div className="text-blue-600 overflow-scroll text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl">
                                                                {userProfileData?.userProfileData?.UserName}
                                                                <div>
                                                                    <p className="text-sm text-black">{post?.Date}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="px-10 flex flex-col">
                                                        <h1
                                                            onClick={() => Navigate('/UserPostsView', { state: { UserPost: post } })}
                                                            className="font-semibold text-2xl break-words break-all text-black cursor-pointer hover:underline"
                                                        >
                                                            {post?.title}
                                                        </h1>
                                                    </div>
                                                    <div className="mt-2 mx-2 p-2 relative overflow-hidden">
                                                        <img
                                                            onClick={() => Navigate('/UserPostsView', { state: { UserPost: post } })}
                                                            src={post?.image}
                                                            alt={post?.Image}
                                                            className="cursor-pointer w-full max-h-24 sm:max-h-32 md:max-h-48 lg:max-h-64 xl:max-h-80 rounded-lg"
                                                        />
                                                        <div className="flex justify-end px-2 items-end py-2 relative'">
                                                            <button>
                                                                {userProfileData?.userProfileData?._id === userId && (
                                                                    <div className="relative hover:bg-gray-300">
                                                                        <AiFillDelete onClick={() => DaletePost(post?._id)} className="text-2xl cursor-pointer " />
                                                                    </div>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <br />
                                        </div>
                                    </>
                                ) : (UserPost[index]?.status === true) && (
                                    <div key={index} className="relative p-4 mx-8 lg:mx-10 hover:shadow-lg">
                                        <div className="bg-white rounded-lg m-auto relative shadow-md sm:max-w-[100%]">
                                            <div className="flex justify-between items-center p-3">
                                                <div className="flex justify-between items-center p-3">
                                                    <div
                                                        onClick={() => Navigate('/profile', { state: post?.PostId?.userId?._id })}
                                                        className="flex items-center cursor-pointer hover:text-blue-600"
                                                    >
                                                        <img
                                                            onClick={() => Navigate('/profile', { state: post?.PostId?.userId?._id })}
                                                            src={userProfileData?.userProfileData?.profileImg}
                                                            alt="User Profile"
                                                            className="w-9 h-9 cursor-pointer rounded-full mr-2"
                                                        />
                                                        <div className="text-blue-600 overflow-scroll text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl">
                                                            <h1 className='text-lg font-semibold text-black'>{userProfileData?.userProfileData?.UserName}</h1>
                                                            <p className="text-sm text-black">{post?.Date}</p>
                                                        </div>
                                                    </div>
                                                    <br />
                                                </div>
                                            </div>
                                            <div className="px-10 bottom-7 mb-1 relative flex flex-col">
                                                <h1
                                                    onClick={() => Navigate('/UserPostsView', { state: { UserPost: post } })}
                                                    className='font-semibold cursor-pointer  break-all top-5 relative text-2xl'
                                                >
                                                    {post?.title}
                                                </h1>
                                            </div>
                                            <div className="mt-2 mx-2 p-2 relative overflow-hidden">
                                                <img
                                                    onClick={() => Navigate('/UserPostsView', { state: { UserPost: post } })}
                                                    src={post?.image}
                                                    alt={post?.Image}
                                                    className="cursor-pointer w-full max-h-24 sm:max-h-32 md:max-h-48 lg:max-h-64 xl:max-h-80 rounded-lg"
                                                />
                                                <div className="relative">
                                                    {userProfileData?.userProfileData?._id === userId ? (
                                                        <div className='flex justify-end right-8 items-end relative'>
                                                        </div>
                                                    ) : (
                                                        <div className='flex justify-end top-2 py-3 right-8 items-end relative'>
                                                            <button onClick={() => SavePost(post._id)}>
                                                                <svg className="w-4 h-4 right-0 bottom-2 relative" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M1.9375 0H29.0625C29.5764 0 30.0692 0.158035 30.4325 0.43934C30.7959 0.720644 31 1.10218 31 1.5V30.214C31.0004 30.3483 30.9542 30.4801 30.8662 30.5959C30.7783 30.7116 30.6519 30.8069 30.5001 30.8719C30.3483 30.9369 30.1768 30.9691 30.0035 30.9653C29.8301 30.9614 29.6613 30.9216 29.5146 30.85L15.5 24.046L1.48283 30.848C1.33637 30.919 1.16803 30.9584 0.995292 30.962C0.82255 30.9657 0.651686 30.9335 0.500415 30.8689C0.349143 30.8042 0.222972 30.7094 0.134983 30.5942C0.0469929 30.4791 0.000388072 30.3478 0 30.214V1.5C0 1.10218 0.204129 0.720644 0.56748 0.43934C0.930832 0.158035 1.42364 0 1.9375 0ZM27.125 3H3.875V26.148L15.5 20.508L27.125 26.148V3Z" fill="#5F5454" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))}
                        <ToastContainer />
                    </div>





                </div>

                {showModal && (

                    <>
                        <div id="defaultModal" aria-hidden="true" className="relative top-0 left-0 right-0  hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full overflow-hidden">
                            <div className="relative w-full max-w-2xl max-h-full">

                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 overflow-auto">

                                    dsdsdsd
                                </div>
                            </div>
                        </div>


                        <div
                            id="defaultModal"
                            aria-hidden="true"
                            style={{ zIndex: '1' }}
                            className="fixed top-16 w-full h-screen flex items-center  justify-center bg-gray-700 bg-opacity-50"
                        >


                            <div className="relative bg-white rounded-lg shadow-lg bottom-8 overflow-auto h-3/4 max-w-xl w-screen">
                                <div className="p-4">
                                    <div className="flex  items-start justify-between pb-2 border-b ">
                                        <h3 className="text-xl font-semibold">Edit Your Profile</h3>
                                        <button
                                            type="button"
                                            onClick={handleModalToggle}
                                            className="text-gray-400 bg-transparent  hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 inline-flex justify-center items-center"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-3 h-3"
                                                fill="none"
                                                viewBox="0 0 14 14"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <form onSubmit={handleSubmit} action="" className="">

                                        <div className="p-6 space-y-6  " style={{ maxHeight: "calc(100vh - 8rem)" }}>
                                            <div>
                                                <label htmlFor="fname" className="block  text-sm font-medium text-gray-700">
                                                    First Name
                                                </label>
                                                <input
                                                    onChange={(e) => setUserProfile({ ...userProfile, FirstName: e.target.value })}
                                                    type="text"
                                                    id="fname"
                                                    name="FirstName"
                                                    value={userProfile.FirstName}
                                                    placeholder="Enter your first name"
                                                    className="border border-gray-300 p-2 rounded-lg w-full" />
                                            </div>

                                            <div>
                                                <label htmlFor="lname" className="block  text-sm font-medium text-gray-700">
                                                    Last Name
                                                </label>
                                                <input
                                                    onChange={(e) => setUserProfile({ ...userProfile, LastName: e.target.value })}
                                                    type="text"
                                                    id="lname"
                                                    value={userProfile.LastName}
                                                    name="LastName"
                                                    placeholder="Enter your last name"
                                                    className="border border-gray-300 p-2 rounded-lg w-full" />
                                            </div>

                                            <div>
                                                <label htmlFor="dropdown" className="block text-sm font-medium text-gray-700">
                                                    Pronouns
                                                </label>

                                                <select
                                                    onChange={(e) => setUserProfile({ ...userProfile, Pronouns: e.target.value })}
                                                    id="dropdown"
                                                    name="Pronouns"
                                                    value={userProfile.Pronouns}
                                                    className="border border-gray-300 p-2 rounded-lg w-full"
                                                >
                                                    <option value="Please select">Please select</option>
                                                    <option value="She/Her">She/Her</option>
                                                    <option value="He/Him">He/Him</option>

                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
                                                    Headline
                                                </label>
                                                <input
                                                    onChange={(e) => setUserProfile({ ...userProfile, Headline: e.target.value })}
                                                    type="text"
                                                    id="headline"
                                                    name="Headline"
                                                    value={userProfile.Headline}
                                                    placeholder="Enter your status/headline"
                                                    className="border border-gray-300 p-2 rounded-lg w-full" />
                                            </div>
                                            <div>
                                                <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700">
                                                    Select Hashtags
                                                </label>
                                                <select
                                                    onChange={(e) => setUserProfile({ ...userProfile, Hashtags: e.target.value })}
                                                    id="hashtags"
                                                    name="Hashtags"
                                                    value={userProfile.Hashtags}
                                                    className="border border-gray-300 p-2 rounded-lg w-full"
                                                >

                                                    <option value="Please select">Please select</option>
                                                    <option value="#JavaScript">#JavaScript</option>
                                                    <option value="#React">#React</option>
                                                    <option value="#NodeJs">#NodeJs</option>
                                                </select>
                                            </div>
                                            <TextField
                                                onChange={(e) => setUserProfile({ ...userProfile, AboutMe: e.target.value })}
                                                id="outlined-multiline-static"
                                                label="Multiline"
                                                multiline
                                                maxRows={4}
                                                value={userProfile.AboutMe}
                                                variant="outlined"

                                                required
                                            />

                                        </div>
                                        <div className="flex items-center justify-end p-4 border-t">
                                            <button
                                                type="submit"
                                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                            >
                                                Update
                                            </button>

                                            <button

                                                type="button"
                                                onClick={handleModalToggle}
                                                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 "
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    </form>
                                    <ToastContainer />

                                </div>
                            </div>
                        </div>

                    </>

                )}



                {isLoading && (
                    <div
                        id="loadingModal"
                        aria-hidden="true"
                        className="fixed top-0 left-0 z-50 right-0 w-full h-screen flex items-center justify-center bg-gray-700 bg-opacity-50"
                    >

                        <div role="status" className="flex items-center justify-center mb-4">
                            <svg
                                aria-hidden="true"
                                className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                            <span className="sr-only">Loading...</span>
                            <ToastContainer />
                        </div>

                    </div>
                )}
                <ToastContainer />

            </div>
        </>
    )
}

export default Profile






{/* <div className="w-full  left-36 -mx-9 flex flex-wrap relative  rounded-sm ">
                        <div className="  left-0    relative items-center mt-5 justify-center  ">
                            {UserPost && UserPost.map((post: any, index) => (
                                (userProfileData?.userProfileData?._id === userId) ? (
                                    <>
                                        <div key={index} className="relative p-4 mx-1 hover:shadow-lg">
                                            <div className="relative right-0">
                                                <div className="bg-white rounded-lg m-auto relative shadow-md shadow-black sm:max-w-[100%]">
                                                    <div className="flex justify-between items-center p-3">
                                                        <div
                                                            onClick={() => Navigate('/profile', { state: post?.PostId?.userId?._id })}
                                                            className="flex items-center cursor-pointer hover:text-blue-600"
                                                        >
                                                            <img
                                                                onClick={() => Navigate('/profile', { state: post?.PostId?.userId?._id })}
                                                                src={userProfileData?.userProfileData?.profileImg}
                                                                alt="User Profile"
                                                                className="w-9 h-9 cursor-pointer rounded-full mr-2"
                                                            />

                                                            <div className="text-blue-600 overflow-scroll text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl">
                                                                {userProfileData?.userProfileData?.UserName}
                                                                <div>
                                                                    <p className="text-sm text-black">{post?.Date}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="px-10 flex flex-col">
                                                        <h1
                                                            onClick={() => Navigate('/UserPostsView', { state: { UserPost: post } })}
                                                            className="font-semibold text-2xl break-words break-all text-black cursor-pointer hover:underline"
                                                        >
                                                            {post?.title}
                                                        </h1>
                                                    </div>
                                                    <div className="mt-2 mx-2 p-2 relative overflow-hidden">
                                                        <img
                                                            onClick={() => Navigate('/UserPostsView', { state: { UserPost: post } })}
                                                            src={post?.image}
                                                            alt={post?.Image}
                                                            className="cursor-pointer w-full max-h-24 sm:max-h-32 md:max-h-48 lg:max-h-64 xl:max-h-80 rounded-lg"
                                                        />
                                                        <div className="flex justify-end  px-2  items-end  py-2 relative'">
                                                            <button>
                                                                {userProfileData?.userProfileData?._id === userId && (
                                                                    <div className="relative hover:bg-gray-300">
                                                                        <AiFillDelete onClick={() => DaletePost(post?._id)} className="text-2xl cursor-pointer " />
                                                                    </div>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <br />
                                        </div>
                                    </>

                                ) : (UserPost[index]?.status === true) && (
                                    <div key={index} className="relative p-4 mx-8 hover:shadow-lg">
                                        <div className="bg-white rounded-lg m-auto relative shadow-md  sm:max-w-[100%]">
                                            <div className="flex justify-between items-center p-3">
                                                <div className="flex justify-between items-center p-3">
                                                    <div
                                                        onClick={() => Navigate('/profile', { state: post?.PostId?.userId?._id })}
                                                        className="flex items-center cursor-pointer hover:text-blue-600"
                                                    >
                                                        <img
                                                            onClick={() => Navigate('/profile', { state: post?.PostId?.userId?._id })}
                                                            src={userProfileData?.userProfileData?.profileImg}
                                                            alt="User Profile"
                                                            className="w-9 h-9 cursor-pointer rounded-full mr-2"
                                                        />
                                                        <div className="text-blue-600 overflow-scroll text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl">
                                                            <h1 className='text-lg font-semibold text-black'>{userProfileData?.userProfileData?.UserName}</h1>
                                                            <p className="text-sm text-black">{post?.Date}</p>
                                                        </div>
                                                    </div>
                                                    <br />
                                                </div>

                                            </div>
                                            <div className="px-10 bottom-7 mb-1 relative flex flex-col">
                                                <h1
                                                    onClick={() => Navigate('/UserPostsView', { state: { UserPost: post } })}
                                                    className='font-semibold cursor-pointer top-5 relative text-2xl'
                                                >
                                                    {post?.title}
                                                </h1>
                                            </div>
                                            <div className="mt-2 mx-2 p-2 relative overflow-hidden">
                                                <img
                                                    onClick={() => Navigate('/UserPostsView', { state: { UserPost: post } })}
                                                    src={post?.image}
                                                    alt={post?.Image}
                                                    className="cursor-pointer w-full max-h-24 sm:max-h-32 md:max-h-48 lg:max-h-64 xl:max-h-80 rounded-lg"
                                                />
                                                <div className="relative">
                                                    {userProfileData?.userProfileData?._id === userId ? (
                                                        <div className='flex justify-end  right-8 items-end relative'>
                                                        </div>
                                                    ) : (
                                                        <div className='flex justify-end top-2 py-3 right-8 items-end relative'>
                                                            <button onClick={() => SavePost(post._id)}>
                                                                <svg className="w-4 h-4 right-0 bottom-2 relative" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M1.9375 0H29.0625C29.5764 0 30.0692 0.158035 30.4325 0.43934C30.7959 0.720644 31 1.10218 31 1.5V30.214C31.0004 30.3483 30.9542 30.4801 30.8662 30.5959C30.7783 30.7116 30.6519 30.8069 30.5001 30.8719C30.3483 30.9369 30.1768 30.9691 30.0035 30.9653C29.8301 30.9614 29.6613 30.9216 29.5146 30.85L15.5 24.046L1.48283 30.848C1.33637 30.919 1.16803 30.9584 0.995292 30.962C0.82255 30.9657 0.651686 30.9335 0.500415 30.8689C0.349143 30.8042 0.222972 30.7094 0.134983 30.5942C0.0469929 30.4791 0.000388072 30.3478 0 30.214V1.5C0 1.10218 0.204129 0.720644 0.56748 0.43934C0.930832 0.158035 1.42364 0 1.9375 0ZM27.125 3H3.875V26.148L15.5 20.508L27.125 26.148V3Z" fill="#5F5454" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                )
                            ))}
                            <ToastContainer />
                        </div>
                    </div> */}