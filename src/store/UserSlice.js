// import { createSlice } from '@reduxjs/toolkit';
// import { auth } from '../firebaseConfig';
// import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';

// const initialState = {
//   user: null,
// };

// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       state.user = action.payload;
//     },
//     logoutUser: (state) => {
//       state.user = null;
//     },
//   },
// });

// export const { setUser, logoutUser } = userSlice.actions;

// // Listen for authentication changes
// export const listenForAuthChanges = () => (dispatch) => {
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       dispatch(setUser(user));
//     } else {
//       dispatch(logoutUser());
//     }
//   });
// };

// export const loginWithGoogle = () => async (dispatch) => {
//   try {
//     const provider = new GoogleAuthProvider();
//     const result = await signInWithPopup(auth, provider);
//     dispatch(setUser(result.user));
//   } catch (error) {
//     console.error('Google Login Error:', error);
//   }
// };

// export default userSlice.reducer;
