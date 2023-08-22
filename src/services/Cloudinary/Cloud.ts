


export const uploadImage = async (image: File | null |string) => {
  if (image) {  
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", import.meta.env.VITE_CLOUD_PRESET);
    data.append("cloud_name",import.meta.env.VITE_CLOUD_NAME);

    // cloudinary.v2.uploader.upload
    try {
      const response = await fetch(import.meta.env.VITE_CLOUD_IMAGE_API, {
        method: "post",
        body: data
      });

      const responseData = await response.json();

      if (response.ok) {
        return responseData.secure_url;
      } else {
        return console.log("Error uploading image:", responseData);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }
};




export const uploadVideo = async (video: File | null) => {
  if (video) {
    const data = new FormData();
    data.append("file", video);
    data.append("upload_preset", import.meta.env.VITE_CLOUD_PRESET);
    data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);
    data.append("Videos", "videos"); // Specify the folder name for videos

    try {
      const response = await fetch(import.meta.env.VITE_CLOUD_VIDEO_API, {
        method: "post",
        body: data
      });

      const responseData = await response.json();

      if (response.ok) {
        return responseData.secure_url;
      } else {
        console.log("Error uploading video:", responseData);
        return null; // Return null or throw an error to indicate failure
      }
    } catch (err) {
      console.error("Fetch error:", err);
      return null; // Return null or throw an error to indicate failure
    }
  }
};