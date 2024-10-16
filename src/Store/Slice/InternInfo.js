import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  internType: '',
  skillSet: [],
  availability: '',
  currentlyStudying: '',
  graduationYear: null
};

const internInfoSlice = createSlice({
  name: 'internInfo',
  initialState,
  reducers: {
    setInternInfo: (state, action) => {
      const { internType, skillSet, availability, currentlyStudying, graduationYear } = action.payload;
      state.internType = internType;
      state.skillSet = skillSet;
      state.availability = availability;
      state.currentlyStudying = currentlyStudying;
      state.graduationYear = graduationYear;
    },
    resetInternInfo: (state) => {
      return initialState;
    }
  }
});

export const {
  setInternInfo,
  resetInternInfo
} = internInfoSlice.actions;

export default internInfoSlice.reducer;

