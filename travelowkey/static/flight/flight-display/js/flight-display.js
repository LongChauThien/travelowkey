let sortType = "Giá thấp nhất";
let pageLimit = 10;
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
let lc = params.get('lc'); 
let dt = params.get('dt'); 
let st = params.get('st'); 
let ps = params.get('ps'); 
let flightPaymentInfo = {
  flightID: "",
  ticketNumber: 0,
};

const sortContainer = document.getElementById("sort-container");
const sortValueSelect = document.getElementById("sort-value-select");
const sortTypeDropdown = document.getElementById("sort-type-dropdown");
const sortTypeItem = sortTypeDropdown.querySelectorAll(".sort-type-item");
const btnShowMore = document.getElementById("btn-showMore");
const searchInfoBlock = document.querySelector(".search-info-block");
const searchDepature = searchInfoBlock.querySelector(".departure .text");
const searchDestination = searchInfoBlock.querySelector(".destination .text");
const searchDepartureDate = searchInfoBlock.querySelector(".date .text");
const searchSeatType = searchInfoBlock.querySelector(".seat-type .text");
const searchPassenger = searchInfoBlock.querySelector(".passenger-quantity .text");
const sortTypeValue = document.getElementById("sort-type-value");


window.onload = function (e) {
  loadResult();
}
 
// sortType = sortTypeDropdown
//   .querySelector(".sort-type-item.select")
//   .querySelector(".text").innerText;

sortValueSelect.addEventListener("click", (e) => {
    if (e.target.closest("#sort-type-dropdown")) return;
    sortContainer.classList.toggle("show-dropdown");
});

sortTypeItem.forEach((item) => {
    item.addEventListener("click", (e) => {
        sortTypeDropdown.querySelector(".sort-type-item.select").classList.remove("select");
        item.classList.add("select");
        sortTypeValue.innerText = item.querySelector(".text").innerText;
        sortType = sortTypeValue.innerText;
        loadResult();
    });
});

btnShowMore.addEventListener("click", (e) => {
    pageLimit += 10;
    loadResult();
})




function loadResult() {
    searchDestination.innerHTML = lc.substring(0, lc.indexOf('.'));
    searchDepature.innerHTML = lc.substring(lc.indexOf('.') + 1);
    searchDepartureDate.innerHTML = changeDateFormat(dt);
    if (st == 'economy') {
      searchSeatType.innerHTML = 'Phổ thông';
    }
    else if (st == 'business') {
      searchSeatType.innerHTML = 'Thương gia';
    }
    flightPaymentInfo.ticketNumber = (ps.split('.').map(Number).reduce((acc, num) => acc + num, 0))
    searchPassenger.innerHTML = flightPaymentInfo.ticketNumber + " hành khách";
  
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/flight/api/flights?"+window.location.search.substring(1) +"&sortType=" +sortType + "&limit=" + pageLimit, true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        try {
            let searchResults = JSON.parse(this.responseText);
            flights = searchResults.flights;
            if (flights.length == 0) {
              document.getElementById("result-container").innerHTML =
                `<div class="title">Không tìm thấy kết quả phù hợp</div>`
              btnShowMore.classList.add("hide");
              return;
            }
            else {
              document.getElementById("result-container").innerHTML = " ";
              for (let i = 0; i < flights.length; i++) {
                document.getElementById("result-container").innerHTML += `
                <div id="result-item-${flights[i].id}" class="result-item">
                  <div class="row">
                    <div class="plane-name">
                        <ion-icon name="airplane"></ion-icon> 
                        <div class="text">${flights[i].name}</div>
                    </div>
                    <div class="time-and-location">
                        <div class="departure">
                            <div class="time">${flights[i].departure_time}</div>
                            <div class="location">${flights[i].from_location}</div>
                        </div>
                        <ion-icon name="ellipsis-horizontal"></ion-icon>
                        <div class="destination">
                            <div class="time">${flights[i].arrival_time}</div>
                            <div class="location">${flights[i].to_location}</div>
                        </div>
                    </div>
                    <div class="price">
                        <div class="price-text">${changeMoneyFormat(flights[i].price)} VND</div>
                        <div class="text">/khách</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="btn-default select-btn">
                        <div class="text">Chọn</div>
                    </div>
                  </div>
                </div>`
            }
            btnShowMore.classList.remove("hide");
          }}
        catch (err) {
          document.getElementById("result-container").innerHTML =
            `<div class="title">Không tìm thấy kết quả phù hợp</div>`
          btnShowMore.classList.add("hide");
        }
      }
    };
    xhttp.send();
  }

  function changeDateFormat(date) {
    let dateArray = date.split('-');
    let day = dateArray[2];
    let month = dateArray[1];
    let year = dateArray[0];
    let monthArray = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4',
      'tháng 5', 'tháng 6', 'tháng 7', 'tháng 8',
      'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];
    return `${day}, ${monthArray[month - 1]}, ${year}`;
  }

  function changeMoneyFormat(money) {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

async function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}
async function refreshToken() {
    const refresh_token = await getCookie('refresh_token');
    if (!refresh_token) {
        return null;
    }

    const response = await fetch('/user/api/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({ refresh: refresh_token }),
    });

    if (response.ok) {
        const data = await response.json();
        document.cookie = `access_token=${data.access}; path=/`;
        return data.access;
    } else {
        return null;
    }
}

async function checkLogin() {
    let access_token = await getCookie('access_token');
    if (!access_token) {
        return false;
    }
    const response = await fetch('/user/api/check_login/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
        },
    });
    if (response.ok) {
        return true;
    }
    else if (response.status == 401) {
        const new_access_token = await refreshToken();
        if (new_access_token) {
            checkLogin();
        } else {
            return false;
        }
    }
    else {
        return false;
    }
}

document.addEventListener('click',async function (e) {
  if (e.target.classList.contains('select-btn')) {
    console.log("select-btn");
    const checkLoginStatus = await checkLogin();
    alert(checkLoginStatus);
    if (!checkLoginStatus) {
        window.location.href = "/user/login";
        return;
    }
    let id = e.target.closest(".result-item").id;
    flightPaymentInfo.flightID = id.substring(12);
    window.location.href = "/payment/flight?flightID=" + flightPaymentInfo.flightID + "&ticketNumber=" + flightPaymentInfo.ticketNumber;
  }
});