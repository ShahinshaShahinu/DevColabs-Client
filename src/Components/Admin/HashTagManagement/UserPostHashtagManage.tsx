import { useEffect, useState } from "react"
import { DeletingPostHashtag, FindHomePost } from "../../../services/API functions/UserApi";
import { CIHashtag } from "../../../utils/interfaceModel/PostsInfra";
import ButtonLoadingLoader from "../../User/isLoading/buttonLoadingLoader";






function UserPostHashtagManage() {
    const [fetchHashTag, setfetchHashTag] = useState<CIHashtag[]>([])
    const [isLoading, setisLoading] = useState(false)
    useEffect(() => {
        const fetch = async () => {
            const data = await FindHomePost();
            setfetchHashTag(data?.data)
        }
        fetch();
    }, [isLoading])

    const deleteHahstags = async (postId: string, hashtag: string) => {
        try {
            setisLoading(true); 
            await DeletingPostHashtag(postId, hashtag);
            setTimeout(() => {
                setisLoading(false)
            }, 500);
        } catch (error) {
            console.log(error);

        }
    }


    return (
        <>
            <div className="flex-1 overflow-x-auto ">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>

                            <th scope="col" className="px-6 py-3">
                                # HashTags
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Delete
                            </th>
                        </tr>
                    </thead>

                    <tbody>



                        {fetchHashTag && fetchHashTag.map((tag, index) => (
                            tag?.HashTag?.map((tags: string, index: number) => (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">
                                        {tags}
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* {!isLoading ? (
                                            <div className="absolute " >
                                                <button 
                                                    type="button" className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
                                                    <div className="left-1 relative">
                                                <ButtonLoadingLoader />
                                                   
                                                    </div>
                                                </button>
                                            </div>
                                        ):( */}
                                        <button onClick={() => tag?._id && deleteHahstags(tag?._id, tags)}
                                            type="button" className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
                                            Delete
                                        </button>
                                        {/* )} */}
                                    </td>
                                </tr>
                            ))
                        ))}



                    </tbody>
                </table>

            </div>




        </>
    )
}

export default UserPostHashtagManage