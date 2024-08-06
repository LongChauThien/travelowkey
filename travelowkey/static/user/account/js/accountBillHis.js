const billContainer = document.getElementById("bill-container");
const flightBillContainer = document.getElementById("flight-bill");
const busBillContainer = document.getElementById("bus-bill");
const transferBillContainer = document.getElementById("transfer-bill");
const hotelBillContainer = document.getElementById("hotel-bill");

window.addEventListener("load", LoadBill);


async function LoadBill() {
  let access_token = await getCookie("access_token");
  if (!access_token) {
    alert("Đăng nhập trước khi xem hoá đơn!");
    window.location.href = "/user/login";
    return;
  }
  let xhttp = new XMLHttpRequest();
  xhttp.open("GET","/payment/api/load_bill/",true);
  xhttp.setRequestHeader("Authorization", `Bearer ${access_token}`);
  xhttp.onreadystatechange = async function () {
    if (this.readyState == 4 && this.status == 200) {
      try {
        let results = JSON.parse(this.responseText).bills;
        if (results.length == 0) {
          billContainer.innerHTML = `<div class="no-result-text">Không có hoá đơn</div>`;
        }
        for (let i = 0; i < results.length; i++) {
            CreateBillHTML(results[i]);
        }
      } catch (err) {
        console.log(err);
      }
    }
    else if (this.readyState == 4 && this.status == 401) {
      const new_access_token = await refreshToken();
      if (new_access_token) {
          LoadBill();
      } else {
        alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại!");
        window.location.href = "/user/login";
        return
      }
    }
  };
  xhttp.send();
}

async function CreateBillHTML(billInfo){
    GetBillId(billInfo.Id)
        .then((result) => {
            let type = result.type;
            let title;
            let iconName;
            let detailHref;
            let container;
            switch (type) {
                case 'FI':
                    title = 'Vé máy bay';
                    iconName = 'airplane';
                    detailHref = `/payment/bill-detail/flight?billId=${result.id}`;
                    container = flightBillContainer;
                    break;
                case 'BI':
                    title = 'Vé xe khách';
                    iconName = 'bus';
                    detailHref = `/payment/bill-detail/bus?billId=${result.id}`;
                    container = busBillContainer;
                    break;
                case 'TI':
                    title = 'Xe dịch vụ';
                    iconName = 'car';
                    detailHref = `/payment/bill-detail/transfer?billId=${result.id}`;
                    container = transferBillContainer;
                    break;
                case 'RI':
                    title = 'Khách sạn';
                    iconName = 'bed';
                    detailHref = `/payment/bill-detail/hotel?billId=${result.id}`;
                    container = hotelBillContainer;
                    break;
                default:
                    return;
            }

            container.innerHTML += `
            <div class="bill-item">
                <div class="left-label">
                    <div class="bill-type">
                        <ion-icon name="${iconName}"></ion-icon>
                        <div class="text">
                            ${title}
                        </div>
                    </div>
                    <div class="bill-id">
                        <div class="text">
                            Mã giao dịch:
                        </div>
                        <div class="id-text">
                            ${result.id}
                        </div>
                    </div>
                </div>
                <div class="right-label">
                    <div class="bill-price">
                        <div class="text">
                            ${NumberToVND(billInfo.Total)} VND
                        </div>
                    </div>
                    <div class="bill-status">
                        <div class="text">
                            Đã thanh toán
                        </div>
                    </div>
                    <a class="btn-default detail-btn" href="${detailHref}">
                        <div class="text">Chi tiết</div>
                    </a>
                </div>
            </div>
            `;
        });
}

async function GetBillId(id){
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();
        xhttp.open("GET","/payment/api/get_bill?id="+id,true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            try {
              let results = JSON.parse(this.responseText);
              resolve(results);
            } catch (err) {
              reject(err);
            }
          }
        };
        xhttp.send();
      });
}

function NumberToVND(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}