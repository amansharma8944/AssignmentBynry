import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import ProfileOVerViewCard from "./ProfileOverviewCard";
import { FiMapPin } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import mixpanel from './mixpanel.js'; // Adjust the import based on your project structure

const ProfileMainWrapper = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  

// const navigate=useNavigate()
  
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User UID:", user.uid);
    } else {
      navigate('/login');
    }
  });

  return () => unsubscribe(); // Cleanup on unmount
}, [navigate]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const profilesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProfiles(profilesData);
      } catch (error) {
        console.error("Error fetching profiles: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

useEffect(()=>{

  mixpanel.track("Profile Page Visited", {
    "user_id": auth.currentUser ? auth.currentUser.uid : null,
  })

  },[])

  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 px-[10px] min-h-screen from-gray-700 via-gray-800 to-gray-900 bg-gradient-to-br  md:grid-cols-1 md:px-[10px] lg:grid-cols-2 xl:grid-cols-3'>
      {profiles.map((profile) => (
        <div key={profile.id} className="relative">
          <ProfileOVerViewCard 
            name={profile.name}
            email={profile.email}
            status={profile.status}
            avatar={profile.avatar}
            address={profile.address}
            summary={profile.summary}
            social={profile.social}
            {...profile}
          />
         
        </div>
      ))}
    </div>
  );
};

export default ProfileMainWrapper;