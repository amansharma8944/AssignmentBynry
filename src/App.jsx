

import './App.css'

import AdminDashboard from './component/AdminDashboard'
import UsersList from './component/UsersList'
import UserProfile from './component/UserProfile'
import { Route, Router, Routes } from 'react-router-dom'
import Navbar from './component/Navbar'
import ProfileMainWrapper from './component/ProfileOVerViewMainWrapper'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>


      <Navbar /> {/* Optional Navigation */}
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/" element={<ProfileMainWrapper />} />
      </Routes>
  
    </>
  )
}

export default App

