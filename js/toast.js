// code for show toast msg
function showToast(text){
  var x=document.getElementById("toast");
  x.classList.add("show");
  x.innerHTML=text;
  setTimeout(function(){
    x.classList.remove("show");
  },3000);
}

//code to show progress bar
function move() {
  document.getElementById("myBar").setAttribute('style' , 'visibility: visible');
  var elem = document.getElementById("myBar"); 
  var width = 10;
  var id = setInterval(frame, 110);
  function frame() {
      if (width >= 98) {
          clearInterval(id);
      } else {
          width++; 
          elem.style.width = width + '%'; 
          elem.innerHTML = width * 1 + '%';
      }
  }
}