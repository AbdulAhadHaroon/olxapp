window.onload=getuserno;

var database = firebase.database().ref();
// global variable
var myno , friendno , mesg , chatid;

/* getuserno fuction me dono buyer and seller k name aur un k user no get ex (1,2,3) get kiye hy localstorage se aur in no ko 
parseint kr k integer me krlia  taky chatid generate krty waqt greater user no  (ex 5) ki id pehly aur lesser ki(ex 4) ki
bd me aye */ 

function getuserno(){

myno=localStorage.getItem("myno");
friendno=localStorage.getItem("friendno");

var a = parseInt(localStorage.getItem("myno"));
var b = parseInt(localStorage.getItem("friendno"));

var c = localStorage.getItem("myid");
var d = localStorage.getItem("friendid");


if( c==null || c=='' || c=='undefined' || c==undefined || myno=='' || myno=='undefined' || myno==undefined || myno==null){
    showToast('oops some thing went wrong you must login again to continue');
    var myasynktask = new Promise(function(sucess , failure){
        setTimeout(function()  {
           window.location.replace('index.html')
    }, 3000)});    
}


if(d==null || d=='' || d=='undefined' || d==undefined || friendno=='' || friendno=='undefined' || friendno==undefined || friendno==null ){
    showToast('oops some thing went wrong page may be go back ');
    var myasynktask = new Promise(function(sucess , failure){
        setTimeout(function()  {
            window.history.go(-1);
    }, 3000)});
}


if(a>b){
chatid=c+d;
}
else{
chatid=d+c;
}

// to show the names of sender and reciever in chat messenger
document.getElementById('names').innerHTML="<b> Me : " + localStorage.getItem("myemail") + "</b> <br> " + " <b> Friend : " 
    + localStorage.getItem("friendmail") +"</b>";

    showmsg();
}

    
// chating function me msg ko firebase pr push kr rahy hy
function chating(){

    mesg=document.getElementById('msg').value;

    if(mesg.length<1){
        showToast("Please write some thing");
    }
    else{
        // firebase me chating ki node me chatid append krkry jo bhi msg hong is k andar us object push krty rahy gy .
    var skey =  database.child('chating/'+chatid).push();
            const msgObj = {
                    id: skey.key,
                    message: mesg,
                    time: (new Date()).getTime(),
                    nfriendid: localStorage.getItem('myemail'),
                    friendid: localStorage.getItem('friendmail'),
                    myno: localStorage.getItem('myid')

                };
                skey.set(msgObj);
    
    /* is k sath hi firebase push notification k node me bhi data push kr rahy jis pr cloud function fire hoga aur jo 
    msg recieve krny wala hy us ki device pr push notification chala jae ga ye sirf us hi waqt fire hoga jb reciever ki id 
    null na ho agr null hogi to msg push noti ni jae ga aur sender jitni baar back ja kr dubara is pg pr aye ga hr baar reciever
    ko push noti send hoga q k id dubara not null hogi */

    if(localStorage.getItem('friendid')!=''){

        database.child('sendpush').push({
        token:localStorage.getItem('friendtoken'),
        userId:localStorage.getItem('friendid'),
        message:mesg,
        name:localStorage.getItem('myemail')
     });

     var myasynktask = new Promise(function(sucess , failure){
       setTimeout(function()  {
        localStorage.setItem('friendid','');
       }, 4000)});
    }

    // set input text field empty after sending msg
     mesg=document.getElementById('msg').value="";
    
    }
}

/* show msg me firebase child_added function laga hy is sy data realtime msg realtime me show hojae ga without reloading page
   aur msg ki alignment ki hui hy with respect to user id agar mera send msg hua to right pr else left pr */
  function showmsg(){
       var id , msg , c;
    database.child("chating/"+chatid).on('child_added', (data) => {
    
    id = data.val().myno;
    msg = data.val().message;
    c = localStorage.getItem("myid");

        var np =document.createElement('p');
        if(id==c){
            np.setAttribute('align' , 'right');
            np.innerHTML+=msg;
        }else{
            np.setAttribute('align' , 'left');
            np.innerHTML+=msg;
        }
        document.getElementById('chat').appendChild(np);
    });
}

// to delete whole chat
async function delChat(){

    if( document.getElementById('chat')==''){
        showToast('No Chat Found')
    }
    else{
        if (confirm('Are you sure you want Delete this Chat ?')) {
            database.child("chating/"+chatid).remove();
            document.getElementById('chat').innerHTML="";
            showToast("Chat deleted Sucessfully");
            document.getElementById('msg').disabled=true;
            var myasynktask = new Promise(function(sucess , failure){
                setTimeout(function()  {
            window.history.back();
            }, 3000)});
        } else {
            showToast("your actoin is canceled");
        }
        }
}
