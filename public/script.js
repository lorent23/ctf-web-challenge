document.getElementById('overflow-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const userInput = document.getElementById('input').value;
  fetch('/overflow', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `input=${encodeURIComponent(userInput)}`
  })
  .then(response => response.text())
  .then(data => {
      const resultDiv = document.getElementById('result');
      resultDiv.textContent = data;
      resultDiv.style.display = 'block';
  })
  .catch(error => console.error('Error:', error));
});
