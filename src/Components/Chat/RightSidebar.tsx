import React from 'react';
import { MdClose, MdVerifiedUser } from 'react-icons/md';

// Define the props for the RightSidebar component
interface RightSidebarPropsdata {
    isVisible: boolean;
    toggleSidebar: () => void;
    selected: any
}

const RightSidebar: React.FC<RightSidebarPropsdata> = ({ isVisible, toggleSidebar, selected }: RightSidebarPropsdata) => {
   


    const handleLogout = () => {
        toggleSidebar()
    };

    return (
        <>
            {isVisible == true && (
                <>
                    <div
                        id="drawer-right-example"
                        className="absolute top-32 right-4 z-10 flex items-center justify-end self-end bg-transparent bg-opacity-50"
                        tabIndex={-1}
                        aria-labelledby="drawer-right-label"
                    >
                        <div className="relative w-80  bg-white rounded-lg p-4 border-2 shadow-md">
                            <div className="absolute top-2">
                                <button
                                    onClick={handleLogout}
                                    className="cursor-pointer bg-gray-200 rounded-full p-2 transition-transform transform hover:scale-110"
                                >
                                    <MdClose className="text-gray-600 text-lg" />
                                </button>
                            </div>


                            <div className="flex flex-col items-center mb-4">
                                <img
                                    src={selected?.Image}
                                    alt={selected?.Name}
                                    className="w-20 h-20 rounded-full border-2 border-gray-600 shadow-md hover:shadow-md transform hover:scale-105 transition-transform duration-300 mb-2"
                                />
                                <p className="text-xl font-semibold">{selected?.Name}</p>
                            </div>
                            {selected?.CreatedAdmin && (
                                <div className="bg-blue-200 shadow-md rounded-md p-2 flex items-center">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                                            <img
                                                src={selected?.CreatedAdmin?.profileImg}
                                                alt={selected?.CreatedAdmin?.UserName}
                                                className="w-8 h-8 rounded-full"
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <span className="text-lg font-semibold c text-gray-800">{selected?.CreatedAdmin?.UserName}</span>
                                            <div className="flex items-center mt-1">
                                                <span className="text-sm text-gray-600">(Admin)</span>
                                                <MdVerifiedUser className="h-4 w-4 ml-1 text-blue-700" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <hr className="my-4 border-gray-500 border " />
                            <ul className="space-y-2 overflow-y-auto max-h-80">
                                {selected &&
                                    selected?.userId.map((user: any, index: number) => (<>
                                        <li
                                            key={index}
                                            className="flex items-center bg-white shadow-md rounded-md"
                                        >
                                            <img
                                                src={user?.profileImg}
                                                alt={user?.UserName}
                                                className="w-8 h-8 rounded-full mr-2"
                                            />
                                            <span>{user?.UserName}</span>
                                        </li>
                                    </>
                                    ))}
                            </ul>
                        </div>
                    </div>
                </>
            )
            }

        </>
    );
};

export default RightSidebar;
