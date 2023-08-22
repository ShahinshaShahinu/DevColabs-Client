export const LoginValidation = (userData: { email: string, password: string }) => {
  const regex = {
    //   lnameRgx: /^[A-Za-z]{4,10}$/,
    emailRgx: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    passWordRgx: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  };

  const { email, password } = userData;

  const errors = {
    email: "",
    password: '',
    Confirmpassword: ''
  };


  if (!regex.emailRgx.test(email)) {
    errors.email = "Enter a valid Email";
    return errors
  }
  if (!regex.passWordRgx.test(password)) {
    errors.password = 'Enter A valid Password and try again'
    return errors
  }


  if (errors.password || errors.email) {
    return errors;
  }

  return 'success';

};




export const HashtagVAlidation = (Hashtag: string, CurrentDate: string| undefined ) => {


  const regex = {
    hashtagRegex: /^#[A-Za-z]+$/,
    dateRegex: /^\d{4}-\d{2}-\d{2}$/

  }

  if (!regex.hashtagRegex.test(Hashtag)) {
    return 'Invalid'
  }
  if(CurrentDate===undefined){
    return 'Date'
  }
  if (!regex.dateRegex.test(CurrentDate)) {
    return 'Date'
  }

   return true

}