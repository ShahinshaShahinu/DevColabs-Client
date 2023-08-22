// import React, { useState } from 'react';

// function Cloud() {
//   const [image, setImage] = useState<File | null>(null);
//   const [url, setUrl] = useState<string>("");

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     setImage(file || null);
//   };

//   const uploadImage = async () => {
//     if (image) {
//       const data = new FormData();
//       data.append("file", image);
//       data.append("upload_preset", "DevColabCloudinary");
//       data.append("cloud_name", "dvux3rb2h");
  
//       try {
//         const response = await fetch("https://api.cloudinary.com/v1_1/dvux3rb2h/image/upload", {
//           method: "post",
//           body: data
//         });
  
//         const responseData = await response.json();
//         console.log(responseData);
  
//         if (response.ok) {
//           setUrl(responseData.url);
//         } else {
//           console.log("Error uploading image:", responseData);
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//       }
//     }
//   };

//   return (
//     <div>
//       <div>
//         <input type="file" onChange={handleImageChange} />
//         <button onClick={uploadImage}>Upload</button>
//       </div>
//       <div>
//         <h1>Uploaded image will be displayed here</h1>
//         <img src={url} alt="Uploaded" />
//       </div>
//     </div>
//   );
// }










// function Cloud() {
// const [image, setImage ] = useState("");
// const [ url, setUrl ] = useState("");
// const uploadImage = () => {
// const data = new FormData()
// data.append("file", image)
// data.append("upload_preset", "tutorial")
// data.append("cloud_name","breellz")
// fetch("  https://api.cloudinary.com/v1_1/breellz/image/upload",{
// method:"post",
// body: data
// })
// .then(resp => resp.json())
// .then(data => {
// setUrl(data.url)
// })
// .catch(err => console.log(err))
// }
// return (
// <div>
// <div>
// <input type="file" onChange= {(e)=> setImage(e.target.files[0])}></input>
// <button onClick={uploadImage}>Upload</button>
// </div>
// <div>
// <h1>Uploaded image will be displayed here</h1>
// <img src={url}/>
// </div>
// </div>
// )
// }

// export default Cloud;





















































//    // const preset_key = 'dvux3rb2h';
//    // const [image, setImage] = useState('');
//    // const [imageURL,setimageURL]=useState('')

//    // const handleFile = async (e) => {
//    //    const file = e.target.files[0];
//    //    const formData = new FormData();
//    //    formData.append('file', file);
//    //    formData.append('upload_name', 'DevColabCloudinary');
//    //    formData.append('upload_preset', preset_key);

//    //    const response = await fetch("https://api.cloudinary.com/v1_1/dgl2tflen/image/upload",

//    //       {
//    //          method: 'post',
//    //          body: image
//    //       }

//    //    )
//    //    const imgData = await response.json()
//    //   let imageURL = imgData.url.toString();
//    // }
//    // alert(imageURL)

//    return (
//     <div>
//        <h2>Upload an Image</h2>
//        <label htmlFor="file_input">Upload file</label>
//        <input
      
//           className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
//           id="file_input"
//           type="file"
//        />
     
//        {/* <button>Upload</button> */}
//     </div>
//  );
// }