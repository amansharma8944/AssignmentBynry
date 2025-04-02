import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, "users", id));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      }
    };
    fetchUser();
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.summary}</p>
      <p><strong>Address:</strong> {user.address}</p>
      {user.imageUrl && <img src={user.imageUrl} alt="Profile" width="100" />}

      <h3>Social Links:</h3>
      <ul>
        {user.socialLinks?.twitter && <li><a href={user.socialLinks.twitter}>Twitter</a></li>}
        {user.socialLinks?.github && <li><a href={user.socialLinks.github}>GitHub</a></li>}
        {user.socialLinks?.instagram && <li><a href={user.socialLinks.instagram}>Instagram</a></li>}
        {user.socialLinks?.linkedin && <li><a href={user.socialLinks.linkedin}>LinkedIn</a></li>}
        {user.socialLinks?.youtube && <li><a href={user.socialLinks.youtube}>YouTube</a></li>}
      </ul>
    </div>
  );
};

export default UserProfile;
