import React, { useState } from 'react';
import logo from './assets/logo.png';
import './App.css'; 
import './AddPet.css';

function AddPet({ setScreen, savePet }) {
    
    const [formData, setFormData] = useState({
        species: 'Dog',
        breed: '',
        coatColour: '', 
        eyeColour: '', 
        traits: '', 
        age: '', 
        microchip: 'no',
        healthState: '', 
        status: 'Unidentified',
        image: null
    });
  
    const handleMicrochipChange = (val) => {
      setFormData({ ...formData, microchip: val, status : val === 'no' ? 'Unidentified' : formData.status });
    };

    const [imagePreview, setImagePreview] = useState(null);
   
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = () => {

        if (!imagePreview) {
            alert('Please upload a photo of the pet.');
            return;
        }

        if (!formData.coatColour.trim()) {
            alert('Please enter the coat colour of the pet.');
            return;
        }

        if(!formData.eyeColour.trim()) {
            alert('Please enter the eye colour of the pet.');
            return;
        }

        if (formData.age < 0 || formData.age > 30) {
            alert("Please enter a valid age between 0 and 30.");
            return;
        }

        savePet({
            ...formData,
            image: imagePreview,
            species: formData.species,
            coatColour: formData.coatColour,
            eyeColour: formData.eyeColour,
            traits: formData.traits,
            age: formData.age,
            health: formData.healthState,
            status: formData.status,
            microchip: formData.microchip === 'yes' ? 'Found' : 'None found'
        });
    };

    return (
    <div className="app-container">
      <nav className="navbar">
        <div className="brand-section" onClick={() => setScreen('home')}>
          <img src={logo} alt="FetchBack Logo" className="logo" style = {{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <span className="brand-text text-black">Fetch</span>
          <span className="brand-text text-green">Back</span>
        </div>
        <div className="nav-links">
          <span className="nav-item-bold" onClick={() => setScreen('dashboard')}>Vet Dashboard</span>
        </div>
      </nav>

      <div className="main-content" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <span className="back-link" onClick={() => setScreen('dashboard')}>&larr; Back to Dashboard</span>
        <h1 className="page-title" style={{ marginBottom: '30px' }}>Register New Animal</h1>

        <div className="add-pet-grid">
          {/* Left: Image Upload Area */}
          <div className="upload-placeholder" style={{ position: 'relative', cursor: 'pointer', overflow: 'hidden' }}>
            {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>No image uploaded</span>
                <span style={{ fontSize: '12px', marginTop: '10px', color: '#5d9981' }}>Click to select photo</span>
                </div>
            )}
            
            {/* area that catches the click */}
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                opacity: 0, cursor: 'pointer'
                }} 
            />
            </div>

          {/* Right: Form Fields */}
          <div className="form-container">
            <h3 style={{ borderBottom: '2px solid #f0f4f1', paddingBottom: '10px', marginTop: 0 }}>Appearance:</h3>
            <div className="input-group">
              <label>Species:</label>
              <select 
                value={formData.species} 
                onChange={(e) => setFormData({...formData, species: e.target.value})}
                style={{ flex: 1, padding: '12px 15px', backgroundColor: '#ffffff', border: '1px solid #e0e8e3', borderRadius: '12px' }}
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Horse">Horse</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className='input-group'>
              <label>Breed (optional):</label>
              <input type="text" name="breed" value={formData.breed} onChange={(e) => setFormData({...formData, breed: e.target.value})} />
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
                    padding: '12px 15px', 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e0e8e3', 
                    borderRadius: '12px',
                    textAlign: 'center', 
                    flex: 'none' 
                  }} 
                />
                <span style={{ color: '#888', fontSize: '14px', fontWeight: 'bold' }}>years</span>
              </div>
            </div>

            <h3 style={{ borderBottom: '2px solid #f0f4f1', paddingBottom: '10px', marginTop: '30px' }}>Health:</h3>
            <div className="input-group">
              <label>Microchip:</label>
              <div className="radio-group">
                <button type="button" className={formData.microchip === 'yes' ? 'active' : ''} onClick={() => handleMicrochipChange('yes')}>Yes</button>
                <button type="button" className={formData.microchip === 'no' ? 'active' : ''} onClick={() => handleMicrochipChange('no')}>No</button>
              </div>
            </div>
            
            <div className="input-group">
              <label>Exam notes:</label>
              <textarea rows="3" value={formData.healthState} onChange={(e) => setFormData({...formData, healthState: e.target.value})} />
            </div>

            <div className="input-group" style={{ marginBottom: '30px', marginTop: '20px' }}>
              <label>Initial Status:</label>
              <div className={`status-slider-container ${formData.microchip === 'no' ? 'is-disabled' : ''}`}>
                <div className={`status-glider ${formData.status.replace(' ', '-').toLowerCase()}`}></div>
                
                <button 
                  type="button"
                  className={formData.status === 'Unidentified' ? 'active' : ''} 
                  onClick={() => setFormData({...formData, status: 'Unidentified'})}
                >
                  Unidentified
                </button>
                <button 
                  type="button"
                  disabled={formData.microchip === 'no'} 
                  className={formData.status === 'Pending Contact' ? 'active' : ''} 
                  onClick={() => setFormData({...formData, status: 'Pending Contact'})}
                >
                  Pending
                </button>
                <button 
                  type="button"
                  disabled={formData.microchip === 'no'} 
                  className={formData.status === 'Owner Contacted' ? 'active' : ''} 
                  onClick={() => setFormData({...formData, status: 'Owner Contacted'})}
                >
                  Contacted
                </button>
              </div>
            </div>

            <div className="form-actions" style={{ justifyContent: 'flex-end', borderTop: '1px solid #f0f4f1', paddingTop: '20px' }}>
                <button type="button" className="btn-cancel" onClick={() => setScreen('dashboard')}>Cancel</button>
                <button type="button" className="btn-upload" onClick={onSubmit}>Upload pet</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPet;