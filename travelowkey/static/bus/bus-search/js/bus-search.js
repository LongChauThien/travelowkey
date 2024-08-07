let BusSearchInfo = {
    departure: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    haveReturn: false,
    passengerQuantity: 1,
  }
  
const featurebusSearch = document.getElementById('feature__bus-search');
const busSearchConfig = featurebusSearch.querySelector('.bus-search__config');
const passengerQuantity = busSearchConfig.querySelector('.ticket-info__passenger-quantity');
const busPassengerQuantityInfo = passengerQuantity.querySelector('.info');
const busPassengerQuantityDropdownPanel = passengerQuantity.querySelector('.dropdown-panel');
const dropdownPanelItems = busPassengerQuantityDropdownPanel.querySelectorAll('.dropdown-panel__item');

const busSearchForm = featurebusSearch.querySelector('#bus-search__search-form');
const departureInput = busSearchForm.querySelector('#bus-search__departure');
const destinationInput = busSearchForm.querySelector('#bus-search__destination');
const busDepartureDateInput = busSearchForm.querySelector('#bus-search__departure-date');
const returnDateInput = busSearchForm.querySelector('#bus-search__return-date');
const searchBtn = busSearchForm.querySelector('#search-form__submit-btn');

passengerQuantity.addEventListener('click', () => {
    busPassengerQuantityDropdownPanel.classList.toggle('hide');
})

busPassengerQuantityDropdownPanel.addEventListener('click', (e) => {
    e.stopPropagation();
})

document.addEventListener('click', (e) => {
    if (busPassengerQuantityDropdownPanel.classList.contains('hide')) return
    if (passengerQuantity.contains(e.target)) return
    busPassengerQuantityDropdownPanel.classList.add('hide');
})

dropdownPanelItems.forEach(item => {
    item.addEventListener('click', () => {
        dropdownPanelItems.forEach(item => {
            item.classList.remove('selected');
        })
        item.classList.add('selected');
        busPassengerQuantityInfo.querySelector('.text').innerHTML = item.querySelector('.text').innerHTML + 'hành khách';
        BusSearchInfo.passengerQuantity = item.dataset.ticketType;
    })
})

function getToday() {
    const busToday = new Date()
    const date = busToday.getDate()
    const month = busToday.getMonth() + 1
    const year = busToday.getFullYear()
    return `${year}-${month < 10 ? "0" + month : month}-${date < 10 ? "0" + date : date}`
}

const busToday = getToday()
input_date = document.querySelector("#bus-search__departure-date");
input_date.value = busToday
input_date.setAttribute("min", busToday);


window.addEventListener('load', function (e) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/bus/api/locations", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                const locations = JSON.parse(this.responseText)
                from_locations = locations.from
                to_locations = locations.to
                from_locations.forEach(item => {
                    document.getElementById("bus-departureLocation").innerHTML += `<option>${item}</option>`
                })
                to_locations.forEach(item => {
                    document.getElementById("bus-arrivalLocation").innerHTML += `<option>${item}</option>`
                })
            }
            catch (e) {
                console.log(e)
            }
        }
        else if (xhr.readyState === 4) {
            console.log('Error:', xhr.responseText);
        }
    }
    xhr.send()
})

searchBtn.addEventListener("click", () => {
    BusSearchInfo.departure = departureInput.value;
    BusSearchInfo.destination = destinationInput.value;
    BusSearchInfo.departureDate = busDepartureDateInput.value
     
    if (!BusSearchInfo.departure) {
    alert('Location is required');
    return;
    }
    if (!BusSearchInfo.destination) {
    alert('Location is required');
    return;
    }
    if (BusSearchInfo.departure == BusSearchInfo.destination) {
    alert('Departure location and arrival location must not be the same');
    return;
    }
    if (!BusSearchInfo.departureDate) {
    alert('Departure date is required');
    return;
    }

    window.location.href = "/bus/results?lc=" + BusSearchInfo.departure + "." + BusSearchInfo.destination + "&dt=" + BusSearchInfo.departureDate + "&ps=" + BusSearchInfo.passengerQuantity/*+"&sortType=Giá thấp nhất&limit=10";*/
})


const recomItemBus = document.querySelectorAll('.recom-item');
const recomBus = document.getElementById('recom-bus');
const recomBusBtn = recomBus.querySelectorAll('.recom-btn');

recomItemBus.forEach(item => {
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
    const today= new Date()
    const todayDate = today.getDate()
    const todayMonth = today.getMonth() + 1
    const todayYear = today.getFullYear()
    return `${todayYear}-${todayMonth < 10 ? "0" + todayMonth : todayMonth}-${todayDate < 10 ? "0" + todayDate : todayDate}`
}

const todayBusSearch= GetTodayDate()

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
