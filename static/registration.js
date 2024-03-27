
var registeredUser = {};
var data = '';

/**
 * This function is called when login button is pressed.
 * Note that this does not perform an actual authentication of the user.
 * A student is loaded given the specified email,
 * if it exists, the studentId is used in future calls.
 * 
 */

function registration()
{
    var nomeCognome = document.getElementById("nomeCognome").value;
    var telefono = document.getElementById("telefono").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var checkPassword = document.getElementById("checkPassword").value;
    var chx = document.getElementById("checkbox").checked;

    fetch('../api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { 
            nomeCognome: nomeCognome,
            telefono: telefono,
            email: email, 
            password: password,
            checkPassword: checkPassword,
            chx: chx
         } ),
    })
    .then((resp) => {
        data = resp.json();
        return data;
     })
    .then(function(data){  
      console.log(data);
      if(data.success) {
        window.location.href = "login.html";
      }
      return;    
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
};


function goBack() {
  window.location.href = "../";
}
