// lunch-script.js - полностью рабочий скрипт для страницы "Собрать ланч"

// Ключ для хранения заказа в localStorage
const ORDER_STORAGE_KEY = 'food_delivery_order';

// Объект для хранения выбранных блюд
let selectedDishes = {
    dishes: [],    // отдельные блюда
    combo: null    // комбо (если выбрано)
};

// Объект для хранения активных фильтров
let activeFilters = {
    soup: 'all',
    main: 'all',
    salad: 'all',
    drink: 'all',
    dessert: 'all'
};

// Соответствие названий блюд их keyword из dishes.js
const dishNameToKeyword = {
    // Супы
    'Томатный суп': 'tomato_soup',
    'Куриный суп с лапшой': 'chicken_soup',
    'Грибной крем-суп': 'mushroom_cream_soup',
    'Уха по-фински': 'fish_soup',
    'Борщ с говядиной': 'borscht',
    'Тыквенный крем-суп': 'pumpkin_soup',
    
    // Главные блюда
    'Паста Карбонара': 'pasta_carbonara',
    'Куриные котлеты с пюре': 'chicken_cutlets',
    'Овощной рататуй с сыром': 'vegetable_ratatouille',
    'Лосось на гриле': 'grilled_salmon',
    'Бефстроганов': 'beef_stroganoff',
    'Овощное карри': 'vegetable_curry',
    
    // Салаты
    'Цезарь с курицей': 'caesar_salad',
    'Салат с креветками': 'shrimp_salad',
    'Греческий салат': 'greek_salad',
    'Капрезе': 'caprese_salad',
    'Овощной салат': 'vegetable_salad',
    'Фруктовый салат': 'fruit_salad',
    
    // Напитки
    'Апельсиновый сок': 'orange_juice',
    'Яблочный сок': 'apple_juice',
    'Морковный сок': 'carrot_juice',
    'Зеленый чай': 'green_tea',
    'Черный чай': 'black_tea',
    'Кофе американо': 'coffee',
    
    // Десерты
    'Тирамису': 'tiramisu',
    'Чизкейк Нью-Йорк': 'cheesecake',
    'Шоколадный торт': 'chocolate_cake',
    'Яблочный пирог': 'apple_pie',
    'Мороженое пломбир': 'ice_cream',
    'Торт Наполеон': 'napoleon_cake'
};

// ==================== ФУНКЦИИ ДЛЯ РАБОТЫ С ЗАКАЗОМ ====================

// Функция для сохранения заказа в localStorage
function saveOrderToLocalStorage() {
    try {
        // Подготавливаем данные для сохранения
        const orderToSave = {
            combo: selectedDishes.combo ? {
                name: selectedDishes.combo.name,
                description: selectedDishes.combo.description,
                price: selectedDishes.combo.price,
                dishes: selectedDishes.combo.dishes
            } : null,
            dishes: selectedDishes.dishes.map(dish => ({
                keyword: dish.keyword,
                category: dish.category,
                name: dish.name,
                price: dish.price,
                image: dish.image,
                count: dish.count,
                kind: dish.kind
            }))
        };
        
        // Сохраняем в localStorage
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orderToSave));
        console.log('✅ Заказ сохранен в localStorage:', orderToSave);
        return true;
    } catch (error) {
        console.error('❌ Ошибка при сохранении заказа:', error);
        showNotification('Ошибка сохранения заказа', 'error');
        return false;
    }
}

// Функция для загрузки заказа из localStorage
function loadOrderFromLocalStorage() {
    try {
        const savedOrder = localStorage.getItem(ORDER_STORAGE_KEY);
        if (!savedOrder) {
            console.log('ℹ️ Нет сохраненного заказа');
            return null;
        }
        return JSON.parse(savedOrder);
    } catch (error) {
        console.error('❌ Ошибка при загрузке заказа:', error);
        return null;
    }
}

// Функция для восстановления заказа из localStorage
function restoreOrderFromLocalStorage() {
    if (!window.dishes || window.dishes.length === 0) {
        console.log('⏳ Блюда еще не загружены, ждем...');
        setTimeout(restoreOrderFromLocalStorage, 100);
        return;
    }
    
    const savedOrder = loadOrderFromLocalStorage();
    if (!savedOrder) return;
    
    console.log('🔄 Восстанавливаем заказ из localStorage:', savedOrder);
    
    // Сбрасываем текущий выбор
    selectedDishes.dishes = [];
    selectedDishes.combo = null;
    
    // Восстанавливаем комбо
    if (savedOrder.combo && window.lunchCombos) {
        const combo = window.lunchCombos.find(c => c.name === savedOrder.combo.name);
        if (combo) {
            selectedDishes.combo = combo;
            console.log('✅ Восстановлено комбо:', combo.name);
            
            // Обновляем UI комбо
            updateComboSelectionUI();
        }
    }
    
    // Восстанавливаем отдельные блюда
    if (savedOrder.dishes && savedOrder.dishes.length > 0) {
        savedOrder.dishes.forEach(dishData => {
            const dish = window.dishes.find(d => d.keyword === dishData.keyword);
            if (dish) {
                selectedDishes.dishes.push(dish);
                console.log(`✅ Восстановлено блюдо: ${dish.name}`);
            }
        });
    }
    
    // Обновляем интерфейс
    updateDishButtonsUI();
    updateOrderPanelUI();
}

// ==================== ФУНКЦИИ ДЛЯ РАБОТЫ С БЛЮДАМИ ====================

// Функция для добавления/удаления блюда
function toggleDishSelection(dish) {
    if (!window.dishes || window.dishes.length === 0) {
        showNotification('Меню еще не загружено', 'error');
        return;
    }
    
    console.log(`🔄 Обработка блюда: ${dish.name}`);
    
    // Проверяем, выбрано ли уже это блюдо
    const dishIndex = selectedDishes.dishes.findIndex(d => d.keyword === dish.keyword);
    
    if (dishIndex > -1) {
        // Удаляем блюдо из выбранных
        selectedDishes.dishes.splice(dishIndex, 1);
        showNotification(`🗑️ Удалено: ${dish.name}`, 'info');
        console.log(`✅ Удалено блюдо: ${dish.name}`);
    } else {
        // Добавляем блюдо в выбранные
        selectedDishes.dishes.push(dish);
        showNotification(`✅ Добавлено: ${dish.name}`, 'success');
        console.log(`✅ Добавлено блюдо: ${dish.name}`);
    }
    
    // Обновляем интерфейс
    updateDishButtonsUI();
    saveOrderToLocalStorage();
    updateOrderPanelUI();
}

// Функция для обновления кнопок блюд
function updateDishButtonsUI() {
    if (!window.dishes || window.dishes.length === 0) {
        console.log('⚠️ Блюда не загружены, кнопки не обновлены');
        return;
    }
    
    console.log('🔄 Обновление кнопок блюд...');
    
    // Находим все кнопки "Добавить/Удалить"
    const dishButtons = document.querySelectorAll('.dish-btn');
    let updatedCount = 0;
    
    dishButtons.forEach(button => {
        const dishCard = button.closest('.dish-card');
        if (!dishCard) return;
        
        const dishName = dishCard.querySelector('.name').textContent;
        const keyword = dishNameToKeyword[dishName];
        
        if (keyword) {
            const dish = window.dishes.find(d => d.keyword === keyword);
            if (dish) {
                // Проверяем, выбрано ли это блюдо
                const isSelected = selectedDishes.dishes.some(d => d.keyword === keyword);
                
                // Обновляем текст кнопки
                button.textContent = isSelected ? 'Удалить' : 'Добавить';
                
                // Обновляем класс карточки
                if (isSelected) {
                    dishCard.classList.add('selected');
                } else {
                    dishCard.classList.remove('selected');
                }
                
                // Удаляем старые обработчики и добавляем новые
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // Добавляем обработчик на новую кнопку
                newButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    toggleDishSelection(dish);
                });
                
                // Обработчик клика на всю карточку
                dishCard.addEventListener('click', function(e) {
                    if (!e.target.classList.contains('dish-btn')) {
                        toggleDishSelection(dish);
                    }
                });
                
                updatedCount++;
            }
        }
    });
    
    console.log(`✅ Обновлено кнопок: ${updatedCount}`);
}

// ==================== ФУНКЦИИ ДЛЯ РАБОТЫ С КОМБО ====================

// Функция для добавления/удаления комбо
function toggleComboSelection(comboIndex) {
    if (!window.lunchCombos || !window.lunchCombos[comboIndex]) {
        showNotification('Комбо не найдено', 'error');
        return;
    }
    
    const combo = window.lunchCombos[comboIndex];
    console.log(`🔄 Обработка комбо: ${combo.name}`);
    
    // Проверяем, выбрано ли уже это комбо
    if (selectedDishes.combo && selectedDishes.combo.name === combo.name) {
        // Удаляем комбо
        selectedDishes.combo = null;
        showNotification(`🗑️ Удалено комбо: ${combo.name}`, 'info');
        console.log(`✅ Удалено комбо: ${combo.name}`);
    } else {
        // Добавляем комбо
        selectedDishes.combo = combo;
        showNotification(`✅ Добавлено комбо: ${combo.name}`, 'success');
        console.log(`✅ Добавлено комбо: ${combo.name}`);
    }
    
    // Обновляем интерфейс
    updateComboSelectionUI();
    saveOrderToLocalStorage();
    updateOrderPanelUI();
}

// Функция для обновления UI выбора комбо
function updateComboSelectionUI() {
    const variantCards = document.querySelectorAll('.variant-card');
    const comboInfo = document.getElementById('combo-selection-info');
    const selectedComboName = document.getElementById('selected-combo-name');
    const comboIncludedItems = document.getElementById('combo-included-items');
    
    variantCards.forEach((card, index) => {
        // Сбрасываем выделение у всех карточек
        card.classList.remove('selected');
        
        // Если есть комбо и это оно - выделяем
        if (selectedDishes.combo && window.lunchCombos[index] && 
            window.lunchCombos[index].name === selectedDishes.combo.name) {
            card.classList.add('selected');
            
            // Показываем информацию о комбо
            if (comboInfo && selectedComboName && comboIncludedItems) {
                comboInfo.style.display = 'block';
                selectedComboName.textContent = selectedDishes.combo.name;
                
                // Формируем список блюд в комбо
                let itemsList = '';
                if (window.dishes) {
                    selectedDishes.combo.dishes.forEach((dishItem, i) => {
                        const dish = window.dishes.find(d => d.keyword === dishItem.keyword);
                        if (dish) {
                            itemsList += `${dish.name}`;
                            if (i < selectedDishes.combo.dishes.length - 1) itemsList += ', ';
                        }
                    });
                }
                
                comboIncludedItems.innerHTML = `
                    <strong>Состав:</strong> ${itemsList}<br>
                    <strong>Стоимость:</strong> ${selectedDishes.combo.price}₽
                `;
            }
        }
    });
    
    // Если комбо не выбрано - скрываем информацию
    if (comboInfo && !selectedDishes.combo) {
        comboInfo.style.display = 'none';
    }
}

// Функция для инициализации кнопок комбо
function initializeComboButtons() {
    console.log('🔄 Инициализация кнопок комбо...');
    
    const variantCards = document.querySelectorAll('.variant-card');
    
    variantCards.forEach((card, index) => {
        // Удаляем старые обработчики
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        
        // Добавляем новый обработчик
        newCard.addEventListener('click', function() {
            toggleComboSelection(index);
        });
    });
    
    console.log(`✅ Инициализировано кнопок комбо: ${variantCards.length}`);
}

// ==================== ФУНКЦИИ ДЛЯ РАБОТЫ С ФИЛЬТРАМИ ====================

// Функция для инициализации фильтров
function initializeFilters() {
    console.log('🔄 Инициализация фильтров...');
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        // Удаляем старые обработчики
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Добавляем новый обработчик
        newButton.addEventListener('click', function() {
            const section = this.closest('section');
            if (!section) return;
            
            // Определяем категорию по классу секции
            let category = '';
            if (section.classList.contains('soups-section')) category = 'soup';
            else if (section.classList.contains('main-courses-section')) category = 'main';
            else if (section.classList.contains('salads-section')) category = 'salad';
            else if (section.classList.contains('drinks-section')) category = 'drink';
            else if (section.classList.contains('desserts-section')) category = 'dessert';
            
            if (!category) return;
            
            const filterKind = this.getAttribute('data-kind');
            
            // Убираем активный класс со всех кнопок в секции
            const sectionFilters = section.querySelectorAll('.filter-btn');
            sectionFilters.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс нажатой кнопке
            this.classList.add('active');
            
            // Сохраняем активный фильтр
            activeFilters[category] = filterKind;
            
            // Применяем фильтр
            applyFilter(category, filterKind);
            
            console.log(`✅ Применен фильтр: ${filterKind} для ${category}`);
        });
    });
    
    console.log('✅ Фильтры инициализированы');
}

// Функция для применения фильтра
function applyFilter(category, filterKind) {
    if (!window.dishes || window.dishes.length === 0) {
        console.log('⚠️ Блюда не загружены, фильтрация невозможна');
        return;
    }
    
    // Определяем секцию по категории
    let sectionClass = '';
    switch(category) {
        case 'soup': sectionClass = 'soups-section'; break;
        case 'main': sectionClass = 'main-courses-section'; break;
        case 'salad': sectionClass = 'salads-section'; break;
        case 'drink': sectionClass = 'drinks-section'; break;
        case 'dessert': sectionClass = 'desserts-section'; break;
        default: return;
    }
    
    const section = document.querySelector(`.${sectionClass}`);
    if (!section) return;
    
    const dishesGrid = section.querySelector('.dishes-grid');
    if (!dishesGrid) return;
    
    const allCards = dishesGrid.querySelectorAll('.dish-card');
    let visibleCount = 0;
    
    allCards.forEach(card => {
        const dishName = card.querySelector('.name').textContent;
        const keyword = dishNameToKeyword[dishName];
        
        if (keyword) {
            const dish = window.dishes.find(d => d.keyword === keyword && d.category === category);
            
            if (dish) {
                if (filterKind === 'all' || dish.kind === filterKind) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            } else {
                card.style.display = 'flex';
                visibleCount++;
            }
        } else {
            card.style.display = 'flex';
            visibleCount++;
        }
    });
    
    console.log(`✅ Фильтр "${filterKind}" для "${category}": показано ${visibleCount} из ${allCards.length}`);
}

// ==================== ФУНКЦИИ ДЛЯ ПАНЕЛИ ЗАКАЗА ====================

// Функция для обновления панели заказа
function updateOrderPanelUI() {
    const orderPanel = document.getElementById('order-panel');
    const currentOrderTotal = document.getElementById('current-order-total');
    const checkoutLink = document.getElementById('checkout-link');
    const validationStatus = document.getElementById('order-validation-status');
    
    if (!orderPanel || !currentOrderTotal || !checkoutLink) {
        console.log('⚠️ Элементы панели заказа не найдены');
        return;
    }
    
    // Рассчитываем общую стоимость
    let total = 0;
    
    // Добавляем стоимость комбо
    if (selectedDishes.combo) {
        total += selectedDishes.combo.price;
    }
    
    // Добавляем стоимость отдельных блюд
    selectedDishes.dishes.forEach(dish => {
        total += dish.price;
    });
    
    // Обновляем отображение стоимости
    currentOrderTotal.textContent = total;
    
    // Проверяем, есть ли заказ
    const hasOrder = selectedDishes.combo !== null || selectedDishes.dishes.length > 0;
    
    if (hasOrder) {
        // Показываем панель заказа
        orderPanel.style.display = 'block';
        
        // Активируем кнопку оформления
        checkoutLink.classList.remove('disabled');
        checkoutLink.style.pointerEvents = 'auto';
        checkoutLink.style.opacity = '1';
        checkoutLink.href = "checkout.html";
        
        // Обновляем статус
        const itemCount = selectedDishes.dishes.length + (selectedDishes.combo ? 1 : 0);
        validationStatus.textContent = `В заказе: ${itemCount} позиций на сумму ${total}₽`;
        validationStatus.style.color = '#4CAF50';
        
        console.log(`✅ Панель заказа: ${itemCount} позиций, ${total}₽`);
    } else {
        // Скрываем панель заказа
        orderPanel.style.display = 'none';
        console.log('ℹ️ Панель заказа скрыта - заказ пуст');
    }
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
    // Удаляем старые уведомления
    document.querySelectorAll('.custom-notification').forEach(el => el.remove());
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    
    const bgColor = type === 'success' ? '#4CAF50' : 
                   type === 'error' ? '#f44336' : '#2196F3';
    
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            font-weight: 500;
            max-width: 300px;
        ">
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Функция для сброса всего заказа
function resetOrder() {
    console.log('🔄 Сброс заказа...');
    
    // Сбрасываем данные
    selectedDishes.dishes = [];
    selectedDishes.combo = null;
    
    // Сбрасываем фильтры
    activeFilters = {
        soup: 'all',
        main: 'all',
        salad: 'all',
        drink: 'all',
        dessert: 'all'
    };
    
    // Обновляем UI
    updateDishButtonsUI();
    updateComboSelectionUI();
    
    // Сбрасываем кнопки фильтров
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.getAttribute('data-kind') === 'all') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Показываем все блюда
    document.querySelectorAll('.dish-card').forEach(card => {
        card.style.display = 'flex';
    });
    
    // Очищаем localStorage
    localStorage.removeItem(ORDER_STORAGE_KEY);
    
    // Обновляем панель заказа
    updateOrderPanelUI();
    
    // Показываем уведомление
    showNotification('Весь заказ сброшен', 'info');
    
    console.log('✅ Заказ сброшен');
}

// ==================== ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ ====================

// Основная функция инициализации
function initializePage() {
    console.log('🚀 Инициализация страницы...');
    
    // 1. Инициализируем фильтры
    initializeFilters();
    
    // 2. Инициализируем кнопки комбо
    initializeComboButtons();
    
    // 3. Обновляем кнопки блюд
    updateDishButtonsUI();
    
    // 4. Восстанавливаем заказ из localStorage
    restoreOrderFromLocalStorage();
    
    // 5. Обновляем панель заказа
    updateOrderPanelUI();
    
    // 6. Настраиваем кнопку сброса
    const resetBtn = document.querySelector('.reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetOrder);
        console.log('✅ Кнопка сброса подключена');
    }
    
    // 7. Настраиваем кнопку оформления
    const checkoutLink = document.getElementById('checkout-link');
    if (checkoutLink) {
        checkoutLink.addEventListener('click', function(e) {
            if (!selectedDishes.combo && selectedDishes.dishes.length === 0) {
                e.preventDefault();
                showNotification('Выберите блюда для заказа!', 'error');
            }
        });
        console.log('✅ Кнопка оформления подключена');
    }
    
    console.log('✅ Инициализация завершена');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM загружен, начинаем инициализацию...');
    
    // Показываем уведомление о загрузке
    showNotification('Загрузка меню...', 'info');
    
    // Ожидаем загрузки блюд
    const maxWaitTime = 5000; // 5 секунд максимум
    const startTime = Date.now();
    
    const checkDishesLoaded = setInterval(function() {
        const elapsedTime = Date.now() - startTime;
        
        if (window.dishes !== undefined && window.dishes.length > 0) {
            clearInterval(checkDishesLoaded);
            console.log('✅ Блюда загружены, инициализируем страницу...');
            showNotification('Меню загружено!', 'success');
            setTimeout(initializePage, 100);
        } else if (elapsedTime > maxWaitTime) {
            clearInterval(checkDishesLoaded);
            console.log('⚠️ Таймаут загрузки блюд, используем локальные данные...');
            
            if (typeof getLocalDishes === 'function') {
                window.dishes = getLocalDishes();
                console.log(`✅ Локальные блюда загружены: ${window.dishes.length} блюд`);
                showNotification('Используем локальное меню', 'info');
                setTimeout(initializePage, 100);
            } else {
                console.error('❌ Не могу загрузить блюда');
                showNotification('Ошибка загрузки меню', 'error');
            }
        }
    }, 100);
    
    // Слушаем событие загрузки блюд
    document.addEventListener('dishesLoaded', function() {
        console.log('🎉 Событие dishesLoaded получено');
        clearInterval(checkDishesLoaded);
        setTimeout(initializePage, 100);
    });
});

// Добавляем стили для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    /* Стили для фильтров */
    .filter-btn.active {
        background-color: tomato !important;
        color: white !important;
        border-color: tomato !important;
    }
    
    /* Стили для выбранных блюд */
    .dish-card.selected {
        border: 2px solid tomato !important;
    }
    
    .dish-card.selected .dish-btn {
        background-color: tomato !important;
        color: white !important;
    }
    
    /* Стили для выбранных комбо */
    .variant-card.selected {
        border: 2px solid tomato !important;
        box-shadow: 0 6px 20px rgba(255, 99, 71, 0.2) !important;
    }
    
    /* Гарантируем, что фильтрация работает */
    .dish-card[style*="display: none"] {
        display: none !important;
    }
`;
document.head.appendChild(style);