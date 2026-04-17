import React, { useState } from 'react';
import logo from './assets/logo.png';

function UpdatePet({ setScreen, savePet, petToEdit }) {
  const [formData, setFormData] = useState({
    species: petToEdit?.species || 'Dog',
    coatColour: petToEdit?.coatColour || '',
    eyeColour: petToEdit?.eyeColour || '',
    traits: petToEdit?.traits || '',
    age: petToEdit?.age || '',
    microchip: petToEdit?.microchip === 'Found' ? 'yes' : 'no',
    healthState: petToEdit?.healthState || '',
    image: petToEdit?.image || '',
    status: petToEdit?.status || 'Unidentified'
  });

  const handleMicrochipChange = (val) => {
    setFormData({ 
      ...formData, 
      microchip: val, 
      status: val === 'no' ? 'Unidentified' : formData.status 
    });
  };

  const onSubmit = () => {
    savePet({
      species: formData.species,
      coatColour: formData.coatColour,
      eyeColour: formData.eyeColour,
      traits: formData.traits,
      age: formData.age,
      healthState: formData.healthState,
      status: formData.status,
      image: formData.image,
      microchip: formData.microchip === 'yes' ? 'Found' : 'None'
    });
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="brand-section" onClick={() => setScreen('home')}>
          <img src={logo} alt="FetchBack Logo" className="logo" style = {{ width: '100px', height: '100px', objectFit: 'contain' }} />
          <span className="brand-text text-black">Fetch</span>
          <span className="brand-text text-green">Back</span>
        </div>
      </nav>

      <div className="main-content">
        <span className="back-link" onClick={() => setScreen('dashboard')}>&lt; Back</span>
        <h1 className="page-title">Update Pet Details</h1>

        <div className="add-pet-grid">
          <div className="upload-placeholder">
            {formData.image ? (
              <img 
                src={formData.image} 
                alt="Pet Preview" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
              />
            ) : (
              <span>No image uploaded</span>
            )}
          </div>

          <div className="form-container">
            <h3>Appearance:</h3>
            <div className="input-group">
              <label>Species:</label>
              <select 
                value={formData.species} 
                onChange={(e) => setFormData({...formData, species: e.target.value})}
                style={{ flex: 1, padding: '10px', backgroundColor: '#f1f1f1', border: 'none', borderRadius: '6px' }}
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Horse">Horse</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="input-group">
              <label>Coat colour:</label>
              <input type="text" value={formData.coatColour} onChange={(e) => setFormData({...formData, coatColour: e.target.value})} />
            </div>
            
            <div className="input-group">
              <label>Eye colour:</label>
              <input type="text" value={formData.eyeColour} onChange={(e) => setFormData({...formData, eyeColour: e.target.value})} />
            </div>
            
            <div className="input-group">
              <label>Distinctive traits:</label>
              <input type="text" value={formData.traits} onChange={(e) => setFormData({...formData, traits: e.target.value})} />
            </div>
            
            <div className="input-group">
              <label>Age:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="number" 
                  min="0"
                  max="30"
                  value={formData.age} 
                  onChange={(e) => setFormData({...formData, age: e.target.value})} 
                  style={{ 
                    width: '80px', 
                    padding: '10px', 
                    backgroundColor: '#f1f1f1', 
                    border: 'none', 
                    borderRadius: '6px',
                    textAlign: 'center', 
                    flex: 'none' 
                  }} 
                />
                <span style={{ color: '#888', fontSize: '14px', fontWeight: 'bold' }}>years</span>
              </div>
            </div>

            <h3 style={{ marginTop: '30px' }}>Health:</h3>
            <div className="input-group">
              <label>Microchip:</label>
              <div className="radio-group">
                <button type="button" className={formData.microchip === 'yes' ? 'active' : ''} onClick={() => handleMicrochipChange('yes')}>Yes</button>
                <button type="button" className={formData.microchip === 'no' ? 'active' : ''} onClick={() => handleMicrochipChange('no')}>No</button>
              </div>
            </div>
            
            <div className="input-group">
              <label>Health state after clinical exam:</label>
              <textarea rows="3" value={formData.healthState} onChange={(e) => setFormData({...formData, healthState: e.target.value})} />
            </div>

            <div className="input-group" style={{ marginBottom: '30px' }}>
              <label>Initial Status:</label>
              <div className={`status-slider-container ${formData.microchip === 'no' ? 'is-disabled' : ''}`}>
                <div className={`status-glider ${formData.status.replace(' ', '-').toLowerCase()}`}></div>
                <button type="button" className={formData.status === 'Unidentified' ? 'active' : ''} onClick={() => setFormData({...formData, status: 'Unidentified'})}>Unidentified</button>
                <button type="button" disabled={formData.microchip === 'no'} className={formData.status === 'Pending Contact' ? 'active' : ''} onClick={() => setFormData({...formData, status: 'Pending Contact'})}>Pending</button>
                <button type="button" disabled={formData.microchip === 'no'} className={formData.status === 'Owner Contacted' ? 'active' : ''} onClick={() => setFormData({...formData, status: 'Owner Contacted'})}>Contacted</button>
              </div>
            </div>

            <div className="form-actions">
              {/* Changed handleSavePet to onSubmit */}
              <button className="btn-upload" onClick={onSubmit}>Save Changes</button>
              <button className="btn-cancel" onClick={() => setScreen('dashboard')}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdatePet;