let roomSearchInfo = {};
let roomPaymentInfo = {};
let totalPrice = 0;
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
roomSearchInfo.checkinDate = params.get('ci');
roomSearchInfo.checkoutDate = params.get('co');
roomSearchInfo.guestNum = params.get('guestNum');
roomPaymentInfo.ID = params.get('roomID');

function calculateTotalPrice(price) {
    let startDate = new Date(roomSearchInfo.checkinDate);
    let endDate = new Date(roomSearchInfo.checkoutDate);
    let totalDate = (endDate - startDate) / (1000 * 60 * 60 * 24);
    if (totalDate == 0) {
        return price;
    }
    else {
        return totalDate * price;
    }

}

function changeMoneyFormat(money) {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function changeDateFormat(date) {
    let dateArray = date.split('-');
    let day = dateArray[2];
    let month = dateArray[1];
    let year = dateArray[0];
    let monthArray = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4',
        'tháng 5', 'tháng 6', 'tháng 7', 'tháng 8',
        'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];
    return `${day}, ${monthArray[month - 1]}, ${year}`;
}
window.addEventListener('load', () => {
    document.getElementById("txt-startDate").innerText = changeDateFormat(roomSearchInfo.checkinDate);
    document.getElementById("txt-endDate").innerText = changeDateFormat(roomSearchInfo.checkoutDate);
    document.getElementById("txt-guestNum").innerText = roomSearchInfo.guestNum;
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/payment/api/room?id="+roomPaymentInfo.ID, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let roomInfo = JSON.parse(this.responseText);
            document.getElementById("txt-roomName").innerHTML = roomInfo.name;
            document.getElementById("txt-name").innerText = roomInfo.hotelName;
            document.getElementById("txt-address").innerText = roomInfo.hotelAddress;
            document.getElementById("txt-price").innerText = changeMoneyFormat(roomInfo.price) + ' VND';
            totalPrice = calculateTotalPrice(roomInfo.price);
            document.getElementById("txt-totalPrice").innerText = changeMoneyFormat(totalPrice) + ' VND';
        }
    };
    xhttp.send();
});

const btnPayment = document.querySelector(".btn-payment");

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

btnPayment.addEventListener("click", async function () {
    let access_token = await getCookie('access_token');
    if (!access_token) {
        alert("Đăng nhập trước khi thanh toán!");
        window.location.href = "/user/login";
        return
    }
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/payment/api/room_invoice/", true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.setRequestHeader('Authorization', `Bearer ${access_token}`);
    xhttp.onreadystatechange = async function () {
        if (this.readyState == 4 && this.status == 200) {
            
            let result = JSON.parse(this.responseText);
            if (result.message == "Payment success") {
                alert("Thanh toán thành công!");
                window.location.href = "/user/account?nav=bill-pane";
                return
            }
            else 
            {
                alert("Thanh toán thất bại!");
                window.location.href = "/home";
                return
            }
        }
        else if (this.readyState==4 && this.status == 401) {
            const new_access_token = await refreshToken();
            if (new_access_token) {
                alert("Đăng nhập lại!");
                sendPayment();
            } else {
                alert("Đăng nhập trước khi thanh toán!");
                window.location.href = "/user/login";
                return
            }
        }
    };
    const payload = {
        roomID: roomPaymentInfo.ID,
        checkIn: roomSearchInfo.checkinDate,
        checkOut: roomSearchInfo.checkoutDate,
        totalPrice: totalPrice
    }
    xhttp.send(JSON.stringify(payload));
})


