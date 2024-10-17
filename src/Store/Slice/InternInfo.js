import { createSlice } from '@reduxjs/toolkit';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('internInfo');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('internInfo', serializedState);
  } catch {
    // Ignore write errors
  }
};

const initialState = loadState() || {
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
      saveState(state);
    },
    resetInternInfo: (state) => {
      const resetState = {
        internType: '',
        skillSet: [],
        availability: '',
        currentlyStudying: '',
        graduationYear: null
      };
      saveState(resetState);
      return resetState;
    }
  }
});

export const {
  setInternInfo,
  resetInternInfo
} = internInfoSlice.actions;

export default internInfoSlice.reducer;
