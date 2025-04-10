

import './App.css'

import AdminDashboard from './component/AdminDashboard'
import UsersList from './component/UsersList'
import UserProfile from './component/UserProfile'
import { Route, Router, Routes, useNavigate } from 'react-router-dom'
import Navbar from './component/Navbar'
import ProfileMainWrapper from './component/ProfileOVerViewMainWrapper'
import Signup from './component/SignUp'
import LoginPage from './component/LoginPage'
// import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebaseConfig'
// import { listenForAuthChanges } from './store/UserSlice'

function App() {
  const navigate=useNavigate()
  // const [count, setCount] = useState(0)

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(listenForAuthChanges());  // Start listening for auth changes
  // }, [dispatch]);

  useEffect(() => {
    const innerCursor = document.querySelector(".circle-cursor-inner");
    const outerCursor = document.querySelector(".circle-cursor-outer");

    const moveCursor = (e) => {
      const { clientX: x, clientY: y } = e;
      if (innerCursor && outerCursor) {
        innerCursor.style.transform = `translate(${x}px, ${y}px)`;
        outerCursor.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    document.addEventListener("mousemove", moveCursor);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <>


      <Navbar /> 
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/" element={<ProfileMainWrapper />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/Login" element={<LoginPage/>} />
      </Routes>

      <div class="custom-cursor">
  <div class="circle-cursor circle-cursor-inner"></div>
  <div class="circle-cursor circle-cursor-outer"></div>
</div>
  
    </>
  )
}

export default App

