
import { Posts } from "../../../../../DevColab-Server/src/domain/models/Posts";
import { AllUsers } from '../../../../../DevColab-Server/src/domain/models/user';
import { api } from "../../../services/axios";

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Make sure you import necessary hooks
import Navbar from "../Navbar/Navbar";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi2";

// interface Posts {
//   _id: string;
//   title: string;
//   Date: string;
//   HashTag: string[];
//   // ... other properties
// }

// interface AllUsers {
//   userId: {
//     _id: string;
//     UserName: string;
//     profileImg: string;
//   };
//   // ... other properties
// }

function Search() {
    const Navigate = useNavigate();
    const location = useLocation(); // Make sure you're using the useLocation hook

    const [filteredItemsp, setFilteredItemsp] = useState<(Posts | AllUsers)[]>([]);
    const [HomePosts, setHomePosts] = useState<Posts[]>([]);
    const [Allusers, setAllusers] = useState<AllUsers[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<'users' | 'posts'>('posts');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            const userResponse = await api.get(`/HomePosts`, { withCredentials: true });
            const allUsersResponse = await api.get(`/GetUsers`, { withCredentials: true });
            setHomePosts(userResponse.data);
            setAllusers(allUsersResponse.data);
        };

        fetchData();
    }, [location.state?.searchTerm, selectedCategory, searchTerm]);


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

    }, [location.state?.searchTerm, HomePosts, Allusers, searchTerm]);

    const handleSearch = (searchTerm: string, category: 'users' | 'posts') => {
        setSelectedCategory(category);
        if (searchTerm.trim() === '') {
            setFilteredItemsp([]); // Clear filtered items when the search term is empty
            return;
        }

        let newFilteredItems: (Posts | AllUsers)[] = [];

        if (category === 'posts') {
            newFilteredItems = HomePosts.filter(post =>
                post?.title?.trim().toLowerCase().includes(searchTerm.trim().toLowerCase()) || post?.HashTag?.some(tag =>
                    tag.trim().toLowerCase().includes(searchTerm.trim().toLowerCase())) || (
                    typeof post?.userId === 'object' &&
                    typeof post.userId?.UserName === 'string' &&
                    post.userId.UserName.trim().toLowerCase().includes(searchTerm.trim().toLowerCase())
                )
            );
        } else {
            newFilteredItems = Allusers.filter(user =>
                user?.UserName?.trim().toLowerCase().includes(searchTerm.trim().toLowerCase()) || user?.UserHshTag?.SelectedTags?.some(tag =>
                    tag.HshTagId?.Hashtag?.trim().toLowerCase().includes(searchTerm.trim().toLowerCase())
                )
            );

        }


        setFilteredItemsp(newFilteredItems);
    };

    return (
        <>
            <div className="relative h-screen bg-slate-100">
                <div className="min-h-screen flex flex-col">
                    <div className="relative z-20">
                        {/* Your Navbar component */}
                        <Navbar />
                    </div>

                    {/* Main content */}
                    <main className="flex-grow bg-white">
                        <div className="lg:mx-28 xl:mx-28 md:mx-28">
                            <div className="mx-auto max-w-screen-xl overflow">
                                {/* Rest of your content */}
                                <div className="flex md:flex-row-reverse">
                                    {/* Rest of your content */}
                                    <div className="w-full md:h-screen flex relative">
                                        <div className="w-full absolute md:h-screen max-w-screen-sm top-16 bg-white ml-0">
                                            <div className="flex max-w-screen relative z-10 top-2 md:left-52 lg:left-0 h-auto bg-opacity-75">
                                                <nav className="fixed baCkground border-b-2 sm:w-full backdrop-blur-md h-auto xl:w-[40rem] md:w-[27rem] w-[28rem] overflow-y-auto md:overflow-y-hidden">
                                                    <ul>
                                                        <li className={`flex cursor-pointer relative items-center h-12 space-x-2 ${isScrolled ? 'hidden md:flex' : 'flex'}`}>
                                                            <h1 onClick={() => Navigate('/')} className="font-bold ml-3 p-3 relative text-xl">Search</h1>
                                                        </li>
                                                    </ul>

                                                    <div className="flex sm:ml-5 ml-11 relative justify-between">
                                                        <button
                                                            type="button"
                                                            className={`${selectedCategory === "posts"
                                                                ? "bg-sky-200  underline decoration-4 decoration-[#7856FF]"
                                                                : " opacity-80 bg-gray-200"
                                                                } text-gray-900 md:w-1/3 font-medium rounded-lg lg:left-20 relative px-5 py-2.5 mr-2 mb-2 text-opacity-100 text-base`}
                                                            onClick={() => setSelectedCategory("posts")}
                                                        >
                                                            Posts
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`${selectedCategory === "users"
                                                                ? "bg-sky-200  underline decoration-4 decoration-[#7856FF]"
                                                                : " opacity-80 bg-gray-200"
                                                                } text-gray-900 md:w-1/3 font-medium rounded-lg px-5 lg:right-20 relative py-2.5 mr-2 mb-2 text-opacity-100 text-base`}
                                                            onClick={() => setSelectedCategory("users")}
                                                        >
                                                            Users
                                                        </button>
                                                    </div>


                                                    {/* <div className="flex sm:ml-5 ml-11 relative"> */}
                                                    {/* <div className="relative mr-2">
                                                            <select
                                                                className="bg-white text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 dark:bg-gray-600 dark:text-white dark:border-gray-600"
                                                                value={selectedCategory}
                                                                onChange={(e) => setSelectedCategory(e.target.value as 'users' | 'posts')}
                                                            >
                                                                <option value="posts">Posts</option>
                                                                <option onClick={() => handleSearch(searchTerm, selectedCategory)} value="users">Users</option>
                                                            </select>
                                                        </div> */}
                                                    {/* <button
                                                            type="button"
                                                            className="text-gray-900 md:w-1/2 bg-transparent opacity-100 hover:bg-gray-200 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 underline decoration-4 decoration-[#7856FF] text-opacity-100 text-base"
                                                            onClick={() => handleSearch(searchTerm, selectedCategory)}
                                                        >
                                                            Search
                                                        </button> */}
                                                    {/* </div> */}

                                                </nav>
                                            </div>

                                            <div className="p-4 top-28 relative sm:w-screen lg:w-full md:w-full bg-[#e1e5eb]">
                                                <div className="bg-white">
                                                    {selectedCategory === 'posts' ? 'Search Posts' : 'Search Users'}
                                                    <button className="bg-black"></button>

                                                    {/* Rendering your filtered items */}
                                                    <div className="item-list">
                                                        {/* Rendering your filtered items */}
                                                        {filteredItemsp && filteredItemsp.map((item: any, index) => (
                                                            <div className="p-4 bg-[#e1e5eb]" key={index}>
                                                                <div className="bg-white p-4 rounded-md shadow-md">
                                                                    {/* Render the appropriate content based on the selected category */}
                                                                    {selectedCategory === 'posts' ? (
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
                                                                                    <p>{item?.userId?.UserName}</p>
                                                                                    <p>{item?.Date}</p>
                                                                                </div>
                                                                            </div>

                                                                            {/* Post Title */}
                                                                            {/* <p
                                                                                onClick={() => Navigate('/UserPostsView', { state: { UserPost: item } })}
                                                                            >{item?.title}</p> */}

                                                                            <div className="flex">
                                                                                <p onClick={() => Navigate('/UserPostsView', { state: { UserPost: item } })}
                                                                                    className="text-lg cursor-pointer overflow-hidden whitespace-wrap break-words">
                                                                                    {item?.title}
                                                                                </p>
                                                                            </div>



                                                                            {item?.HashTag && item.HashTag.length > 0 && (
                                                                                <div>
                                                                                    <p>Selected Hashtags:</p>
                                                                                    <p>
                                                                                        {item.HashTag.map((tag: string, index: number) => (
                                                                                            <span key={index} className="text-blue-500">
                                                                                                {tag}{' '}
                                                                                            </span>
                                                                                        ))}
                                                                                    </p>
                                                                                </div>
                                                                            )}


                                                                        </div>
                                                                    ) : (
                                                                        <div>
                                                                            {/* Profile Image and Username */}
                                                                            <div className="flex items-start mb-3">
                                                                                <img
                                                                                    onClick={() => Navigate('/profile', { state: item?._id })}
                                                                                    src={item?.profileImg}
                                                                                    alt="User Profile"
                                                                                    className="w-10 h-10 rounded-full mr-3 cursor-pointer"
                                                                                />
                                                                                <div>
                                                                                    <p onClick={() => Navigate('/profile', { state: item?._id })}
                                                                                        className="font-semibold cursor-pointer">
                                                                                        {item?.UserName}
                                                                                    </p>
                                                                                    {/* Hashtags */}
                                                                                    <div className="flex ">
                                                                                        {item?.UserHshTag?.SelectedTags?.map((tagData: any, index: number) => (
                                                                                            <p key={index} className="pl-1 text-sm text-blue-500">
                                                                                                {tagData.HshTagId.Hashtag}
                                                                                            </p>
                                                                                        ))}
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                        </div>



                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                    </div>






                                    <div className="hidden md:block  xl:w-[16.5rem] 2xl:w-[17rem] ">
                                        <div className="fixed top-0 left-0 h-full hidden md:block xl:w-[16.5rem] 2xl:w-[17rem] md:w-[13rem] overflow-hidden lg:mx-28 xl:mx-20 md:mx-28 z-10">
                                            <div className="h-full overflow-y-auto bg-white border-r-2 p-2 ">
                                                <nav className="flex flex-col top-44 relative bg-white border-2 p-2 pr-2 justify-around rounded-lg shadow-lg">
                                                    <ul>
                                                        <li className="flex cursor-pointer items-center w-auto h-12 space-x-2 hover:bg-sky- rounded-3xl">
                                                            <AiOutlineHome className="text-3xl text-gray-800  ml-3 " onClick={() => Navigate('/')} />
                                                            <h1 onClick={() => Navigate('/')} className="font-bold text-base">Home</h1>
                                                        </li>
                                                        <li className="flex cursor-pointer items-center h-12 space-x-2 hover:bg-sky-100 rounded-3xl">
                                                            <HiOutlineUserGroup className="text-3xl text-gray-800 ml-3 mr-1" onClick={() => Navigate('/comments')} />
                                                            <h1 onClick={() => Navigate('/comments')} className="font-bold text-base">Community</h1>
                                                        </li>
                                                        <li className="flex cursor-pointer items-center h-12 space-x-2 hover:bg-sky-100 rounded-3xl">
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
                </div>
            </div>



        </>
    );
}

export default Search;
