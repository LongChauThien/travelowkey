const filterItems = document.querySelectorAll(".filter-item")
const resultContainer = document.getElementById("result-container")
const resultItemTemplate = document.getElementById("result-item-template")
const itemFilters = document.querySelectorAll(".item-filter")
const sort = document.querySelector("#sort")
const itemSort = sort.querySelectorAll(".item-filter")
let searchInfoTitle = document.getElementById("search-info-title")
const searchInfoDescription = document.getElementById("search-info-description")
const btnShowMore = document.getElementById("btn-showMore");
let sortType = "Giá thấp nhất";
let pageLimit = 10;
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
let lc = params.get('lc'); 
let sd = params.get('sd');
let st = params.get('st');
let ed = params.get('ed');
let et = params.get('et');
let hd = params.get('hd');

filterItems.forEach(item => {
    const typeOfFilter = item.querySelector(".type-of-item-filter")
    const dropdownItemFilter = item.querySelector(".dropdown-item-filter")
    typeOfFilter.addEventListener("click", () => {
        dropdownItemFilter.classList.toggle("hide")
    })
})

itemFilters.forEach(item => {
    const iconSelect = item.querySelector(".icon.select")
    const iconUnselect = item.querySelector(".icon.unselect")
    if (item.id != "max-price" && item.id != "min-price") {
        item.addEventListener("click", () => {
            item.classList.toggle("select")
            item.classList.toggle("unselect")
            iconSelect.classList.toggle("hide")
            iconUnselect.classList.toggle("hide")
        }
        )
    }
})

itemSort.forEach(item => {
    const iconSelect = item.querySelector(".icon.select")
    const iconUnselect = item.querySelector(".icon.unselect")
    item.addEventListener("click", () => {
        if (item.classList.contains("unselect")) {
            resultContainer.innerHTML = ""
            if (item.id == "max-price") {
                sortType = "Giá cao nhất"
            }
            else {
                sortType = "Giá thấp nhất"
            }
            getData()
            item.classList.remove("unselect")
            item.classList.add("select")
            iconSelect.classList.remove("hide")
            iconUnselect.classList.add("hide")
            itemSort.forEach(item2 => {
                const iconSelect = item2.querySelector(".icon.select")
                const iconUnselect = item2.querySelector(".icon.unselect")
                if (item2 != item && item2.classList.contains("select")) {
                    item2.classList.remove("select")
                    item2.classList.add("unselect")
                    iconSelect.classList.add("hide")
                    iconUnselect.classList.remove("hide")
                }
            })
        }
    }
    )
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

    let link = 'https://ik.imagekit.io/tvlk/image/imageResource/2021/11/18/1637208308735-14c75db4b125d8cc4a19d7b6f6906e96.jpeg?tr=q-75,w-140';
    // for (let item of imgs) {
    //     if (data.Name.indexOf(item.img_name) > -1) {
    //         link = item.img_src
    //         break
    //     }
    // }
    document.getElementById("result-container").innerHTML +=
        `<div id="${data.id}" class="result-item">
    <img src="${link}"
        alt="" class="result-item-img">
    <div class="col">
        <div class="text-info">
            <div class="title">
                ${data.name}
            </div>
            <div class="description">
                <div class="detail">
                    <div id="luggage" class="description-item hightlight">
                        ${data.luggage}
                    </div>
                    <div id="numofSeat" class="description-item hightlight">
                        ${data.num_of_seat}
                    </div>
                </div>
                <div class="detail">
                    <div id="type-of-car" class="description-item">
                        ${data.type}
                    </div>
                    <div id="num-of-provider" class="description-item hightlight">
                        Hiện có 1 nhà cung cấp
                    </div>
                </div>
            </div>
        </div>
        <div class="booking">
            <div id="price" class="price-item">
                <div class="price-text" id="${data.price}">${changeMoneyFormat(data.price)} VND</div>
                <div class="text"> /ngày</div>
            </div>
            <a id="change-search-info" class="btn-default select-btn">
                <div class="text">Tiếp tục</div>
            </a>
        </div>
    </div>
</div>`

}

let transferSearchInfo;
    searchInfoDescription.innerText = lc + ' • ' + changeDateFormat(sd) + ' ' + st + ' • ' + changeDateFormat(ed) + ' ' + et
    if (hd=='true') {
        searchInfoTitle.innerHTML = `Có tài xế`
    }
    else {
        searchInfoTitle.innerHTML = `Tự lái`
    }



function getData() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/transfer/api/taxis?"+window.location.search.substring(1) +"&sortType=" +sortType + "&limit=" + pageLimit, true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                let searchResults = JSON.parse(this.responseText);
                taxis = searchResults.taxis;
                console.log(taxis)
                document.getElementById("result-container").innerHTML = " ";
                taxis.forEach(item => {
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
    
    xhttp.send();
}

window.onload =  getData()

btnShowMore.addEventListener("click", (e) => {
    pageLimit += 10;
    getData();
})

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

let transferPaymentInfo = {}
  document.addEventListener('click',async function (e) {
    if (e.target.classList.contains('select-btn')) {
      console.log("select-btn");
      const checkLoginStatus = await checkLogin();
      alert(checkLoginStatus);
      if (!checkLoginStatus) {
          window.location.href = "/user/login";
          return;
      }
      transferPaymentInfo.transferID = e.target.closest(".result-item").id;
      window.location.href = "/payment/transfer?transferID=" + transferPaymentInfo.transferID + '&lc=' + lc + '&sd=' + sd + '&st=' + st + '&ed=' + ed + '&et=' + et + '&hd=' + hd
    }
  });