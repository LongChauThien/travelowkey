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
    guestAndRoomQuantityInfo.querySelector(".text").innerText = `${HotelSearchInfo.adult} nguoi lon, ${HotelSearchInfo.child} tre em, ${HotelSearchInfo.room} phong`;
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