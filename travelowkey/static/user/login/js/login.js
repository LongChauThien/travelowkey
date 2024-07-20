const loginIcon = document.querySelector(".login-input-icon");
const passwordInput = document.getElementById("txt-password");

loginIcon.addEventListener("click", () => { 
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        loginIcon.name = "eye-off-outline";
    } else {
        passwordInput.type = "password";
        loginIcon.name = "eye-outline";
    }
});

function getCookie(name) {
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

const csrftoken = getCookie('csrftoken');

document.querySelector(".btn-login").addEventListener("click", async (e) => {
    e.preventDefault();
  
    let email = document.getElementById("txt-email").value;
    let password = document.getElementById("txt-password").value;
  
    fetch('api/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.access && data.refresh) {
            document.cookie = `access_token=${data.access}; path=/;`;
            document.cookie = `refresh_token=${data.refresh}; path=/;`;
            alert('Login successful!');
            window.location.href = '/user/account';
        } else {
            alert('Login failed!');
        }
    })
    .catch(error => console.error('Error:', error));
});