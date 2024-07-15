const featureButtons = document.querySelectorAll('.feature-container__navbar .navbar__item');
const featureContainers = document.querySelectorAll('.feature-container__item');''
featureButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        featureButtons.forEach(btn => btn.classList.remove('selected'));
            btn.classList.add('selected');
            const target = btn.dataset.featureType;
            featureContainers.forEach(feature => {
                feature.classList.remove('show');
                feature.classList.add('hide');
                if (feature.dataset.featureType === target) {
                    feature.classList.add('show');
                    feature.classList.remove('hide');
            }
        });
    });
});

window.onscroll = function() {onScroll()};
function onScroll() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        document.getElementById('header').classList.add('on-scroll');
    } else {
        document.getElementById('header').classList.remove('on-scroll');
    }
}


