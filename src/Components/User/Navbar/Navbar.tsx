import { useState, useRef, useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { IoIosNotifications, IoIosNotificationsOutline } from "react-icons/io";
import { IoCreateOutline } from "react-icons/io5";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { api } from "../../../services/axios";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../../../utils/interfaceModel/userInfra";
import { updateUser } from "../../../redux/user/userSlice";
import { ChatnotificationReactType } from "../../../utils/interfaceModel/userInfra";
import { DeletNotification, GetNotification, Readed } from "../../../services/API functions/UserApi";
import Loading from "../isLoading/Loading";
import { useSocket } from '../../../Context/WebsocketContext'
import FullScreenButton from "./FullScreenButton";



function Navbar() {
  const { userEmail, username, userId } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const { image } = useSelector((state: any) => state.user);
  const isButtonClicked = useRef(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserCircle, setshowUserCircle] = useState(false);
  const [userData, setUserData] = useState<User>();
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [Notification, setNotification] = useState<ChatnotificationReactType[]>()
  const [hasUnreadNotifications, sethasUnreadNotifications] = useState(false)
  const [isLoading, setIsLoading] = useState(false);


  const socket = useSocket();

  useEffect(() => {
    socket.on('adminMessage', async (data) => {
      console.log('Admin message received:', data);
      const Notifications = await GetNotification();
      setNotification(Notifications?.data);
      sethasUnreadNotifications(true);
    });
    socket.on('chat', async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const Notifications = await GetNotification();
        setNotification(Notifications?.data);
        console.log(Notifications?.data, 'noti fif cso socket ');
        const hasUnread = !!(Notifications?.data?.[0] && !Notifications?.data[0]?.read);
        sethasUnreadNotifications(hasUnread);
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    });
    return () => {
      socket.off('adminMessage');
      // socket.off('chat');
    };
  }, [socket]);

  useEffect(() => {
    const Userauth = localStorage.getItem("user");
    if (!Userauth) {
      localStorage.removeItem('user')
      console.log('jjj');

      dispatch(updateUser({}));
      googleLogout();
    }
  }, []);


  // useEffect(() => {
  //   const getAuth = async () => {
  //     try {
  //       console.log('user auth auth');



  //       const data:any = await api.post('/auth', null, { withCredentials: true });
  //       console.log(data ,'akuth get auth');

  //       if(data?.data?.error==='Invalid'){
  //         console.log('invalid');

  //         localStorage.removeItem('user');
  //         navigate('/login')
  //       }

  //       if (!data?.status) {
  //         console.log('nnnnnnnnnnnnnnnnoooooooooooooooooooo');

  //         localStorage.removeItem('user');
  //         navigate('/login')
  //       }
  //     } catch (error) {

  //     }
  //   }
  //   getAuth();

  // }, []);





  // useEffect(() => {
  //   const socket = io('ws://localhost:3000');

  //   socket.on('connect', () => {
  //     console.log('WebSocket connected');

  //     socket.emit('hello from client'); // Send a hello message to the server
  //   });

  //   socket.on('connect_error', (error) => {
  //     console.error('WebSocket connection error:', error);
  //   });

  //   socket.on('hello from server', (arg1, arg2, arg3) => {
  //     console.log('Received hello from server:', arg1, arg2, arg3);
  //   });

  //   socket.on('disconnect', () => {
  //     console.log('WebSocket disconnected');
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);





  useEffect(() => {
    const fetchNotification = async () => {
      try {
        setIsLoading(true); // Start loading
        const Notifications = await GetNotification();
        setNotification(Notifications?.data);
        const hasUnread = await Notifications?.data?.some((notification: { read: boolean }) => !notification?.read);
        sethasUnreadNotifications(hasUnread);
        if (isNotificationModalOpen) {
          await Readed();
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);

      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchNotification();
  }, [isNotificationModalOpen, userData, socket]);



  // useEffect(() => {
  //   const fetch = async () => {
  //     const Notifications = await GetNotification();
  //     setNotification(Notifications?.data);
  //     const hasUnread = Notifications?.data?.some((notification: { read: any }) => !notification?.read);
  //     console.log('sssssssssssssssssssssssss',hasUnread);

  //     sethasUnreadNotifications(hasUnread);
  //   }
  //   fetch();

  // }, [userData, setNotification, isNotificationModalOpen])

  const closeModal = () => {
    setIsLoading(false);
    sethasUnreadNotifications(false)
    setNotificationModalOpen(false);


    const fetchNotification = async () => {
      try {
        const Notifications = await GetNotification();
        setNotification(Notifications?.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotification();


  };



  useEffect(() => {
    console.log(Notification, 'Notification Notification NotificationNotification');
    fetchUserData();
  }, [socket, setNotification]);





  const fetchUserData = async () => {
    try {
      const { data } = await api.post(
        "/User",
        { userEmail },
        { withCredentials: true }
      );
      setUserData(data?.user);

      if (data.user.status == false) {
        dispatch(updateUser({}));
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        googleLogout();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSignOutClick = () => {
    dispatch(updateUser({}));
    googleLogout();
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    Navigate("/login");
  };

  const searchButton = () => {
    if (!isButtonClicked.current) {
      isButtonClicked.current = true;
    }
    setShowSearch(!showSearch);
  };

  const UserCircleButton = () => {
    setshowUserCircle(!showUserCircle);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };



  const [searchTerm, setSearchTerm] = useState('');

  const RemoveSearchTerm = () => {
    console.log('removed removed Searched');

    localStorage.removeItem('searchTerm');
    setSearchTerm('')
  }
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.removeItem('searchTerm');
    setSearchTerm(event.target.value);
  };
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem('searchTerm', searchTerm);
    try {
      Navigate('/search-results', { state: { searchTerm } });
      setSearchTerm(searchTerm)
    } catch (error) {

    }
  };

  useEffect(() => {
    const storedSearchTerm = localStorage.getItem('searchTerm');
    if (storedSearchTerm) {
      setSearchTerm(storedSearchTerm);
    }
  }, []);


  const deleteNotification = async () => {
    try {
      setIsLoading(true);
      const res = await DeletNotification();
      if (res?.data === true) {
        setIsLoading(false);
        setNotificationModalOpen(false);
      }
    } catch (error) {
      console.log(error);

    }
  }








  return (
    <>
      <div className="fixed w-screen bg-[#D4E7FA]">
        <div className="lg:mx-3 ">
          <nav className={` bg-[#D4E7FA] p-4  md:flex md:items-center md:justify-between  `}>
            <div className="flex justify-between items-center">
              <span className="sm:text-2xl text-lg font-[Poppins] cursor-pointer">
                DevColab
                <img className="h-10 inline " src="" alt="" />
              </span>

              {/* opern---- small size search button */}

              {username ? (
                <div className={`flex items-center `}>
                  <div className=" flex items-center justify-start    rounded-full  ">
                    <div className="md:hidden   flex items-center justify-start  rounded-full px-2  ">
                      <img
                        onClick={() => {
                          setshowUserCircle(!showUserCircle), setShowSearch(false)
                        }}
                        className="sm:w-10 sm:h-10  h-7 w-7 rounded-full "
                        src={image} alt=""
                      />

                    </div>
                    {showUserCircle && (
                      <div
                        id="userDropdown"
                        className="classDropDownOutsideNaveSM md:hidden right-0 top-16 drop-shadow-none border-2 border-sky-600 divide-y divide-gray-100 rounded-lg shadow w-44 bg-gray-50 dark:divide-gray-600"
                      >
                        <div className="px-4 py-3 text-sm text-gray-900 ">
                          <div className="font-mono break-all">{username}</div>
                          <div className="flex font-medium break-all">{userEmail}</div>
                        </div>
                        <ul className="list-none">
                          <li className="border-b border-gray-400">
                            <a
                              onClick={() => { Navigate("/profile"), RemoveSearchTerm() }}
                              className="block px-4 py-2 text-gray-700 dark:hover:bg-gray-600 dark:hover:text-white font-medium"
                            >
                              Profile
                            </a>
                          </li>
                          <li className="border-b border-gray-400">
                            <button
                              onClick={() => {
                                Navigate("/SavedPosts"), RemoveSearchTerm();
                              }}
                              className="flex items-center cursor-pointer px-4 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white"
                            >
                              <span className="text-sm font-medium">Saved</span>
                              <svg
                                className="w-3.5 h-3.5 mr-2 left-2 relative"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                                <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                              </svg>
                            </button>
                          </li>
                          <li className="border-b border-gray-400">
                            <a
                              onClick={() => { handleSignOutClick(), RemoveSearchTerm() }}
                              className="block px-4 py-2 text-sm text-gray-700 dark:hover:bg-gray-600 dark:hover:text-white font-medium"
                            >
                              Sign out
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}


                  </div>

                  {!showSearch && (
                    <button

                      onClick={() => { searchButton(), setshowUserCircle(false) }}
                      type="submit"
                      className="p-1.5 sm:p-2  md:hidden  font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <svg
                        className="sm:w-4 sm:h-4 w-2.5"
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
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                      <span className="sr-only">Search</span>
                    </button>
                  )}
                  <FullScreenButton />
                  <span
                    onClick={toggleMenu}
                    className="sm:text-3xl text-2xl cursor-pointer md:hidden block ml-2"
                  >
                    <AiOutlineMenu />
                  </span>
                </div>
              ) : (
                <div className="lg:hidden  md:hidden">
                  <button
                    onClick={() => { Navigate("/login"), RemoveSearchTerm() }}
                    className="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-3"
                  >
                    Log in
                    <svg
                      className="hidden w-3 h-3 ml-2 xl:inline"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      ></path>
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* search given below */}

            <div className="flex md:left-40   absolute px-8 w-1/4">
              <form
                onSubmit={handleSearchSubmit}
                className={`flex items-center md:flex md:items-center top-0 z-[3] md:z-auto md:static absolute  w-full md:w-auto md:max-w-[100%] sm:w-96  xl:w-96 md:py-0 py-4 md:pl-0 pl-7 md:opacity-100 ${showMenu
                  ? `hidden   bottom-100`
                  : `opacity-0 flex top-[-400px]`
                  } transition-all ease-in duration-500`}
              >
                <label htmlFor="simple-search" className="sr-only">
                  Search
                </label>
                <div className="relative md:w-52 flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-blue-800 dark:text-gray-600"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="bg-gray-50 border border-gray-300  text-gray-900  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-50 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search branch name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>

                <button
                  type="submit"
                  className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="w-4 h-4"
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
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <span className="sr-only">Search</span>
                </button>
                <FullScreenButton />
              </form>
            </div>

            {/* oper---- show Search button true small size */}

            {showSearch && (
              <form onSubmit={handleSearchSubmit} className="flex lg:hidden xl:hidden items-center">
                <>
                  <label htmlFor="simple-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Search branch name..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className="p-2 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <svg
                      className="w-4 h-4"
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
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                    <span className="sr-only">Search</span>
                  </button>
                </>
              </form>
            )}

            <ul
              className={`md:flex md:items-center z-[-1] md:z-auto  md:static absolute md:bg-[#D4E7FA]  bg-cyan-50 border-b-2  sm:border-0 shadow-lg sm:shadow-none border-gray-400 w-full left-0 md:w-auto md:py-0 py-4 md:pl-0 md:opacity-100  ${showMenu ? `opacity-100 top-10` : `opacity-0 top-[-400px]`
                }  transition-all ease-in duration-500`}
            >
              {username ? (
                <>
                  <li className="sm:-mx-4 mx-4 items-start flex flex-col justify-start relative my-4 md:my-0 text-left">
                    <button
                      onClick={() => {
                        Navigate("/PostCreation"), RemoveSearchTerm();
                      }}
                      className="text-sm hover:text-cyan-500 duration-500"
                    >
                      <IoCreateOutline className="w-8 h-8 inline-block mr-2" />
                    </button>

                  </li>
                  <div className="items-center flex justify- rounded-full relative">
                    <li className="mx-4 sm:mx-6  flex-col justify-start items-center flex relative my- md:my-0 rounded-full hover:bg-white">
                      <button onClick={() => setNotificationModalOpen(!isNotificationModalOpen)} className="text-xl hover:text-cyan-500 duration-500 relative">

                        {isNotificationModalOpen || (hasUnreadNotifications && Notification && Notification[0]?.senderId?._id === userId) ? (
                          <>
                            <IoIosNotifications className="w-9 h-9" />
                            {(hasUnreadNotifications && Notification && Notification[0]?.senderId?._id === userId) && (
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            )}

                          </>
                        ) : (
                          <IoIosNotificationsOutline className="w-9 h-9" />
                        )}
                      </button>

                    </li>

                    <div className="relative right-5">
                      {isNotificationModalOpen && (

                        <div className="absolute top-6 sm:right-full sm:w-[28rem] w-[24rem]  -left-12 sm:-left-96  max-w-md overflow-y-auto h-auto max-h-[30rem] sm:max-h-[40rem]  bg-white border border-gray-300 rounded-xl shadow-l ">
                          {isLoading && <div className="absolute z-[60] inset-0 flex items-center justify-center  bg-opacity-50">
                            <Loading />
                          </div>}
                          <div className="fixed sm:w-[28rem] w-96 z-50 p-4 bg-gray-100 flex justify-between items-center rounded-t-xl">
                            <h3 className="text-xl font-semibold text-gray-900">Notifications</h3>
                            <button
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              onClick={closeModal}
                            >
                              Close
                            </button>


                          </div>
                          <div className="p-4 mt-12 z-10 relative">
                            {Notification && Notification.map((notfication: any, index: number) => (
                              <div className="py-5" key={index}>
                                <div className="flex items-start space-x-4 cursor-pointer">
                                  <div className="flex-shrink-0">
                                    <img className="w-10 h-10 rounded-full" src={notfication?.ReportPostId?.image || notfication?.userId?.profileImg} alt="Notification" />
                                  </div>
                                  <div className="flex-grow">
                                    {notfication?.ReportPostId ? (<>
                                      <p className="text-gray-800" onClick={() => { Navigate('/UserPostsView', { state: { UserPost: notfication?.ReportPostId } }), RemoveSearchTerm() }} >{notfication?.ReportPostId?.title}</p>
                                      <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-500">{notfication?.NotifyDate}</p>
                                        <p className="text-sm font-serif text-rose-800" onClick={() => { Navigate("/profile"), RemoveSearchTerm() }}>{notfication?.Message}</p>
                                      </div></>
                                    ) : (<>
                                      <div className="flex justify-between">
                                        <p className="text-gray-800 inline-block" onClick={() => { Navigate('/Community', { state: { chat: notfication?.senderId?._id } }), RemoveSearchTerm() }} >{notfication?.senderId?._id !== userId ? notfication?.senderId?.UserName : notfication?.userId?.UserName}</p>
                                        <p className="text-xs text-gray-500 inline-block">
                                          {notfication?.ChatMessage?.timestamp &&
                                            new Date(notfication?.ChatMessage?.timestamp).toLocaleTimeString([], {
                                              hour: '2-digit',
                                              minute: '2-digit',
                                              hour12: true,
                                            })}
                                        </p>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-500 bg-gray-200 rounded-lg p-1">{notfication?.ChatMessage?.text}</p>
                                        <p className="text-sm font-serif text-rose-800" onClick={() => { Navigate("/profile"), RemoveSearchTerm() }}>{notfication?.Message}</p>
                                      </div></>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}



                          </div>
                          {Notification && Notification.length !== 0 ? (
                            <div className="relative w-full  p-2  bg-gray-100 flex justify-end items-center ">
                              <button
                                className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-700"
                                onClick={() => deleteNotification()}
                              >
                                Clear
                              </button>
                            </div>
                          ) : (
                            <div className="relative w-full  p-2  bg-gray-100 flex justify-end items-center ">
                              <img
                                src="/Images/NOnotification.jpg" alt="No Notification" srcSet="" />

                            </div>

                          )}

                        </div>
                      )}

                    </div>
                  </div>

                  <div className=" items-center flex  justify-start    rounded-full  ">
                    <img
                      onClick={UserCircleButton}
                      className=" cursor-pointer w-10 h-10 rounded-full hidden md:block"
                      src={userData?.profileImg}
                      alt="Rounded avatar"
                    />
                    <div className="relative">
                      {showUserCircle && (
                        <div
                          id="userDropdown"
                          className="classDropDownOutsideNave  top-8 drop-shadow-none border-2 border-sky-600  divide-y divide-gray-100 rounded-lg shadow w-44 bg-gray-50 dark:divide-gray-600"
                        >
                          <div className="px-4 py-3 text-sm text-gray-900 ">
                            <div className="font-mono break-all">{username}</div>
                            <div className="flex font-medium break-all">
                              {userEmail}
                            </div>
                          </div>
                          <li className="cursor-pointer">
                            <a
                              onClick={() => { Navigate("/profile"), RemoveSearchTerm() }}

                              className="block px-4 py-2 cursor-pointer text-gray-700 dark:hover:bg-gray-600 dark:hover:text-white font-medium"
                            >
                              Profile
                            </a>
                          </li>
                          <li className="cursor-pointer">
                            <button
                              onClick={() => {
                                Navigate("/SavedPosts"), RemoveSearchTerm()
                              }}
                              className="flex items-center cursor-pointer px-4 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white"
                            >
                              <span className="text-sm  font-medium">Saved</span>
                              <svg
                                className="w-3.5 h-3.5 mr-2 left-2 relative"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                                <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                              </svg>
                            </button>
                          </li>

                          {/* </ul> */}
                          <li className="cursor-pointer">
                            <a
                              onClick={() => { handleSignOutClick(), RemoveSearchTerm() }}
                              className="block px-4 py-2 text-sm text-gray-700  dark:hover:bg-gray-600  dark:hover:text-white font-medium"
                            >
                              Sign out
                            </a>
                          </li>

                        </div>
                      )}


                    </div>

                  </div>
                </>
              ) : (
                <button
                  onClick={() => Navigate("/login")}
                  className="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-3"
                >
                  Log in
                  <svg
                    className="hidden w-3 h-3 ml-2 xl:inline"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    ></path>
                  </svg>
                </button>
              )}
            </ul>
          </nav>




          {/* Your other content */}



        </div>
      </div>
    </>
  );
}

export default Navbar;
