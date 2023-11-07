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

    useEffect(() => {

        const fetchSaves = async () => {
            setRefreshGrp(false)
            const findUserSave = await api.get(`/SavedPosts/${userId}`)
            SetSaved(findUserSave.data.findUserSave)
            console.log(findUserSave.data.findUserSave, 'findUserSavefindUserSave');
        }

        fetchSaves();

    }, [refresh,refreshGrp]);

    useEffect(()=>{
        const fetchSaves = async () => {
            setRefreshGrp(false)
            const findUserSave = await api.get(`/SavedPosts/${userId}`)
            console.log(findUserSave?.data);
            
            SetSaved(findUserSave.data.findUserSave)
            console.log(findUserSave.data.findUserSave, 'findUserSavefindUserSave');
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