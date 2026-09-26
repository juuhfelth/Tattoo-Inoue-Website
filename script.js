//Carrossel - Portfólio

let currentIndex = 0;
const items = document.querySelectorAll('.carrossel_item');
const totalItems = items.length;

function updateCarrossel() {
    items.forEach((item, index) => {
        item.classList.remove('center', 'left', 'right', 'hidden-left', 'hidden-right');

        const diff = index - currentIndex;

        if (diff === 0) {
            item.classList.add('center');
        } else if (diff === 1  || diff === -(totalItems - 1)) {
            item.classList.add('right');
            item.style.setProperty('--hover-x', '380px');
        } else if (diff === -1 || diff === totalItems - 1) {
            item.classList.add('left');
            item.style.setProperty('--hover-x', '-380px');
        } else if (diff  > 1 || diff === -(totalItems - 2)) {
            item.classList.add('hidden-right');
        } else {
            item.classList.add('hidden-left');
        }
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarrossel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarrossel();
}

function goToSlide(index) {
    currentIndex = index;
    updateCarrossel();
}

//suporte para navegar pelo teclado

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

let touchStartX = 0;
        let touchEndX = 0;

        document.querySelector('.container_carrossel').addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.querySelector('.container_carrossel').addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) nextSlide();
            if (touchEndX > touchStartX + 50) prevSlide();
        }

//inicializar o carrossel

updateCarrossel();

//Fim do Carrossel

//observer para acompanhar a pagina//

const sections = document.querySelectorAll('section[id]');
const link = document.querySelectorAll('.lista_menu-link');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            link.forEach(l => l.classList.remove('active'));
            const active = document.querySelector(`.lista_menu-link[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { threshold: 0.3});

sections.forEach(section => observer.observe(section));

//animação de scroll//

const links = document.querySelectorAll('a[href^="#"]');

links.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');

        const targetElement = document.querySelector(targetId);

        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    })
})
