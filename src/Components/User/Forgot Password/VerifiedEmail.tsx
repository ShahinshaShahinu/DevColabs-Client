
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/axios';

const verificationToken = "@DevColab@DV369";


function VerifiedEmail() {
  const Navigate = useNavigate()
  const handleVerifyEmail = async () => {
    try {
      const response = await api.post(`/VerifyEmail/${verificationToken}`, { withCredentials: true });
      const data = response.data;

      const tokenTrue = data.token;
      if (tokenTrue) {

   console.log('kkkkk');
   
        Navigate('/UpdatePassWord',{state:{verificationToken:verificationToken}})


      }

      console.log('Email verification request sent successfully!');
    } catch (error) {
      console.error('Error sending email verification request:', error);
      // Navigate('/login')
      // localStorage.removeItem('userId');
    }
  };

  return (
    <div className='bg-gray-300 rounded-sm shadow-2xl grid place-items-center' style={{ height: '100vh' }}>
      <div className='mt-32'>
        <img src='https://booster.io/wp-content/uploads/WooCommerce-Email-Verification.png' alt='Verify' className='flex w-36 relative  ' />
      </div>
      <div className='flex mb-52 '>
         <button
        className='bg-sky-500 shadow-2xl mb-5 border-2 border-gray-600 text-white rounded-lg px-4 py-2 flex items-center'
        onClick={handleVerifyEmail}
      >
        Click to Verify
      </button>
      </div>
     
    </div>
  );
}

export default VerifiedEmail;


