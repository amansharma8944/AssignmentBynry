import { useState, useEffect } from 'react';
import { FiUsers, FiX, FiUpload, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { 
  addDoc, collection, deleteDoc, doc, getDocs, updateDoc,
  query, orderBy, limit, startAfter 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebaseConfig';
import mixpanel from "../component/mixpanel"
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
const AdminDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    status: 'Active',
    avatar: '',
    address: '',
    summary: '',
    social: {
      instagram: '',
      twitter: '',
      linkedin: '',
      github: '',
      youtube: ''
    }
  });



  const [summaryError, setSummaryError] = useState('');

  const validateSummary = (text) => {
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    if (wordCount < 30) {
      setSummaryError(`Summary must be at least 30 words (currently ${wordCount})`);
      return false;
    }
    setSummaryError('');
    return true;
  };

  const handleSummaryChange = (e) => {
    const text = e.target.value;
    setNewUser(prev => ({ ...prev, summary: text }));
    validateSummary(text);
  };
  const [previewImage, setPreviewImage] = useState('');

  // Fetch users with pagination
  const fetchUsers = async (loadMore = false) => {
    if (!loadMore && users.length > 0) {
      return;
    }
    
    setIsLoading(true);
    try {
      let q = query(
        collection(db, "users"), 
        orderBy('name'),
        limit(10)
      );
      
      if (loadMore && lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(q);
      const newUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setUsers(prev => loadMore ? [...prev, ...newUsers] : newUsers);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length > 0);
    } catch (error) {
      console.error("Error fetching users: ", error);
      alert("Error loading users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [name]: value
      }
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `avatars/${file.name}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setPreviewImage(downloadURL);
      setNewUser(prev => ({ ...prev, avatar: downloadURL }));
    } catch (error) {
      console.error("Error uploading image: ", error);
      alert("Error uploading image. Please try again.");
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newUser.name || !newUser.email) {
      alert('Name and email are required');
      return;
    }
    if (!validateSummary(newUser.summary)) {
        return;
      }
    setIsSaving(true);
    
    try {
      const userData = {
        name: newUser.name,
        email: newUser.email,
        status: newUser.status,
        avatar: previewImage || 'https://randomuser.me/api/portraits/lego/1.jpg',
        address: newUser.address,
        summary: newUser.summary,
        social: { ...newUser.social },
        updatedAt: new Date().toISOString()
      };

      if (editingUser) {
        // Update existing user
        await updateDoc(doc(db, "users", editingUser.id), userData);
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
      } else {
        // Add new user
        userData.createdAt = new Date().toISOString();
        const docRef = await addDoc(collection(db, "users"), userData);
        setUsers([...users, { ...userData, id: docRef.id }]);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving user: ", error);
      alert("Error saving user data. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await deleteDoc(doc(db, "users", id));
      setUsers(users.filter(user => user.id !== id));
      mixpanel.track("Delte User",{Username:id})
   
    } catch (error) {
      console.error("Error deleting user: ", error);
      alert("Error deleting user. Please try again.");
    }
  };

  // Edit user
  const startEditing = (user) => {
    mixpanel.track("Edit User",{user:user.name});
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      status: user.status,
      avatar: user.avatar,
      address: user.address,
      summary: user.summary,
      social: { ...user.social }
    });
    setPreviewImage(user.avatar);
    setIsModalOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setNewUser({
      name: '',
      email: '',
      status: 'Active',
      avatar: '',
      address: '',
      summary: '',
      social: {
        instagram: '',
        twitter: '',
        linkedin: '',
        github: '',
        youtube: ''
      }
    });
    setPreviewImage('');
    setEditingUser(null);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );



const navigate=useNavigate()
  
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

  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-indigo-700 text-white">
          <div className="flex items-center justify-center h-16 px-4 bg-indigo-800">
            <h1 className="text-xl font-bold">AdminPanel</h1>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center w-full px-4 py-2 text-left rounded-lg ${activeTab === 'dashboard' ? 'bg-indigo-600' : 'hover:bg-indigo-600'}`}
            >
              <FiUsers className="mr-3" />
              Users
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <button className="mr-4 text-gray-500 md:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">User Management</h3>
              <button 
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                  mixpanel.track("Add New User",{
                    "User Type": "Admin"
                  });
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"

              >
                Add New User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.address}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'Active' ? 'bg-green-100 text-green-800' :
                          user.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => startEditing(user)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <FiEdit2 className="inline" />
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {isLoading && (
                <div className="p-4 text-center text-gray-500">Loading users...</div>
              )}
              {hasMore && !isLoading && (
                <div className="p-4 text-center">
                  <button
                    onClick={() => fetchUsers(true)}
                    className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Load More Users
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsModalOpen(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {editingUser ? 'Edit User' : 'Add New User'}
                  </h3>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {/* Profile Image Upload */}
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                      <div className="mt-1 flex items-center">
                        <span className="inline-block h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                          {previewImage ? (
                            <img src={previewImage} alt="Preview" className="h-full w-full object-cover" />
                          ) : (
                            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          )}
                        </span>
                        <label className="ml-5 relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                          <span className="flex items-center">
                            <FiUpload className="mr-2" />
                            Upload
                          </span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only" 
                            onChange={handleImageUpload}
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="sm:col-span-3">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={newUser.name}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={newUser.status}
                        onChange={handleInputChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={newUser.address}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>














                    <div className="sm:col-span-6 mb-4">
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
          Summary (Minimum 30 words)
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={6}
          value={newUser.summary}
          onChange={handleSummaryChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            summaryError ? 'border-red-500' : 'border'
          }`}
          placeholder="Enter at least 60 words describing the user..."
        />
        <div className="mt-1 text-sm text-gray-500">
          Word count: {newUser.summary.trim() === '' ? 0 : newUser.summary.trim().split(/\s+/).length}/60
        </div>
        {summaryError && (
          <p className="mt-1 text-sm text-red-600">{summaryError}</p>
        )}
      </div>







                    {/* <div className="sm:col-span-6">
                      <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                        Summary
                      </label>
                      <textarea
                        id="summary"
                        name="summary"
                        rows={3}
                        value={newUser.summary}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div> */}

                    {/* Social Media Links */}
                    <div className="sm:col-span-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Social Media Links</h4>
                      <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2">
                        {['instagram', 'twitter', 'linkedin', 'github', 'youtube'].map((platform) => (
                          <div key={platform}>
                            <label htmlFor={platform} className="block text-xs font-medium text-gray-500">
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                {platform === 'linkedin' ? 'linkedin.com/in/' : `${platform}.com/`}
                              </span>
                              <input
                                type="text"
                                name={platform}
                                id={platform}
                                value={newUser.social[platform]}
                                onChange={handleSocialChange}
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                placeholder={platform === 'youtube' ? 'channel' : 'username'}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving || !!summaryError}
                    
                      className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        isSaving ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {editingUser ? 'Updating...' : 'Saving...'}
                        </>
                      ) : (
                        editingUser ? 'Update User' : 'Save User'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;