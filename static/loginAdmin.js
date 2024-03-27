var loggedAdmin = {};
var data = '';

async function buttonAd() {
  var admin_email = document.getElementById("email").value;
  var admin_password = document.getElementById("password").value;

  fetch('../api/v1/authenticationsAdmin',{

    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({admin_email:admin_email, admin_password:admin_password}),
  
  })
  .then((resp) => {
    data = resp.json();
    return data;
  })

  .then(function(data){
    loggedAdmin.token = data.token;
    loggedAdmin.admin_email = data.admin_email;
    loggedAdmin.id = data.id;
    loggedAdmin.self = data.self;
    loggedAdmin.admin_type = data.admin_type;
  
    console.log(loggedAdmin.admin_type);
    console.log(loggedAdmin.admin_email);
    console.log(data.success);
    
    sessionStorage.setItem('loggedAdmin', loggedAdmin.id); // Salvataggio dei dati nel session storage
    sessionStorage.setItem('loggedAdminToken', loggedAdmin.token); // Salvataggio dei dati nel session storage
    sessionStorage.setItem('loggedAdminType', loggedAdmin.type); // Salvataggio dei dati nel session storage
    Enter(data.success, loggedAdmin.admin_type);
  
  })
  .catch(error => console.error(error));
  }


async function Enter(dato, type){
  console.log(type);  
  console.log(dato);  

  if(dato == true){
    if(type == "moderator"){
          
      console.log("passato Mod");
      window.location.href = "moderator.html";

    }else{
      if(type == "callCenter"){

        console.log("call");
        window.location.href = "CallCenter.html";
        
      }else{
        if(type == "tecnicalSupport"){
          
          console.log("tecnical");
          window.location.href = "tecnicalSupport.html";
        }
      }
    }
  }else{

    console.log("no giusto");
    window.location.href ="loginAdmin.html";

  }
}

