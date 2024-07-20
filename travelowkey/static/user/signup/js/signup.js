const signupIcon = document.querySelectorAll(".signup-input-icon");
const passwordInput = document.getElementById("password");
const passwordConfirmInput  = document.getElementById("retype-password");
const passwordIcon = document.getElementById("password-icon");
const retypeIcon = document.getElementById("retype-icon");

signupIcon.forEach((icon) => { 
    icon.addEventListener("click", function(e) {
        if (e.target.id == "password-icon") {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                passwordIcon.name = "eye-off-outline";
            } else {
                passwordInput.type = "password";
                passwordIcon.name = "eye-outline";
            }
        }
        else if (e.target.id == "retype-icon") {
            if (passwordConfirmInput.type === "password") {
                passwordConfirmInput.type = "text";
                retypeIcon.name = "eye-off-outline";
            } else {
                passwordConfirmInput.type = "password";
                retypeIcon.name = "eye-outline";
            }
        }
    });
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

document.querySelector(".btn-signup").addEventListener("click", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const retypePassword = document.getElementById("retype-password").value;

    if (email ==="") {
        alert("Vui lòng nhập email");
        return;
    }
    if (phone ==="") {
        alert("Vui lòng nhập số điện thoại");
        return;
    }
    if (password ==="") {
        alert("Vui lòng nhập mật khẩu");
        return;
    }
    if (retypePassword ==="") {
        alert("Vui lòng nhập lại mật khẩu");
        return;
    }
    if (password !== retypePassword) {
        alert("Sai mật khẩu nhập lại");
        return;
    }

    fetch('/user/api/signup/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            email: email,
            phone: phone,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message==="User created"){
            alert("Tạo tài khoản thành công");
            setTimeout(() => {
                window.location.href = "/user/login";
            }, 1000);
        }
        else {
            alert("Tạo tài khoản thất bại");
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});


