// lunch-script.js - скрипт для динамического отображения и управления блюдами

// Объект для хранения выбранных блюд
let selectedDishes = {
    soup: null,
    main: null,
    drink: null
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

// Функция для отображения всех блюд
function displayDishes() {
    // Сортируем блюда по категориям и алфавиту
    const soups = sortDishesAlphabetically(dishes.filter(dish => dish.category === 'soup'));
    const mains = sortDishesAlphabetically(dishes.filter(dish => dish.category === 'main'));
    const drinks = sortDishesAlphabetically(dishes.filter(dish => dish.category === 'drink'));
    
    // Находим контейнеры для каждой категории
    const soupsGrid = document.querySelector('.soups-section .dishes-grid');
    const mainsGrid = document.querySelector('.main-courses-section .dishes-grid');
    const drinksGrid = document.querySelector('.drinks-section .dishes-grid');
    
    // Очищаем контейнеры (на случай повторного вызова)
    soupsGrid.innerHTML = '';
    mainsGrid.innerHTML = '';
    drinksGrid.innerHTML = '';
    
    // Добавляем блюда в соответствующие секции
    soups.forEach(soup => {
        soupsGrid.appendChild(createDishCard(soup));
    });
    
    mains.forEach(main => {
        mainsGrid.appendChild(createDishCard(main));
    });
    
    drinks.forEach(drink => {
        drinksGrid.appendChild(createDishCard(drink));
    });
}

// Функция для выбора блюда
function selectDish(dish) {
    // Убираем выделение со всех карточек в этой категории
    const allCards = document.querySelectorAll('.dish-card');
    allCards.forEach(card => {
        const cardDish = dishes.find(d => d.keyword === card.getAttribute('data-dish'));
        if (cardDish && cardDish.category === dish.category) {
            card.classList.remove('selected');
        }
    });
    
    // Добавляем выделение выбранной карточке
    const selectedCard = document.querySelector(`[data-dish="${dish.keyword}"]`);
    selectedCard.classList.add('selected');
    
    // Сохраняем выбранное блюдо
    selectedDishes[dish.category] = dish;
    
    // Обновляем отображение в форме заказа
    updateOrderForm();
}

// Функция для обновления формы заказа
function updateOrderForm() {
    const soupSelect = document.querySelector('select[name="soup"]');
    const mainSelect = document.querySelector('select[name="main"]');
    const drinkSelect = document.querySelector('select[name="drink"]');
    
    // Обновляем выбранные значения в select
    soupSelect.value = selectedDishes.soup ? selectedDishes.soup.keyword : '';
    mainSelect.value = selectedDishes.main ? selectedDishes.main.keyword : '';
    drinkSelect.value = selectedDishes.drink ? selectedDishes.drink.keyword : '';
    
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
    selectedDishes = { soup: null, main: null, drink: null };
    
    // Убираем выделение со всех карточек
    const allCards = document.querySelectorAll('.dish-card');
    allCards.forEach(card => {
        card.classList.remove('selected');
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
}

// Функция для заполнения select элементов
function populateSelects() {
    const soupSelect = document.querySelector('select[name="soup"]');
    const mainSelect = document.querySelector('select[name="main"]');
    const drinkSelect = document.querySelector('select[name="drink"]');
    
    // Очищаем существующие опции (кроме первой)
    soupSelect.innerHTML = '<option value="">– Выберите суп –</option>';
    mainSelect.innerHTML = '<option value="">– Выберите главное блюдо –</option>';
    drinkSelect.innerHTML = '<option value="">– Выберите напиток –</option>';
    
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
            case 'drink':
                drinkSelect.appendChild(option);
                break;
        }
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Отображаем блюда
    displayDishes();
    
    // Заполняем select элементы
    populateSelects();
    
    // Добавляем обработчик для кнопки сброса
    const resetBtn = document.querySelector('.reset-btn');
    resetBtn.addEventListener('click', resetSelection);
    
    // Добавляем обработчик для отправки формы
    const orderForm = document.querySelector('.order-form-container');
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Проверяем, что выбраны блюда
        if (!selectedDishes.soup && !selectedDishes.main && !selectedDishes.drink) {
            alert('Пожалуйста, выберите хотя бы одно блюдо!');
            return;
        }
        
        // Собираем данные формы
        const formData = new FormData();
        
        // Добавляем выбранные блюда
        if (selectedDishes.soup) formData.append('soup', selectedDishes.soup.keyword);
        if (selectedDishes.main) formData.append('main', selectedDishes.main.keyword);
        if (selectedDishes.drink) formData.append('drink', selectedDishes.drink.keyword);
        
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
        if (selectedDishes.drink) orderInfo += `Напиток: ${selectedDishes.drink.name} - ${selectedDishes.drink.price}₽\n`;
        
        const total = Object.values(selectedDishes).reduce((sum, dish) => sum + (dish ? dish.price : 0), 0);
        orderInfo += `\nОбщая стоимость: ${total}₽\n\n`;
        orderInfo += `Данные для доставки:\nИмя: ${customerName}\nТелефон: ${customerPhone}\nАдрес: ${customerAddress}`;
        
        alert(orderInfo);
        
        // В реальном приложении здесь был бы AJAX запрос на сервер
        console.log('Данные формы:', Object.fromEntries(formData));
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