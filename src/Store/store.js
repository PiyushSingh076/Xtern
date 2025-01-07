// store.js
import { configureStore } from '@reduxjs/toolkit';
import roleSlice from './Slice/UserInfo'; // Import your slice
import internInfoSlice from './Slice/InternInfo'; // Import your slice
import ventureInfoSlice from './Slice/VentureInfo'; // Import your slice
import userSlice from './Slice/UserDetail'; 
import entrepreneurReducer from "./Slice/EntrepreneurDetails";// Import your slice


const store = configureStore({
  reducer: {
    role: roleSlice, // Add your slice reducer here
    internInfo: internInfoSlice, // Add your slice reducer here
    ventureInfo: ventureInfoSlice, // Add your slice reducer here
    user: userSlice, // Add your slice reducer here
    entrepreneur: entrepreneurReducer,

  },
});

export default store;
