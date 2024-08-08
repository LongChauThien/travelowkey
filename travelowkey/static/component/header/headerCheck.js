const headerDefault = document.getElementById("header-default");
const headerLoggedIn = document.getElementById("header-logged-in");

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
        return null;
    }
}

async function checkLogin() {
    let access_token = await getCookie('access_token');
    console.log('access token:', access_token);
    if (!access_token) {
        console.log('no access token');
        headerDefault.classList.remove('hide');
        headerLoggedIn.classList.add('hide');
        return;
    }
    const response = await fetch('/user/api/check_login/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
        },
    });
    const responseData = await response.json();
    console.log('status', response.status , 'Response data:', responseData);
    if (response.ok) {
        console.log('access token valid');
        headerDefault.classList.add('hide');
        headerLoggedIn.classList.remove('hide');
    }
    else if (response.status == 401) {
        const new_access_token = await refreshToken();
        if (new_access_token) {
            checkLogin();
        } else {
            console.log('refresh token invalid');
            headerDefault.classList.remove('hide');
            headerLoggedIn.classList.add('hide');
    }}
    else {
        console.log('access token invalid');
        headerDefault.classList.remove('hide');
        headerLoggedIn.classList.add('hide');
    }
}
window.addEventListener("load", checkLogin);