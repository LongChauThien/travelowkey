window.addEventListener("load", LoadAccountInfo);

let accountInfo = {}
let newAccountInfo = {}
let changeInfoNames = []

async function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function refreshToken() {
    const refresh_token = getCookie('refresh_token');
    if (!refresh_token) {
        alert('Cần đăng nhập lại');
        return null;
    }

    const response = await fetch('/user/api/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({ refresh: refresh_token }),
    });

    if (response.ok) {
        const data = await response.json();
        document.cookie = `access_token=${data.access}; path=/`;
        return data.access;
    } else {
        alert('Cần đăng nhập lại 1');
        return null;
    }
}

async function LoadAccountInfo() {
    let access_token = getCookie('access_token');
    if (!access_token) {
        alert('Cần đăng nhập');
        return;
    }
    const response = await fetch('/user/api/user_info/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
        },
    });

    if (response.ok) {
        accountInfo = await response.json();
        LoadInfoView(accountInfo);
        LoadInfoEdit(accountInfo);
    } else if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
            await LoadAccountInfo();
        }
    } else {
        alert('Cần đăng nhập lại 2');
    }
}


function LoadInfoView(info){
  if(info.Name) document.getElementById("user-name-text").innerHTML = info.Name;
  if(info.Sex) document.getElementById("user-gender-text").innerHTML = info.Sex=="Male"?"Nam":"Nữ";
  if(info.Birthday) document.getElementById("user-bdate-text").innerHTML = ChangeDateType(info.Birthday);
  if(info.Email) document.getElementById("user-email-text").innerHTML = info.Email;
  if(info.Nationality) document.getElementById("user-nation-text").innerHTML = info.Nationality;
  if(info.Phone) document.getElementById("user-phone-text").innerHTML = info.Phone;
  if(info.Nation) document.getElementById("user-ppnation-text").innerHTML = info.Nation;
  if(info.Expiration) document.getElementById("user-ppdate-text").innerHTML = ChangeDateType(info.Expiration);
}
function LoadInfoEdit(info){
  document.getElementById("user-txt-name").value = info.Name;
  document.getElementById("txt-user-gender").value = info.Sex;
  document.getElementById("user-txt-bdate").value = info.Birthday;
  document.getElementById("user-txt-email").value = info.Email;
  document.getElementById("user-txt-nation").value = info.Nationality;
  document.getElementById("user-txt-phone").value = info.Phone;
  document.getElementById("user-txt-ppnation").value = info.Nation;
  document.getElementById("user-txt-ppdate").value = info.Expiration;
}