import { useEffect, useState } from "react";
import { followers } from "../Home/LikeSection";
import { Follow, UnFollow, UserFolowers } from "../../../services/API functions/UserApi";
import { useSelector } from "react-redux";


function FollowUnFollow({ IdofUser }: { IdofUser: string }) {
    const [followedUsers, setFollowedUsers] = useState<followers[]>([]);
    const { userId } = useSelector((state: any) => state.user);
    useEffect(() => {
        const fetchUser = async () => {
            const data = await UserFolowers();
            setFollowedUsers(data?.data?.Userfollowers);
        }
        fetchUser();
    }, []);
    const Folllowing = async (FollowId: string) => {
        const res = await Follow(FollowId);
        setFollowedUsers(res?.data?.Userfollowers);
        const data = await UserFolowers();
        setFollowedUsers(data?.data?.Userfollowers);

    }

    const UnFolllowing = async (UnFollowId: string) => {
        const res = await UnFollow(UnFollowId);
        setFollowedUsers(res?.data?.Userfollowers);
        const data = await UserFolowers();
        setFollowedUsers(data?.data?.Userfollowers);
    }
    return (
        <>
            <div className="flex relative">
                {followedUsers?.some((followedUser) => followedUser?._id === IdofUser) ? (
                    <button
                        onClick={() => UnFolllowing(IdofUser)}
                        type="button"
                        className="bg-rose-500 text-white px-3 py-1 rounded-md hover:bg-rose-700 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Unfollow
                    </button>
                ) : (
                    <>
                        {IdofUser === userId ? (
                            <h1 className="text-2xl font-bold text-green-600 py-1 px-6">You</h1>
                        ) : (
                            <button
                                onClick={() => Folllowing(IdofUser)}
                                type="button"
                                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Follow
                            </button>
                        )}

                    </>
                )}
            </div>
        </>
    )
}

export default FollowUnFollow