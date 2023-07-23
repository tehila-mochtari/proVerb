apiKey = "API_KEY"
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use('/images', express.static(path.join(__dirname, 'images')));
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);
app.use(express.static('EX6'));
app.use(bodyParser.json());
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Array to store proverbs and their likes
let counter = 0;
let proverbs = [
  { proverb: 'The early bird catches the worm', likes: 0 , index: counter++},
  { proverb: 'Actions speak louder than words', likes: 0, index: counter++ },
  // Add more proverbs here...
];


// Function to get a random proverb with an associated image
 function getRandomProverb() {
  const randomIndex = Math.floor(Math.random() * proverbs.length);
   return proverbs[randomIndex];
 }


// Route to add a new proverb
app.post('/proverbs', (req, res) => {
  const { proverb } = req.body;
  // Add the new proverb to the array
  proverbs.push({ proverb, likes: 0, index: counter++ });
  res.sendStatus(200);
});



  app.put('/proverbs/:id/likes', (req, res) => {
  const { id } = req.params;
   const { likes } = req.body;

  // Find the proverb object with the given ID
   const proverb = proverbs.find(item => item.proverb === id);

   if (proverb) {
     // Update the likes for the proverb
     proverb.likes += likes;
     res.sendStatus(200);
   } else {
     res.status(404).json({ error: 'Proverb not found' });
   }
 });

 
 // Route to get a random proverb with associated image
 app.get('/proverbs/random', (req, res) => {
   const proverb = getRandomProverb();
   // Simulate fetching an image URL based on the proverb
   const image = `./images/${encodeURIComponent((proverb.index) % 3)}.jpg`;
   res.json({ proverb: proverb.proverb, image, likes: proverb.likes });
 });

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server

app.listen(3000, () => {
    console.log("server started");
  });