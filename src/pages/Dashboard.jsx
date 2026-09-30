import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <button onClick={logout} className="text-sm text-red-600 hover:underline">
          Log out
        </button>
      </div>
      <p className="text-gray-600">CMS content sections will go here on Days 6-7.</p>
    </div>
  );
}
