import { JSXElementConstructor, Key, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import Navbar from "../User/Navbar/Navbar";
import { BiArrowBack } from "react-icons/bi";
import { BsImageFill, BsThreeDotsVertical } from "react-icons/bs";
import { format } from "date-fns";
import { Communities, Getchats, SendMessages } from "../../services/API functions/CommunityChatApi";
import Sidebar from "./Sidebar";
import { GetUsers } from "../../services/API functions/UserApi";
import { AllUsers } from "../../../../DevColab-Server/src/domain/models/user";
import { Chats, UserIdObject } from '../../../../DevColab-Server/src/domain/models/Chats';
import { useSelector } from "react-redux";
import { uploadImage, uploadVideo } from "../../services/Cloudinary/Cloud";
import LoaderAbsolute from "../User/isLoading/LoaderAbsolute";
import { useSocket } from "../../Context/WebsocketContext";
import { useLocation, useNavigate } from "react-router-dom";
import { MdVideoLibrary } from "react-icons/md";
import { CommunityUser } from '../../../../DevColab-Server/src/domain/models/Community';
import CommunnityChat from "./CommunnityChat";

function Chat() {
    const socket = useSocket(); const Navigate = useNavigate();
    const { userId } = useSelector((state: any) => state?.user);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [refresh, setRefresh] = useState(false)
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);
    const CurrentDAte = format(currentDate, "d MMMM yyyy hh:mm a");
    const [ispersonal, setPersonal] = useState(false)
    const [isCommunities, setCommunities] = useState<CommunityUser[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [Allusers, setAllusers] = useState<AllUsers[]>([]);
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [selectedCommunityChat, setselectedCommunityChat] = useState<any>(null);
    const [Message, setMessage] = useState<Chats | undefined | null>({
        userId: '',
        Message: [{
            text: '',
            senderId: '',
            image: '',
            timestamp: '',
        }],
        CreatedDate: '',
    });
    const [selectCommunity, setSelectCommunity] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const hiddenFileInput = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        if (chatContainerRef.current) {
            const container = chatContainerRef.current;
            container.scrollTop = container.scrollHeight - container.clientHeight;
        }
    }, [selectedChat]);
    const [showBigImageId, setShowBigImageId] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(Number);
    const [ChatMessage, setChatMessages] = useState([])
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [filteredItemsp, setFilteredItemsp] = useState<(AllUsers)[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [sendImages, setSendImages] = useState<File | null>(null);
    const [sendVideos, setSendVideos] = useState<File | null>(null);
    const [isImageSelected, setIsImageSelected] = useState(false);
    const [isLoading, setisLoading] = useState(false)
    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };
    const location = useLocation();
    const communityId = location?.state;
  
    useEffect(()=>{
        if(communityId){
            setSelectCommunity(true);
            setselectedCommunityChat(communityId);
           
        }
    },[selectedCommunityChat])
    useEffect(() => {
        socket.on('CommunityChat', async () => {
            try {
                const fetchedCommunities = await Communities();
                setCommunities(fetchedCommunities?.data[0]);
                const Community = await Communities();
                setselectedCommunityChat(Community?.data?.[0]?.[0]);
            } catch (error) {

            }
        })
        const fetchChats = async () => {
            const fetchedCommunities = await Communities();
            setCommunities(fetchedCommunities?.data[0])
            console.log(fetchedCommunities, 'fetchhhhh');

        }
        fetchChats();
        return () => {
            socket.off('CommunityChat');
        };
    }, [!ispersonal, isSidebarOpen, selectedCommunityChat, refresh]);
    const CommunityMSGS = (data: any) => {
        setRefresh(data)
    }
    useEffect(() => {
        socket.on('chat', async (data) => {
            try {
                console.log('chat message received:', data);
                const datas = await Getchats();
                setSelectedChat(datas?.data?.[0]);
            } catch (error) {
                console.error('Error fetching chat data:', error);
            }
        });

        return () => {
            socket.off('chat');
        };
    }, [socket]);

    let newMessage: Chats = {
        userId: '',
        Message: [{
            text: '',
            senderId: '',
            image: '',
            timestamp: '',
        }],
        CreatedDate: '',
    }
    const SendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            setRefresh(true)
            let res
            setFilteredItemsp([]);
            setMessageInput('');
            if (Message || sendImages || sendVideos) {
                if (sendImages) {
                    setisLoading(true)
                    setMessage(null)
                    const SendImgUrl: string = await uploadImage(sendImages);
                    newMessage = {
                        userId: '',
                        Message: [{
                            text: Message?.Message?.[0].text,
                            senderId: '',
                            image: SendImgUrl,
                            timestamp: CurrentDAte,
                        }],
                        CreatedDate: '',
                    }
                    res = await SendMessages(selectedChat?.userId?._id, newMessage, CurrentDAte);
                    if (res) {
                        setSendImages(null)
                        socket.emit('Chat', true)
                    }
                } else if (Message && Message != null && Message.Message?.[0].text?.trim() != '') {
                    console.log('mess valu message', Message);

                    res = await SendMessages(selectedChat?.userId?._id, Message, CurrentDAte);
                    socket.emit('Chat', true)
                }
                if (sendVideos) {
                    const VideoURL = await uploadVideo(sendVideos);
                    newMessage = {
                        userId: '',
                        Message: [{
                            text: Message?.Message?.[0].text,
                            senderId: '',
                            video: VideoURL,
                            timestamp: CurrentDAte,
                        }],
                        CreatedDate: '',
                    }
                    await SendMessages(selectedChat?.userId?._id, newMessage, CurrentDAte);
                    socket.emit('Chat', true)
                }
                setMessage({
                    userId: '',
                    Message: [{
                        text: '',
                        senderId: '',
                        image: '',
                        timestamp: '',
                    }],
                    CreatedDate: '',
                });
                const data = await Getchats();
                setChatMessages(data?.data);
                if (selectedChat?.filter === true) {
                    if (ChatMessage.length > 0) {
                    } else {
                        setChatMessages(data?.data);
                    }
                } else {
                    if (ChatMessage.length > 0) {
                        setSelectedChat(data?.data?.[0]);
                    }
                }
                setIsImageSelected(false)
                setisLoading(false)
                setRefresh(false)
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
      
        const fetchChats = async () => {
            const data = await Getchats();
            setChatMessages(data?.data);
            const allusers = await GetUsers()
            setAllusers(allusers?.data);
        }
        fetchChats();


    }, [refresh, socket, isSidebarOpen, setRefresh, selectedIndex, isLoading, selectedChat, setMessage, Message, filteredItemsp]);

    let newFilteredItems: (AllUsers)[] = [];
    useEffect(() => {
        if (searchTerm.trim() != '') {
            newFilteredItems = Allusers.filter(user => {
                const isUserInChat = ChatMessage.some((message: AllUsers) => message?.userId?._id === user._id || message?.senderId?._id === user?._id);
                const isUserNameMatch = user?.UserName?.trim().toLowerCase().includes(searchTerm.trim().toLowerCase());
                const isHashTagMatch = user?.UserHshTag?.SelectedTags?.some(tag =>
                    tag?.HshTagId?.Hashtag?.trim().toLowerCase().includes(searchTerm.trim().toLowerCase())
                );
                return !isUserInChat && user._id !== userId && (isUserNameMatch || isHashTagMatch);
            });
            setFilteredItemsp(newFilteredItems);
        } else {
            setFilteredItemsp([]);
        }
    }, [searchTerm]);
    const receiveDataFromChild = (data: boolean) => {
        setSidebarOpen(data)
    };



    return (
        <>

            <div>
                <div className="relative z-50">
                    <Navbar />
                </div>

                <div className="flex h-screen bg-white  relative">
                    <div className="md:w-1/4 bg-white md:mt-20 md:ml-4  hidden md:block rounded-t-lg border">
                        <div className="p-3 border-b flex bg-[#f0f2f5] justify-between items-center">
                            <div className="items-center flex ">
                                <BiArrowBack onClick={() => Navigate('/')} className='w-5 h-5 inline cursor-pointer relative ' />
                                <h2 className="text-lg font-semibold inline-block px-1 ">Chats</h2>
                            </div>
                            <div className={`h-7 w-7 ${isDropdownOpen ? 'text-gray-400 rounded-full bg-gray-200 items-center flex justify-center' : 'items-center flex justify-center'}`}>
                                <BsThreeDotsVertical
                                    onClick={toggleDropdown}
                                    className='h-5 w-5 cursor-pointer'
                                />
                            </div>
                        </div>
                        <div className="px-5 border-b mt-2   ">
                            {isSidebarOpen != true && (
                                <form >
                                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                                    <div className="relative mb-2">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                            </svg>
                                        </div>
                                        <input onChange={(e) => setSearchTerm(e.target.value)}
                                            type="search" id="default-search" className="block w-full py-1 p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
                                    </div>
                                </form>
                            )}
                            <div className="flex">
                                <button onClick={() => setPersonal(!ispersonal)}
                                    type="button"
                                    className={`${ispersonal
                                        ? 'bg-[#b3bcc9] underline decoration-4 decoration-[#7856FF] text-gray-900'
                                        : 'opacity-80 hover:bg-[#dddbdb]'
                                        } md:w-1/2 bg-transparent opacity-100 font-medium rounded-lg px-5 mr-2 mb-2 text-base`}
                                >
                                    Personal
                                </button>
                                <button onClick={() => setPersonal(!ispersonal)}
                                    type="button"
                                    className={`${!ispersonal
                                        ? 'bg-[#b3bcc9] underline decoration-4 cursor-pointer decoration-[#7856FF] text-gray-900'
                                        : 'opacity-80 hover:bg-[#dddbdb]'
                                        } md:w-1/2 bg-transparent opacity-100 cursor-pointer font-medium rounded-lg px-5  mr-5 mb-2 text-base`}
                                > Community</button>
                            </div>
                        </div>
                        {isDropdownOpen && (
                            <div className="relative dropdown-menu z-10">
                                <ul className="border bg-white shadow-lg absolute right-0  w-40 rounded-lg">
                                    <li onClick={() => setSidebarOpen(!isSidebarOpen)}
                                        className="p-3 cursor-pointer hover:bg-gray-100">
                                        <a
                                        >NewCommunity</a>
                                    </li>

                                </ul>
                            </div>
                        )}
                        {isSidebarOpen ? (
                            <Sidebar sendDataToParent={receiveDataFromChild} />
                        ) : (
                            <>
                                <div className="p-4 overflow-y-auto h-[calc(100vh-64px)] bg-gray-50 max-h-[calc(80vh-50px)]">
                                    <ul className="space-y-2" >
                                        {ispersonal && (
                                            <>
                                                {ChatMessage && ChatMessage?.map((chat: UserIdObject, index) => (

                                                    <div key={index}>

                                                        {(chat?.senderId?._id === userId || chat?.userId?._id === userId) && (

                                                            <li
                                                                key={index}
                                                                className={`p-2 flex rounded-lg shadow-md mb-4  cursor-pointer ${selectedChat?._id === chat?._id ? 'bg-blue-200' : ''
                                                                    }`}
                                                                onClick={() => {
                                                                    delete location.state,  setSelectedChat(chat), setDropdownOpen(false), setSelectCommunity(false), setSelectedIndex(index), setIsImageSelected(false)
                                                                }}
                                                            >
                                                                {chat?.senderId?._id === userId ? (
                                                                    <>
                                                                        <img src={chat?.userId?.profileImg} alt={chat?.userId?.profileImg} className="w-8 h-8 rounded-full mr-2" />
                                                                        {chat?.userId?.UserName}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <img src={chat?.senderId?.profileImg} alt={chat?.senderId?.profileImg} className="w-8 h-8 rounded-full mr-2" />
                                                                        {chat?.senderId?.UserName}
                                                                    </>
                                                                )}
                                                            </li>
                                                        )}
                                                    </div>

                                                ))}
                                            </>
                                        )}


                                        {!ispersonal && (
                                            <>
                                                {isCommunities &&
                                                    isCommunities.map((CommunityData, index) => (
                                                        <li
                                                            key={index}
                                                            className={`p-2 border flex cursor-pointer rounded-lg shadow-lg mb-4 ${selectedCommunityChat?._id === CommunityData?._id ? 'bg-blue-200' : 'bg-white'
                                                                }`}
                                                            onClick={() => { delete location.state, 
                                                                setselectedCommunityChat(CommunityData),
                                                                setSelectCommunity(true), setSelectedChat(false)
                                                            }}
                                                        >
                                                            <div className="flex items-center mb-2">
                                                                <img
                                                                    src={CommunityData?.Image}
                                                                    alt={CommunityData?.Image}
                                                                    className="w-8 h-8 rounded-full mr-2"
                                                                />
                                                                <div>
                                                                    <p className="text-lg font-normal">{CommunityData?.Name}</p>


                                                                    <div className="text-gray-600 w-64 overflow-hidden"> {/* Set the width constraint on the outer container */}
                                                                        <div className="mr-2 flex">
                                                                            <div className="flex overflow-hidden overflow-ellipsis break-words">
                                                                                {CommunityData?.HashTag?.map((tag, tagIndex) => (
                                                                                    <div
                                                                                        key={tagIndex}
                                                                                        className="overflow-hidden overflow-ellipsis break-words"
                                                                                        style={{
                                                                                            maxWidth: '100%', // Optionally, limit the tag width
                                                                                        }}
                                                                                    >
                                                                                        {tag}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                            </>
                                        )}

                                    </ul>

                                    <ul className="space-y-2">
                                        {filteredItemsp.length > 0 && filteredItemsp?.map((chat, index) => (
                                            <li
                                                key={index}
                                                className={`p-2 flex rounded-lg cursor-pointer ${selectedChat?.userId?._id === chat?._id ? 'bg-blue-200' : ''
                                                    }`}
                                                onClick={() => {
                                                    console.log(chat, 'log chat');
                                                    setSelectedChat({ userId: chat, filter: true }); setIsImageSelected(false)
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                {filteredItemsp.length > 0 && (
                                                    <>
                                                        <img src={chat?.profileImg} alt={chat?.profileImg} className="w-8 h-8 rounded-full mr-2" />
                                                        {chat?.UserName}
                                                    </>

                                                )}

                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                    {/* Chat Area */}

                    <div className="flex-1 p-1 pt-1 ">
                        {selectedChat ? (
                            <div className="flex flex-col h-full  rounded-lg shadow  relative" >
                                <div className="sm:mt-16 mt-12 pt-2.5  ">

                                    <div className="flex bg-[#f0f2f5] p-1.5 sm:p-2 rounded-t-lg justify-between  items-center border-b">


                                        {selectedChat?.senderId?._id === userId ? (
                                            <>
                                                <div
                                                    className="pr-2  flex items-center sm:hover:bg-blue-200 md:hover:bg-white mr-2  rounded-2xl rounded-l-3xl">
                                                    <BiArrowBack onClick={() => setSelectedChat(null)} className='w-5 h-5 md:hidden inline-block' />
                                                    <img src={selectedChat?.userId?.profileImg} alt={selectedChat?.userId?.profileImg} className="w-5 h-5 sm:w-7 sm:h-7 md:h-9 mt-0.5 md:w-9 inline-block rounded-full ml-2" />
                                                    <h2 className="md:text-lg sm:text-sm pl-2  text-xs flex-1  font-semibold">{selectedChat?.userId?.UserName}</h2>
                                                </div>
                                            </>) : (
                                            (selectedChat?.userId?._id === userId ? (
                                                <>
                                                    <div
                                                        className="pr-2  flex items-center sm:hover:bg-blue-200 md:hover:bg-white mr-2  rounded-2xl rounded-l-3xl">
                                                        <BiArrowBack onClick={() => setSelectedChat(null)} className='w-5 h-5 md:hidden inline-block' />
                                                        <img src={selectedChat?.senderId?.profileImg} alt={selectedChat?.userId?.profileImg} className="w-10 h-10 inline-block rounded-full ml-2" />
                                                        <h2 className="md:text-lg pl-3 sm:text-sm  text-xs  font-semibold over  overflow-hidden  whitespace-wrap break-words">{selectedChat?.senderId?.UserName}</h2>
                                                    </div>
                                                </>
                                            ) : (

                                                <>
                                                    <div
                                                        className="pr-2  flex items-center sm:hover:bg-blue-200 md:hover:bg-white mr-2  rounded-2xl rounded-l-3xl">
                                                        <BiArrowBack onClick={() => setSelectedChat(null)} className='w-5 h-5 md:hidden inline-block' />
                                                        <img src={selectedChat?.userId?.profileImg} alt={selectedChat?.userId?.profileImg} className="w-10 h-10 inline-block rounded-full ml-2" />
                                                        <h2 className="md:text-lg sm:text-sm  text-xs font-semibold ">{selectedChat?.userId?.UserName}</h2>
                                                    </div>
                                                </>
                                            ))
                                        )}

                                        <div className="absolute right-0  bg-white rounded shadow cursor-pointer">
                                            {/* <div className="p-2">
                                                <div className="flex items-center">
                                                    <AiOutlineClear className="inline mr-2" />
                                                    <p className="inline">Clear</p>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                                <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto scroll-m snap-end bg-white " key={selectedChat?._id} >

                                    <div className={`absolute  flex ${isImageSelected ? 'visible' : 'hidden'}  overflow-y-auto overflow-x-hidden inset-0 flex items-center top-32 mt-3 justify-center bg-[#f0f2f5]  z-10`}>
                                        {isLoading === true && (<LoaderAbsolute />)}
                                        <form onSubmit={SendMessage} className="flex justify-center items-start">
                                            <button
                                                type="button"
                                                onClick={() => setIsImageSelected(false)}
                                                className="absolute  flex-1 top-2 left-2 text-gray-900 hover:text-gray-700 focus:outline-none"
                                            >
                                                <svg
                                                    className="w-5 h-5 sm:w-7 sm:h-7"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                            <div className="modal-content   p-0 sm:p-4 top-10 rounded-lg relative " >
                                                <div className={`modal ${isImageSelected ? 'visible' : 'hidden'}`}>

                                                    <div className="modal-content bg-white p-4 relative  mt-32  rounded-lg">

                                                        {sendImages && (
                                                            <img
                                                                src={URL.createObjectURL(sendImages)}
                                                                alt="Selected"
                                                                className="lg:max-w-lg sm:max-w-sm md:max-w-md  h-auto mx-auto rounded-lg shadow-lg"
                                                            />
                                                        )}
                                                        {sendVideos && (
                                                            <div className="lg:max-w-lg sm:max-w-sm md:max-w-md  h-auto pt-1 mx-auto rounded-lg shadow-lg">
                                                                <video src={URL.createObjectURL(sendVideos)} controls className="w-full h-auto rounded-lg">
                                                                    Your browser does not support the video tag.
                                                                </video>
                                                            </div>
                                                        )}

                                                    </div>

                                                </div>
                                                <div className="flex items-center mt-4 pt-2">
                                                    <input
                                                        onChange={(e) => {
                                                            const newText = e.target.value;
                                                            setMessageInput(newText);
                                                            setMessage(prevMessage => {
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
                                                        placeholder="Type your message..."
                                                        className="flex-1 rounded-lg border-2  py-1.5 pl-2 border-gray-400 hover:border-gray-500 focus:outline-none focus:border-blue-500"
                                                    />

                                                    <button
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

                                    {selectedChat?.Message?.map((message: {
                                        [x: string]: any; id: Key | null | undefined; sender: string; text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined; timestamp: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined;
                                    }, index: number) => (
                                        <div
                                            key={index}
                                            className={`mb-4 flex ${message?.senderId?._id === userId ? 'justify-end' : 'justify-start '
                                                }`}
                                        >
                                            {message.senderId?._id !== userId && (
                                                <img
                                                    src={message.senderId?.profileImg}
                                                    className="w-4 h-4 flex rounded-full ml-1 mr-1"
                                                />

                                            )}

                                            <div className="flex flex-col items-start ">
                                                {message?.senderId?._id === userId ?
                                                    (
                                                        <>
                                                            <div className="p-2 rounded-lg grid shadow-md max-w-[75%]  bg-green-200 text-black self-end   flex-col">
                                                                <span className="mb-1 text-sm font-semibold sm:w-full text-blue-500">{selectedChat.name}</span>
                                                                {message?.image?.trim() !== '' && message.image !== undefined && (

                                                                    <>
                                                                        <div onClick={() => setShowBigImageId(message?._id)} className="aspect-[4/3] relative cursor-pointer">
                                                                            <img
                                                                                src={message.image}
                                                                                alt="Selected"
                                                                                className="object-cover object-center max-w-[400px] w-full h-full"
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
                                                                {message?.video?.trim() !== '' && message.video !== undefined && (
                                                                    <>
                                                                        <div
                                                                            onClick={() => setShowBigImageId(message?._id)}
                                                                            className=" relative cursor-pointer"
                                                                        >
                                                                            <video
                                                                                src={message.video}
                                                                                className="object-cover object-center max-w-[400px] w-full h-full"
                                                                                controls />
                                                                        </div>
                                                                        {showBigImageId === message?._id && (
                                                                            <div
                                                                                onClick={() => setShowBigImageId(null)}
                                                                                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                                                                            >
                                                                                <video
                                                                                    src={message.video}
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
                                                                <h1 className="mb-1 my-2 overflow-hidden min-w-full whitespace-wrap break-words">
                                                                    {message.text}
                                                                </h1>

                                                                <div className="flex justify-end">
                                                                    <span className="text-xs text-gray-500 self-end justify-end relative">{message.timestamp}</span>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="p-2 rounded-lg shadow-md grid max-w-[75%] bg-gray-200 text-black self-start  flex-col">

                                                                <span className="mb-1 text-sm font-semibold sm:w-full text-blue-500">{selectedChat.name}</span>
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

                                    {/* <div  ref={chatContainerRef} /> */}
                                </div>
                                <div className="sm:p-3 p-2 text-xs sm:text-sm md:p-4 border-t -z-  relative bg-gray-200">
                                    <form onSubmit={SendMessage}
                                        className="flex items-center sm:space-x-1" >
                                        {/* Image Video UPload  */}
                                        {/* Image Video UPload  */}{/* Image Video UPload  */}{/* Image Video UPload  */}

                                        <div className=" bottom-5   group">
                                            <div
                                                id="speed-dial-menu-default"
                                                className={`flex absolute bottom-11  flex-col items-center ${isMenuOpen ? "" : "hidden"
                                                    } mb-4 space-y-2`}
                                            >
                                                <button
                                                    onClick={() => { hiddenFileInput?.current?.click(); }}
                                                    type="button"
                                                    data-tooltip-target="tooltip-share"
                                                    data-tooltip-placement="left"
                                                    className="flex justify-center items-center  w-9 h-9 text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200 dark:border-gray-600 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
                                                >
                                                    <BsImageFill className="w-5 h-5" />
                                                    <input
                                                        type="file"
                                                        ref={hiddenFileInput}
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
                                                <button onClick={() => { hiddenFileInput?.current?.click(); }}
                                                    type="button"
                                                    data-tooltip-target="tooltip-print"
                                                    data-tooltip-placement="left"
                                                    className="flex  justify-center items-center w-9 h-9 text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200 dark:border-gray-600 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
                                                >
                                                    <MdVideoLibrary className="w-5 h-5" />
                                                    <input
                                                        type="file"
                                                        ref={hiddenFileInput}
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
                                                className="flex cursor-pointer  items-center justify-center text-white bg-blue-700 rounded-full w-8 h-8 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
                                            >
                                                <svg
                                                    className={`w-5 h-5 transition-transform  ${isMenuOpen ? "rotate-45" : ""
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
                                                setMessageInput(newText);
                                                setMessage(prevMessage => {
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
                                            className="flex-1 sm:px-4 py-0.5  relative md:py-1.5 rounded-lg border-2 border-gray-300 hover:border-gray-400 focus:outline-none focus:border-blue-500"
                                        />
                                        {Message?.Message?.[0].text?.trim() != '' && (
                                            <button
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
                        ) : (
                            <>
                                {selectCommunity && selectCommunity ? (
                                    <>
                                        <CommunnityChat selectedChatss={selectedCommunityChat} MessagesFrt={CommunityMSGS} setBackFromChat={(data => setSelectCommunity(data))} />

                                    </>
                                ) : (



                                    <><div className="hidden sm:hidden md:flex  lg:flex justify-center items-center h-full">
                                        <p className="text-gray-500">Select a chat to start chatting.</p>
                                    </div><div className="md:w-1/4 bg-white md:mt-20 md:pt-3 mt-16 md:hidden  rounded-t-lg border-r">
                                            <div className=" border-b">

                                                {/* again Search Comoponent                */}    {/* again Search Comoponent                */} {/* again Search Comoponent                */} {/* again Search Comoponent                */}
                                                {/* again Search Comoponent                */} {/* again Search Comoponent                */} {/* again Search Comoponent                */} {/* again Search Comoponent                */}
                                                {/* again Search Comoponent                */} {/* again Search Comoponent                */} {/* again Search Comoponent                */} {/* again Search Comoponent                */}



                                                <div className="md:w-1/4 bg-white md:mt-20    md:block rounded-t-lg border-r">
                                                    <div className="p-4 border-b flex bg-[#f0f2f5] justify-between items-center">

                                                        {isSidebarOpen == true ? (
                                                            <>
                                                                <BiArrowBack onClick={() => setSidebarOpen(!isSidebarOpen)} className='w-5 h-5' />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <BiArrowBack onClick={() => Navigate('/')} className='w-5 h-5' />
                                                            </>

                                                        )}



                                                        <h2 className="text-lg font-semibold">Chats</h2>
                                                        <div className={`h-7 w-7 ${isDropdownOpen ? 'text-gray-400 rounded-full bg-gray-200 items-center flex justify-center' : 'items-center flex justify-center'}`}>
                                                            <BsThreeDotsVertical
                                                                onClick={toggleDropdown}
                                                                className='h-5 w-5 cursor-pointer' />
                                                        </div>
                                                    </div>
                                                    {isDropdownOpen && (
                                                        <div className="relative dropdown-menu z-10">
                                                            <ul className="border bg-white shadow-lg absolute right-0  w-40 rounded-lg">
                                                                <li onClick={() => setSidebarOpen(!isSidebarOpen)}
                                                                    className="p-3 cursor-pointer hover:bg-gray-100">
                                                                    <a
                                                                    >NewCommunity</a>
                                                                </li>

                                                            </ul>
                                                        </div>
                                                    )}
                                                    <div className="px-2 border-b mt-2   ">

                                                        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                                                        <div className="relative mb-2">
                                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                                                </svg>
                                                            </div>
                                                            <input onChange={(e) => setSearchTerm(e.target.value)}
                                                                type="search" id="default-search" className="block w-full py-2 p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <button onClick={() => setPersonal(!ispersonal)}
                                                                type="button"
                                                                className={`${ispersonal
                                                                    ? 'bg-[#b3bcc9] underline decoration-4 decoration-[#7856FF] text-gray-900'
                                                                    : 'opacity-80 hover:bg-[#dddbdb]'
                                                                    } md:w-1/2 bg-transparent opacity-100 font-medium rounded-lg px-5 mr-2 mb-2 text-base`}
                                                            >
                                                                Personal
                                                            </button>
                                                            <button onClick={() => setPersonal(!ispersonal)}
                                                                type="button"
                                                                className={`${!ispersonal
                                                                    ? 'bg-[#b3bcc9] underline decoration-4 decoration-[#7856FF] text-gray-900'
                                                                    : 'opacity-80 hover:bg-[#dddbdb]'
                                                                    } md:w-1/2 bg-transparent opacity-100 font-medium rounded-lg px-5  mr-5 mb-2 text-base`}
                                                            > Community</button>
                                                        </div>

                                                    </div>



                                                    {isSidebarOpen ? (
                                                        <Sidebar sendDataToParent={receiveDataFromChild} />
                                                    ) : (
                                                        <>
                                                            <div className="p-2 overflow-y-auto h-[calc(100vh-64px)] bg-gray-50 max-h-[calc(80vh-50px)]">
                                                                <ul className="space-y-2">
                                                                    {ispersonal && (
                                                                        <>
                                                                            {ChatMessage && ChatMessage?.map((chat: UserIdObject, index) => (

                                                                                <div key={index}>

                                                                                    {(chat?.senderId?._id === userId || chat?.userId?._id === userId) && (

                                                                                        <li
                                                                                            key={index}
                                                                                            className={`p-2 flex rounded-lg  shadow-lg  cursor-pointer ${selectedChat?._id === chat?._id ? 'bg-blue-200' : ''}`}
                                                                                            onClick={() => {
                                                                                                setSelectedChat(chat), setDropdownOpen(false), setSelectedIndex(index);
                                                                                            }}
                                                                                        >
                                                                                            {chat?.senderId?._id === userId ? (
                                                                                                <>
                                                                                                    <img src={chat?.userId?.profileImg} alt={chat?.userId?.profileImg} className="w-8 h-8 rounded-full mr-2" />
                                                                                                    <h1 className=" overflow-hidden sm:max-w-xs md:max-w-full     whitespace-wrap break-words">{chat?.userId?.UserName}</h1>
                                                                                                </>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <img src={chat?.senderId?.profileImg} alt={chat?.senderId?.profileImg} className="w-8 h-8 rounded-full mr-2" />
                                                                                                    <h1 className=" overflow-hidden sm:max-w-xs md:max-w-full     whitespace-wrap break-words"> {chat?.senderId?.UserName}</h1>
                                                                                                </>
                                                                                            )}
                                                                                        </li>
                                                                                    )}
                                                                                </div>

                                                                            ))}
                                                                        </>
                                                                    )}
                                                                    {!ispersonal && (
                                                                        <>
                                                                            {isCommunities &&
                                                                                isCommunities.map((CommunityData, index) => (
                                                                                    <li
                                                                                        key={index}
                                                                                        className={`p-2 border flex  rounded-lg shadow-lg mb-4 ${selectedCommunityChat?._id === CommunityData?._id ? 'bg-blue-200' : 'bg-white'
                                                                                            }`}
                                                                                        onClick={() => { setselectedCommunityChat(CommunityData), setSelectCommunity(true), setSelectedChat(false) }}
                                                                                    >
                                                                                        <div className="flex items-center mb-2">
                                                                                            <img
                                                                                                src={CommunityData?.Image}
                                                                                                alt={CommunityData?.Image}
                                                                                                className="w-8 h-8 rounded-full mr-2"
                                                                                            />
                                                                                            <div>
                                                                                                <p className="text-lg font-normal">{CommunityData?.Name}</p>


                                                                                                <div className="text-gray-600 w-64 overflow-hidden"> {/* Set the width constraint on the outer container */}
                                                                                                    <div className="mr-2 flex">
                                                                                                        <div
                                                                                                            className="flex"
                                                                                                            style={{
                                                                                                                whiteSpace: 'nowrap',
                                                                                                                overflow: 'hidden',
                                                                                                                textOverflow: 'ellipsis',

                                                                                                            }}
                                                                                                        >
                                                                                                            {CommunityData?.HashTag?.map((tag, tagIndex) => (
                                                                                                                <div key={tagIndex}>{tag}</div>
                                                                                                            ))}
                                                                                                        </div>

                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </li>
                                                                                ))}
                                                                        </>
                                                                    )}

                                                                </ul>
                                                                <ul className="space-y-2">
                                                                    {filteredItemsp.length > 0 && filteredItemsp?.map((chat, index) => (
                                                                        <li
                                                                            key={index}
                                                                            className={`p-2 flex rounded-lg cursor-pointer ${selectedChat?.userId?._id === chat?._id ? 'bg-blue-200' : ''}`}
                                                                            onClick={() => {
                                                                                console.log(chat, 'log chat');
                                                                                setSelectedChat({ userId: chat, filter: true });
                                                                                setDropdownOpen(false);
                                                                            }}
                                                                        >
                                                                            {filteredItemsp.length > 0 && (
                                                                                <>

                                                                                    <img src={chat?.profileImg} alt={chat?.profileImg} className="w-8 h-8 rounded-full mr-2" />
                                                                                    {chat?.UserName}
                                                                                </>

                                                                            )}

                                                                        </li>
                                                                    ))}
                                                                </ul>

                                                            </div>

                                                        </>
                                                    )}

                                                </div>
                                            </div>

                                        </div></>


                                )}


                            </>
                        )}
                    </div>

                </div >
            </div >
        </>
    )
}

export default Chat

