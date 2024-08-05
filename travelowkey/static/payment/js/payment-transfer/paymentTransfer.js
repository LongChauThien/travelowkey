let transferSearchInfo = {};
let transferPaymentInfo = {};
let totalPrice = 0;
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
transferSearchInfo.location = params.get('lc'); 
transferSearchInfo.startDate = params.get('sd');
transferSearchInfo.startTime = params.get('st');
transferSearchInfo.endDate = params.get('ed');
transferSearchInfo.endTime = params.get('et');
transferSearchInfo.haveDriver = params.get('hd');
transferPaymentInfo.transferID = params.get('transferID');

window.addEventListener("load", () => {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/payment/api/taxi?id="+transferPaymentInfo.transferID, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let transferInfo = JSON.parse(this.responseText);
            document.getElementById("txt-brand").innerHTML = transferInfo.name;
            document.getElementById("txt-location").innerHTML = transferSearchInfo.location;
            document.getElementById("txt-startDate").innerHTML = changeDateFormat(transferSearchInfo.startDate);
            document.getElementById("txt-startTime").innerHTML = transferSearchInfo.startTime;
            document.getElementById("txt-endDate").innerHTML = changeDateFormat(transferSearchInfo.endDate);
            document.getElementById("txt-endTime").innerHTML = transferSearchInfo.endTime;
            if (transferSearchInfo.haveDriver) {
                document.getElementById("txt-taxiType").innerHTML = "Có tài xế";
            }
            else {
                document.getElementById("txt-taxiType").innerHTML = "Tự lái";
            }
            totalPrice = calculateTotalDate(
                transferSearchInfo.startDate, transferSearchInfo.endDate, transferSearchInfo.startTime, transferSearchInfo.endTime)
                * transferInfo.price;
            document.getElementById("txt-price").innerHTML = changeMoneyFormat(transferInfo.price) + ' VND /ngày';
            document.getElementById("txt-totalPrice").innerHTML =  changeMoneyFormat(totalPrice) + ' VND';
        }
    }
    xhttp.send();
})

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

function calculateTotalDate(startDate, endDate, startTime, endTime) {
    let totalDate = 0;
    let startDateArray = startDate.split('-');
    let endDateArray = endDate.split('-');
    let startTimeArray = startTime.split(':');
    let endTimeArray = endTime.split(':');
    let startDateObj = new Date(startDateArray[0], startDateArray[1], startDateArray[2], startTimeArray[0], startTimeArray[1]);
    let endDateObj = new Date(endDateArray[0], endDateArray[1], endDateArray[2], endTimeArray[0], endTimeArray[1]);
    let timeDiff = endDateObj.getTime() - startDateObj.getTime();
    totalDate = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return totalDate;
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
    xhttp.open("POST", "/payment/api/taxi_invoice/", true);
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
        taxiID: transferPaymentInfo.transferID,
        startDate: transferSearchInfo.startDate,
        startTime: transferSearchInfo.startTime,
        endDate: transferSearchInfo.endDate,
        endTime: transferSearchInfo.endTime,
        totalPrice: totalPrice
    }
    xhttp.send(JSON.stringify(payload));
})