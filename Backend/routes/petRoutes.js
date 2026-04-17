const express = require('express');
const router = express.Router();

let pets = [
    { 
        id: 1, 
        species: "Dog", 
        breed: "Golden Retriever", 
        status: "Owner Contacted",
        dateAdmitted: "Apr 10", 
        microchip: "985-112-000-445",
        image: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=200&h=200&auto=format&fit=crop" 
    },
    { 
        id: 2, 
        species: "Cat", 
        breed: "Siamese", 
        status: "Unidentified", 
        dateAdmitted: "Apr 11", 
        microchip: "Pending",
        image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=200&h=200&auto=format&fit=crop" 
    },
];

// GET ALL PETS
router.get('/', (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedPets = pets.slice(startIndex, endIndex);

        const unidentifiedPets = pets.filter(p => p.status === "Unidentified").length;
        const contactedPets = pets.filter(p => p.status === "Owner Contacted").length;


    res.json({
        total: pets.length,
        unidentified: unidentifiedPets,
        contacted: contactedPets,
        data: paginatedPets
    });
});

// CREATE A NEW PET
router.post('/', (req, res) => {
    const newPet = req.body;
    if (!newPet.species || typeof newPet.species !== 'string') {
        return res.status(400).json({ error: "Species must be a valid string." });
    }
    
    if (!newPet.coatColour || newPet.coatColour.length < 3) {
        return res.status(400).json({ error: "Coat colour is too short." });
    }

    if (newPet.age && (newPet.age < 0 || newPet.age > 30)) {
        return res.status(400).json({ error: "Age must be between 0 and 30." });
    }

    newPet.id = Date.now();
    pets.unshift(newPet);
    res.status(201).json(newPet);
});

// DELETE A PET
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = pets.length;
    
    pets = pets.filter(p => p.id !== parseInt(id));

    if (pets.length === initialLength) {
        return res.status(404).json({ error: "Pet not found" });
    }

    res.status(200).json({ message: "Pet deleted successfully" });
});

// UPDATE A PET
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    const index = pets.findIndex(p => p.id === parseInt(id));
    if (index === -1) return res.status(404).json({ error: "Pet not found" });

    if (updatedData.species && typeof updatedData.species !== 'string') {
        return res.status(400).json({ error: "Invalid species format" });
    }
    if (updatedData.coatColour && updatedData.coatColour.length < 3) {
        return res.status(400).json({ error: "Coat colour is too short (min 3 chars)." });
    }

    const oldPet = pets[index];

    const finalImage = (updatedData.image && updatedData.image.trim() !== "") 
        ? updatedData.image 
        : oldPet.image;

    pets[index] = { 
        ...oldPet, 
        ...updatedData, 
        image: finalImage
    };
    
    res.json(pets[index]);
});

module.exports = router;