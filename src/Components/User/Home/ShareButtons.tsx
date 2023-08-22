import { AiFillTwitterCircle } from 'react-icons/ai';
import { BsTelegram } from 'react-icons/bs';
import { FaCopy, FaFacebook } from 'react-icons/fa';
import { ImLinkedin } from 'react-icons/im';
import copy from 'copy-to-clipboard';
import {  MdOutlineMailOutline, MdOutlineWhatsapp } from 'react-icons/md';




import {
    EmailShareButton,
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    TelegramShareButton,
    WhatsappShareButton,
} from 'react-share';
import { toast,ToastContainer } from 'react-toastify';

interface ShareButtonsProps {
    url: string;
    title: string;
}



function ShareButtons({ url, title }: ShareButtonsProps) {

    const handleCopyLink = () => {
        copy(url);
        SavePostSucess('URL copied')
    };
    const SavePostSucess = (success: string) => {
        toast.success(success, {
          position: 'bottom-right',
          autoClose: 2000,
          style: {
            color: 'blue',
          },
        });
      }
    return (
        <>

            <div>
                <FacebookShareButton url={url} quote={title}>
                    <FaFacebook className="mr-2 relative text-4xl text-blue-600 hover:text-blue-800" />
                </FacebookShareButton>

                <TwitterShareButton url={url} title={title}>
                    <AiFillTwitterCircle className="mr-2 relative text-4xl text-blue-500 hover:text-blue-600" />
                </TwitterShareButton>

                <LinkedinShareButton url={url} title={title}>
                    <ImLinkedin className="mr-2 relative text-4xl rounded-3xl text-blue-600 hover:text-blue-800" />
                </LinkedinShareButton>
                <TelegramShareButton url={url} title={title}>
                    <BsTelegram className="mr-2 relative text-4xl rounded-3xl text-blue-400 hover:text-blue-600" />
                </TelegramShareButton>
                <WhatsappShareButton url={url}>
                    <MdOutlineWhatsapp className="mr-2  text-4xl  relative  rounded-full bg-green-500 text-white hover:text-green-700" />
                </WhatsappShareButton>

                <EmailShareButton url={url}>
                    <MdOutlineMailOutline className="mr-2  text-4xl  relative bg-slate-600  rounded-full text-white hover:text-gray -800" />
                </EmailShareButton>

                {/* <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="relative text-4xl text-purple-600 hover:text-purple-800" />
                </a> */}


                <br />
                <br />
                <button onClick={handleCopyLink}>
                    <FaCopy className="relative text-4xl text-gray-600 hover:text-gray-800" />
                    <p>copy</p>
                </button>
                <ToastContainer />
            </div>

        </>
    )
}

export default ShareButtons