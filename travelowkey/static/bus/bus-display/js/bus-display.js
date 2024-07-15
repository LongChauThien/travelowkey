let sortType = "Giá thấp nhất";
const sortContainer = document.getElementById("sort-container");
const sortValueSelect = document.getElementById("sort-value-select");
const sortTypeDropdown = document.getElementById("sort-type-dropdown");
const sortTypeItem = sortTypeDropdown.querySelectorAll(".sort-type-item");
const searchBarDeparture = document.getElementById("search-bar-departure");
const searchBarArrival = document.getElementById("search-bar-arrival");
const searchBarDate = document.getElementById("search-bar-date");
const searchBarPassenger = document.getElementById("search-bar-passenger");
const btnShowMore = document.getElementById("btn-showMore");

let action = "Giá thấp nhất"

sortType = sortTypeDropdown
  .querySelector(".sort-type-item.select")
  .querySelector(".text").innerText;

const sortTypeValue = document.getElementById("sort-type-value");

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
    action = sortType;
  });
});