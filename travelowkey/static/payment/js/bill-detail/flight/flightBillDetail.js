const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const billId = params.get("billId");
window.addEventListener("load", LoadBillDetail);

function LoadBillDetail() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET","/payment/api/bill-detail/flight?id=" + billId,true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
        try {
            let billDetail = JSON.parse(this.responseText);
            document.getElementById("txt-from").innerHTML = billDetail.from;
            document.getElementById("txt-to").innerHTML = billDetail.to;
            document.getElementById("txt-departureDate").innerHTML = changeDateFormat(billDetail.date);
            document.getElementById("txt-departureTime").innerHTML = billDetail.departureTime;
            document.getElementById("txt-travelTime").innerHTML = billDetail.travelTime;
            document.getElementById("txt-arrivalTime").innerHTML = billDetail.arrivalTime;
            document.getElementById("txt-brand").innerHTML = billDetail.name;
            document.getElementById("txt-seatType").innerHTML = billDetail.seatClass;
            document.getElementById("txt-ticket").innerHTML = "x " + billDetail.num_ticket;
            document.getElementById("txt-price").innerHTML = changeMoneyFormat(billDetail.price) + " VND";
            document.getElementById("txt-totalPrice").innerHTML = changeMoneyFormat(+billDetail.price * +billDetail.num_ticket) + " VND";

        } catch (err) {
            console.log(err);
        }
        }
    };
    xhttp.send();
    }

function changeDateFormat(date) {
    let dateArr = date.split("-");
    let day = dateArr[2];
    let month = dateArr[1];
    let year = dateArr[0];
    return day + " tháng " + month + ", " + year;
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