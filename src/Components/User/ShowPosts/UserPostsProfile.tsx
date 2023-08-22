import React, { useEffect, useState } from 'react'
import { AiFillHome } from 'react-icons/ai'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../services/axios';
// import { User } from '../../../../../DevColab-Server/src/domain/models/user';
// import { Posts } from '../../../../../DevColab-Server/src/domain/models/Posts';

// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'; // You can choose a different style here
// import prettier from 'prettier';
// import parserBabel from 'prettier/parser-babel';
import { ToastContainer, toast } from 'react-toastify';
import RichTextEditor from '../PostCreation/ModalEditJoDitEditor';
import { Box, TextField } from '@material-ui/core';
import { EditPostValidation } from '../../../utils/userValidation/PostValidation';
import { uploadImage, uploadVideo } from '../../../services/Cloudinary/Cloud';
import { MuiChipsInput } from 'mui-chips-input'
import { UrlData } from '../../../../../DevColab-Server/src/domain/models/Posts';
import { RiVideoUploadFill } from 'react-icons/ri';
import { DeletePostVideo } from '../../../services/API functions/UserApi';



function UserPostsProfile() {
    const Navigate = useNavigate();
    const location = useLocation()
    const clickData = location?.state?.UserPost;
    const { postId } = useParams();


    const { userId } = useSelector((state: any) => state.user);
    const [isLoading, setIsLoading] = useState(false);
    const [EditDatas, SetEditDatas] = useState(false);
    const [previewContent, setPreviewContent] = useState("");
    const [img, setImg] = useState<string>('');
    const [Taitle, setTaitle] = useState<string>(clickData?.title);
    const [UrlData, setUrlData] = useState<UrlData>()

    const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
    const [showVideos, setShowVideos] = useState(false);

    const [HashTag, setHashTag] = useState<string[]>([]);
    const [PostId, setPostId] = useState("");


    const handleChange = (newHashTag:string[] ) => {
        const modifiedTags = newHashTag.map(tag => (tag.startsWith('#') ? tag : `#${tag}`));
        setHashTag(modifiedTags);
    };

    useEffect(() => {
        console.log(postId, 'UserPostsView');

        if (postId) {
            const fetchPost = async () => {
                const Post = await api.get(`/UserPostsView/${postId}`);
                console.log(Post, 'postid');
                setTaitle('');
                setUrlData(Post?.data);
                setPostId(Post?.data?._id)
                setTaitle(Post?.data?.title)
            }

            fetchPost()
        }


    }, [postId, isLoading])

    useEffect(() => {
        setTaitle(clickData?.title);
        setPreviewContent(clickData?.content)
        setHashTag(clickData?.HashTag)
        setPostId(clickData?._id)

        console.log(clickData, 'clicke');

    }, [clickData?.title, isLoading]);



    const handleModalToggle = () => {
        SetEditDatas(!EditDatas);

    };

    const ModalEditorVAue = (newValue: string) => {
        setPreviewContent('')
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = newValue;
        setPreviewContent(tempDiv.innerHTML);
        const imgElement = tempDiv.querySelector("img");
        if (imgElement) {
            const src = imgElement.src;
            let imgStr = ''
            imgStr += src
            setImg(imgStr);

        } else {
            setImg("");
        }
    };

    const PostSucess = (err: any) => toast.success(err, {
        position: "bottom-right"
    })



    const PostErr = (err: any) => toast.error(err, {
        position: "bottom-right"
    });

    const HandleEditPostDatas = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
        e.preventDefault();

        try {


            const err = EditPostValidation(Taitle, previewContent);

            if (clickData.title == Taitle && previewContent == clickData.content) {
                handleModalToggle();

            } else {
                if (err === 'success') {
                    setIsLoading(true);
                    const cloudImgUrl: String = await uploadImage(img)
                    console.log(clickData);

                    const uploadedVideoUrls: string[] = [];

                    for (const video of selectedVideos) {
                        const uploadedUrl = await uploadVideo(video);
                        if (uploadedUrl) {
                            uploadedVideoUrls.push(uploadedUrl);
                        }
                    }
                    const data: boolean = await api.post(`/EditUSerPost/${PostId}`, { Taitle, previewContent, cloudImgUrl, HashTag, uploadedVideoUrls }, { withCredentials: true });
                    if (data == true) setIsLoading(false);
                    Navigate('/profile');
                    PostSucess('sucess');
                } else {
                    PostErr(err);
                }
            }

        } catch (error) {

            console.log(error);

            throw new Error('An error occurred');


        }


    }



    const [isModalOpen, setIsModalOpen] = useState(false);



    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const videoFiles = Array.from(files).filter(file => file.type.startsWith('video/'));
            setSelectedVideos(videoFiles);
        }
    };

    const chunkArray = (array: any[], size: number) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };


    const handleRemoveVideo = (index: number) => {
        setSelectedVideos((prevSelectedVideos) => {
            const updatedSelectedVideos = [...prevSelectedVideos];
            updatedSelectedVideos.splice(index, 1);
            return updatedSelectedVideos;
        });
    };

    const handleDeleteVideo = async (index: number, postId: string) => {
        try {
            setIsLoading(true);
            const data: boolean | undefined = await DeletePostVideo(index, postId);
            if (data === true) {
                setIsLoading(false);
                PostSucess('Video Deleted');
            }
            Navigate('/profile');

        } catch (error) {

        }
    }



    return (




        <>
            <div className="  flex top-20 relative items-center justify-center  ">

                <div className="grid   grid-cols-1  max-h-[400px]  overflow-hidden relative left-12 w-[20rem] ">
                    <div className="fixed ml-0 pt-1 top-64 flex flex-col justify-around rounded-lg shadow-lg md:w-[16rem] bg-gray-200">
                        <ul>
                            <li className="flex  cursor-pointer items-center  md:w-2/5 h-12">
                                <AiFillHome className='text-3xl mx-auto' onClick={() => Navigate('/')} />
                                <h1 onClick={() => Navigate('/')} className="font-bold text-base">Home</h1>
                            </li>

                        </ul>
                    </div>
                </div>


                <div className="w-screen h-auto flex relative bottom-10  top-0 md:right-32 rounded-sm ">
                    <div className="relative h-auto grid grid-cols-1 md:grid-cols-2 pb-32 m-auto min-h-auto  bg-gray-100   overflow-hidden     shadow-md shadow-gray-600 w-[904px] rounded-xl ">

                        <div className="flex w-[904px] flex-col bg-opacity-50 p-5">
                            <img
                                src={clickData?.image || UrlData?.image}
                                alt="Background Image"
                                className=" h-80 object-cover"
                            />
                        </div>

                        <h2 className='text-4xl font-bold text-center '></h2>

                        <div className='text-start top-8 justify-start px-4 relative'>
                            {/* <img src={clickData?.userId?.profileImg} alt='User Profile' className='w-12 inline rounded-full mx-auto ' />
                            <h1 className='inline-block pl-2 text-lg absolute'>{clickData?.userId?.UserName}</h1>
                            <p className='inline top-4 text-sm left-2 relative'>{clickData?.Date}</p> */}

                            <img
                                src={(clickData ? clickData.userId?.profileImg : UrlData?.userId?.profileImg) || ""}
                                alt='User Profile'
                                className='w-12 inline rounded-full mx-auto '
                            />
                            <h1 className='inline-block pl-2 text-lg absolute'>
                                {(clickData ? clickData.userId?.UserName : UrlData?.userId?.UserName) || ""}
                            </h1>
                            <p className='inline top-4 text-sm left-2 relative'>
                                {(clickData ? clickData.Date : UrlData?.Date) || ""}
                            </p>
                        </div>


                        <div className='flex bg-transparent  mt-28 lg:right-0 left-40 bottom-24 relative  rounded-lg m-auto h-auto  overflow-hidden  sm:max-w-[100%]'
                            style={{

                                position: 'relative',
                                maxWidth: '800px',
                                right: '0'

                            }}
                        >
                            {((clickData?.userId?._id === userId) || (typeof UrlData !== 'string' && UrlData?.userId?._id === userId)) && (

                                <div className="m-5 "><button onClick={() => SetEditDatas(true)} className="flex p-2.5 bg-yellow-500 rounded-xl hover:rounded-3xl hover:bg-yellow-600 transition-all duration-300 text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button></div>
                            )}

                        </div>



                        <div style={{ left: "3.5rem" }} className="relative h- flex  justify-center items-center top-0  w-[800px] bg-white shadow-sm shadow-gray-600 rounded-lg overflow-y-auto">
                            <div className="w-full h-auto relative flex mx-auto p-2 bottom-20">
                                <div className="w-[60rem] preview mt-20 h-auto bg-white p-0 rounded-lg overflow-y-auto max-h-[950px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                                    <h3 className=" font-bold mb-2 p-10 text-4xl text-gray-900">{Taitle}</h3>

                                    <br />
                                    {clickData?.content ? (

                                        <div className="pl-3" dangerouslySetInnerHTML={{ __html: clickData?.content }} />
                                    ) : (
                                        <div className="pl-3" dangerouslySetInnerHTML={{ __html: typeof UrlData === 'object' ? UrlData.content : '' }} />


                                    )}
                                </div>
                            </div>
                        </div>





                        <div className="flex">

                        </div>




                        <div className='pt-5 pl-14'>
                            {((clickData && clickData.Videos?.length > 0) || (UrlData && typeof UrlData !== 'string' && UrlData?.Videos !== undefined && UrlData?.Videos?.length > 0)) && (
                                <button
                                    onClick={() => setIsModalOpen(prevState => !prevState)}
                                    className="h-10 w-1/2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
                                >
                                    video tutorial
                                </button>
                            )}


                            {isModalOpen && (
                                <div className="bg-white mt-5 h-auto w-[800px] rounded-xl relative shadow-md p-4">
                                    <div className="flex">
                                        <div className="flex flex-wrap">
                                            {(UrlData?.Videos || []).map((videoUrl: string, index: number) => (
                                                <div className="px-2 mb-4" key={index}>
                                                    <div className="rounded-lg overflow-hidden shadow-md">
                                                        <iframe
                                                            width="100%" // Set the width to 100% of the container
                                                            height="400px" // Set the height as needed
                                                            src={videoUrl}
                                                            title={`Embedded Video ${index}`}
                                                            frameBorder={0}
                                                            allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        ></iframe>
                                                    </div>
                                                </div>
                                            ))}
                                            {clickData?.Videos.map((videoUrl: string, index: number) => (
                                                <div className="px-2 mb-4" key={index}>
                                                    <div className="rounded-lg overflow-hidden shadow-md">
                                                        <iframe
                                                            width="100%" // Set the width to 100% of the container
                                                            height="400px" // Set the height as needed
                                                            src={videoUrl}
                                                            title={`Embedded YouTube Video ${index}`}
                                                            frameBorder={0}
                                                            allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        ></iframe>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}


                        </div>




                    </div>


                </div>









                {EditDatas && (

                    <>
                        <div id="loadingModal" aria-hidden="true" className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                            <form onSubmit={HandleEditPostDatas}>
                                <div className="max-w-6xl mx-auto mt-10 p-4 bg-white rounded-lg shadow-md overflow-auto " style={{ height: '45rem' }}>
                                    <div className="mb-4">
                                        <div className="max-w-6xl w-screen border-2   rounded-lg p-2">
                                            <div className='px-5 pb-1'>
                                                <div className='bg-gray-100 rounded-lg p-3 px-4 relative w-full h-20'>
                                                    <div className='relative flex justify-end  '>
                                                        <button
                                                            type="button"
                                                            onClick={handleModalToggle}
                                                            className="text-gray-800 bg-transparent cursor-pointer justify-center  relative z-10  hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 inline-flex  items-end"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="w-3 h-3 bottom-2 relative"
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

                                                        </button>
                                                    </div>

                                                    <div className='flex justify-start   px-7 bottom-6 relative   rounded-lg'>
                                                        <Box
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                width: 600,
                                                                maxWidth: '100%',
                                                                backgroundColor: 'white',
                                                                position: 'relative',
                                                            }}
                                                        >
                                                            <TextField onChange={(e) => setTaitle(e.target.value)}
                                                                id="outlined-basic" className='w-[100%] rounded-lg  relative' value={Taitle} label="Post Title" variant="outlined" />
                                                        </Box>
                                                    </div>
                                                </div>
                                            </div>

                                            <RichTextEditor initialValue={clickData.content} ModalEditorVAue={ModalEditorVAue}
                                            />







                                            <div className='flex justify-start left-10 relative bottom-28 bg  px-10'>
                                                <MuiChipsInput value={HashTag} onChange={handleChange} id="outlined-required"
                                                    label="HashTag"
                                                    className='bg-white h-14'
                                                />


                                                <div className='relative bottom-5 left-20 '>

                                                    <div className="w-36">
                                                        <label className="flex  text-sm font-medium text-gray-900 dark:text-black" htmlFor="multiple_files">
                                                            Upload multiple files
                                                        </label>
                                                        <div className="relative">
                                                            <label htmlFor="multiple_files" className="cursor-pointer ">
                                                                <div className="flex items-center justify-center p-4 rounded-lg border-2 bg-white border-blue-500 hover:bg-blue-100 transition-colors duration-300">
                                                                    <RiVideoUploadFill className="text-blue-500 text-4xl" />
                                                                </div>
                                                            </label>
                                                            <input
                                                                onChange={handleFileChange}
                                                                accept="video/*"
                                                                className="hidden"
                                                                id="multiple_files"
                                                                type="file"
                                                                multiple

                                                            />
                                                        </div>
                                                    </div>
                                                    {selectedVideos?.length > 0 &&
                                                        <button type='button' className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded" onClick={() => { showVideos == true ? setShowVideos(false) : setShowVideos(true) }} >
                                                            Show Videos
                                                        </button>
                                                    }
                                                </div>
                                            </div>
                                            {showVideos &&
                                                chunkArray(selectedVideos, 3).map((videoPair, pairIndex) => (
                                                    <div key={pairIndex} className="flex">
                                                        {videoPair.map((video, index) => (
                                                            <div key={index} className="w-1/2 px-2 mb-4">
                                                                <video className="cursor-pointer rounded-lg shadow-md" controls>
                                                                    <source src={URL.createObjectURL(video)} type={video.type} />
                                                                    Your browser does not support the video tag.
                                                                </video>
                                                                <button
                                                                    onClick={() => handleRemoveVideo(index + pairIndex * 3)}
                                                                    className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}





                                            <div className='pt-5 pl-14'>
                                                <div className="bg-white mb-10 bottom-2 h-auto w-[800px] rounded-xl relative shadow-md p-4 ">
                                                    <div className="flex ">
                                                        <div className="flex flex-wrap ">
                                                            {(UrlData?.Videos || []).map((videoUrl: string, index: number) => (
                                                                <div className="w-1/2 px-2 mb-4" key={index}>
                                                                    <div className="rounded-lg overflow-hidden shadow-md w-72">
                                                                        <iframe
                                                                            width="100%"
                                                                            height="100%"
                                                                            src={videoUrl}
                                                                            title={`Embedded Video ${index}`}
                                                                            frameBorder={0}
                                                                            allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                            allowFullScreen
                                                                        ></iframe>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleDeleteVideo(index, PostId)}

                                                                        className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            {clickData?.Videos.map((videoUrl: string, index: number) => (
                                                                <div className="w-1/2 px-2 mb-4" key={index}>
                                                                    <div className="rounded-lg overflow-hidden shadow-md w-72">
                                                                        <iframe
                                                                            width="100%"
                                                                            height="100%"
                                                                            src={videoUrl}
                                                                            title={`Embedded YouTube Video ${index}`}
                                                                            frameBorder={0}
                                                                            allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                            allowFullScreen
                                                                        ></iframe>
                                                                        <button
                                                                            onClick={() => handleDeleteVideo(index, PostId)}
                                                                            type='button'
                                                                            className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                        </div>
                                                    </div>
                                                </div>



                                            </div>












                                            <div className='justify-center  flex right-5 mb-20 rounded-xl bg-gray-100 px-11 ml-10 m-1  relative'>
                                                <button
                                                    type="submit"
                                                    className="text-white  top-1 relative  bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2  "
                                                >
                                                    UpdatePost
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                    <span className="sr-only">Loading...</span>
                                    <ToastContainer />
                                </div>
                            </form>

                        </div>

                    </>

                )}






















                {isLoading && (
                    <div
                        id="loadingModal"
                        aria-hidden="true"
                        className="fixed top-0 left-0 right-0 w-full h-screen flex items-center justify-center bg-gray-700 bg-opacity-50"
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












            </div >
        </>




































    )
}

export default UserPostsProfile

























// <>

//     <div className='bg-white h-screen'>
//         <div>

//             <div className='w-full h-screen flex' >
//                 <div className="grid   grid-cols-1  max-h-[400px]  overflow-hidden relative left-12 w-[20rem] ">
//                     <div className="fixed ml-0 pt-1 top-64 flex flex-col justify-around rounded-lg shadow-lg md:w-[16rem] bg-gray-200">
//                         <ul>
//                             <li className="flex  cursor-pointer items-center  md:w-2/5 h-12">
//                                 <AiFillHome className='text-3xl mx-auto' onClick={() => Navigate('/')} />
//                                 <h1 onClick={() => Navigate('/')} className="font-bold text-base">Home</h1>
//                             </li>

//                         </ul>
//                     </div>
//                 </div>

//                 <div className='grid xl:right-16 h-auto grid-cols-1 bg-gray-100     right-0 relative md:grid-cols-2 m-auto mt-24  shadow-sm mx-auto shadow-gray-600 sm:max-w-[900px]' style={{ width: '100%' }}>
//                     <div className='p-4 h-auto flex flex-col justify-around'>
//                         <div className="flex p-5 absolute top-0 left-0 w-auto h-52 bg-opacity-50">
//                             <img src={clickData?.image} alt="Background Image" className="h-full object-cover md:h-full w-full md:object-center" />
//                         </div>

//                         <h2 className='text-4xl font-bold text-center mb-8'></h2>

//                         <div className='text-start top-44  justify-start px-4 relative'>
//                             <img src={image} alt='User Profile' className='w-12 inline rounded-full mx-auto ' />
//                             <h1 className='inline-block pl-1 top-3 text-lg absolute'>{username}</h1>
//                         </div>


//                         <div className='top-10 relative bg-black'>
//                             <div className='bg-black  relative flex'>
//                             <div className="flex bg-black flex-col items-center justify-center left-72 top-52 relative">
//                                 <h2 className="w-full text-4xl font-bold text-start absolute mb-8">{clickData?.title}</h2>

//                             </div>

//                             </div>


//                             {/* <div style={{ width: '900px' }} className='relative top-80 h-auto right-4   bg-gray-100 shadow-sm   shadow-gray-600 '>
//                                 <div className='w-full h-auto lg:w-96  relative justify-center items-center flex'>
//                                     <div className="w-auto  mx-auto p-2 left-64 relative bottom-20 bg-gray-200 ">
//                                         <div style={{ width: '50rem' }} className="preview mt-4 h-auto bg-white p-0 rounded-lg overflow-y-auto">
//                                             <h3 className="text-xl font-bold mb-2 text-gray-900"></h3>
//                                             <div>

//                                             </div>
//                                             <br />
//                                             <div style={{ maxHeight: '950px' }}>
//                                                 <div className='pl-3' dangerouslySetInnerHTML={{ __html: clickData.content }} />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div> */}
//                         </div>

//                     </div>

//                 </div>

//             </div>
//         </div>

//     </div>

// </>









{/* <div className='grid  xl:right-16 grid-cols-1 bg-white right-0 relative  md:grid-cols-2 m-auto mt-24 h-[550px]  shadow-sm  mx-auto shadow-gray-600 sm:max-w-[900px]' style={{ width: '100%' }}>
                            <div className='p-4 flex flex-col justify-around '>
                                <div className="flex p-5 absolute top-0 left-0 w- h-52 bg-opacity-50 ">
                                    <img src={clickData?.image} alt="Background Image"
                                        className=" h-full object-cover md:h-full w-full md:object-center" />

                                </div>

                                <h2 className='text-4xl font-bold text-center mb-8'></h2>
                                <div>
                                    <div className='text-start justify-start right-20 relative'>

                                        <img
                                            src={userImage}
                                            alt='User Profile'
                                            className='w-12  inline rounded-full mx-auto my-4'
                                        />
                                        <h1 className='inline-block'>UserName</h1>
                                    </div>

                                </div>
                                <button className='w-full py-2 my-4 bg-green-600 hover:bg-green-500'>Sign In</button>


                            </div>

                        </div> */}