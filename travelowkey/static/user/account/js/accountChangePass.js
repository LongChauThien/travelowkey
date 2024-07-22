const oldPassword = document.getElementById('password-txt-old');
const newPassword = document.getElementById('password-txt-new');
const confirmPassword = document.getElementById('password-txt-confirm');
const savePasswordBtn = document.getElementById('password-btn-save');

savePasswordBtn.addEventListener('click', ChangePassword);
// async function getCookie(name) {
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== '') {
//         const cookies = document.cookie.split(';');
//         for (let i = 0; i < cookies.length; i++) {
//             const cookie = cookies[i].trim();
//             if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }

async function ChangePassword() {
    if (oldPassword.value === '' || newPassword.value === '' || confirmPassword.value === '') {
        alert('Please fill in all fields!');
        return;
    }
    if (newPassword.value !== confirmPassword.value) {
        alert('New password and confirm password do not match!');
        return;
    }
    let access_token = await getCookie('access_token');
    console.log(access_token);
    const xhr = new XMLHttpRequest();
    xhr.open('PUT','/user/api/update_pass/',true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer ${access_token}`);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = this.responseText;
            console.log(response)
            oldPassword.value = '';
            newPassword.value = '';
            confirmPassword.value = '';
        }
    };
    const payload = {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value
    };
    xhr.send(JSON.stringify(payload));
}

