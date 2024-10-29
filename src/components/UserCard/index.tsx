type UserProps = {
  user: {
    name: string;
    email: string;
    age?: number;
  };
};
// Showing destructuring of name and email
export const UserCard: React.FC<UserProps> = ({ user: { name, email, age } }) => (
  <div>
    <h2>{name}</h2>
    <p>{email}</p>
    <p>{age}</p>
  </div>
);
