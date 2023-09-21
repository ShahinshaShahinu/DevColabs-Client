import { useEffect, useMemo, useRef, useState } from "react";
import {  Communities, SendCommunityMessage } from "../../services/API functions/CommunityChatApi";
import { BiArrowBack } from "react-icons/bi";
import LoaderAbsolute from "../User/isLoading/LoaderAbsolute";
import { format } from "date-fns";
import { BsImageFill, BsThreeDotsVertical } from "react-icons/bs";
import { MdVideoLibrary } from "react-icons/md";
import { useSelector } from "react-redux";
import { SendMessagess } from "../../utils/interfaceModel/AdminInfra";
import { uploadImage, uploadVideo } from "../../services/Cloudinary/Cloud";
import { useSocket } from "../../Context/WebsocketContext";
import RightSidebar from "./RightSidebar";


interface SelectedProp {
    selectedChatss: any
    MessagesFrt: any
    setBackFromChat: (data: boolean) => void;
}

function CommunnityChat({ selectedChatss, MessagesFrt, setBackFromChat }: SelectedProp) {
    const socket = useSocket();
    const { userId } = useSelector((state: any) => state?.user);
    const [currentDate, setCurrentDate] = useState(new Date());
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000); // 1 minute in milliseconds

        return () => {
            clearInterval(intervalId);
        };
    }, []);
    const CurrentDAte = format(currentDate, "d MMMM yyyy hh:mm a");
    const [isLoading, setisLoading] = useState(false);
    const [showBigImageId, setShowBigImageId] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [messageInputmodal, setMessageInputmodal] = useState('');
    const [isImageSelected, setIsImageSelected] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const [sendImages, setSendImages] = useState<File | null>(null);
    const [sendVideos, setSendVideos] = useState<File | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const hiddenImageFileInput = useRef<HTMLInputElement | null>(null);
    const hiddenVideoFileInput = useRef<HTMLInputElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [sendMessageId, setSendMessageId] = useState<string>('');
    const [selectedChat, setSelectedChat] = useState<any | null>('');

    const videobbRef = useRef<HTMLVideoElement | null>(null);

    const handleDivClick = () => {
        if (videobbRef.current) {
            videobbRef.current.pause();
        }
    }

    useEffect(() => {
        if (chatContainerRef.current) {
            const container = chatContainerRef.current;
            container.scrollTop = container.scrollHeight - container.clientHeight;
        }
    }, [selectedChat]);
    const stopVideo = () => {
        if (videoRef?.current) {
            videoRef?.current?.pause();
            videoRef.current.currentTime = 0;
        }
    };
    useEffect(() => {
        const fetchChats = async () => {
            const Community = await Communities();
            const matchingItems = Community?.data?.[0]?.filter((item: any) => item?._id === selectedChatss?._id);
            setSelectedChat(matchingItems?.[0]);
        }
        fetchChats();
    }, [isLoading, socket, selectedChatss, isImageSelected]);



    const [Message, setMessage] = useState<SendMessagess | null>({
        Message: [{
            text: '',
            senderId: userId,
            image: '',
            video: '',
            timestamp: '',
        }],
    });
    let newMessage: SendMessagess = {
        Message: [{
            text: '',
            senderId: userId,
            image: '',
            video: '',
            timestamp: '',
        }],
    }

    const videoElement = useMemo(() => {
        if (sendVideos) {
            return (
                <div className="lg:max-w-lg sm:max-w-sm md:max-w-md h-auto pt-1 mx-auto rounded-lg shadow-lg">
                    <video ref={videoRef} src={URL.createObjectURL(sendVideos)} controls className="w-full h-auto rounded-lg">
                        Your browser does not support the video tag.
                    </video>
                </div>
            );
        }
        return null;
    }, [sendVideos]);

    useEffect(() => {
        socket.on('CommunityChat', async () => {
            try {
                const Community = await Communities();
                const matchingItems = Community?.data[0]?.filter((item: any) => item?._id === selectedChatss?._id);
                setSelectedChat(matchingItems?.[0]);
            } catch (error) {
                console.error('Error fetching chat data:', error);
            }
        });
        return () => {
            socket.off('CommunityChat');
        };
    }, [socket])

    const SendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (Message || sendImages || sendVideos) {
                if (Message && Message?.Message?.[0].text?.trim() != '') {
                    await SendCommunityMessage(Message, sendMessageId)
                    socket.emit('CommunityChat', true); MessagesFrt(true)
                    setisLoading(false); setIsImageSelected(false);
                }
                if (sendImages) {
                    setisLoading(true)
                    const SendImgUrl: string = await uploadImage(sendImages);
                    newMessage = {
                        Message: [{
                            text: Message?.Message?.[0]?.text,
                            senderId: userId,
                            image: SendImgUrl,
                            video: '',
                            timestamp: CurrentDAte,
                        }],
                    }
                    await SendCommunityMessage(newMessage, sendMessageId)
                    socket.emit('CommunityChat', true)
                    setisLoading(false); setIsImageSelected(false);
                }
                if (sendVideos) {
                    setisLoading(true)
                    const VideoURL = await uploadVideo(sendVideos);
                    newMessage = {
                        Message: [{
                            text: messageInputmodal,
                            senderId: userId,
                            image: '',
                            video: VideoURL,
                            timestamp: CurrentDAte,
                        }],
                    }
                    await SendCommunityMessage(newMessage, sendMessageId)
                    socket.emit('CommunityChat', true)
                    setisLoading(false); setIsImageSelected(false);
                }
            }

            setMessageInputmodal('')
            setMessageInput('');
            setMessage({
                Message: [{
                    text: '',
                    senderId: userId,
                    image: '',
                    video: '',
                    timestamp: '',
                }],
            })

        } catch (error) {

        }
    }
    const [isSidebarVisible, setSidebarVisibility] = useState(false);

    const toggleSidebar = () => {
        setSidebarVisibility(!isSidebarVisible);
    };


    return (
        <>


            <div className="flex-1  pt-1   pr-1 ">
                <div className="flex flex-col h-screen  rounded-lg shadow relative  " >
                    <div className="sm:mt-16  mt-12 pt-2.5 bottom-1 relative">
                        <div className="flex bg-[#f0f2f5] p-1.5 sm:p-2 rounded-t-lg  justify-between items-center border-b">
                            <div className="pr-2 flex items-center sm:hover:bg-blue-200 cursor-pointer md:hover:bg-white mr-2 rounded-2xl rounded-l-xl">
                                <BiArrowBack onClick={() => { setBackFromChat(false) }} className="w-5 h-5 md:hidden cursor-pointer inline-block" />
                                <img src={selectedChat?.Image} alt='' className="w-5 h-5 sm:w-7 sm:h-7 md:h-9 mt-0.5 md:w-9 inline-block rounded-full ml-2" />
                                <h2 className="md:text-lg sm:text-sm pl-2 text-xs flex-1 font-medium">{selectedChat?.Name}</h2>
                            </div>
                            <div className="absolute right-1 mx-5  rounded  cursor-pointer">
                                <div className="">
                                    <div
                                        className="flex items-center ">
                                        <BsThreeDotsVertical onClick={() => setSidebarVisibility(true)} className='text-2xl shadow ' />

                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    <RightSidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} selected={selectedChat} />
          


                    <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto border-r-2   scroll-m overflow-auto snap-end bg-white" key=''>
                        <div className={`absolute flex ${isImageSelected ? 'visible' : 'hidden'} overflow-y-auto overflow-x-hidden inset-0 flex items-center top-28 border-2 mt-3 justify-center bg-[#f1f2f5] z-10`}>
                            {isLoading === true &&

                                <LoaderAbsolute />

                            }
                            <form onSubmit={SendMessage} className="flex justify-center items-start">
                                <button
                                    type="button"
                                    onClick={() => { setIsImageSelected(false), setSendImages(null), setMessage(null), setMessageInputmodal(''), setIsMenuOpen(false) }}
                                    className="absolute flex-1 top-2 left-2 text-gray-900 hover:text-gray-700 focus:outline-none"
                                >
                                    <svg
                                        className="w-5 h-5 sm:w-7 sm:h-7"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="modal-content p-0 sm:p-4 top-10 rounded-lg relative">
                                    <div className={`modal ${isImageSelected ? 'visible' : 'hidden'}`}>
                                        <div className="modal-content bg-white p-4 relative mt-32 rounded-lg">
                                            {sendImages && (
                                                <img
                                                    src={URL.createObjectURL(sendImages)}
                                                    alt="Selected"
                                                    className="lg:max-w-lg sm:max-w-sm md:max-w-md h-auto mx-auto rounded-lg shadow-lg"
                                                />
                                            )}

                                            {videoElement}

                                        </div>
                                    </div>
                                    <div className="flex items-center mt-4 pt-2">
                                        <input
                                            onChange={(e) => {
                                                setMessageInputmodal(e?.target?.value);
                                                const newText = e.target.value;
                                                setMessage((prevMessage:any) => {
                                                    if (prevMessage && prevMessage?.Message) {
                                                        return {
                                                            ...prevMessage,
                                                            Message: [
                                                                {
                                                                    ...prevMessage.Message[0],
                                                                    text: newText,
                                                                    timestamp: CurrentDAte,
                                                                },
                                                            ],
                                                        };
                                                    }
                                                    return prevMessage;
                                                });
                                            }}
                                            value={messageInputmodal}

                                            placeholder="Type your message..."
                                            className="flex-1 rounded-lg border-2 py-1.5 pl-2 border-gray-400 hover:border-gray-500 focus:outline-none focus:border-blue-500"
                                        />
                                        <button onClick={() => { setSendMessageId(selectedChat?._id), stopVideo(), setIsMenuOpen(false) }}
                                            type="submit"
                                            className="mx-1 bg-blue-600 text-white p-2 md:p-2.5 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        >
                                            <svg
                                                className="w-4 h-4 sm:w-4 sm:h-4 transform rotate-90"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 18 20"
                                            >
                                                <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>








                        {selectedChat?.Message?.map((message: any, index: number) => (
                            <div

                                //  ref chat going to dwon area
                                key={index}
                                className={`mb-4 flex ${message?.senderId?._id === userId ? 'justify-end' : 'justify-start '
                                    }`}
                            >
                                {message?.senderId?._id !== userId && (
                                    <img
                                        src={message.senderId?.profileImg}
                                        className="w-4 h-4 flex rounded-full ml-1 mr-1"
                                    />

                                )}

                                <div className="flex flex-col items-start max-w-[75%] ">
                                    {message?.senderId?._id === userId ?
                                        (
                                            <>
                                                <div className="p-2 rounded-lg grid shadow-md max-w-[75%]  bg-green-200 text-black self-end   flex-col">
                                                    <span className="mb-1 text-sm font-semibold sm:w-full text-blue-500">{selectedChat.name}</span>
                                                    {message?.image?.trim() !== '' && message.image !== undefined && (

                                                        <>
                                                            <div onClick={() => setShowBigImageId(message?._id)} className="aspect-[4/3] relative cursor-pointer ">
                                                                <img
                                                                    src={message?.image}
                                                                    alt="Selected"
                                                                    className="object-cover object-center max-w-[400px] cursor-pointer w-full h-full"
                                                                />

                                                            </div>
                                                            {showBigImageId === message?._id && (
                                                                <div onClick={() => setShowBigImageId(null)} className={`fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black bg-opacity-75`}>
                                                                    <img
                                                                        src={message?.image}
                                                                        alt="Selected"
                                                                        className="max-w-full max-h-full cursor-pointer"
                                                                    />
                                                                </div>
                                                            )}

                                                        </>
                                                    )}
                                                    {message?.video?.trim() !== '' && message.video !== undefined && (
                                                        <>
                                                     
                                                            <div
                                                                onClick={() => {setShowBigImageId(null), setShowBigImageId(message?._id),handleDivClick }}
                                                                className=" relative cursor-pointer"
                                                            >
                                                                <video
                                                                    ref={videobbRef}
                                                                    src={message?.video}
                                                                    className="object-cover object-center max-w-[400px] w-full h-full"
                                                                     controls
                                                                />
                                                            </div>
                                                            {showBigImageId === message?._id && ( 
                                                            
                                                                <div
                                                                    onClick={() => setShowBigImageId(null)}
                                                                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                                                                >
                                                                    <video
                                                                        src={message?.video}
                                                                        controls
                                                                        autoPlay
                                                                        className="max-w-full max-h-full"
                                                                    >
                                                                        Your browser does not support the video tag.
                                                                    </video>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                    <h1 className="mb-1 my-0 overflow-hidden min-w-full whitespace-wrap break-words">
                                                        {message.text}
                                                    </h1>

                                                    <div className="flex justify-end">
                                                        <span className="text-xs text-gray-500 self-end justify-end relative">{message?.timestamp}</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {/* <div className="p-2 rounded-lg shadow-md grid max-w-[75%]  bg-gray-200 text-black self-start  flex-col"> */}
                                                <div className="px-2 p-1 rounded-lg shadow-md grid  bg-gray-200 text-black self-start flex-col">
                                                    <span className=" erflow-hidden sm:max-w-xs md:max-w-full     whitespace-wrap break-words text-blue-500">
                                                        {message?.senderId?.UserName}
                                                    </span>
                                                    {message?.image?.trim() !== '' && message.image !== undefined && (
                                                        <> <div onClick={() => setShowBigImageId(message?._id)} className="aspect-[4/3] ">
                                                            <img
                                                                src={message.image}
                                                                alt="Selected"
                                                                className="object-cover object-center  max-w-[400px]   w-full h-full"
                                                            />
                                                        </div>
                                                            {showBigImageId === message?._id && (
                                                                <div onClick={() => setShowBigImageId(null)} className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75`}>
                                                                    <img
                                                                        src={message.image}
                                                                        alt="Selected"
                                                                        className="max-w-full max-h-full"
                                                                    />
                                                                </div>
                                                            )}
                                                        </>


                                                    )}

                                                    <h1 className="mb-1     overflow-hidden sm:max-w-xs md:max-w-full     whitespace-wrap break-words">
                                                        {message.text}
                                                    </h1>
                                                    <div className="flex justify-end">
                                                        <span className="text-xs text-gray-500 justify-end  self-end">{message.timestamp}</span>
                                                    </div></div>
                                            </>

                                        )}
                                </div>

                                {message?.senderId?._id === userId && (
                                    <img
                                        src={message?.senderId?.profileImg}
                                        alt="Your User"
                                        className="w-4 h-4 rounded-full ml-1 mr-1"
                                    />
                                )}
                            </div>
                        ))}

                    </div>


                    {/* <div Footer footer footer */}





                    <div className="  bottom-3" >
                        <div className="sm:p-3 p-2 text-xs sm:text-sm md:p-4 border-t    bg-gray-200">
                            <form onSubmit={SendMessage}
                                className="flex items-center sm:space-x-1" >
                                {/* Image Video UPload  */}
                                {/* Image Video UPload  */}{/* Image Video UPload  */}{/* Image Video UPload  */}

                                <div className="    group">
                                    <div
                                        id="speed-dial-menu-default"
                                        className={`flex absolute bottom-10  flex-col items-center ${isMenuOpen ? "" : "hidden"
                                            } mb-4 space-y-2`}
                                    >
                                        <button
                                            onClick={() => { hiddenImageFileInput?.current?.click(); setSendImages(null); setSendVideos(null), setMessageInput('') }}
                                            type="button"
                                            data-tooltip-target="tooltip-share"
                                            data-tooltip-placement="left"
                                            className="flex justify-center items-center  w-7 h-7 text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200 dark:border-gray-600 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
                                        >
                                            <BsImageFill className="w-4 h-4" />
                                            <input
                                                type="file"
                                                ref={hiddenImageFileInput}
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={async (e) => {
                                                    try {
                                                        const imageFile = e.target.files?.[0];
                                                        if (imageFile) {
                                                            setSendImages(imageFile);
                                                            setIsImageSelected(true);

                                                        }
                                                    } catch (error) {
                                                        console.error('Error uploading image:', error);
                                                    }
                                                }}

                                            />
                                        </button>
                                        <button onClick={() => { hiddenVideoFileInput?.current?.click(); setSendVideos(null); setSendImages(null); setIsImageSelected(false); setMessage(null) }}
                                            type="button"
                                            data-tooltip-target="tooltip-print"
                                            data-tooltip-placement="left"
                                            className="flex  justify-center items-center w-7 h-7 text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200 dark:border-gray-600 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
                                        >
                                            <MdVideoLibrary className="w-4 h-4" />
                                            <input
                                                type="file"
                                                ref={hiddenVideoFileInput}
                                                accept="Video/*"
                                                style={{ display: 'none' }}
                                                onChange={async (e) => {
                                                    try {
                                                        const VideoFile = e.target.files?.[0];
                                                        if (VideoFile) {
                                                            setSendVideos(VideoFile);
                                                            setIsImageSelected(true);
                                                        }
                                                    } catch (error) {
                                                        console.error('Error uploading image:', error);
                                                    }
                                                }}
                                            />
                                        </button>
                                    </div>
                                    <a
                                        type="button"
                                        onClick={() => setIsMenuOpen((prevState) => !prevState)}
                                        aria-controls="speed-dial-menu-default"
                                        aria-expanded={isMenuOpen}
                                        className="flex cursor-pointer  items-center justify-center text-white bg-blue-700 rounded-full w-5  h-5 sm:w-7 sm:h-7 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
                                    >
                                        <svg
                                            className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform  ${isMenuOpen ? "rotate-45" : ""
                                                }`}
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 18 18"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 1v16M1 9h16"
                                            />
                                        </svg>
                                    </a>
                                </div>






                                <input
                                    onChange={(e) => {
                                        const newText = e.target.value;
                                        setMessageInput(newText); setSendImages(null);
                                        setMessage((prevMessage:any) => {
                                            if (prevMessage && prevMessage?.Message) {
                                                return {
                                                    ...prevMessage,
                                                    Message: [{
                                                        ...prevMessage.Message[0],
                                                        text: newText,
                                                        timestamp: CurrentDAte,
                                                    }],
                                                };

                                            }
                                            return prevMessage;
                                        });
                                    }}
                                    value={messageInput}
                                    type="text"
                                    placeholder="Type your message...  "
                                    className="flex-1 sm:px-4 py-0.5   md:py-1.5 rounded-lg border-2 border-gray-300 hover:border-gray-400 focus:outline-none focus:border-blue-500"
                                />
                                {Message?.Message?.[0].text?.trim() != '' && (
                                    <button
                                        onClick={() => setSendMessageId(selectedChat?._id)}
                                        type="submit"
                                        className="bg-blue-600 text-white p-2 md:p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    >
                                        <svg className="w-2 h-2 sm:w-4 sm:h-4 transform rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                                        </svg>
                                    </button>
                                )}
                            </form>
                        </div>


                    </div>


                </div >
            </div >

        </>
    )
}

export default CommunnityChat