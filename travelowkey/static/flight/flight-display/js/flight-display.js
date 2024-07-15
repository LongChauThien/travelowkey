let sortType = "Giá thấp nhất";

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
        sortTypeDropdown.querySelector(".sort-type-item.select").classList.remove("select");
        item.classList.add("select");
        sortTypeValue.innerText = item.querySelector(".text").innerText;
        sortType = sortTypeValue.innerText;
        // loadResult();
    });
});