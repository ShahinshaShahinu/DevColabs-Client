// // import { FcGoogle } from "react-icons/fc";
// import { AiFillFacebook } from "react-icons/ai";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/axios";
import { useDispatch } from 'react-redux';
import { updateUser } from "../../../redux/user/userSlice";
import { Signupvalidation } from '../../../utils/userValidation/signUpvalidation'

import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import { FaHome } from "react-icons/fa";


declare global {
  interface Window {
    google: any; // Declare the 'google' namespace to avoid TypeScript error
  }
}


function Signup() {


  useEffect(() => {
    window.onload = function () {
      // Initialize the Google API client library
      window.google.accounts.id.initialize({
        client_id: '1092413293944-0nma9o1743q1bua00g0o0con09jch7kt.apps.googleusercontent.com',
        callback: setgoogleUser,
      });
      window.google.accounts.id.prompt();
    };
  }, []);


  useEffect(() => {
    const Userauth = localStorage.getItem('user')
    console.log(Userauth, 'user ahsa shahin');

    if (Userauth) {
      Navigate('/')
    }

  }, [])

  const Navigate = useNavigate()
  const dispatch = useDispatch()

  const [user, setUser] = useState({
    UserName: '',
    email: '',
    password: '',
    Confirmpassword: ''

  })

  interface GoogleUser {
    email: string;
    picture: string;
  }


  const setgoogleUser = async (result: GoogleUser) => {
    console.log(result);
    try {
      const GoogleAccountUser = {
        UserName: result.email.split('@')[0],
        email: result.email,
        password: '@DevCoGoogle@123',
        profileImg: result.picture,
        isGoogle: true
      }

      if (result) {

        console.log(GoogleAccountUser);


        const { data } = await api.post('/signup', { ...GoogleAccountUser }, { withCredentials: true });
        console.log(data)
        console.log('google authentication done');

        if (data?.create) {
          dispatch(updateUser({ username: GoogleAccountUser.UserName, Image: GoogleAccountUser.profileImg, userEmail: GoogleAccountUser.email }))

          Navigate('/login')
        }

        if (data?.message) {
          const errorMessage = data.message;
          signupError(errorMessage)
          console.log(signupError);

        }
      }
    } catch (error: any) {
      console.log(error);
      const message = error.message;
      signupError(message)
      console.log('error shahinsha');
    }



  }

  interface Errors {
    UserName: string;
    email: string;
    password: string;
    Confirmpassword: string;
  }
  const signupError = (err: any) => toast.error(err, {
    position: "bottom-right"
  })


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault()
    try {

      const errors: Errors | 'success' = Signupvalidation(user);

      if (errors !== 'success') {
        for (const key in errors) {
          if (errors.hasOwnProperty(key as keyof Errors) && errors[key as keyof Errors]) {
            signupError(errors[key as keyof Errors]);
          }
        }
      } else {

        const { data } = await api.post('/signup', { ...user }, { withCredentials: true })
        console.log(data);
        if (data?.create) {
          dispatch(updateUser({ userId: data.user._id, username: data.user.UserName, image: data.user.profileImg, userEmail: data.user.email }))
          Navigate('/login');
        }
        if (data?.message) {
          const message = data.message;
          signupError(message)
        }

      }



    }

    catch (error: any) {
      console.log(error);
      const message = error.message;
      signupError(message)
      console.log('error shahinsha');


    }
  }





  return (
    <>
      <div className="grid grid-cols-1   sm:grid-cols-2 h-screen w-full">
        <div className="hidden sm:block  ml-32">

          <div className="flex relative z-10 top-16 justify-center">
            <h1 className=" font-serif text-5xl relative">DevColab</h1>
          </div>

          <div className="flex relative bottom-11 items-center h-full ">
            {/* <h2 className="text-4xl font-semibold  py-6">DevColab</h2> */}

            <img src="https://www.mobinius.com/wp-content/uploads/2020/04/Reactjs-banner-img.png" className=" object-cover" alt="Image" />




          </div>
          <div className="flex justify-center lg:bottom-28  md:bottom-52 sm:bottom-64  relative  ">
            <h1 className="lg:font-serif opacity-80 lg:text-xl  md:text-xs sm:text-xs relative font-semibold">
              Get&nbsp;Ready&nbsp;For&nbsp;Sign&nbsp;Up
            </h1>
          </div>
        </div>

        <div className="bg-white mt-10  lg:right-12 relative mx-0 flex-col justify-center">
          <form onSubmit={handleSubmit}
            className="max-w-[500px] drop-shadow-2xl  w-full mx-auto bg-white p-4  border-2 border-gray-400 border-opacity-50 rounded-[1rem]" action="">

            <h2 className="text-2xl font-bold text-center py-6">SignUp</h2>

            <div className="flex  flex-col p-4 mb-4">
              <label>UserName</label>
              <input onChange={(e) => setUser({ ...user, UserName: e.target.value })} name="UserName" className="border hover:shadow-2xl   relative bg-gray-100 p-2" type="text" required />
            </div>
            <div className="flex flex-col p-4 mb-4">
              <label>YourEmail</label>
              <input onChange={(e) => setUser({ ...user, email: e.target.value })} name="email" className="border hover:shadow-2xl  relative bg-gray-100 p-2" type="email" required />
            </div>

            <div className="flex flex-col sm:flex-row p-4 mb-4">
              <div className="flex flex-col mb-4 sm:mr-8">
                <label>Password</label>
                <input
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  name="password"
                  className="border hover:shadow-2xl relative bg-gray-100 p-2"
                  type="password"
                />
              </div >
              <div className="p-3">

              </div>
              <div className="flex flex-col ">
                <label>Confirm password</label>
                <input
                  onChange={(e) => setUser({ ...user, Confirmpassword: e.target.value })}
                  name="Confirmpassword"
                  className="border hover:shadow-2xl relative bg-gray-100 p-2"
                  type="password"
                />
              </div>
            </div>

            <div className="flex px-4">
              <button type="submit" className="w-full  py-3 mt-8 bottom-5 bg-indigo-600 hover:bg-indigo-500 relative text-white">
                Sign Up
              </button>
            </div>


            <div className="flex justify-center py-4">

              <GoogleLogin size="medium"
                onSuccess={(credentialResponse: any) => {
                  window.google.accounts.id.prompt();

                  setgoogleUser(jwt_decode(credentialResponse.credential));
                }}
                onError={() => {
                  console.log('Login Failed');
                }}

              />


              <ToastContainer />
            </div>
            <div className="flex justify-between items-center">
              <div className="px-3">
                <p className="inline-block ">Already have an account </p> <a className=" cursor-pointer  text-blue-700" onClick={() => Navigate('/login')}>? Log in now</a>
              </div>

              <button onClick={() => Navigate("/")} type="button" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 relative px-4 rounded-full">
                <FaHome className="inline-block w-5 h-5 mr-1" /> Home
              </button>
            </div>
          </form>

        </div>

      </div>


    </>
  );
}

export default Signup;












{/* <div className="relative w-full h-screen bg-zinc-900/90">
        <img
          className="absolute w-full h-full object-cover mix-blend-overlay"
          src=""
          alt="/"
        />

        <div className="flex justify-center items-center h-full">
          <form className="max-w-[400px] w-full mx-auto bg-white p-8">
            <h2 className="text-4xl font-bold text-center py-4">BRAND.</h2>
            <div className="flex justify-between py-8">
              <p className="border shadow-lg hover:shadow-xl px-6 py-2 relative flex items-center">
                <AiFillFacebook className="mr-2" /> Facebook
              </p>
              <p className="border shadow-lg hover:shadow-xl px-6 py-2 relative flex items-center">
                <FcGoogle className="mr-2" /> Google
              </p>
            </div>
            <div className="flex flex-col mb-4">
              <label>Username</label>
              <input className="border relative bg-gray-100 p-2" type="text" />
            </div>
            <div className="flex flex-col ">
              <label>Password</label>
              <input
                className="border relative bg-gray-100 p-2"
                type="password"
              />
            </div>
            <button className="w-full py-3 mt-8 bg-indigo-600 hover:bg-indigo-500 relative text-white">
              Sign In
            </button>
            <p className="flex items-center mt-2">
              <input className="mr-2" type="checkbox" />
              Remember Me
            </p>
            <p className="text-center mt-8">Not a member? Sign up now</p>
          </form>
        </div>
      </div> */}