async function fine(){

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const newPassword = document.getElementById('password').value;
    console.log(newPassword);
    const newcheckPassword = document.getElementById('checkPassword').value;

   fetch('../api/v1/users/reset-password', {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ token, newPassword, newcheckPassword  })
  })
  .then((resp) => {
    if(resp.ok) {
        return resp.json();

    } else {
        return resp.json().then((data) => Promise.reject(data));
    }
}) // Transform the data into json
.then(function(data) { // Here you get the data to modify as you please
    //console.log(data);
    console.log(data);
    window.location.href = '/login.html'; 
    return;
})
.catch( error => console.error(error) ); // If there is any error you will catch them here
  
}

function goBack() {
  window.location.href = "../";
}
