import { AiFillHome } from 'react-icons/ai'
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  SelectCategory: (data: string) => void;
  ClickedHashtag: (data: string) => void;
}

function Footer({ SelectCategory, ClickedHashtag }: FooterProps) {
  const Navigate = useNavigate();


  return (
    <div>
      <footer className="bg-gray-800 md:hidden text-white p-4 fixed bottom-0 left-0 w-full">
        <nav className="container mx-auto flex items-center justify-center">
          <div className="md:hidden">
            <div className="flex space-x-4">
              <a className="hover:text-gray-400">
                <AiFillHome className='text-2xl mx-5' onClick={() => { Navigate('/'), SelectCategory('Latest'), ClickedHashtag('') }} />
              </a>
              <a className="hover:text-gray-400">
                <HiOutlineUserGroup className='text-2xl mx-5' onClick={() => Navigate('/Community')} />
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