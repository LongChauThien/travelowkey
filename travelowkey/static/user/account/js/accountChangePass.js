const oldPassword = document.getElementById('password-txt-old');
const newPassword = document.getElementById('password-txt-new');
const confirmPassword = document.getElementById('password-txt-confirm');
const savePasswordBtn = document.getElementById('password-btn-save');

savePasswordBtn.addEventListener('click', ChangePassword);

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
    const xhr = new XMLHttpRequest();
    xhr.open('PUT','/user/api/update_pass/',true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer ${access_token}`);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.responseText);
            console.log(response.message);
            if (response.message === "Cập nhật mật khẩu thành công") {
                alert(response.message);
                oldPassword.value = '';
                newPassword.value = '';
                confirmPassword.value = '';
            }
            else {
                alert('Cập nhật mật khẩu thất bại');
            }
        }
    };
    const payload = {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value
    };
    xhr.send(JSON.stringify(payload));
}

