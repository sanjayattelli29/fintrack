import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { FloatingTools } from './components/Tools/FloatingTools';
import { useAuthStore } from './store/authStore';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}


function App() {

  

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-stone-950 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

        {/* <button 
          onClick={SaveDataToAWS}
          className="m-5 p-2 bg-grey-900 dark:bg-stone-950 text-gray-100 dark:text-gray-900"> 
          SAVE 
        </button> */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
        <FloatingTools />
      </div>
    </BrowserRouter>
  );
}

export default App;
