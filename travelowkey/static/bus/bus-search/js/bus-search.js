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
const searchBtn = busSearchForm.querySelector('#search-form__submit-btn--bus');

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
        busPassengerQuantityInfo.querySelector('.text').innerHTML = item.querySelector('.text').innerHTML + 'hanh khach';
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