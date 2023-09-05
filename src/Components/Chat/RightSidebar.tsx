import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

// Define the props for the RightSidebar component
interface RightSidebarProps {
    isVisible: boolean;
    toggleSidebar: () => void;
    selected: any
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isVisible, toggleSidebar, selected }) => {
    // Replace with actual user data
    const user = {
        name: 'John Doe',
        profileImage: 'path_to_profile_image.jpg',
    };

    // Replace with a list of users
    const users = [
        { name: 'User 1', profileImage: 'user1_image.jpg' },
        { name: 'User 2', profileImage: 'user2_image.jpg' },
        { name: 'User 1', profileImage: 'user1_image.jpg' },
        { name: 'User 2', profileImage: 'user2_image.jpg' },
        { name: 'User 1', profileImage: 'user1_image.jpg' },
        { name: 'User 2', profileImage: 'user2_image.jpg' },
        { name: 'User 1', profileImage: 'user1_image.jpg' },
        { name: 'User 2', profileImage: 'user2_image.jpg' },

        // Add more users as needed
    ];
    console.log(selected, 'selectedselected');

    const handleLogout = () => {
        toggleSidebar()
    };

    return (
        <>
            {isVisible == true && (
                <>
                    <div id="drawer-right-example" className="relative bottom-0  right-80 z-50 ml-auto h-full  p-4 overflow-y-auto transition-transform translate-x-full bg-white w-80 dark:bg-gray-200" tabIndex={-1} aria-labelledby="drawer-right-label">
                        <div className='left-0'>
                            <AiOutlineClose onClick={handleLogout} className='cursor-pointer text-lg' />
                        </div>
                        {/* User Profile */}
                        <div className="flex flex-col items-center mb-4">
                            <img src={selected.Image} alt={selected.Name} className="w-20 h-20 rounded-full mb-2" />
                            <p className="text-xl font-semibold">{selected.Name}</p>
                        </div>

                        {selected.CreatedAdmin && (
                            <div className="bg-blue-300 shadow-md rounded-md p-2 flex  items-center">
                                <img src={selected?.CreatedAdmin?.profileImg} alt={selected?.CreatedAdmin?.UserName} className="w-8 h-8 rounded-full mr-2" />
                                <span>{selected?.CreatedAdmin?.UserName} </span> <span className="text-sm  text-gray-600  ml-1">(Admin)</span>
                            </div>
                        )}

                        <hr className="my-4 border-gray-500 border " />
                        {/* List of Users */}
                        <ul className="space-y-2  ">
                            {selected && selected?.userId.map((user: any, index: number) => (
                                <li key={index} className="flex items-center bg-white shadow-md rounded-md  ">
                                    <img src={user.profileImg} alt={user.UserName} className="w-8 h-8 rounded-full mr-2" />
                                    <span>{user.UserName}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </>
            )
            }

        </>
    );
};

export default RightSidebar;
