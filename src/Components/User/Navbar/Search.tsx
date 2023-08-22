import React, { useEffect, useState } from 'react'
import { api } from '../../../services/axios';
import { AllUsers } from '../../../../../DevColab-Server/src/domain/models/user';
import { Posts } from '../../../../../DevColab-Server/src/domain/models/Posts';
import { FcSearch } from 'react-icons/fc';

function Search() {



    useEffect(() => {
        const fetchData = async () => {
            const userResponse = await api.get(`/HomePosts`, { withCredentials: true });
            const response = await api.get<AllUsers[]>('/GetUsers', { withCredentials: true });
            setAllUsers(response?.data);

            console.log(response?.data, ' users users users');
            setHomePosts(userResponse?.data);

        }
        fetchData()

    }, [])


    const [AllUsers, setAllUsers] = useState<AllUsers[]>([])
    const [HomePosts, setHomePosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState<(Posts | AllUsers)[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<'users' | 'posts'>('posts');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = event.target.value.toLowerCase();

        let newFilteredItems: (Posts | AllUsers)[] = [];

        if (selectedCategory === 'posts') {
            newFilteredItems = HomePosts.filter(post =>
                post.title.toLowerCase().includes(newSearchTerm)
            );
        } else {
            newFilteredItems = AllUsers.filter(user =>
                user.UserName.toLowerCase().includes(newSearchTerm)
            );
        }

        setSearchTerm(newSearchTerm);
        // onFilteredItemsChange(newFilteredItems)
        setFilteredItems(newFilteredItems);

        setShowResults(newSearchTerm !== '');
    };

    return (
        <>
            <div className="flex md:left-60 absolute px-8 w-1/3">
                <form>
                    <div className="relative flex">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FcSearch className="text-gray-400 text-xl" />
                        </div>
                        <input
                            type="text"
                            id="simple-search"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-50 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search Post/Users..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <div className="relative ml-2">
                            <select
                                className="bg-white text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 dark:bg-gray-600 dark:text-white dark:border-gray-600"
                                value={selectedCategory}
                                onChange={(event) =>
                                    setSelectedCategory(event.target.value as 'users' | 'posts')
                                }
                            >
                                <option value="posts">Posts</option>
                                <option value="users">Users</option>
                            </select>
                        </div>
                    </div>

                    <div className={showResults ? '' : 'hidden'}>
                        {filteredItems.map((item) =>
                            selectedCategory === 'posts' ? (
                                <div key={item._id}>{(item as Posts).title}</div>
                            ) : (
                                <div key={item._id}>{(item as AllUsers).UserName}</div>
                            )
                        )}
                    </div>
                </form>
            </div>
        </>
    )
}

export default Search