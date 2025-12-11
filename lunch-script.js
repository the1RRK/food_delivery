// lunch-script.js - скрипт для динамического отображения и управления блюдами

// Объект для хранения выбранных блюд
let selectedDishes = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null,
    combo: null  // Добавляем комбо как отдельную позицию
};

// Объект для хранения активных фильтров
let activeFilters = {
    soup: 'all',
    main: 'all',
    salad: 'all',
    drink: 'all',
    dessert: 'all'
};

// Определение комбо-вариантов с конкретными блюдами
const lunchCombos = [
    { 
        name: 'Комбо 1: Полный обед', 
        description: 'Суп + Главное + Салат + Напиток',
        items: ['soup', 'main', 'salad', 'drink'],
        dishes: [
            { keyword: 'chicken_soup', category: 'soup' },      // Куриный суп с лапшой
            { keyword: 'chicken_cutlets', category: 'main' },    // Куриные котлеты с пюре
            { keyword: 'caesar_salad', category: 'salad' },      // Цезарь с курицей
            { keyword: 'orange_juice', category: 'drink' }       // Апельсиновый сок
        ],
        price: 0 // Будет рассчитываться автоматически
    },
    { 
        name: 'Комбо 2: Суп + Основное', 
        description: 'Суп + Основное + Напиток',
        items: ['soup', 'main', 'drink'],
        dishes: [
            { keyword: 'tomato_soup', category: 'soup' },        // Томатный суп
            { keyword: 'pasta_carbonara', category: 'main' },    // Паста Карбонара
            { keyword: 'green_tea', category: 'drink' }          // Зеленый чай
        ],
        price: 0
    },
    { 
        name: 'Комбо 3: Легкий обед', 
        description: 'Суп + Салат + Напиток',
        items: ['soup', 'salad', 'drink'],
        dishes: [
            { keyword: 'mushroom_cream_soup', category: 'soup' }, // Грибной крем-суп
            { keyword: 'greek_salad', category: 'salad' },       // Греческий салат
            { keyword: 'apple_juice', category: 'drink' }        // Яблочный сок
        ],
        price: 0
    },
    { 
        name: 'Комбо 4: Основное + Салат', 
        description: 'Главное + Салат + Напиток',
        items: ['main', 'salad', 'drink'],
        dishes: [
            { keyword: 'beef_stroganoff', category: 'main' },    // Бефстроганов
            { keyword: 'vegetable_salad', category: 'salad' },   // Овощной салат
            { keyword: 'black_tea', category: 'drink' }          // Черный чай
        ],
        price: 0
    },
    { 
        name: 'Комбо 5: Быстрый перекус', 
        description: 'Главное + Напиток',
        items: ['main', 'drink'],
        dishes: [
            { keyword: 'vegetable_curry', category: 'main' },    // Овощное карри
            { keyword: 'carrot_juice', category: 'drink' }       // Морковный сок
        ],
        price: 0
    }
];

// Рассчитываем цены комбо при загрузке
function calculateComboPrices() {
    lunchCombos.forEach(combo => {
        let totalPrice = 0;
        combo.dishes.forEach(dishItem => {
            const dish = dishes.find(d => d.keyword === dishItem.keyword);
            if (dish) {
                totalPrice += dish.price;
            }
        });
        combo.price = totalPrice;
    });
}

// Функция для проверки валидности заказа
function validateOrder() {
    // Проверяем, что хотя бы что-то выбрано
    const hasCombo = selectedDishes.combo !== null;
    const hasIndividualDishes = Object.values(selectedDishes).some((dish, key) => 
        key !== 'combo' && dish !== null
    );
    
    if (!hasCombo && !hasIndividualDishes) {
        return { 
            isValid: false, 
            message: 'Выберите блюда для заказа. Можно выбрать готовое комбо или отдельные позиции.' 
        };
    }
    
    // Если выбран комбо, все просто - комбо валидно само по себе
    if (hasCombo) {
        // Десерт можно добавить к комбо, но это не обязательно
        return { isValid: true };
    }
    
    // Если выбраны отдельные блюда (без комбо), проверяем их валидность
    const hasSoup = selectedDishes.soup !== null;
    const hasMain = selectedDishes.main !== null;
    const hasSalad = selectedDishes.salad !== null;
    const hasDrink = selectedDishes.drink !== null;
    const hasDessert = selectedDishes.dessert !== null;

    // Проверяем соответствие одному из допустимых комбо
    const validCombos = [
        // Комбо 1: Суп + Главное + Салат + Напиток
        hasSoup && hasMain && hasSalad && hasDrink,
        // Комбо 2: Суп + Главное + Напиток
        hasSoup && hasMain && hasDrink,
        // Комбо 3: Суп + Салат + Напиток
        hasSoup && hasSalad && hasDrink,
        // Комбо 4: Главное + Салат + Напиток
        hasMain && hasSalad && hasDrink,
        // Комбо 5: Главное + Напиток
        hasMain && hasDrink
    ];

    // Если заказ не соответствует ни одному комбо
    if (!validCombos.some(combo => combo)) {
        return { 
            isValid: false, 
            message: 'Выбранные блюда не соответствуют ни одному из доступных комбо. Выберите готовое комбо или соберите валидный набор.' 
        };
    }
    
    // Проверяем, что нет лишних позиций (только десерт может быть лишним)
    if ((hasSoup && !hasMain && !hasSalad && hasDrink) || 
        (hasSalad && !hasSoup && !hasMain && hasDrink) ||
        (hasSoup && hasSalad && !hasMain && !hasDrink)) {
        return { 
            isValid: false, 
            message: 'Выберите недостающие блюда для завершения заказа' 
        };
    }
    
    return { isValid: true };
}

// Вспомогательная функция для получения названия категории
function getItemName(category) {
    switch(category) {
        case 'soup': return 'суп';
        case 'main': return 'главное блюдо';
        case 'salad': return 'салат';
        case 'drink': return 'напиток';
        case 'dessert': return 'десерт';
        case 'combo': return 'комбо';
        default: return '';
    }
}

// Функция для показа уведомления
function showNotification(message) {
    // Создаем оверлей
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    notification.innerHTML = `
        <h3>Внимание</h3>
        <p>${message}</p>
        <button class="notification-btn">Окей</button>
    `;
    
    // Добавляем обработчик для кнопки
    const button = notification.querySelector('.notification-btn');
    button.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    button.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#ff5c3d';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'tomato';
    });
    
    // Добавляем уведомление в оверлей и на страницу
    overlay.appendChild(notification);
    document.body.appendChild(overlay);
    
    // Добавляем обработчик для закрытия по клику на оверлей
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

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
        <button type="button" class="dish-btn">Добавить</button>
    `;
    
    // Добавляем обработчик клика на кнопку
    const button = dishCard.querySelector('.dish-btn');
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        selectDish(dish);
    });
    
    // Добавляем обработчик клика на всю карточку
    dishCard.addEventListener('click', function(e) {
        if (!e.target.classList.contains('dish-btn')) {
            selectDish(dish);
        }
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
    
    // Проверяем, что контейнер существует
    if (!gridContainer) {
        console.error(`Контейнер для категории ${category} не найден`);
        return;
    }
    
    gridContainer.innerHTML = '';
    
    // Проверяем, что массив dishes загружен
    if (!dishes || dishes.length === 0) {
        gridContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">Загрузка блюд...</p>';
        return;
    }
    
    // Фильтруем блюда по категории и активному фильтру
    let filteredDishes = dishes.filter(dish => dish.category === category);
    
    if (activeFilters[category] !== 'all') {
        filteredDishes = filteredDishes.filter(dish => dish.kind === activeFilters[category]);
    }
    
    // Если нет блюд после фильтрации
    if (filteredDishes.length === 0) {
        gridContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">Нет блюд по выбранному фильтру</p>';
        return;
    }
    
    // Сортируем и отображаем отфильтрованные блюды
    const sortedDishes = sortDishesAlphabetically(filteredDishes);
    
    sortedDishes.forEach(dish => {
        const dishCard = createDishCard(dish);
        gridContainer.appendChild(dishCard);
        
        // Если это блюдо было выбрано ранее, выделяем его
        if (selectedDishes[category] && selectedDishes[category].keyword === dish.keyword) {
            dishCard.classList.add('selected');
            dishCard.querySelector('.dish-btn').textContent = 'Удалить';
        }
    });
}

// Функция для отображения всех блюд
function displayAllDishes() {
    // Проверяем, что массив dishes загружен
    if (!dishes || dishes.length === 0) {
        console.warn('Массив dishes пустой или не загружен');
        
        // Показываем сообщение во всех секциях
        const allGrids = document.querySelectorAll('.dishes-grid');
        allGrids.forEach(grid => {
            grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">Загрузка меню...</p>';
        });
        
        return;
    }
    
    console.log(`Отображаем ${dishes.length} блюд`);
    
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

// Функция для выбора/удаления блюда
function selectDish(dish) {
    // Проверяем, что массив dishes загружен
    if (!dishes || dishes.length === 0) {
        showNotification('Меню еще не загружено. Пожалуйста, подождите.');
        return;
    }
    
    const category = dish.category;
    const currentlySelected = selectedDishes[category];
    
    // Если выбран комбо, сбрасываем его
    if (selectedDishes.combo !== null) {
        resetCombo();
    }
    
    // Если уже выбрано это блюдо - удаляем его
    if (currentlySelected && currentlySelected.keyword === dish.keyword) {
        // Снимаем выделение
        const selectedCard = document.querySelector(`[data-dish="${dish.keyword}"]`);
        if (selectedCard) {
            selectedCard.classList.remove('selected');
            selectedCard.querySelector('.dish-btn').textContent = 'Добавить';
        }
        
        // Удаляем из выбранных
        selectedDishes[category] = null;
    } else {
        // Выбираем новое блюдо
        // Убираем выделение со всех карточек в этой категории
        const allCards = document.querySelectorAll(`.${category}s-section .dish-card`);
        allCards.forEach(card => {
            card.classList.remove('selected');
            card.querySelector('.dish-btn').textContent = 'Добавить';
        });
        
        // Добавляем выделение выбранной карточке
        const selectedCard = document.querySelector(`[data-dish="${dish.keyword}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
            selectedCard.querySelector('.dish-btn').textContent = 'Удалить';
        }
        
        // Сохраняем выбранное блюдо
        selectedDishes[category] = dish;
    }
    
    // Обновляем отображение в форме заказа
    updateOrderForm();
}

// Функция для сброса комбо
function resetCombo() {
    selectedDishes.combo = null;
    const variantCards = document.querySelectorAll('.variant-card');
    variantCards.forEach(card => {
        card.classList.remove('selected');
    });
    
    // Скрываем информацию о выбранном комбо
    const comboInfo = document.getElementById('combo-selection-info');
    if (comboInfo) comboInfo.style.display = 'none';
    
    const selectedComboDisplay = document.getElementById('selected-combo-display');
    if (selectedComboDisplay) {
        selectedComboDisplay.innerHTML = `
            <span style="color: #999;">Не выбрано</span>
        `;
    }
    
    const orderSummaryInfo = document.getElementById('order-summary-info');
    if (orderSummaryInfo) orderSummaryInfo.style.display = 'none';
    
    // Обновляем select комбо
    const comboSelect = document.querySelector('select[name="combo"]');
    if (comboSelect) {
        comboSelect.value = '';
    }
}

// Функция для выбора комбо
function selectCombo(comboIndex) {
    // Проверяем, что массив dishes загружен
    if (!dishes || dishes.length === 0) {
        showNotification('Меню еще не загружено. Пожалуйста, подождите.');
        return;
    }
    
    // Сбрасываем все отдельные блюда (кроме десерта)
    const categories = ['soup', 'main', 'salad', 'drink'];
    categories.forEach(category => {
        selectedDishes[category] = null;
        
        // Убираем выделение со всех карточек в этой категории
        const allCards = document.querySelectorAll(`.${category}s-section .dish-card`);
        allCards.forEach(card => {
            card.classList.remove('selected');
            const button = card.querySelector('.dish-btn');
            if (button) button.textContent = 'Добавить';
        });
    });
    
    // Сохраняем выбранное комбо
    selectedDishes.combo = lunchCombos[comboIndex];
    
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
    const comboSelect = document.querySelector('select[name="combo"]');
    
    // Обновляем выбранные значения в select
    if (soupSelect) soupSelect.value = selectedDishes.soup ? selectedDishes.soup.keyword : '';
    if (mainSelect) mainSelect.value = selectedDishes.main ? selectedDishes.main.keyword : '';
    if (saladSelect) saladSelect.value = selectedDishes.salad ? selectedDishes.salad.keyword : '';
    if (drinkSelect) drinkSelect.value = selectedDishes.drink ? selectedDishes.drink.keyword : '';
    if (dessertSelect) dessertSelect.value = selectedDishes.dessert ? selectedDishes.dessert.keyword : '';
    if (comboSelect) comboSelect.value = selectedDishes.combo ? lunchCombos.findIndex(c => c.name === selectedDishes.combo.name) : '';
    
    // Обновляем отображение стоимости
    updateOrderTotal();
}

// Функция для подсчета и отображения общей стоимости
function updateOrderTotal() {
    let total = 0;
    let hasSelectedDishes = false;
    
    // Проверяем, что массив dishes загружен
    if (!dishes || dishes.length === 0) {
        return;
    }
    
    // Считаем общую стоимость
    Object.entries(selectedDishes).forEach(([key, dish]) => {
        if (dish) {
            if (key === 'combo') {
                total += dish.price;
            } else {
                total += dish.price;
            }
            hasSelectedDishes = true;
        }
    });
    
    // Находим или создаем блок с общей стоимостью
    let totalElement = document.querySelector('.order-total');
    
    if (!totalElement) {
        totalElement = document.createElement('div');
        totalElement.className = 'order-total';
        const orderSummary = document.querySelector('.order-summary');
        if (orderSummary) {
            orderSummary.appendChild(totalElement);
        }
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
        dessert: null,
        combo: null
    };
    
    // Сбрасываем активные фильтры
    activeFilters = {
        soup: 'all',
        main: 'all',
        salad: 'all',
        drink: 'all',
        dessert: 'all'
    };
    
    // Сбрасываем выбранное комбо
    resetCombo();
    
    // Убираем выделение со всех карточек
    const allCards = document.querySelectorAll('.dish-card');
    allCards.forEach(card => {
        card.classList.remove('selected');
        const button = card.querySelector('.dish-btn');
        if (button) button.textContent = 'Добавить';
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
    // Проверяем, что массив dishes загружен
    if (!dishes || dishes.length === 0) {
        console.warn('Невозможно заполнить select элементы: массив dishes пустой');
        return;
    }
    
    const soupSelect = document.querySelector('select[name="soup"]');
    const mainSelect = document.querySelector('select[name="main"]');
    const saladSelect = document.querySelector('select[name="salad"]');
    const drinkSelect = document.querySelector('select[name="drink"]');
    const dessertSelect = document.querySelector('select[name="dessert"]');
    const comboSelect = document.querySelector('select[name="combo"]');
    
    // Очищаем существующие опции (кроме первой)
    if (soupSelect) soupSelect.innerHTML = '<option value="">– Выберите суп –</option>';
    if (mainSelect) mainSelect.innerHTML = '<option value="">– Выберите главное блюдо –</option>';
    if (saladSelect) saladSelect.innerHTML = '<option value="">– Выберите салат –</option>';
    if (drinkSelect) drinkSelect.innerHTML = '<option value="">– Выберите напиток –</option>';
    if (dessertSelect) dessertSelect.innerHTML = '<option value="">– Выберите десерт –</option>';
    if (comboSelect) comboSelect.innerHTML = '<option value="">– Выберите комбо –</option>';
    
    // Сортируем блюда по алфавиту
    const sortedDishes = sortDishesAlphabetically([...dishes]);
    
    // Заполняем select'ы блюд
    sortedDishes.forEach(dish => {
        const option = document.createElement('option');
        option.value = dish.keyword;
        option.textContent = `${dish.name} - ${dish.price}₽`;
        
        switch(dish.category) {
            case 'soup':
                if (soupSelect) soupSelect.appendChild(option);
                break;
            case 'main':
                if (mainSelect) mainSelect.appendChild(option);
                break;
            case 'salad':
                if (saladSelect) saladSelect.appendChild(option);
                break;
            case 'drink':
                if (drinkSelect) drinkSelect.appendChild(option);
                break;
            case 'dessert':
                if (dessertSelect) dessertSelect.appendChild(option);
                break;
        }
    });
    
    // Заполняем select комбо
    if (comboSelect) {
        lunchCombos.forEach((combo, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${combo.name} - ${combo.price}₽`;
            comboSelect.appendChild(option);
        });
    }
}

// Функция для инициализации выбора комбо
function initializeComboSelection() {
    const variantCards = document.querySelectorAll('.variant-card');
    const comboSelectionInfo = document.getElementById('combo-selection-info');
    const selectedComboName = document.getElementById('selected-combo-name');
    const comboIncludedItems = document.getElementById('combo-included-items');
    const selectedComboDisplay = document.getElementById('selected-combo-display');
    const orderSummaryInfo = document.getElementById('order-summary-info');
    const summaryComboName = document.getElementById('summary-combo-name');
    const summaryComboItems = document.getElementById('summary-combo-items');
    const comboSelect = document.querySelector('select[name="combo"]');
    
    variantCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            // Проверяем, что массив dishes загружен
            if (!dishes || dishes.length === 0) {
                showNotification('Меню еще не загружено. Пожалуйста, подождите.');
                return;
            }
            
            // Убираем выделение со всех карточек комбо
            variantCards.forEach(c => c.classList.remove('selected'));
            
            // Добавляем выделение выбранной карточке
            this.classList.add('selected');
            
            // Выбираем комбо
            selectCombo(index);
            
            // Получаем комбо
            const combo = lunchCombos[index];
            
            // Формируем список блюд для отображения
            let itemsList = '';
            combo.dishes.forEach((dishItem, i) => {
                const dish = dishes.find(d => d.keyword === dishItem.keyword);
                if (dish) {
                    itemsList += `${dish.name}`;
                    if (i < combo.dishes.length - 1) itemsList += ', ';
                }
            });
            
            // Обновляем информацию о выбранном комбо
            if (comboSelectionInfo) {
                comboSelectionInfo.style.display = 'block';
                if (selectedComboName) selectedComboName.textContent = combo.name;
                if (comboIncludedItems) {
                    comboIncludedItems.innerHTML = `<strong>Состав:</strong> ${itemsList}<br><strong>Стоимость комбо:</strong> ${combo.price}₽`;
                }
            }
            
            // Обновляем информацию в форме заказа
            if (selectedComboDisplay) {
                selectedComboDisplay.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <strong>${combo.name}</strong>
                        <small style="color: #666; margin-top: 5px;">${combo.description}</small>
                        <small style="color: tomato; margin-top: 5px; font-weight: bold;">Стоимость: ${combo.price}₽</small>
                    </div>
                `;
            }
            
            // Обновляем краткую информацию о заказе
            if (orderSummaryInfo) {
                orderSummaryInfo.style.display = 'block';
                if (summaryComboName) summaryComboName.textContent = combo.name;
                if (summaryComboItems) {
                    summaryComboItems.innerHTML = `${combo.description}<br><span style="color: tomato; font-weight: bold;">Стоимость: ${combo.price}₽</span>`;
                }
            }
            
            // Обновляем select комбо
            if (comboSelect) {
                comboSelect.value = index;
            }
        });
    });
    
    // Добавляем обработчик изменения select комбо
    if (comboSelect) {
        comboSelect.addEventListener('change', function() {
            if (this.value) {
                const comboIndex = parseInt(this.value);
                if (!isNaN(comboIndex) && comboIndex >= 0 && comboIndex < lunchCombos.length) {
                    // Убираем выделение со всех карточек комбо
                    variantCards.forEach(c => c.classList.remove('selected'));
                    
                    // Добавляем выделение соответствующей карточке
                    if (variantCards[comboIndex]) {
                        variantCards[comboIndex].classList.add('selected');
                    }
                    
                    // Выбираем комбо
                    selectCombo(comboIndex);
                    
                    // Получаем комбо
                    const combo = lunchCombos[comboIndex];
                    
                    // Формируем список блюд для отображения
                    let itemsList = '';
                    combo.dishes.forEach((dishItem, i) => {
                        const dish = dishes.find(d => d.keyword === dishItem.keyword);
                        if (dish) {
                            itemsList += `${dish.name}`;
                            if (i < combo.dishes.length - 1) itemsList += ', ';
                        }
                    });
                    
                    // Обновляем информацию о выбранном комбо
                    if (comboSelectionInfo) {
                        comboSelectionInfo.style.display = 'block';
                        if (selectedComboName) selectedComboName.textContent = combo.name;
                        if (comboIncludedItems) {
                            comboIncludedItems.innerHTML = `<strong>Состав:</strong> ${itemsList}<br><strong>Стоимость комбо:</strong> ${combo.price}₽`;
                        }
                    }
                    
                    // Обновляем информацию в форме заказа
                    if (selectedComboDisplay) {
                        selectedComboDisplay.innerHTML = `
                            <div style="display: flex; flex-direction: column; align-items: center;">
                                <strong>${combo.name}</strong>
                                <small style="color: #666; margin-top: 5px;">${combo.description}</small>
                                <small style="color: tomato; margin-top: 5px; font-weight: bold;">Стоимость: ${combo.price}₽</small>
                            </div>
                        `;
                    }
                    
                    // Обновляем краткую информацию о заказе
                    if (orderSummaryInfo) {
                        orderSummaryInfo.style.display = 'block';
                        if (summaryComboName) summaryComboName.textContent = combo.name;
                        if (summaryComboItems) {
                            summaryComboItems.innerHTML = `${combo.description}<br><span style="color: tomato; font-weight: bold;">Стоимость: ${combo.price}₽</span>`;
                        }
                    }
                }
            } else {
                // Если select очищен, сбрасываем комбо
                resetCombo();
            }
        });
    }
}

// Функция для обработки отправки формы
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Проверяем валидность заказа
    const validation = validateOrder();
    
    if (!validation.isValid) {
        // Показываем уведомление с ошибкой
        showNotification(validation.message);
        return;
    }
    
    // Если заказ валиден, продолжаем обработку
    // Собираем данные формы
    const formData = new FormData();
    
    // Добавляем информацию о выбранном комбо
    if (selectedDishes.combo !== null) {
        formData.append('combo', selectedDishes.combo.name);
        formData.append('combo_price', selectedDishes.combo.price);
    }
    
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
    let orderInfo = 'ВАШ ЗАКАЗ УСПЕШНО ОФОРМЛЕН!\n\n';
    
    if (selectedDishes.combo !== null) {
        orderInfo += `Комбо: ${selectedDishes.combo.name}\n`;
        orderInfo += `Состав: ${selectedDishes.combo.description}\n`;
        orderInfo += `Стоимость комбо: ${selectedDishes.combo.price}₽\n\n`;
    } else {
        orderInfo += `Собранный набор:\n\n`;
        if (selectedDishes.soup) orderInfo += `Суп: ${selectedDishes.soup.name} - ${selectedDishes.soup.price}₽\n`;
        if (selectedDishes.main) orderInfo += `Главное блюдо: ${selectedDishes.main.name} - ${selectedDishes.main.price}₽\n`;
        if (selectedDishes.salad) orderInfo += `Салат: ${selectedDishes.salad.name} - ${selectedDishes.salad.price}₽\n`;
        if (selectedDishes.drink) orderInfo += `Напиток: ${selectedDishes.drink.name} - ${selectedDishes.drink.price}₽\n`;
    }
    
    if (selectedDishes.dessert) orderInfo += `Десерт: ${selectedDishes.dessert.name} - ${selectedDishes.dessert.price}₽\n`;
    
    const total = Object.values(selectedDishes).reduce((sum, dish) => {
        if (dish) {
            return sum + (typeof dish === 'object' && 'price' in dish ? dish.price : 0);
        }
        return sum;
    }, 0);
    
    orderInfo += `\nОбщая стоимость: ${total}₽\n\n`;
    orderInfo += `Данные для доставки:\nИмя: ${customerName}\nТелефон: ${customerPhone}\nАдрес: ${customerAddress}\n\n`;
    orderInfo += `Спасибо за заказ! Ожидайте доставку в ближайшее время.`;
    
    alert(orderInfo);
    
    // В реальном приложении здесь был бы AJAX запрос на сервер
    console.log('Данные формы:', Object.fromEntries(formData));
    
    // Сбрасываем форму после успешной отправки
    resetSelection();
    document.getElementById('order-form').reset();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Начинаем загрузку данных о блюдах...');
    
    try {
        // Ждем загрузки блюд из API
        await loadDishes();
        console.log(`Загружено ${dishes.length} блюд`);
        
        // Рассчитываем цены комбо
        calculateComboPrices();
        
        // Отображаем все блюда
        displayAllDishes();
        
        // Инициализируем фильтры
        initializeFilters();
        
        // Инициализируем выбор комбо
        initializeComboSelection();
        
        // Заполняем select элементы
        populateSelects();
        
        // Добавляем обработчик для кнопки сброса
        const resetBtn = document.querySelector('.reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetSelection);
        }
        
        // Добавляем обработчик для отправки формы
        const orderForm = document.getElementById('order-form');
        if (orderForm) {
            orderForm.addEventListener('submit', handleFormSubmit);
        }
        
        // Добавляем обработчики для select элементов
        const selects = document.querySelectorAll('.order-summary select');
        selects.forEach(select => {
            select.addEventListener('change', function() {
                if (this.value) {
                    if (this.name === 'combo') {
                        const comboIndex = parseInt(this.value);
                        if (!isNaN(comboIndex) && comboIndex >= 0 && comboIndex < lunchCombos.length) {
                            selectCombo(comboIndex);
                        }
                    } else {
                        const selectedDish = dishes.find(dish => dish.keyword === this.value);
                        if (selectedDish) {
                            selectDish(selectedDish);
                        }
                    }
                } else {
                    // Если значение очищено
                    if (this.name === 'combo') {
                        resetCombo();
                    } else {
                        const category = this.name;
                        const categoryMap = {
                            'soup': 'soup',
                            'main': 'main',
                            'salad': 'salad',
                            'drink': 'drink',
                            'dessert': 'dessert'
                        };
                        
                        if (categoryMap[category]) {
                            selectedDishes[categoryMap[category]] = null;
                            
                            // Убираем выделение со всех карточек в этой категории
                            const allCards = document.querySelectorAll(`.${categoryMap[category]}s-section .dish-card`);
                            allCards.forEach(card => {
                                card.classList.remove('selected');
                                const button = card.querySelector('.dish-btn');
                                if (button) button.textContent = 'Добавить';
                            });
                            
                            updateOrderTotal();
                        }
                    }
                }
            });
        });
        
        console.log('Инициализация завершена успешно');
        
    } catch (error) {
        console.error('Ошибка при инициализации:', error);
        showNotification('Произошла ошибка при загрузке меню. Пожалуйста, обновите страницу.');
    }
});