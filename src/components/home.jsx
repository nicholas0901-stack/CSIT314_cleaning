import React from 'react';
import '../App.css';

const Home = () => {
  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
        <div className="container ">
          <a className="navbar-brand fw-bold" href="/">TeamABC Cleaning</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" href="#services">Services</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">Why Us</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#team">Our Team</a>
              </li>
              <li className="nav-item">
                <a className="btn btn-outline-light btn-sm ms-2" href="/login">Login</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Page Content */}
      <div className="container py-5">
   {/* Hero Section */}
<div className="bg-hero text-white py-5">
  <div className="row align-items-center justify-content-center px-5">
    <div className="col-lg-8 text-center">
      <h1 className="display-4 fw-bold">Welcome to TeamABC Cleaning Service</h1>
      <p className="lead">
        We provide top-notch residential and commercial cleaning solutions tailored to your needs.
      </p>
      <a href="/login" className="btn btn-light btn-lg mt-3">Get Started</a>
    </div>
  </div>
</div>




        {/* Services Section */}
<div className="bg-info bg-opacity-10 rounded-3 py-5 my-5" id="services">
  <div className="text-center mb-5">
    <h2 className="fw-bold">Our Services</h2>
    <p className="text-muted">We cover a wide range of cleaning needs</p>
  </div>

  <div className="row g-4 px-3 px-md-5">
    <div className="col-md-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h5 className="card-title text-primary">House Cleaning</h5>
          <p className="card-text">Routine and deep cleaning for your home, kitchens, and bathrooms included.</p>
        </div>
      </div>
    </div>
    <div className="col-md-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h5 className="card-title text-primary">Post-Renovation</h5>
          <p className="card-text">We clear all debris, dust, and stains after your renovations are complete.</p>
        </div>
      </div>
    </div>
    <div className="col-md-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h5 className="card-title text-primary">Office Cleaning</h5>
          <p className="card-text">Keep your workspace tidy and hygienic with our regular or one-time office services.</p>
        </div>
      </div>
    </div>
  </div>
</div>


      {/* About Section */}
      <div className="my-5 py-5 px-3 rounded text-center" id="about">
        <h3 className="fw-bold mb-5">Why Choose TeamABC?</h3>

        <div className="row justify-content-center g-4">
          {[
            "✔ Experienced and friendly professionals",
            "✔ Eco-friendly cleaning products",
            "✔ Flexible scheduling and affordable pricing",
            "✔ 100% satisfaction guaranteed",
          ].map((point, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <p className="card-text text-start">{point}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


        {/* Our Team Section */}
        <div className="my-5 pt-5 text-center" id="team">
          <h2 className="fw-bold mb-4">Meet Our Team</h2>
          <div className="row g-4">
            {[
              { name: "", title: "Team Member", image: "/img/team/team-member1.jpg", desc: "Edit bio." },
              { name: "", title: "Team Member", image: "/img/team/team-member1.jpg", desc: "Edit bio." },
              { name: "", title: "Team Member", image: "/img/team/team-member1.jpg", desc: "Edit bio." },
              { name: "", title: "Team Member", image: "/img/team/team-member1.jpg", desc: "Edit bio." },
              { name: "", title: "Team Member", image: "/img/team/team-member1.jpg", desc: "Edit bio." },
              { name: "", title: "Team Member", image: "/img/team/team-member1.jpg", desc: "Edit bio." },
              { name: "", title: "Team Member", image: "/img/team/team-member1.jpg", desc: "Edit bio." },
            ].map((member, index) => (
              <div className="col-md-4" key={index}>
                <div className="card h-100 shadow-sm">
                  <img src={member.image} className="card-img-top img-fluid" alt={member.name} style={{ height: "260px", objectFit: "cover" }} />
                  <div className="card-body">
                    <h5 className="card-title">{member.name}</h5>
                    <p className="card-text text-muted">{member.title}</p>
                    <p>{member.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
