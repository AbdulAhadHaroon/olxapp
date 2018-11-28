
var email ,password , name  , userno;

function handlesignUp() {

 var b = document.getElementById('btnB');
    b.disabled=true;

// fuunction for handle signup in firebase database
    email = document.getElementById('signupemail').value.toLowerCase();
    password = document.getElementById('signuppassword').value;
    name=document.getElementById('signupname').value;

  //  user input verification localy
   if (email.length < 2) {
   //  alert('Please enter valid name');
   showToast('Please Enter a Valid name ');
   b.disabled=false;
     return;
   }
   if (email.length < 4) {
    // alert('Please enter an email address.');
    showToast('Please enter an email address.');
    b.disabled=false;
     return;
   }
   if (password.length < 4) {
    // alert('Please enter a password.');
    showToast('Please enter a password.');
    b.disabled=false;
     return;
   }
   else{
      //  move();
      document.getElementById('loaddiv').removeAttribute('hidden');
   }
   // creating email account on firebase
   firebase.auth().createUserWithEmailAndPassword(email, password)
   .then(function(userResponse) {
     console.log(userResponse);
    
     //firebase.auth().onAuthStateChanged(function(user) {});     // funntion to get uid when signin

     // putting data into firebase database after account creation
     var database = firebase.database().ref();
     var skey =  database.child("Users").push();
     skey.child("id").set(""+skey.key);
     skey.child("mail").set(""+email);
     skey.child("name").set(""+name);
     skey.child("password").set(""+password);
    
     if(userno=='undefined'){
      skey.child("userno").set("0");
    }else{
      skey.child("userno").set(""+userno);
      }
      showToast("signup sucessfully");

      // 4 sec delay before showing 'signup sucessfully msg' and chand html file
      var myasynktask = new Promise(function(sucess , failure){
      setTimeout(function()  {
        document.getElementById('loaddiv').hidden="true"
        b.disabled=false;
        window.location.replace('index.html');
      }, 2000)});

   })
   .catch(function(error) {
    document.getElementById('loaddiv').hidden="true"
    //document.getElementById('myBar').style.visibility="hidden";
    b.disabled=false;
     // show error if error occur during sign in on firebase
     var errorCode = error.code;
     var errorMessage = error.message;
   
     if (errorCode == 'auth/weak-password') {
      showToast("The Password is to weak");
     } else {
      showToast(errorMessage);
     }
     console.log(error);
    });
 }


// function to provide count of number of signup user's in firebase 
function getfirebasesize(){
  var _db = firebase.database();
  var todosRef = _db.ref('Users');
  todosRef.on('value', (data) => {
    userno=data.numChildren();
});
}