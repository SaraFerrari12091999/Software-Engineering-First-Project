
  async function resetPassword(){
    const email = document.getElementById('email').value;
  try {
    //send the POST request to the server
    const response = await fetch('../api/v1/users/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      alert('Email inviata con successo!');
      // redirect the user to a confirm page or visualize an appropriate message
    } else {
      const error = await response.json();
      alert(`Errore: ${error.message}`);
    }
  } catch (error) {
    console.error(error);
    alert('Si è verificato un errore durante l\'invio della richiesta.');
  }
}

function goBack() {
  window.location.href = "../";
}