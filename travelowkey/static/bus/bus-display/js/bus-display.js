let sortType = "Giá thấp nhất";
let pageLimit = 10;
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
let lc = params.get('lc'); 
let dt = params.get('dt'); 
let ps = params.get('ps'); 

const sortContainer = document.getElementById("sort-container");
const sortValueSelect = document.getElementById("sort-value-select");
const sortTypeDropdown = document.getElementById("sort-type-dropdown");
const sortTypeItem = sortTypeDropdown.querySelectorAll(".sort-type-item");
const searchBarDeparture = document.getElementById("search-bar-departure");
const searchBarArrival = document.getElementById("search-bar-arrival");
const searchBarDate = document.getElementById("search-bar-date");
const searchBarPassenger = document.getElementById("search-bar-passenger");
const btnShowMore = document.getElementById("btn-showMore");
const sortTypeValue = document.getElementById("sort-type-value");

// sortType = sortTypeDropdown
//   .querySelector(".sort-type-item.select")
//   .querySelector(".text").innerText;

window.onload = function (e) {
  getData();
}

sortValueSelect.addEventListener("click", (e) => {
  if (e.target.closest("#sort-type-dropdown")) return;
  sortContainer.classList.toggle("show-dropdown");
});

sortTypeItem.forEach((item) => {
  item.addEventListener("click", (e) => {
    sortTypeDropdown
      .querySelector(".sort-type-item.select")
      .classList.remove("select");
    item.classList.add("select");
    sortTypeValue.innerText = item.querySelector(".text").innerText;
    sortType = sortTypeValue.innerText;
    getData();
  });
});

btnShowMore.addEventListener("click", (e) => {
    pageLimit += 10;
    getData();
})

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

function createResultItem(data) {
  document.getElementById("list-item").innerHTML +=
    `<div class="bus-book__BusItem" id=${data.id}>
    <div class="bus-book__BusBrand">
      <div class="text">${data.name}</div>
    </div>
    <div class="bus-book__Place_Time_Price">
      <div class="bus-book__Depature_Info">
        <div class="bus-book__Start_Time">${data.departure_time}</div>
        <div class="bus-book__Start_Place">${data.pick_point}</div>
      </div>
      <div class="icon">
        <img class="vector6" alt="" src="/static/images/coach-vector6.svg" />
      </div>
      <div class="bus-book__Arrival_Info">
        <div class="bus-book__Arrival_Time">${data.arrival_time}</div>
        <div class="bus-book__Arrival_Place">${data.des_point}</div>
      </div>
      <div class="bus-book__Duration">
        <div class="time">${data.travel_time}</div>
      </div>
      <div class="bus-book__Price">
        <div class="price">${changeMoneyFormat(data.price)}</div>
        <div class="units">/khách</div>
      </div>
    </div>
    <div class="bus-book__Detail_Payment">
      <div class="navigation-item">
        <b class="text">Chi tiết</b>
      </div>
      <div class="btn-default bus-book__Payment">
        <div class="payment" >Chọn</div>
      </div>
    </div>
  </div>`
}

function getData() {
  searchBarDeparture.innerText = lc.substring(0, lc.indexOf('.'));
  searchBarArrival.innerText = lc.substring(lc.indexOf('.') + 1);
  searchBarDate.innerText = changeDateFormat(dt);
  searchBarPassenger.innerText = ps + ' vé';
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      try {
        let searchResults = JSON.parse(this.responseText);
        tickets = searchResults.tickets;
        if (tickets.length == 0) {
          document.getElementById("result-container").innerHTML =
            `<div class="title">Không tìm thấy kết quả phù hợp</div>`
          btnShowMore.style.display = 'none';
        }
        document.getElementById("list-item").innerHTML = " ";
        tickets.forEach(item => {
          createResultItem(item)
        })
      }
      catch (e) {
        console.log("Không tìm thấy kết quả phù hợp")
        document.getElementById("result-container").innerHTML =
          `<div class="title">Không tìm thấy kết quả phù hợp</div>`
        btnShowMore.style.display = 'none';
      }
    }
  }
  xhttp.open("GET", "/bus/api/tickets?"+window.location.search.substring(1) +"&sortType=" +sortType + "&limit=" + pageLimit, true);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.send()
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

let busPaymentInfo = {};
document.addEventListener('click',async function (e) {
  if (e.target.classList.contains('payment')) {
    // console.log("select-btn");
    const checkLoginStatus = await checkLogin();
    alert(checkLoginStatus);
    if (!checkLoginStatus) {
        window.location.href = "/user/login";
        return;
    }
    busPaymentInfo.ID = e.target.closest(".bus-book__BusItem").id;
    busPaymentInfo.ticketNumber = ps;
    window.location.href = "/payment/bus?busID=" + busPaymentInfo.ID + "&ticketNumber=" + busPaymentInfo.ticketNumber;
  }
});