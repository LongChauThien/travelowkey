let transferSearchInfo = {
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    haveDriver: false
}

const featureTransferSearch = document.getElementById('feature__transfer-search')
const transferSearchConfig = featureTransferSearch.querySelector('.transfer-search__config')
const haveDriverCheckbox = transferSearchConfig.querySelector('#config__have-driver-checkbox')

const transferSearchForm = featureTransferSearch.querySelector('#transfer-search__search-form')
const locationInput = transferSearchForm.querySelector('#transfer-search__location')
const startDateInput = transferSearchForm.querySelector('#transfer-search__start-date')
const startHourInput = transferSearchForm.querySelector('#select-hour-start')
const startMinuteInput = transferSearchForm.querySelector('#select-minute-start')
const endDateInput = transferSearchForm.querySelector('#transfer-search__end-date')
const endHourInput = transferSearchForm.querySelector('#select-hour-end')
const endMinuteInput = transferSearchForm.querySelector('#select-minute-end')
const submitBtn = transferSearchForm.querySelector('#search-form__submit-btn--transfer')

function GetToday() {
    const today = new Date()
    const todayDate = today.getDate()
    const todayMonth = today.getMonth() + 1
    const todayYear = today.getFullYear()
    return `${todayYear}-${todayMonth < 10 ? "0" + todayMonth : todayMonth}-${todayDate < 10 ? "0" + todayDate : todayDate}`
}
const todayDate = GetToday()
let date = new Date();
let today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
input_dates = document.querySelectorAll(".date__input");
input_dates.forEach(item=>{item.setAttribute("min", todayDate); item.value = todayDate})

haveDriverCheckbox.addEventListener('click', () => {
    haveDriverCheckbox.classList.toggle('checked')
    haveDriverCheckbox.classList.toggle('unchecked')
    transferSearchInfo.haveDriver = !transferSearchInfo.haveDriver
})