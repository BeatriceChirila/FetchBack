const express = require('express');
const cors = require('cors');

const petRoutes = require('./routes/petRoutes');

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json()); 

app.use('/api/pets', petRoutes);


app.get('/', (req, res) => {
    res.send('Welcome!');
});


app.listen(PORT, () => {
    console.log(`✅ FetchBack server is running on http://localhost:${PORT}`);
});