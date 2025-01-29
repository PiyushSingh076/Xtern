import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { RichEditor } from '../../../components/RichEditor';

const EditServiceModal = ({ open, onClose, service, serviceId, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    serviceName: '',
    serviceDescription: '',
    servicePrice: '',
    duration: '',
    durationType: '',
    serviceVideo: null,
    images: []
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        serviceName: service.serviceName || '',
        serviceDescription: service.serviceDescription || '',
        servicePrice: service.servicePrice || '',
        duration: service.duration || '',
        durationType: service.durationType || '',
        serviceVideo: service.serviceVideo || null,
        images: service.images || []
      });
    }
  }, [service]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = formData.images.length + files.length;
    
    if (totalImages > 4) {
      alert('Maximum 4 images allowed');
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const storage = getStorage();
      const db = getFirestore();
      const serviceRef = doc(db, 'services', serviceId);

      // Upload new images if any
      const uploadPromises = [];
      const newImageUrls = [];

      for (const image of formData.images) {
        if (image.file) {
          const imageRef = ref(storage, `services/${serviceId}/images/${Date.now()}`);
          uploadPromises.push(
            uploadBytes(imageRef, image.file).then(snapshot => getDownloadURL(snapshot.ref))
          );
        } else {
          newImageUrls.push(image);
        }
      }

      const uploadedImageUrls = await Promise.all(uploadPromises);
      const allImageUrls = [...newImageUrls, ...uploadedImageUrls];

      // Upload new video if changed
      let videoUrl = formData.serviceVideo;
      if (formData.serviceVideo instanceof File) {
        const videoRef = ref(storage, `services/${serviceId}/video/${Date.now()}`);
        const videoSnapshot = await uploadBytes(videoRef, formData.serviceVideo);
        videoUrl = await getDownloadURL(videoSnapshot.ref);
      }

     // Create updatedService object with all the new data
     const updatedService = {
        serviceName: formData.serviceName,
        serviceDescription: formData.serviceDescription,
        servicePrice: Number(formData.servicePrice),
        duration: Number(formData.duration),
        durationType: formData.durationType,
        serviceVideo: videoUrl,
        images: allImageUrls,
      };
  
      // Update Firestore
      await updateDoc(serviceRef, updatedService);

    // Call onSaveSuccess with updated data
    onSaveSuccess(updatedService);
      onClose();
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Failed to update service. Please try again.');
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Service</DialogTitle>
      <DialogContent className="mt-4">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Service Name"
              fullWidth
              value={formData.serviceName}
              onChange={(e) => setFormData(prev => ({ ...prev, serviceName: e.target.value }))}
            />
          </Grid>
          
          <Grid item xs={12}>
  <RichEditor
    onChange={(content) => setFormData(prev => ({ 
      ...prev, 
      serviceDescription: content 
    }))}
    value={formData.serviceDescription || ""}
    placeholder="Service Description"
  />
</Grid>

          <Grid item xs={4}>
            <TextField
              label="Service Price (₹)"
              type="number"
              fullWidth
              value={formData.servicePrice}
              onChange={(e) => setFormData(prev => ({ ...prev, servicePrice: e.target.value }))}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              label="Timeline"
              type="number"
              fullWidth
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            />
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Timeline Type</InputLabel>
              <Select
                value={formData.durationType}
                label="Timeline Type"
                onChange={(e) => setFormData(prev => ({ ...prev, durationType: e.target.value }))}
              >
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <div className="flex flex-col items-center w-full">
              {!formData.serviceVideo && (
                <label className="border-2 border-dashed border-gray-400 rounded-lg w-72 h-24 flex items-center justify-center cursor-pointer">
                  <div className="flex flex-col items-center">
                    <span className="text-gray-500">Upload Video</span>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceVideo: e.target.files[0] }))}
                  />
                </label>
              )}

              {formData.serviceVideo && (
                <div className="relative w-[290px] h-[200px] border rounded-lg overflow-hidden">
                  <video
                    src={formData.serviceVideo instanceof File ? URL.createObjectURL(formData.serviceVideo) : formData.serviceVideo}
                    controls
                    className="w-full h-full"
                  />
                  <button
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6"
                    onClick={() => setFormData(prev => ({ ...prev, serviceVideo: null }))}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </Grid>

          <Grid item xs={12}>
            {formData.images.length < 4 && (
              <label className="border-2 border-dashed border-gray-400 rounded-lg w-full h-24 flex items-center justify-center cursor-pointer">
                <div className="flex flex-col items-center">
                  <span className="text-gray-500">Upload Images (Max 4)</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}

            {formData.images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative w-24 h-24 border rounded-lg overflow-hidden">
                    <img
                      src={image.preview || image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index)
                      }))}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSave}
          variant="contained" 
          disabled={saving}
          startIcon={saving && <CircularProgress size={20} />}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditServiceModal;