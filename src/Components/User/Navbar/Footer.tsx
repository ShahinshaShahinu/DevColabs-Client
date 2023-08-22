import { AiFillHome, AiOutlineMessage } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom';

function Footer() {
    const Navigate = useNavigate();
  return (
    <div>
         <footer className="bg-gray-800 md:hidden text-white p-4 fixed bottom-0 left-0 w-full">
            <nav className="container mx-auto flex items-center justify-center">
              <div className="md:hidden">
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-gray-400">
                    <AiFillHome className='text-2xl mx-5' onClick={() => Navigate('/')} />
                  </a>
                  <a href="#" className="hover:text-gray-400">
                    <AiOutlineMessage className='text-2xl mx-5' onClick={() => Navigate('/')} />
                  </a>
                </div>
              </div>
              <div className="hidden md:block">
                <span className="text-sm">
                  © 2023 DevColab. All rights reserved.
                </span>
              </div>
            </nav>
          </footer>
    </div>
  )
}

export default Footer