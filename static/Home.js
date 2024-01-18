

const socket = io();

socket.on('update', (data) => {
  console.log('Received update from the server:', data);
  playNewImageSound();
  playGlowAnimation();
  fetchAndDisplayImages();

});



// Function to fetch and display new images
function fetchAndDisplayImages() {
  fetch('http://127.0.0.1:3000/images')
    .then(response => response.json())
    .then(data => {
      const cardContainer = document.getElementById('cardContainer');
      cardContainer.innerHTML = ''; // Clear existing cards

      data.images.forEach(imageUrl => {
        const card = document.createElement('div');
        card.classList.add('card');

        const newText = document.createElement('div');
        newText.classList.add('Card-text');
        card.appendChild(newText);
        let imageName = '';
        for (let i = 0; i < imageUrl.length; i++) {
          if (imageUrl[i] === '%') {
            i=i+3; 
            while (i < imageUrl.length && imageUrl[i] !== '_') {
              imageName += imageUrl[i];
              i++;
            }
            break; 
          }
        }
       imageName= imageName.replaceAll("%20",'_');
        newText.textContent=imageName;
        console.log("image name",imageName);
        

        const newImage = document.createElement('img');
        newImage.src = imageUrl;
        newImage.alt = 'Card Image';

        card.appendChild(newImage);
        cardContainer.appendChild(card);
      });

    })
    .catch(error => console.error('Error fetching images:', error));
}

function playGlowAnimation() {
  const overlay = document.getElementById('overlay');
  overlay.classList.add('glow-up-down-animation');
  console.log("glow is working");

  // Change the background color to create a disco effect
  document.body.style.backgroundColor = 'rgba(255, 0, 0, 0.998)';

  // Remove the glow animation class and reset the background color after the animation duration
  setTimeout(() => {
    overlay.classList.remove('glow-up-down-animation');
    document.body.style.backgroundColor = ''; // Reset to the default background color
  }, 1000); // Adjust the duration (1000ms in this example)
}


// Function to play a sound for new images
function playNewImageSound() {
  const newImageSound = document.getElementById('newImageSound');
  if (newImageSound) {
    newImageSound.play().catch(error => console.error('Error playing sound:', error));
  }
}

// Fetch and display images initially
fetchAndDisplayImages();
