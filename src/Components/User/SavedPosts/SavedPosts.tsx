import { useEffect, useState } from 'react'
import { AiOutlineHome, AiOutlineUser } from 'react-icons/ai'
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../../../services/axios';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import UsersSaved from './UsersSaved';
import CommunitySection from '../Home/CommunitySection';


function SavedPosts() {
    const { userId } = useSelector((state: any) => state.user);
    const [Saved, SetSaved] = useState([]);
    const [refresh,setrefresh]=useState(false)
    const Navigate = useNavigate();
    const [refreshGrp, setRefreshGrp] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {

        const fetchSaves = async () => {
            setIsLoading(true)
            setRefreshGrp(false);
            const findUserSave = await api.get(`/SavedPosts/${userId}`)
            SetSaved(findUserSave.data.findUserSave)
            setIsLoading(false)
        }

        fetchSaves();

    }, [refresh,refreshGrp]);

    useEffect(()=>{
        const fetchSaves = async () => {
            setRefreshGrp(false);
            setIsLoading(true)
            const findUserSave = await api.get(`/SavedPosts/${userId}`)
            SetSaved(findUserSave.data.findUserSave)
            setIsLoading(false)
        }

        fetchSaves();
    },[])



    const loginModalOpen = () => {
        // setIsModalOpen(!isModalOpen);
    }




    return (
        <>

            <div className="relative z-20 overflow-hidden">
                <Navbar />
            </div>

            <div className="relative h-screen  z-0">
                <div
                    style={{ zIndex: '0' }}
                    className="">
                    <div className="hidden md:block mx-2 xl:mx-5 relative sm:w-66 md:w-82 lg:w-66 sm:w-72  md:w-ful xl:w-66 2xl:w-68">
                        <div className="fixed top-0 left-0 right-10  h-full hidden md:block  lg:max-w-[900px]  xl:w-[23rem] 2xl:w-[20 rem] md:w-[18rem] overflow-hidden lg:mx-7 xl:mx-10 md:mx-2 z-10">
                            <div className="h-full overflow-y-auto  relative bg-  border-r-2 px-2 ">
                                <nav className="flex flex-col top-44 relative bg-white mr-3 border-2 p-2 pr-2 justify-around rounded-lg shadow-lg">
                                    <ul>
                                        <li className="flex cursor-pointer items-center w-auto h-12 space-x-2 hover:bg-sky- rounded-xl hover:bg-sky-100">
                                            <AiOutlineHome className="text-3xl text-gray-800  ml-3 " onClick={() => Navigate('/')} />
                                            <h1 onClick={() => Navigate('/')} className="font-bold text-base">Home</h1>
                                        </li>
                                        <li onClick={() => Navigate('/Community')} className="flex cursor-pointer items-center h-12 space-x-2 hover:bg-sky-100 rounded-xl">
                                            <HiOutlineUserGroup className="text-3xl text-gray-800 ml-3 mr-1" />
                                            <h1 className="font-bold text-base">Community</h1>
                                        </li>
                                        <li className="flex cursor-pointer items-center h-12 space-x-2 hover:bg-sky-100 rounded-xl">
                                            <AiOutlineUser className="text-3xl text-gray-800 ml-3" onClick={() => Navigate('/profile')} />
                                            <h1 onClick={() => Navigate('/profile')} className="font-bold text-base">Profile</h1>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" ml-0  relative">
                    <div className="grid md:right-0 bottom-6 sm:bottom-2   left-1 mb-10 right-0 relative grid-cols-1 mt-20 md:grid-cols-2  md:mx-44  md:left-32 lg:mx-44 xl:mx-96 xl:left-5 lg:left-36  border-1 shadow-md shadow-gray-600 ">
                        <nav className="fixed  baCkground border-b-2 sm:w-full  z-10 backdrop-blur-md h-auto  md:max-w-lg   xl:max-w-2xl lg:max-w-2xl w-full  overflow-y-auto md:overflow-y-hidden">
                            <ul>
                                <li className=' cursor-pointer relative items-center justify-center h-20 space-x-2 mx-3 flex'>
                                    <h1 className='text-xl font-semibold bg-gray-200 rounded-xl px-5 text-center'>Saved Posts</h1>
                                </li>
                            </ul>
                            <div className="flex sm:mx-5 mx-5 md:ml5   relative justify-between">

                            </div>
                        </nav>
                    </div>
                    <div className=" relative    lg:max-w-2xl  md:max-w-lg  bg-[#e1e5eb]">
                    </div>
                    <div className='bottom-28 relative'>
                    <CommunitySection datas={refreshGrp} loginModalOpen={loginModalOpen} />
                    </div>
                    <div className='bottom-10 relative'>
                        <UsersSaved Saved={Saved}  sendRefresh={(e)=>setrefresh(e)}/>
                    </div>
                </div>



              
            </div>


            {isLoading && (
                <div
                    id="loadingModal"
                    aria-hidden="true"
                    className="fixed top-0 left-0 right-0 z-50 w-full h-screen flex items-center justify-center bg-gray-700 bg-opacity-50"
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
                    </div>

                </div>
            )}



        </>
    )
}

export default SavedPosts













// <div key={index} className=' relative '>
//     <div className=" relative   right-0 ">
//         <div className=' bg-white rounded-lg  m-auto relative min-h-[150px]  shadow-md shadow-black sm:max-w-[100%]'
//         >
//             <div onClick={() => Navigate('/profile', { state: post?.PostId?.userId?._id })} className='z-10 text-start pl-3 pt-3 justify-start  absolute'>
//                 <img onClick={() => Navigate('/profile', { state: post?.PostId?.userId?._id })}
//                     src={post?.PostId?.userId?.profileImg} alt='User Profile' className='w-9 inline cursor-pointer rounded-full mx-auto ' />
//                 <h1 onClick={() => Navigate('/profile', { state: post?.PostId?.userId })}
//                     className='inline-block pl-1 top-3 text-lg cursor-pointer absolute'>{post?.PostId?.userId?.UserName}</h1>
//             </div>


//             <div className='p-9 flex  top-1 relative cursor-pointer flex-col justify-start'>
//                 <h1 onClick={() => Navigate('/UserPostsView', { state: { UserPost: post?.PostId } })}
//                     className='font-semibold top-5 relative text-2xl text-black'>{post?.PostId?.title} </h1>
//             </div>

//             <div className='flex justify-end'>
//                 <div
//                     className='bottom-0 left-0 px-4  relative' >
//                     <AiOutlineDelete onClick={() => DaleteSavedPost(post._id)}
//                         className='text-2xl cursor-pointer' />
//                 </div>
//             </div>
//         </div>


//     </div>

//     <br />
// </div>