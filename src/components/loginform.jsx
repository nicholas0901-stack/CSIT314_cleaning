import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("Homeowner");
  const navigate = useNavigate();
  const [name, setName] = useState("Test123");

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
  
    try {
      const loginResponse = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const loginData = await loginResponse.json();
      if (loginData.success) {
        toast.success('Login Sucessfully');
        navigate("/dashboard", {
          state: {
            id: loginData.user.id,
            name: loginData.user.name,
            role: loginData.user.role
          }
        });
      } else {
        toast.error(loginData.message || "Login failed. Try again.");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong during login.');
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (!name || !email || !password || !role) {
      toast.error("Please fill all fields to register.");
      return;
    }
  
    try {
      const registerResponse = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
  
      const registerData = await registerResponse.json();
      if (registerData.success) {
        toast.success("Registration successful! Now please login.");
        setIsRegister(false); // Switch to Login screen after success
      } else {
        toast.error(registerData.message || "Failed to register. Try again.");
      }
    } catch (error) {
      console.error('Register error:', error);
      toast.error('Something went wrong during registration.');
    }
  };
  
  
  

  return (
    <>
      <div className="bg-img" />
      <section className="gradient-form">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-xl-10">
              <div
                className="card rounded-3 text-black"
                style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
              >
                <div className="row g-0">
                  <div className="col-lg-6">
                    <div className="card-body p-md-5 mx-md-4">
                      <div className="text-center">
                        <img
                          src="/img/ABClogo.JPG"
                          style={{ width: "185px" }}
                          alt="logo"
                        />
                        <h4 className="mt-4 mb-5 pb-1 fw-bold">
                          We are TeamABC cleaning service
                        </h4>
                      </div>

                      <form onSubmit={isRegister ? handleRegister : handleLogin}>
                        <p className="text-center">
                          {isRegister ? "Create a new account" : "Please login to your account"}
                        </p>

                        <div className="form-outline mb-4">
                          <label className="form-label" htmlFor="email">Username</label>
                          <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>

                        <div className="form-outline mb-4">
                          <label className="form-label" htmlFor="password">Password</label>
                          <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>

                        {isRegister && (
                            <>
                              <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="name">Name</label>
                                <input
                                  type="text"
                                  id="name"
                                  className="form-control"
                                  placeholder="Enter your full name"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                />
                              </div>

                              <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="role">Account Type</label>
                                <select
                                  id="role"
                                  className="form-select"
                                  value={role}
                                  onChange={(e) => setRole(e.target.value)}
                                >
                                  <option>Homeowner</option>
                                  <option>Cleaner</option>
                                </select>
                              </div>
                            </>
                          )}
                        <div className="d-flex flex-column align-items-center mb-4">
                          <button
                            className="btn gradient-custom-2 text-white w-100 mb-2"
                            type="submit"
                            style={{ maxWidth: "200px" }}
                          >
                            {isRegister ? "Register" : "Log in"}
                          </button>
                          <a className="text-muted small" href="#">Forgot password?</a>
                        </div>

                        <div className="d-flex align-items-center justify-content-center pb-4">
                          <p className="mb-0 me-2">
                            {isRegister ? "Already have an account?" : "Don't have an account?"}
                          </p>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => setIsRegister(!isRegister)}
                          >
                            {isRegister ? "Login" : "Create new"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Right Panel */}
                  <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                    <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                      <h4 className="mb-4">We are more than just a company</h4>
                      <p className="small mb-0 text-justify" style={{ textAlign: "justify" }}>
                        TeamABC Cleaning Service is dedicated to delivering top-tier residential and commercial cleaning solutions.
                        We specialize in general housekeeping, deep cleaning, post-renovation clean-ups, and office maintenance.
                        Our experienced team uses eco-friendly products and modern equipment to ensure a spotless, healthy environment.
                        Trust us to make your space shine — with reliability, efficiency, and care.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginForm;
