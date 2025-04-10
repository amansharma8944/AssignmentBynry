import { useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup, signInWithEmailAndPassword ,getAuth, onAuthStateChanged} from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import mixpanel from './mixpanel';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate=useNavigate()
  

  const handleGoogleLogin = async () => {
    try {
     
  signInWithPopup(auth,googleProvider )
  .then((result) => {
   
    const user = result.user;
    console.log(user)
    mixpanel.identify(user.uid);
    mixpanel.people.set({ '$name': user,
      '$email': user.email,

// Add anything else about the user here
});
mixpanel.track("Google Login", {
  distinct_id: user.uid,
email: user.email,
})


    navigate('/')
    
  }).catch((error) => {
    console.log(error)
    
  });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User UID:", user.uid);
        navigate('/');
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [navigate]);

  useEffect(() => {


    mixpanel.track("Login Page")
  },[])

 

  // const user = useSelector((state) => state.user);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Login to your account
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          <div className="rounded-md shadow-sm space-y-4">
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
                  className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
              Login
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
              onClick={handleGoogleLogin}
              className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="flex items-center">
                <img src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABcVBMVEX////pQTRChvU0qFP5uwT//v9xoPY7g/X///00f/XC1fz//f////zy+P0qe/P//v00qVE0qFbrQTbpQTb4twDqQjH/ugDsQDfnQzFChvLoRjXoQTn7//roMR/sQDL6tADoKRfpOCvqMSDtfXT51tP6wQASoD7I2voapElht3n83tn4x8Pys7H2mpjtgX3tbGPnXFHqUUL68e3yn53tYVrxrKPlPyf1z8foZ1vmLBP88/P75ebvnJb6zM3udnTpJwv0kJHui37118X6xifznwv97cDqUSz8xD/sciXoNDn89Nr0kBj503HqYyz646PuhBv65Nv/9+b+4ab5y1n53IZ/qvP7yk2zzf6Xufb+5rXo8P347btUkPTetw+1siTB5ch8rTlLqUvKtCGOyZja5/ySrzFhq0HP6NZXle5GrWHg9Od7pPbS5uKj2LA1nYE5kcSVzKA6mpk4oW89jdJbt3Q8lK0yqjg9ieG3+8J3AAANX0lEQVR4nO2dj1fbRhLHV2DF61hYsmXZ8g/JlsGKTCgBUihpDLT0Lk3TtGkvTZOG5tJzW3IlOEdLrzT9629WhsQ29nplryzn3X4eL3kJRtJXM7MzO7sSCAkEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIPi/QFGRrGAky0M/geF7Kobvq1O8LK7IctL/e2f5+sp7qzfW1os+62u3FzdXri9tdD6EMR5+E2afjes3b5hVy3Ic27FtyQbyEvmHU6tWnfc3t5bJp3DUlzkmG1urRq1mGXZGkkqSLUmSLvlkMuSrKIFUp2p9sL0c9ZUGQcXwRUzy8OZ61XIkBgynemvzQ0QsCXE76x5Lrg/07W6Xqo5hSHkmhbaedyxncwn5ImddoQJ/XL9ddYpFA9zSYFEIFPWi5DTXV2DsSUYtYSQb207NyRhSxrT1EqNA0zAgVHXbsjYfzu6oA/4J9tvZrDqMsgbiVBd3IZMm5ZnTqShJTPTtO/okAkGivU804mRZiVpTLzI4l7pXs2xWxxyCCTnEqe4pZMiJWlMvUHZtQR6HAYNp+KRIhAE44zhbSJ2hSk6RIQZ312qTSevFen8DIntWREJ1jfb2MyZPhba9v93JrrPB7rpVZE19jBR1YsZZGW229jP2hOHXTwayo1P9KGplAJSgyY+bEw6gw9D398jkKmqNu0VLZ67OAmGYunUDR17GfVS1M2Y+FCPmddN21jciFri9b5sZ9go7ELYOR7Zru9GpgxjcrIYhrQvdNveXIyvGVbRqhSxQMvPOIpLLUUlcrE1YZo8mb32MykkckcJFyw5dobVKinocwXgKd3UxbBfVTb22GFkvFQaZ8GOwZC2iZGQJ/2bYoyjYsPYxmQpHJPH6vh1KDuwGLAi+EoVArKDlfcnv8AYik5EMHZD8zjD8i0LelGqLkfXCVbzjBDaIr8xXB/MGwzBsiToO+zEYYdG9FligZDuOVa1ZDmBZ1arl0DNN0YoyBtF7lhHIRW2n1lx7b2VpeaczZ9/ZXVrZu2HRmv5RxqCMlpom0yhjSGYR3NGqrm0vDTrW7tYHRGRRMnpDMm/4MRgRSRknySoZC6ZUsu3m2srO8MMpW7ebTqYk9fR4zFKN5MGIMj2YcNWBa2BRaEvO/ury8NUWxf/f3c2mY/co1CONQQyZUGLsiTrVzR3SK1YUZeDVylCQEe3Jvd6A7KSJqPpsCpaoecynaJt25lZ1kXF6jtHGYtPQ/djWjYwVXS3q88nocrRYzEgla33g6DIIRUFoyXT8O2dEW4sCu006pibYGT1PumQKYyzJsgwaVzuFbrR5ELjtjK7WTMm5tQTjSFKRmTq6KgYUCHBTssGCOLqNC0oSLdUMnWrDfMmQ8s5tSoIYzsNbTvVvke7LgDJxzRihEARmmptjnmCntBntxhMZ/b2q6wa1noEqpnoTjbfeoCLf9JH2uO986ugSNdvbmeYKXOtYuQziFlRGut50t1LPfpaHwbQ0ZCUNfHh/JcILnJh7sWws9vl90ygOHk/tYr65/e7uwkPoi2ysHsvWv7wvDR5tzKIOg0zkS0UT8AAsCNQr5uDCzS7dugH1yMys2wYDqoxyJdahnvvqfmbAiJqx9XfYQzFGX2djF9T/cV/XLxlSb0a4TDQxUM/cu9AHSuuf5vOXFEIinJV19zGQ0ReVNyYEjZA27veH4dqsbfIJRI+Tdjz18/t2d/dBrz5EUayg8AKjO7E+6l/mS1150YKashz1ZU7CN5UeedlO2njTzigZVhIlZ333K5VHfQbs+OxXF8FYrN2EilJ5h7MF+rYvDN+kjbzkT6is8artGWKQPiLx01JGsnXT2nunyzXgi8oQiTFIG2bebu68yxU34dFAJ71IG6aziqLaTcADVVEgDOtDNcJso/YhowllWeVRmssYqzzrJzk5LAzPJVY+Q4rCdOGqwmvvL0+BcPHloWFIIrEefUyanizHwgsvr/DgSefJDl5gfPedOjFJuFNaCBtyJ0QmX+CqXMyouYfRvbV+WGc/y7nlTe4RtBXRjP8y6tb88xd/x5Z/rSXdMndwxkLwD6IHc9cPzcGUpk+byTOn5Zhdj3Lbyf0y6v2IemHBsoe5HZ47pk/vkT/Sx2pYJVs3sVHDTdQ71/z3OOTtt+pnIkybTQwZfVXJfxtRB1rptzuNNL/szu+A3wvvHEy29E3AH8RrHzXg6rVeRedh54tWZ5N/7dSfZ5xp17yMql7MWtuts0YbX/7BojN/Nt9ZwgBprpdunHZWpaBgiOo354wLpLMkJgv/56Ni+6jVOj1sNM6ARuPw8KTVOrrwS5WsuMkzMYkQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgmIT/AW85oItYFHqLAAAAAElFTkSuQmCC"} alt="Google logo" className="h-5 w-5 mr-2" />
                Login with Google
              </span>
              
            </button>
            <span className="flex items-center">
                {/* <img src={"data:image/png;base64,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"} alt="Google logo" className="h-5 w-5 mr-2" /> */}
                  Don't have an account? <Link to="/signup" className="text-blue-600 hover:text-blue-500">Sign Up</Link>
              </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
