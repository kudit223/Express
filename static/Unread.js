function updateResolvedCount(count) {
  const unreadcountElement = document.getElementById('unreadcount');
  unreadcountElement.textContent = `(${count})`;
  localStorage.setItem('unreadcount', count);
}
function fetchAndDisplayImage() {
  let cardCount = 0;
  let imageCount=0;
  fetch('http://127.0.0.1:3000/images')
    .then(response => response.json())
    .then(data => {
      const cardContainer = document.getElementById('imageContainer');

      // Clear existing cards
      cardContainer.innerHTML = '';

      // Create a new card for each image
      data.images.forEach(imageUrl => {
        const card = document.createElement('div');
        card.classList.add('card');

        // Create a new image element
        const newImage = document.createElement('img');
        newImage.src = imageUrl;
        newImage.alt = 'Card Image';
        //dock name
        const newText = document.createElement('div');
        newText.classList.add('Card-text');
        card.appendChild(newText);
        
        // fire saftey
        let imageName = '';
        for (let j = 0; j <newImage.src.length; j++) {
          if (newImage.src[j] === '_') {
            j++;
            while (j < newImage.src.length && newImage.src[j] !== '_') {
              imageName += newImage.src[j];
              j++;
            }
            break;
          }
        }
        imageName = imageName.replaceAll('%20', ' ');
       newText.textContent = imageName;

        // Append the new image to the card
        card.appendChild(newImage);

        // Create a reason title
        const reasonTitle = document.createElement('div');
        reasonTitle.classList.add('reason-title');
        reasonTitle.textContent = 'Enter your reason';
        

        // Append the reason title to the card container
        card.appendChild(reasonTitle);

        // Create a reason input field
        const reasonInput = document.createElement('input');
        reasonInput.type = 'text';
        reasonInput.placeholder = 'Enter reason';

        // Append the reason input field to the card container
        card.appendChild(reasonInput);

        // Create a resolve button
        const resolveButton = document.createElement('button');
        resolveButton.textContent = 'Resolve';

        // Append the resolve button to the card container
        card.appendChild(resolveButton);

        resolveButton.addEventListener('click', () => {
          // Handle the resolve button click here
          const reasonValue = "listener is listening";
          console.log(`Resolve button clicked with reason: ${reasonValue}`);
          
          // Assuming newImage is the image element and reasonInput is the input element
          const imageData = newImage.src; // Use the image source
          const inputData = reasonInput.value; // Use the input value
        
          function sendCardDataToServer(imageData, inputData) {
            console.log('working');
            fetch('/uploadCard', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                imageData,
                inputData,
              }),
            })
            .then(response => {
              if (response.ok) {
                console.log('Card data sent to the server successfully.');
                // Remove the card element from the DOM after successful upload
                const cardContainer = document.getElementById('imageContainer');
                const cardToRemove = resolveButton.closest('.card');
                cardContainer.removeChild(cardToRemove);
              } else {
                console.error('Error sending card data to the server.');
              }
            })
            .catch(error => console.error('Error sending card data to the server:', error));
          }
        
          sendCardDataToServer(imageData, inputData);
        
      });
      // });
        
        // Append the new card to the card container
        
        if(imageCount%4===0)
        {
        cardContainer.appendChild(card);
        cardCount++;
        }
        imageCount++;
        
      });
      updateResolvedCount(cardCount);
    })
    .catch(error => console.error('Error fetching images:', error));
}

// Fetch and display images initially
fetchAndDisplayImage();




