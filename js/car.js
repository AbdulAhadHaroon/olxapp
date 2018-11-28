
/*function categoryChangeFunc() {
    var selectBox = document.getElementById("category");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
     shoemore(selectedValue);
   }


 function shoemore(value){
     var p = document.getElementById("price");
     var m=document.getElementById("model");
     var i=document.getElementById("item");
          if(value=='price'){p.style.visibility="visible";   i.style.visibility="hidden";    m.style.visibility="hidden";}
     else if(value=='item'){ i.style.visibility="visible";   p.style.visibility="hidden";    m.style.visibility="hidden";}
     else if(value=='model'){m.style.visibility="visible";   i.style.visibility="hidden";    p.style.visibility="hidden";}
     else{showToast('nothing Select')}
 }


function selector1(){
    var selectBox = document.getElementById("item_selector");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
     document.getElementById("pi").innerHTML="<b> Type : "+selectedValue+"</b>";
     document.getElementById("item").style.visibility="hidden";
    // item(selectedValue);
}
function selector2(){
    var selectBox = document.getElementById("price_selector");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    document.getElementById("pp").innerHTML="<b> Price : Under " + selectedValue+" or equivalent </b>";
    document.getElementById("price").style.visibility="hidden";
    // price(selectedValue);
}

function selector3(){
    var selectBox = document.getElementById("model_selector");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    document.getElementById("pm").innerHTML="<b> Model : After "+selectedValue+"</b>";
    document.getElementById("model").style.visibility="hidden";
    // model(selectedValue);
}
*/

function showdata(){
   var checker = 0;
    // checking in firebase database of persence of vehicle itmes or not
    firebase.database().ref("/category").orderByChild("type").equalTo("vehicle")
   .on("value", function(snapshot) {
       snapshot.forEach(function(childSnapshot) {

            checker=1;

            document.getElementById('loaddiv').hidden="true";
            document.getElementById('offline').innerHTML='';

              // getting value in variable from local storage
             var mid= localStorage.getItem('myid');

              // condition to compare login person id and id of item uploading person
              if(mid==childSnapshot.val().myid){
      
              /* creating dom element without onclick function because we not want to open 
                 chat messenger if uploading (jis ne item dala ho) person want to open chat messenger for messaging himself */  
        
             // creating element div for appending image , data and <hr>    
             var ndiv = document.createElement('div');
             ndiv.setAttribute('style','padding:5px;  display:inline-block;');
             
             // creating element p for show data
             var np=document.createElement('P');
              np.innerHTML+='<h6>Name : '+childSnapshot.val().name +'</h6><b>Description : '+childSnapshot.val().description +'</b><br>'
              +'<b>Model : '+childSnapshot.val().model +'</b><br>'+'<b>Type : '+childSnapshot.val().type +'</b><br>'
              +'<b>Year : '+childSnapshot.val().year +'</b>'+'<br><b>Price : '+childSnapshot.val().price +'</b>' ;
              np.setAttribute('style','display:block;  padding-Top:20px;' );
      
              // another p to passing image in it and passing text align=center
              var ip = document.createElement('p');
              ip.setAttribute('style','display:block; text-align:center' );

            // creating element img for show image 
             var nimg=document.createElement('IMG');
             nimg.setAttribute('class','myimg');
             nimg.setAttribute('height','200px');
             nimg.setAttribute('width','200px');
             nimg.setAttribute('style','margin-right:auto; border:solid thin purple; padding:7px;  border-radius:10px;');
             nimg.setAttribute('src',''+ childSnapshot.val().url);
            
             // buton for add data into favourite node in firebase as my favourite
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
                 showToast("Add into Favourite Sucessfully");
                
            }
            /* bdiv me btn ko add kry gy q k agr ndiv me krty to on click pr chat messenger khulta q k ndiv k onclick function me 
             chat messenger khlony ki coding hui wi hy to btn wali coding proper kaam ni kr rahhi */ 
            var bdiv=document.createElement('div');
            bdiv.setAttribute('style','margin-right:auto; padding:3px;');
            bdiv.appendChild(btn);

            // appending image p element 
            ip.appendChild(nimg);
            ndiv.appendChild(ip);

            // hr tag show line in html pg
            var x = document.createElement("HR");
            ndiv.appendChild(x);
            ndiv.appendChild(np);

            // appending both into fdiv
            var fdiv=document.createElement('div');
            fdiv.setAttribute('style','padding:20px; border:solid 2px purple; display:inline-block; margin:20px; border-radius:15px');
            fdiv.appendChild(ndiv);
            fdiv.appendChild(bdiv);

            // appending data into show fetch
            document.getElementById("showfetch").appendChild(fdiv);
           
              }
              else{
              /* creting dom element with onclick function because we  want to open chat messenger 
              if any person want open it except uploading person */

              var ndiv = document.createElement('div');
              ndiv.setAttribute('style','padding:5px;  display:inline-block;');
             //ndiv.setAttribute("onClick", chating());
             
              ndiv.onclick = function(){
                  
                  localStorage.setItem('friendmail',childSnapshot.val().mail);
                  localStorage.setItem('friendid',childSnapshot.val().myid);
                  localStorage.setItem('friendno',childSnapshot.val().userno);
                  localStorage.setItem('itemid',childSnapshot.val().id);
                  localStorage.setItem('friendtoken',childSnapshot.val().token);
                  
                  window.location.href="chat.html";
                  
             }
            
             
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
            ndiv.appendChild(ip)
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