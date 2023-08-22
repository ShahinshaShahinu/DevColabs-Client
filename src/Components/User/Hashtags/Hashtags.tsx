import { FormEvent, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify"
import { api } from "../../../services/axios";
import { useNavigate } from "react-router-dom";

interface IHashtag {
    _id: string,
    Hashtag: string;
    createdAt: string;
}

function Hashtags() {

    const [fetchHashTag, setfetchHashTag] = useState<IHashtag[]>([]);
    const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
    const [formError, setFormError] = useState<string | null>(null);
    const navigate = useNavigate()


    useEffect(() => {
        const fetchHashtags = async () => {

            const Hashtags = await api.get('/admin/HashTagManageMent', { withCredentials: true });
            setfetchHashTag(Hashtags.data)
        }
        fetchHashtags()
    }, [fetchHashTag]);

    const handleCheckboxChange = (tagId: string) => {
        if (selectedHashtags.includes(tagId)) {
            setSelectedHashtags(selectedHashtags.filter(id => id !== tagId));
        } else {
            setSelectedHashtags([...selectedHashtags, tagId]);
        }
    };






    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (selectedHashtags.length === 0) {
                setFormError("Please select at least one hashtag.");
                return;
            } else {

                const UserHashtag = await api.post('/selectedHashtags', { ...selectedHashtags })

                console.log(UserHashtag.data.updated === true); {
                    navigate('/')
                }


            }




        } catch (error) {



        }

    }



    return (
        <>

            <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className=" p-1 rounded-lg w-[50rem] left-10 relative shadow-lg  max-w-2xl max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-">
                        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Add Hashtag
                            </h3>

                          
                                <button
                                onClick={() => navigate('/')}
                                type="button" className="text-white bg-gray-700 hover:bg-gray-500 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-700 dark:hover:bg-gray-700focus:outline-none dark:focus:ring-blue-800">
                                 Skip</button>

                        </div>
                        <form onSubmit={submitForm}
                            className="p-10 relative">
                            <div className="grid pb-10  md:grid-cols-2 p-4 md:gap-6">
                                {fetchHashTag && fetchHashTag.map((tag, index) => (
                                    <div className="flex items-center bg-gray-200 p-2 rounded-md space-x-2" key={index}>
                                        <label className="inline-flex items-center">
                                            <input
                                                onChange={() => handleCheckboxChange(tag?._id)}
                                                type="checkbox" className="form-checkbox  cursor-pointer text-green-500" />
                                            <span className="ml-2 text-black">{tag?.Hashtag}</span>
                                        </label>
                                    </div>
                                ))}
                                {formError && <p className="text-red-500">{formError}</p>}
                            </div>
                            <div className="pl-4">
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>

                            </div>
                        </form>
                    </div>
                    <ToastContainer />
                </div>
            </div>

            {/* )} */}
        </>
    )
}

export default Hashtags