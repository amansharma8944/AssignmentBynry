import { useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebaseConfig'; // Adjust the import path as necessary
import { signInWithPopup, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';
import mixpanel from "./mixpanel"
// import { connectStorageEmulator } from 'firebase/storage';
// import { useDispatch, useSelector } from 'react-redux';
// import {  SinupWithPop } from '../store/UserSlice';
// import googleLogo from '../assets/google-logo.png'; // Download a Google logo image

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
//   const navigate = Navigate();
  const navigate=useNavigate()
//   const dispatch=useDispatch()

  const handleGoogleSignIn = async () => {
    try {
   
        signInWithPopup(auth, googleProvider)
        .then((result) => {
            navigate('/login')
         console.log(result)
        }).catch((error) => {
         console.log(error)
        });
      

        mixpanel.track("Google SignUp")

      console.log("dkfdkjfdkj")


    
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
       
   
        navigate('/login')
      console.log(userCredential)

      mixpanel.track("Email SignUp",{
        Email:email
      })
    })
      
    } catch (err) {
      setError(err.message);
    }

  };


  
  onAuthStateChanged(auth, (user) => {
    if (user) {
     
      const uid = user.uid;
      console.log(uid)
   
      console.log(uid)
    } else {
      console.log("not registered")
    }
  });
   

  useEffect(() => {
     mixpanel.track("SignUp Page")

  },[])


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleEmailSignUp}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              onClick={handleGoogleSignIn}
              className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="flex items-center">
                <img src={"data:image/png;base64,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"} alt="Google logo" className="h-5 w-5 mr-2" />
                Sign up with Google
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;