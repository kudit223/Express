const express=require('express')
const http=require('http')
const path= require('path');
const app=express();
const port=3000;


const socketIO = require('socket.io');
const Multer=require('multer');
app.use(express.json());
// web socket
const server = http.createServer(app);
const io = socketIO(server);

//GCP storage
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    projectId: 'majestic-layout-411012', 
    keyFilename: 'mykey.json', 
  });
  //const bucketName = 'super_nova'; 
  const bucketName='testing_0011'
  const bucket = storage.bucket(bucketName);
  const uploadBucketname='super_navo_data'
  const uploadBucket=storage.bucket(uploadBucketname)
  const unreadBucketName='testing_0022';
  const unreadBucket=storage.bucket(unreadBucketName);

  //multer stuff
  const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB limit for the uploaded file
    },
  });

//EXPRESS STUFF
app.use('/static', express.static('static'))

//PUG STUFF
app.set('view engine','pug')
app.set('views',path.join(__dirname,'views'))


//END POINT
app.get('/images', async (req, res) => {
    try {
      
      const [files] = await bucket.getFiles();
  
      
      const imageLinks = files.map((file) => {
        const imageName = file.name;
       // console.log(imageName);
        return `http://127.0.0.1:${port}/image/${encodeURIComponent(imageName)}`;
      });
  
      res.json({ images: imageLinks });
    } catch (error) {
      console.error('Error listing images:', error);
      res.status(500).json({ error: 'Error listing images.' });
    }
  });
  //new folder images
  app.get('/unreadImages',async(req,res)=>{
    try{
      const[files]=await unreadBucket.getFiles();
      const oneimageLinks=files.map((file)=>{
        const  oneimageName=file.name;
      //  console.log(oneimageName);
        return `http://127.0.0.1:${port}/image/${encodeURIComponent(oneimageName)}`;
      });
      res.json({images:oneimageLinks});
    }
    catch(error)
    {
      console.error('Error listing images:',error);
      res.status(500).json({error:'Error listing images'});
    }
  })
  app.get('/image/:imageName', async (req, res) => {
    try {
      const imageName = req.params.imageName;
  
      // Create a readable stream to download the file from Google Cloud Storage
      const file = bucket.file(imageName);
      const blobStream = file.createReadStream();
      
  
      // Set the appropriate Content-Type header based on the file extension
      res.setHeader('Content-Type', 'image/jpeg');
  
      // Pipe the image data to the response stream
      blobStream.pipe(res);
    } catch (error) {
      console.error('Error retrieving image:', error);
      res.status(500).send('Error retrieving image.');
    }
  });

  // ... (Your existing server setup)
  const fileName = 'card_data.json';
  let cardData = [];
  async function loadCardData() {
    try {
      const file = uploadBucket.file(fileName);
      const [fileExists] = await file.exists();
  
      if (fileExists) {
        const fileContent = await file.download();
        cardData = JSON.parse(fileContent.toString());
      }
    } catch (error) {
      console.error('Error loading card data:', error);
    }
  }
  
  // Endpoint for handling image and text data
  app.post('/uploadCard', async (req, res) => {
    try {
      const { imageData, inputData } = req.body;
  
      // Load existing data
      await loadCardData();
  
      // Add image and text data to the array
      cardData.push({ imageData, inputData });
  
      // Create a writable stream to upload the updated JSON file to Google Cloud Storage
      const file = uploadBucket.file(fileName);
  
      // Convert the array to a JSON string
      const jsonString = JSON.stringify(cardData, null, 2);
  
      // Create a readable stream from the JSON string
      const readableStream = require('stream').Readable.from(jsonString);
  
      // Set metadata and upload the JSON file using a readable stream
      await file.save(readableStream, { metadata: { contentType: 'application/json' } });
  
      console.log('Card data stored in JSON format:');
      console.log('JSON URL:', file.publicUrl());
  
      res.status(200).send('Card data received and processed successfully.');
    } catch (error) {
      console.error('Error processing card data:', error);
      res.status(500).send('Error processing card data.');
    }
  });
  // WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');
});

// Periodically check for new images in the bucket and notify connected clients
setInterval(async () => {
  const [files] = await bucket.getFiles();
  const currentImageCount = files.length;

  // Compare current image count with the previous count
  if (currentImageCount !== previousImageCount) {
    // Notify all connected clients about the update
    io.emit('update', { type: 'update' });

    // Update the previous count
    previousImageCount = currentImageCount;
  }
}, 300);

let previousImageCount = 0;
  
  

  

app.get('/',(req,res)=>{
    res.render("Home");
});
app.get('/Home.html',(req,res)=>{
    res.render("Home");
});
app.get('/Resolve.html',(req,res)=>{
    res.render("Resolve");
});
// ... (Your existing server setup)

// Endpoint to get all card data
app.get('/Resolvedata', async (req, res) => {
  try {
      // Load existing data
      await loadCardData();

      // Send JSON data as a response
      res.json(cardData);
  } catch (error) {
      console.error('Error getting all card data:', error);
      res.status(500).json({ error: 'Error getting card data.' });
  }
});

// ... (Your existing server code)


app.get('/Unread.html',(req,res)=>{
    res.render("Unread");
});


//START THE SERVER
server.listen(port,async()=>{
  await loadCardData();
    console.log(`Linstening on port ${port}`)
})