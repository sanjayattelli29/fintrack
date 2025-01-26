import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';

export function Profile() {
  const navigate = useNavigate();
  const {
    profile,
    logout,
    updateProfile,
    accounts,
    currentAccountId,
    addAccount,
    updateAccount,
    deleteAccount,
    setCurrentAccount,
  } = useAuthStore();

  const [newAccountName, setNewAccountName] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateProfile({
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      image: formData.get('image') as string,
      currency: formData.get('currency') as string,
    });
  };

  const handleAddAccount = () => {
    if (newAccountName.trim()) {
      addAccount(newAccountName.trim());
      setNewAccountName('');
    }
  };

  const handleUpdateAccount = (id: string, name: string) => {
    updateAccount(id, name);
    setIsEditing(null);
  };

  const handleDeleteAccount = (id: string) => {
    if (accounts.length > 1 && confirm('Are you sure you want to delete this account?')) {
      deleteAccount(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="h-32 w-32 rounded-full object-cover"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Profile Image URL</label>
                <input
                  name="image"
                  type="text"
                  defaultValue={profile.image}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  type="text"
                  defaultValue={profile.name}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  name="phone"
                  type="text"
                  defaultValue={profile.phone}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Preferred Currency</label>
                <select
                  name="currency"
                  defaultValue={profile.currency}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Profile
              </button>
            </form>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mt-6"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Accounts Section */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Account Management</h2>
            
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="New account name"
                  className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
                />
                <button
                  onClick={handleAddAccount}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className={`p-4 rounded-lg border ${
                      account.id === currentAccountId
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {isEditing === account.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          defaultValue={account.name}
                          className="flex-1 p-2 border rounded-lg dark:bg-gray-700"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateAccount(account.id, e.currentTarget.value);
                            }
                          }}
                          onBlur={(e) => handleUpdateAccount(account.id, e.target.value)}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setCurrentAccount(account.id)}
                          className="flex-1 text-left font-medium"
                        >
                          {account.name}
                          {account.id === currentAccountId && (
                            <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">
                              (Current)
                            </span>
                          )}
                        </button>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setIsEditing(account.id)}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          {accounts.length > 1 && (
                            <button
                              onClick={() => handleDeleteAccount(account.id)}
                              className="p-1 text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}