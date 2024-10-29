import { UserCard } from "../UserCard";

export const UserComponent = () => {
  const user = { name: "Jane Doe", email: "jane@example.com" };
  const updatedUser = { ...user, age: 30 }; // spreading user and adding age

  return <UserCard user={updatedUser} />;
};
