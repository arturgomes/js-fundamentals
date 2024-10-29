import React, { useEffect, useState } from "react";
import { Posts, User } from "../../interfaces"; // Importing TypeScript interfaces for type safety

// Fetches a user by userId asynchronously, handling potential errors
const fetchUser = async (userId: number) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    );
    if (!response.ok) throw new Error("Network response was not ok"); // Checks if the response is successful
    const data = await response.json(); // Parses the JSON data
    console.log("User Data:", data);
    return data; // Returns the fetched data
  } catch (error) {
    console.error("Fetch error:", error); // Logs any fetch errors
    return null; // Returns null if there's an error, allowing for handling in the calling function
  }
};

// Fetches posts by userId asynchronously, handling errors
const fetchPosts = async (userId: number) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
  );
  if (!response.ok) throw new Error("Failed to fetch posts"); // Checks for a successful response
  return response.json(); // Returns the parsed JSON posts data
};

// Function that creates a closure to track fetch counts
const createFetchCounter = () => {
  let count = 0; // This is the variable that will be "remembered" in the closure
  return () => {
    count += 1;
    return count;
  };
};

// React component for displaying user profile and posts
export const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null); // State to store user data or null if not available
  const [posts, setPosts] = useState<Posts>([]); // State to store posts data as an array

   // Create the fetch counter and initialize the counter function
   const incrementFetchCount = createFetchCounter();

  useEffect(() => {
    const userId = Math.floor(Math.random() * (10 - 1) + 1); // Generates a random userId between 1 and 9

    // Asynchronous function to fetch user and posts data in parallel
    const fetchData = async (userId: number) => {
      
      // Increment the fetch count each time this function is called
      const fetchCount = incrementFetchCount();
      console.log(`Fetch attempt #${fetchCount}`);

      // Promise.allSettled is used to ensure each API call is handled independently, even if one fails.
      const results = await Promise.allSettled([
        fetchUser(userId),
        fetchPosts(userId),
      ]); // Fetches user and posts data simultaneously, handling each as independent promises

      const userResult = results[0]; // First result is from fetchUser
      const postsResult = results[1]; // Second result is from fetchPosts

      // Checks if fetchUser was successful and updates userData state
      if (userResult.status === "fulfilled") setUserData(userResult.value);
      
      // Checks if fetchPosts was successful and updates posts state
      if (postsResult.status === "fulfilled") setPosts(postsResult.value);
    };

    fetchData(userId); // Calls fetchData with the generated userId on component mount
  }, []); // Empty dependency array so this effect runs only once on component mount

  return (
    <div>
      {userData && ( // Conditionally renders user data if available
        <>
          <h1>{userData.name}</h1>
          <p>Email: {userData.email}</p>
        </>
      )}
      <h2>Posts:</h2>
      {posts.length > 0 ? ( // Conditionally renders posts list if posts array is not empty
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li> // Renders each post title with a unique key
          ))}
        </ul>
      ) : (
        <p>Loading posts...</p> // Shows loading message if posts are not yet loaded
      )}
    </div>
  );
};

export default UserProfile; // Exports the UserProfile component for use in other parts of the application
