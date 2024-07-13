const carourelNav = document.querySelector('.carousel__nav');
const navButtons = document.querySelectorAll('.nav__btn');
const contentItems = document.querySelectorAll('.content-item');
class Carousel {
    constructor(items, buttons) {
        this.carouselItems = [...items];
        this.navButtons = buttons;
    }

    updateGallery() {
        this.carouselItems.forEach(item => {
            item.classList.remove('content-item-1');
            item.classList.remove('content-item-2');
            item.classList.remove('content-item-3');
            item.classList.remove('content-item-4');
            item.classList.remove('content-item-5');
        });
        this.carouselItems.slice(0,5).forEach((item, index) => {
            item.classList.add(`content-item-${index + 1}`);
        });
    }

    setButton() {
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.id == 'btn-left') {
                    this.carouselItems.push(this.carouselItems.shift());
                }
                else if (btn.id == 'btn-right') {
                    this.carouselItems.unshift(this.carouselItems.pop());
                }
                this.updateGallery();
            });
        });
    }

    autoRotate() {
        setInterval(() => {
            this.carouselItems.unshift(this.carouselItems.pop());
            this.updateGallery();
        }, 3000);
    }
}

const carousel = new Carousel(contentItems, navButtons);
carousel.setButton();
carousel.autoRotate();
