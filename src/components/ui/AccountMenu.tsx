import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { User } from 'lucide-react';

export function AccountMenu() {
  const navigate = useNavigate();
  const { profile, getCurrentAccount } = useAuthStore();
  const currentAccount = getCurrentAccount();

  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Current Account: <span className="font-medium text-gray-900 dark:text-gray-100">{currentAccount?.name}</span>
      </div>
      <button
        onClick={() => navigate('/profile')}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <img
          src={profile.image}
          alt={profile.name}
          className="h-8 w-8 rounded-full object-cover"
        />
        <span>{profile.name}</span>
      </button>
    </div>
  );
}