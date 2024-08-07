let HotelSearchInfo = {
    location: '',
    checkinDate: '',
    checkoutDate: '',
    adult: 1,
    child: 0,
    room: 1,
}

const featureHotelSearch = document.getElementById('feature__hotel-search');
const hotelConfig = featureHotelSearch.querySelector('.hotel-search__config');
const guestAndRoomQuantity = hotelConfig.querySelector('.booking-info__guest-and-room-quantity');
const guestAndRoomQuantityInfo = guestAndRoomQuantity.querySelector('.guest-and-room-quantity__info');
const guestAndRoomQuantityDropdownPanel = guestAndRoomQuantity.querySelector('.passenger-quantity__dropdown-panel');
const guestAndRoomQuantityItems = guestAndRoomQuantityDropdownPanel.querySelectorAll('.dropdown-panel__item');
const guestAndRoomQuantityConfirmBtn = guestAndRoomQuantityDropdownPanel.querySelector('.dropdown-panel__confirm-btn');

const hotelSearchForm = featureHotelSearch.querySelector('#hotel-search__search-form');
const hotelLocationInput = hotelSearchForm.querySelector('#hotel-search__location');
const checkinDateInput = hotelSearchForm.querySelector('#hotel-search__checkin-date');
const checkoutDateInput = hotelSearchForm.querySelector('#hotel-search__checkout-date');
const hotelSubmitBtn = hotelSearchForm.querySelector('#search-form__submit-btn--hotel');

guestAndRoomQuantity.addEventListener('click', () => {
    guestAndRoomQuantityDropdownPanel.classList.toggle('hide');
});


guestAndRoomQuantityDropdownPanel.addEventListener('click', (e) => {
    e.stopPropagation();
});

document.addEventListener('click', (e) => {
    if (guestAndRoomQuantityDropdownPanel.classList.contains('hide')) return;
    if (guestAndRoomQuantity.contains(e.target)) return;
    guestAndRoomQuantityDropdownPanel.classList.add('hide');
});

guestAndRoomQuantityItems.forEach(item => {
    const passengerType = item.dataset.passengerType;
    const setQuantity = item.querySelector('.item__set-quantity');
    const quantity = setQuantity.querySelector('.set-quantity__quantity');
    const increaseBtn = setQuantity.querySelector('.set-quantity__icon.increase');
    const decreaseBtn = setQuantity.querySelector('.set-quantity__icon.decrease');

    quantity.innerText = HotelSearchInfo[passengerType];

    increaseBtn.addEventListener('click', () => {
        if (HotelSearchInfo[passengerType] < 9) {
            HotelSearchInfo[passengerType]++;
            quantity.innerText = HotelSearchInfo[passengerType];
        }
    });

    decreaseBtn.addEventListener('click', () => {
        if ((passengerType != 'adult' && HotelSearchInfo[passengerType] > 0) || (passengerType == 'adult' && HotelSearchInfo[passengerType] > 1)) {
            HotelSearchInfo[passengerType]--;
            quantity.innerText = HotelSearchInfo[passengerType];
        }
    });
});

guestAndRoomQuantityConfirmBtn.addEventListener('click', () => {
    guestAndRoomQuantityDropdownPanel.classList.add('hide');
    guestAndRoomQuantityInfo.querySelector(".text").innerText = `${HotelSearchInfo.adult} người lớn, ${HotelSearchInfo.child} trẻ em, ${HotelSearchInfo.room} phòng`;
});


function getToday() {
    const hotelInput_today = new Date()
    const date =hotelInput_today.getDate()
    const month =hotelInput_today.getMonth() + 1
    const year =hotelInput_today.getFullYear()
    return `${year}-${month < 10 ? "0" + month : month}-${date < 10 ? "0" + date : date}`
}

const hotelInput_today = getToday()
checkinDateInput.value =hotelInput_today
checkoutDateInput.value =hotelInput_today
checkinDateInput.min =hotelInput_today
checkoutDateInput.min =hotelInput_today

window.addEventListener('load', function (e) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/hotel/api/locations", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let locations = JSON.parse(this.responseText);
            let areas = locations.area
            if (areas.length > 0) {
                areas.forEach(item => {
                    document.getElementById("hotel-location").innerHTML += `<option>${item}</option>`
                })
            }
        }
        else if (xhr.readyState === 4) {
            console.log('Error:', xhr.responseText);
        }
    }
    xhr.send()
})

hotelSubmitBtn.addEventListener('click', () => {
    HotelSearchInfo.location = hotelLocationInput.value;
    startDate = new Date(checkinDateInput.value)
    if (isNaN(startDate)) {
        alert('Invalid checkin date');
        return;
    }
    HotelSearchInfo.checkinDate = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
    endDate = new Date(checkoutDateInput.value)
    if (isNaN(endDate)) {
        alert('Invalid checkout date');
        return;
    }
    HotelSearchInfo.checkoutDate = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`;
    if (!HotelSearchInfo.location) {
        alert('Location is required');
        return;
    }
    // console.log(HotelSearchInfo.checkinDate + ' ' + HotelSearchInfo.checkoutDate);
    if (startDate > endDate) {
        alert('Checkin date must be before checkout date');
        return;
    }
    window.location.href = '/hotel/results?lc=' + HotelSearchInfo.location + '&ci=' + HotelSearchInfo.checkinDate + '&co=' + HotelSearchInfo.checkoutDate + '&adult=' + HotelSearchInfo.adult + '&child=' + HotelSearchInfo.child + '&room=' + HotelSearchInfo.room;
    // sessionStorage.setItem('HotelSearchInfo', JSON.stringify(HotelSearchInfo))

});

const recomItemHotel = document.querySelectorAll('.recom-item');
const recomHotel = document.getElementById('recom-hotel');
const recomHotelBtn = recomHotel.querySelectorAll('.recom-btn');

recomItemHotel.forEach(item => {
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