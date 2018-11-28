window.onload = getuserno;

var database = firebase.database().ref();

var myno, friendno, mesg, chatid;
var d = new Date();



function getuserno() {
    myno = localStorage.getItem("myid");
    chatid = localStorage.getItem("chatid");

    document.getElementById('names').innerHTML = "<b> Me : " + localStorage.getItem("myemail") + "</b> <br> " + " <b> Friend : "
        + localStorage.getItem("friendchatmail") + "</b>";
    console.log('getUserno');
    showmsg();
}

function chating() {

    mesg = document.getElementById('msg').value;

    if (mesg.length < 1) {
        showToast("Please write some thing");
    }
    else {
        // var a =  localStorage.getItem('friendmail');

        var skey = database.child('chating/' + chatid).push();
        const msgObj = {
            id: skey.key,
            message: mesg,
            time: (new Date()).getTime(),
            friendid: localStorage.getItem('myemail'),
            myno: localStorage.getItem('myid'),
            nfriendid:localStorage.getItem('friendchatmail'),
        };
        skey.set(msgObj);

        mesg = document.getElementById('msg').value = "";

        // document.getElementById('chat').innerHTML = "";
        // showmsg();
    }
}

function showmsg() {

    var checker=0;

    var myasynktask = new Promise(function(sucess , failure){
        setTimeout(function()  {
            if(checker==0){
                document.getElementById('loaddiv').hidden="true";
                document.getElementById('offline').innerHTML='<b> No Chats or may have been Deleted </b>';
            }
         }, 10000)});


    database.child("chating/" + chatid).on('child_added', function (data) {

        id = data.val().myno;
        msg = data.val().message;

        checker=1;

        document.getElementById('loaddiv').hidden="true";
        document.getElementById('offline').innerHTML='';
        
        var np = document.createElement('p');
        if (id == myno) {
            np.setAttribute('align', 'right');
            np.innerHTML += msg;
        } else {
            np.setAttribute('align', 'left');
            np.innerHTML += msg;
        }

        document.getElementById('chat').appendChild(np);
    });
}

async function delChat() {

    if( document.getElementById('chat').innerHTML==""){
        showToast('No Chat Found')
    }else{
    if (confirm('Are you sure you want to delete this chat ?')) {
        database.child("chating/" + chatid).remove();
        document.getElementById('chat').innerHTML = "";
        showToast('Chat deleted sucessfully');
    } else {
        showToast('Your Action is Cancelled')
    }
}
}