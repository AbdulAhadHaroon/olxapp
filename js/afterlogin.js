// repalec pg with index.html after Checking in local storage for undefined and null value of require fileds.
if( localStorage.getItem('myid')==undefined || localStorage.getItem('myemail')==undefined || 
    localStorage.getItem('myno')==undefined || localStorage.getItem('myid')==""   ||
    localStorage.getItem('myemail')=='' || localStorage.getItem('myno')=='' ){
    alert('Oops ! Some thing went wrong . Please again Signin to Continue');
    window.location.replace('index.html')
}



// prevent page to go
history.pushState(null, null, location.href);
    window.onpopstate = function () {
      showToast('press home button to exit or signout');
        history.go(1);
    };

//window.confirm('are you sure you want to delete')
// remove all save values from local storage if user signout
function signout(){

    firebase.auth().signOut()
    .then(function() {
        localStorage.setItem('myno','');
        localStorage.setItem('myemail','');
        window.location.replace('index.html');
    })
    .catch(function(error) {
      showToast(error);
    });    
}

newtoken();
/*update the current user's device token in category node in user uploaded items so if anyone want to send msg to user . it will
 get notification on current login device*/  
async function newtoken(){
    firebase.database().ref("/category").orderByChild("myid").equalTo(localStorage.getItem('myid'))
    .on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.val().id;
            firebase.database().ref("/category/"+key).child('token').set(""+localStorage.getItem('token'));
    });
  });
}

// function to search item in firebase databse on given input provided by user in search bar 
function search(){

 var checker=0;

    // to remonve all previous search data from div 
    document.getElementById("showfetch").innerHTML="";
    document.getElementById('offline').innerHTML='';
    
    // taking input from user in search bar
    var txt = document.getElementById('search').value;
    if(txt.length<2){
        //alert("write something");
        showToast('please searh value must contain 2 or more characters');
    }
    else{
        
        var myasynktask = new Promise(function(sucess , failure){
            setTimeout(function()  {
                if(checker==0){
                    document.getElementById('loaddiv').hidden="true";
                    document.getElementById('offline').innerHTML='<b> No Data Found OR You May Be Offline </b>';
                }
             }, 8000)});


             
             document.getElementById('loaddiv').removeAttribute('hidden');
             
             // saerch data in firebase database in category node
             firebase.database().ref("/category").on("value", function(snapshot) {
                 snapshot.forEach(function(childSnapshot) {
                     
                     var nam=childSnapshot.val().name+"s";
                     var desc=childSnapshot.val().description+"s";
                     var mod=childSnapshot.val().model+"s";
                     
                     /* geting data from firebase and concatinate (name , description , model) of each and every item in
                     data variable seperatily */
                     var data = nam + desc + mod ;   
                     
                     // check the presence of data in firbase with the refrence of user input in search bar
                     if(data.toUpperCase().includes(txt.toUpperCase())){
                    
                    checker=1;    

                    document.getElementById("showfetch").innerHTML="<h1>SEARCH RESULT</h1> <hr>";
                         
                    document.getElementById('loaddiv').hidden="true";
                    document.getElementById('offline').innerHTML='';
                    
                    // creating dom element 'div'
                    var ndiv = document.createElement('div');
                    ndiv.setAttribute('style','padding:5px;  display:inline-block;');
                        
                    ndiv.onclick = function(){
                  
                        if(localStorage.getItem('myid')!=childSnapshot.val().myid){

                        localStorage.setItem('friendmail',childSnapshot.val().mail);
                        localStorage.setItem('friendid',childSnapshot.val().myid);
                        localStorage.setItem('friendno',childSnapshot.val().userno);
                        localStorage.setItem('itemid',childSnapshot.val().id);
                        localStorage.setItem('friendtoken',childSnapshot.val().token);
                        
                        window.location.href="chat.html";

                      }

                      else{
                          showToast('this item added by you');
                      }

                   }

                    // create element p to show values 
                     var np=document.createElement('P');
                     np.setAttribute('id','pid');
                     np.innerHTML+='<h6>Name : '+childSnapshot.val().name +'</h6><b>Description : '+childSnapshot.val().description +'</b><br>'
                     +'<b>Model : '+childSnapshot.val().model +'</b><br>'+'<b>Type : '+childSnapshot.val().type +'</b><br>'
                     +'<b>Year : '+childSnapshot.val().year +'</b>'+'<br><b>Price : '+childSnapshot.val().price +'</b>' ;
                     np.setAttribute('style','display:block;  padding-Top:20px;' );


                     var ip = document.createElement('p');
                     ip.setAttribute('style','display:block; text-align:center' );
                     
                     // create element img to show img
                    var nimg=document.createElement('IMG');
                    nimg.setAttribute('class','myimg');
                    nimg.setAttribute('height','200px');
                    nimg.setAttribute('width','200px');
                    nimg.setAttribute('style','margin-right:auto; border:solid thin purple; padding:7px;  border-radius:10px; ');
                    nimg.setAttribute('src',''+ childSnapshot.val().url);
                    
                    // create element button to add data into favourite
                    var btn = document.createElement('button');
                    btn.setAttribute('class' , 'form-control btn btn-success');
                    btn.setAttribute('style','margin:auto; border:solid thin; padding:7px; background-color:purple');
                    btn.innerHTML="Add To Favourite";
                    btn.onclick = function(){

                    // add data into offline node in firebase database    
                    var database = firebase.database().ref("offline/"+localStorage.getItem('myid')).push({

                    name:childSnapshot.val().name,
                    description:childSnapshot.val().description,
                    model:childSnapshot.val().model,
                    type:childSnapshot.val().type,
                    year:childSnapshot.val().year,
                    price:childSnapshot.val().price,
                    url:childSnapshot.val().url,  

                     }).then(responce=>{

                    showToast('Add into Favourite Sucessfully');
                    
                    window.location.href('offline.html');
                        })
                    }
            

                    var bdiv=document.createElement('div');
                    bdiv.setAttribute('style','margin-right:auto; padding:3px;');
                    bdiv.appendChild(btn);

                    ip.appendChild(nimg);
                    ndiv.appendChild(ip)
                    var x = document.createElement("HR");
                    ndiv.appendChild(x);
                    ndiv.appendChild(np);
                    
                    var fdiv=document.createElement('div');
                    fdiv.setAttribute('style','padding:20px; border:solid 2px purple; display:inline-block; margin:20px; color:rgb(22, 22, 22);');
                    fdiv.appendChild(ndiv);
                    fdiv.appendChild(bdiv);

                    document.getElementById("showfetch").appendChild(fdiv);

                    highlightWord();

                    function highlightWord(){
                        var val=document.getElementById('pid').innerHTML;
                        if(val!=null || val!=''){
                            var myHilitor = new Hilitor("showfetch");
                            myHilitor.apply(txt);
                        }
                        else{
                            var myasynktask = new Promise(function(sucess , failure){
                                setTimeout(function()  {
                                        highlightWord();                  
                                    }, 3000)});  
                        }                               
                      }
                    }
                });
            });
        }

    }
