import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const useImageUpload = () => {
  const [projectImage, setProjectImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProjectImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setError(null); // Clear any previous errors
    } else {
      setError("Failed to upload image.");
    }
  };

  const clearImage = (e) => {
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
