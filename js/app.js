// initializing service worker in main file app.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
      .register('firebase-messaging-sw.js')
      .then(function() { console.log('Service Worker Registered'); });
}

var loginemail , loginpassword , myid , myno , dtoken ,ftoken;

// prevent page to go
history.pushState(null, null, location.href);
    window.onpopstate = function () {
      showToast('press home button to exit !');
        history.go(1);
    };


  
// function to take email and password as input in index.html and done verification of data in firebase database. 
  function toggleSignIn() {
  
   

  // document.getElementById('loginbtn').setAttribute('hidden','true');
    document.getElementById('loginbtn').disabled=true;

 
    loginemail = document.getElementById('email').value.toLowerCase();
  
    loginpassword = document.getElementById('password').value;
  
    // veification  of user input locally
    if (loginemail.length < 4) {
     showToast('Please enter an email address');
     document.getElementById('loginbtn').disabled=false;
     return;
   }
   if (loginpassword.length < 4) {
     showToast('Please enter a password.');
     document.getElementById('loginbtn').disabled=false;
     return;
   }
  else{
    // method to display progress bar
   // move();
   document.getElementById('loaddiv').removeAttribute('hidden');

   // verification of user input on firebase database
   firebase.auth().signInWithEmailAndPassword(loginemail, loginpassword) 
   .then(function(userResponse) {
      // user define function
       getmyid();
   }) 
   // catch error if any error occur in firebase verification
   .catch(function(error) {
    //document.getElementById('myBar').style.visibility="hidden";
     // Handle Errors here.
     document.getElementById('loaddiv').hidden="true";
     document.getElementById('loginbtn').disabled=false;
     var errorCode = error.code;
     var errorMessage = error.message;
     // [START_EXCLUDE]
     if (errorCode === 'auth/wrong-password') {
      // alert('Wrong password.');
      showToast('Wrong Password.');
     } else {
       //alert(errorMessage);
       showToast(errorMessage);
     }
     console.log(error);
  
   });
   
 }
}

 function getmyid(){
// getting data from user node from firebase database and save it into local storage because if we reloading or change
//html pg the data  present in vaiables will be lost
    firebase.database().ref("/Users").orderByChild("mail").equalTo(""+loginemail).on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            myid = childSnapshot.key;
            myno=childSnapshot.val().userno;
            loginemail=childSnapshot.val().mail;
            ftoken=childSnapshot.val().token;
          })

            // localStorage.setItem('token',dtoken);   
            localStorage.setItem('myemail',loginemail);
            localStorage.setItem('myid',myid);
            localStorage.setItem('myno',myno);

          if(localStorage.getItem('token')==undefined || localStorage.getItem('token')==null || localStorage.getItem('token')==""
             || localStorage.getItem('token')=='null' || localStorage.getItem('token')=='undefined'){
            // run if current token (local storage token is null due to permission denied)
            localStorage.setItem('token',ftoken);  
            firebase.database().ref("/Users/"+myid).child("token").set(""+ftoken);

             // set timeout of 6 sec delay for replace the pg with 'afterlogin.html' 
             var myasynktask = new Promise(function(sucess , failure){
             setTimeout(function()  {
              document.getElementById('loaddiv').removeAttribute('hidden');
             document.getElementById('loginbtn').disabled=false;
             window.location.replace('afterlogin.html');
             }, 6000)});

          }else{
            // run if current token (local storage token is not null) after given permisssion by user 
            firebase.database().ref("/Users/"+myid).child("token").set(""+localStorage.getItem('token'));

             // set timeout of 6 sec delay for replace the pg with 'afterlogin.html' 
            var myasynktask = new Promise(function(sucess , failure){
            setTimeout(function()  {
              document.getElementById('loaddiv').removeAttribute('hidden');
              document.getElementById('loginbtn').disabled=false;
              window.location.replace('afterlogin.html');
             }, 6000)});


          }       
                         
    });
  }


          

 