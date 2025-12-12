// checkout-script.js - полностью рабочий скрипт для страницы "Оформить заказ"

// Ключ для хранения заказа в localStorage
const ORDER_STORAGE_KEY = 'food_delivery_order';

// Загрузить заказ из localStorage
function loadOrderFromLocalStorage() {
    try {
        const savedOrder = localStorage.getItem(ORDER_STORAGE_KEY);
        if (!savedOrder) {
            console.log('Нет сохраненного заказа в localStorage');
            return null;
        }
        const parsed = JSON.parse(savedOrder);
        console.log('Загружен заказ из localStorage:', parsed);
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
        
        console.log('Удаление:', category, identifier);
        
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
            console.log('Корзина полностью очищена');
        } else {
            localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(savedOrder));
            console.log('Заказ обновлен в localStorage');
        }
        
        // Перезагружаем отображение
        loadAndDisplayOrder();
        
    } catch (error) {
        console.error('❌ Ошибка при удалении блюда:', error);
        alert('Ошибка при удалении блюда');
    }
}

// Изменить количество блюда
function updateDishQuantity(identifier, newQuantity, isCombo = false) {
    try {
        const savedOrder = loadOrderFromLocalStorage();
        if (!savedOrder) return;
        
        console.log('Изменение количества:', identifier, newQuantity, isCombo);
        
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
        console.log('Количество обновлено в localStorage');
        
        // Перезагружаем отображение
        loadAndDisplayOrder();
        
    } catch (error) {
        console.error('❌ Ошибка при изменении количества:', error);
        alert('Ошибка при изменении количества');
    }
}

// Загрузить и отобразить заказ
async function loadAndDisplayOrder() {
    try {
        console.log('🔄 Загрузка и отображение заказа...');
        
        // Ждем загрузки блюд (если функция есть)
        if (typeof loadDishes === 'function') {
            console.log('Загружаем блюда...');
            await loadDishes();
        }
        
        // Загружаем заказ из localStorage
        const savedOrder = loadOrderFromLocalStorage();
        
        if (!savedOrder || (!savedOrder.combo && (!savedOrder.dishes || savedOrder.dishes.length === 0))) {
            console.log('Корзина пуста, показываем сообщение');
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
    
    // Отображаем комбо если есть
    if (savedOrder.combo) {
        console.log('Добавляем комбо в отображение:', savedOrder.combo);
        const comboCard = createComboCard(savedOrder.combo);
        orderItemsGrid.appendChild(comboCard);
        const comboTotal = savedOrder.combo.price * (savedOrder.combo.quantity || 1);
        totalPrice += comboTotal;
        totalItems += savedOrder.combo.quantity || 1;
    }
    
    // Отображаем отдельные блюда если есть
    if (savedOrder.dishes && savedOrder.dishes.length > 0) {
        console.log(`Добавляем ${savedOrder.dishes.length} блюд в отображение`);
        savedOrder.dishes.forEach(dishData => {
            const dishCard = createOrderDishCard(dishData);
            orderItemsGrid.appendChild(dishCard);
            const dishTotal = dishData.price * (dishData.quantity || 1);
            totalPrice += dishTotal;
            totalItems += dishData.quantity || 1;
        });
    }
    
    // Если нет ни одного блюда
    if (totalItems === 0) {
        console.log('Нет элементов для отображения');
        showEmptyOrderMessage();
        return;
    }
    
    // Обновляем общую стоимость
    if (checkoutTotal) {
        checkoutTotal.textContent = `${totalPrice}₽`;
        console.log(`Общая стоимость: ${totalPrice}₽, всего позиций: ${totalItems}`);
    }
    
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
        const maxAttempts = 20; // 10 секунд максимум
        
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
            } else {
                console.log(`⏳ Ожидание загрузки блюд... (${attempts}/${maxAttempts})`);
            }
        }, 500);
    });
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Страница оформления заказа загружена');
    
    try {
        // Ждем загрузки блюд
        await waitForDishes();
        
        // Загружаем и отображаем заказ
        await loadAndDisplayOrder();
        
        // Обработчик формы
        const checkoutForm = document.getElementById('checkout-order-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Проверяем, есть ли заказ
                const savedOrder = loadOrderFromLocalStorage();
                if (!savedOrder || (!savedOrder.combo && (!savedOrder.dishes || savedOrder.dishes.length === 0))) {
                    alert('Выберите блюда для заказа!');
                    return;
                }
                
                // Проверяем обязательные поля
                const name = checkoutForm.querySelector('input[name="name"]').value.trim();
                const phone = checkoutForm.querySelector('input[name="phone"]').value.trim();
                const address = checkoutForm.querySelector('input[name="address"]').value.trim();
                const deliveryTime = checkoutForm.querySelector('input[name="delivery-time"]:checked').value;
                const deliveryTimeValue = checkoutForm.querySelector('#delivery-time').value;
                
                if (!name || !phone || !address) {
                    alert('Заполните обязательные поля: Имя, Телефон и Адрес!');
                    return;
                }
                
                // Проверяем время доставки
                if (deliveryTime === 'later' && !deliveryTimeValue) {
                    alert('Выберите время доставки!');
                    return;
                }
                
                try {
                    // Показываем индикатор загрузки
                    const submitBtn = checkoutForm.querySelector('.submit-btn');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Отправка...';
                    submitBtn.disabled = true;
                    
                    // Рассчитываем общую стоимость
                    let totalPrice = 0;
                    let orderDetails = 'ВАШ ЗАКАЗ:\n\n';
                    
                    if (savedOrder.combo) {
                        const comboQuantity = savedOrder.combo.quantity || 1;
                        const comboTotal = savedOrder.combo.price * comboQuantity;
                        orderDetails += `КОМБО: ${savedOrder.combo.name} (x${comboQuantity})\n`;
                        orderDetails += `Состав: ${savedOrder.combo.description}\n`;
                        orderDetails += `Цена: ${comboTotal}₽ (${savedOrder.combo.price}₽ × ${comboQuantity})\n\n`;
                        totalPrice += comboTotal;
                    }
                    
                    if (savedOrder.dishes && savedOrder.dishes.length > 0) {
                        orderDetails += 'ОТДЕЛЬНЫЕ БЛЮДА:\n';
                        savedOrder.dishes.forEach(dishData => {
                            const quantity = dishData.quantity || 1;
                            const dishTotal = dishData.price * quantity;
                            orderDetails += `• ${dishData.name} - ${dishTotal}₽ (${dishData.price}₽ × ${quantity}, ${dishData.count})\n`;
                            totalPrice += dishTotal;
                        });
                        orderDetails += '\n';
                    }
                    
                    orderDetails += `ОБЩАЯ СТОИМОСТЬ: ${totalPrice}₽\n\n`;
                    orderDetails += `ДАННЫЕ ДЛЯ ДОСТАВКИ:\n`;
                    orderDetails += `Имя: ${name}\n`;
                    orderDetails += `Телефон: ${phone}\n`;
                    orderDetails += `Адрес: ${address}\n`;
                    
                    // Время доставки
                    if (deliveryTime === 'now') {
                        orderDetails += `Время доставки: Как можно скорее (в течение 60 минут)\n`;
                    } else {
                        orderDetails += `Время доставки: ${deliveryTimeValue}\n`;
                    }
                    
                    const email = checkoutForm.querySelector('input[name="email"]').value.trim();
                    if (email) orderDetails += `Email: ${email}\n`;
                    
                    const comments = checkoutForm.querySelector('textarea[name="comments"]').value.trim();
                    if (comments) orderDetails += `Комментарий: ${comments}\n`;
                    
                    console.log('✅ Заказ оформлен:', orderDetails);
                    
                    // Симуляция успешной отправки
                    setTimeout(function() {
                        // Очищаем localStorage
                        localStorage.removeItem(ORDER_STORAGE_KEY);
                        
                        // Показываем сообщение об успехе
                        alert('🎉 Заказ успешно оформлен!\n\n' + 
                              `Сумма заказа: ${totalPrice}₽\n` +
                              `Время доставки: ${deliveryTime === 'now' ? 'Как можно скорее' : deliveryTimeValue}\n` +
                              `Мы свяжемся с вами для подтверждения.`);
                        
                        // Перенаправляем на главную
                        window.location.href = 'index.html';
                    }, 1000);
                    
                } catch (error) {
                    console.error('❌ Ошибка:', error);
                    alert('Произошла ошибка при отправке заказа');
                    
                    // Восстанавливаем кнопку
                    const submitBtn = checkoutForm.querySelector('.submit-btn');
                    if (submitBtn) {
                        submitBtn.textContent = 'Отправить заказ';
                        submitBtn.disabled = false;
                    }
                }
            });
        } else {
            console.error('❌ Форма заказа не найдена');
        }
        
        // Кнопка "Вернуться к выбору"
        const backBtn = document.getElementById('back-to-lunch-btn');
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                window.location.href = 'lunch.html';
            });
        } else {
            console.error('❌ Кнопка "Вернуться к выбору" не найдена');
        }
        
    } catch (error) {
        console.error('❌ Ошибка при инициализации:', error);
        showEmptyOrderMessage();
    }
});

// Добавляем обработчик для вывода отладочной информации
console.log('🛠️ Checkout script загружен и готов к работе');