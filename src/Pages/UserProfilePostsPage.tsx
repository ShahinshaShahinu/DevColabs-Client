
import UserPostsProfile from '../Components/User/ShowPosts/UserPostsProfile';
import Navbar from '../Components/User/Navbar/Navbar';

function UserProfilePostsPage() {
    return (
        <div>
            <div className=" relative z-20 ">
                <Navbar />

            </div>
            <UserPostsProfile />
        </div>
    )
}

export default UserProfilePostsPage