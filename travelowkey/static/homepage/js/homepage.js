const featureButtons = document.querySelectorAll('.feature-container__navbar .navbar__item');
const featureContainers = document.querySelectorAll('.feature-container__item');''
const backgroundImages = document.querySelector('#background-image');
const img_path = backgroundImages.src.split('/');
const img_base = img_path.slice(0, img_path.length - 1).join('/');
img_idx = 0;
setInterval(() => {
    img_idx = img_idx % 5 +1;
    backgroundImages.attributes.src.value = `${img_base}/background${img_idx}.jpg`;
}, 10000);

featureButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        featureButtons.forEach(btn => btn.classList.remove('selected'));
            btn.classList.add('selected');
            const target = btn.dataset.featureType;
            featureContainers.forEach(feature => {
                feature.classList.remove('show');
                feature.classList.add('hide');
                if (feature.dataset.featureType === target) {
                    feature.classList.add('show');
                    feature.classList.remove('hide');
            }
        });
    });
});


window.onscroll = function() {onScroll()};
function onScroll() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        document.getElementById('header').classList.add('on-scroll');
    } else {
        document.getElementById('header').classList.remove('on-scroll');
    }
}


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
const btnLogin = document.getElementById('btn-login');
const btnSignup = document.getElementById('btn-signup');
const btnAccount = document.getElementById('btn-account');

async function checkLogin() {
    let access_token = await getCookie('access_token');
    if (!access_token) {
        console.log('no access token');
        btnLogin.classList.remove('hide');
        btnSignup.classList.remove('hide');
        btnAccount.classList.add('hide');
        return;
    }
    const response = await fetch('/user/api/check_login/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
        },
    });
    if (response.ok) {
        console.log('access token valid');
        btnLogin.classList.add('hide');
        btnSignup.classList.add('hide');
        btnAccount.classList.remove('hide');
    }
    else if (response.status == 401) {
        const new_access_token = await refreshToken();
        if (new_access_token) {
            checkLogin();
        } else {
            console.log('refresh token invalid');
            btnLogin.classList.add('hide');
            btnSignup.classList.add('hide');
            btnAccount.classList.remove('hide');
    }}
    else {
        console.log('access token invalid');
        btnLogin.classList.add('hide');
        btnSignup.classList.add('hide');
        btnAccount.classList.remove('hide');
    }
}
window.addEventListener("load", checkLogin);


