document.getElementById('appointmentForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const date = document.getElementById('date').value;

  const confirmation = document.getElementById('confirmation');
  confirmation.textContent = `Thank you, ${name}. Your appointment for ${date} has been received!`;
  
  this.reset(); // Clear the form
});
