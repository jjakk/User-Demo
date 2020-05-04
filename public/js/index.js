
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

function login(e){
  e.preventDefault();
  let form = document.getElementById('loginForm');
  formData = getFormData(form);
  request('POST', '/api/user/login', (data) => {
    document.cookie = 'auth-token=' + data;
    window.location = '/loggedIn';
  }, formData);
}

// Got this from stack overflow.  It gets data from a cookie
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

// Takes form element as parameter and returns an object of data
function getFormData(form){
  let data = {};
  for(let ele of form.children){
    if(ele.tagName === 'INPUT'){
      data[ele.name] = ele.value;
    }
  }
  return data;
}
