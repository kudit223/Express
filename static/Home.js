


const socket = io();

socket.on('update', (data) => {
  console.log('Received update from the server:', data);
  playNewImageSound();
  playGlowAnimation();
  fetchAndDisplayImages();
  updateResolvedCountOnHome()
  
  updateUnreadCountonHome();

});



function fetchAndDisplayImages() {
  // Fetch images from the server
  fetch('http://127.0.0.1:3000/images')
    .then(response => response.json())
    .then(data => {
      const cardContainer = document.getElementById('cardContainer');
      cardContainer.innerHTML = ''; // Clear existing cards

      // Iterate through images in reverse order to display the latest one at the top
      for (let i = data.images.length - 1; i >= 0; i--) {
        const imageUrl = data.images[i];

        const card = document.createElement('div');
        card.classList.add('card');

        // Create a text element for the card
        const newText = document.createElement('div');
        newText.classList.add('Card-text');
        card.appendChild(newText);

        // fire saftey
        let imageName = '';
        for (let j = 0; j < imageUrl.length; j++) {
          if (imageUrl[j] === '%') {
            j = j + 3;
            while (j < imageUrl.length && imageUrl[j] !== '_') {
              imageName += imageUrl[j];
              j++;
            }
            break;
          }
        }
        imageName = imageName.replaceAll('%20', ' ');
        newText.textContent = imageName;

        // Create an image element for the card
        const newImage = document.createElement('img');
        newImage.src = imageUrl;
        newImage.alt = 'Card Image';

        // Append text and image elements to the card, then append the card to the container
        card.appendChild(newImage);
        cardContainer.appendChild(card);
      }
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

//Resolve count
function updateResolvedCountOnHome() {
  fetch('http://127.0.0.1:3000/Resolvedata')
    .then(response => response.json())
    .then(data => {
      const resolvedCount = data.length;
      const resolvedCountElement = document.getElementById('resolvedCount');
      resolvedCountElement.textContent = `(${resolvedCount || 0})`;
    })
    .catch(error => console.error('Error fetching resolved count:', error));
}

document.addEventListener('DOMContentLoaded', function () {
  updateResolvedCountOnHome();
});
function updateUnreadCountonHome() {
  fetch('http://127.0.0.1:3000/images')
    .then(response => response.json())
    .then(data => {
      console.log('API Response:', data);

      if (data && data.images) {
        const unreadcount = data.images.length;
        console.log('Unread Count:', unreadcount);

        const unreadcountElement = document.getElementById('unreadcount');
        console.log('Unread Count Element:', unreadcountElement);

        if (unreadcountElement) {
          unreadcountElement.textContent = `(${unreadcount || 0})`;
        } else {
          console.error('Element with ID "unreadcount" not found.');
        }
      } else {
        console.error('Invalid API response format. Ensure the API returns an object with an "images" property.');
      }
    })
    .catch(error => console.error('Error fetching unread count:', error));
}

document.addEventListener('DOMContentLoaded', function () {
  updateUnreadCountonHome();
});









