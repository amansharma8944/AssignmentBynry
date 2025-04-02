import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useParams } from 'react-router-dom';
import { FiMapPin, FiMail, FiUser, FiClock, FiRefreshCw, FiLink, 
         FiGithub, FiInstagram, FiLinkedin, FiTwitter, FiYoutube } from 'react-icons/fi';

const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userId) {
          throw new Error("No user ID provided");
        }

        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          throw new Error("User not found");
        }

        const userData = docSnap.data();
        
        // Validate required fields
        if (!userData.name || !userData.email) {
          throw new Error("Invalid user data");
        }

        setProfile({
          id: docSnap.id,
          name: userData.name || '',
          email: userData.email || '',
          status: userData.status || 'Unknown',
          avatar: userData.avatar || '',
          address: userData.address || '',
          summary: userData.summary || '',
          social: {
            github: userData.social?.github || '',
            instagram: userData.social?.instagram || '',
            linkedin: userData.social?.linkedin || '',
            twitter: userData.social?.twitter || '',
            youtube: userData.social?.youtube || '',
          },
          createdAt: userData.createdAt || '',
          updatedAt: userData.updatedAt || ''
        });

      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err.message || "Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleMapClick = () => {
    if (profile?.address) {
      const encodedAddress = encodeURIComponent(profile.address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl p-4 bg-red-50 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-xl">No profile data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-indigo-600 p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <FiUser className="text-indigo-600 text-4xl" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="flex items-center mt-1">
                <FiMail className="mr-2" />
                {profile.email}
              </p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                profile.status === 'Active' ? 'bg-green-100 text-green-800' :
                profile.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {profile.status}
              </span>
            </div>
            {profile.address && (
              <button 
                onClick={handleMapClick}
                className="flex items-center bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 transition-colors"
              >
                <FiMapPin className="mr-2" /> View on Map
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* About Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <FiUser className="mr-2 text-indigo-600" /> About
            </h2>
            <p className="text-gray-600 whitespace-pre-line">
              {profile.summary || 'No information provided'}
            </p>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-500">
              <FiClock className="mr-2 text-indigo-600" />
              <span>Joined: {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}</span>
            </div>
            {profile.updatedAt && (
              <div className="flex items-center text-gray-500">
                <FiRefreshCw className="mr-2 text-indigo-600" />
                <span>Updated: {new Date(profile.updatedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <FiLink className="mr-2 text-indigo-600" /> Social Links
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.social.github && (
                <a 
                  href={`https://github.com/${profile.social.github}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-indigo-600 p-2 hover:bg-gray-50 rounded"
                >
                  <FiGithub className="mr-3 text-lg" /> GitHub
                </a>
              )}
              {profile.social.twitter && (
                <a 
                  href={`https://twitter.com/${profile.social.twitter}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-indigo-600 p-2 hover:bg-gray-50 rounded"
                >
                  <FiTwitter className="mr-3 text-lg" /> Twitter
                </a>
              )}
              {profile.social.instagram && (
                <a 
                  href={`https://instagram.com/${profile.social.instagram}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-indigo-600 p-2 hover:bg-gray-50 rounded"
                >
                  <FiInstagram className="mr-3 text-lg" /> Instagram
                </a>
              )}
              {profile.social.linkedin && (
                <a 
                  href={`https://linkedin.com/in/${profile.social.linkedin}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-indigo-600 p-2 hover:bg-gray-50 rounded"
                >
                  <FiLinkedin className="mr-3 text-lg" /> LinkedIn
                </a>
              )}
              {profile.social.youtube && (
                <a 
                  href={`https://youtube.com/${profile.social.youtube}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-indigo-600 p-2 hover:bg-gray-50 rounded"
                >
                  <FiYoutube className="mr-3 text-lg" /> YouTube
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;