const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const billId = params.get("billId");
window.addEventListener("load", LoadBillDetail);

function LoadBillDetail() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET","/payment/api/bill-detail/hotel?id=" + billId,true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
        try {
            let billDetail = JSON.parse(this.responseText);
            document.getElementById("txt-startDate").innerHTML = changeDateAndTimeFormat(billDetail.checkIn);
            document.getElementById("txt-endDate").innerHTML = changeDateAndTimeFormat(billDetail.checkOut);
            document.getElementById("txt-name").innerHTML = billDetail.name;
            document.getElementById("txt-address").innerHTML = billDetail.address;
            document.getElementById("txt-roomName").innerHTML = billDetail.roomName;
            document.getElementById("txt-guestNum").innerHTML = billDetail.max;
            document.getElementById("txt-price").innerHTML = changeMoneyFormat(billDetail.price) + " VNĐ";
            document.getElementById("txt-totalPrice").innerHTML = changeMoneyFormat(calculateTotalPrice(billDetail.checkIn,billDetail.checkOut,billDetail.price)) + " VNĐ";
        } catch (err) {
            console.log(err);
        }
        }
    };
    xhttp.send();
}

function calculateTotalPrice(checkinDate,checkoutDate,price) {
    let startDate = new Date(checkinDate);
    let endDate = new Date(checkoutDate);
    let totalDate = (endDate - startDate) / (1000 * 60 * 60 * 24);
    if (totalDate == 0) {
        return price;
    }
    else {
        return totalDate * price;
    }

}

function changeDateFormat(date) {
    let dateArr = date.split("-");
    let day = dateArr[2];
    let month = dateArr[1];
    let year = dateArr[0];
    return day + " tháng " + month + ", " + year;
}

function changeDateAndTimeFormat(dateAndTime) {
    let dateAndTimeArr = dateAndTime.split(" ");
    let date = changeDateFormat(dateAndTimeArr[0]);
    let time = dateAndTimeArr[1];
    return time + ' - ' + date;
}

function changeMoneyFormat(money) {
    //check if money is a number then convert to string
    if (typeof money == "number") {
        money = money.toString();
    }
    let moneyArr = money.split("");
    let moneyFormat = "";
    let count = 0;
    for (let i = moneyArr.length - 1; i >= 0; i--) {
        count++;
        moneyFormat = moneyArr[i] + moneyFormat;
        if (count % 3 == 0 && i != 0) {
            moneyFormat = "." + moneyFormat;
        }
    }
    return moneyFormat;
}