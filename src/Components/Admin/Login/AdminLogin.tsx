import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginValidation } from "../../../utils/adminValidation/adminLoginValidation";
import { ToastContainer, toast } from "react-toastify";
import { api } from "../../../services/axios";
import { updateAdmin } from "../../../redux/admin/adminSlice";


function AdminLogin() {
    const [admin, setAdmin] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate();
    const dispatch = useDispatch();


    useEffect(() => {
        const Userauth = localStorage.getItem('admin');
        if (Userauth) {
            navigate('/admin/Dashboard')

        }

    }, []);

    const LoginERror = (err: any) => toast.error(err, {
        position: "bottom-right"
    })


    interface Errors {
        email: string;
        password: string;
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
        e.preventDefault();

        try {

            const errors: Errors | 'success' = LoginValidation(admin);
            if (errors !== 'success') {
                for (const key in errors) {
                    if (errors.hasOwnProperty(key as keyof Errors) && errors[key as keyof Errors]) {
                        LoginERror(errors[key as keyof Errors]);
                    }
                }
            } else {

                const { data } = await api.post("/admin/login/", { ...admin }, { withCredentials: true });
                console.log(data);

                if (data) {
                    if (data.accessTokenAdmin) {

                        localStorage.setItem('admin', data.accessTokenAdmin);
                        dispatch(updateAdmin({ adminId: data.admin._id, adminEmail: data.admin.email }))
                        navigate('/admin/Dashboard');

                    }

                }
                if (data.message) {
                    const message = data.message;

                    LoginERror(message)
                }

            }


        } catch (error) {
            LoginERror(error)
        }
    }



    return (
        <>
            <div>

                <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
                    <div className="hidden sm:block  ml-32">
                        <div className="flex items-center h-full ">
                            <img className=" object-cover" src="https://img.freepik.com/free-vector/telecommuting_23-2148491068.jpg?w=996&t=st=1690608150~exp=1690608750~hmac=47c3358cde21d6b51834765c7cc7e3c4f575159de326080fcc342610797c0ae4" alt="Image" />
                        </div>
                    </div>


                    <div className="bg-white pt-28 flex-col justify-center">
                        <form onSubmit={handleSubmit}

                            className="max-w-[500px] w-full mx-auto bg-white p-4  border-2 border-gray-400 border-opacity-50 rounded-[1rem]"
                            action=""
                        >
                            <h2 className="text-4xl font-semibold  py-6">DevColab</h2>

                            <h2 className="text-4xl font-semibold  py-6">Log In</h2>

                            <div className="flex flex-col p-4 mb-4">
                                <label>YourEmail</label>
                                <input
                                    onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
                                    name="email"
                                    className="border relative bg-gray-100  p-2"
                                    type="email"
                                    required
                                />
                            </div>

                            <div className="flex flex-col p-4 ">
                                <label>Password</label>
                                <input
                                    onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
                                    name="password"
                                    className="border relative bg-gray-100 p-2"
                                    type="password" required
                                />
                            </div>
                            <div className="flex">
                                <button
                                    type="submit"
                                    className="w-full py-3 mt-8 bg-indigo-600 hover:bg-indigo-500 relative text-white"
                                >
                                   Log In
                                </button>
                            </div>

                            <div className="flex justify-center py-8">

                            </div>

                        </form>

                    </div>
                    <ToastContainer />
                </div>
            </div>
        </>
    )
}

export default AdminLogin























{/* <div>

                <div className="grid grid-cols-1  sm:grid-cols-2 h-screen w-full">
                    <div className="flex items-center  sm:block ">
                        <img className="flex w-full h-40 object-cover " src="" alt="" />
                    </div>
                    <div className="bg-gray-100 items-center justify-center flex-col justify-center">
                        <form

                            className="max-w-[400px] w-full mx-auto bg-white p-4"
                            action=""
                        >
                            <h2 className="text-4xl font-bold text-center py-6">Log In</h2>

                            <div className="flex flex-col mb-4">
                                <label>YourEmail</label>
                                <input

                                    name="email"
                                    className="border relative bg-gray-100 p-2"
                                    type="email"
                                />
                            </div>

                            <div className="flex flex-col ">
                                <label>Password</label>
                                <input

                                    name="password"
                                    className="border relative bg-gray-100 p-2"
                                    type="password"
                                />
                            </div>
                            <div className="flex justify-end">
                                <p className="text-blue-700 text-lg pt-2 font-cursor-pointer" >Forgot password?</p>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 mt-8 bg-indigo-600 hover:bg-indigo-500 relative text-white"
                            >
                                Sign Up
                            </button>

                            <div className="flex items-center pt-7 ">
                                <div className="flex-grow border-t border-gray-400"></div>
                                <div className="px-4 text-gray-500">Or</div>
                                <div className="flex-grow border-t border-gray-400"></div>
                            </div>

                            <div className="flex justify-center py-8">

                            </div>
                            <div>
                                <p className="inline-block"> Don’t have an account </p> <a className="cursor-pointer text-blue-700" >? SignUp </a>
                            </div>
                        </form>

                    </div>

                </div>
            </div> */}