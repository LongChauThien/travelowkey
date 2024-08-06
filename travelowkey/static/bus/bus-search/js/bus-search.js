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
                    document.getElementById("departureLocation").innerHTML += `<option>${item}</option>`
                })
                to_locations.forEach(item => {
                    document.getElementById("arrivalLocation").innerHTML += `<option>${item}</option>`
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