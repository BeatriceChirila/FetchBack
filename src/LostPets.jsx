import React, { useState } from 'react';
import logo from './assets/logo.png';
import './LostPets.css';

function LostPets({ pets, setScreen, setViewingId }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPets = pets.filter(pet => {
    const search = searchTerm.toLowerCase();
    const speciesMatch = (pet.species || "").toLowerCase().includes(search);
    const breedMatch = (pet.breed || "").toLowerCase().includes(search);
    const colorMatch = (pet.coatColour || "").toLowerCase().includes(search);
    
    return speciesMatch || breedMatch || colorMatch;
  });

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="brand-section" onClick={() => setScreen('home')}>
          <img src={logo} alt="Logo" style={{ width: '40px', height: '40px' }} />
          <span className="brand-text text-black">Fetch</span><span className="brand-text text-green">Back</span>
        </div>
        <div className="nav-links">
          <span className="nav-item-bold">Lost Pets</span>
          <span className="nav-item" onClick={() => setScreen('home')}>Login</span>
          <span className="nav-item" onClick={() => setScreen('dashboard')}>Vet Login</span>
        </div>
      </nav>

      <div className="main-content">
        <div className="catalog-header">
          <h1 className="page-title">All Lost Pets</h1>
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search by breed, color, or species..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="report-banner">
          <p>Spotted a lost pet? Help them get back home. Every minute counts.</p>
          <button className="btn-pink-small">Report a sighting now</button>
        </div>

        <div className="pet-list-container">
          {filteredPets.length > 0 ? (
            filteredPets.map(pet => {
              const safeLocation = pet.clinic?.address 
                ? pet.clinic.address.split(',').pop() 
                : "Cluj-Napoca";

              return (
                <div key={pet.id} className="pet-list-row" onClick={() => {
                  setViewingId(pet.id);
                  setScreen('pet-details');
                }}>
                  <div className="list-img-box">
                    <img src={pet.image || 'placeholder.png'} alt={pet.species || "pet"} />
                  </div>
                  
                  <div className="list-info">
                    <h3>{pet.species || "Unknown"} - {pet.breed || "Unknown Mix"}</h3>
                    <p><strong>Colour:</strong> {pet.coatColour || "Unknown"} | <strong>Eyes:</strong> {pet.eyeColour || "Unknown"}</p>
                    <p><strong>Age:</strong> {pet.age || "Unknown"} | <strong>Microchip:</strong> {pet.microchip || "Unknown"}</p>
                  </div>

                  <div className="list-city">
                     <span className="location-tag">📍 {safeLocation}</span>
                  </div>

                  <div className="list-arrow">
                    <span>View Profile &rarr;</span>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>No pets match your search.</p>
          )}
        </div>

        <div className="pagination">
          <span>&lt; Previous | <strong>1</strong> | 2 | 3 | Next &gt;</span>
        </div>
      </div>
    </div>
  );
}

export default LostPets;