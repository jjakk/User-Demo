
let xhttp = new XMLHttpRequest();
function request(method, path, callback, body=null){
  xhttp.open(method, path, true);
  xhttp.setRequestHeader("Content-type","application/json;charset=UTF-8");
  if(getCookie('auth-token')) xhttp.setRequestHeader("auth-token", getCookie('auth-token'));
  xhttp.send(JSON.stringify(body));
  xhttp.onload = function() {
    callback(xhttp.responseText);
  }
}
