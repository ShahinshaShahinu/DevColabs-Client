import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { DashbordDAtas } from "../../../services/API functions/AdminApi";
import { Chart } from 'tw-elements';

interface Dashboard {
  TotalUsers: number;
  TotalPosts: number;
  TotalCommunities: number;
}
interface Graphs {
  month: string,
  count: number
}

interface AllPost {
  month: string,
  count: number
}


function AdminDashBoard() {
  const [dashboard, setdashboard] = useState<Dashboard>({ TotalUsers: 0, TotalPosts: 0, TotalCommunities: 0 })
  const [Graph, setGraph] = useState<Graphs[]>([]);
  const [AllPost,setAllPost]=useState<AllPost[]>([])
  const navigate = useNavigate()
  useEffect(() => {
    const Userauth = localStorage.getItem('admin');
    if (!Userauth) {
      navigate('/admin/login')
    }
  }, []);
  useEffect(() => {
    async function fetchData() {
      try {
        const DashbordData = await DashbordDAtas();
        setGraph(DashbordData?.data?.AllUserMonths)
        setdashboard(DashbordData?.data);
        setAllPost(DashbordData?.data?.AllPosts)
      } catch (error) {
        console.log(error);

      }
    }
    fetchData()
  }, [])

  const maxUsers = Math.max(...Graph.map((entry) => entry?.count));

  useEffect(() => {
    const data = {
      type: "bar", // Specify the chart type as bar
      data: {
        labels: Graph.map((entry) => entry.month),
        datasets: [
          {
            label: "User Growth",
            data: AllPost.map((entry) => entry?.count),
            backgroundColor: "rgba(63, 81, 181, 0.5)", // Bar color
            borderColor: "rgba(63, 81, 181, 1)", // Border color
            borderWidth: 1, // Border width
          },
        ],
      },
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    new Chart(document.getElementById("user-growth-chart"), data, options);
  }, [Graph]);
  return (
    <>
      <div className="p-4 sm:ml-64 ">
        <div className="p-6 mt-20">
          <h1 className="font-medium text-lg">Dashboard</h1>
          <div className="flex-1 pt-3 pl-3 overflow-x-auto">
            <div className="flex flex-wrap mr-36">
              {/* Total Users Card */}
              <div className="w-1/3 p-4">
                <div className="bg-gradient-to-br from-purple-400 cursor-pointer to-indigo-600 hover:scale-y-110 transition-transform duration-300 text-white border border-indigo-600 rounded-lg shadow-md p-4">
                  <FaUsers className='inline text-2xl mr-1 relative mb-2 ' />
                  <h2 className="text-lg inline-block font-semibold ">Total Users</h2>
                  <p className="text-3xl font-bold mb-2">{dashboard?.TotalUsers}</p>
                </div>
              </div>

              {/* Total Posts Card */}
              <div className="w-1/3 p-4">
                <div className="bg-gradient-to-br from-green-400 cursor-pointer to-green-600 hover:scale-y-110 transition-transform duration-300 text-white border border-green-600 rounded-lg shadow-md p-4">
                  <IoDocumentText className='inline-flex mr-1 text-2xl mb-2' />
                  <h2 className="text-lg inline-block font-semibold ">Total Posts</h2>
                  <p className="text-3xl font-bold mb-2">{AllPost?.length}</p>
                </div>
              </div>
              <div className="w-1/3 p-4">
                <div className="bg-gradient-to-br from-pink-400 to-rose-600 transform h-28 hover:scale-y-110 transition-transform duration-300 cursor-pointer text-white border border-rose-600 rounded-lg shadow-md p-4">
                  <MdOutlineConnectWithoutContact className='inline-flex mr-1 text-2xl mb-2' />
                  <h2 className="text-lg font-semibold inline-block">Total Communities</h2>
                  <p className="text-3xl font-bold mb-2">{dashboard?.TotalCommunities}</p>
                </div>
              </div>

            </div>



            {/* Bar Chart */}
            {/* Bar Chart */}
            <div> 
            <div className="p-4 ">
              <div className="p-2 mt-0 mr-36 border-2 ">
                <div className=" p-4">
                  <h1 className="font-medium text-lg  cursor-pointer text-blue-600">User Growth Chart</h1>
                  <div className="flex items-center  space-x-4 mt-32">
                    {Graph?.map((entry, index) => (
                      <div key={index} className="relative w-16">
                        <div
                          className="absolute bottom-0 left-0 cursor-pointer w-full h-40 bg-blue-400 hover:bg-blue-500 transition-transform duration-300 origin-bottom transform hover:scale-y-105 rounded-md"
                          style={{
                            height: `${(entry?.count / maxUsers) * 100}%`,
                            animation: "wave 2s infinite alternate",
                          }}
                        ></div>
                        <span className="block text-center text-xs font-medium mt-20 relative text-gray-700">
                          {entry?.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            </div>

          </div>
            <div className="p-4 ">
              <div className="p-2 mt-0 mr-36 border-2">
                <div className="p-4">
                  <h1 className="font-medium text-lg cursor-pointer text-blue-600">
                    Post Growth Chart
                  </h1>
                  <div className="mt-4">
                    <canvas
                      id="user-growth-chart"
                      width="400" // Set your desired width
                      height="100" // Set your desired height
                    ></canvas>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>

    </>
  )
}

export default AdminDashBoard