import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig"; // Ensure Firestore is configured
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await getDocs(collection(db, "users"));
      setUsers(usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <Link to={`/user/${user.id}`}>{user.name}</Link> - {user.address}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
