import { useUser } from '@clerk/clerk-react';

export default function Profile() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return (
    <div>
      <p>User ID: {user.id}</p>
      <p>Phone: {user.primaryPhoneNumber?.phoneNumber}</p>
      {/* Add more fields as needed */}
    </div>
  );
}