// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import { Routes, Route } from 'react-router-dom'
import SignupPage from './Pages/SignupPage'
import LoginPage from './Pages/LoginPage'
import HomePage from './Pages/HomePage'
import ForgotPasswordPage from './Pages/ForgotPasswordPage'
import UpdatePasswordPage from './Pages/UpdatePasswordPage'
import VerifyEmailPage from './Pages/VerifyEmailPage'
import AdminLoginPage from './Pages/AdminLoginPage'
import AdminUserManagementPage from './Pages/AdminUserManagementPage'
import UserProfilePage from './Pages/UserProfilePage'
import AdminDashboardPage from'./Pages/AdminDashboardPage'
import ProtectedRoute from './Components/User/ProtectedRoute'
import JoditPostCreationPage from './Pages/joditPostCreationPage';
import JoditPostCreation from './Components/User/PostCreation/joditPostCreation'
import UserProfilePostsPage from './Pages/UserProfilePostsPage'
import UserSavedPostsPage from './Pages/UserSavedPostsPage'
import AdminHashTagPage from './Pages/AdminHashTagPage'
import UserHashtagPage from './Pages/UserHashtagPage'
import AdminReportManagementPage from './Pages/AdminReportManagementPage'
import SearchPage from './Pages/SearchPage'


// import QuillEditorPostCreation from './Components/User/PostCreation/QuillEditorPostCreation'





function App() {


  return (
    <>

      <Routes> 
        {/* Users Routes */}
        <Route path='/' element={<HomePage/>} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/ForgotPassword' element={<ForgotPasswordPage />} />
        <Route path='/VerifyEmail' element={<VerifyEmailPage />} />
        <Route path='/UpdatePassWord' element={<UpdatePasswordPage />} />
        <Route path='/profile' element={<ProtectedRoute><UserProfilePage/></ProtectedRoute>}/>
       <Route path="/PostCreation" element={<ProtectedRoute><JoditPostCreationPage /></ProtectedRoute>} />
       <Route path="/QuillEditor" element={< JoditPostCreation initialValue={''} getValue={function (_newValue: string): void {
         throw new Error('Function not implemented.')
        } }/>} />
        <Route path='/UserPostsView/:postId' element={<ProtectedRoute><UserProfilePostsPage /></ProtectedRoute>} />
        <Route path='/UserPostsView' element={<ProtectedRoute><UserProfilePostsPage /></ProtectedRoute>} />
        <Route path='/SavedPosts' element={<ProtectedRoute><UserSavedPostsPage /></ProtectedRoute>} />
        <Route path='/Hashtags' element={<ProtectedRoute><UserHashtagPage /></ProtectedRoute>} />
        <Route path='/search-results' element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
     
        

  
       {/* Admin Routes */}

       <Route path='/admin/login' element={<AdminLoginPage/>}/>
       <Route path='/admin/UserManageMent' element={<AdminUserManagementPage/>}/>
       <Route path='/admin/Dashboard' element={<AdminDashboardPage/>}/>
       <Route path='/admin/HashTagManageMent' element={<AdminHashTagPage/>}/>
       <Route path='/admin/ReportManageMent' element={<AdminReportManagementPage/>}/>

      

      </Routes>
    </>
  )
}

export default App
