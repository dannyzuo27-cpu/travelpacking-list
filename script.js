let currentCategory = 0;
const totalCategories = 3;
let checkedItems = 23;
let totalItems = 50;
let currentWeight = 8.5;
let maxWeight = 23;

function goToDetail(index) {
    document.getElementById('home').classList.remove('active');
    document.getElementById('detail').classList.add('active');
    currentCategory = 0;
    updateCategoryView();
}

function goToHome() {
    document.getElementById('detail').classList.remove('active');
    document.getElementById('home').classList.add('active');
}

function prevCategory() {
    if (currentCategory > 0) {
        currentCategory--;
        updateCategoryView();
    }
}

function nextCategory() {
    if (currentCategory < totalCategories - 1) {
        currentCategory++;
        updateCategoryView();
    }
}

function updateCategoryView() {
    const cards = document.querySelectorAll('.category-card');
    cards.forEach((card, index) => {
        card.classList.remove('prev', 'active', 'next');
        if (index < currentCategory) {
            card.classList.add('prev');
        } else if (index === currentCategory) {
            card.classList.add('active');
        } else {
            card.classList.add('next');
        }
    });

    // Update navigation buttons
    document.getElementById('prevBtn').classList.toggle('disabled', currentCategory === 0);
    document.getElementById('nextBtn').classList.toggle('disabled', currentCategory === totalCategories - 1);
}

function toggleCheck(checkbox) {
    const wasChecked = checkbox.classList.contains('checked');
    checkbox.classList.toggle('checked');
    
    if (wasChecked) {
        checkedItems--;
        currentWeight -= 0.2;
    } else {
        checkedItems++;
        currentWeight += 0.2;
    }

    updateProgress();
}

function updateProgress() {
    const packPercent = (checkedItems / totalItems) * 100;
    const weightPercent = (currentWeight / maxWeight) * 100;

    document.getElementById('packProgress').textContent = `${checkedItems} / ${totalItems}`;
    document.getElementById('weightProgress').textContent = `${currentWeight.toFixed(1)} / ${maxWeight} kg`;
    document.getElementById('packBar').style.width = packPercent + '%';
    document.getElementById('weightBar').style.width = weightPercent + '%';

    // Weight warning colors
    const weightBar = document.getElementById('weightBar');
    weightBar.classList.remove('warning', 'danger');
    
    if (weightPercent > 100) {
        weightBar.classList.add('danger');
    } else if (weightPercent > 80) {
        weightBar.classList.add('warning');
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (document.getElementById('detail').classList.contains('active')) {
        if (e.key === 'ArrowLeft') prevCategory();
        if (e.key === 'ArrowRight') nextCategory();
        if (e.key === 'Escape') goToHome();
    }
});

// Touch swipe support
let touchStartX = 0;
let touchEndX = 0;

const detailContent = document.querySelector('.detail-content');

detailContent.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

detailContent.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        nextCategory();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        prevCategory();
    }
}