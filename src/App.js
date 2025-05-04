import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/loginform';
import Home from './components/home';
import Dashboard from "./components/dashboard"; 
import { Toaster } from 'react-hot-toast';  

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Login route */}
        <Route
          path="/login"
          element={
            <div className="login container">
              <LoginForm />
            </div>
          }
        />

        {/* Fallback for undefined routes */}
        <Route
          path="*"
          element={
            <div className="App">
              <h2>404 - Page Not Found</h2>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
