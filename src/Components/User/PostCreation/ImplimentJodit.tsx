import React, { useEffect, useState } from 'react';
import RichTextEditor from './joditPostCreation';
import Navbar from '../Navbar/Navbar';
import {  AiOutlineHome, AiOutlineUser } from 'react-icons/ai';
import { RiVideoUploadFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { Box, TextField } from '@material-ui/core';
import { CreatePostValidation } from '../../../utils/userValidation/PostValidation';
import { ToastContainer, toast } from 'react-toastify';
import { api } from '../../../services/axios';
import { uploadImage, uploadVideo } from '../../../services/Cloudinary/Cloud';
import { useSelector } from 'react-redux';
import { MuiChipsInput } from 'mui-chips-input'
import { format } from 'date-fns';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { BiArrowBack } from 'react-icons/bi';




function ImplementJodit() {
    const { userId } = useSelector((state: any) => state.user);
    const [Taitle, setTaitle] = useState<string>(""); // Provide type for the state
    const [img, setImg] = useState<string>('')
    const [plainText, setPlainText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const Navigate = useNavigate();
    const [previewContent, setPreviewContent] = useState("");
    const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
    const [showVideos, setShowVideos] = useState(false);
    const [HashTag, setHashTag] = useState<string[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());


    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000); // 1 minute in milliseconds

        return () => {
            clearInterval(intervalId);
        };
    }, []);
    const PostedDate = format(currentDate, "d MMMM yyyy hh:mm a");



    const handleChange = (newChips: string[]) => {

        const hasSpaces = newChips.some(tag => /\s/.test(tag));
        if (hasSpaces) {
            PostErr('Spaces are not allowed in tags');
        } else {
            const modifiedTags = newChips.map(tag => (tag.startsWith('#') ? tag : `#${tag}`));
            setHashTag(modifiedTags);
        }
    };



    const getValue = (newValue: string) => {


        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = newValue;
        const plainTextValue = tempDiv.innerText;
        setPlainText(plainTextValue);


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

    const PostErr = (err: any) => toast.error(err, {
        position: "bottom-right"
    });
    const PostSucess = (err: any) => toast.success(err, {
        position: "bottom-right"
    });



    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const videoFiles = Array.from(files).filter((file:File) => file.type.startsWith('video/'));
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



    const SubminAllPOstData = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {

        e.preventDefault();

        try {


            const err = CreatePostValidation(Taitle, previewContent, img, HashTag);

            if (err === 'success') {
                setIsLoading(true);
                const cloudImgUrl: String = await uploadImage(img);
                const uploadedVideoUrls: string[] = [];

                for (const video of selectedVideos) {
                    const uploadedUrl = await uploadVideo(video);
                    if (uploadedUrl) {
                        uploadedVideoUrls.push(uploadedUrl);
                    }
                }
                const data = await api.post('/PostCreation', { Taitle, previewContent, cloudImgUrl, userId, HashTag, PostedDate, uploadedVideoUrls }, { withCredentials: true });

                if (data) setIsLoading(false);

                Navigate('/');
                PostSucess('sucess');
            } else {
                PostErr(err);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleRemoveVideo = (index: number) => {
        setSelectedVideos((prevSelectedVideos) => {
            const updatedSelectedVideos = [...prevSelectedVideos];
            updatedSelectedVideos.splice(index, 1);
            return updatedSelectedVideos;
        });
    };





    return (
        <>

            <div className="relative z-20">
                <Navbar />
            </div>

            <div className="w-full flex bg-wh">
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




                <div className="grid md:right-0 bottom-6 sm:bottom-2 lg:left-2 xl:right-8 bg-gray-200 rounded-md    relative grid-cols-1 mt-24 md:grid-cols-2 mx-auto h-auto shadow-md shadow-gray-600 sm:max-w-[1050px]">
                    <div className="col-span-1 md:col-span-2">
                        {/* <BiArrowBack onClick={() => {  }} className=" md:hidden cursor-pointer inline-block" />/ */}
                        <div className="md:w-3/4 mx-auto mt-4">
                            <div className="md:w-3/4 mx-auto mt-4 flex items-center">
                                <div className='flex cursor-pointer '>
                                    <BiArrowBack onClick={() => { window?.history?.back(); }} className="text-xl left-2 relative md:hidden cursor-pointer inline-block" />
                                </div>
                                <div className="text-center w-full">
                                    <h3 className="text-xl  font-serif">Create Post</h3>
                                </div>
                            </div>
                            <br />
                        </div>
                        <form onSubmit={SubminAllPOstData}>
                            <div className='flex justify-center sm:p-0 px-2'>
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
                                        id="outlined-basic" className='w-[100%]' label="Post Title" variant="outlined" />
                                </Box>

                            </div>

                            <div className="flex justify-center mt-2 bg-gray-200 p-1">
                                <div className="max-w-6xl w-screen border-2 bg-white h-auto rounded-lg shadow-md p-4">
                                    <h2 className="text-2xl font-semibold mb-4"></h2>
                                    <RichTextEditor initialValue="" getValue={getValue} />
                                    <p className='hidden'>{plainText} </p>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row">
                                <div className="flex-1 md:p-10">
                                    <div className="bg-white h-auto rounded-lg shadow-md p-4 relative md:left-0 md:right-10">
                                        <label className="block mb-0 text-sm font-extrabold text-gray-900 dark:text-white" htmlFor="outlined-required">HashTag</label>
                                        <MuiChipsInput
                                            inputProps={{
                                                style: {
                                                    fontSize: '1.5rem',
                                                },
                                            }}
                                            value={HashTag}
                                            onChange={handleChange}
                                            id=""
                                            label="HashTag"
                                        />
                                        <div className="md:w-32">
                                            <label className="block text-sm font-medium text-gray-900 dark:text-white" htmlFor="multiple_files">
                                                Upload multiple files
                                            </label>
                                            <div className="relative">
                                                <label htmlFor="multiple_files" className="cursor-pointer">
                                                    <div className="flex items-center justify-center p-4 rounded-lg border-2 border-blue-500 hover:bg-blue-100 transition-colors duration-300">
                                                        <RiVideoUploadFill className="text-blue-500 text-4xl" />
                                                        <span className="ml-2 text-blue-600 font-semibold">Upload</span>
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

                                        {selectedVideos?.length > 0 && (
                                            <button
                                                type="button"
                                                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                                                onClick={() => { setShowVideos(!showVideos) }}
                                            >
                                                {showVideos ? "Hide Videos" : "Show Videos"}
                                            </button>
                                        )}

                                        {showVideos && (
                                            <div className="flex pt-2 flex-wrap ">
                                                {chunkArray(selectedVideos, 3).map((videoPair, pairIndex) => (
                                                    <div key={pairIndex} className="w-full sm:w-1/2 space-x-2 flex md:w-1/3 lg:w-1/4 xl:w-1/2">
                                                        {videoPair.map((video, index) => (
                                                            <div key={index} className="mb-4">
                                                                <video className="cursor-pointer rounded-lg shadow-md  " controls >
                                                                    <source src={URL?.createObjectURL(video)} type={video.type} />
                                                                    Your browser does not support the video tag.
                                                                </video>
                                                                <button type='button'
                                                                    onClick={() => handleRemoveVideo(index + pairIndex * 3)}
                                                                    className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-center md:justify-end p-5">
                                        <button
                                            type="submit"
                                            className="text-white bg-gradient-to-br cursor-pointer from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                                        >
                                            Publish
                                        </button>
                                    </div>
                                    <footer className="bg-gray-800 bottom-0 top-6 md:hidden text-white p-4 relative  left-0 w-full">
                                        <nav className="container mx-auto flex items-center justify-center">
                                            <div className="md:hidden">
                                                <div className="flex space-x-4">
                                                    <a className="hover:text-gray-400">
                                                        <AiOutlineHome className='text-2xl mx-5' onClick={() => { Navigate('/') }} />
                                                    </a>
                                                    <a className="hover:text-gray-400">
                                                        <HiOutlineUserGroup className='text-2xl mx-5' onClick={() => Navigate('/Community')} />
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
                            </div>

                            <div>
                            </div>



                        </form>
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




        </>
    );
}

export default ImplementJodit;









