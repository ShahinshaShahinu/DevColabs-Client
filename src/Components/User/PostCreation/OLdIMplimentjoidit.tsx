import React, { useEffect, useState } from 'react';
import RichTextEditor from './joditPostCreation';
import Navbar from '../Navbar/Navbar';
import { AiFillHome } from 'react-icons/ai';
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



function ImplementJodit() {
    const { userId } = useSelector((state: any) => state.user);
    const [Taitle, setTaitle] = useState<string>(""); // Provide type for the state
    const [img, setImg] = useState<string>('')
    const [plainText, setPlainText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const Navigate = useNavigate();
    const [previewVisible, setPreviewVisible] = useState(false);
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

            if(data)   setIsLoading(false);

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

            <div className="w-full flex bg-slate-100 ">
                <div
                    style={{ zIndex: '0' }}
                    className="h-16  bottom-40 flex m-auto max-h-[400px] w-0 rounded-lg shadow-lg bg-gray-300 relative md:z-50 lg:left-0 xl:left-28 md:left-0 overflow-hidden sm:w-[20rem] sm:max-w-[15rem] ml-1">
                    <div className="p-4 px-5 z-0 flex flex-col justify-center md:order-first md:w-4">
                        <ul>
                            <div className="flex cursor-pointer items-center w-20 h-12 -z-10">
                                <AiFillHome className="text-3xl" />
                                <li onClick={() => Navigate('/')} className="ml-2 font-bold">
                                    <h1 className="text-base">Home</h1>
                                </li>
                            </div>
                        </ul>
                    </div>
                </div>

                <div className="grid xl:right-8 bg-gray-200   right-0 relative grid-cols-1 mt-24 md:grid-cols-2 mx-auto h-auto shadow-inner shadow-gray-600 sm:max-w-[900px]">
                    <div className="col-span-1 md:col-span-2">
                        <div className="md:w-3/4 mx-auto mt-4">
                            <div className="text-center">
                                <h3 className="text-xl font-bold">Create Post</h3>
                            </div>
                            <br />

                        </div>
                        <form onSubmit={SubminAllPOstData}>
                            <div className='flex justify-center'>
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
                                    {/* <div dangerouslySetInnerHTML={{ __html: value }} /> */}
                                    <p className='hidden'>{plainText} </p>
                                </div>
                            </div>


                            <div className='flex'>
                                <div className='flex-1 p-10'>
                                    <div className='bg-white h-auto rounded-lg shadow-md p-4'>
                                        <label className="block mb-0 text-sm font-extrabold text-gray-900  dark:text-white" htmlFor="outlined-required">HashTag</label>
                                        <MuiChipsInput
                                            inputProps={{
                                                style: {
                                                    fontSize: '1.5rem', // Adjust the font size as needed
                                                },

                                            }}
                                            value={HashTag} onChange={handleChange} id="" label="HashTag" />
                                        <div className="w-24">
                                            <label className="block  text-sm font-medium text-gray-900 dark:text-white" htmlFor="multiple_files">
                                                Upload multiple files
                                            </label>
                                            <div className="relative">
                                                <label htmlFor="multiple_files" className="cursor-pointer">
                                                    <div className="flex items-center justify-center p-4 rounded-lg border-2 border-blue-500 hover:bg-blue-100 transition-colors duration-300">
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

                                    </div>

                                    <div className='flex justify-end p-5'>
                                        <button
                                            type="submit"
                                            className="text-white bg-gradient-to-br cursor-pointer  from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                                        >
                                            Publish
                                        </button>
                                    </div>
                                </div>

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
            <div>
                {/* Existing code... */}
                <button onClick={() => setPreviewVisible(true)} className='hidden'>Preview</button>
                {previewVisible && (
                    <div>
                        <h3>Preview:</h3>
                        <div dangerouslySetInnerHTML={{ __html: previewContent }} />
                        <button onClick={() => setPreviewVisible(false)}>Close</button>
                    </div>
                )}
            </div>




        </>
    );
}

export default ImplementJodit;













{/* <div className="min-h-screen flex top-20 absolute items-center justify-center bg-white  "> */ }
{/* <div className=" h-16   bottom-40    grid grid-cols-1 m-auto max-h-[400px] overflow-hidden rounded-lg shadow-lg bg-gray-200 relative left-10 w-[20rem] ml-1">
                    <div className="p-4  flex flex-col justify-around md:order-first md:w-4">
                        <ul>
                            <div className="flex cursor-pointer    items-center w-20 h-12">

                                <AiFillHome className='text-3xl' />
                                <li onClick={() => Navigate('/')} className="ml-2  font-bold   ">
                                    <h1 className="text-base"> Home </h1>
                                </li>
                            </div>
                        </ul>
                    </div>
                </div>
            </div> */}



















































{/* <div className='w-full h-screen flex'>
  <div className='grid grid-cols-1 md:grid-cols-2 mx-auto h-[750px] shadow-lg shadow-gray-600 sm:max-w-[900px]'>
    <div className="col-span-1 md:col-span-2 flex justify-center items-center relative">
      <div className="md:w-3/4 mx-auto mt-8">
        <div className="text-center">
          <h3 className="text-xl font-bold">Create Post</h3>
        </div>
        <div className="flex justify-center ">
          <div className="max-w-6xl  w-screen border-2 border-gray-300 rounded-md p-2">
            <RichTextEditor initialValue="" getValue={getValue} />
          </div>
        </div>
        <br />
        <div>{value}</div>
      </div>
    </div>
  </div>
</div> */}





{/* <div className='w-full h-screen flex'>
  <div className='grid grid-cols-1 md:grid-cols-2 mx-auto h-[750px] shadow-lg shadow-gray-600 sm:max-w-[900px]'>
    <div className="col-span-1 md:col-span-2">
      <div className="md:w-3/4 mx-auto mt-4"> 
        <div className="text-center">
          <h3 className="text-xl font-bold">Create Post</h3>
        </div>
        <div className="flex justify-center">
          <div className="max-w-6xl w-full border-2 border-gray-300 rounded-md p-2">
            <RichTextEditor initialValue="" getValue={getValue} />
          </div>
        </div>
        <br />
        <div>{value}</div>
      </div>
    </div>
  </div>
</div> */}







{/* <div className='w-full  h-screen flex '>
            <div className='grid grid-cols-1 md:grid-cols-2 m-auto h-[750px] shadow-lg shadow-gray-600 sm:max-w-[900px]'>
                <div className="row  w-screen    right-72 relative">
                    <div className="col-md-6" style={{ margin: "auto", marginTop: "50px" }}>
                        <div style={{ textAlign: "center" }}>
                            <h3>Rich Text Editor</h3>
                        </div>
                        <RichTextEditor initialValue="" getValue={getValue} />
                        <br />
                        <div>{value}</div>
                    </div>
                </div>
                </div>
            </div> */}


{/* <div className='w-full h-screen flex mt-7'>
                <div className='grid grid-cols-1 md:grid-cols-2 m-auto h-[750px] shadow-lg shadow-gray-600 sm:max-w-[900px]'>
                    <div className='p-4 flex flex-col justify-center items-start relative'>

                        <div className='bg-fuchsia-500 absolute md:-inset-x-32  -inset-x-0 md:left-56  left-0 top-0 flex justify-center items-center'>
                            <h1 className=''>Create Post</h1>
                        </div>

                        <div className='bg-black w-full h-72 bottom-44 relative flex justify-start'>
                            <h1>sssssssssssssss</h1>

                        </div>

                    </div>
                </div>
            </div> */}

// import React, { useState } from 'react'
// import RichTextEditor from './joditPostCreation';

// // Rest of the code

// function ImplementJodit() {
//     const [value, setValue] = useState<any>(""); // Provide type for the state

//     const getValue: any = (newValue: any) => { // Provide type for the function
//         setValue(newValue);
//     };

//     return (
//         <div className="row">
//             <div className="col-md-6" style={{ margin: "auto", marginTop: "50px" }}>
//                 <div style={{ textAlign: "center" }}>
//                     <h3>Rich Text Editor</h3>
//                 </div>
//                 <RichTextEditor initialValue="" getValue={getValue} />
//                 <br />
//                 <div>{value}</div>
//             </div>
//         </div>
//     );
// }

// export default ImplementJodit;
