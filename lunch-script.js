// lunch-script.js - скрипт для динамического отображения и управления блюдами

// Объект для хранения выбранных блюд
let selectedDishes = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

// Объект для хранения активных фильтров
let activeFilters = {
    soup: 'all',
    main: 'all',
    salad: 'all',
    drink: 'all',
    dessert: 'all'
};

// Функция для сортировки блюд по алфавиту
function sortDishesAlphabetically(dishesArray) {
    return dishesArray.sort((a, b) => a.name.localeCompare(b.name));
}

// Функция для создания карточки блюда
function createDishCard(dish) {
    const dishCard = document.createElement('div');
    dishCard.className = 'dish-card';
    dishCard.setAttribute('data-dish', dish.keyword);
    dishCard.setAttribute('data-kind', dish.kind);
    
    dishCard.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}">
        <p class="price">${dish.price}₽</p>
        <p class="name">${dish.name}</p>
        <p class="details">${dish.count}</p>
        <button type="button">Добавить</button>
    `;
    
    // Добавляем обработчик клика на кнопку
    const button = dishCard.querySelector('button');
    button.addEventListener('click', function() {
        selectDish(dish);
    });
    
    return dishCard;
}

// Функция для отображения блюд с учетом фильтра
function displayFilteredDishes(category) {
    const categorySections = {
        soup: '.soups-section .dishes-grid',
        main: '.main-courses-section .dishes-grid',
        salad: '.salads-section .dishes-grid',
        drink: '.drinks-section .dishes-grid',
        dessert: '.desserts-section .dishes-grid'
    };
    
    const gridContainer = document.querySelector(categorySections[category]);
    gridContainer.innerHTML = '';
    
    // Фильтруем блюда по категории и активному фильтру
    let filteredDishes = dishes.filter(dish => dish.category === category);
    
    if (activeFilters[category] !== 'all') {
        filteredDishes = filteredDishes.filter(dish => dish.kind === activeFilters[category]);
    }
    
    // Сортируем и отображаем отфильтрованные блюда
    const sortedDishes = sortDishesAlphabetically(filteredDishes);
    
    sortedDishes.forEach(dish => {
        const dishCard = createDishCard(dish);
        gridContainer.appendChild(dishCard);
        
        // Если это блюдо было выбрано ранее, выделяем его
        if (selectedDishes[category] && selectedDishes[category].keyword === dish.keyword) {
            dishCard.classList.add('selected');
        }
    });
}

// Функция для отображения всех блюд
function displayAllDishes() {
    // Отображаем блюда для каждой категории с учетом фильтров
    displayFilteredDishes('soup');
    displayFilteredDishes('main');
    displayFilteredDishes('salad');
    displayFilteredDishes('drink');
    displayFilteredDishes('dessert');
}

// Функция для инициализации фильтров
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.closest('section');
            const category = getCategoryFromSection(section);
            const filterKind = this.getAttribute('data-kind');
            
            // Убираем активный класс со всех кнопок в этой секции
            const sectionFilters = section.querySelectorAll('.filter-btn');
            sectionFilters.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс нажатой кнопке
            this.classList.add('active');
            
            // Обновляем активный фильтр для категории
            activeFilters[category] = filterKind;
            
            // Обновляем отображение блюд для этой категории
            displayFilteredDishes(category);
        });
    });
}

// Функция для определения категории по секции
function getCategoryFromSection(section) {
    if (section.classList.contains('soups-section')) return 'soup';
    if (section.classList.contains('main-courses-section')) return 'main';
    if (section.classList.contains('salads-section')) return 'salad';
    if (section.classList.contains('drinks-section')) return 'drink';
    if (section.classList.contains('desserts-section')) return 'dessert';
    return '';
}

// Функция для выбора блюда
function selectDish(dish) {
    const category = dish.category;
    
    // Убираем выделение со всех карточек в этой категории
    const allCards = document.querySelectorAll(`.${category}s-section .dish-card`);
    allCards.forEach(card => {
        card.classList.remove('selected');
    });
    
    // Добавляем выделение выбранной карточке
    const selectedCard = document.querySelector(`[data-dish="${dish.keyword}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Сохраняем выбранное блюдо
    selectedDishes[category] = dish;
    
    // Обновляем отображение в форме заказа
    updateOrderForm();
}

// Функция для обновления формы заказа
function updateOrderForm() {
    const soupSelect = document.querySelector('select[name="soup"]');
    const mainSelect = document.querySelector('select[name="main"]');
    const saladSelect = document.querySelector('select[name="salad"]');
    const drinkSelect = document.querySelector('select[name="drink"]');
    const dessertSelect = document.querySelector('select[name="dessert"]');
    
    // Обновляем выбранные значения в select
    soupSelect.value = selectedDishes.soup ? selectedDishes.soup.keyword : '';
    mainSelect.value = selectedDishes.main ? selectedDishes.main.keyword : '';
    saladSelect.value = selectedDishes.salad ? selectedDishes.salad.keyword : '';
    drinkSelect.value = selectedDishes.drink ? selectedDishes.drink.keyword : '';
    dessertSelect.value = selectedDishes.dessert ? selectedDishes.dessert.keyword : '';
    
    // Обновляем отображение стоимости
    updateOrderTotal();
}

// Функция для подсчета и отображения общей стоимости
function updateOrderTotal() {
    let total = 0;
    let hasSelectedDishes = false;
    
    // Считаем общую стоимость
    Object.values(selectedDishes).forEach(dish => {
        if (dish) {
            total += dish.price;
            hasSelectedDishes = true;
        }
    });
    
    // Находим или создаем блок с общей стоимостью
    let totalElement = document.querySelector('.order-total');
    
    if (!totalElement) {
        totalElement = document.createElement('div');
        totalElement.className = 'order-total';
        const orderSummary = document.querySelector('.order-summary');
        orderSummary.appendChild(totalElement);
    }
    
    // Показываем или скрываем блок в зависимости от наличия выбранных блюд
    if (hasSelectedDishes) {
        totalElement.innerHTML = `<strong>Стоимость заказа: ${total}₽</strong>`;
        totalElement.style.display = 'block';
    } else {
        totalElement.style.display = 'none';
    }
}

// Функция для сброса выбора
function resetSelection() {
    // Сбрасываем выбранные блюда
    selectedDishes = { 
        soup: null, 
        main: null, 
        salad: null, 
        drink: null, 
        dessert: null 
    };
    
    // Сбрасываем активные фильтры
    activeFilters = {
        soup: 'all',
        main: 'all',
        salad: 'all',
        drink: 'all',
        dessert: 'all'
    };
    
    // Убираем выделение со всех карточек
    const allCards = document.querySelectorAll('.dish-card');
    allCards.forEach(card => {
        card.classList.remove('selected');
    });
    
    // Сбрасываем активные кнопки фильтров
    const allFilterButtons = document.querySelectorAll('.filter-btn');
    allFilterButtons.forEach(btn => {
        if (btn.getAttribute('data-kind') === 'all') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Сбрасываем select'ы в форме
    const selects = document.querySelectorAll('.order-summary select');
    selects.forEach(select => {
        select.value = '';
    });
    
    // Скрываем блок с общей стоимостью
    const totalElement = document.querySelector('.order-total');
    if (totalElement) {
        totalElement.style.display = 'none';
    }
    
    // Обновляем отображение всех блюд
    displayAllDishes();
}

// Функция для заполнения select элементов
function populateSelects() {
    const soupSelect = document.querySelector('select[name="soup"]');
    const mainSelect = document.querySelector('select[name="main"]');
    const saladSelect = document.querySelector('select[name="salad"]');
    const drinkSelect = document.querySelector('select[name="drink"]');
    const dessertSelect = document.querySelector('select[name="dessert"]');
    
    // Очищаем существующие опции (кроме первой)
    soupSelect.innerHTML = '<option value="">– Выберите суп –</option>';
    mainSelect.innerHTML = '<option value="">– Выберите главное блюдо –</option>';
    saladSelect.innerHTML = '<option value="">– Выберите салат –</option>';
    drinkSelect.innerHTML = '<option value="">– Выберите напиток –</option>';
    dessertSelect.innerHTML = '<option value="">– Выберите десерт –</option>';
    
    // Сортируем блюда по алфавиту
    const sortedDishes = sortDishesAlphabetically([...dishes]);
    
    // Заполняем select'ы
    sortedDishes.forEach(dish => {
        const option = document.createElement('option');
        option.value = dish.keyword;
        option.textContent = `${dish.name} - ${dish.price}₽`;
        
        switch(dish.category) {
            case 'soup':
                soupSelect.appendChild(option);
                break;
            case 'main':
                mainSelect.appendChild(option);
                break;
            case 'salad':
                saladSelect.appendChild(option);
                break;
            case 'drink':
                drinkSelect.appendChild(option);
                break;
            case 'dessert':
                dessertSelect.appendChild(option);
                break;
        }
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Отображаем все блюда
    displayAllDishes();
    
    // Инициализируем фильтры
    initializeFilters();
    
    // Заполняем select элементы
    populateSelects();
    
    // Добавляем обработчик для кнопки сброса
    const resetBtn = document.querySelector('.reset-btn');
    resetBtn.addEventListener('click', resetSelection);
    
    // Добавляем обработчик для отправки формы
    const orderForm = document.getElementById('order-form');
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Проверяем, что выбраны блюда
        if (!selectedDishes.soup && !selectedDishes.main && !selectedDishes.salad && 
            !selectedDishes.drink && !selectedDishes.dessert) {
            alert('Пожалуйста, выберите хотя бы одно блюдо!');
            return;
        }
        
        // Собираем данные формы
        const formData = new FormData();
        
        // Добавляем выбранные блюда
        if (selectedDishes.soup) formData.append('soup', selectedDishes.soup.keyword);
        if (selectedDishes.main) formData.append('main', selectedDishes.main.keyword);
        if (selectedDishes.salad) formData.append('salad', selectedDishes.salad.keyword);
        if (selectedDishes.drink) formData.append('drink', selectedDishes.drink.keyword);
        if (selectedDishes.dessert) formData.append('dessert', selectedDishes.dessert.keyword);
        
        // Добавляем остальные данные формы
        const customerName = document.querySelector('input[name="name"]').value;
        const customerEmail = document.querySelector('input[name="email"]').value;
        const customerPhone = document.querySelector('input[name="phone"]').value;
        const customerAddress = document.querySelector('input[name="address"]').value;
        const comments = document.querySelector('textarea[name="comments"]').value;
        const promotions = document.querySelector('input[name="promotions"]').checked;
        const deliveryTime = document.querySelector('input[name="delivery_time"]:checked').value;
        
        formData.append('name', customerName);
        formData.append('email', customerEmail);
        formData.append('phone', customerPhone);
        formData.append('address', customerAddress);
        formData.append('comments', comments);
        formData.append('promotions', promotions);
        formData.append('delivery_time', deliveryTime);
        
        // Отображаем информацию о заказе
        let orderInfo = 'Ваш заказ:\n\n';
        if (selectedDishes.soup) orderInfo += `Суп: ${selectedDishes.soup.name} - ${selectedDishes.soup.price}₽\n`;
        if (selectedDishes.main) orderInfo += `Главное блюдо: ${selectedDishes.main.name} - ${selectedDishes.main.price}₽\n`;
        if (selectedDishes.salad) orderInfo += `Салат: ${selectedDishes.salad.name} - ${selectedDishes.salad.price}₽\n`;
        if (selectedDishes.drink) orderInfo += `Напиток: ${selectedDishes.drink.name} - ${selectedDishes.drink.price}₽\n`;
        if (selectedDishes.dessert) orderInfo += `Десерт: ${selectedDishes.dessert.name} - ${selectedDishes.dessert.price}₽\n`;
        
        const total = Object.values(selectedDishes).reduce((sum, dish) => sum + (dish ? dish.price : 0), 0);
        orderInfo += `\nОбщая стоимость: ${total}₽\n\n`;
        orderInfo += `Данные для доставки:\nИмя: ${customerName}\nТелефон: ${customerPhone}\nАдрес: ${customerAddress}`;
        
        alert(orderInfo);
        
        // В реальном приложении здесь был бы AJAX запрос на сервер
        console.log('Данные формы:', Object.fromEntries(formData));
        
        // Сбрасываем форму после успешной отправки
        resetSelection();
        orderForm.reset();
    });
    
    // Добавляем обработчики для select элементов
    const selects = document.querySelectorAll('.order-summary select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            if (this.value) {
                const selectedDish = dishes.find(dish => dish.keyword === this.value);
                if (selectedDish) {
                    selectDish(selectedDish);
                }
            }
        });
    });
});