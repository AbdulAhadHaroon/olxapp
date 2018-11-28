 // global varible 
var name , description , model , year , type , file, price ,snapurl ; 


document.getElementById('itemfile').onchange = function() {
    if(this.files[0].size > 307200){
       showToast("File Size must less than 300 KB");
       this.value = "";
    };
};

function additem(){

    var b = document.getElementById('btnB');
    //hidden submit button until file is uploaded in database
    b.disabled=true;

    // global varible taking values from user in 'additem' forms 
     name = document.getElementById("itemname").value;
     description = document.getElementById("itemdescription").value;
     model = document.getElementById("itemmodel").value;
     year = document.getElementById("itemyear").value;
     type = document.getElementById("itemtype").value;
     price=document.getElementById("itemprice").value;
     file = document.getElementById("itemfile").files[0];

     // condition to check empty fields
     if(name.length<3){
      showToast("Name may be empty or invalid ");  
      b.disabled=false;
        return;
      }
       else if(description.length<6 ){
        showToast("Description contain atleast 6 character");  
        b.disabled=false;
          return;
       }
       else if( model.length<2 ){
        showToast("Model may be empty or invalid");  
        b.disabled=false;
          return;
       }
       else if( price.length<1 || parseInt(price)<10 ){
        showToast("price may be empty or invalid");  
        b.disabled=false;
          return;
        }
     else if( year.length<4 ){
        showToast("select valid date");  
        b.disabled=false;
          return;
       }
    else if(file==undefined){
        showToast("file  may not be selected");  
        b.disabled=false;
          return;
     }  
      else{

        // move();

        document.getElementById('loaddiv').removeAttribute('hidden');

        // varible to create refrence of firebase storage
         var storageref = firebase.storage().ref("storage");
        // function for uploading file in firebase database
         var uploadtask= storageref.child(''+(new Date()).getTime()+file.name).put(file).then((snapshot)=>{
          // returns the download url to download image from storage
         return snapshot.ref.getDownloadURL();
        }).then(downloadURL => {
        // pushing data  and image url object into firebase database
            var database = firebase.database().ref();
            var skey =  database.child("category").push();
                const send = {
                    id:skey.key,
                    name:name,
                    type:type,
                    model:model,
                    year:year,
                    price:price,
                    description:description,
                    url:downloadURL,
                    token:localStorage.getItem('token'),
                    mail:localStorage.getItem('myemail'),
                    myid:localStorage.getItem('myid'),
                    userno:localStorage.getItem('myno')
                }

                skey.set(send);
               
                var myasynktask = new Promise(function(sucess , failure){
                    setTimeout(function()  {
                      //  document.getElementById('myBar').style.visibility="hidden";
                      document.getElementById('loaddiv').hidden="true";
                        showToast("Upload Sucessfully");  
                        b.disabled=false;
                        // used for show empty input field  of 'additem' form after sucessfully uploading  a file
                        name = document.getElementById("itemname").value="";
                        description = document.getElementById("itemdescription").value="";
                        model = document.getElementById("itemmodel").value="";
                        price=document.getElementById("itemprice").value="";
                        document.getElementById('itemfile').value="";
                }, 3000)});
                 
                
               
            })
       
      .catch((error)=>{
      //  document.getElementById('myBar').style.visibility="hidden";
      document.getElementById('loaddiv').hidden="true";
         // show if error occur
         b.disabled=false;
         var errormsg=error.message;
        // alert(errormsg);
        showToast(errormsg);
     }
 )
}
}
