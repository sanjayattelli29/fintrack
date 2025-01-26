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

const lambdaURL = "https://jywn5dep24.execute-api.ap-south-1.amazonaws.com/dev/tasks";

function App() {

  useEffect(() => {
    async function fetchDataFromAWS() {
      try {
        const response = await fetch(
          lambdaURL
        );
        const data = await response.json();

        console.log("Data fetched from AWS:", data.data);

        // Transform the fetched data into the required format
        const formattedData = {
          state: {
            entries: data.data.reduce((acc, entry) => {
              acc[entry.date] = entry;
              return acc;
            }, {}),
          },
          version: 0,
        };

        // Save the formatted data to localStorage
        localStorage.setItem('finance-storage', JSON.stringify(formattedData));
        console.log('Data fetched and saved to localStorage:', formattedData);
      } catch (error) {
        console.error('Error fetching data from AWS:', error);
      }
    }

    fetchDataFromAWS();
  }, []);

  // Save data to AWS and update the last saved time dynamically every 30 seconds
  async function SaveDataToAWS() {
    try {
      let data = localStorage.getItem('finance-storage');
      const parsedData = JSON.parse(data || '{}');

      const response = await fetch(
        lambdaURL,
        {
          method: 'POST',
          body: JSON.stringify({
            updatedData: Object.values(parsedData.state.entries),
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }
      );

      if (response.ok) {
        console.log('Data successfully saved to AWS');
        alert("Saved Successfully");
      } else {
        console.error('Failed to save data to AWS:', response.status);
        alert("Failed to save data to AWS");
      }
    } catch (error) {
      console.error('Error saving data to AWS:', error);
      alert("Error saving data to AWS");
    }
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-stone-950 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

        <button 
          onClick={SaveDataToAWS}
          className="m-5 p-2 bg-grey-900 dark:bg-stone-950 text-gray-100 dark:text-gray-900"> 
          SAVE 
        </button>

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
