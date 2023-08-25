import { useState, useRef, useEffect, useContext } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { IoIosNotifications, IoIosNotificationsOutline } from "react-icons/io";
import { IoCreateOutline } from "react-icons/io5";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { api } from "../../../services/axios";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../../../../../DevColab-Server/src/domain/models/user";
import { updateUser } from "../../../redux/user/userSlice";
import { notificationType } from '../../../../../DevColab-Server/src/domain/models/Notification';
import { DeletNotification, GetNotification, Readed } from "../../../services/API functions/UserApi";
import Loading from "../isLoading/Loading";
import { Socket, io } from "socket.io-client";
import { useSocket } from '../../../Context/WebsocketContext'


function Navbar() {
  const [socketss, setSocket] = useState<Socket | null>(null);
  const { userEmail, username } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const { image } = useSelector((state: any) => state.user);
  const isButtonClicked = useRef(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserCircle, setshowUserCircle] = useState(false);
  const [userData, setUserData] = useState<User>();
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [Notification, setNotification] = useState<notificationType[]>()
  const [hasUnreadNotifications, sethasUnreadNotifications] = useState(false)
  const [isLoading, setIsLoading] = useState(false);


  const socket = useSocket();

  useEffect(() => {
    socket.on('adminMessage', (data) => {
      console.log('Admin message received:', data);
      sethasUnreadNotifications(true)
    });
    return () => {
      socket.off('adminMessage');
    };
  }, [socket]);






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

        const hasUnread =await Notifications?.data?.some((notification: { read: any }) => !notification?.read);
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
  }, [isNotificationModalOpen, userData]);



  useEffect(() => {
    const fetch = async () => {
      const Notifications = await GetNotification();
      setNotification(Notifications?.data);
      const hasUnread = Notifications?.data?.some((notification: { read: any }) => !notification?.read);
      sethasUnreadNotifications(hasUnread);
    }
    fetch();

  }, [userData, setNotification, isNotificationModalOpen])




  const closeModal = () => {
    setIsLoading(false);
    sethasUnreadNotifications(false)
    setNotificationModalOpen(false);
  };



  useEffect(() => {
    fetchUserData();
  }, []);





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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the form from submitting normally

    try {
      Navigate('/search-results', { state: { searchTerm } });
    } catch (error) {

    }
  };




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
        <div className="lg:mx-28 xl:mx:28 md:mx-28 ">
          <nav className={` bg-[#D4E7FA] p-4  md:flex md:items-center md:justify-between  `}>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-[Poppins] cursor-pointer">
                DevColab
                <img className="h-10 inline " src="" alt="" />
              </span>

              {/* opern---- small size search button */}

              {username ? (
                <div className={`flex items-center `}>
                  <div className=" flex items-center justify-start    rounded-full  ">
                    <div className="md:hidden   flex items-center justify-start  rounded-full px-2  ">
                      <img
                        onClick={UserCircleButton}
                        className="w-10 h-10 rounded-full "
                        src={image}
                        alt="Rounded avatar"
                      />
                    </div>
                    {showUserCircle && (
                      <div
                        id="userDropdown"
                        className="classDropDownOutsideNaveRESPONSIVE md:hidden    right-0 top-16 drop-shadow-none border-2 border-sky-600  divide-y divide-gray-100 rounded-lg shadow w-44 bg-gray-50 dark:divide-gray-600"
                      >
                        <div className="px-4 py-3 text-sm text-gray-900 ">
                          <div className="font-mono">{username}</div>
                          <div className="font-medium truncate">
                            {userEmail}
                          </div>
                        </div>
                        <ul
                          className="py-2 text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="avatarButton"
                        >
                          <li>
                            <a
                              href="#"
                              className="block px-4 py-2 text-gray-700 dark:hover:bg-gray-600 dark:hover:text-white font-medium"
                            >
                              Dashboard
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="block px-4 py-2 text-gray-700 dark:hover:bg-gray-600 dark:hover:text-white font-medium"
                            >
                              Settings
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="block px-4 py-2 text-gray-700 dark:hover:bg-gray-600 dark:hover:text-white font-medium"
                            >
                              Earnings
                            </a>
                          </li>
                        </ul>
                        <div className="py-1">
                          <a
                            onClick={handleSignOutClick}
                            className="block px-4 py-2 text-sm text-gray-700  dark:hover:bg-gray-600  dark:hover:text-white font-medium"
                          >
                            Sign out
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {!showSearch && (
                    <button
                      onClick={searchButton}
                      type="submit"
                      className="p-2  md:hidden  font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                  )}

                  <span
                    onClick={toggleMenu}
                    className="text-3xl cursor-pointer md:hidden block ml-2"
                  >
                    <AiOutlineMenu />
                  </span>
                </div>
              ) : (
                <div className="lg:hidden  md:hidden">
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
                </div>
              )}
            </div>

            {/* search given below */}

            <div className="flex md:left-60   absolute px-8 w-1/4">
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
              </form>
            </div>

            {/* oper---- show Search button true small size */}

            {showSearch && (
              <form className="flex lg:hidden xl:hidden items-center">
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
              className={`md:flex md:items-center z-[-1] md:z-auto  md:static absolute md:bg-[#D4E7FA]  bg-[#a4bfeb] w-full left-0 md:w-auto md:py-0 py-4 md:pl-0 md:opacity-100  ${showMenu ? `opacity-100 top-10` : `opacity-0 top-[-400px]`
                }  transition-all ease-in duration-500`}
            >
              {username ? (
                <>
                  <li className="mx-4 items-center flex flex-col justify-center relative my-6 md:my-0">
                    <button
                      onClick={() => {
                        Navigate("/PostCreation");
                      }}
                      className="text-xl  hover:text-cyan-500 duration-500"
                    >
                      <span className="border-2 border-sky-500">
                        <IoCreateOutline className="w-8 h-8 inline-flex " />{" "}
                        Create Post
                      </span>
                    </button>
                  </li>
                  <div className="items-center flex justify-end rounded-full relative">
                    <li className="mx-6 items-center flex relative my-6 md:my-0 rounded-full hover:bg-white">
                      <button onClick={() => setNotificationModalOpen(!isNotificationModalOpen)} className="text-xl hover:text-cyan-500 duration-500 relative">
                        {isNotificationModalOpen || hasUnreadNotifications ? (
                          <>
                            <IoIosNotifications className="w-9 h-9" />
                            {hasUnreadNotifications && (
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

                        <div className="absolute top-6 right-full w-[28rem]  max-w-md overflow-y-auto h-auto max-h-[40rem] bg-white border border-gray-300 rounded-xl shadow-l ">
                          {isLoading && <div className="absolute z-[60] inset-0 flex items-center justify-center  bg-opacity-50">
                            <Loading />
                          </div>}
                          <div className="fixed w-[28rem] z-50 p-4 bg-gray-100 flex justify-between items-center rounded-t-xl">
                            <h3 className="text-xl font-semibold text-gray-900">Notifications</h3>
                            <button
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              onClick={closeModal}
                            >
                              Close
                            </button>


                          </div>
                          <div className="p-4 mt-12">
                            {Notification && Notification.map((notfication: any, index: number) => (
                              <div className="py-5" key={index}>
                                <div className="flex items-start space-x-4">
                                  <div className="flex-shrink-0">
                                    <img className="w-10 h-10 rounded-full" src={notfication?.ReportPostId?.image} alt="Notification" />
                                  </div>
                                  <div className="flex-grow">
                                    <p className="text-gray-800" onClick={() => Navigate('/UserPostsView', { state: { UserPost: notfication?.ReportPostId } })} >{notfication?.ReportPostId?.title}</p>
                                    <div className="flex justify-between items-center">
                                      <p className="text-xs text-gray-500">{notfication?.NotifyDate}</p>
                                      <p className="text-sm font-serif text-rose-800" onClick={() => Navigate("/profile")}>{notfication?.Message}</p>
                                    </div>
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
                            <div className="font-mono">{username}</div>
                            <div className="flex font-medium truncate">
                              {userEmail}
                            </div>
                          </div>
                          {/* <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton"> */}
                          <li>
                            <a
                              onClick={() => Navigate("/profile")}
                       
                              className="block px-4 py-2 text-gray-700 dark:hover:bg-gray-600 dark:hover:text-white font-medium"
                            >
                              Profile
                            </a>
                          </li>
                          <li>
                            <button
                              onClick={() => {
                                Navigate("/SavedPosts");
                              }}
                              className="flex items-center px-4 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white"
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
                          <li className="mx-4 my-6 md:my-0 ">
                            <a
                              onClick={handleSignOutClick}
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
