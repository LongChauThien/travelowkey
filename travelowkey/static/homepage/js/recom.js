const recomItem = document.querySelectorAll('.recom-item');
const recomFlight = document.getElementById('recom-flight');
const recomHotel = document.getElementById('recom-hotel');
const recomBus = document.getElementById('recom-bus');
const recomTransfer = document.getElementById('recom-transfer');

const recomFlightBtn = recomFlight.querySelectorAll('.recom-btn');
const recomHotelBtn = recomHotel.querySelectorAll('.recom-btn');
const recomBusBtn = recomBus.querySelectorAll('.recom-btn');
const recomTransferBtn = recomTransfer.querySelectorAll('.recom-btn');

recomItem.forEach(item => {
    item.addEventListener('mouseenter', () => {
        //remove hide class in recom-btn in this item
        item.querySelector('.recom-btn').classList.remove('hide');
        //add show class in recom-btn in this item
        item.querySelector('.recom-btn').classList.add('show');
    });
    item.addEventListener('mouseleave', () => {
        item.querySelector('.recom-btn').classList.remove('show');
        item.querySelector('.recom-btn').classList.add('hide');
    });
});

function GetTodayDate() {
    const today = new Date()
    const todayDate = today.getDate()
    const todayMonth = today.getMonth() + 1
    const todayYear = today.getFullYear()
    return `${todayYear}-${todayMonth < 10 ? "0" + todayMonth : todayMonth}-${todayDate < 10 ? "0" + todayDate : todayDate}`
}

const today = GetTodayDate()


//flight
const itemHNFlight = document.getElementById('item-hanoi-flight');
const itemDLFlight = document.getElementById('item-dalat-flight');
const itemHCMFlight = document.getElementById('item-hcm-flight');
const itemDNFlight = document.getElementById('item-danang-flight');

window.addEventListener('load', () => {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET","/flight/api/recom-flight?date="+today, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let results = JSON.parse(this.responseText);
                itemHNFlight.querySelector('.content .text').innerText = "Có " + results.HAN + " Chuyến bay";
                itemDLFlight.querySelector('.content .text').innerText = "Có " + results.DLI + " Chuyến bay";
                itemHCMFlight.querySelector('.content .text').innerText = "Có " + results.SGN + " Chuyến bay";
                itemDNFlight.querySelector('.content .text').innerText = "Có " + results.DAD + " Chuyến bay";
        }
    }
    xhttp.send();
});

let flightDestination = {
    value: "",
}
recomFlightBtn.forEach(btn => { 
    btn.addEventListener('click', () => {
        const value = btn.parentElement.dataset.location;
        flightDestination.value = value;
        sessionStorage.setItem('flightDestination', JSON.stringify(flightDestination));
        window.location.href = '../flight/search';
    });
});

//hotel
const itemHNHotel = document.getElementById('item-hanoi-hotel');
const itemDNHotel = document.getElementById('item-danang-hotel');
const itemHCMHotel = document.getElementById('item-hcm-hotel');
const itemVTHotel = document.getElementById('item-vungtau-hotel');

window.addEventListener('load', () => {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET","/hotel/api/recom-hotel", true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let results = JSON.parse(this.responseText);
                itemHNHotel.querySelector('.content .text').innerText = "Có " + results.HAN + " khách sạn";
                itemDNHotel.querySelector('.content .text').innerText = "Có " + results.DAD + " khách sạn";
                itemHCMHotel.querySelector('.content .text').innerText = "Có " + results.SGN + " khách sạn";
                itemVTHotel.querySelector('.content .text').innerText = "Có " + results.VTU + " khách sạn";
        }
    }
    xhttp.send();
});

let hotelLocation = {
    value: "",
}
recomHotelBtn.forEach(btn => { 
    btn.addEventListener('click', () => {
        const value = btn.parentElement.dataset.location;
        hotelLocation.value = value;
        sessionStorage.setItem('hotelLocation', JSON.stringify(hotelLocation));
        window.location.href = '../hotel/search';
    });
});

//bus
const itemHCMBus = document.getElementById('item-hcm-bus');
const itemHPBus = document.getElementById('item-haiphong-bus');
const itemDNBus = document.getElementById('item-danang-bus');
const itemHTBus = document.getElementById('item-hatinh-bus');
const itemLDBus = document.getElementById('item-lamdong-bus');
const itemKHBus = document.getElementById('item-khanhhoa-bus');
const itemVTBus = document.getElementById('item-vungtau-bus');
const itemAGBus = document.getElementById('item-angiang-bus');

window.addEventListener('load', () => {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/bus/api/recom-bus?date="+ today, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
        let results = JSON.parse(this.responseText);
        itemHCMBus.querySelector('.content .text').innerText = "Có " + results.hcm + " Chuyến xe";
        itemHPBus.querySelector('.content .text').innerText = "Có " + results.hp + " Chuyến xe";
        itemDNBus.querySelector('.content .text').innerText = "Có " + results.dn + " Chuyến xe";
        itemHTBus.querySelector('.content .text').innerText = "Có " + results.ht + " Chuyến xe";
        itemLDBus.querySelector('.content .text').innerText = "Có " + results.ld + " Chuyến xe";
        itemKHBus.querySelector('.content .text').innerText = "Có " + results.kh + " Chuyến xe";
        itemVTBus.querySelector('.content .text').innerText = "Có " + results.vt + " Chuyến xe";
        itemAGBus.querySelector('.content .text').innerText = "Có " + results.ag + " Chuyến xe";
        }
    }
    xhttp.send();
});
let busLocation = {
    value: "",
}
recomBusBtn.forEach(btn => { 
    btn.addEventListener('click', () => {
        const value = btn.parentElement.dataset.location;
        busLocation.value = value;
        sessionStorage.setItem('busLocation', JSON.stringify(busLocation));
        window.location.href = '../bus/search';
    });
});

//transfer
const itemTSNTransfer = document.getElementById('item-tsn-transfer');
const itemNoibaiTransfer = document.getElementById('item-noibai-transfer');
const itemDNTransfer = document.getElementById('item-danang-transfer');
const itemHCMTransfer = document.getElementById('item-hcm-transfer');
const itemDalatTransfer = document.getElementById('item-dalat-transfer');
const itemHNTransfer = document.getElementById('item-hanoi-transfer');
const itemHaiphongTransfer = document.getElementById('item-haiphong-transfer');
const itemCanthoTransfer = document.getElementById('item-cantho-transfer');

window.addEventListener('load', () => {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/transfer/api/recom-transfer", true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(this.responseText);
            let results = JSON.parse(this.responseText);
                itemHNTransfer.querySelector('.content .text').innerText = "Có " + results.hn + " xe dịch vụ";
                itemDalatTransfer.querySelector('.content .text').innerText = "Có " + results.dl + " xe dịch vụ";
                itemHCMTransfer.querySelector('.content .text').innerText = "Có " + results.hcm + " xe dịch vụ";
                itemDNTransfer.querySelector('.content .text').innerText = "Có " + results.dn + " xe dịch vụ";
                itemTSNTransfer.querySelector('.content .text').innerText = "Có " + results.tsn + " xe dịch vụ";
                itemNoibaiTransfer.querySelector('.content .text').innerText = "Có " + results.nb + " xe dịch vụ";
                itemHaiphongTransfer.querySelector('.content .text').innerText = "Có " + results.hp + " xe dịch vụ";
                itemCanthoTransfer.querySelector('.content .text').innerText = "Có " + results.ct + " xe dịch vụ";
        }
    }
    xhttp.send();
});
let transferLocation = {
    value: "",
}
recomTransferBtn.forEach(btn => { 
    btn.addEventListener('click', () => {
        const value = btn.parentElement.dataset.location;
        transferLocation.value = value;
        sessionStorage.setItem('transferLocation', JSON.stringify(transferLocation));
        window.location.href = '../transfer/search';
    });
});