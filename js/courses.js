// ====== База данных программ (строительная тематика) ======
const courses = [
    { id: 1, title: "Общестроительные работы", category: "construction", level: "beginner", price: 35000, duration: 24, rating: 4.8, reviews: 247, description: "Фундамент, земляные работы, армирование и монолитные конструкции. Практика на площадке.", image: "🏗️", popular: true },
    { id: 2, title: "Отделочные работы и ремонт", category: "finishing", level: "intermediate", price: 28000, duration: 16, rating: 4.9, reviews: 189, description: "Штукатурка, плиточные работы, декоративные покрытия и окраска. Техника и финишные решения.", image: "🧰", popular: true },
    { id: 3, title: "Проектирование и BIM", category: "bim", level: "advanced", price: 42000, duration: 20, rating: 4.9, reviews: 134, description: "AutoCAD, Revit, подготовка рабочих чертежей и смет. BIM-процессы и координрование.", image: "📐", popular: true },
    { id: 4, title: "Электромонтажные работы", category: "electric", level: "intermediate", price: 32000, duration: 18, rating: 4.7, reviews: 98, description: "Прокладка кабелей, щитки, заземление и монтаж электрооборудования на объекте.", image: "🔌", popular: false }
    ];

// Текущие фильтры и сортировка
let currentFilters = { category: 'all', level: 'all', price: 'all', duration: 'all' };
let currentSort = 'popular';

document.addEventListener('DOMContentLoaded', function() {
    renderCourses();
    setupEventListeners();
});

function setupEventListeners() {
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentSort = this.dataset.sort;
            renderCourses();
        });
    });

    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) applyFiltersBtn.addEventListener('click', function() {
        currentFilters = {
            category: document.getElementById('category').value,
            level: document.getElementById('level').value,
            price: document.getElementById('price').value,
            duration: document.getElementById('duration').value
        };
        renderCourses();
    });

    const resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetFilters);

    const resetFiltersMessageBtn = document.getElementById('resetFiltersMessage');
    if (resetFiltersMessageBtn) resetFiltersMessageBtn.addEventListener('click', resetFilters);

    ['category','level','price','duration'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', applyFiltersFromSelects);
    });
}

function applyFiltersFromSelects() {
    currentFilters = {
        category: document.getElementById('category').value,
        level: document.getElementById('level').value,
        price: document.getElementById('price').value,
        duration: document.getElementById('duration').value
    };
    renderCourses();
}

function resetFilters() {
    document.getElementById('category').value = 'all';
    document.getElementById('level').value = 'all';
    document.getElementById('price').value = 'all';
    document.getElementById('duration').value = 'all';
    currentFilters = { category: 'all', level: 'all', price: 'all', duration: 'all' };
    renderCourses();
}

function filterCourses() {
    return courses.filter(course => {
        if (currentFilters.category !== 'all' && course.category !== currentFilters.category) return false;
        if (currentFilters.level !== 'all' && course.level !== currentFilters.level) return false;

        if (currentFilters.price !== 'all'){
            if (currentFilters.price === 'low' && course.price > 25000) return false;
            if (currentFilters.price === 'medium' && (course.price < 25000 || course.price > 40000)) return false;
            if (currentFilters.price === 'high' && course.price < 40000) return false;
        }

        if (currentFilters.duration !== 'all'){
            if (currentFilters.duration === 'short' && course.duration > 12) return false;
            if (currentFilters.duration === 'medium' && (course.duration < 13 || course.duration > 24)) return false;
            if (currentFilters.duration === 'long' && course.duration < 25) return false;
        }

        return true;
    });
}

function sortCourses(filteredCourses) {
    const sortedCourses = [...filteredCourses];
    switch (currentSort){
        case 'price-asc': return sortedCourses.sort((a,b)=>a.price-b.price);
        case 'price-desc': return sortedCourses.sort((a,b)=>b.price-a.price);
        case 'duration': return sortedCourses.sort((a,b)=>a.duration-b.duration);
        case 'rating': return sortedCourses.sort((a,b)=>b.rating-a.rating);
        case 'popular':
        default:
            return sortedCourses.sort((a,b)=>{
                if (a.popular && !b.popular) return -1;
                if (!a.popular && b.popular) return 1;
                return b.rating - a.rating;
            });
    }
}

function generateCourseHTML(course){
    const levelNames = { 'beginner':'Начальный', 'intermediate':'Средний', 'advanced':'Продвинутый' };
    const categoryNames = {
        'construction':'Общестроительные работы',
        'finishing':'Отделочные работы',
        'bim':'Проектирование / BIM',
        'electric':'Электротехника',
        'safety':'Охрана труда'
    };

    return `
        <div class="course-card" data-course-id="${course.id}">
            <div style="position:relative;">
                <div class="feature-icon">🦺</div>
                <div class="emoji">${course.image}</div>
            </div>
            <h3>${course.title}</h3>
            <p style="margin:0.35rem 0 0.6rem 0; color:var(--muted-color)"><strong>Категория:</strong> ${categoryNames[course.category] || course.category} • <strong>Уровень:</strong> ${levelNames[course.level]}</p>
            <p style="margin:0 0 0.6rem 0">${course.description}</p>
            <p class="course-price">${course.price.toLocaleString()} ₽</p>
            <p class="course-meta">📚 ${course.duration} недель • ⭐ ${course.rating}/5 (${course.reviews} отзывов)</p>
            <a href="${getCourseLink(course.id)}" class="btn">Подробнее о программе</a>
        </div>
    `;
}

function getCourseLink(courseId){
    const courseLinks = {
        1: 'course-construction.html',
        2: 'course-finishing.html',
        3: 'course-bim.html',
        4: 'course-electric.html',
        5: 'course-painting.html',
        6: 'course-engineering.html',
        7: 'course-safety.html',
        8: 'course-rebar.html'
    };
    return courseLinks[courseId] || 'courses.html';
}

function renderCourses(){
    const container = document.getElementById('coursesContainer');
    const countElement = document.getElementById('coursesCount');
    const noCoursesMessage = document.getElementById('noCoursesMessage');
    if (!container) { console.error('Контейнер для программ не найден!'); return; }

    const filtered = filterCourses();
    const sorted = sortCourses(filtered);

    if (countElement) countElement.textContent = sorted.length;

    container.innerHTML = '';

    if (sorted.length > 0){
        if (noCoursesMessage) noCoursesMessage.style.display = 'none';
        container.style.display = 'grid';
        sorted.forEach(course => container.insertAdjacentHTML('beforeend', generateCourseHTML(course)));
    } else {
        container.style.display = 'none';
        if (noCoursesMessage) noCoursesMessage.style.display = 'block';
    }
}

// Простой поиск (если понадобится) — возвращает список программ по запросу
function searchCourses(query){
    return courses.filter(course => (course.title + ' ' + course.description).toLowerCase().includes(query.toLowerCase()));
}
