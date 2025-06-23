import { createSlice } from '@reduxjs/toolkit';
import { acceptVolunteersThunk, createngoThunk, getNgoProfileThunk, rejectVolunteer, requestVolunteer, updateNgoProfileThunk } from './ngo.thunk';

const initialState = {
  ngo: null,
  ngos: [],
  createNGOLoading: false,
  createNGOError: null,
  createNGOSuccess: false,
};

const ngoSlice = createSlice({
  name: 'ngo',
  initialState,
  reducers: {
    // Standard reducers for direct state manipulation if needed
    resetNGOState: (state) => {
      state.createNGOLoading = false;
      state.createNGOError = null;
      state.createNGOSuccess = false;
  
    },
  },
  extraReducers: (builder) => {
    // Extra reducers for handling async thunk actions will be added here

    builder
    .addCase(createngoThunk.pending, (state) => {
      state.createNGOLoading = true;
      state.createNGOError = null;
      state.createNGOSuccess = false;
    }
    )
    .addCase(createngoThunk.fulfilled, (state, action) => {
      state.createNGOLoading = false;
      state.ngo = action.payload;
      state.ngos.push(action.payload);
      state.createNGOSuccess = true;
    })
    .addCase(createngoThunk.rejected, (state, action) => {
      state.createNGOLoading = false;
      state.createNGOError = action.payload;
      state.createNGOSuccess = false;
    });
    
    builder.addCase(getNgoProfileThunk.pending, (state) => {
      state.createNGOLoading = true;
      state.createNGOError = null;
      state.createNGOSuccess = false;

    })
    .addCase(getNgoProfileThunk.fulfilled, (state, action) => {
      state.createNGOLoading = false;
      state.ngo = action.payload;
      state.ngos.push(action.payload);
      state.createNGOSuccess = true;
    })
    .addCase(getNgoProfileThunk.rejected, (state, action) => {
      state.createNGOLoading = false;

      state.createNGOSuccess = false;
    });

    builder.addCase(updateNgoProfileThunk.pending, (state) => {
      state.createNGOLoading = true;
      state.createNGOError = null;
      state.createNGOSuccess = false;
    })
    .addCase(updateNgoProfileThunk.fulfilled, (state, action) => {
      state.createNGOLoading = false;
      state.ngo = action.payload;
      state.ngos.push(action.payload);
      state.createNGOSuccess = true;
    })
    .addCase(updateNgoProfileThunk.rejected, (state, action) => {
      state.createNGOLoading = false;
      state.createNGOError = action.payload;
      state.createNGOSuccess = false;
    });

    builder.addCase(requestVolunteer.pending, (state) => {
      state.createNGOLoading = true;
      state.createNGOError = null;
      state.createNGOSuccess = false;
    })
    .addCase(requestVolunteer.fulfilled, (state, action) => {
      state.createNGOLoading = false;
      state.ngo = action.payload;
      
      state.createNGOSuccess = true;
    })
    .addCase(requestVolunteer.rejected, (state, action) => {
      state.createNGOLoading = false;
      state.createNGOError = action.payload;
      state.createNGOSuccess = false;
    });

    builder.addCase(rejectVolunteer.pending, (state) => {
      state.createNGOLoading = true;
      state.createNGOError = null;
      state.createNGOSuccess = false;
    })
    .addCase(rejectVolunteer.fulfilled, (state, action) => {
      state.createNGOLoading = false;
      state.ngo = action.payload;
   
      state.createNGOSuccess = true;
    })
    .addCase(rejectVolunteer.rejected, (state, action) => {
      state.createNGOLoading = false;
      state.createNGOError = action.payload;
      state.createNGOSuccess = false;
    });
    

    builder.addCase(acceptVolunteersThunk.pending, (state) => {
      state.createNGOLoading = true;
      state.createNGOError = null;
      state.createNGOSuccess = false;
    })
    .addCase(acceptVolunteersThunk.fulfilled, (state, action) => {
      state.createNGOLoading = false;
      state.ngo = action.payload;
    
      state.createNGOSuccess = true;
    })
    .addCase(acceptVolunteersThunk.rejected, (state, action) => {
      state.createNGOLoading = false;
      state.createNGOError = action.payload;
      state.createNGOSuccess = false;
    });

    
  },
});

export const { resetNGOState } = ngoSlice.actions;

export default ngoSlice.reducer;