import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { api } from "../../../services/axios";
import { updateUser } from "../../../redux/user/userSlice";
import { LoginValidation } from "../../../utils/userValidation/signUpvalidation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { FaHome } from "react-icons/fa";

function login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const Userauth = localStorage.getItem("user");
    if (Userauth) {
      navigate("/");
    } else {
      localStorage.removeItem('user')
      dispatch(updateUser({}));
      googleLogout();
    }
  }, []);




  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const LoginERror = (err: any) =>
    toast.error(err, {
      position: "bottom-right",
    });

  interface Errors {
    email: string;
    password: string;
    Confirmpassword: string;
  }
  interface GoogleautLogin {
    email: string;
    picture: string;
  }

  const GoogleauthLogin = async (result: GoogleautLogin) => {
    try {
      console.log('log time');

      const loginUser = {
        email: result.email,
        password: import.meta.env.VITE_GOOGLE_AUTH_PASSWORD,
      };



      const { data } = await api.post("/login", { ...loginUser }, { withCredentials: true });


      if (data?.Blocked) {
        const message = data.Blocked;
        LoginERror(message);
      }
      if (data?.exist) {

        if (data?.Hashtag?.length === 0) {
          localStorage.setItem("user", data.accessToken);

          dispatch(updateUser({ userId: data.user._id, username: data.user.UserName, image: data.user.profileImg, userEmail: data.user.email, })
          );
          navigate('/Hashtags')
        } else {

          localStorage.setItem("user", data.accessToken);

          dispatch(updateUser({ userId: data.user._id, username: data.user.UserName, image: data.user.profileImg, userEmail: data.user.email, })
          );
          navigate("/");
        }
      }

      if (data.message) {
        const message = data.message;

        LoginERror(message);
      }
    } catch (error) {
      LoginERror(error);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<any> => {
    e.preventDefault();
    try {
      const errors: Errors | "success" = LoginValidation(user);


      if (errors !== "success") {
        for (const key in errors) {
          if (
            errors.hasOwnProperty(key as keyof Errors) &&
            errors[key as keyof Errors]
          ) {
            LoginERror(errors[key as keyof Errors]);
          }
        }
      } else {


        const { data } = await api.post(
          "/login",
          { ...user },
          { withCredentials: true }
        );

        if (data) {
          if (data.exist) {
            localStorage.setItem("user", data.accessToken);
            dispatch(
              updateUser({
                userId: data.user._id,
                username: data.user.UserName,
                image: data.user.profileImg,
                userEmail: data.user.email,
              })
            );
            navigate("/");
          }
          if (data?.Blocked) {
            console.log(data.Blocked, 'blockedclodcked');

            const message = data.Blocked;
            LoginERror(message);
          }
          if (data.message) {
            const message = data.message;
            LoginERror(message);
          }
        }
      }
    } catch (error) {
      console.log(error);
      LoginERror(error);
    }
  };


  return (
    <>
      <div>

        <div className="grid grid-cols-1   sm:grid-cols-2  w-full">
          <div className="hidden sm:block  ml-32">
            <div className="flex relative z-10 top-16 justify-center">
              <h1 className=" font-serif text-5xl relative">DevColab</h1>
            </div>

            <div className="flex items-center h-full ">
              <img
                className=" bottom-5 relative object-cover  "
                src="https://img.freepik.com/free-vector/programmer-composition-with-doodle-character-distracted-programmer-got-error-his-code-vector-illustration_1284-66931.jpg?w=826&t=st=1690608097~exp=1690608697~hmac=a032353163d1a23f36a7ceaa7345f7c89c7c55c91a9344a233c7217024ba3818"
                alt=""
              />
            </div>
            <h1
              className="flex justify-center relative bottom-36 text-center"
              style={{ whiteSpace: "pre-line" }}
            >
              {`Let’s Collaborate with others for\n ask Programming Errors or\nDoubts`}
            </h1>
          </div>

          <div className="bg-white mt-14  md:right-12 relative mx-0 flex-col justify-center">
            <form
              onSubmit={handleSubmit}
              className="max-w-[500px] drop-shadow-2xl  w-full mx-auto bg-white p-4  border-2 border-gray-400 border-opacity-50 rounded-[1rem]"
              action=""
            >
              <h2 className="text-4xl font-bold text-center py-6">Log In</h2>

              <div className="flex  flex-col p-4 ">
                <label>YourEmail</label>
                <input
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  name="email"
                  className="border  hover:shadow-2xl relative bg-gray-100 p-2"
                  type="email"
                  required
                />
              </div>

              <div className="flex  flex-col p-4 ">
                <label>Password</label>
                <input
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  name="password"
                  className="border hover:shadow-2xl relative bg-gray-100 p-2"
                  type="password"
                />
              </div>
              <div className="flex justify-end">
                <p
                  className="text-blue-700 text-lg pt-2 px-5 cursor-pointer font-cursor-pointer"
                  onClick={() => {
                    navigate("/ForgotPassword");
                  }}
                >
                  Forgot password
                  <p className="inline text-black font-medium px-1" >?</p>
                </p>
              </div>
              <div className="flex px-4">
                <button
                  type="submit"
                  className="w-full py-3 mt-8  bg-indigo-600 hover:bg-indigo-500 relative text-white"
                >
                  LogIn
                </button>
              </div>
              <div className="flex items-center pt-5 ">
                <div className="flex-grow border-t border-gray-400"></div>
                <div className="px-4 text-gray-500">Or</div>
                <div className="flex-grow border-t border-gray-400"></div>
              </div>

              <div className="flex justify-center  py-8  ">
                <GoogleLogin
                  size="medium"
                  onSuccess={(credentialResponse: any) => {
                    GoogleauthLogin(jwt_decode(credentialResponse?.credential));
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />


              </div>
              <div className="flex justify-between items-center">
                <div className="flex  relative">
                  <p className="inline-block "> Don’t have an account </p>{" "}
                  <a
                    className="cursor-pointer text-blue-700"
                    onClick={() => navigate("/signup")}
                  >
                    ? SignUp{" "}
                  </a>
                </div>

                <button onClick={() => navigate("/")} type="button" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 relative px-4 rounded-full">
                  <FaHome className="inline-block w-5 h-5 mr-1" /> Home
                </button>


              </div>


            </form>
          </div>
          <ToastContainer />
        </div>




      </div>
    </>
  );
}

export default login;
