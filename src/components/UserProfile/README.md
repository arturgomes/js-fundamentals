# UserProfile Component

The `UserProfile` component is a React functional component that fetches and displays user profile information along with a list of their posts from an external API. This component demonstrates the use of `async/await` for handling asynchronous requests, as well as state management and conditional rendering in React.

## Features

- Fetches and displays user profile data, including the user’s name and email.
- Fetches and displays a list of posts associated with the user.
- Utilizes `Promise.allSettled` to handle multiple asynchronous requests concurrently, allowing for independent error handling.
- Implements error handling to manage network or API response issues gracefully.
- Renders data conditionally based on fetch status, showing loading messages if data is not yet available.

## Structure

### fetchUser(userId: number)
An asynchronous function that fetches user data by `userId` from the API. If the fetch fails, it catches and logs the error and returns `null`.

### fetchPosts(userId: number)
An asynchronous function that fetches posts by `userId` from the API. If the request fails, it throws an error to be handled by the calling function.

### Component Usage

In `UserProfile`, two pieces of state are managed:
- `userData` for storing the fetched user details.
- `posts` for storing the list of posts.

The component fetches both the user data and posts concurrently using `Promise.allSettled`, allowing for independent handling of each request’s success or failure.

