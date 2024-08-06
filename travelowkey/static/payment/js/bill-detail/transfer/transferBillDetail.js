const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const billId = params.get("billId");
window.addEventListener("load", LoadBillDetail);

function LoadBillDetail() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET","/payment/api/bill-detail/transfer?id=" + billId,true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
        try {
            let billDetail = JSON.parse(this.responseText);
            document.getElementById("txt-location").innerHTML = billDetail.pickPoint;
            document.getElementById("txt-startDate").innerHTML = changeDateFormat(billDetail.departureDay);
            document.getElementById("txt-startTime").innerHTML = billDetail.timeStart;
            document.getElementById("txt-endDate").innerHTML = changeDateFormat(billDetail.arrivalDay);
            document.getElementById("txt-endTime").innerHTML = billDetail.timeEnd;
            document.getElementById("txt-brand").innerHTML = billDetail.name;
            document.getElementById("txt-taxiType").innerHTML = billDetail.type;
            document.getElementById("txt-price").innerHTML = changeMoneyFormat(billDetail.price) + " VND /ngày";
            document.getElementById("txt-totalPrice").innerHTML = changeMoneyFormat(calculateTotalDate(billDetail.departureDay,billDetail.arrivalDay,billDetail.timeStart,billDetail.timeEnd)*billDetail.price) + " VND";

        } catch (err) {
            console.log(err);
        }
        }
    };
    xhttp.send();
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