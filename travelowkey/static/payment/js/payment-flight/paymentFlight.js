let flightPaymentInfo = {flightID: '', ticketNumber: 0};
let totalPrice;

const btnPayment = document.querySelector(".btn-payment");
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
flightPaymentInfo.flightID = params.get('flightID');
flightPaymentInfo.ticketNumber = Number(params.get('ticketNumber'));


window.onload = function () {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/payment/api/flight?id="+flightPaymentInfo.flightID, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            let flightInfo = JSON.parse(this.responseText);
            if (flightInfo) {
                document.getElementById("payment-window__flight-info").innerHTML = "";
                document.getElementById("payment-window__price-info").innerHTML = "";
                document.getElementById("payment-window__flight-info").innerHTML += `
                <div id="text-info">
                    <div class="container row-container flex-row justify-between">
                        <div class="content-container flex-row align-center">
                            <div class="label">Điểm đi:</div>
                            <div class="text" id="txt-from">${flightInfo.from}</div>
                        </div>
                        <div class="content-container flex-row align-center">
                            <div class="label">Điểm đến:</div>
                            <div class="text" id="txt-to">${flightInfo.to}</div>
                        </div>
                    </div>
                    <div class="container row-container flex-row justify-between">
                        <div class="content-container flex-row align-center">
                            <div class="label">Ngày khởi hành:</div>
                            <div class="text" id="txt-departureDate">${changeDateFormat(flightInfo.date)}</div>
                        </div>
                        <div class="content-container flex-row align-center">
                            <div class="label">Giờ khởi hành:</div>
                            <div class="text" id="txt-departureTime">${flightInfo.departureTime}</div>
                        </div>
                    </div>
                    <div class="container row-container flex-row justify-between">
                        <div class="content-container flex-row align-center">
                            <div class="label">Thời gian bay:</div>
                            <div class="text" id="txt-travelTime">${flightInfo.travelTime}</div>
                        </div>
                        <div class="content-container flex-row align-center">
                            <div class="label">Giờ hạ cánh:</div>
                            <div class="text" id="txt-arrivalTime">${flightInfo.arrivalTime}</div>
                        </div>
                    </div>
                    <div class="container row-container flex-row justify-between">
                        <div class="content-container flex-row align-center">
                            <div class="label">Tên hãng:</div>
                            <div class="text" id="txt-brand">${flightInfo.name}</div>
                        </div>
                        <div class="content-container flex-row align-center">
                            <div class="label">Hạng ghế:</div>
                            <div class="text" id="txt-seatType">${flightInfo.seatClass}</div>
                        </div>
                    </div>
                </div>`
                document.getElementById("payment-window__price-info").innerHTML += `
                    <div class="container row-container flex-row justify-between">
                    <div class="content-container flex-row align-center">
                        <div class="label">Số vé:</div>
                        <div class="text" id="txt-ticket">x ${flightPaymentInfo.ticketNumber}</div>
                    </div>
                    <div class="content-container flex-row align-center">
                        <div class="label fs-16" id="txt-price">${changeMoneyFormat(flightInfo.price)} VND</div>
                    </div>
                </div>
                <div class="container row-container flex-row justify-between">
                    <div class="content-container flex-row align-center">
                        <div class="label">Tổng giá tiền</div>
                    </div>
                    <div class="content-container flex-row align-center">
                        <div class="label" id="txt-totalPrice">${changeMoneyFormat(flightInfo.price * flightPaymentInfo.ticketNumber)} VND</div>
                    </div>
                </div>`
                totalPrice = flightInfo.price * flightPaymentInfo.ticketNumber;
            }
            else {
                document.getElementById("payment-window__flight-info").innerHTML += "ERROR";
                document.getElementById("payment-window__price-info").innerHTML += "ERROR";
            }
        }
    };
    xhttp.send();
}

function changeDateFormat(date) {
    //change date format from 'yyyy-mm-dd' to 'dd, thng mm, yyyy'
    let dateArray = date.split('-');
    let day = dateArray[2];
    let month = dateArray[1];
    let year = dateArray[0];
    let monthArray = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4',
        'tháng 5', 'tháng 6', 'tháng 7', 'tháng 8',
        'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];
    return `${day}, ${monthArray[month - 1]}, ${year}`;
}

function changeMoneyFormat(money) {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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


btnPayment.addEventListener("click", async function sendPayment() { 
    let access_token = await getCookie('access_token');
    if (!access_token) {
        alert("Đăng nhập trước khi thanh toán!");
        window.location.href = "/user/login";
        return
    }
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/payment/api/flight_invoice/", true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.setRequestHeader('Authorization', `Bearer ${access_token}`);
    xhttp.onreadystatechange = async function sendPayment() {
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
        flightID: flightPaymentInfo.flightID,
        ticketNum: flightPaymentInfo.ticketNumber,
        totalPrice: totalPrice
    };
    xhttp.send(JSON.stringify(payload));
})