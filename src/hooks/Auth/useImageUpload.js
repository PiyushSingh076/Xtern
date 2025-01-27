import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";
const useImageUpload = () => {
  const [projectImage, setProjectImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);
  const handleImageUpload = (e,setPimageError) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type! Please upload an image.", {
          position: "top-center"
        })
        return;
      }
      toast.success("File Uploaded Successfully.")
      setPimageError(false)
      setProjectImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setError(null); // Clear any previous errors
    } else {
      setError("Failed to upload image.");
    }
  };

  const clearImage = (e) => {
    toast("File cleared successfully!", {
      icon: "ℹ️", // Add an information icon
      style: {
        borderRadius: "8px",
        background: "#f5f5f5",
        color: "#333",
      },
    });
    e.stopPropagation();
    setProjectImage(null);
    setImagePreviewUrl("");
  };

  const uploadImage = async () => {
    if (!projectImage) {
      setError("No image selected.");
      return null;
    }

    setLoading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `project-images/${projectImage.name}`);
      await uploadBytes(storageRef, projectImage);
      const downloadURL = await getDownloadURL(storageRef);
      setLoading(false);
      return downloadURL;
    } catch (err) {
      setError("Failed to upload image.");
      setLoading(false);
      return null;
    }
  };

  return {
    projectImage,
    imagePreviewUrl,
    error,
    loading,
    handleImageUpload,
    clearImage,
    uploadImage,
  };
};

export default useImageUpload;
