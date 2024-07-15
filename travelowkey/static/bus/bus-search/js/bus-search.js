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
const passengerQuantityInfo = passengerQuantity.querySelector('.info');
const passengerQuantityDropdownPanel = passengerQuantity.querySelector('.dropdown-panel');
const dropdownPanelItems = passengerQuantityDropdownPanel.querySelectorAll('.dropdown-panel__item');

const busSearchForm = featurebusSearch.querySelector('#bus-search__search-form');
const departureInput = busSearchForm.querySelector('#bus-search__departure');
const destinationInput = busSearchForm.querySelector('#bus-search__destination');
const departureDateInput = busSearchForm.querySelector('#bus-search__departure-date');
const returnDateInput = busSearchForm.querySelector('#bus-search__return-date');
const searchBtn = busSearchForm.querySelector('#search-form__submit-btn--bus');

passengerQuantity.addEventListener('click', () => {
    passengerQuantityDropdownPanel.classList.toggle('hide');
})

passengerQuantityDropdownPanel.addEventListener('click', (e) => {
    e.stopPropagation();
})

document.addEventListener('click', (e) => {
    if (passengerQuantityDropdownPanel.classList.contains('hide')) return
    if (passengerQuantity.contains(e.target)) return
    passengerQuantityDropdownPanel.classList.add('hide');
})

dropdownPanelItems.forEach(item => {
    item.addEventListener('click', () => {
        dropdownPanelItems.forEach(item => {
            item.classList.remove('selected');
        })
        item.classList.add('selected');
        passengerQuantityInfo.querySelector('.text').innerHTML = item.querySelector('.text').innerHTML + 'hanh khach';
        BusSearchInfo.passengerQuantity = item.dataset.ticketType;
    })
})

function getToday() {
    const today = new Date()
    const date = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    return `${year}-${month < 10 ? "0" + month : month}-${date < 10 ? "0" + date : date}`
}

const today = getToday()
input_date = document.querySelector("#bus-search__departure-date");
input_date.value = today
input_date.setAttribute("min", today);