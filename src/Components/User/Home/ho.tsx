import React from 'react'

function ho() {
  return (
    <>




  {/* Your main content goes here */}
              {/* <div className="min-h-screen hidden md:flex absolute items-start justify-center ">
                <div className="grid grid-cols-1 max-h-[400px]  overflow-hidden relative  ">
                  <div className="fixed pt-1 h-full inline lg:w-[16rem] xl:w-[16.5rem] 2xl:w-[17rem] md:w-[13rem] overflow-y-auto z-10 ">
                    <nav className="flex flex-col top-44 relative bg-white border-2 p-2 pr-2  justify-around rounded-lg shadow-lg">
                      <ul>
                        <li className="flex cursor-pointer items-center w-auto h-12 space-x-2 hover:bg-sky-100 rounded-3xl">
                          <AiFillHome className="text-3xl text-gray-800  ml-3 " onClick={() => Navigate('/')} />
                          <h1 onClick={() => Navigate('/')} className="font-bold text-base">Home</h1>
                        </li>
                        <li className="flex cursor-pointer items-center h-12 space-x-2 hover:bg-sky-100 rounded-3xl">
                          <AiOutlineComment className="text-3xl text-gray-800 ml-3 mr-1" onClick={() => Navigate('/comments')} />
                          <h1 onClick={() => Navigate('/comments')} className="font-bold text-base">Comments</h1>
                        </li>
                        <li className="flex cursor-pointer items-center h-12 space-x-2 hover:bg-sky-100 rounded-3xl">
                          <AiOutlineUser className="text-3xl text-gray-800 ml-3" onClick={() => Navigate('/profile')} />
                          <h1 onClick={() => Navigate('/profile')} className="font-bold text-base">Profile</h1>
                        </li>
                       
                      </ul>
                    </nav>
                  </div>
                </div>
              </div> */}




      <div className="w-screen  flex relative  rounded-sm ">
          <div className="relative  h-screen grid grid-cols-1 md:grid-cols-2 m-auto  overflow-y-auto  overflow-x-hidden bottom-1   shadow-md shadow-gray-600 w-[904px]  ">

            <div className=" z-0  relative items-center mt-24 justify-center  ">

              {HomePosts && HomePosts.map((post: any, index) => (
                <div key={index} className='flex p-2   relative '>
                  <div className="flex relative    ">
                    <div className='flex bg-white  relative left-2 rounded-lg m-auto h-[150px]  overflow-hidden shadow-sm shadow-black sm:max-w-[100%]'
                      style={{
                        width: '54.5rem',
                        position: 'relative',

                      }}
                    >

                      <div onClick={() => Navigate('/profile', { state: post?.userId?._id })} className='z-10 text-start pl-3 pt-3 justify-start  absolute'>
                        <img onClick={() => Navigate('/profile', { state: post?.userId })}
                          src={post?.userId?.profileImg} alt='User Profile' className='w-9 inline cursor-pointer rounded-full mx-auto ' />
                        <h1 onClick={() => Navigate('/profile', { state: post?.userId?._id })}
                          className='inline-block pl-1 top-3 text-lg cursor-pointer absolute'>{post?.userId?.UserName}</h1>
                        <p className='inline top-4 text-sm left-2 relative'>{post?.Date}</p>
                      </div>

                      <div className='p-4 flex right-0 relative cursor-pointer flex-col justify-center'>
                        <h1 onClick={() => Navigate('/UserPostsView', { state: { UserPost: post } })}
                          className='font-semibold top-0 left-10  relative text-2xl'>{post?.title} </h1>
                        <hr className="border-t border-gray-300 my-4" />
                      </div>

                      <div className=" left-14 top-28 w-52 h-8 justify-start bottom-2 absolute">
                        <div className="flex justify-start relative items-end">
                          {post.likes.LikedUsers.some((likedUser: any) => likedUser.userId === userId && likedUser.liked) ? (
                            <>
                              <button onClick={() => handleClick(post._id)} className="hover:bg-gray-300  w-20 justify-center flex rounded-sm">

                                <BiSolidLike className='text-2xl opacity-80 cursor-pointer' />
                                <p>Like</p>
                                <span className="ml-1">{post.likes.Count}</span>
                              </button>
                            </>
                          ) : (

                            <>
                              <button onClick={() => handleClick(post._id)} className="hover:bg-gray-300  w-20 justify-center flex rounded-sm">

                                <BiLike className='text-2xl opacity-80 cursor-pointer' />
                                <p>Like</p>
                                <span className="ml-1">{post.likes.Count}</span>
                              </button>

                            </>
                          )}
                          <button onClick={showShadowDiv} className="hover:bg-gray-300 flex left-1 relative rounded-sm">
                            <FaRegComments className='text-2xl opacity-80  relative cursor-pointer' />
                            <span className=" inline-block relative">Comment</span>
                          </button>
                        </div>
                      </div>
                    </div>





                    <div className='flex justify-end  right-8 items-end   relative'>
                      <button onClick={() => SavePost(post._id)} >
                        <svg className="w-4 right-0 bottom-2 relative" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.9375 0H29.0625C29.5764 0 30.0692 0.158035 30.4325 0.43934C30.7959 0.720644 31 1.10218 31 1.5V30.214C31.0004 30.3483 30.9542 30.4801 30.8662 30.5959C30.7783 30.7116 30.6519 30.8069 30.5001 30.8719C30.3483 30.9369 30.1768 30.9691 30.0035 30.9653C29.8301 30.9614 29.6613 30.9216 29.5146 30.85L15.5 24.046L1.48283 30.848C1.33637 30.919 1.16803 30.9584 0.995292 30.962C0.82255 30.9657 0.651686 30.9335 0.500415 30.8689C0.349143 30.8042 0.222972 30.7094 0.134983 30.5942C0.0469929 30.4791 0.000388072 30.3478 0 30.214V1.5C0 1.10218 0.204129 0.720644 0.56748 0.43934C0.930832 0.158035 1.42364 0 1.9375 0ZM27.125 3H3.875V26.148L15.5 20.508L27.125 26.148V3Z" fill="#5F5454" />
                        </svg>
                      </button>
                    </div>
                    <div className="bg-transparent  right-0 left-0  absolute top-36 w-[98.5%]  h-auto">
                      <div className="bg-white h-auto relative p-1 left-2 ">





                        <form onSubmit={(e) => {
                          e.preventDefault();
                          SubmitComments(post._id)
                        }}>
                          <div className="w-full mb-4 border border-gray-200 rounded-lg h-auto bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                            <div className="px-1 py-2 pl-10 bg-white rounded-t-lg h-auto dark:bg-gray-800">
                              <div key='' className="flex right-10 top-5 relative items-center">
                                <img src={post?.userId?.profileImg} alt='Commenter Profile' className='w-6 h-6 rounded-full mx-2' />
                              </div>
                              <label form="comment" className="sr-only">Your comment</label>

                              <textarea
                                onChange={(e) => SetComment(e.target.value)}
                                id="comment"
                                className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-100 focus:ring-0 dark:text-gray-950 dark:placeholder-gray-400"
                                placeholder="Write a comment..."
                                required
                                rows={3}
                              ></textarea>
                            </div>
                            <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
                              <button
                                type="submit"
                                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
                              >
                                Post comment
                              </button>
                              <div className="flex pl-0 space-x-1 sm:pl-2">
                                <button
                                  type="button"
                                  className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                >
                                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 20">

                                  </svg>
                                  <span className="sr-only">Attach file</span>
                                </button>

                              </div>
                            </div>
                          </div>
                        </form>







                      </div>


                    </div>
                  </div>
                </div>




              ))}
              <ToastContainer />


            </div>


          </div>
        </div>
    
    
    </>
  )
}

export default ho