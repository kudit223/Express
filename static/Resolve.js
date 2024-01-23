
function updateResolvedCount(count) {
    const resolvedCountElement = document.getElementById('resolvedCount');
    resolvedCountElement.textContent = `(${count})`;
    localStorage.setItem('resolvedCount', count);
  }
function fetchAndDisplayAllData() {
    let cardCount = 0;
    document.addEventListener('DOMContentLoaded', function () {
        fetch('http://127.0.0.1:3000/Resolvedata')
          .then(response => response.json())
          .then(data => {
            const cardContainer = document.getElementById('cardContainer');
            data.forEach(cardData => {
              const card = document.createElement('div');
              card.classList.add('card');

              // Create a new image element
              const newImage = document.createElement('img');
              newImage.src = cardData.imageData; // Assuming your JSON has an 'imageUrl' property
              newImage.alt = 'Card Image';
              console.log(newImage.src);
              //dock name
              const newText = document.createElement('div');
              newText.classList.add('gateName');
              card.appendChild(newText);
      
              // fire saftey
              let imageName = '';
              for (let j = 0; j <newImage.src.length; j++) {
                if (newImage.src[j] === '%') {
                  j = j + 3;
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

              // Create a card-heading div for text=Reason
              const cardHeading = document.createElement('div');
              cardHeading.classList.add('card-heading');
              cardHeading.textContent = `Reason: `; // Assuming your JSON has a 'text' property
              card.appendChild(cardHeading);

              // Create a card-text div for input data
              const cardText = document.createElement('div');
              cardText.classList.add('card-text');
              cardText.textContent = ` ${cardData.inputData}`; // Assuming your JSON has an 'inputData' property
              card.appendChild(cardText);

              // Append the new card to the card container
              cardContainer.appendChild(card);
              cardCount++;
            });
            updateResolvedCount(cardCount);
          })
          .catch(error => console.error('Error fetching card data:', error));
      });
}
fetchAndDisplayAllData();
// ... (Your existing client-side code)

