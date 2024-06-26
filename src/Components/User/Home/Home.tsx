import { AiOutlineComment, AiOutlineHome, AiOutlineUser } from "react-icons/ai"
import { HiOutlineUserGroup } from "react-icons/hi2"
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "../Navbar/Navbar";
import { api } from "../../../services/axios";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Posts } from '../../../utils/interfaceModel/PostsInfra';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { HiShare } from "react-icons/hi";
import ShareButtons from "./ShareButtons";
import { GoReport } from "react-icons/go";
import { updateUser } from "../../../redux/user/userSlice";
import { googleLogout } from "@react-oauth/google";
import { UserBlock_UnBlock, UserFolowers, userRecomended } from '../../../services/API functions/UserApi';
import Footer from "../Navbar/Footer";
import CommunitySection from "./CommunitySection";
import LikeSection from "./LikeSection";
import CommentEdit from "./HomeOptions/CommentEdit";
import { Comment } from "../../../utils/interfaceModel/comment";
import CustomPagination from "./Pagination";
import LoaderAbsolute from "../isLoading/LoaderAbsolute";
import { IoCloseSharp } from "react-icons/io5";
import WithoutLoginModal from './WithoutLoginModal'


interface IHashtag {
  _id: string,
  Hashtag: string;
  createdAt: string;
}



function HomePage() {
  const Navigate = useNavigate();
  const { userId } = useSelector((state: any) => state.user);
  const [HomePosts, setHomePosts] = useState<any[]>([]);
  const [SelectHashtag, setSelectHashtag] = useState(false)
  const [Comment, SetComment] = useState<string>('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const { image, username, userEmail } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [SavedPost, SetSavedPost] = useState<any>([]);
  const [ShareSocialMediaModal, setShareSocialMediaModal] = useState(false);
  const [ReportModal, setReportModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [reftesh, setrefresh] = useState(false)
  const [liked, setliked] = useState(false);
  const [refreshGrp, setRefreshGrp] = useState(false)
  const [selectCategory, setSelectCategory] = useState<'Latest' | 'Recommended' | '' | boolean>('Latest')
  const [clickedHashtag, setClickedHashtag] = useState<string | null>(null);
  const [Tag, setTag] = useState({
    HashtagName: '',
    CountPost: 0,
  });
  const [pageCount, setPageCount] = useState(Number)
  const [isLoading, setIsLoading] = useState(false)
  const [refresh, setRefresh] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const location = useLocation();
  const getClicketHashtag = location?.state;

  useMemo(() => {
    if (getClicketHashtag) {
      setClickedHashtag(getClicketHashtag);
    }
  }, [getClicketHashtag]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // 1 minute in milliseconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const Userauth = localStorage.getItem("user");
    if (!Userauth) {
      localStorage.removeItem('user')
      dispatch(updateUser({}));
      googleLogout();
    }
  }, []);


  const CommentDate = format(currentDate, "d MMMM yyyy hh:mm a");
  const ReportDate = format(currentDate, "d MMMM yyyy hh:mm a");

  const slecetedCategory = async (Categorys: 'Recommended') => {

    const userHashtag = await userRecomended();
    if (!userHashtag?.data || userHashtag.data.length === 0) {
      setSelectHashtag(true)
    } else {
      setSelectCategory(Categorys)

    }
  }

  const closeShareModal = () => {
    setShareSocialMediaModal(false);
  };

  const openShareModal = () => {
    setShareSocialMediaModal(true);
  };

  const openReportModal = () => {
    setReportModal(true);
  }
  const CloseReportModal = () => {
    setReportModal(false);
  }

  const ErrorToast = (tosterr: string) => {
    toast.error(tosterr, {
      position: 'bottom-right',
      className: 'text-lg font-medium text-black',
    })
  }


  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedReason(event.target.value);
  };

  const handleSubmitReport = async (event: React.FormEvent<HTMLFormElement>, postId: string | undefined) => {
    event.preventDefault();
    try {

      if (username) {
        if (selectedReason.trim() == '') {
          ErrorToast('please Select ')
        } else {
          const ResponseReportPost = await api.post(`/ReportPost/${postId}`, { selectedReason, ReportDate });
          if (ResponseReportPost?.data === 'alreadyReported') {
            ErrorToast('Already Reported This Post');
          } else {
            if (selectedReason === 'abuse') {
              SavePostSucess(`Abusive Content  Issue Reported `)
            } else {
              SavePostSucess(`Spam or Scam Issue Reported `)
            }
          }
          setReportModal(false);
        }

      } else {

        setIsModalOpen(true);

      }
    } catch (error) {
      console.log(error);
    }
  };


  const [fetchHashTag, setfetchHashTag] = useState<IHashtag[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [modal, setmodal] = useState(true)


  const submitForm = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      if (selectedHashtags.length === 0) {
        setFormError("Please select at least one hashtag.");
        return;
      } else {
        await api.post('/selectedHashtags', { ...selectedHashtags })
        setSelectHashtag(false)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchHashtags = async () => {
      const Hashtags = await api.get('/HashTagManageMent', { withCredentials: true });
      setfetchHashTag(Hashtags?.data)
    }
    fetchHashtags();
    setRefreshGrp(true)
  }, [modal, setmodal]);

  const handleCheckboxChange = (tagId: string) => {
    setSelectedHashtags(prevSelectedHashtags => {
      const updatedSelectedHashtags = prevSelectedHashtags.includes(tagId) ? prevSelectedHashtags.filter(id => id !== tagId) : [...prevSelectedHashtags, tagId];
      setSelectedHashtags(updatedSelectedHashtags)
      return updatedSelectedHashtags;
    });
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);

  };

  const handleClick = async (PostId: Posts) => {
    try {

      const UserStatus = await UserBlock_UnBlock(userEmail);

      if (UserStatus === false) {
        setliked(true)
        dispatch(updateUser({}));
        localStorage.removeItem("user");
        Navigate('/');
      } else {
        setliked(false);
        const response = await api.post(`/Postslike/${PostId}`);
        console.log(response?.data?.liked);
      }
      setliked(true);
    } catch (error) {
      console.log(error);

    }
  };


  const [showCommentBox, setShowCommentBox] = useState<number | null>(null);
  const toggleCommentBox = (index: number) => {
    setShowCommentBox(prevState => (prevState === index ? null : index));
  };





  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (selectCategory === 'Latest') {

          const userResponse = await api.get(`/HomePosts`, { withCredentials: true });

          setHomePosts(userResponse?.data?.posts);
          setPageCount(userResponse?.data?.totalPages);

        } else if (selectCategory === 'Recommended') {


          const userHashtag = await userRecomended();
          const userResponse = await api.get(`/HomePosts`, { withCredentials: true });
          const userHashTags = userHashtag?.data.map((hashtagObj: { Hashtag: string }) => hashtagObj.Hashtag);
          const filteredPosts = userResponse?.data?.posts.filter((post: {
            userId: any; HashTag: string[]
          }) => {
            const postTagsCleaned = post?.HashTag?.map(tag => tag?.trim());
            const userHashTagsCleaned = userHashTags.map((tag: string) => tag.trim());
            return (
              post.userId?._id !== userId &&
              postTagsCleaned.some(tag => userHashTagsCleaned.includes(tag))
            );
          });
          const userFollowersPost = await UserFolowers();
          const followersPost = userResponse?.data?.posts.filter((post: { userId: { _id: string; }; }) =>
            userFollowersPost?.data?.Userfollowers?.some((follower: { _id: string; }) => follower?._id === post?.userId?._id && follower?._id !== userId)
          );

          setHomePosts([...filteredPosts, ...followersPost]);

        }

        if (selectCategory != true) {
          setTimeout(() => {
            setIsLoading(false);
            setliked(false)
          }, liked == true ? 900 : 1000);

        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    setRefreshGrp(true)

    fetchData();

  }, [selectCategory, refresh, liked, setliked, SetComment, setrefresh, SavedPost, reftesh]);



  const selectHashtagPosts = async (clickedHashtag: string) => {
    setSelectCategory(true);
    setIsLoading(true);
    setClickedHashtag(clickedHashtag)
    const userResponse = await api.get(`/HomePosts`, { withCredentials: true });
    const filteredPosts = userResponse.data.posts.filter((post: { HashTag: string[] }) => {
      const postTagsCleaned = post.HashTag.map(tag => tag.trim());
      return postTagsCleaned.some(tag => tag === clickedHashtag.trim());
    });

    setTag({
      HashtagName: clickedHashtag.trim(),
      CountPost: filteredPosts?.length,
    });
    setHomePosts(filteredPosts);
    setIsLoading(false);

  }

  const SavePostSucess = (success: string) => {
    toast.success(success, {
      position: 'bottom-right',
      autoClose: 2000,
      style: {
        color: 'blue',
      },
    });
  }




  const SavePost = async (PostId: Posts) => {
    setIsLoading(true)
    if (username) {
      const UserStatus = await UserBlock_UnBlock(userEmail)
      if (UserStatus === false) {
        dispatch(updateUser({}));
        localStorage.removeItem("user");
        googleLogout();
      } else {
        setIsLoading(true);
        const SavingPost = await api.post(`/SavingPosts/${userId}/${PostId}`, { withCredentials: true });
        const findSaveduserPost = await api.get('/UserSaveds', { withCredentials: true });
        SetSavedPost(findSaveduserPost?.data)
        setIsLoading(true); setRefresh(true);
        if (SavingPost?.data?.Saved === true) {
          SavePostSucess('Seved');
        } else if (SavingPost?.data?.DeletedSAved === true) {
          SavePostSucess('UnSaved');
        }
      }

    } else {
      setIsModalOpen(true);
    }
  };







  const SubmitComments = async (postId: string) => {
    try {
      if (username) {
        setrefresh(true);
        SetComment('');
        await api.post(`/AddCommentOnPost/${postId}`, { Comment, CommentDate }, { withCredentials: true });
        setrefresh(false);
      } else {
        setIsModalOpen(true);
      }

    } catch (error) {
      console.log(error);

    }

  }


  const [clickedPostIndex, setClickedPostIndex] = useState<number>(Number);
  const [rows, setRows] = useState(1);

  const handleTextareaInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const calculatedRows = Math.min(
      Math.ceil(e.target.scrollHeight / 18),
      2
    );

    setRows(calculatedRows);
  };

  const loginModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  }


  const handlePageChange = async (selectedPage: number) => {
    setIsLoading(true)
    const userResponse = await api.get(`/HomePosts`, {
      params: {
        selectedPage: selectedPage
      }
    });

    setIsLoading(false)
    setHomePosts(userResponse?.data?.posts);
    setPageCount(userResponse?.data?.totalPages);
  };


  const currentPosts = HomePosts



  return (
    <>

      <div className=" relative h-screen  bg-slate-100">
        <div className="min-h-screen flex flex-col">
          <div className=" relative z-20 ">
            <Navbar />
          </div>
          <main className="flex-grow  bg-white  ">
            {isLoading && (
              <>
                <LoaderAbsolute />
              </>
            )}
            <div className="lg:mx-28 xl:mx:28 md:mx-28  ">
              <div className="mx-auto max-w-screen-xl overflow">
                <div className="flex md:flex-row-reverse ">
                  <div className="bg-white border-l-2  fixed  z-10 ">
                    <CommunitySection datas={refreshGrp} loginModalOpen={loginModalOpen} />
                  </div>
                  <div className="w-full   md:h-screen flex relative mb-[12rem] " >
                    {/* Outer Div with Black Background */}

                    <div className="w-auto absolute md:h-screen   max-w-screen-md mb-96 top-12 md:top-16  ml-0 ">
                      {/* Inner Content */}
                      <div className="flex   relative z-10     top-2 sm:justify-center md:left-32 lg:left-44 xl:left-14 h-auto bg-opacity-75">
                        <nav className="fixed baCkground border-b-2  mt-4 md:mt-0 border-l-2 border-r-1  border-gray-400  shadow-inner   backdrop-blur-md h-16 md:h-16  xl:w-[42rem] md:w-[35rem] lg:w-[40rem] sm:w-full   w-full overflow-y-hidden">
                          <ul>
                            {(!clickedHashtag && selectCategory === 'Latest' || selectCategory === 'Recommended') ? (
                              <li className={`flex cursor-pointer relative items-center h-12 space-x-2 `}>
                                {/* <h1  className="font-bold ml-3 p-3 top-4 relative text-2xl">Home</h1> */}
                              </li>
                            ) : (
                              <>
                                <div className="ml-8 mb-2">
                                  <li className={`flex cursor-pointer relative items-center  mt-3   h-12 space-x-2 `}>
                                    <h1 onClick={() => Navigate('/')} className="font-semibold ml-3   relative text-3xl">{Tag?.HashtagName}</h1>
                                  </li>
                                  <div className="flex sm:ml-5 ml-11 relative">
                                    <p className="font-medium">{Tag?.CountPost}</p>
                                  </div>
                                  <div className="flex sm:ml-5 bottom-0 relative">
                                    <p className="font-medium">posts</p>
                                  </div>
                                </div>

                              </>
                            )}
                          </ul>

                          {(!clickedHashtag && selectCategory === 'Latest' || selectCategory === 'Recommended') && (
                            <div className="flex px-10 justify-between -inset-y-10   relative">
                              <button
                                onClick={() => setSelectCategory('Latest')}
                                type="button"
                                className={`${selectCategory === "Latest" ?
                                  "bg-[#b3bcc9] underline decoration-4 decoration-[#7856FF] text-gray-900" :
                                  'opacity-80 px-1 hover:bg-[#dddbdb]'
                                  } md:w-1/2 bg-transparent opacity-100  font-medium rounded-lg  py-2.5 mr-2 mb-2 text-lg`}
                              >
                                Latest
                              </button>
                              <button
                                onClick={() => { username ? slecetedCategory('Recommended') : setIsModalOpen(true) ,setHomePosts([]) }}
                                type="button"
                                className={`${selectCategory === "Recommended" ?
                                  "bg-[#b3bcc9] underline decoration-4 decoration-[#7856FF] text-gray-900" :
                                  'opacity-80 px-1 hover:bg-[#dddbdb]'
                                  } md:w-1/2 bg-transparent opacity-100 font-medium rounded-lg  py-2.5  mr-5 mb-2 text-lg`}
                              > Recommended </button>
                            </div>
                          )}
                        </nav>
                      </div>


                      {/* posts-gradiant   */}
                      <div className="md:p-4 md:left-32 lg:left-44 md:mx-8 lg:mx-0 lg:right-0 sm:left-0 top-16  md:w-[35rem] lg:w-screen bg-[#ebe7e1]  lg:max-w-2xl w-screen xl:left-14   relative  ">

                        <div>
                          <div className="p-4 rounded-lg shadow-lg bg-gradient-to-b from-blue-300 to-blue-500">
                            <p className="text-white text-lg font-semibold mx-4">
                              {clickedHashtag !== null && clickedHashtag ? 'HashTag' : 'Posts'}
                            </p>
                          </div>

                          {HomePosts && currentPosts.map((post: any, index) => (
                            <div className="p-4 bg-[#e1e5eb]" key={index}>
                              <div className="bg-white p-4 rounded-md shadow-md" key={index}>
                                <div
                                  className="flex items-start mb-3 ">
                                  <img onClick={() => Navigate('/profile', { state: post?.userId?._id })}
                                    src={post?.userId?.profileImg} alt="User Profile" className="w-10 h-10 rounded-full mr-3 cursor-pointer" />

                                  <div>

                                    <div className="container">
                                      {/* Your other content here */}
                                      <div className="container">
                                        {/* Your other content here */}

                                        <div className="justify-end absolute  sm:visible hidden right-12 sm:flex items-end group">
                                          <PiDotsThreeOutlineVerticalFill type="button" data-dial-toggle="speed-dial-menu-top-right" aria-controls="speed-dial-menu-top-right" aria-expanded="false" className="flex items-center justify-center rounded-full w-6 h-6    focus:ring-4 focus:ring-blue-300 focus:outline-none " />
                                          <div onClick={() => {
                                            setClickedPostIndex(index);
                                          }} id="speed-dial-menu-top-right" className=" items-center hidden mt-0 space-x-2 group-hover:block">
                                            <div className="flex space-x-2">
                                              <div className="w-6 h-6 bg-blue-500 cursor-pointer rounded-full flex items-center justify-center">
                                                <HiShare onClick={openShareModal} className="w-5 h-5 text-white" />
                                              </div>
                                              <div className="w-6 h-6 bg-blue-500 cursor-pointer rounded-full flex items-center justify-center">
                                                <GoReport onClick={openReportModal}
                                                  className="w-5 h-5 text-white" />
                                              </div>
                                            </div>
                                          </div>
                                        </div>


                                        <div className={`justify-end absolute ${menuVisible && clickedPostIndex == index ? 'bg-gray-200 right-5 p-2' : 'bg-white'} shadow-sm rounded-lg  sm:hidden right-10 flex items-end`}>
                                          <button
                                            type="button"
                                            data-dial-toggle="speed-dial-menu-top-right"
                                            aria-controls="speed-dial-menu-top-right"
                                            aria-expanded={menuVisible}
                                            className="flex items-center justify-center rounded-full w-6 h-6 focus:ring-4 focus:ring-blue-300 focus:outline-none"
                                            onClick={() => { setMenuVisible(!menuVisible), setClickedPostIndex(menuVisible ? 0 : index) }}
                                          >

                                            {menuVisible && clickedPostIndex == index ? (
                                              <>
                                                <IoCloseSharp className="w-6 h-6" />
                                              </>
                                            ) : (
                                              <>
                                                <PiDotsThreeOutlineVerticalFill />
                                              </>
                                            )}

                                          </button>
                                          <div
                                            id="speed-dial-menu-top-right"
                                            className={`items-center ${menuVisible && clickedPostIndex == index ? '' : 'hidden'} mt-0 space-x-2 px-2`}
                                          >
                                            <div className="flex space-x-2">
                                              <div className="w-6 h-6 bg-blue-500 cursor-pointer rounded-full flex items-center justify-center">
                                                <HiShare onClick={openShareModal} className="w-5 h-5 text-white" />
                                              </div>
                                              <div className="w-6 h-6 bg-blue-500 cursor-pointer rounded-full flex items-center justify-center">
                                                <GoReport onClick={openReportModal} className="w-5 h-5 text-white" />
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                      </div>

                                    </div>
                                    <p
                                      onClick={() => Navigate('/profile', { state: post?.userId?._id })}
                                      className="font-medium cursor-pointer break-all flex mr-8 text-base sm:text-base overflow-hidden whitespace-wrap break-words"
                                    >
                                      {post?.userId?.UserName}
                                    </p>

                                    <p className="text-sm text-gray-500 sm:text-base">
                                      {post?.Date}
                                    </p>
                                  </div>
                                  {ShareSocialMediaModal && clickedPostIndex === index && (
                                    <div key={index}
                                      id="popup-modal"
                                      tabIndex={-1}
                                      className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50"
                                    >
                                      <div className="relative  w-full max-w-md">
                                        <div className="relative bg-white rounded-lg shadow ">
                                          <button
                                            onClick={closeShareModal}
                                            type="button"
                                            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                            data-modal-hide="crypto-modal"
                                          >
                                            <svg onClick={closeShareModal}
                                              className="w-3 h-3"
                                              aria-hidden="true"
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 14 14"
                                            >
                                              <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                              />
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                          </button>
                                          {/* Modal header */}
                                          <div className="px-6 py-4 border-b rounded-t dark:border-gray-600">
                                            <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-black">
                                              Share Via
                                            </h3>
                                            <div></div>

                                          </div>
                                          <div className=" px-3  relative border-b rounded-t dark:border-gray-600">

                                            <p className="p-3  overflow-hidden whitespace-wrap break-words">{post?.title}</p>
                                          </div>
                                          <div className="p-2 text-center">
                                            <div className="mb-5">

                                              <ShareButtons url={`${import.meta.env?.VITE_REACT_URL}/UserPostsView/${post?._id}`} title={post?.title} />

                                            </div>

                                            <div className="flex pt-1 justify-center items-center">
                                              <button
                                                data-modal-hide="popup-modal"
                                                type="button"
                                                title="close"
                                                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                                onClick={closeShareModal}
                                              >
                                                Close
                                              </button>

                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}



                                  {ReportModal && clickedPostIndex === index && (
                                    <div key={index}
                                      id="popup-modal"
                                      tabIndex={-1}
                                      className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50"
                                    >
                                      <div className="relative w-full max-w-md">
                                        <div className="relative bg-white rounded-lg shadow ">
                                          <button
                                            onClick={CloseReportModal}
                                            type="button"
                                            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                            data-modal-hide="crypto-modal"
                                          >
                                            <svg onClick={CloseReportModal}
                                              className="w-3 h-3"
                                              aria-hidden="true"
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 14 14"
                                            >
                                              <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                              />
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                          </button>
                                          {/* Modal header */}
                                          <div className="px-6 py-4 border-b rounded-t dark:border-gray-600">
                                            <h3 className="text-base font-serif text-gray-900 lg:text-xl dark:text-black">
                                              why are you Reporting this Post ?
                                            </h3>
                                            <div></div>
                                          </div>
                                          <div className=" px-3  relative border-b rounded-t dark:border-gray-600">

                                            <p className="p-3  overflow-hidden whitespace-wrap break-words">{post?.title}</p>


                                          </div>


                                          <div className="p-2 pt-8  text-center ">
                                            <div>
                                              <form onSubmit={(event) => handleSubmitReport(event, post?._id)}>
                                                <ul className="h-28 px-3 overflow-y-auto items-center">
                                                  <li>
                                                    <label className="flex items-center p-2 rounded hover:bg-white dark:hover:bg-gray-600 bg-white">
                                                      <input
                                                        type="radio"
                                                        name="reportReason"
                                                        value=""
                                                        checked={!selectedReason}
                                                        onChange={handleRadioChange}
                                                        className="form-radio w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:border-gray-500"
                                                      />
                                                      <span className="ml-2 font-mono rounded dark:text-gray-900 hover:text-white">Please select</span>
                                                    </label>
                                                  </li>
                                                  <li>
                                                    <label className="flex items-center p-2 rounded hover:bg-white dark:hover:bg-gray-600 bg-white">
                                                      <input
                                                        type="radio"
                                                        name="reportReason"
                                                        value="spam"
                                                        checked={selectedReason === 'spam'}
                                                        onChange={handleRadioChange}
                                                        className="form-radio w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:border-gray-500"
                                                      />
                                                      <span className="ml-2 font-mono rounded dark:text-gray-900 hover:text-white">Spam or Scam</span>
                                                    </label>
                                                  </li>
                                                  <li>
                                                    <label className="flex items-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 bg-white">
                                                      <input
                                                        type="radio"
                                                        name="reportReason"
                                                        value="abuse"
                                                        checked={selectedReason === 'abuse'}
                                                        onChange={handleRadioChange}
                                                        className="form-radio w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:border-gray-500"
                                                      />
                                                      <span className="ml-2 font-mono rounded dark:text-gray-900 hover:text-white">Abusive Content</span>
                                                    </label>
                                                  </li>
                                                </ul>

                                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                                  Report</button>
                                              </form>

                                            </div>
                                            <div className="flex pt-1 justify-center items-center">
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}


                                </div>

                                <div className="flex flex-col">
                                  <div className="ml-4">
                                    <p
                                      onClick={() => Navigate('/UserPostsView', { state: { UserPost: post } })}
                                      className="text-lg cursor-pointer overflow-hidden whitespace-wrap break-words"
                                    >
                                      {post?.title}
                                    </p>
                                  </div>
                                  <div className="mt-2 flex-1 border-2">
                                    <img onClick={() => Navigate('/UserPostsView', { state: { UserPost: post } })}
                                      src={post?.image}
                                      alt={post?.Image}
                                      className="w-full cursor-pointer h-auto"
                                    />
                                  </div>
                                </div>



                                <div className="mt-4">
                                  <div className="flex flex-wrap items-start space-x-2">
                                    {post?.HashTag && post?.HashTag.map((tag: string, index: number) => {
                                      const trimmedTag = tag.trim();
                                      return (
                                        <span
                                          key={index}
                                          className={`inline-block px-3 py-1 text-sm bg-blue-100 text-blue-500 rounded-full mr-2 hover:bg-blue-200 cursor-pointer m-0.5 ${index > 0 ? 'ml-2' : ''
                                            } ${index > 0 ? 'sm:relative sm:right-2' : ''
                                            }`}
                                          onClick={() => { setClickedHashtag(''), selectHashtagPosts(trimmedTag) }}
                                        >
                                          {trimmedTag}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>


                                {isModalOpen && (
                                  <>
                                    <WithoutLoginModal toggleModal={() => toggleModal()} />
                                  </>
                                )}


                                <div className="top-2 relative">
                                  <LikeSection data={post} />
                                </div>





                                <div className="mt-4  flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-4">
                                      <button
                                        onClick={() => { username ? handleClick(post._id) : setIsModalOpen(true) }}
                                        className="w-20  justify-center flex rounded-sm"
                                      >
                                        <a
                                          type="button"
                                          className={`${post?.likes?.LikedUsers?.some(
                                            (likedUser: any) =>
                                              likedUser?.userId?._id === userId && likedUser?.liked)
                                            ? 'text-white bg-blue-500 darkhover:text-white dark:focus:ring-blue-800'
                                            : 'text-blue-700 border border-blue-700 dark:focus:ring-blue-800'
                                            } focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center`}
                                        >
                                          <svg
                                            className="w-3 h-3"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 18 18"
                                          >
                                            <path
                                              d="M3 7H1a1 1 0 0 0-1 1v8a2 2 0 0 0 4 0V8a1 1 0 0 0-1-1Zm12.954 0H12l1.558-4.5a1.778 1.778 0 0 0-3.331-1.06A24.859 24.859 0 0 1 6 6.8v9.586h.114C8.223 16.969 11.015 18 13.6 18c1.4 0 1.592-.526 1.88-1.317l2.354-7A2 2 0 0 0 15.954 7Z"
                                            />
                                          </svg>
                                        </a>

                                        <div className="flex items-center space-x-1">
                                          <p className="p-1 relative">Like</p>
                                          <span className="ml-1">{post.likes.Count}</span>
                                        </div>
                                      </button>
                                    </div>


                                    <button onClick={() => toggleCommentBox(index)} className="hover:bg-gray-300 flex left-1 relative rounded-sm">
                                      <AiOutlineComment className='text-2xl opacity-80 text-sky-950 hover:bg-gray-300 bg-white relative cursor-pointer' />
                                      <span
                                        className=" inline-block relative">Comment</span>
                                    </button>

                                  </div>

                                  {SavedPost && SavedPost.some((savedPost: { PostId: { _id: string; }; }) => savedPost.PostId?._id === post._id) ? (
                                    <button onClick={() => SavePost(post._id)} className="hover:bg-gray-300 ">
                                      <BsFillBookmarkFill />
                                    </button>
                                  ) : (
                                    <button onClick={() => SavePost(post._id)} className="hover:bg-gray-300 ">
                                      <BsBookmark />
                                    </button>
                                  )}

                                </div>


                                {/* comments  given add  */}

                                {showCommentBox === index && (
                                  <div className="mt-4">
                                    <div className="mt-4 bg-gray-100 p-4 rounded-md">
                                      <h3 className="text-lg font-semibold">Comments</h3>

                                      <form onSubmit={(e) => { e.preventDefault(); SubmitComments(post._id) }}
                                        className="mt-3">
                                        <div className="flex items-start mb-2">
                                          <img src={username ? image : '../../../../public/Images/585e4beacb11b227491c3399 (2).png'} alt="Your Profile" className="w-8 h-8 rounded-full mr-2" />
                                          <textarea
                                            className="w-full px-3 py-2 border rounded-md textarea-autosize"
                                            placeholder="Write a comment..."
                                            rows={rows}
                                            value={Comment}
                                            onInput={handleTextareaInput}
                                            onChange={(e) => SetComment(e.target.value)}
                                          ></textarea>
                                          <button type="submit" className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                                            <svg className="w-5 h-5 rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                              <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                                            </svg>
                                          </button>
                                        </div>

                                      </form>




                                      <div className="pt-5 -m-6 sm:-m-0">
                                        <div className="pt-5 pl-5">
                                          {HomePosts[index]?.Comments.map((comment: Comment, commentIndex: number) => (
                                            <div key={commentIndex} className="mb-2 bg-white ">
                                              <div className="flex items-start p-3 border border-gray-300 rounded-lg hover:shadow-md">
                                                <img onClick={() => Navigate('DevColabs-Client//profile', { state: comment?.userId?._id })}
                                                  src={comment.userId.profileImg}
                                                  alt="Commenter Profile"
                                                  className="w-8 h-8 rounded-full mr-3  cursor-pointer"
                                                />
                                                <div
                                                  className="flex-grow">
                                                  <p onClick={() => Navigate('/profile', { state: comment?.userId?._id })}
                                                    className="font-semibold cursor-pointer break-all text-blue-500 hover:underline">
                                                    {comment.userId.UserName}
                                                  </p>
                                                  <p className="text-gray-600 break-all mt-1">{comment.Comment}</p>
                                                </div>
                                                <div className="ml-auto">
                                                  {comment?.userId?._id === userId && (
                                                    <CommentEdit data={comment} onClose={() => setrefresh(!reftesh)} />
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}



                              </div>
                            </div>

                          ))}


                          {SelectHashtag && (

                            <div className="fixed top-0 left-0 z-50 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setmodal(true)}>
                              <div className=" p-1 rounded-lg w-[50rem] left-10 relative shadow-lg  max-w-2xl max-h-full" onClick={() => setmodal(true)}>
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-" onClick={() => setmodal(true)}>
                                  <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600" onClick={() => setmodal(true)}>
                                    <h3 className="text-xl font-semibold text-gray-900 ">
                                      Add Hashtag
                                    </h3>
                                    <button
                                      onClick={() => {setSelectHashtag(false),setRefresh(!refresh),setSelectCategory('Latest')}}
                                      type="button" className="text-white bg-gray-700 hover:bg-gray-500 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-700 dark:hover:bg-gray-700focus:outline-none dark:focus:ring-blue-800">
                                      Skip</button>


                                  </div>
                                  <form onSubmit={submitForm}
                                    className="p-10 relative">
                                    <div className="grid pb-10  md:grid-cols-2 p-4 md:gap-6">
                                      {fetchHashTag && fetchHashTag.map((tag, index) => (
                                        <div className="flex items-center bg-gray-200 p-2 rounded-md space-x-2" key={index}>
                                          <label className="inline-flex items-center">
                                            <input
                                              onChange={() => handleCheckboxChange(tag?._id)}
                                              type="checkbox" className="form-checkbox  cursor-pointer text-green-500" />
                                            <span className="ml-2 text-black">{tag?.Hashtag}</span>
                                          </label>
                                        </div>
                                      ))}
                                      {formError && <p className="text-red-500">{formError}</p>}
                                    </div>

                                    <div className="pl-4">
                                      <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>

                                    </div>
                                  </form>
                                </div>
                                <ToastContainer />
                              </div>
                            </div>
                          )}
                        </div>



                        <div className="hidden z-50 md:block ">
                          <div className="bg top-10 lg:w-[110%] h-32 lg:right-10 relative flex justify-center ">
                            <div className="bg-white w-full h-full items-center justify-center z-0 flex ">
                              {selectCategory !== "Recommended" ? (
                                <CustomPagination pageCount={pageCount} onPageChange={handlePageChange} />
                              ) : (
                                <>
                                </>
                              )}

                              {/* REcomendation */}
                              {(HomePosts.length <= 0 && selectCategory == 'Recommended') && (
                                <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-lg bg-gradient-to-br from-purple-400 to-red-500">
                                  <p className="text-white text-lg font-semibold text-center">
                                    There are no recommended posts.
                                  </p>
                                  <p className="text-white text-sm mt-2 text-center">
                                    You should follow others and get more recommendations!
                                  </p>
                                </div>
                              )}


                            </div>
                          </div>
                        </div>
                        <div className=" bottom-4 relative ">
                          <div className="bg top-10 lg:w-[110%] h-32 md:hidden lg:right-10 relative flex justify-center ">
                            <div className="bg-white w-full h-full  bottom-5 pb-10   relative items-center justify-center z-0 flex ">
                              <CustomPagination pageCount={pageCount} onPageChange={handlePageChange} />
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>


                  {/* Options Div */}
                  <div className="hidden md:block relative xl:w-[16.5rem] 2xl:w-[17rem] ">
                    <div className="fixed top-0 left-0 right-10  h-full hidden md:block  lg:w-[18rem]  xl:w-[23rem] 2xl:w-[20 rem] md:w-[16rem] overflow-hidden lg:mx-7 xl:mx-10 md:mx-2 z-10">
                      <div className="h-full overflow-y-auto  relative bg-white  border-r-2 px-2 ">
                        <nav className="flex flex-col top-44 relative bg-white  mr-3 border-2 p-2 pr-2 justify-around rounded-lg shadow-lg">
                          <ul>
                            <li onClick={() => { setSelectCategory('Latest'), setClickedHashtag(''), setTag({ HashtagName: '', CountPost: 0 }) }} className={`flex cursor-pointer  items-center w-auto  h-12 space-x-2 ${(!clickedHashtag && selectCategory === 'Latest' || selectCategory === 'Recommended') && `bg-sky-200`}  rounded-xl hover:bg-sky-100 `}>
                              <AiOutlineHome className="text-3xl text-gray-800  ml-3 " onClick={() => Navigate('/')} />
                              <h1 onClick={() => { setSelectCategory('Latest'), setClickedHashtag('') }} className="font-bold text-base">Home</h1>
                            </li>
                            <li onClick={() => { username ? Navigate('/Community') : setIsModalOpen(true) }} className="flex cursor-pointer items-center h-12 space-x-2 hover:bg-sky-100 rounded-xl">
                              <HiOutlineUserGroup className="text-3xl text-gray-800 ml-3 mr-1" />
                              <h1 className="font-bold text-base">Community</h1>
                            </li>
                            <li className="flex cursor-pointer items-center h-12 space-x-2 hover:bg-sky-100 rounded-xl">
                              <AiOutlineUser className="text-3xl text-gray-800 ml-3" onClick={() => Navigate('/profile')} />
                              <h1 onClick={() => { username ? Navigate('/profile') : setIsModalOpen(true) }} className="font-bold text-base">Profile</h1>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </main>
          {/* Footer */}
          <div className="top-10 relative mt-10">
            <Footer
              SelectCategory={(data) => (data === 'Latest' ? setSelectCategory('Latest') : 'Recommended')}
              ClickedHashtag={(data) => setClickedHashtag(data)}
            />
          </div>
        </div >

        <ToastContainer />

      </div >

    </>
  )
}

export default HomePage



