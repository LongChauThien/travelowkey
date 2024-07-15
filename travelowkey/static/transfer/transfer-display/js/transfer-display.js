const filterItems = document.querySelectorAll(".filter-item")
const resultContainer = document.getElementById("result-container")
const resultItemTemplate = document.getElementById("result-item-template")
const itemFilters = document.querySelectorAll(".item-filter")
const sort = document.querySelector("#sort")
const itemSort = sort.querySelectorAll(".item-filter")
let searchInfoTitle = document.getElementById("search-info-title")
const searchInfoDescription = document.getElementById("search-info-description")
const btnShowMore = document.getElementById("btn-showMore");
let imgs = []
let pageLimit = 11;
let action = "showResultASC"

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
                action = "showResultDESC"
            }
            else {
                action = "showResultASC"

            }
            // getData()
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