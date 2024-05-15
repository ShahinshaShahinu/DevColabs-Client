
// import { api } from "../../services/axios"

import { api } from "../../services/axios";

// export const userNameValidation = (value: string, err: object, setErr: Function) => {
//   const lnameRgx: RegExp = /^[A-Za-z]{4,10}$/
//   if ((value.trim()).length === 0) {
//     setErr({ ...err, username: `Username field can't be empty` })
//   }
//   else if (!lnameRgx.test(value)) {
//     setErr({ ...err, username: 'Enter a valid Username' })
//   }
//   else {
//     setErr({ ...err, username: '' })
//   }
// }
// // const regex = {
// //     full_name : /^([A-Za-z])([A-Za-z\s]){3,11}$/gm,
// //     username : /^([_a-z])([a-z0-9]){3,11}$/gm,
// //     email : /^([\w\W])([\w\W])+@([a-zA-Z0-9]){3,6}.([a-zA-Z0-9]){2,3}$/gm,
// //     email2 : /^([\w\W])([\w\W])+@([a-zA-Z0-9]){3,6}.([a-zA-Z0-9]){2,3}$/gm,
// //     password : /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[\W]).{8,16}$/gm
// // }





export const Signupvalidation = (userData: { UserName: string; email: string, Confirmpassword: string, password: string }) => {
  const regex = {
    lnameRgx: /^(?=.*[0-9])[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/,
    emailRgx: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    passWordRgx: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  };

  const { UserName, email, password, Confirmpassword } = userData;





  const errors = {
    UserName: "",
    email: "",
    password: '',
    Confirmpassword: ''
  };

  if (!regex.lnameRgx.test(UserName)) {
    errors.UserName = "The Username must contain at least one number and letters ";
    return errors;
  }

  if (!regex.emailRgx.test(email)) {
    errors.email = "Enter a valid Email";
    return errors
  }
  if (!regex.passWordRgx.test(password)) {
    errors.password = 'Password must have at least 8 characters and include at least one lowercase letter, one uppercase letter, one digit, and one special character @$!%*?&.'
    return errors
  }

  if (password !== Confirmpassword) {
    errors.password = 'Passwords do not match';
    return errors;
  }


  if (errors.UserName || errors.email) {
    return errors;
  }

  return 'success';

};

//   login VAlidation for user


export const LoginValidation = (userData: { email: string, password: string }) => {
  const regex = {

    // emailRgx: /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/,
    emailRgx: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    passWordRgx: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  };

  const { email, password } = userData;

  const errors = {
    email: "",
    password: '',
    Confirmpassword: ''
  };


  if (!regex.emailRgx.test(email)) {
    errors.email = "Enter a valid Emadil";
    return errors
  }
  if (!regex.passWordRgx.test(password)) {
    errors.password = 'Password must have at least 8 characters and include at least one lowercase letter, one uppercase letter, one digit, and one special character @$!%*?&.'
    return errors
  }


  if (errors.password || errors.email) {
    return errors;
  }

  return 'success';

};




export const UpdatePassWord = async (userData: { Confirmpassword: string, password: string }) => {

  const regex = {
    passWordRgx: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  }
  const { Confirmpassword, password } = userData;


  const errors = {
    password: '',
    Confirmpassword: ''
  };

  if (!regex.passWordRgx.test(password)) {
    errors.password = 'Password must have at least 8 characters and include at least one lowercase letter, one uppercase letter, one digit, and one special character @$!%*?&.'
    return errors
  }

  if (password !== Confirmpassword) {
    errors.password = 'Password Not Equal'
    return errors
  }
  return 'success';
}









export const ForgotPasswordEmialValidation = async (email: string) => {
  const regex = {
    emailRgx: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  }

  let errorObj = {
    message: ''
  }
  if (!regex.emailRgx.test(email)) {
    errorObj.message = "Invalid email format";
    return errorObj
  } else {
    const { data } = await api.post(`/ForgotEmailVerify/${email}`)
    console.log(data, ' veri api');

    if (!data) {
      errorObj.message = 'email was not found'
      return errorObj
    }
    if (data) {

      if (data?.message) {
        errorObj.message = data.message;
        return errorObj

      }
      if (data.userid) {

        localStorage.setItem('userId', data.userid)
        return 'success'

      }
      return true
    }
  }

}