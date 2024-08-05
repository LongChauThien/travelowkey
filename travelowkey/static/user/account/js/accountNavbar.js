const userPane = document.querySelector("#user-pane");
const billPane = document.querySelector("#bill-pane");
const buttons = document.querySelectorAll(".nav-tab");



async function navigateTab(e) {
    if (e.currentTarget.id === "btn-account-user") {
        userPane.classList.remove("hide");
        billPane.classList.add("hide");
    } 
    else if (e.currentTarget.id === "btn-account-bill"){
        billPane.classList.remove("hide");
        userPane.classList.add("hide");
    }
    else if (e.currentTarget.id === "btn-account-logout") {
        let access_token = await getCookie('access_token');
        let refresh_token = await getCookie('refresh_token');
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/user/api/logout/', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${access_token}`);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText);
                if (response.message === "Successfully logged out.") {
                window.location.href = "/home";
                }
            }
        };
        const payload = {
            refresh: refresh_token
        };
        xhr.send(JSON.stringify(payload));
    }
}

buttons.forEach((btn) => {
    btn.addEventListener("click", navigateTab);
});

window.addEventListener("load", CheckNav);

function CheckNav() {
    //get nav value from url
    const urlParams = new URLSearchParams(window.location.search);
    const nav = urlParams.get("nav");
    if (nav === "bill-pane") {
        billPane.classList.remove("hide");
        userPane.classList.add("hide");
    }
    else {
        userPane.classList.remove("hide");
        billPane.classList.add("hide");
    }
}
