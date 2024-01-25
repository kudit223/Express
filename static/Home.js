


const socket = io();
let rcount=0;
let ucount=0;
socket.on('update', (data) => {
  console.log('Received update from the server:', data);
  playNewImageSound();
  playGlowAnimation();
  fetchAndDisplayImages();
  updateResolvedCountOnHome();
  updateUnreadCountonHome();
  updateCountsAndCreatePieChart();
 

});



function fetchAndDisplayImages() {
  // Fetch images from the server
  fetch('http://127.0.0.1:3000/images')
    .then(response => response.json())
    .then(data => {
      const cardContainer = document.getElementById('cardContainer');
      cardContainer.innerHTML = ''; // Clear existing cards

     
      for (let i = data.images.length-1; i >=0; i--) {
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
          if (imageUrl[j] === '_') {
            j++;
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
//pie data
document.addEventListener('DOMContentLoaded', function () {
  // Fetch resolved count
  const resolvedCountPromise = new Promise((resolve, reject) => {
    updateResolvedCountOnHome()
      .then(resolvedCount => resolve(resolvedCount))
      .catch(error => reject(error));
  });

  // Fetch unread count
  const unreadCountPromise = new Promise((resolve, reject) => {
    updateUnreadCountonHome()
      .then(unreadCount => resolve(unreadCount))
      .catch(error => reject(error));
  });

  // Wait for both promises to resolve
  Promise.all([resolvedCountPromise, unreadCountPromise])
    .then(([resolvedCount, unreadCount]) => {
      // Use resolvedCount and unreadCount to create the pie chart
      createPieChart(resolvedCount, unreadCount);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});


function updateResolvedCountOnHome() {
  return new Promise((resolve, reject) => {
    fetch('http://127.0.0.1:3000/Resolvedata')
      .then(response => response.json())
      .then(data => {
        const resolvedCount = data.length;
        const resolvedCountElement = document.getElementById('resolvedCount');
        resolvedCountElement.textContent = `(${resolvedCount || 0})`;
        rcount = resolvedCount;
        resolve(rcount);
      })
      .catch(error => {
        console.error('Error fetching resolved count:', error);
        reject(error);
      });
  });
}


function updateUnreadCountonHome() {
  return new Promise((resolve, reject) => {
    fetch('http://127.0.0.1:3000/images')
      .then(response => response.json())
      .then(data => {
        if (data && data.images) {
          let unreadcount = data.images.length;
          ucount = unreadcount;
          const unreadcountElement = document.getElementById('unreadcount');
          if (unreadcountElement) {
            unreadcount=unreadcount/4;
            unreadcountElement.textContent = `(${unreadcount || 0})`;
            
            console.log("this is unread count in home",unreadcount);
          } else {
            console.error('Element with ID "unreadcount" not found.');
          }
          resolve(ucount);
        } else {
          console.error('Invalid API response format. Ensure the API returns an object with an "images" property.');
          reject(new Error('Invalid API response format'));
        }
      })
      .catch(error => {
        console.error('Error fetching unread count:', error);
        reject(error);
      });
  });
}
//pie chart
function updateCountsAndCreatePieChart() {
  // Fetch resolved count
  const resolvedCountPromise = updateResolvedCountOnHome();

  // Fetch unread count
  const unreadCountPromise = updateUnreadCountonHome();

  // Wait for both promises to resolve
  Promise.all([resolvedCountPromise, unreadCountPromise])
    .then(([resolvedCount, unreadCount]) => {
      // Use resolvedCount and unreadCount to create the pie chart
      console.log("this resolvecount and ureadcount",resolvedCount,unreadCount)
      createPieChart(resolvedCount, unreadCount);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function createPieChart(resolvedCount, unreadCount) {
  const pieChartData = [resolvedCount,unreadCount];
  console.log("this is resolve count in  pie chart",resolvedCount,unreadCount);
  const targetElement = document.getElementById('pie-chart'); 
  const svg = d3.select(targetElement)
    .append('svg')
    .attr('width', 200)
    .attr('height', 200)
    .append('g')
    .attr('transform', 'translate(100,100)');

  const pie = d3.pie();

  const arc = d3.arc().innerRadius(0).outerRadius(100);

  const arcs = svg.selectAll('arc')
    .data(pie(pieChartData))
    .enter()
    .append('g')
    .attr('class', 'arc');

  arcs.append('path')
    .attr('fill', (d, i) => d3.schemeCategory10[i])
    .attr('d', arc);
}

document.addEventListener('DOMContentLoaded', function () {
  updateUnreadCountonHome();
  updateResolvedCountOnHome();
  updateCountsAndCreatePieChart();
 
});
// pie chart








