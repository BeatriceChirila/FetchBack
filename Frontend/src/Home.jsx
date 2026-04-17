import React from "react";
import logo from "./assets/logo.png";
import "./Home.css";

function Home({ pets, setScreen, setViewingId }) {
        return (
        <div className="app-container">
            {/* Navigation */}
            <nav className="navbar">
            <div className="brand-section" onClick={() => setScreen('home')}>
                <img src={logo} alt="FetchBack Logo" className="logo" style = {{ width: '100px', height: '100px', objectFit: 'contain' }} />
                <span className="brand-text text-black">Fetch</span>
                <span className="brand-text text-green">Back</span>
            </div>

            <div className="nav-links">
                <span className="nav-item" style={{ fontSize: '17px' }} onClick={() => setScreen('lost-pets')}>
                    Lost Pets
                </span>
                <span className="nav-item" style={{ fontSize: '17px' }}>Login</span>
                <span className="nav-item-bold" onClick={() => setScreen('dashboard')} style={{ fontSize: '17px' }}>Vet Login</span>
            </div>
            </nav>

            <div className="home-content">
            {/* Hero Section */}
            <section className="hero-section">
                <h1 className="hero-title">Rooting for <span className="text-green">care</span></h1>
                <p className="hero-tagline">
                Every second counts when a pet is lost. Report sightings and connect with emergency vet clinics to help reunite families.
                </p>
                <div className="hero-buttons">
                <button className="btn-pink">Report a pet sighting</button>
                <button className="btn-green">Search lost pets</button>
                </div>
            </section>

            {/* 3 CARDS */}
            <section className="features-section">
            {/* Card 1: Sighting */}
            <div className="feature-card">
                <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <h3>Report Sightings</h3>
                <p>Spotted a lost pet? Quickly find the nearest vet clinic and help get them to safety.</p>
            </div>

            {/* Card 2: Location/Find */}
            <div className="feature-card">
                <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <h3>Find Your Pet</h3>
                <p>Search our database of lost pets currently at vet clinics waiting to be reunited.</p>
            </div>

            {/* Card 3: Network */}
            <div className="feature-card">
                <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><path d="m9 22 3-3 3 3"/><path d="M12 13v6"/></svg>
                </div>
                <h3>Vet Network</h3>
                <p>Trusted veterinary clinics caring for lost pets and helping reunite them with families.</p>
            </div>
            </section>

            {/* Recent Pets Section */}
            <section className="recent-pets-section">
                <h2>Recently Reported Lost Pets</h2>
                <p className="subtitle">These pets are currently waiting at vet clinics</p>
                
                <div className="recent-grid">
                {pets.slice(0, 4).map(pet => (
                    <div key={pet.id} className="recent-card"
                    onClick={() => {
                                    setViewingId(pet.id);
                                    setScreen('pet-details');
                                    }
                            }
                    >

                    {
                        
                        
                        pet.image ? (
                            <img
                            src={pet.image}
                            alt = {pet.species}
                            style = {{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <span style = {{ color: '#aaa', fontSize: '14px'}}>No Photo</span>
                            )
                    }
                    </div>
                ))}
                </div>

                <div className="view-all-link">
                <span className="text-green" style={{ cursor: 'pointer' }} onClick={() => setScreen('lost-pets')}>
                    View all lost pets &rarr;
                </span>
                </div>
            </section>
            </div>
        </div>
        );
  }

  export default Home;