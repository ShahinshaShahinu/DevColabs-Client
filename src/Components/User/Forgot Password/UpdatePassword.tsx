
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { UpdatePassWord } from '../../../utils/userValidation/signUpvalidation';
import React, { useEffect, useState } from 'react';
import { api } from '../../../services/axios';
import { useLocation } from 'react-router-dom';

function UpdatePassword() {
    const userId = localStorage.getItem('userId');
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);




    useEffect(() => {
        try {

            const Userauth = localStorage.getItem('user');
            const localStorageVerificationToken = localStorage.getItem('verificationToken');
            console.log(localStorageVerificationToken, 'local');
            if (localStorageVerificationToken) {
                navigate('/UpdatePassWord')
            }
            const verificationToken: string = location.state?.verificationToken;

            console.log(verificationToken, 'verificationToken');
            if (verificationToken) {
                localStorage.setItem('verificationToken', verificationToken);
                navigate('/UpdatePassWord')
            }



            console.log(localStorageVerificationToken, 'local');
            if (localStorageVerificationToken) {
                navigate('/UpdatePassWord')
            } else {
                navigate('/')
            }
            if (Userauth) {
                localStorage.removeItem('userId');
                navigate('/');
            }




            setTimeout(() => {
                localStorage.removeItem('verificationToken');
                navigate('/')
                console.log("5 minutes have passed!");
            }, 5 * 60 * 1000);


        } catch (error) {
            console.log(error);


            navigate('/UpdatePassWord')



        }


    }, [navigate]);










    const [updatePassword, setUpdatePassword] = useState({
        userId: '',
        password: '',
        Confirmpassword: ''
    })





    const UpdatePasswordError = (err: any) => toast.error(err, {
        position: "bottom-right"
    })



    const handlUpdatePassWord = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {

        e.preventDefault();
        const errors = await UpdatePassWord(updatePassword);


        if (userId != null) updatePassword.userId = userId

        if (errors != 'success') {
            const err = (errors?.Confirmpassword || errors.password || 'unknown error')
            UpdatePasswordError(err)
        }

        if (errors === 'success') {
            console.log(errors);
            setIsLoading(true);
            const response = await api.post('/UpdatePassWord', { ...updatePassword }, { withCredentials: true });
            console.log(response);

            const UpdateResponse = response.data.response;

            if (UpdateResponse === 'success') {
                setIsLoading(false);
                navigate('/login');
            }
        }
    }




    return (
        <div className='relative w-full h-screen bg-white'>
            <div className='p-2 flex justify-center  items-center h-full'>
                <form onSubmit={handlUpdatePassWord} className='py-14 max-w-[400px] w-full shadow-2xl border-2 md:max-w-xl mx-auto bg-white p-8'>
                    <h2 className='text-4xl font-bold text-center relative  py-4'>DevColab</h2>

                    <div className='flex flex-col mb-4'>
                        <label>Password</label>
                        <input name="password" onChange={(e) => setUpdatePassword({ ...updatePassword, password: e.target.value })} type="password" className='border relative bg-gray-100 p-2' required />
                    </div>
                    <div className='flex flex-col mb-4'>
                        <label>Confirm Password</label>
                        <input name="Confirmpassword" onChange={(e) => setUpdatePassword({ ...updatePassword, Confirmpassword: e.target.value })} type="password" className='border relative bg-gray-100 p-2' required />
                    </div>

                    <button type='submit' className='w-full py-3 mt-8 bg-indigo-600 hover:bg-indigo-500 relative text-white'>Continue</button>
                    <div className="pt-3">
                        <p className=' text-center mt-8 inline'>Not a member?</p> <p className="inline text-blue-700" onClick={() => { navigate('/signup') }}>Sign up now</p>
                    </div>
                </form>
                <ToastContainer />


                {isLoading && (
                    <div
                        id="loadingModal"
                        aria-hidden="true"
                        className="fixed top-0 left-0 right-0 z-50 w-full h-screen flex items-center justify-center bg-gray-700 bg-opacity-50"
                    >

                        <div role="status" className="flex items-center justify-center mb-4">
                            <svg
                                aria-hidden="true"
                                className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>

                    </div>
                )}



            </div>
        </div>
    )
}

export default UpdatePassword