
function updateResolvedCount(count) {
  const resolvedCountElement = document.getElementById('resolvedCount');
  resolvedCountElement.textContent = `(${count})`;
  localStorage.setItem('resolvedCount', count);
}
function formatDateTime(dateTimeString) {
  // Assuming the format is YYYYMMDDHHmmssSSSSS
  var year = dateTimeString.substr(0, 4);
  var month = dateTimeString.substr(4, 2);
  var day = dateTimeString.substr(6, 2);
  var hours = dateTimeString.substr(8, 2);
  var minutes = dateTimeString.substr(10, 2);
  var seconds = dateTimeString.substr(12, 2);
  var milliseconds = dateTimeString.substr(14, 3);

  var formattedDateTime =
    year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + "." + milliseconds;

  return formattedDateTime;
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
          // console.log(newImage.src);
          //dock name
          const newText = document.createElement('div');
          newText.classList.add('gateName');
          card.appendChild(newText);
         // console.log(newImage.src);
          // image name
          let imageName = '';
          for (let j = 0; j < newImage.src.length; j++) {
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
          //timeStamp
          
          let count = 0;
          let timeStamp = '';
          for (let i = 0; i < newImage.src.length; i++) {
            if (newImage.src[i] == '_')
              count++;
            if (count == 3) {
              i++;
              while (i < newImage.src.length && newImage.src[i] !== '_') {
                timeStamp += newImage.src[i];
                i++;
              }
              break;
            }
          }
          const timeStampbox=document.createElement('div');
          timeStampbox.classList.add('timeStampbox');
          card.appendChild(timeStampbox);
          timeStampbox.textContent=formatDateTime(timeStamp);
          console.log(formatDateTime(timeStamp));

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

