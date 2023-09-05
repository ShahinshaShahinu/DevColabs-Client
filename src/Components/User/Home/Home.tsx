import { AiFillHome, AiOutlineComment, AiOutlineHome, AiOutlineMessage, AiOutlineUser } from "react-icons/ai"
import { HiOutlineUserGroup } from "react-icons/hi2"
import { useNavigate } from 'react-router-dom';
import Navbar from "../Navbar/Navbar";
import { api } from "../../../services/axios";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Posts } from '../../../../../DevColab-Server/src/domain/models/Posts';
import { ChangeEvent, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { HiShare } from "react-icons/hi";
import ShareButtons from "./ShareButtons";
import { GoReport } from "react-icons/go";
import { updateUser } from "../../../redux/user/userSlice";
import { googleLogout } from "@react-oauth/google";
import { UserBlock_UnBlock, userRecomended } from "../../../services/API functions/UserApi";
import NotificationPage from "../../../Pages/NotificationPage";
import Footer from "../Navbar/Footer";
import CommunitySection from "./CommunitySection";


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
  const [refreshGrp,setRefreshGrp] = useState(false)
  const [selectCategory, setSelectCategory] = useState<'Latest' | 'Recommended' | ''>('Latest')
  const [isScrolled, setIsScrolled] = useState(false);
  const [clickedHashtag, setClickedHashtag] = useState<string | null>(null);
  const [Tag, setTag] = useState({
    HashtagName: '',
    CountPost: 0,
  });
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // 1 minute in milliseconds

    return () => {
      clearInterval(intervalId);
    };
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
        console.log('usere');

        console.log(selectedReason, '');
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
      const Hashtags = await api.get('/admin/HashTagManageMent', { withCredentials: true });
      setfetchHashTag(Hashtags.data)
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
      setliked(true)

      const UserStatus = await UserBlock_UnBlock(userEmail)
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



    } catch (error) {
      console.log(error);

    }
  };


  const [showCommentBox, setShowCommentBox] = useState<number | null>(null);

  const toggleCommentBox = (index: number) => {

    console.log('number ', index, 'inde');

    setShowCommentBox(prevState => (prevState === index ? null : index));
  };


  useEffect(() => {


    const fetchData = async () => {
      try {
        if (selectCategory === 'Latest') {

          const userResponse = await api.get(`/HomePosts`, { withCredentials: true });

          setHomePosts(userResponse?.data);
        } else if (selectCategory === 'Recommended') {
          const userHashtag = await userRecomended();
          const userResponse = await api.get(`/HomePosts`, { withCredentials: true });


          const userHashTags = userHashtag?.data.map((hashtagObj: { Hashtag: string }) => hashtagObj.Hashtag);
          const filteredPosts = userResponse.data.filter((post: { HashTag: string[] }) => {
            const postTagsCleaned = post.HashTag.map(tag => tag.trim());
            const userHashTagsCleaned = userHashTags.map((tag: string) => tag.trim());
            return postTagsCleaned.some(tag => userHashTagsCleaned.includes(tag));
          });
          setHomePosts(filteredPosts);

        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }

    }
    setRefreshGrp(true)

    fetchData();

  }, [showCommentBox, selectCategory, setliked, liked, SetComment, ShareSocialMediaModal, ReportModal, setrefresh, SavedPost, isModalOpen, reftesh]);




  useEffect(() => {

    const fetchData = async () => {

      if (clickedHashtag) {
        setSelectCategory('');
        console.log(clickedHashtag, 'click');

        console.log('after');

        const userResponse = await api.get(`/HomePosts`, { withCredentials: true });
        console.log(userResponse, 'ress');


        const filteredPosts = userResponse.data.filter((post: { HashTag: string[] }) => {
          const postTagsCleaned = post.HashTag.map(tag => tag.trim());
          return postTagsCleaned.some(tag => tag === clickedHashtag.trim());
        });
        console.log(filteredPosts, 'clikc', filteredPosts?.length, 'lemee');

        setTag({
          HashtagName: clickedHashtag.trim(),
          CountPost: filteredPosts?.length,
        });
        console.log(filteredPosts);

        setHomePosts(filteredPosts);
      }
      
    }
    fetchData();
  }, [refresh, clickedHashtag, setClickedHashtag, liked, ShareSocialMediaModal, SavedPost, Comment, SetComment, selectCategory]);


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
    setRefresh(true)
    if (username) {
      const UserStatus = await UserBlock_UnBlock(userEmail)
      if (UserStatus === false) {
        dispatch(updateUser({}));
        localStorage.removeItem("user");
        googleLogout();
      } else {
        const SavingPost = await api.post(`/SavingPosts/${userId}/${PostId}`, { withCredentials: true });

        if (SavingPost?.data?.Saved === true) {
          SavePostSucess('Seved');
        } else if (SavingPost?.data?.DeletedSAved === true) {
          SavePostSucess('UnSaved');
        }
        setRefresh(false)
      }

    } else {

      setIsModalOpen(true);

    }
  };

  useEffect(() => {
    const FetchSavedPost = async () => {

      const findSaveduserPost = await api.get('/UserSaveds', { withCredentials: true });
      console.log(findSaveduserPost?.data, 'savedpost');
      SetSavedPost(findSaveduserPost?.data)
    }
    FetchSavedPost();

  }, [refresh])



  const SubmitComments = async (postId: string) => {

    try {

      if (username) {
        setrefresh(true)
        SetComment('');
        await api.post(`/AddCommentOnPost/${postId}`, { Comment, CommentDate }, { withCredentials: true });
        setrefresh(false);
      } else {

        setIsModalOpen(true);

      }
      setrefresh(false);

    } catch (error) {
      console.log(error);

    }

  }
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [clickedPostIndex, setClickedPostIndex] = useState<number>(Number);
  const [rows, setRows] = useState(1);

  const handleTextareaInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const calculatedRows = Math.min(
      Math.ceil(e.target.scrollHeight / 18),
      2
    );

    setRows(calculatedRows);
  };

  const loginModalOpen = ()=>{
    setIsModalOpen(!isModalOpen);
  }



  return (
    <>


      <div className=" relative h-screen  bg-slate-100">
        <div className="min-h-screen flex flex-col">
          <div className=" relative z-20 ">
            <Navbar />
            <NotificationPage />
          </div>
          <main className="flex-grow  bg-white">

            <div className="lg:mx-28 xl:mx:28 md:mx-28 ">
              <div className="mx-auto max-w-screen-xl overflow">
                <div className="flex md:flex-row-reverse ">
                  <div className="bg-white 
                  border-l-2  fixed  z-10 ">
                    <CommunitySection  datas={refreshGrp} loginModalOpen={loginModalOpen}/>
                  </div>
                  <div className="w-full   md:h-screen flex relative">
                    {/* Outer Div with Black Background */}
                    <div className="w-auto absolute md:h-screen md:scree max-w-screen-md top-16 bg-white ml-0 ">
                      {/* Inner Content */}
                      <div className="flex max-w-screen-md  relative z-10  top-2 sm:justify-center md:left-32 xl:left-14 h-auto bg-opacity-75">
                        <nav className="fixed baCkground border-b-2 sm:w-full backdrop-blur-md h-auto xl:w-[42rem] md:w-[40rem] lg:w-[40rem] w-[28rem] overflow-y-auto md:overflow-y-hidden">
                          <ul>
                            {(!clickedHashtag && selectCategory === 'Latest' || selectCategory === 'Recommended') ? (
                              <li className={`flex cursor-pointer relative items-center h-12 space-x-2 ${isScrolled ? 'hidden md:flex' : 'flex'}`}>
                                <h1 onClick={() => Navigate('/')} className="font-bold ml-3 p-3 relative text-xl">Home</h1>
                              </li>
                            ) : (
                              <>
                                <div className="ml-8 mb-2">
                                  <li className={`flex cursor-pointer relative items-center  mt-3   h-12 space-x-2 ${isScrolled ? 'hidden md:flex' : 'flex'}`}>
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
                            <div className="flex sm:ml-5  mx-10 max-sm:px-10 max-sm:pl-0 justify-between   relative">
                              <button
                                onClick={() => setSelectCategory('Latest')}
                                type="button"
                                className={`${selectCategory === "Latest" ?
                                  "bg-[#b3bcc9] underline decoration-4 decoration-[#7856FF] text-gray-900" :
                                  'opacity-80 hover:bg-[#dddbdb]'
                                  } md:w-1/2 bg-transparent opacity-100 font-medium rounded-lg px- py-2.5 mr-2 mb-2 text-base`}
                              >
                                Latest Posts
                              </button>
                              <button
                                onClick={() => { username ? slecetedCategory('Recommended') : setIsModalOpen(true) }}
                                type="button"
                                className={`${selectCategory === "Recommended" ?
                                  "bg-[#b3bcc9] underline decoration-4 decoration-[#7856FF] text-gray-900" :
                                  'opacity-80 hover:bg-[#dddbdb]'
                                  } md:w-1/2 bg-transparent opacity-100 font-medium rounded-lg  py-2.5  mr-5 mb-2 text-base`}
                              > Recommended Post</button>
                            </div>
                          )}
                        </nav>
                      </div>


                      <div className="p-4 md:left-32 md:mx-8 lg:mx-0 lg:right-0 sm:left-0 top-28 md:w-screen  xl:left-14   relative sm:w-screen  lg:max-w-2xl  bg-[#e1e5eb]">

                        <div>

                          <p className="bg-white mx-4 ">
                            {clickedHashtag !== null && clickedHashtag ? 'HashTag' : 'Posts'}
                          </p>

                          {HomePosts && HomePosts.map((post: any, index) => (
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

                                        <div className="justify-end absolute right-12 flex items-end group">
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
                                      </div>

                                    </div>

                                    <p onClick={() => Navigate('/profile', { state: post?.userId?._id })}
                                      className="font-semibold cursor-pointer">{post?.userId?.UserName}</p>

                                    <p className="text-sm text-gray-500">{post?.Date}</p>
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

                                              <ShareButtons url={`http://localhost:5173/UserPostsView/${post?._id}`} title={post?.title} />

                                            </div>

                                            <div className="flex pt-1 justify-center items-center">
                                              <button
                                                data-modal-hide="popup-modal"
                                                type="button"
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
                                <div className="flex">
                                  <p onClick={() => Navigate('/UserPostsView', { state: { UserPost: post } })}
                                    className="text-lg cursor-pointer overflow-hidden whitespace-wrap break-words">
                                    {post?.title}
                                  </p>
                                </div>


                                <div className="mt-4">
                                  <div className="flex flex-wrap items-start space-x-2">
                                    {post?.HashTag && post?.HashTag.map((tag: string, index: number) => {
                                      const trimmedTag = tag.trim();
                                      return (
                                        <span
                                          key={index}
                                          className={`text-blue-500 inline-block cursor-pointer ${index > 0 ? 'ml-2' : ''
                                            } ${index > 0 ? 'sm:relative sm:right-2' : ''
                                            }`}
                                          onClick={() => setClickedHashtag(trimmedTag)}
                                        >
                                          {trimmedTag}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>


                                {isModalOpen && (
                                  <div
                                    id="popup-modal"
                                    tabIndex={-1}
                                    className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50"
                                  >
                                    <div className="relative w-full max-w-md">
                                      <div className="relative bg-white rounded-lg shadow dark:bg-gray-300">
                                        <div className="p-2 text-center ">
                                          <div className="border-2 border-gray-500 rounded-md p-2">
                                            <svg
                                              className="mx-auto mb-4 text-red-800 w-12 h-12 dark:text-gr"
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
                                                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                              />
                                            </svg>
                                            <h3 className="mb-5 text-2xl font-normal text-gray-900 dark:text-gray-900">
                                              Please Login to Proceed
                                            </h3>
                                            <div className="flex justify-center items-center">
                                              <button
                                                data-modal-hide="popup-modal"
                                                type="button"
                                                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                                onClick={toggleModal}
                                              >
                                                Close
                                              </button>
                                              <button
                                                className="ml-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                                onClick={() => Navigate('/login')}
                                              >
                                                Login
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}


                                <div className="mt-4  flex items-center justify-between">
                                  <div className="flex items-center space-x-4">

                                    <div className="flex items-center space-x-4">
                                      <button
                                        onClick={() => { username ? handleClick(post._id) : setIsModalOpen(true) }}
                                        className="w-20  justify-center flex rounded-sm"
                                      >
                                        <a
                                          type="button"
                                          className={`${post.likes.LikedUsers.some(
                                            (likedUser: any) =>
                                              likedUser.userId === userId && likedUser?.liked)
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



                                      <div className=" pt-5">
                                        <div className="pt-5 pl-5">
                                          {HomePosts[index]?.Comments.map((comment: any, commentIndex: number) => (
                                            <div key={comment._id}>
                                              <div className="flex items-start mb-5" key={commentIndex}>
                                                <img
                                                  src={comment.userId.profileImg}
                                                  alt="Commenter Profile"
                                                  className="w-8 h-8 rounded-full mr-2"
                                                />
                                                <div>
                                                  <p className="font-semibold">{comment.userId.UserName}</p>
                                                  <p className="flex-auto text-gray-600 overflow-hidden break-words  break-all">
                                                    {comment.Comment}
                                                  </p>

                                                  {/* <button className="text-blue-500 mr-2">Like</button>
                                                  <button className="text-red-500 mr-2">Dislike</button>

                                                
                                                  <button className="text-gray-500 mr-2">Reply</button>

                                    
                                                  <button className="text-gray-500">Delete</button> */}
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
                                      onClick={() => setSelectHashtag(false)}
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
                      </div>
                    </div>
                  </div>

                  {/* Options Div */}
                  <div className="hidden md:block relative xl:w-[16.5rem] 2xl:w-[17rem] ">
                    <div className="fixed top-0 left-0 right-10  h-full hidden md:block  lg:w-[18rem]  xl:w-[23rem] 2xl:w-[20 rem] md:w-[16rem] overflow-hidden lg:mx-7 xl:mx-10 md:mx-2 z-10">
                      <div className="h-full overflow-y-auto  relative bg-white
                  
                  border-r-2 px-2 ">
                        <nav className="flex flex-col top-44 relative bg-white mr-3 border-2 p-2 pr-2 justify-around rounded-lg shadow-lg">
                          <ul>
                            <li onClick={() => { setSelectCategory('Latest'), setClickedHashtag('') }} className={`flex cursor-pointer items-center w-auto  h-12 space-x-2 ${(!clickedHashtag && selectCategory === 'Latest' || selectCategory === 'Recommended') && `bg-sky-200`}  rounded-xl hover:bg-sky-100 `}>
                              <AiOutlineHome className="text-3xl text-gray-800  ml-3 " onClick={() => Navigate('/')} />
                              <h1 onClick={() => { setSelectCategory('Latest'), setClickedHashtag('') }} className="font-bold text-base">Home</h1>
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
              </div>
            </div>
          </main>

          {/* Footer */}
          <Footer />
        </div>

        <ToastContainer />

      </div>
    </>
  )
}

export default HomePage



























{/* <footer className="bg-gray-800 text-white p-4">
    <div className="container mx-auto text-center">
      © 2023 Your Brand. All rights reserved.
    </div>
  </footer> */}







// <div className="bg-gray-700 left-2 top-28 w-10 h-8 justify-start bottom-2 absolute">
//                       <div className="flex justify-start relative items-end">
//                         <BiLike className='text-2xl' />
//                       </div>
//                     </div>






// {/*
//         <div className="w-screen  flex relative  rounded-sm ">
//           <div className="relative  h-screen grid grid-cols-1 md:grid-cols-2 m-auto  overflow-y-auto  overflow-x-hidden bottom-1   shadow-md shadow-gray-600 w-[904px]  ">

//             <div className=" z-0  relative items-center mt-24 justify-center  ">

//               {HomePosts && HomePosts.map((post: any, index) => (
//                 <div key={index} className='flex p-2   relative '>
//                   <div className="flex relative    ">
//                     <div className='flex bg-white  relative left-2 rounded-lg m-auto h-[150px]  overflow-hidden shadow-sm shadow-black sm:max-w-[100%]'
//                       style={{
//                         width: '54.5rem',
//                         position: 'relative',

//                       }}
//                     >

//                       <div onClick={() => Navigate('/profile', { state: post?.userId?._id })} className='z-10 text-start pl-3 pt-3 justify-start  absolute'>
//                         <img onClick={() => Navigate('/profile', { state: post?.userId })}
//                           src={post?.userId?.profileImg} alt='User Profile' className='w-9 inline cursor-pointer rounded-full mx-auto ' />
//                         <h1 onClick={() => Navigate('/profile', { state: post?.userId?._id })}
//                           className='inline-block pl-1 top-3 text-lg cursor-pointer absolute'>{post?.userId?.UserName}</h1>
//                         <p className='inline top-4 text-sm left-2 relative'>{post?.Date}</p>
//                       </div>

//                       <div className='p-4 flex right-0 relative cursor-pointer flex-col justify-center'>
//                         <h1 onClick={() => Navigate('/UserPostsView', { state: { UserPost: post } })}
//                           className='font-semibold top-0 left-10  relative text-2xl'>{post?.title} </h1>
//                         <hr className="border-t border-gray-300 my-4" />
//                       </div>

//                       <div className=" left-14 top-28 w-52 h-8 justify-start bottom-2 absolute">
//                         <div className="flex justify-start relative items-end">
//                           {post.likes.LikedUsers.some((likedUser: any) => likedUser.userId === userId && likedUser.liked) ? (
//                             <>
//                               <button onClick={() => handleClick(post._id)} className="hover:bg-gray-300  w-20 justify-center flex rounded-sm">

//                                 <BiSolidLike className='text-2xl opacity-80 cursor-pointer' />
//                                 <p>Like</p>
//                                 <span className="ml-1">{post.likes.Count}</span>
//                               </button>
//                             </>
//                           ) : (

//                             <>
//                               <button onClick={() => handleClick(post._id)} className="hover:bg-gray-300  w-20 justify-center flex rounded-sm">

//                                 <BiLike className='text-2xl opacity-80 cursor-pointer' />
//                                 <p>Like</p>
//                                 <span className="ml-1">{post.likes.Count}</span>
//                               </button>

//                             </>
//                           )}
//                           <button onClick={showShadowDiv} className="hover:bg-gray-300 flex left-1 relative rounded-sm">
//                             <FaRegComments className='text-2xl opacity-80  relative cursor-pointer' />
//                             <span className=" inline-block relative">Comment</span>
//                           </button>
//                         </div>
//                       </div>
//                     </div>





//                     <div className='flex justify-end  right-8 items-end   relative'>
//                       <button onClick={() => SavePost(post._id)} >
//                         <svg className="w-4 right-0 bottom-2 relative" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
//                           <path d="M1.9375 0H29.0625C29.5764 0 30.0692 0.158035 30.4325 0.43934C30.7959 0.720644 31 1.10218 31 1.5V30.214C31.0004 30.3483 30.9542 30.4801 30.8662 30.5959C30.7783 30.7116 30.6519 30.8069 30.5001 30.8719C30.3483 30.9369 30.1768 30.9691 30.0035 30.9653C29.8301 30.9614 29.6613 30.9216 29.5146 30.85L15.5 24.046L1.48283 30.848C1.33637 30.919 1.16803 30.9584 0.995292 30.962C0.82255 30.9657 0.651686 30.9335 0.500415 30.8689C0.349143 30.8042 0.222972 30.7094 0.134983 30.5942C0.0469929 30.4791 0.000388072 30.3478 0 30.214V1.5C0 1.10218 0.204129 0.720644 0.56748 0.43934C0.930832 0.158035 1.42364 0 1.9375 0ZM27.125 3H3.875V26.148L15.5 20.508L27.125 26.148V3Z" fill="#5F5454" />
//                         </svg>
//                       </button>
//                     </div>
//                     <div className="bg-transparent  right-0 left-0  absolute top-36 w-[98.5%]  h-auto">
//                       <div className="bg-white h-auto relative p-1 left-2 ">





//                         <form onSubmit={(e) => {
//                           e.preventDefault();
//                           SubmitComments(post._id)
//                         }}>
//                           <div className="w-full mb-4 border border-gray-200 rounded-lg h-auto bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
//                             <div className="px-1 py-2 pl-10 bg-white rounded-t-lg h-auto dark:bg-gray-800">
//                               <div key='' className="flex right-10 top-5 relative items-center">
//                                 <img src={post?.userId?.profileImg} alt='Commenter Profile' className='w-6 h-6 rounded-full mx-2' />
//                               </div>
//                               <label form="comment" className="sr-only">Your comment</label>

//                               <textarea
//                                 onChange={(e) => SetComment(e.target.value)}
//                                 id="comment"
//                                 className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-100 focus:ring-0 dark:text-gray-950 dark:placeholder-gray-400"
//                                 placeholder="Write a comment..."
//                                 required
//                                 rows={3}
//                               ></textarea>
//                             </div>
//                             <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
//                               <button
//                                 type="submit"
//                                 className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
//                               >
//                                 Post comment
//                               </button>
//                               <div className="flex pl-0 space-x-1 sm:pl-2">
//                                 <button
//                                   type="button"
//                                   className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
//                                 >
//                                   <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 20">

//                                   </svg>
//                                   <span className="sr-only">Attach file</span>
//                                 </button>

//                               </div>
//                             </div>
//                           </div>
//                         </form>







//                       </div>


//                     </div>
//                   </div>
//                 </div>




//               ))}
//               <ToastContainer />


//             </div>


//           </div>
//         </div> */}