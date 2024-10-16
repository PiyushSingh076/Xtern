// store.js
import { configureStore } from '@reduxjs/toolkit';
import roleSlice from './Slice/UserInfo'; // Import your slice
import internInfoSlice from './Slice/InternInfo'; // Import your slice


const store = configureStore({
  reducer: {
    role: roleSlice, // Add your slice reducer here
    internInfo: internInfoSlice, // Add your slice reducer here
  },
});

export default store;
