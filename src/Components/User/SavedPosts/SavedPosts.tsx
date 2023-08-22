import { useEffect, useState } from 'react'
import { AiFillDelete, AiFillHome, AiOutlineDelete } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify'
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../../../services/axios';
import { Posts } from '../../../../../DevColab-Server/src/domain/models/Posts';

function SavedPosts() {
    const { userId } = useSelector((state: any) => state.user);
    const [isLoading, setIsLoading] = useState(false);
    const [Saved, SetSaved] = useState([])
    const Navigate = useNavigate();


    useEffect(() => {

        const fetchSaves = async () => {
            const findUserSave = await api.get(`/SavedPosts/${userId}`)
            SetSaved(findUserSave.data.findUserSave)
            console.log(findUserSave.data.findUserSave, 'findUserSavefindUserSave');
        }

        fetchSaves();

    }, [isLoading]);
    const DeletiingPost = (success: string) => {
        toast.success(success, {
            position: 'bottom-right',
            autoClose: 2000
        });
    }


    const DaleteSavedPost = async (PostId: Posts | string) => {
        console.log(PostId, 'postid');
        setIsLoading(true);
        const DeleteuserSavedPost = await api.post(`/DaleteSavedPost/${PostId}`, { withCredentials: true });

        if (DeleteuserSavedPost) {
            DeletiingPost('Deleted');
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }



    return (
        <>

            <div className="relative z-20 overflow-hidden">
                <Navbar />
            </div>

            <div className="relative h-screen  bg-slate-100">
                <div className="grid grid-cols-1  max-h-[400px]  overflow-hidden relative left-11 w-[20rem] ml-0">
                    <div className="fixed ml-0 pt-1 top-64 flex flex-col justify-around rounded-lg shadow-lg md:w-[16rem] bg-gray-200">
                        <ul>
                            <li className="flex  cursor-pointer items-center md:w-2/5 h-12">
                                <AiFillHome className='text-3xl mx-auto text-gray-800' onClick={() => Navigate('/')} />
                                <h1 onClick={() => Navigate('/')} className=" font-bold text-base ">Home</h1>
                            </li>
                        </ul>
                    </div>
                </div>



                <div className="grid  h-screen left-1  bg-gray-100 mb-10  overflow-y-auto overflow-x-hidden right-0 relative grid-cols-1 mt-24 md:grid-cols-2 mx-auto  border-1  shadow-md shadow-gray-600 sm:max-w-[900px]">
                    <div className="col-span-1 md:col-span-2">
                        <div className="left- relative mx-auto mt-4">

                            <div className="text-center ">
                                <h1 className='text-xl right- font-semibold  relative'>Saved Posts</h1>
                                <div className='mt-8 '>

                                    {Saved.length !== 0 ? (
                                        Saved && Saved.map((post: any, index) => (
                                            <div key={index} className=' relative '>
                                                <div className=" relative   right-0 ">
                                                    <div className=' bg-white rounded-lg  m-auto relative min-h-[150px]  shadow-md shadow-black sm:max-w-[100%]'
                                                    >
                                                        <div onClick={() => Navigate('/profile', { state: post?.PostId?.userId?._id })} className='z-10 text-start pl-3 pt-3 justify-start  absolute'>
                                                            <img onClick={() => Navigate('/profile', { state: post?.PostId?.userId?._id })}
                                                                src={post?.PostId?.userId?.profileImg} alt='User Profile' className='w-9 inline cursor-pointer rounded-full mx-auto ' />
                                                            <h1 onClick={() => Navigate('/profile', { state: post?.PostId?.userId })}
                                                                className='inline-block pl-1 top-3 text-lg cursor-pointer absolute'>{post?.PostId?.userId?.UserName}</h1>
                                                        </div>


                                                        <div className='p-9 flex  top-1 relative cursor-pointer flex-col justify-start'>
                                                            <h1 onClick={() => Navigate('/UserPostsView', { state: { UserPost: post?.PostId } })}
                                                                className='font-semibold top-5 relative text-2xl text-black'>{post?.PostId?.title} </h1>
                                                        </div>

                                                        <div className='flex justify-end'>
                                                            <div
                                                                className='bottom-0 left-0 px-4  relative' >
                                                                <AiOutlineDelete onClick={() => DaleteSavedPost(post._id)}
                                                                    className='text-2xl cursor-pointer' />
                                                            </div>
                                                        </div>
                                                    </div>


                                                </div>

                                                <br />
                                            </div>
                                        ))
                                    ) : (
                                        <>

                                            <div className="relative flex w-screen justify-center grid-cols-1 rounded-lg items-center md:grid-cols-2 m-auto h-auto opacity-80 b mt-28 right- sm:max-w-[100%]">
                                                <div className="flex grid-cols-1 bg-gray-50 rounded-lg items-center justify-center md:grid-cols-2 m-auto h-auto sm:max-w-[100%]">
                                                    <div className="px-52  relative flex justify-center items-center cursor-pointer flex-col">
                                                        <div className="flex lg:w-72 items-center justify-center">
                                                            <img src="../../../../public/Copy NO Saved post.jpg" alt="" srcSet="" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>



                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <ToastContainer />
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

                </div>
            </div>


            {/* <div>
               
                <button onClick={() => setPreviewVisible(true)} className='hidden'>Preview</button>
                {previewVisible && (
                    <div>
                        <h3>Preview:</h3>
                        <div dangerouslySetInnerHTML={{ __html: previewContent }} />
                        <button onClick={() => setPreviewVisible(false)}>Close</button>
                    </div>
                )}
            </div> */}



        </>
    )
}

export default SavedPosts