import { useState, useEffect, use } from 'react';
/*import { initialPets } from './data/pets.js';*/
import Home from './Home';
import VetDashboard from './VetDashboard';
import AddPet from './AddPet';
import UpdatePet from './UpdatePet';
import DeletePet from './DeletePet';
import PetDetails from './PetDetails.jsx';
import './App.css';
import LostPets from "./LostPets";


function App() {
  /*const [pets, setPets] = useState(initialPets);*/

  const [pets, setPets] = useState([]);
  const [stats, setStats] = useState({unidentified: 0, contacted: 0});
  const [screen, setScreen] = useState('home'); 
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const[totalPets, setTotalPets] = useState(0);
  const limit = 5;
  const totalPages = Math.ceil(totalPets / limit);
  // --- SIMPLE DELIVERY FUNCTIONS ---

  const refreshData = () => {
    fetch(`http://localhost:3000/api/pets?page=${currentPage}&limit=5`)
      .then(response => response.json())
      .then(result => 
        {
          console.log('Fetched pets:', result); // Log the fetched data to verify it's correct
          setPets(result.data || []); 
          setTotalPets(result.total || 0); 
          setStats({unidentified: result.unidentified || 0, contacted: result.contacted || 0});
        })
      .catch(error => console.error('Error fetching pets:', error));
  };

  useEffect(() => {
    refreshData();
  }, [currentPage]);

  const handleAddPet = (newPetData) => {
    const newPet = {
        ...newPetData,
        id: Date.now(),
        dateAdmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // Changed } to ,
        
        clinic: {
          name: "Vet & Vet Cluj",
          address: "Strada Republicii 12, Cluj-Napoca",
          phone: "0712 345 678",
          mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d87426.04414603683!2d23.528352631557002!3d46.76935702677943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47490c1f916c0b8b%3A0xbbc681a73c11c9a0!2sCluj-Napoca!5e0!3m2!1sen!2sro!4v1700000000000!5m2!1sen!2s" // Added closing quote "
      }
    };


    fetch('http://localhost:3000/api/pets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPet)
    })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        alert(`Error: ${data.error || 'Unknown error'}`); 
        throw new Error(data.error || 'Failed to add pet');
  }
      return data;
    })
    .then(savedPet => {
      refreshData();
      setScreen('dashboard');
      setCurrentPage(1);
    })
    .catch(error => console.error('Error adding pet:', error));

    /*setPets([newPet, ...pets]);
    setScreen('dashboard');*/
};

  const handleUpdatePet = (updatedPetData) => {
    
    fetch(`http://localhost:3000/api/pets/${editingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedPetData)
    })

    .then(async (response) => {
      const data = await response.json();
      if(!response.ok) {
        alert(`Error updating pet: ${data.error || 'Unknown error'}`);
        throw new Error('Failed to update pet');
      }
      return data;
    })
    .then(updatedPet => {
      refreshData();
      setScreen('dashboard');
      setEditingId(null);
    })
    .catch(error => console.error('Error updating pet:', error));


    /*setPets(pets.map(p => p.id === editingId ? { ...p, ...updatedPetData } : p));
    setScreen('dashboard');
    setEditingId(null);*/
  };

  const handleRemovePet = (idToRemove) => {

    fetch(`http://localhost:3000/api/pets/${idToRemove}`, {
      method: 'DELETE'
    })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        alert(`Error deleting pet: ${data.error || 'Failed to delete pet'}`);
        throw new Error('Failed to delete pet');
      }
      refreshData();
      setScreen('dashboard');
      setEditingId(null);
    })
    .catch(error => console.error('Error deleting pet:', error));

    /*setPets(pets.filter((pet) => pet.id !== idToRemove));
    setScreen('dashboard');
    setEditingId(null);*/
  };

  return (
    <div className="app-container">
      {screen === 'home' && (
        <Home 
          setScreen={setScreen} 
          pets={pets}
          setViewingId={setViewingId} />
      )}

      {screen === 'pet-details' && (
        <PetDetails 
          pets={pets}
          viewingId={viewingId}
          setScreen={setScreen}
        />
      )}

      {screen === 'lost-pets' && (
        <LostPets 
          pets={pets}
          setScreen={setScreen}
          setViewingId={setViewingId}
        />
      )}

      {screen === 'dashboard' && (
        <VetDashboard 
          pets={pets} 
          setScreen={setScreen} 
          setEditingId={setEditingId}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages || 1}
          totalPets={totalPets}
          stats = {stats}
        />
      )}

      {screen === 'add-pet' && (
        <AddPet setScreen={setScreen} savePet={handleAddPet} />
      )}

      {screen === 'update-pet' && (
        <UpdatePet 
          setScreen={setScreen} 
          savePet={handleUpdatePet} 
          // Pass down the specific pet we want to edit!
          petToEdit={pets.find(p => p.id === editingId)} 
        />
      )}

      {screen === 'delete-pet' && (
        <DeletePet pets={pets} editingId={editingId} setScreen={setScreen} handleRemove={handleRemovePet} />
      )}
    </div>
  );
}

export default App;