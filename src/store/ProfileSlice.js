import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImageAndSaveProfile = createAsyncThunk(
  "profile/uploadImageAndSaveProfile",
  async ({ name, email, address, summary, socialLinks, imageFile }, thunkAPI) => {
    try {
      const storageRef = ref(storage, `profileImages/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      return { name, email, address, summary, socialLinks, imageUrl };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: { profiles: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadImageAndSaveProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadImageAndSaveProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profiles.push(action.payload);
      })
      .addCase(uploadImageAndSaveProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
