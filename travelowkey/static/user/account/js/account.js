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
    const refresh_token = await getCookie('refresh_token');
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
        window.location.href = '/user/login';
        return null;
    }
}

async function LoadAccountInfo() {
    let access_token = await getCookie('access_token');
    console.log('from account'+ access_token);
    if (!access_token) {
        alert('Cần đăng nhập');
        window.location.href = '/user/login';
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
        window.location.href = '/user/login';
    }
}

function ChangeDateType(date){
    let dateArr = date.split("-");
    return dateArr[2] + "/" + dateArr[1] + "/" + dateArr[0];
}

function LoadInfoView(info){
  if(info.name) document.getElementById("user-name-text").innerHTML = info.name;
  if(info.sex) document.getElementById("user-gender-text").innerHTML = info.sex=="Male"?"Nam":"Nữ";
  if(info.birthday) document.getElementById("user-bdate-text").innerHTML = ChangeDateType(info.birthday);
  if(info.email) document.getElementById("user-email-text").innerHTML = info.email;
  if(info.nationality) document.getElementById("user-nation-text").innerHTML = info.nationality;
  if(info.phone) document.getElementById("user-phone-text").innerHTML = info.phone;
  if(info.nation) document.getElementById("user-ppnation-text").innerHTML = info.nation;
  if(info.expiration) document.getElementById("user-ppdate-text").innerHTML = ChangeDateType(info.expiration);
}
function LoadInfoEdit(info){
  document.getElementById("user-txt-name").value = info.name;
  document.getElementById("txt-user-gender").value = info.sex;
  document.getElementById("user-txt-bdate").value = info.birthday;
  document.getElementById("user-txt-email").value = info.email;
  document.getElementById("user-txt-nation").value = info.nationality;
  document.getElementById("user-txt-phone").value = info.phone;
  document.getElementById("user-txt-ppnation").value = info.nation;
  document.getElementById("user-txt-ppdate").value = info.expiration;
}

const viewInfo = document.getElementById("user-info-view");
const editInfo = document.getElementById("user-info-form");
const editBtn = document.getElementById("user-btn-edit");
const saveBtn = document.getElementById("user-btn-save");
const cancelBtn = document.getElementById("user-btn-clear");

editBtn.addEventListener("click", EditAccountInfo);
saveBtn.addEventListener("click", SaveAccountInfo);
cancelBtn.addEventListener("click", CancelEdit);

function EditAccountInfo() {
    viewInfo.classList.add("hide");
    editInfo.classList.remove("hide");
    LoadInfoEdit(accountInfo);
}

async function SaveAccountInfo() {
    newAccountInfo = {};
    changeInfoNames = [];
    let isChange = false;

    isChange = SetNewInfo("user-txt-name", "Name");
    isChange |= SetNewInfo("txt-user-gender", "Sex");
    isChange |= SetNewInfo("user-txt-bdate", "Birthday");
    isChange |= SetNewInfo("user-txt-email", "Email");
    isChange |= SetNewInfo("user-txt-nation", "Nationality");
    isChange |= SetNewInfo("user-txt-phone", "Phone");
    isChange |= SetNewInfo("user-txt-ppnation", "Nation");
    isChange |= SetNewInfo("user-txt-ppdate", "Expiration");

    if (!isChange) {
        console.log("Không có gì thay đổi");
        viewInfo.classList.remove("hide");
        editInfo.classList.add("hide");
        return;
    }

    let xhr = new XMLHttpRequest();
    let access_token = await getCookie('access_token');
    console.log('from save'+ access_token);
    xhr.open("PUT", "/user/api/update_info/", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer ${access_token}`);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                let response = JSON.parse(this.responseText);
                console.log(response);
                LoadAccountInfo();
                viewInfo.classList.remove("hide");
                editInfo.classList.add("hide");
            } catch (err) {
                console.log(err);
            }
        }
    };
    console.log("newAccountInfo: ", newAccountInfo);
    console.log("changeInfoNames: ", changeInfoNames);
    xhr.send();
}

function SetNewInfo(id, key) {
    let value = document.getElementById(id).value;
    if (value != accountInfo[key]) {
        newAccountInfo[key] = value;
        changeInfoNames.push(key);
        return true;
    }
    return false;
}

function CancelEdit() {
    viewInfo.classList.remove("hide");
    editInfo.classList.add("hide");
}
