
function showdata(){
   
    var checker=0;

    // complet comment are present in car.js

    firebase.database().ref("/category").orderByChild("type").equalTo("wear")
   .on("value", function(snapshot) {
       snapshot.forEach(function(childSnapshot) {
              // getting value in variable from local storage
             var mid= localStorage.getItem('myid');

             checker=1;

             document.getElementById('loaddiv').hidden="true";
             document.getElementById('offline').innerHTML='';
 

              // condition to compare login person id and id of item uploading person
          if(mid==childSnapshot.val().myid){
      
              // crating dom element without onclick function because we not want to open 
              //chat messenger if uploading person want open it  
             var ndiv = document.createElement('div');
             ndiv.setAttribute('style','padding:5px;  display:inline-block;');
             
             var np=document.createElement('P');
              np.innerHTML+='<h6>Name : '+childSnapshot.val().name +'</h6><b>Description : '+childSnapshot.val().description +'</b><br>'
              +'<b>Model : '+childSnapshot.val().model +'</b><br>'+'<b>Type : '+childSnapshot.val().type +'</b><br>'
              +'<b>Year : '+childSnapshot.val().year +'</b>'+'<br><b>Price : '+childSnapshot.val().price +'</b>' ;
              np.setAttribute('style','display:block;  padding-Top:20px;' );
      
              var ip = document.createElement('p');
              ip.setAttribute('style','display:block; text-align:center' );

             var nimg=document.createElement('IMG');
             nimg.setAttribute('class','myimg');
             nimg.setAttribute('height','200px');
             nimg.setAttribute('width','200px');
             nimg.setAttribute('style','margin-right:auto; border:solid thin purple; padding:7px;  border-radius:10px;');
             nimg.setAttribute('src',''+ childSnapshot.val().url);
            
             var btn = document.createElement('button');
             btn.setAttribute('class' , 'form-control btn btn-success');
             btn.setAttribute('style','margin:auto; border:solid thin; padding:7px; background-color:purple');
             btn.innerHTML="Add To Favourite";
             btn.onclick = function(){
                var skey = firebase.database().ref("offline/"+localStorage.getItem('myid')).push();
                    var obj={
                    id:skey.key,
                    name:childSnapshot.val().name,
                    description:childSnapshot.val().description,
                    model:childSnapshot.val().model,
                    type:childSnapshot.val().type,
                    year:childSnapshot.val().year,
                    price:childSnapshot.val().price,
                    url:childSnapshot.val().url,  
                    }
                    skey.set(obj);
                 //   alert('Add into Favourite Sucessfully !');
                 showToast("Add into Favourite Sucessfully");
                
            }
      

            var bdiv=document.createElement('div');
            bdiv.setAttribute('style','margin-right:auto; padding:3px;');
            bdiv.appendChild(btn);

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
           
              }
              else{
              // crating dom element with onclick function because we  want to open chat messenger 
              //if any person want open it except uploading person   
              var ndiv = document.createElement('div');
              ndiv.setAttribute('style','padding:5px;  display:inline-block;');
             //ndiv.setAttribute("onClick", chating());
             
             ndiv.onclick = function(){
                 window.location.href="chat.html";
                
              localStorage.setItem('friendmail',childSnapshot.val().mail);
              localStorage.setItem('friendid',childSnapshot.val().myid);
              localStorage.setItem('friendno',childSnapshot.val().userno);
              localStorage.setItem('itemid',childSnapshot.val().id);
              localStorage.setItem('friendtoken',childSnapshot.val().token);
              
      
             }
            
             
            var np=document.createElement('P');
              np.innerHTML+='<h6>Name : '+childSnapshot.val().name +'</h6><b>Description : '+childSnapshot.val().description +'</b><br>'
              +'<b>Model : '+childSnapshot.val().model +'</b><br>'+'<b>Type : '+childSnapshot.val().type +'</b><br>'
              +'<b>Year : '+childSnapshot.val().year +'</b>'+'<br><b>Price : '+childSnapshot.val().price +'</b>' ;
              np.setAttribute('style','display:block;  padding-Top:20px;' );
              //np.setAttribute('style','text-align:auto');
              //np.setAttribute('style','margin-top:30px');
      
              var ip = document.createElement('p');
              ip.setAttribute('style','display:block; text-align:center' );

             var nimg=document.createElement('IMG');
             nimg.setAttribute('class','myimg');
             nimg.setAttribute('height','200px');
             nimg.setAttribute('width','200px');
             nimg.setAttribute('style','margin-right:auto; border:solid thin purple; padding:7px;  border-radius:10px; ');
             nimg.setAttribute('src',''+ childSnapshot.val().url);
            
             var btn = document.createElement('button');
             btn.setAttribute('class' , 'form-control btn btn-success');
             btn.setAttribute('style','margin:auto; border:solid thin; padding:7px; background-color:purple');
             btn.innerHTML="Add To Favourite";
             btn.onclick = function(){
                var skey = firebase.database().ref("offline/"+localStorage.getItem('myid')).push();
                var obj = {
                    id:skey.key,
                    name:childSnapshot.val().name,
                    description:childSnapshot.val().description,
                    model:childSnapshot.val().model,
                    type:childSnapshot.val().type,
                    year:childSnapshot.val().year,
                    price:childSnapshot.val().price,
                    url:childSnapshot.val().url,  
                }
                skey.set(obj);

                var myasynktask = new Promise(function(sucess , failure){
                    setTimeout(function()  {
                        showToast("Add into Favourite Sucessfully");      
                    }, 3000)});       
            }
      

            var bdiv=document.createElement('div');
            bdiv.setAttribute('style','margin-right:auto; padding:3px;');
            bdiv.appendChild(btn);

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
          }
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