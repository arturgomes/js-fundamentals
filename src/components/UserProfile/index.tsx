import React, { useEffect, useMemo, useState } from "react";
import { Post, Posts, User } from "../../interfaces"; // Importing TypeScript interfaces for type safety

// Fetches a user by userId asynchronously, handling potential errors
const fetchUser = async (userId: number) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

// Fetches posts by userId asynchronously, handling errors
const fetchPosts = async (userId: number) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
  );
  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
};

// Function that creates a closure to track fetch counts
const createFetchCounter = () => {
  let count = 0;
  return () => {
    count += 1;
    return count;
  };
};

// React component for displaying user profile and posts
export const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [posts, setPosts] = useState<Posts>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Create the fetch counter and initialize the counter function
  const incrementFetchCount = createFetchCounter();

  useEffect(() => {
    const userId = Math.floor(Math.random() * (10 - 1) + 1);

    const fetchData = async (userId: number) => {
      const fetchCount = incrementFetchCount();
      console.log(`Fetch attempt #${fetchCount}`);

      const results = await Promise.allSettled([
        fetchUser(userId),
        fetchPosts(userId),
      ]);

      if (results[0].status === "fulfilled") setUserData(results[0].value);
      if (results[1].status === "fulfilled") setPosts(results[1].value);
    };

    fetchData(userId);
  }, []);

  // Higher-order function examples with useMemo
  // Filter posts based on search query in the title
  const filteredPosts = useMemo(() => {
    return posts.filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [posts, searchQuery]);

  // Map over the posts to display the title with the word "Title: " prepended
  const mappedPosts = useMemo(() => {
    return posts.map(post => ({
      ...post,
      title: `Title: ${post.title}`
    }));
  }, [posts]);

  // Reduce to calculate the total length of all post titles
  const totalTitleLength = useMemo(() => {
    return posts.reduce((acc, post) => acc + post.title.length, 0);
  }, [posts]);

  return (
    <div>
      {userData && (
        <>
          <h1 id="userName">{userData.name}</h1>
          <p id="userEmail">Email: {userData.email}</p>
        </>
      )}

      {/* Search Input */}
      <div>
        <label htmlFor="search" id="searchLabel">Search Posts:</label>
        <input
          id="search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title..."
          aria-labelledby="searchLabel"
          aria-describedby="searchDescription"
        />
        <small id="searchDescription">Type to filter posts by title.</small>
      </div>

      <h2 id="allPostsHeading">Posts</h2>
      
      {/* Display total title length */}
      <p aria-live="polite">Total Length of All Post Titles: {totalTitleLength}</p>
      
      {/* Conditionally renders posts list if posts array is not empty */}
      {posts.length > 0 ? (
        <ul aria-labelledby="allPostsHeading">
          {mappedPosts.map((post: Post) => (
            <li key={post.id}>{post.title}</li> // Renders each post title with a unique key
          ))}
        </ul>
      ) : (
        <p aria-live="polite" role="status">Loading posts...</p>
      )}

      {/* Display filtered posts if available */}
      <h2 id="filteredPostsHeading">Filtered Posts</h2>
      {filteredPosts.length > 0 ? (
        <ul aria-labelledby="filteredPostsHeading">
          {filteredPosts.map((post: Post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      ) : (
        <p aria-live="polite" role="status">No posts matching filter criteria.</p>
      )}
    </div>
  );
};

export default UserProfile; // Exports the UserProfile component for use in other parts of the application
