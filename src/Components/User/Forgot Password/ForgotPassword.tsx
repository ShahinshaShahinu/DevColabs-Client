
import { useNavigate } from "react-router-dom"
import { ForgotPasswordEmialValidation } from "../../../utils/userValidation/signUpvalidation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';


function ForgotPassword() {
    const [checkEmail,setCheckEmail]=useState(Boolean)
    const [ForgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const Navigate = useNavigate();

    useEffect(() => {
        const Userauth = localStorage.getItem('user')

        if (Userauth) {
            localStorage.removeItem('userId')
            Navigate('/')
        }

    }, []);

    const handleButtonClick = () => {
        // Perform the first action to redirect to the URL
        window.location.href = 'https://mail.google.com/mail/u/0/#inbox';
        

      };


    const ForgetError = (err: string) => toast.error(err, {
        position: "bottom-right"
    })

    const handleForgotPassword = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        const data: any = await ForgotPasswordEmialValidation(ForgotPasswordEmail)
        console.log(data, ' data errorObj');

        if (data?.message) {
            setIsLoading(false);
            const message = data.message
            ForgetError(message)
        }

        if (data === 'success') {
            setIsLoading(true);
            setCheckEmail(true);
            setIsLoading(false);
        }




    }

    return (
        <>
            <div className='relative w-full h-screen bg-white'>
                <div className='p-2 flex justify-center  items-center h-full'>
                    <form onSubmit={handleForgotPassword} className='py-14 max-w-[400px] w-full shadow-2xl border-2 md:max-w-xl mx-auto bg-white p-8'>
                        <h2 className='text-4xl font-bold text-center py-4'>DevColab</h2>

                        <div className='flex flex-col mb-4'>
                            <label>Email</label>
                            <input name="email" type="email" className='border relative bg-gray-100 p-2' value={ForgotPasswordEmail} onChange={(e) => setForgotPasswordEmail(e.target.value)} required />
                        </div>
                        <div className="flex justify-center">
                           {checkEmail==false ?(
                        <button type='submit' className='w-full py-3 mt-8 bg-indigo-600 hover:bg-indigo-500 relative text-white'>Continue</button>) : ( <button onClick={handleButtonClick}
                            className='px-5 py-3 shadow-zinc-950 text-sm font-medium mt-8 bg-blue-700 rounded-lg cursor-pointer focus:ring-blue-300 hover:bg-indigo-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-center text-white'
                          >
                            Check your Email
                          </button>
                          )
                       }  
                        </div>
                        <div className="pt-3">
                            <p className=' text-center mt-8 inline'>Not a member?</p> <p className="inline text-blue-700" onClick={() => { Navigate('/signup') }}>Sign up now</p>
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


           



        </>
    )
}

export default ForgotPassword




    