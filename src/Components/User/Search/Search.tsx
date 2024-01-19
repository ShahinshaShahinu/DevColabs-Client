
import { Posts } from "../../../utils/interfaceModel/PostsInfra"
import { AllUsers } from '../../../utils/interfaceModel/comment';
import { api } from "../../../services/axios";
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Make sure you import necessary hooks
import Navbar from "../Navbar/Navbar";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi2";
import Footer from "../Navbar/Footer";
import FollowUnFollow from "./FollowUnFollow";
import CommunitySection from "../Home/CommunitySection";
import LikeSection from "../Home/LikeSection";
import PostFooterOptions from "../Home/PostFooterOptions";
import { useSelector } from "react-redux";
import LoaderAbsolute from "../isLoading/LoaderAbsolute";



function Search() {
    const Navigate = useNavigate();
    const location = useLocation(); // Make sure you're using the useLocation hook
    const { userId } = useSelector((state: any) => state.user);
    const [filteredItemsp, setFilteredItemsp] = useState<(Posts | AllUsers)[]>([]);
    const [HomePosts, setHomePosts] = useState<Posts[]>([]);
    const [Allusers, setAllusers] = useState<AllUsers[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<'users' | 'posts'>('posts');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const userResponse = await api.get(`/SearchPosts`, { withCredentials: true });
            const allUsersResponse = await api.get(`/GetUsers`, { withCredentials: true });
            setHomePosts(userResponse.data?.posts);
            setAllusers(allUsersResponse?.data);
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        };

        fetchData();
    }, [location.state?.searchTerm, selectedCategory, searchTerm, refresh]);


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



    useEffect(() => {
        const SearchedItem = location.state?.searchTerm || '';
        console.log(SearchedItem, 'SearchedItem');

        setSearchTerm(SearchedItem.toLowerCase());

        handleSearch(SearchedItem.toLowerCase(), selectedCategory);

    }, [location.state?.searchTerm, HomePosts, Allusers, searchTerm, refresh]);

    const handleSearch = (searchTerm: string, category: 'users' | 'posts') => {
        setSelectedCategory(category);
        if (searchTerm.trim() === '') {
            setFilteredItemsp([]); // Clear filtered items when the search term is empty
            return;
        }

        let newFilteredItems: (Posts | AllUsers)[] = [];

        if (category === 'posts') {
            newFilteredItems = HomePosts.filter(post =>
                post?.title?.trim()?.toLowerCase()?.includes(searchTerm?.trim()?.toLowerCase()) || post?.HashTag?.some((tag: any) =>
                    tag?.trim()?.toLowerCase()?.includes(searchTerm?.trim()?.toLowerCase())) || (
                    typeof post?.userId === 'object' &&
                    typeof post?.userId?.UserName === 'string' &&
                    post?.userId?.UserName?.trim()?.toLowerCase()?.includes(searchTerm?.trim()?.toLowerCase())
                )
            );
        } else {
            newFilteredItems = Allusers.filter(user =>
                user?.UserName?.trim()?.toLowerCase()?.includes(searchTerm?.trim()?.toLowerCase()) || user?.UserHshTag?.SelectedTags?.some((tag: any) =>
                    tag?.HshTagId?.Hashtag?.trim()?.toLowerCase()?.includes(searchTerm?.trim()?.toLowerCase())
                )
            );

        }


        setFilteredItemsp(newFilteredItems);
    };

    const RemoveSearchTerm = () => {
        console.log('removed removed Searched');

        localStorage.removeItem('searchTerm');
        setSearchTerm('')
    }

    function loginModalOpen(data: boolean): void {
        console.log(data, 'lll');

        throw new Error("Function not implemented.");
    }
  

    const [refreshGrp, setRefreshGrp] = useState(false)
    return (
        <>
            <div className="relative h-screen bg-slate-100">
                <div className="min-h-screen flex flex-col">
                    <div className="relative z-20">
                        {/* Your Navbar component */}
                        <Navbar />
                    </div>
                    {isLoading && (
                        <LoaderAbsolute />
                    )}
                    {/* Main content */}
                    <main className="flex-grow bg-white">
                        <div className="lg:mx-28 xl:mx-48 md:mx-28">
                            <div className="mx-auto max-w-screen-xl overflow">
                                {/* Rest of your content */}
                                <div className="flex md:flex-row-reverse">
                                    {/* Rest of your content */}
                                    <div className="w-full md:h-screen flex relative">
                                        <div className="w-full absolute md:h-screen max-w-screen-sm top-12 sm:top-16 bg-white ml-0">
                                            <div className="flex max-w-screen relative z-10 top-2 justify-center md:left-24 max-md:left-0 sm:left-5  lg:left-56 xl:left-4 h-auto bg-opacity-75">
                                                <nav className="fixed  baCkground border-b-2 sm:w-full  backdrop-blur-md h-auto  md:max-w-lg  xl:max-w-2xl lg:max-w-2xl w-full  overflow-y-auto md:overflow-y-hidden">
                                                    <ul>
                                                        <li className={`flex cursor-pointer relative items-center h-12 space-x-2 ${isScrolled ? 'hidden md:flex' : 'flex'}`}>
                                                            <h1 className="font-bold ml-3 p-3 relative text-xl">Search</h1>
                                                        </li>
                                                    </ul>

                                                    <div className="flex sm:mx-5 mx-5 md:ml5   relative justify-between">
                                                        <button
                                                            type="button"
                                                            className={`${selectedCategory === "posts"
                                                                ? "bg-sky-200  underline decoration-4 decoration-[#7856FF]"
                                                                : " opacity-80 bg-gray-200 hover:bg-sky-200  "
                                                                } text-gray-900 md:w-1/3 font-medium rounded-lg lg:left-20 relative px-5 py-2.5 mr-2 mb-2 text-opacity-100 text-base`}
                                                            onClick={() => setSelectedCategory("posts")}
                                                        >
                                                            Posts
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`${selectedCategory === "users"
                                                                ? "bg-sky-200  underline decoration-4 decoration-[#7856FF]"
                                                                : " opacity-80 bg-gray-200 hover:bg-sky-200 "
                                                                } text-gray-900 md:w-1/3 font-medium rounded-lg px-5 lg:right-20  hover:bg-[#afb3bc] relative py-2.5 mr-2 mb-2 text-opacity-100 text-base`}
                                                            onClick={() => setSelectedCategory("users")}
                                                        >
                                                            Users
                                                        </button>
                                                    </div>
                                                </nav>
                                            </div>

                                            <div className="pt-4 top-28 relative sm:w-screen md:left-40 xl:left-0 lg:left-52   lg:max-w-2xl  md:max-w-lg  bg-[#e1e5eb]">
                                                <div className="">
                                                    <p className="bg-white mx-4 ">
                                                        {selectedCategory === 'posts' ? 'Search Posts' : 'Search Users'}
                                                    </p>
                                                    <button className="bg-black"></button>

                                                    <div className="item-list">
                                                        {filteredItemsp.length == 0 && (
                                                            <>
                                                                <div className="p-4 pt-0 bg-[#e1e5eb]">
                                                                    <div className="bg-white p-4 rounded-md shadow-md">
                                                                        <div className="p-4 pt-0 bg-gray-200 border-t-4 border-gray-400 rounded-t-lg">
                                                                            <h1 className="text-xl font-semibold text-gray-800">Empty</h1>
                                                                            <p className="text-gray-500">Search result not found</p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </>
                                                        )}
                                                        {filteredItemsp && filteredItemsp.map((item: any, index) => (
                                                            <div className="p-4 pt-0 bg-[#e1e5eb]" key={index}>
                                                                {/* Render the appropriate content based on the selected category */}
                                                                {selectedCategory === 'posts' ? (
                                                                    <div className="bg-white p-4 rounded-md shadow-md">
                                                                        <div>
                                                                            {/* Profile Image and Username */}
                                                                            <div className="flex items-start mb-3">
                                                                                <img
                                                                                    onClick={() => Navigate('/profile', { state: item?.userId?._id })}
                                                                                    src={item?.userId?.profileImg}
                                                                                    alt="User Profile"
                                                                                    className="w-10 h-10 rounded-full mr-3 cursor-pointer"
                                                                                />
                                                                                <div>
                                                                                    <p className="font-semibold text-lg cursor-pointer break-all hover:text-blue-500">{item?.userId?.UserName}</p>
                                                                                    <p>{item?.Date}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex">
                                                                                <p onClick={() => Navigate('/UserPostsView', { state: { UserPost: item } })}
                                                                                    className="text-lg cursor-pointer overflow-hidden whitespace-wrap break-words">
                                                                                    {item?.title}
                                                                                </p>
                                                                            </div>
                                                                            <div className="mt-2 flex-1 border-2">
                                                                                <img onClick={() => Navigate('/UserPostsView', { state: { UserPost: item } })}
                                                                                    src={item?.image}
                                                                                    alt={item?.Image}
                                                                                    className="w-full cursor-pointer h-auto"
                                                                                />
                                                                            </div>


                                                                            {item?.HashTag && item.HashTag.length > 0 && (
                                                                                <div className="py-2">
                                                                                    <p>
                                                                                        {item.HashTag.map((tag: string, index: number) => (
                                                                                            <span key={index} className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-500 rounded-full mr-2 hover:bg-blue-200 cursor-pointer m-0.5"
                                                                                                onClick={() => Navigate('/', { state: tag.trim() })}>
                                                                                                {tag}{' '}
                                                                                            </span >
                                                                                        ))}
                                                                                    </p>
                                                                                </div>
                                                                            )}

                                                                            <div className="top-2 relative">
                                                                                <LikeSection data={item} />
                                                                            </div>
                                                                            <PostFooterOptions post={item} HomePosts={HomePosts} index={index} userId={userId} SendData={()=>{setRefreshGrp(false),setRefresh(!refresh)}} />
                                                                        </div>


                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        {/* Profile Image and Username */}
                                                                        <div className="bg-white p-2  rounded-md shadow-md">
                                                                            <div className="flex items-start mb-2 border-2 rounded-lg p-4 hover:bg-gray-100 transition duration-300">
                                                                                <img
                                                                                    onClick={() => Navigate('/profile', { state: item?._id })}
                                                                                    src={item?.profileImg}
                                                                                    alt="User Profile"
                                                                                    className="w-12 h-12 rounded-full mr-4 cursor-pointer hover:ring-2 hover:ring-blue-500"
                                                                                />
                                                                                <div className="flex flex-col">
                                                                                    <p
                                                                                        onClick={() => Navigate('/profile', { state: item?._id })}
                                                                                        className="font-semibold text-lg cursor-pointer break-all hover:text-blue-500"
                                                                                    >
                                                                                        {item?.UserName}
                                                                                    </p>
                                                                                    {/* Hashtags */}
                                                                                    <div className="flex flex-wrap mt-2">
                                                                                        {item?.UserHshTag?.SelectedTags?.map((tagData: any, index: number) => (
                                                                                            <span onClick={() => Navigate('/', { state: tagData?.HshTagId?.Hashtag?.trim() })}
                                                                                                key={index}
                                                                                                className="px-3 py-1 inline-block m-0.5 text-sm bg-blue-100 text-blue-500 rounded-full mr-2 mb-2 hover:bg-blue-200 cursor-pointer"
                                                                                            >
                                                                                                {tagData.HshTagId.Hashtag}
                                                                                            </span>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="relative flex ml-auto">
                                                                                    <FollowUnFollow IdofUser={item?._id} />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                )}
                                                            </div>

                                                        ))}

                                                    </div>
                                                </div>

                                                <div className="sm:hidden">
                                                    <div className=" top-0 w-screen  h-0 p-8  right-4  mb-10  relative flex justify-center ">
                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden md:block relative xl:w-[16.5rem] 2xl:w-[17rem] ">
                                        <div className="fixed top-0 left-0 right-10  h-full hidden md:block  lg:w-[18rem]  xl:w-[23rem] 2xl:w-[20 rem] md:w-[16rem] overflow-hidden lg:mx-7 xl:mx-10 md:mx-2 z-10">
                                            <CommunitySection datas={refreshGrp} loginModalOpen={loginModalOpen} />
                                            <div className="h-full overflow-y-auto  relative bg-white  border-r-2 px-2 ">
                                                <nav className="flex flex-col top-44 relative bg-white mr-3 border-2 p-2 pr-2 justify-around rounded-lg shadow-lg">
                                                    <ul>
                                                        <li className="flex cursor-pointer items-center w-auto h-12 space-x-2 hover:bg-sky- rounded-xl hover:bg-sky-100">
                                                            <AiOutlineHome className="text-3xl text-gray-800  ml-3 " onClick={() => { Navigate('/'), RemoveSearchTerm() }} />
                                                            <h1 onClick={() => { Navigate('/'), RemoveSearchTerm() }} className="font-bold text-base">Home</h1>
                                                        </li>
                                                        <li onClick={() => { Navigate('/Community'), RemoveSearchTerm() }} className="flex cursor-pointer items-center h-12 space-x-2 hover:bg-sky-100 rounded-xl">
                                                            <HiOutlineUserGroup className="text-3xl text-gray-800 ml-3 mr-1" />
                                                            <h1 className="font-bold text-base">Community</h1>
                                                        </li>
                                                        <li className="flex cursor-pointer items-center h-12 space-x-2 hover:bg-sky-100 rounded-xl">
                                                            <AiOutlineUser className="text-3xl text-gray-800 ml-3" onClick={() => { Navigate('/profile'), RemoveSearchTerm() }} />
                                                            <h1 onClick={() => { Navigate('/profile'), RemoveSearchTerm() }} className="font-bold text-base">Profile</h1>
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
                </div>
            </div>

            <Footer SelectCategory={() => ('')} ClickedHashtag={() => ('')} />


        </>
    );
}

export default Search;
