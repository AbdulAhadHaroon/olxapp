window.onload=showdata;

// complete Comments car.js me hy because code are same

function showdata(){
   
var checker=0;

    firebase.database().ref("/category").orderByChild("myid").equalTo(localStorage.getItem('myid'))
   .on("value", function(snapshot) {
       snapshot.forEach(function(childSnapshot) {
              // getting value in variable from local storage
             var mid= localStorage.getItem('myid');

             checker=1;

             document.getElementById('loaddiv').hidden="true";
             document.getElementById('offline').innerHTML='';
 

             var ndiv = document.createElement('div');
             ndiv.setAttribute('style','padding:5px;  display:block;');
             
             var np=document.createElement('P');
              np.innerHTML+='<h6><b>Name : '+childSnapshot.val().name +'</b></h6><b>Description : '+childSnapshot.val().description +'</b><br>'
              +'<b>Model : '+childSnapshot.val().model +'</b><br>'+'<b>Type : '+childSnapshot.val().type +'</b><br>'
              +'<b>Year : '+childSnapshot.val().year +'</b>'+'<br><b>Price : '+childSnapshot.val().price +'</b>' ;
              np.setAttribute('style','display:block;  padding-Top:20px;' );
      
              var ip = document.createElement('p');
              ip.setAttribute('style','display:block; text-align:center');

             var nimg=document.createElement('IMG');
             nimg.setAttribute('class','myimg');
             nimg.setAttribute('height','200px');
             nimg.setAttribute('width','200px');
             nimg.setAttribute('style','margin-right:10px auto;  border:solid thin purple; padding:7px;  border-radius:10px; ');
             nimg.setAttribute('src',''+ childSnapshot.val().url);
            
             var btn = document.createElement('button');
             btn.setAttribute('class' , 'form-control btn btn-success');
             btn.setAttribute('style','margin-bottom:10px; border:solid thin; padding:7px; background-color:purple');
             btn.innerHTML="Add To Favourite";
             btn.onclick = function(){
                var database = firebase.database().ref("offline/"+localStorage.getItem('myid')).push({

                    name:childSnapshot.val().name,
                    description:childSnapshot.val().description,
                    model:childSnapshot.val().model,
                    type:childSnapshot.val().type,
                    year:childSnapshot.val().year,
                    price:childSnapshot.val().price,
                    url:childSnapshot.val().url,  
                }).then(responce=>{
                    showToast('Add in Favourite Sucessfully! ');
                })
            }
      
            // button for remove your uploaded item from firebase and current page 
            var btn2 = document.createElement('button');
            btn2.setAttribute('class' , 'form-control btn btn-success');
            btn2.setAttribute('style','margin:auto; border:solid thin; padding:7px; background-color:purple');
            btn2.innerHTML="Delete Data";
            btn2.onclick = function(){
                firebase.database().ref("category/"+childSnapshot.val().id).remove();

                showToast('Data remove Sucessfully! ');
                var myasynktask = new Promise(function(sucess , failure){
                    setTimeout(function()  {
                        window.location.reload();        
                    }, 3000)});
            }
     
            
            var bdiv=document.createElement('div');
            bdiv.setAttribute('style','margin-right:auto; padding:3px;');
            bdiv.appendChild(btn);
            bdiv.appendChild(btn2);

            ip.appendChild(nimg);
            ndiv.appendChild(ip);
            var x = document.createElement("HR");
            ndiv.appendChild(x);
            ndiv.appendChild(np);
            
            var fdiv=document.createElement('div');
            fdiv.setAttribute('style','padding:20px; border:solid 2px purple; display:inline-block; margin:20px; border-radius:15px');
            fdiv.appendChild(ndiv);
            fdiv.appendChild(bdiv);

            document.getElementById("showfetch").appendChild(fdiv);
           
              
         });
         }
         );

         var myasynktask = new Promise(function(sucess , failure){
            setTimeout(function()  {
                if(checker==0){
                    document.getElementById('loaddiv').hidden="true";
                    document.getElementById('offline').innerHTML='<b> No Data Found OR You May Be Offline </b>';
                }
             }, 10000)});



         }