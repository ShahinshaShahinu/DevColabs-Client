import { useEffect, useState } from "react";
import { JoinCommunity, RcomendedCommunities } from "../../../services/API functions/CommunityChatApi";
import { CommunityUser } from "../../../../../DevColab-Server/src/domain/models/Community";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface fetch {
    datas: boolean
    loginModalOpen:(data:boolean)=>void
}
interface UserCount {
    userIdCount: number
}

function CommunitySection({ datas,loginModalOpen }: fetch) {
    const Navigate = useNavigate();
    const { userId } = useSelector((state: any) => state.user);
    const [isCommunities, setCommunities] = useState<CommunityUser[]>([])
    const [isUserIdCounts, setUsersCount] = useState<UserCount[]>([])
    useEffect(() => {
        const fetchChats = async () => {
            const fetchedCommunities = await RcomendedCommunities();
            setCommunities(fetchedCommunities?.data?.[0]);
            setUsersCount(fetchedCommunities?.data?.[1])
            console.log(fetchedCommunities
                , 'RcomendedCommunities');

        }
        fetchChats();
    }, [datas]);
    const Joining = async (communityId: string, group: any) => {
        const ress = await JoinCommunity(communityId)
        if (ress) Navigate('/Community', { state: group })
    }


    return (
        <>
            <div>
                <div className="  xl:w-[16.5rem] 2xl:w-[17rem] hidden sm:block ">
                    <div className="fixed right-0 h-full lg:w-60 max-lg:w-80 xl:w-96 xl:96  2xl:w-[24rem] md:w-[13rem] overflow-hidden lg:mx-5   xl:mx-14 md:mx-28 z-10">
                        <div className="h-full  
                   ">
                            <nav className="flex flex-col top-44 relative bg-white border-2 p-2 pr-2 justify-around rounded-lg shadow-lg">
                                <h2 className="text-xl font-medium ">{userId ? ('Communities that may interest you') : ('Communities')}</h2>
                                {isCommunities && isCommunities?.map((group, index) => (
                                    <div key={index}>
                                        <hr className="my-4 border-t border-gray-300" />
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                                <img src={group.Image} alt={group.Name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-md font-semibold">{group.Name}</h3>
                                                {isUserIdCounts && isUserIdCounts[index] && (
                                                    <div className=" text-gray-600 text-sm">
                                                        {isUserIdCounts[index]?.userIdCount} Members
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex pr-2">
                                                <a onClick={() => { userId ? Joining(group?._id, group) : loginModalOpen(true) }}
                                                    className="inline-flex  cursor-pointer items-center px-3 py-1 text-sm font-medium text-white bg-blue-700 rounded-lg ml-auto hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                    Join
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CommunitySection