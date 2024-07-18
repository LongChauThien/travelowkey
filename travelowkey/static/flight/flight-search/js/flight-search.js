let flightSearchInfo = {
    flightType: "one",
    passengerQuantity: {
        adult: 1,
        child: 0,
        baby: 0
    },
    seatType: "economy",
    oneFlightInfo: {
        departure: "",
        destination: "",
        departureDate: "",
        haveReturn: false,
        returnDate: "",
    },
}
const featureFlightSearch = document.querySelector("#feature__flight-search")
const flightSearchConfig = featureFlightSearch.querySelector(".flight-search__config")

const ticketInfoConfig = flightSearchConfig.querySelector(".config__ticket-info")

const passengerQuantityBtn = ticketInfoConfig.querySelector(".ticket-info__passenger-quantity")
const passengerQuantityInfo = passengerQuantityBtn.querySelector(".info")
const passengerQuantityDropdownPanel = passengerQuantityBtn.querySelector(".dropdown-panel")
const passengerQuantityConfirmBtn = passengerQuantityDropdownPanel.querySelector(".dropdown-panel__confirm-btn")
const passengerQuantityItems = passengerQuantityDropdownPanel.querySelectorAll(".dropdown-panel__item")

const seatTypeBtn = ticketInfoConfig.querySelector(".ticket-info__seat-type")
const seatTypeInfo = seatTypeBtn.querySelector(".info")
const seatTypeDropdownPanel = seatTypeBtn.querySelector(".dropdown-panel")
const seatTypeItems = seatTypeDropdownPanel.querySelectorAll(".dropdown-panel__item")

const oneFlightSearchForm = featureFlightSearch.querySelector("#flight-search__search-form--one")
const oneFlightSubmitBtn = oneFlightSearchForm.querySelector("#search-form__submit-btn--one-flight")

passengerQuantityBtn.addEventListener("click", () => {
    passengerQuantityDropdownPanel.classList.toggle("hide")
})

passengerQuantityDropdownPanel.addEventListener("click", (e) => {
    e.stopPropagation()
});

document.addEventListener("click", (e) => {
    if (passengerQuantityDropdownPanel.classList.contains("hide")) return;
    if (passengerQuantityBtn.contains(e.target)) return;
    passengerQuantityDropdownPanel.classList.add("hide")
})

passengerQuantityItems.forEach(item => {
    const passengerType = item.dataset.passengerType
    const setQuantity = item.querySelector(".item__set-quantity")
    const quantity = setQuantity.querySelector(".set-quantity__quantity")
    const increaseBtn = setQuantity.querySelector(".set-quantity__icon.increase")
    const decreaseBtn = setQuantity.querySelector(".set-quantity__icon.decrease")

    quantity.innerText = flightSearchInfo.passengerQuantity[passengerType]

    increaseBtn.addEventListener("click", () => {
        if (flightSearchInfo.passengerQuantity[passengerType] < 9) {
            flightSearchInfo.passengerQuantity[passengerType]++
            quantity.innerText = flightSearchInfo.passengerQuantity[passengerType]
        }
    })
    decreaseBtn.addEventListener("click", () => {
        if ((passengerType != "adult" && flightSearchInfo.passengerQuantity[passengerType] > 0) || (passengerType == "adult" && flightSearchInfo.passengerQuantity[passengerType] > 1)) {
            flightSearchInfo.passengerQuantity[passengerType]--
            quantity.innerText = flightSearchInfo.passengerQuantity[passengerType]
        }
    })
})

passengerQuantityConfirmBtn.addEventListener("click", () => {
    passengerQuantityInfo.querySelector(".text").innerText =
        `${flightSearchInfo.passengerQuantity.adult} Người lớn, ${flightSearchInfo.passengerQuantity.child} trẻ em, ${flightSearchInfo.passengerQuantity.baby} em bé`;
    passengerQuantityDropdownPanel.classList.add("hide")
})

seatTypeBtn.addEventListener("click", () => {
    seatTypeDropdownPanel.classList.toggle("hide")
})

document.addEventListener("click", (e) => {
    if (seatTypeDropdownPanel.classList.contains("hide")) return
    if (seatTypeBtn.contains(e.target)) return
    seatTypeDropdownPanel.classList.add("hide")
})

seatTypeItems.forEach(item => {
    item.addEventListener("click", () => {
        seatTypeItems.forEach(item => item.classList.remove("selected"))
        item.classList.add("selected")
        flightSearchInfo.seatType = item.dataset.ticketType
        seatTypeInfo.querySelector(".text").innerText = item.querySelector(".text").innerText
        seatTypeDropdownPanel.classList.add("hide")
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
const departureDateInput = featureFlightSearch.querySelector(".departure-date__input")
departureDateInput.setAttribute("min", today)
departureDateInput.value = today

window.onload = function (e) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/flight/api/locations", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                const locations = JSON.parse(this.responseText)
                console.log(locations)
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
}

oneFlightSubmitBtn.addEventListener("click", () => {
    const departure = oneFlightSearchForm.querySelector("#flight-search__departure").value
    const destination = oneFlightSearchForm.querySelector("#flight-search__destination").value
    const departureDate = oneFlightSearchForm.querySelector("#flight-search__departure-date").value

    flightSearchInfo.oneFlightInfo.departure = departure
    flightSearchInfo.oneFlightInfo.destination = destination
    flightSearchInfo.oneFlightInfo.departureDate = departureDate

    if (!flightSearchInfo.oneFlightInfo.departure) {
        alert('Location is required');
        return
    }
    if (!flightSearchInfo.oneFlightInfo.destination) {
        alert('Location is required');
        return
    }
    if (flightSearchInfo.oneFlightInfo.departure === flightSearchInfo.oneFlightInfo.destination) {
        alert('Departure and destination must be different');
        return
    }

    console.log(flightSearchInfo);
    // sessionStorage.setItem('flightSearchInfo', JSON.stringify(flightSearchInfo));

    window.location.href = "/flight/results?lc=" + flightSearchInfo.oneFlightInfo.departure + "." + flightSearchInfo.oneFlightInfo.destination + "&dt=" + flightSearchInfo.oneFlightInfo.departureDate + "&st=" + flightSearchInfo.seatType + "&ps=" + flightSearchInfo.passengerQuantity.adult + "." + flightSearchInfo.passengerQuantity.child + "." + flightSearchInfo.passengerQuantity.baby
})