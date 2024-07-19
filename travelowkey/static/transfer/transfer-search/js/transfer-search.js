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
    const transferInput_today = new Date()
    const transferInput_todayDate = transferInput_today.getDate()
    const transferInput_todayMonth = transferInput_today.getMonth() + 1
    const transferInput_todayYear = transferInput_today.getFullYear()
    return `${transferInput_todayYear}-${transferInput_todayMonth < 10 ? "0" +transferInput_todayMonth :transferInput_todayMonth}-${transferInput_todayDate < 10 ? "0" +transferInput_todayDate :transferInput_todayDate}`
}
const transferInput_todayDate = GetToday()
let date = new Date();
let transferInput_today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
input_dates = document.querySelectorAll(".date__input");
input_dates.forEach(item=>{item.setAttribute("min",transferInput_todayDate); item.value =transferInput_todayDate})

haveDriverCheckbox.addEventListener('click', () => {
    haveDriverCheckbox.classList.toggle('checked')
    haveDriverCheckbox.classList.toggle('unchecked')
    transferSearchInfo.haveDriver = !transferSearchInfo.haveDriver
})


window.onload = function (e) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/transfer/api/locations", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.responseText);
        if (response.locations.length > 0) {
            response.locations.forEach(item=>{
                document.getElementById("location").innerHTML += `<option>${item}</option>`
            })
            }
        }
        }
    
    xhttp.send()
}

submitBtn.addEventListener('click', () => {
    transferSearchInfo.location = locationInput.value
    transferSearchInfo.startDate = startDateInput.value
    transferSearchInfo.startTime = startHourInput.value+":"+startMinuteInput.value
    transferSearchInfo.endDate  = endDateInput.value
    transferSearchInfo.endTime = endHourInput.value +":"+endMinuteInput.value
    if (!transferSearchInfo.location) {
        alert('Location is required');
        return;
      }

    if (!transferSearchInfo.startTime) {
        alert('Start time is required');
        return;
    }


    if (!transferSearchInfo.endTime) {
        alert('End time is required');
        return;
    }
    if (transferSearchInfo.startDate > transferSearchInfo.endDate) {
        alert('Start date must be before end date');
        return;
    }
    if ((transferSearchInfo.startDate == transferSearchInfo.endDate) && (transferSearchInfo.startTime >= transferSearchInfo.endTime)) {
        alert('Start time must be before end time');
        return;
    }
    window.location.href = '/transfer/results?lc=' + transferSearchInfo.location + '&sd=' + transferSearchInfo.startDate + '&st=' + transferSearchInfo.startTime + '&ed=' + transferSearchInfo.endDate + '&et=' + transferSearchInfo.endTime + '&hd=' + transferSearchInfo.haveDriver
    // sessionStorage.setItem('transferSearchInfo', JSON.stringify(transferSearchInfo))
})