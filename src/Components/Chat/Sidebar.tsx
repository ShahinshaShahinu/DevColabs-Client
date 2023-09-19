import { useEffect, useState } from "react";
import { AlreadyexistingCommunity, CreateCommunity } from "../../services/API functions/CommunityChatApi";
import { format } from "date-fns";
import { uploadImage } from "../../services/Cloudinary/Cloud";
import { AllUsers } from "../../utils/interfaceModel/comment";
import { GetUsers } from "../../services/API functions/UserApi";
import { useSelector } from "react-redux";
import { MuiChipsInput } from "mui-chips-input";
import Loading from "../User/isLoading/Loading";
interface datas {
    data?: string; // You might want to adjust the type as needed
    // Add other properties if applicable
  }
  interface HashTag {
    HshTagId: {
        Hashtag: string;
    };

}

  interface SidebarProps {
    sendDataToParent: (data: boolean) => void;
  }
function Sidebar({sendDataToParent}:SidebarProps) {


    const [communityName, setCommunityName] = useState('');
    const { userId } = useSelector((state: any) => state?.user);
    const [filteredItemsp, setFilteredItemsp] = useState<(AllUsers)[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [Allusers, setAllusers] = useState<AllUsers[]>([]);
    const [addUser, setAddUser] = useState<Set<AllUsers>>(new Set());
    const [ErrorMsg , setErrorMsg] = useState('');
    const [HashTag, setHashTag] = useState<string[]>([]);
    const [isLoading,setisLoading] =useState(false);
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000); 

        return () => {
            clearInterval(intervalId);
        };
    }, []);
    const CurrentDAte = format(currentDate, "d MMMM yyyy hh:mm a");


    const handleChange = (newChips: string[]) => {
        
        const hasSpaces = newChips.some(tag => /\s/.test(tag));
      
        if (hasSpaces) {
          setErrorMsg('Spaces are not allowed in tags');
        } else {
            const modifiedTags = newChips.map(tag => (tag.startsWith('#') ? tag : `#${tag.trim()}`));
            setHashTag(modifiedTags);
          setErrorMsg('');
        }
      };
      


   
    const handleCommunitySubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

     
        let CommunityImgUrl
        const AlluserId = [...addUser].map((user) => user?._id).filter((id) => id) as string[]
        if (image && communityName.trim() != '' && AlluserId.length != 0 && HashTag.length != 0) {
            setisLoading(true)
            const data: datas | unknown = await AlreadyexistingCommunity(communityName);
            if (data && (data as datas)?.data === 'error') {
                console.log('efff errror ');

                setErrorMsg('A community with this name already exists')
            } else {

                CommunityImgUrl = await uploadImage(image);
                const result = await CreateCommunity(AlluserId, communityName, CommunityImgUrl, HashTag, CurrentDAte);
                if (result) {
                    sendDataToParent(false);
                    setisLoading(false)
                }
            }
        }
        else {
            if (image == null) {
                setErrorMsg('add Community Image');
                setFilteredItemsp([]);
            } if (AlluserId.length == 0) {
                setErrorMsg('add Community Members');
            }
            if(HashTag.length === 0){
                setErrorMsg('add Community HashTags');
            }

        }
        if (image || communityName.trim() === '') {
            if (image === null) {
                setErrorMsg('add Community Image');
                setFilteredItemsp([]);
            } else {
                if (communityName.trim() === '') {
                    setErrorMsg('Enter Community Name');
                    setFilteredItemsp([]); setAddUser(new Set());
                }
            }
        }



    };


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedImage = event.target.files?.[0];
        setImage(selectedImage || null);
    };
    let newFilteredItems: (AllUsers)[] = [];

    useEffect(() => {
        const fetchChats = async () => {
            const allusers = await GetUsers()
            setAllusers(allusers?.data);
        }
        fetchChats();
    }, [setErrorMsg])
    useEffect(() => {
        if (searchTerm.trim() != '') {

            newFilteredItems = Allusers.filter(user => {

                const isUserNameMatch = user?.UserName?.trim().toLowerCase().includes(searchTerm.trim().toLowerCase());
                const isHashTagMatch = user?.UserHshTag?.SelectedTags?.some((tag: HashTag) =>
                    tag?.HshTagId?.Hashtag?.trim().toLowerCase().includes(searchTerm.trim().toLowerCase())
                );
                return user._id !== userId && (isUserNameMatch || isHashTagMatch);
            });
            setFilteredItemsp(newFilteredItems);
            setErrorMsg('')
        } else {
            setFilteredItemsp([]);
            setErrorMsg('')
        }
    }, [searchTerm,setErrorMsg]);




    return (
        <>

            {isLoading && <div className="z-40 absolute w-full h-screen bottom-0 left-0  ">
                <Loading />
            </div>
            }

            {/* <LoaderAbsolute /> */}


            <div className="bg-white p-4  overflow-auto h-full bottom-1  relative">
                <form onSubmit={handleCommunitySubmit}>
                    <div className="mb-4">

                        <div className="relative w-20 h-20 rounded-full mx-auto overflow-hidden">
                            <img
                                src={image ? URL.createObjectURL(image) : 'community-profile-image.jpg'}
                                alt="Community Profile"
                                className="w-full h-full object-cover"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute z-20 bottom-0 right-0 opacity-0"
                                onChange={handleImageChange}
                            />
                            <label
                                className="absolute bottom-0 right-0 bg-blue-200 text-blue-700 px-2 py-1 rounded cursor-pointer"
                                htmlFor="imageInput"
                            >

                                <i className="fas  fa-edit"></i>

                            </label>
                        </div>
                        <div className="flex justify-center pt-3 text-red-700 font-semibold">
                            <p className="self-center">{ErrorMsg === 'add Community Image' && ErrorMsg}</p>
                        </div>
                    </div>

                    <div className="mb-4 z-10 relative">
                        <label htmlFor="communityName" className="block font-semibold mb-1">Community Name</label>
                        <input
                            onChange={(e) => { setCommunityName(e.target?.value), setErrorMsg('') }}
                            type="text"
                            id="communityName"
                            className="w-full px-2 py-1 border rounded"
                            placeholder="Enter community name"
                        />
                        <div className="flex justify-center pt-1 text-red-700 font-semibold">
                            <p className="self-center">{ErrorMsg === 'Enter Community Name' && ErrorMsg}{ErrorMsg === 'A community with this name already exists' && ErrorMsg}</p></div>
                    </div>
                    <MuiChipsInput value={HashTag} className=" w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-32 xl:max-w-xl" onChange={handleChange} id="" label="HashTag" />
                    <div className=" justify-center relative  flex">
                        <p className="text-red-700 font-semibold">{ErrorMsg === 'add Community HashTags' && ErrorMsg}{ErrorMsg === 'Spaces are not allowed in tags' && ErrorMsg}</p>
                    </div>
         
          
                    <div className="flex mb-4 -space-x-4 ">
                        <div className="flex m-2">
                            {addUser &&
                                [...addUser].map((selecteduser: AllUsers, index: number) => (
                                    <div key={index}>
                                        <div key={index}>
                                            <img
                                                src={selecteduser?.profileImg
                                                }
                                                alt={selecteduser?.profileImg
                                                }
                                                className="w-8 h-8 border-2 border-white rounded-full dark:border-gray-800"
                                            />
                                        </div>

                                    </div>
                                ))}
                        </div>
                    </div>
                   
                    <div className="mb-4">
                        <label htmlFor="guests" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Invite guests</label>
                        <div className="relative">
                            <input onChange={(e) => setSearchTerm(e.target.value)}
                                type="search" id="guests" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Add guest " />

                        </div>
                        <div className="flex justify-center pt-2  text-red-700 font-semibold">
                            <p className="self-center">{ErrorMsg === 'add Community Members' && ErrorMsg}</p>
                        </div>
                        <div className="mb-4 flex justify-end mr-3">
                            <button type="submit" className="bg-green-400  text-black-700 px-2  py-1 top-2 relative rounded">
                                Create
                            </button>
                        </div>

                    </div>
                 

                    <div className="space-y-2 top-1 my-5 relative">
                        {filteredItemsp.length > 0 &&
                            filteredItemsp.map((user, index) => (
                                <li
                                    key={index}
                                    className={`p-2 flex rounded-lg cursor-pointer ${user?._id ? 'bg-blue-200' : ''}`}
                                    onClick={() => {
                                        console.log(user, 'log chat');
                                    }}
                                >
                                    {filteredItemsp.length > 0 && (
                                        <>
                                            <img src={user?.profileImg} alt={user?.profileImg} className="w-8 h-8 rounded-full mr-2" />
                                            {user?.UserName}
                                        </>
                                    )}
                                    <a
                                        onClick={() => setAddUser((prevSet) => {
                                            const newSet = new Set(prevSet);
                                            newSet.add(user);
                                            return newSet;
                                        })}
                                        type="button"
                                        className="inline-flex  cursor-pointer items-center px-3 py-1 text-sm font-medium text-white bg-blue-700 rounded-lg ml-auto hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        <svg className="w-3 h-3 mr-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                            <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z" />
                                        </svg>
                                        Add
                                    </a>
                                </li>
                            ))}
                    </div>


                          
          
                </form>
            </div>


        </>
    )
}

export default Sidebar




// <div className="mb-4">
// <label htmlFor="hashtags" className="block font-semibold mb-1">Hashtags</label>
// <div className="flex">
//     <input
        
//         type="text"
//         id="hashtags"
//         className="flex-grow px-2 py-1 border rounded"
//         placeholder="Enter hashtags"
//     />
//     <button className="ml-2 bg-blue-200 text-blue-700 px-2 py-1 rounded">Add</button>
// </div>
// </div>