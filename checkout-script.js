// checkout-script.js - полностью рабочий скрипт для страницы "Оформить заказ"

// Ключи для хранения в localStorage
const ORDER_STORAGE_KEY = 'food_delivery_order';
const ORDERS_STORAGE_KEY = 'food_delivery_orders';
const CURRENT_USER_KEY = 'current_user';

// Текущий пользователь
let currentUser = {
    id: 'user_' + Date.now(),
    name: '',
    email: '',
    phone: ''
};

// Инициализация текущего пользователя
function initCurrentUser() {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
        } catch (error) {
            console.error('❌ Ошибка при загрузке пользователя:', error);
            createDefaultUser();
        }
    } else {
        createDefaultUser();
    }
    console.log('👤 Текущий пользователь:', currentUser);
}

// Создание пользователя по умолчанию
function createDefaultUser() {
    currentUser = {
        id: 'user_' + Date.now(),
        name: '',
        email: '',
        phone: ''
    };
}

// Загрузить заказ из localStorage
function loadOrderFromLocalStorage() {
    try {
        const savedOrder = localStorage.getItem(ORDER_STORAGE_KEY);
        if (!savedOrder) {
            console.log('🛒 Нет сохраненного заказа в localStorage');
            return null;
        }
        const parsed = JSON.parse(savedOrder);
        console.log('📦 Загружен заказ из localStorage:', parsed);
        return parsed;
    } catch (error) {
        console.error('❌ Ошибка при загрузке заказа:', error);
        return null;
    }
}

// Удалить блюдо из заказа
function removeDishFromOrder(category, identifier) {
    try {
        const savedOrder = loadOrderFromLocalStorage();
        if (!savedOrder) return;
        
        console.log('🗑️ Удаление:', category, identifier);
        
        if (category === 'combo') {
            // Удаляем комбо
            savedOrder.combo = null;
        } else {
            // Удаляем отдельное блюдо
            if (!savedOrder.dishes || savedOrder.dishes.length === 0) return;
            
            const dishIndex = savedOrder.dishes.findIndex(dish => 
                dish.keyword === identifier
            );
            
            if (dishIndex !== -1) {
                savedOrder.dishes.splice(dishIndex, 1);
            }
        }
        
        // Проверяем, остались ли блюда
        const hasCombo = savedOrder.combo !== null;
        const hasDishes = savedOrder.dishes && savedOrder.dishes.length > 0;
        
        if (!hasCombo && !hasDishes) {
            localStorage.removeItem(ORDER_STORAGE_KEY);
            console.log('✅ Корзина полностью очищена');
        } else {
            localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(savedOrder));
            console.log('💾 Заказ обновлен в localStorage');
        }
        
        // Перезагружаем отображение
        loadAndDisplayOrder();
        
    } catch (error) {
        console.error('❌ Ошибка при удалении блюда:', error);
        showNotification('Ошибка при удалении блюда', 'error');
    }
}

// Изменить количество блюда
function updateDishQuantity(identifier, newQuantity, isCombo = false) {
    try {
        const savedOrder = loadOrderFromLocalStorage();
        if (!savedOrder) return;
        
        console.log('🔄 Изменение количества:', identifier, newQuantity, isCombo);
        
        if (isCombo) {
            // Обновляем количество комбо
            if (savedOrder.combo && savedOrder.combo.name === identifier) {
                savedOrder.combo.quantity = newQuantity;
            }
        } else {
            // Обновляем количество отдельного блюда
            const dish = savedOrder.dishes.find(d => d.keyword === identifier);
            if (dish) {
                dish.quantity = newQuantity;
            }
        }
        
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(savedOrder));
        console.log('✅ Количество обновлено в localStorage');
        
        // Перезагружаем отображение
        loadAndDisplayOrder();
        
    } catch (error) {
        console.error('❌ Ошибка при изменении количества:', error);
        showNotification('Ошибка при изменении количества', 'error');
    }
}

// Загрузить и отобразить заказ
async function loadAndDisplayOrder() {
    try {
        console.log('🔄 Загрузка и отображение заказа...');
        
        // Ждем загрузки блюд (если функция есть)
        if (typeof loadDishes === 'function') {
            console.log('🍽️ Загружаем блюда...');
            await loadDishes();
        }
        
        // Загружаем заказ из localStorage
        const savedOrder = loadOrderFromLocalStorage();
        
        if (!savedOrder || (!savedOrder.combo && (!savedOrder.dishes || savedOrder.dishes.length === 0))) {
            console.log('🛒 Корзина пуста, показываем сообщение');
            showEmptyOrderMessage();
            return;
        }
        
        console.log('✅ Отображаем заказ:', savedOrder);
        
        // Отображаем заказ
        displayOrderItems(savedOrder);
        
    } catch (error) {
        console.error('❌ Ошибка при загрузке заказа:', error);
        showEmptyOrderMessage();
    }
}

// Показать сообщение о пустом заказе
function showEmptyOrderMessage() {
    const orderItemsGrid = document.getElementById('order-items-grid');
    const emptyOrderMessage = document.getElementById('empty-order-message');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (orderItemsGrid) {
        orderItemsGrid.innerHTML = '';
        orderItemsGrid.style.display = 'none';
    }
    
    if (checkoutTotal) {
        checkoutTotal.textContent = '0₽';
    }
    
    if (emptyOrderMessage) {
        emptyOrderMessage.style.display = 'block';
        emptyOrderMessage.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <p style="font-size: 18px; margin-bottom: 10px;">🛒 Ваша корзина пуста</p>
                <p style="margin-bottom: 20px;">Вы еще не выбрали ни одного блюда</p>
                <a href="lunch.html" style="display: inline-block; background: tomato; color: white; 
                   padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 500;">
                   Перейти к выбору блюд
                </a>
            </div>
        `;
    }
}

// Отобразить элементы заказа
function displayOrderItems(savedOrder) {
    const orderItemsGrid = document.getElementById('order-items-grid');
    const emptyOrderMessage = document.getElementById('empty-order-message');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (!orderItemsGrid) {
        console.error('❌ Не найден элемент #order-items-grid');
        return;
    }
    
    // Очищаем и показываем контейнер
    orderItemsGrid.innerHTML = '';
    orderItemsGrid.style.display = 'flex';
    orderItemsGrid.style.flexDirection = 'column';
    orderItemsGrid.style.gap = '15px';
    
    if (emptyOrderMessage) {
        emptyOrderMessage.style.display = 'none';
    }
    
    let totalPrice = 0;
    let totalItems = 0;
    let orderDishes = [];
    
    // Отображаем комбо если есть
    if (savedOrder.combo) {
        console.log('📦 Добавляем комбо в отображение:', savedOrder.combo);
        const comboCard = createComboCard(savedOrder.combo);
        orderItemsGrid.appendChild(comboCard);
        const comboQuantity = savedOrder.combo.quantity || 1;
        const comboTotal = savedOrder.combo.price * comboQuantity;
        totalPrice += comboTotal;
        totalItems += comboQuantity;
        
        // Добавляем комбо в список блюд для сохранения
        if (window.lunchCombos) {
            const combo = window.lunchCombos.find(c => c.name === savedOrder.combo.name);
            if (combo) {
                // Добавляем каждое блюдо из комбо
                combo.dishes.forEach(dishItem => {
                    const dish = window.dishes.find(d => d.keyword === dishItem.keyword);
                    if (dish) {
                        orderDishes.push({
                            name: dish.name,
                            price: dish.price,
                            quantity: comboQuantity
                        });
                    }
                });
            }
        }
    }
    
    // Отображаем отдельные блюда если есть
    if (savedOrder.dishes && savedOrder.dishes.length > 0) {
        console.log(`🍽️ Добавляем ${savedOrder.dishes.length} блюд в отображение`);
        savedOrder.dishes.forEach(dishData => {
            const dishCard = createOrderDishCard(dishData);
            orderItemsGrid.appendChild(dishCard);
            const quantity = dishData.quantity || 1;
            const dishTotal = dishData.price * quantity;
            totalPrice += dishTotal;
            totalItems += quantity;
            
            // Добавляем блюдо в список для сохранения
            orderDishes.push({
                name: dishData.name,
                price: dishData.price,
                quantity: quantity
            });
        });
    }
    
    // Если нет ни одного блюда
    if (totalItems === 0) {
        console.log('ℹ️ Нет элементов для отображения');
        showEmptyOrderMessage();
        return;
    }
    
    // Обновляем общую стоимость
    if (checkoutTotal) {
        checkoutTotal.textContent = `${totalPrice}₽`;
        console.log(`💰 Общая стоимость: ${totalPrice}₽, всего позиций: ${totalItems}`);
    }
    
    // Сохраняем информацию о блюдах для оформления заказа
    window.currentOrderDishes = orderDishes;
    window.currentOrderTotal = totalPrice;
    
    console.log(`✅ Отображено заказов: ${totalItems} позиций`);
}

// Создать карточку блюда
function createOrderDishCard(dishData) {
    const quantity = dishData.quantity || 1;
    const totalPrice = dishData.price * quantity;
    
    const dishCard = document.createElement('div');
    dishCard.className = 'order-dish-card';
    
    // Проверяем URL изображения
    let imageUrl = dishData.image;
    if (!imageUrl || imageUrl.includes('undefined') || imageUrl.includes('null')) {
        imageUrl = 'https://via.placeholder.com/80x80/FFA726/FFFFFF?text=Блюдо';
    }
    
    dishCard.innerHTML = `
        <img src="${imageUrl}" alt="${dishData.name}" loading="lazy" 
             onerror="this.src='https://via.placeholder.com/80x80/FFA726/FFFFFF?text=Блюдо'">
        <div class="dish-info">
            <p class="name">${dishData.name} (x${quantity})</p>
            <p class="description">${dishData.category === 'soup' ? 'Суп' : 
                                  dishData.category === 'main' ? 'Главное блюдо' :
                                  dishData.category === 'salad' ? 'Салат' :
                                  dishData.category === 'drink' ? 'Напиток' : 'Десерт'}</p>
            <p class="count">${dishData.count || 'Порция'}</p>
            <div class="quantity-controls" style="margin-top: 8px;">
                <button type="button" class="quantity-btn minus-btn" style="padding: 3px 8px; font-size: 12px;">-</button>
                <span style="margin: 0 8px; font-size: 14px;">${quantity} шт</span>
                <button type="button" class="quantity-btn plus-btn" style="padding: 3px 8px; font-size: 12px;">+</button>
            </div>
        </div>
        <p class="price">${totalPrice}₽<br><small>(${dishData.price}₽ × ${quantity})</small></p>
        <button type="button" class="remove-btn" data-keyword="${dishData.keyword}">
            ×
        </button>
    `;
    
    // Обработчик удаления
    const removeBtn = dishCard.querySelector('.remove-btn');
    removeBtn.addEventListener('click', function() {
        if (confirm(`Удалить "${dishData.name}" из заказа?`)) {
            removeDishFromOrder('dish', dishData.keyword);
        }
    });
    
    // Обработчики изменения количества
    const minusBtn = dishCard.querySelector('.minus-btn');
    const plusBtn = dishCard.querySelector('.plus-btn');
    
    minusBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (quantity > 1) {
            updateDishQuantity(dishData.keyword, quantity - 1, false);
        }
    });
    
    plusBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        updateDishQuantity(dishData.keyword, quantity + 1, false);
    });
    
    return dishCard;
}

// Создать карточку комбо
function createComboCard(comboData) {
    const quantity = comboData.quantity || 1;
    const totalPrice = comboData.price * quantity;
    
    const comboCard = document.createElement('div');
    comboCard.className = 'order-dish-card combo-card';
    
    // Находим изображение для комбо
    let imageUrl = 'https://via.placeholder.com/80x80/FFA726/FFFFFF?text=Комбо';
    
    // Пробуем найти первое изображение из блюд в комбо
    if (window.dishes && comboData.dishes && comboData.dishes.length > 0) {
        const firstDishKeyword = comboData.dishes[0].keyword;
        const firstDish = window.dishes.find(d => d.keyword === firstDishKeyword);
        if (firstDish && firstDish.image) {
            imageUrl = firstDish.image;
        }
    }
    
    comboCard.innerHTML = `
        <img src="${imageUrl}" alt="${comboData.name}" loading="lazy"
             onerror="this.src='https://via.placeholder.com/80x80/FFA726/FFFFFF?text=Комбо'">
        <div class="dish-info">
            <p class="name">${comboData.name} (x${quantity})</p>
            <p class="description">${comboData.description || 'Комплексный обед'}</p>
            <p class="count">Комбо набор</p>
            <div class="quantity-controls" style="margin-top: 8px;">
                <button type="button" class="quantity-btn minus-btn" style="padding: 3px 8px; font-size: 12px;">-</button>
                <span style="margin: 0 8px; font-size: 14px;">${quantity} шт</span>
                <button type="button" class="quantity-btn plus-btn" style="padding: 3px 8px; font-size: 12px;">+</button>
            </div>
        </div>
        <p class="price">${totalPrice}₽<br><small>(${comboData.price}₽ × ${quantity})</small></p>
        <button type="button" class="remove-btn" data-category="combo" data-name="${comboData.name}">
            ×
        </button>
    `;
    
    // Обработчик удаления
    const removeBtn = comboCard.querySelector('.remove-btn');
    removeBtn.addEventListener('click', function() {
        const comboName = this.getAttribute('data-name');
        if (confirm(`Удалить "${comboName}" из заказа?`)) {
            removeDishFromOrder('combo', comboName);
        }
    });
    
    // Обработчики изменения количества
    const minusBtn = comboCard.querySelector('.minus-btn');
    const plusBtn = comboCard.querySelector('.plus-btn');
    
    minusBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (quantity > 1) {
            updateDishQuantity(comboData.name, quantity - 1, true);
        }
    });
    
    plusBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        updateDishQuantity(comboData.name, quantity + 1, true);
    });
    
    return comboCard;
}

// Функция для проверки загрузки блюд
function waitForDishes() {
    return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 20;
        
        const checkInterval = setInterval(() => {
            attempts++;
            
            if (window.dishes && window.dishes.length > 0) {
                clearInterval(checkInterval);
                console.log('✅ Блюда загружены, продолжаем...');
                resolve(true);
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.log('⚠️ Блюда не загрузились, используем пустой список');
                window.dishes = [];
                resolve(false);
            }
        }, 500);
    });
}

// Сохранить заказ в историю
function saveOrderToHistory(orderData) {
    try {
        // Загружаем существующие заказы
        const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
        let orders = savedOrders ? JSON.parse(savedOrders) : [];
        
        // Генерируем номер заказа
        const nextOrderNumber = orders.length > 0 
            ? Math.max(...orders.map(o => o.orderNumber)) + 1 
            : 1;
        
        // Формируем полный объект заказа
        const newOrder = {
            id: 'order_' + Date.now(),
            orderNumber: nextOrderNumber,
            userId: currentUser.id,
            customer: orderData.name,
            phone: orderData.phone,
            email: orderData.email,
            address: orderData.address,
            dishes: window.currentOrderDishes || [],
            total: window.currentOrderTotal || 0,
            deliveryType: orderData.deliveryTime,
            deliveryTime: orderData.deliveryTime === 'later' ? orderData.deliveryTimeValue : null,
            comment: orderData.comments || '',
            status: 'new',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Добавляем заказ в начало массива
        orders.unshift(newOrder);
        
        // Сохраняем в localStorage
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
        
        console.log('✅ Заказ сохранен в историю:', newOrder);
        return newOrder;
        
    } catch (error) {
        console.error('❌ Ошибка при сохранении заказа в историю:', error);
        return null;
    }
}

// Показать уведомление
function showNotification(message, type = 'info') {
    // Удаляем старые уведомления
    const oldNotifications = document.querySelectorAll('.custom-notification');
    oldNotifications.forEach(n => n.remove());
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    
    // Цвет фона
    const bgColor = type === 'success' ? '#4CAF50' : 
                   type === 'error' ? '#f44336' : 
                   type === 'warning' ? '#ff9800' : '#2196F3';
    
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            font-weight: 500;
            max-width: 300px;
        ">
            ${message}
        </div>
    `;
    
    // Добавляем стили для анимации, если их нет
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Страница оформления заказа загружена');
    
    // Инициализируем текущего пользователя
    initCurrentUser();
    
    try {
        // Ждем загрузки блюд
        await waitForDishes();
        
        // Загружаем и отображаем заказ
        await loadAndDisplayOrder();
        
        // Инициализация управления временем доставки
        const deliveryNow = document.getElementById('delivery-now');
        const deliveryLater = document.getElementById('delivery-later');
        const timePicker = document.getElementById('time-picker');
        
        if (deliveryNow && deliveryLater && timePicker) {
            deliveryNow.addEventListener('change', function() {
                timePicker.style.display = this.checked ? 'none' : 'block';
            });
            
            deliveryLater.addEventListener('change', function() {
                timePicker.style.display = this.checked ? 'block' : 'none';
            });
        }
        
        // Обработчик формы
        const checkoutForm = document.getElementById('checkout-order-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Проверяем, есть ли заказ
                const savedOrder = loadOrderFromLocalStorage();
                if (!savedOrder || (!savedOrder.combo && (!savedOrder.dishes || savedOrder.dishes.length === 0))) {
                    showNotification('Выберите блюда для заказа!', 'error');
                    return;
                }
                
                // Проверяем обязательные поля
                const name = checkoutForm.querySelector('input[name="name"]').value.trim();
                const phone = checkoutForm.querySelector('input[name="phone"]').value.trim();
                const email = checkoutForm.querySelector('input[name="email"]').value.trim();
                const address = checkoutForm.querySelector('input[name="address"]').value.trim();
                const deliveryTime = checkoutForm.querySelector('input[name="delivery-time"]:checked').value;
                const deliveryTimeValue = checkoutForm.querySelector('#delivery-time').value;
                
                if (!name || !phone || !email || !address) {
                    showNotification('Заполните обязательные поля: Имя, Телефон, Email и Адрес!', 'error');
                    return;
                }
                
                // Проверяем формат email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showNotification('Введите корректный email адрес', 'error');
                    return;
                }
                
                // Проверяем время доставки
                if (deliveryTime === 'later' && !deliveryTimeValue) {
                    showNotification('Выберите время доставки!', 'error');
                    return;
                }
                
                try {
                    // Показываем индикатор загрузки
                    const submitBtn = checkoutForm.querySelector('.submit-btn');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Отправка...';
                    submitBtn.disabled = true;
                    
                    // Сохраняем данные пользователя
                    currentUser.name = name;
                    currentUser.phone = phone;
                    currentUser.email = email;
                    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
                    
                    // Симуляция отправки на сервер
                    setTimeout(function() {
                        // Сохраняем заказ в историю
                        const orderData = {
                            name,
                            phone,
                            email,
                            address,
                            deliveryTime,
                            deliveryTimeValue,
                            comments: checkoutForm.querySelector('textarea[name="comments"]').value.trim() || ''
                        };
                        
                        const savedOrder = saveOrderToHistory(orderData);
                        
                        if (savedOrder) {
                            // Очищаем корзину
                            localStorage.removeItem(ORDER_STORAGE_KEY);
                            
                            // Показываем сообщение об успехе
                            const successMessage = `
                                🎉 Заказ успешно оформлен!
                                
                                Сумма заказа: ${window.currentOrderTotal}₽
                                Время доставки: ${deliveryTime === 'now' ? 'Как можно скорее' : deliveryTimeValue}
                                
                                Вы можете просмотреть ваш заказ в разделе "Мои заказы".
                                Мы свяжемся с вами для подтверждения.
                            `;
                            
                            alert(successMessage);
                            
                            // Перенаправляем на страницу заказов
                            window.location.href = 'orders.html';
                            
                        } else {
                            showNotification('Ошибка при сохранении заказа', 'error');
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                        }
                        
                    }, 1000);
                    
                } catch (error) {
                    console.error('❌ Ошибка:', error);
                    showNotification('Произошла ошибка при отправке заказа', 'error');
                    
                    // Восстанавливаем кнопку
                    const submitBtn = checkoutForm.querySelector('.submit-btn');
                    if (submitBtn) {
                        submitBtn.textContent = 'Подтвердить заказ';
                        submitBtn.disabled = false;
                    }
                }
            });
        }
        
        // Кнопка "Вернуться к выбору"
        const backBtn = document.getElementById('back-to-lunch-btn');
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                window.location.href = 'lunch.html';
            });
        }
        
    } catch (error) {
        console.error('❌ Ошибка при инициализации:', error);
        showEmptyOrderMessage();
    }
});

console.log('🛠️ Checkout script загружен и готов к работе');