
let xhttp = new XMLHttpRequest();
function request(method, path, body,callback){
  xhttp.open(method, path, true);
  xhttp.setRequestHeader("Content-type","application/json;charset=UTF-8");
  xhttp.send(JSON.stringify(body));
  xhttp.onload = function() {
    callback(xhttp.responseText);
  }
}

function login(e){
  e.preventDefault();
  let form = document.getElementById('loginForm');
  data = getFormData(form);
  console.log(data);
  request('POST', '/api/user/login', data, (data) => {
    document.cookie = 'auth-token=' + data;
  });
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
