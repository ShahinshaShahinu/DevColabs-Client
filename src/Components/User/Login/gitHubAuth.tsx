import GitHubLogin from 'react-github-login';
import { BsGithub } from 'react-icons/bs';

// Define the component
function gitHubAuth() {
    
    const onSuccess = (response: any) => {
        console.log('GitHub login successful', response);
    };

    const onFailure = (error: any) => {
        console.error('GitHub login failed', error);
    };
    
    return (
        <div>

            <button
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-1  py-1 rounded  flex items-center"
            >
                <BsGithub className='mr-1'/>
                <GitHubLogin
                    clientId={import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID}
                    redirectUri={import.meta.env.VITE_GITHUB_OAUTH_REDIRECT_URL}
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                />
            </button>


            {/* Provide the required props for the GitHubLogin component */}
            {/* <div>
                <GitHubLogin
                    clientId={import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID}
                    redirectUri={import.meta.env.VITE_GITHUB_OAUTH_REDIRECT_URL}
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    className="bg-gray-800 hover:bg-gray-700 text-white font-bold  px-4 rounded mt-2"
                >
                    <BsGithub className="w-6 mr-2 inline-block align-middle" />
                    Login With GitHub
                </GitHubLogin>

            </div> */}
        </div>
    );
}

export default gitHubAuth;
