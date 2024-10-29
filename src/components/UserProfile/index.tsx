import React, { useEffect, useState } from "react";

export interface User {
  id: number
  name: string
  username: string
  email: string
  address: Address
  phone: string
  website: string
  company: Company
}

export interface Address {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: Geo
}

export interface Geo {
  lat: string
  lng: string
}

export interface Company {
  name: string
  catchPhrase: string
  bs: string
}


const fetchUserData = async () => {
  try {
    const userId = Math.floor(Math.random() * (10 - 1) + 1)
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    console.log("User Data:", data);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};


export const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUserData();
      setUser(userData);
    };
    fetchData();
  }, []);

  return (
    <div>
      {user ? (
        <>
          <h1>{user.name}</h1>
          <p>Email: {user.email}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;
