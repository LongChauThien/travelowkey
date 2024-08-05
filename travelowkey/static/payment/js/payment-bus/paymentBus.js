let totalPrice;
let busPaymentInfo = {busID: '', ticketNumber: 0};
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
busPaymentInfo.busID = params.get('busID');
busPaymentInfo.ticketNumber = Number(params.get('ticketNumber'));

window.onload = function () {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/payment/api/bus?id="+busPaymentInfo.busID, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let busInfo = JSON.parse(this.responseText);
            document.getElementById("txt-from").innerHTML = busInfo.from;
            document.getElementById("txt-to").innerHTML = busInfo.to;
            document.getElementById("txt-departureDate").innerHTML = changeDateFormat(busInfo.date);
            document.getElementById("txt-departureTime").innerHTML = busInfo.departureTime;
            document.getElementById("txt-brand").innerHTML = busInfo.name;
            document.getElementById("txt-pickPoint").innerHTML = busInfo.pickPoint;
            document.getElementById("txt-desPoint").innerHTML = busInfo.desPoint;
            document.getElementById("txt-busType").innerHTML = busInfo.seatCount;
            document.getElementById("txt-price").innerHTML = changeMoneyFormat(busInfo.price) + ' VND';
            document.getElementById("txt-ticket").innerHTML = 'x ' + busPaymentInfo.ticketNumber;
            document.getElementById("txt-totalPrice").innerHTML =
                changeMoneyFormat(busInfo.price * busPaymentInfo.ticketNumber) + ' VND';
            document.getElementById("txt-travelTime").innerHTML = busInfo.travelTime;
            document.getElementById("txt-arrivalTime").innerHTML = busInfo.arrivalTime;
            totalPrice = busInfo.price * busPaymentInfo.ticketNumber;
        };
    };
    xhttp.send();
}
function changeDateFormat(date) {
    let dateArray = date.split('-');
    let day = dateArray[2];
    let month = dateArray[1];
    let year = dateArray[0];
    let monthArray = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4',
        'tháng 5', 'tháng 6', 'tháng 7', 'tháng 8',
        'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];
    return `${day} ${monthArray[month - 1]}, ${year}`;
}

function changeMoneyFormat(money) {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

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
    xhttp.open("POST", "/payment/api/bus_invoice/", true);
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
        busID: busPaymentInfo.busID,
        ticketNum: busPaymentInfo.ticketNumber,
        totalPrice: totalPrice
    };
    xhttp.send(JSON.stringify(payload));
})