showdata();

// async function done request in back ground
async function showdata(){
    /*(In 'VIEW AS OFFLINE') Cases we used fetch request to show dynamic data because Service worker have an a ability 
      to cache data in local storage for show in offline mode . This only happen if we using feth metod */

    //  link of firebase olx web app database and "await" is replace the "promise (then and catch)" methods.   

    
    var myRequest = await fetch(`https://olxapp-6e81c.firebaseio.com/offline/${localStorage.getItem('myid')}.json`);
 
     var myJson = await myRequest.json();

            // now getting data from firebase into Json form and using for loop to show data in dom elements   
           
            for(var key in myJson){
              
              var des= myJson[key].description;
              var mid=myJson[key].id;
              var name=myJson[key].name;
              var price= myJson[key].price;
              var year=myJson[key].year;
              var type= myJson[key].type;
              var model= myJson[key].model;
              var url=myJson[key].url;
           
              // Creating DOM Elements 'div' with the name ndiv
              var ndiv = document.createElement('div');
              ndiv.setAttribute('style','padding:20px; border:solid 2px purple; display:inline-block; margin:20px; border-radius:15px');

              // Creating DOM Elements 'P' with the name np
              var np=document.createElement('P');
              np.innerHTML+='<b>Name : '+name +'</b><br><b>Description : '+des +'</b><br>'
              +'<b>Model : '+model +'</b><br>'+'<b>Type : '+type +'</b><br>'
              +'<b>Year : '+year +'</b>'+'<br><b>Price : '+price +'</b>';
              np.setAttribute('style','display:block;  padding-Top:20px;' );

              var ip = document.createElement('p');
              ip.setAttribute('style','display:block; text-align:center' );

              // Creating DOM Elements 'IMG' with the name nimg
              var nimg=document.createElement('IMG');
              nimg.setAttribute('class','myimg');
              nimg.setAttribute('height','200px');
              nimg.setAttribute('width','200px');
              nimg.setAttribute('style','margin-right:auto; border:solid thin purple; padding:7px;  border-radius:10px;');
              nimg.setAttribute('src',url);

              var btn2 = document.createElement('button');
              btn2.setAttribute('class' , 'form-control btn btn-success');
              btn2.setAttribute('style','margin:auto; border:solid thin; padding:7px; background-color:purple');
              btn2.innerHTML="Delete Data";
              btn2.onclick = function(){
                 firebase.database().ref(`offline/${localStorage.getItem('myid')}/${mid}`).set({});
                 // firebase.database().ref(`offline/${localStorage.getItem('myid')}`).child(mid).remove()
                  showToast('Data Deleted Sucessfully');
                    var myasynktask = new Promise(function(sucess , failure){
                    setTimeout(function()  {
                        window.location.reload();        
                    }, 3000)});
            }
 
             // appending all dom elements into ndiv 

             ip.appendChild(nimg);
             ndiv.appendChild(ip);
             var x = document.createElement("HR");
             ndiv.appendChild(x);
             ndiv.appendChild(np);
             ndiv.appendChild(btn2);

             // now appending ndiv into html div with the id of 'Showfetch'
             document.getElementById('showfetch').appendChild(ndiv);
            }
     }