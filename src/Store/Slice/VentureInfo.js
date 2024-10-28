import { createSlice } from '@reduxjs/toolkit';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('ventureInfo');
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
    localStorage.setItem('ventureInfo', serializedState);
  } catch {
    // Ignore write errors
  }
};

const initialState = loadState() || {
  role: null,
  potential: null,
  companyName: null
};

const ventureInfoSlice = createSlice({
  name: 'ventureInfo',
  initialState,
  reducers: {
    setVentureInfo: (state, action) => {
      const { role, potential, companyName } = action.payload;
      state.role = role;
      state.potential = potential;
      state.companyName = companyName;
      saveState(state);
    },
    clearVentureInfo: (state) => {
      const resetState = {
        role: null,
        potential: null,
        companyName: null
      };
      saveState(resetState);
      return resetState;
    }
  }
});

export const { setVentureInfo, clearVentureInfo } = ventureInfoSlice.actions;
export default ventureInfoSlice.reducer;
