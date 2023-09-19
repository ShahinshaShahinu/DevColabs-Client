import { useEffect, useState } from "react"
import { api } from "../../../services/axios"
import { useNavigate } from "react-router-dom";
import { User } from "../../../../../DevColab-Server/src/domain/models/user";
import {  UserManageMentBlock, UserManageMentUNBlock } from "../../../services/API functions/AdminApi";



function AdminUserManaging() {
   const navigate = useNavigate();
   const [userData,setUserData]=useState<User[]>([]);
   const [isOpen,setisOpen]=useState(Boolean);
   const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

   const Userauth = localStorage.getItem('admin');
   useEffect(() => {
      if (!Userauth) {
        navigate('/admin/login')
      }
  }, []);


 
  


   const openModal = (index:number) => {
      setisOpen(true);
      setSelectedItemIndex(index)
     
    };
  
    const closeModal = () => {
      setisOpen(false);
    };


  useEffect(() => {
    fetchUserData();
  }, [isOpen,selectedItemIndex]);

  const fetchUserData = async () => {
    try {
      const { data } = await api.get('/admin/UserManageMent/Users', { withCredentials: true });
      setUserData(data.Users);
    } catch (error) {
      const errorWithResponse = error as { response?: { data?: { error?: string } } };
      if (errorWithResponse?.response?.data?.error === 'Invalid token.') {
        localStorage.removeItem('admin');
        navigate('/admin/login')
    }
    }
  };



  const handleBlock = async (email: string) => {

   try {
    UserManageMentBlock(email);
  
     fetchUserData();
   } catch (error) {
     console.error('Error blocking user:', error);

   }
 };

 const handleUnblock = async (email: string) => {
   try {
    UserManageMentUNBlock(email);
    
     fetchUserData();
   } catch (error) {
     console.error('Error unblocking user:', error);
  
   }
 };


  return (

 


<div className="p-4 sm:ml-64">
   <div className="p-6 mt-20">
 
   <div className="flex-1 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
               
                            <th scope="col" className="px-6 py-3">
                            UserImage
                            </th>
                            <th scope="col" className="px-6 py-3">
                            User Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                             User Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Block/UnBlock
                            </th>
                            <th scope="col" className="px-6 py-3">
                                View
                            </th>
                        </tr>
                    </thead>
           
                    <tbody>

                    
                            
                        {userData && userData.map((user,index) => (                         
                           <tr key={user._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                             <td className="px-6 py-4" key={index}>
                                <img src={user.profileImg} alt="UserImage" className="w-11 h-11 rounded-full" />                               
                               </td>
                             <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                 {user.UserName}
                                </td>
                             <td className="px-6 py-4">
                             {user.email}
                              </td>
                              <td className="px-6 py-4">
                              
                              {user.status==false? (
                                 <button onClick={() => handleUnblock(user.email)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                                    Unblock
                                 </button>
                              ) : (
                                 <button onClick={()=>handleBlock(user.email)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                                    Block
                                 </button>
                              )}
                             </td>
                             <td className="px-6 py-4">
                               <button onClick={()=>openModal(index)} 
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                               View
                              </button>
                              </td>

                             </tr>
                           ))}


                       
                    </tbody>
                </table>
            </div>
    


            <div>
   
            {isOpen  && selectedItemIndex !== null  && (
  <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-8 rounded-lg w-[50rem] left-10 relative shadow-lg">
 
      <h2 className="text-2xl font-semibold mb-2">User Profile</h2>
      
      <div className="w-[100%] h-20 rounded-sm overflow-hidden mb-4">
        <img
          src={userData[selectedItemIndex]?.UserBackgroundImage}
          alt="Background Image"
          className="w-full h-full object-cover"
        />
      </div>
         <div className="border-b-2 mb-4"></div> 

     
      <div className="w-11 h-11 rounded-full overflow-hidden mb-4 inline-block">
        <img
          src={userData[selectedItemIndex].profileImg}
          alt="User Profile"
          className="w-full h-full object-cover"
        />
      </div>


      <p className="font-semibold text-lg bottom-8 left-2 relative inline">{userData[selectedItemIndex].UserName}</p>
      <p className="font-semibold text-sm bottom-8 left-3 relative inline-block">  ({userData[selectedItemIndex]?.profile?.Pronouns || 'No Pronouns available'})</p>
         <div>
        <p className="inline bottom-2 relative">FirstName: </p> <p className="inline font-semibold text-md bottom-2 relative ">{userData[selectedItemIndex]?.profile?.FirstName || 'No FirstName available'}</p>
        </div>
        <div>
        <p className="inline  relative">LastName: </p> <p className="inline-block font-semibold text-md mb-2">{userData[selectedItemIndex]?.profile?.LastName || 'No LastName available'}</p>

        </div>
        <div>
        <p className="inline  relative">Headline : </p> <p className="inline-block font-semibold text-md mb-2">{userData[selectedItemIndex]?.profile?.Headline || 'No Headline   available'}</p>

        </div>
        <div>
        <p className="inline-block  relative">Hashtags : </p>  <p className="inline-block font-semibold text-md mb-2">{userData[selectedItemIndex]?.profile?.Hashtags || 'No Hashtags   available'}</p>

        </div>
       


      <p className="font-semibold text-lg mb-2 inline">About Me:</p>
      <p className="inline-block">
      {/* {userData[selectedItemIndex]?.profile?.AboutMe ||  'No information available'} */}
      {userData[selectedItemIndex]?.profile?.AboutMe ? (
        <p>{userData[selectedItemIndex]?.profile?.AboutMe}</p>
          ) : (
           <p className="text-gray-500">&nbsp; No information available</p>
         )}
      </p>
     <div>
       <button
        onClick={closeModal}
        className="mt-6 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
      >
        Close
      </button>
     </div>
     
    </div>
  </div>
)}









{/* {isOpen && selectedItemIndex !== null && (
  <div className="fixed top-0 left-0 right-0 z-50 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-8 rounded-lg w-[50rem] h-96 left-10 relative shadow-lg">

      <h2 className="text-2xl font-semibold mb-2">User Profile</h2>

      <div className="w-[100%] h-20 rounded-sm overflow-hidden mb-4">
      
        <img
          src={userData[selectedItemIndex]?.UserBackgroundImage}
          alt="Background Image"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="border-b-2 mb-4"></div>

      <div className="flex items-center mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
     
          <img
            src={userData[selectedItemIndex].profileImg}
            alt="User Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
       
          <p className="font-semibold text-lg mb-1">{userData[selectedItemIndex]?.FullName || 'N/A'}</p>
       
          <p className="font-semibold text-lg mb-2">{userData[selectedItemIndex]?.LastName || 'N/A'}</p>
        </div>
      </div>

      <div className="h-[20rem] overflow-y-auto">
        <div className="flex flex-wrap">

          <div className="w-full md:w-1/3">
            <p className="font-semibold text-lg mb-1">Pronouns:</p>
            <p>{userData[selectedItemIndex]?.Pronouns || 'N/A'}</p>
          </div>

          <div className="w-full md:w-1/3">
            <p className="font-semibold text-lg mb-1">Headline:</p>
            <p>{userData[selectedItemIndex]?.Headline || 'N/A'}</p>
          </div>

          <div className="w-full md:w-1/3">
            <p className="font-semibold text-lg mb-1">Hashtags:</p>
            <p>{userData[selectedItemIndex]?.Hashtags || 'N/A'}</p>
          </div>
          <div className="w-full md:w-1/3">
            <p className="font-semibold text-lg mb-1">Pronouns:</p>
            <p>{userData[selectedItemIndex]?.Pronouns || 'N/A'}</p>
          </div>
       
          <div className="w-full md:w-1/3">
            <p className="font-semibold text-lg mb-1">Headline:</p>
            <p>{userData[selectedItemIndex]?.Headline || 'N/A'}</p>
          </div>
    
          <div className="w-full md:w-1/3">
            <p className="font-semibold text-lg mb-1">Hashtags:</p>
            <p>{userData[selectedItemIndex]?.Hashtags || 'N/A'}</p>
          </div><div className="w-full md:w-1/3">
            <p className="font-semibold text-lg mb-1">Pronouns:</p>
            <p>{userData[selectedItemIndex]?.Pronouns || 'N/A'}</p>
          </div>
    
        </div>

        <p className="font-semibold text-lg mb-2">About Me:</p>
        <p>{userData[selectedItemIndex]?.profile?.AboutMe || 'No information available'}</p>
      </div>

      <button
        onClick={closeModal}
        className="mt-6 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
      >
        Close
      </button>
    </div>
  </div>
)} */}



    </div>





      </div>
   </div>



  )
}

export default AdminUserManaging





























































{/* <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
<th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
    Microsoft Surface Pro
</th>
<td className="px-6 py-4">
    White
</td>
<td className="px-6 py-4">
    Laptop PC
</td>
<td className="px-6 py-4">
    $1999
</td>
</tr>
<tr className="bg-white dark:bg-gray-800">
<th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
    Magic Mouse 2
</th>
<td className="px-6 py-4">
    Black
</td>
<td className="px-6 py-4">
    Accessories
</td>
<td className="px-6 py-4">
    $99
</td>
</tr> */}






{/* <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
               </svg>
               <span className="ml-3">Dashboard</span>
            </a>
         </li> */}





   {/*  <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
               </svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Kanban</span>
               <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
            </a>
         </li>
         <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z"/>
               </svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Inbox</span>
               <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
            </a>
         </li> */}









{/*  <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                  <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z"/>
               </svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Products</span>
            </a>
         </li>
         <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
               </svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Sign In</span>
            </a>
         </li>
         <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z"/>
                  <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z"/>
                  <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z"/>
               </svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Sign Up</span>
            </a>
         </li> */}








{/* <button type="button" data-drawer-hide="drawer-navigation" aria-controls="drawer-navigation" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
    <span className="sr-only">Close menu</span>
</button> */}






        // <div className="flex h-screen">
        //     <div className="bg-[#D4E7FA] z-10 w-screen h-16">
        //         <div className="shahinsha flex bg-[#130760] h-screen sm:static justify-center w-64">
        //             <div className="left-16 flex items-center sm:absolute sm:left-0 sm:top-0 sm:mt-3 text-2xl font-semibold">
        //                 <h1 className="text-white absolute left-12 pt-7 text-4xl font-mono">DevColab</h1>
        //             </div>

        //             <div className="p-7 pt-16">
        //                 <hr className="border-t w border-[#D4E7FA]" />
        //                 <div />
        //                 <nav className="mt-4">
        //                     <ul>
        //                         <li className="py-2 bg-[#0011FF] rounded-2xl hover:bg-slate-700">
        //                             <svg className="inline-block pb-1" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        //                                 {/* ... SVG paths */}
        //                             </svg>
        //                             <a href="#" className="text-white px-1 text-xl">User Management</a>
        //                         </li>
        //                     </ul>
        //                 </nav>
        //             </div>

        //         </div>
        //     </div>
           
        // </div>



    //     <div className="flex h-screen">
    //     <div className="bg-[#D4E7FA] z-10 w-64 h-screen">
    //       <div className="left-16 flex items-center text-2xl font-semibold">
    //         <h1 className="text-white absolute left-12 pt-7 text-4xl font-mono">DevColab</h1>
    //       </div>
      
    //       <div className="p-7 pt-16">
    //         <hr className="border-t w border-[#D4E7FA]" />
    //         <nav className="mt-4">
    //           <ul>
    //             <li className="py-2 bg-[#0011FF] rounded-2xl hover:bg-slate-700">
    //               <svg className="inline-block pb-1" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                 {/* ... SVG paths */}
    //               </svg>
    //               <a href="#" className="text-white px-1 text-xl">User Management</a>
    //             </li>
    //           </ul>
    //         </nav>
    //       </div>
    //     </div>
      
    //     <div className="flex-1 overflow-x-auto">
    //       <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    //         <tbody>
    //           <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
    //             <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
    //               Apple MacBook Pro 17"
    //             </th>
    //             <td className="px-6 py-4">
    //               Silver
    //             </td>
    //             <td className="px-6 py-4">
    //               Laptop
    //             </td>
    //             <td className="px-6 py-4">
    //               $2999
    //             </td>
    //           </tr>
    //           <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
    //             <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
    //               Microsoft Surface Pro
    //             </th>
    //             <td className="px-6 py-4">
    //               White
    //             </td>
    //             <td className="px-6 py-4">
    //               Laptop PC
    //             </td>
    //             <td className="px-6 py-4">
    //               $1999
    //             </td>
    //           </tr>
    //           <tr className="bg-white dark:bg-gray-800">
    //             <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
    //               Magic Mouse 2
    //             </th>
    //             <td className="px-6 py-4">
    //               Black
    //             </td>
    //             <td className="px-6 py-4">
    //               Accessories
    //             </td>
    //             <td className="px-6 py-4">
    //               $99
    //             </td>
    //           </tr>
    //         </tbody>
    //       </table>
    //     </div>
    //   </div>
      













    //     <div className={`sidebar fixed top-0 bottom-0 lg:left-0 left-${isSidebarOpen ? '0' : '-300'} duration-1000 p-2 w-[300px] overflow-y-auto text-center bg-gray-900 shadow h-screen`}>
    //       <div className="text-gray-100 text-xl">
    //         <div className="p-2.5 mt-1 flex items-center rounded-md">
    //           <i className="bi bi-app-indicator px-2 py-1 bg-blue-600 rounded-md"></i>
    //           <h1 className="text-[15px] ml-3 text-xl text-gray-200 font-bold">Tailwindbar</h1>
    //           <i
    //             className={`bi bi-x ml-20 cursor-pointer ${isSidebarOpen ? 'block' : 'hidden'}`}
    //             onClick={toggleSidebar}
    //           ></i>
    //         </div>
    //         <hr className="my-2 text-gray-600" />
    
    //         <div>
    //           <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer  bg-gray-700">
    //             <i className="bi bi-search text-sm"></i>
    //             <input className="text-[15px] ml-4 w-full bg-transparent focus:outline-none" placeholder="Search" />
    //           </div>
    
    //           <div className="p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600">
    //             <i className="bi bi-house-door-fill"></i>
    //             <span className="text-[15px] ml-4 text-gray-200">Home</span>
    //           </div>
    
    //           {/* Add other menu items as needed */}
              
    //           <hr className="my-4 text-gray-600" />
    
    //           <div
    //             className="p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600"
    //             onClick={toggleDropdown}
    //           >
    //             <i className="bi bi-chat-left-text-fill"></i>
    //             <div className="flex justify-between w-full items-center">
    //               <span className="text-[15px] ml-4 text-gray-200">Chatbox</span>
    //               <span className={`text-sm ${isDropdownOpen ? 'rotate-180' : ''}`} id="arrow">
    //                 <i className="bi bi-chevron-down"></i>
    //               </span>
    //             </div>
    //           </div>
    
    //           {isDropdownOpen && (
    //             <div className="leading-7 text-left text-sm font-thin mt-2 w-4/5 mx-auto">
    //               <h1 className="cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1">Social</h1>
    //               <h1 className="cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1">Personal</h1>
    //               <h1 className="cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1">Friends</h1>
    //             </div>
    //           )}
    
    //           <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600">
    //             <i className="bi bi-box-arrow-in-right"></i>
    //             <span className="text-[15px] ml-4 text-gray-200">Logout</span>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // };
    
