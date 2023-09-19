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
import AdminDashboardPage from './Pages/AdminDashboardPage'
import ProtectedRoute from './Components/User/ProtectedRoute'
import JoditPostCreationPage from './Pages/joditPostCreationPage';
import UserProfilePostsPage from './Pages/UserProfilePostsPage'
import UserSavedPostsPage from './Pages/UserSavedPostsPage'
import AdminHashTagPage from './Pages/AdminHashTagPage'
import UserHashtagPage from './Pages/UserHashtagPage'
import AdminReportManagementPage from './Pages/AdminReportManagementPage'
import SearchPage from './Pages/SearchPage'
import ChatPage from './Pages/ChatPage'
import ErrorPage from './Pages/ErrorPage'
import AdminProtectedRoute from './Components/Admin/AdminProtectedRoute'
import VideoCallPage from './Pages/VideoCallPage';
import RoomVideoCallPage from './Pages/RoomVideoCallPage'



import JaaSMeetingVideoCall from './Components/JitsiVideoCall/JaaSMeetingVideoCall'





function App() {


  return (
    <>

      <Routes>
        {/* Users Routes */}
        <Route path='/DevColabs-Client/' element={<HomePage />} />
        <Route path='/DevColabs-Client/signup' element={<SignupPage />} />
        <Route path='/DevColabs-Client/login' element={<LoginPage />} />
        <Route path='/DevColabs-Client/ForgotPassword' element={<ForgotPasswordPage />} />
        <Route path='/DevColabs-Client/VerifyEmail' element={<VerifyEmailPage />} />
        <Route path='/DevColabs-Client/UpdatePassWord' element={<UpdatePasswordPage />} />
        <Route path='/DevColabs-Client/profile' element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
        <Route path="/DevColabs-Client/PostCreation" element={<ProtectedRoute><JoditPostCreationPage /></ProtectedRoute>} />
      
        <Route path='/DevColabs-Client/UserPostsView/:postId' element={<ProtectedRoute><UserProfilePostsPage /></ProtectedRoute>} />
        <Route path='/DevColabs-Client/UserPostsView' element={<ProtectedRoute><UserProfilePostsPage /></ProtectedRoute>} />
        <Route path='/DevColabs-Client/SavedPosts' element={<ProtectedRoute><UserSavedPostsPage /></ProtectedRoute>} />
        <Route path='/DevColabs-Client/Hashtags' element={<ProtectedRoute><UserHashtagPage /></ProtectedRoute>} />
        <Route path='/DevColabs-Client/search-results' element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path='/DevColabs-Client/Community' element={<ChatPage />} />
        <Route path='/DevColabs-Client/VideoCall' element={<VideoCallPage />} />
        <Route path='/DevColabs-Client/room/:roomId' element={<RoomVideoCallPage/>} />


     
        <Route path='/DevColabs-Client/jasMeetingVideoCall' element={<JaaSMeetingVideoCall />} />




        {/* Admin Routes */}

        <Route path='/DevColabs-Client/admin/login' element={<AdminLoginPage />} />
        <Route path='/DevColabs-Client/admin/UserManageMent' element={<AdminProtectedRoute><AdminUserManagementPage /></AdminProtectedRoute>} />
        <Route path='/DevColabs-Client/admin/Dashboard' element={<AdminProtectedRoute><AdminDashboardPage /></AdminProtectedRoute>} />
        <Route path='/DevColabs-Client/admin/HashTagManageMent' element={<AdminProtectedRoute><AdminHashTagPage /></AdminProtectedRoute>} />
        <Route path='/DevColabs-Client/admin/ReportManageMent' element={<AdminProtectedRoute><AdminReportManagementPage /></AdminProtectedRoute>} />


        <Route path='*' element={<ErrorPage/>}/>

      </Routes>
    </>
  )
}

export default App
