import { useDispatch, useSelector } from "react-redux";
import { Posts } from '../../../utils/interfaceModel/PostsInfra'
import { ChangeEvent, useEffect, useState } from "react";
import { UserBlock_UnBlock } from "../../../services/API functions/UserApi";
import { updateUser } from "../../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/axios";
import { AiOutlineComment } from "react-icons/ai";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { format } from "date-fns";
import { googleLogout } from "@react-oauth/google";
import { toast } from "react-toastify";




interface OptionProps {
    post: any

    HomePosts: Posts[],
    index: number
    userId: string
    SendData: (data: boolean) => void

}

function OptionsSavedPost({ post, HomePosts, index, userId, SendData }: OptionProps) {


    const { image, username, userEmail } = useSelector((state: any) => state.user);
    const [liked, setliked] = useState(false);
    const dispatch = useDispatch(); const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const Navigate = useNavigate();
    const [showCommentBox, setShowCommentBox] = useState<number | null>(null);
    const [SavedPost, SetSavedPost] = useState<any>([]);
    const [Comment, SetComment] = useState<string>('');
    const [reftesh, setrefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000); // 1 minute in milliseconds

        return () => {
            clearInterval(intervalId);
        };
    }, []);


    useEffect(() => {
       
        SendData(reftesh)
    }, [reftesh,isModalOpen])

    useEffect(() => {
        console.log(post, 'post');
        console.log(HomePosts, 'HomePosts');
        console.log(SavedPost, 'SavedPost');
        console.log(post?.likes?.LikedUsers[0], 'likedUser?.userId?._id ');



    }, [post])

    const CommentDate = format(currentDate, "d MMMM yyyy hh:mm a");
    const toggleCommentBox = (index: number) => {
        setShowCommentBox(prevState => (prevState === index ? null : index));
    };

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

    const handleClick = async (PostId: Posts) => {
        try {
            setliked(true)
            setrefresh(true);
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
            setrefresh(false);
        } catch (error) {
            console.log(error);

        }
    };
    const [rows, setRows] = useState(1);
    const handleTextareaInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const calculatedRows = Math.min(
            Math.ceil(e.target.scrollHeight / 18),
            2
        );

        setRows(calculatedRows);
    };

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
        setrefresh(true);
        setIsLoading(true);
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
                setrefresh(false)
            }

        } else {

            setIsModalOpen(true);

        }
        setIsLoading(false)
    };

    useEffect(() => {
        const FetchSavedPost = async () => {
            setIsLoading(true);
            const findSaveduserPost = await api.get('/UserSaveds', { withCredentials: true });
            SetSavedPost(findSaveduserPost?.data);
            setIsLoading(false)
        }
        FetchSavedPost();

    }, [liked, reftesh])


    return (
        <>

            <div className="mt-4  flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => { username ? handleClick(post?._id) : setIsModalOpen(true) }}
                            className="w-20  justify-center flex rounded-sm"
                        >
                            <a
                                type="button"
                                className={`${post?.likes?.LikedUsers?.some(
                                    (likedUser: any) =>
                                        likedUser?.userId === userId && likedUser?.liked)
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
                                <span className="ml-1">{post?.likes?.Count}</span>
                            </div>
                        </button>
                    </div>


                    <button onClick={() => toggleCommentBox(index)} className="hover:bg-gray-300 flex left-1 relative rounded-sm">
                        <AiOutlineComment className='text-2xl opacity-80 text-sky-950 hover:bg-gray-300 bg-white relative cursor-pointer' />
                        <span
                            className=" inline-block relative">Comment</span>
                    </button>

                </div>

                {SavedPost && SavedPost?.some((savedPost: { PostId: { _id: string; }; }) => savedPost?.PostId?._id === post?._id) ? (
                    <button onClick={() => SavePost(post?._id)} className="hover:bg-gray-300 ">
                        <BsFillBookmarkFill />
                    </button>
                ) : (
                    <button onClick={() => SavePost(post?._id)} className="hover:bg-gray-300 ">
                        <BsBookmark />
                    </button>
                )}

            </div>


            {/* comments  given add  */}

            {showCommentBox === index && (
                <div className="mt-4">
                    <div className="mt-4 bg-gray-100 p-4 rounded-md">
                        <h3 className="text-lg font-semibold">Comments</h3>

                        <form onSubmit={(e) => { e.preventDefault(); SubmitComments(post?._id) }}
                            className="mt-3">
                            <div className="flex items-start mb-2">
                                <img src={username ? image : '../../../../public/Images/585e4beacb11b227491c3399 (2).png'} alt="Your Profile" className="w-8 h-8 rounded-full mr-2" />
                                <textarea
                                    className="w-full px-3 py-2 border rounded-md textarea-autosize"
                                    placeholder="Write a comment..."
                                    rows={rows}
                                    value={Comment}
                                    onInput={handleTextareaInput}
                                    onChange={(e) => SetComment(e?.target?.value)}
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
                                {HomePosts.map((comment: any, commentIndex: number) => (
                                    <div key={comment?._id}>
                                        <div className="flex items-start mb-5" key={commentIndex}>
                                            <img
                                                src={comment?.userId?.profileImg}
                                                alt="Commenter Profile"
                                                className="w-8 h-8 rounded-full mr-2"
                                            />
                                            <div>
                                                <p className="font-semibold">{comment?.userId?.UserName}</p>
                                                <p className="flex-auto text-gray-600 overflow-hidden break-words  break-all">
                                                    {comment?.Comment}
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

        </>
    )
}

export default OptionsSavedPost

