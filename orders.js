// orders.js - ПОЛНОСТЬЮ ИСПРАВЛЕННЫЙ ДЛЯ ОТОБРАЖЕНИЯ КОМБО

// Ключи для localStorage
const ORDERS_STORAGE_KEY = 'food_delivery_orders';
const CURRENT_USER_KEY = 'current_user';

// Текущий пользователь
let currentUser = {
    id: 'user_' + Date.now(),
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67'
};

// Список заказов
let orders = [];

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Страница "Мои заказы" загружена');
    
    // Устанавливаем текущего пользователя
    setCurrentUser();
    
    // Загружаем заказы
    loadOrders();
    
    // Инициализируем обработчики событий
    initEventHandlers();
    
    // Инициализируем модальные окна
    initModals();
});

// Установка текущего пользователя
function setCurrentUser() {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            console.log('👤 Текущий пользователь загружен:', currentUser);
        } catch (error) {
            console.error('❌ Ошибка при загрузке пользователя:', error);
            createDefaultUser();
        }
    } else {
        createDefaultUser();
    }
}

// Создание пользователя по умолчанию
function createDefaultUser() {
    currentUser = {
        id: 'user_' + Date.now(),
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67'
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    console.log('👤 Создан пользователь по умолчанию:', currentUser);
}

// Загрузка заказов
function loadOrders() {
    console.log('📦 Загрузка заказов...');
    
    // Показываем спиннер загрузки
    showLoading(true);
    
    // Загружаем из localStorage
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    
    if (savedOrders) {
        try {
            orders = JSON.parse(savedOrders);
            console.log(`✅ Загружено ${orders.length} заказов`);
            
            // ДЕБАГ: выводим структуру каждого заказа
            orders.forEach((order, i) => {
                console.log(`Заказ #${i + 1} (№${order.orderNumber}):`, {
                    hasCombo: !!order.combo,
                    comboName: order.combo?.name,
                    comboPrice: order.combo?.price,
                    comboQuantity: order.combo?.quantity,
                    dishesCount: order.dishes?.length || 0,
                    dishes: order.dishes?.map(d => d.name).join(', ') || 'нет'
                });
            });
        } catch (error) {
            console.error('❌ Ошибка при загрузке заказов:', error);
            orders = [];
            createDemoOrders();
        }
    } else {
        console.log('ℹ️ Заказы не найдены, создаем демо-данные');
        createDemoOrders();
    }
    
    // Фильтруем заказы текущего пользователя и сортируем по дате
    const userOrders = orders
        .filter(order => order.userId === currentUser.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Отображаем заказы
    displayOrders(userOrders);
    
    // Скрываем спиннер
    showLoading(false);
}

// Создание демо-заказов (с комбо в поле combo)
function createDemoOrders() {
    console.log('🔄 Создаем демо-заказы с комбо...');
    
    const demoOrders = [
        {
            id: 'order_' + Date.now(),
            orderNumber: 1,
            userId: currentUser.id,
            customer: currentUser.name,
            phone: currentUser.phone,
            email: currentUser.email,
            address: 'г. Москва, ул. Примерная, д. 1, кв. 5',
            combo: {
                name: 'Комбо 1: Полный обед',
                description: 'Суп + Главное + Салат + Напиток',
                price: 980,
                quantity: 1,
                dishes: [
                    { keyword: 'chicken_soup', category: 'soup' },
                    { keyword: 'chicken_cutlets', category: 'main' },
                    { keyword: 'caesar_salad', category: 'salad' },
                    { keyword: 'orange_juice', category: 'drink' }
                ]
            },
            dishes: [
                { name: 'Тирамису', price: 220, quantity: 2 }
            ],
            total: 1420, // 980 + (220 * 2)
            deliveryType: 'now',
            deliveryTime: null,
            comment: 'Позвонить за 15 минут',
            status: 'delivered',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'order_' + (Date.now() + 1),
            orderNumber: 2,
            userId: currentUser.id,
            customer: currentUser.name,
            phone: currentUser.phone,
            email: currentUser.email,
            address: 'г. Москва, ул. Примерная, д. 1, кв. 5',
            combo: null, // Заказ БЕЗ комбо
            dishes: [
                { name: 'Томатный суп', price: 180, quantity: 1 },
                { name: 'Паста Карбонара', price: 350, quantity: 1 },
                { name: 'Апельсиновый сок', price: 120, quantity: 2 }
            ],
            total: 770,
            deliveryType: 'later',
            deliveryTime: '13:30',
            comment: 'Оставить у двери',
            status: 'processing',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'order_' + (Date.now() + 2),
            orderNumber: 3,
            userId: currentUser.id,
            customer: currentUser.name,
            phone: currentUser.phone,
            email: currentUser.email,
            address: 'г. Москва, ул. Тестовая, д. 15, кв. 20',
            combo: {
                name: 'Комбо 2: Суп + Основное',
                description: 'Суп + Основное + Напиток',
                price: 560,
                quantity: 1,
                dishes: [
                    { keyword: 'tomato_soup', category: 'soup' },
                    { keyword: 'pasta_carbonara', category: 'main' },
                    { keyword: 'green_tea', category: 'drink' }
                ]
            },
            dishes: [], // Только комбо, без дополнительных блюд
            total: 560,
            deliveryType: 'now',
            deliveryTime: null,
            comment: '',
            status: 'new',
            createdAt: new Date().toISOString()
        }
    ];
    
    orders = demoOrders;
    saveOrdersToStorage();
}

// Сохранение заказов в localStorage
function saveOrdersToStorage() {
    try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
        console.log('💾 Заказы сохранены в localStorage');
        return true;
    } catch (error) {
        console.error('❌ Ошибка при сохранении заказов:', error);
        showNotification('Ошибка сохранения заказов', 'error');
        return false;
    }
}

// Отображение заказов
function displayOrders(ordersList) {
    const ordersListElement = document.getElementById('orders-list');
    const noOrdersElement = document.getElementById('no-orders');
    
    if (!ordersListElement) {
        console.error('❌ Элемент orders-list не найден');
        return;
    }
    
    // Очищаем список
    ordersListElement.innerHTML = '';
    
    if (ordersList.length === 0) {
        ordersListElement.style.display = 'none';
        if (noOrdersElement) {
            noOrdersElement.style.display = 'block';
        }
        return;
    }
    
    if (noOrdersElement) {
        noOrdersElement.style.display = 'none';
    }
    ordersListElement.style.display = 'flex';
    
    // Создаем карточки заказов
    ordersList.forEach((order) => {
        const orderCard = createOrderCard(order);
        ordersListElement.appendChild(orderCard);
    });
}

// Создание карточки заказа (ГЛАВНОЕ ИСПРАВЛЕНИЕ)
function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';
    card.dataset.orderId = order.id;
    
    // Форматируем дату
    const orderDate = new Date(order.createdAt);
    const formattedDate = orderDate.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // СОЗДАЕМ СПИСОК БЛЮД С УЧЕТОМ КОМБО
    let dishesHTML = '';
    
    // 1. Если есть комбо - добавляем его первым
    if (order.combo && order.combo.name) {
        const comboQuantity = order.combo.quantity || 1;
        dishesHTML += `
            <div class="combo-item" style="
                background: #fff3e0;
                border-left: 4px solid #ff6347;
                padding: 8px 10px;
                margin-bottom: 8px;
                border-radius: 6px;
            ">
                <strong style="color: #ff6347;">🍱 ${order.combo.name}${comboQuantity > 1 ? ` (x${comboQuantity})` : ''}</strong>
                ${order.combo.description ? `<br><small style="color: #666;">${order.combo.description}</small>` : ''}
            </div>
        `;
        
        // Добавляем разделитель если есть и обычные блюда
        if (order.dishes && order.dishes.length > 0) {
            dishesHTML += '<hr style="margin: 8px 0; border: none; border-top: 1px dashed #ccc;">';
        }
    }
    
    // 2. Добавляем обычные блюда
    if (order.dishes && order.dishes.length > 0) {
        order.dishes.forEach((dish, index) => {
            dishesHTML += `
                <div class="dish-item" style="margin-bottom: 4px;">
                    ${dish.name}${dish.quantity > 1 ? ` (x${dish.quantity})` : ''}
                </div>
            `;
        });
    }
    
    // 3. Если нет ни комбо, ни блюд
    if (!dishesHTML) {
        dishesHTML = '<span style="color: #999;">Состав не указан</span>';
    }
    
    // Время доставки
    const deliveryTimeText = order.deliveryType === 'now' 
        ? 'Как можно скорее' 
        : `Ко времени: ${order.deliveryTime}`;
    
    card.innerHTML = `
        <div class="order-header">
            <div class="order-number">
                <span>Заказ №${order.orderNumber}</span>
                <span class="order-id">${order.id.substring(0, 8)}</span>
            </div>
            <div class="order-date">${formattedDate}</div>
        </div>
        
        <div class="order-details">
            <div class="dishes-list">
                ${dishesHTML}
            </div>
            
            <div class="order-meta">
                <div class="order-price">${order.total}₽</div>
                <div class="delivery-time ${order.deliveryType === 'now' ? 'now' : ''}">
                    ${deliveryTimeText}
                </div>
            </div>
        </div>
        
        <div class="order-actions">
            <button class="action-btn btn-view" data-action="view" data-order-id="${order.id}">
                <i class="bi bi-eye"></i> Подробнее
            </button>
            <button class="action-btn btn-edit" data-action="edit" data-order-id="${order.id}">
                <i class="bi bi-pencil"></i> Редактировать
            </button>
            <button class="action-btn btn-delete" data-action="delete" data-order-id="${order.id}">
                <i class="bi bi-trash"></i> Удалить
            </button>
        </div>
    `;
    
    return card;
}

// Инициализация обработчиков событий
function initEventHandlers() {
    // Кнопка обновления
    const refreshBtn = document.getElementById('refresh-orders');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadOrders();
            showNotification('Список заказов обновлен', 'info');
        });
    }
    
    // Поиск
    const searchInput = document.getElementById('search-orders');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            if (searchTerm) {
                const userOrders = orders
                    .filter(order => order.userId === currentUser.id)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                const filteredOrders = userOrders.filter(order => 
                    (order.combo && order.combo.name.toLowerCase().includes(searchTerm)) ||
                    (order.dishes && order.dishes.some(dish => 
                        dish.name.toLowerCase().includes(searchTerm)
                    )) ||
                    order.id.toLowerCase().includes(searchTerm) ||
                    order.orderNumber.toString().includes(searchTerm)
                );
                
                displayOrders(filteredOrders);
            } else {
                loadOrders();
            }
        });
    }
    
    // Обработчики для кнопок действий
    document.addEventListener('click', function(e) {
        const actionBtn = e.target.closest('.action-btn');
        if (!actionBtn) return;
        
        const orderId = actionBtn.dataset.orderId;
        const action = actionBtn.dataset.action;
        
        if (!orderId) return;
        
        const order = orders.find(o => o.id === orderId);
        if (!order) return;
        
        switch(action) {
            case 'view':
                openViewModal(order);
                break;
            case 'edit':
                openEditModal(order);
                break;
            case 'delete':
                openDeleteModal(order);
                break;
        }
    });
}

// Инициализация модальных окон
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close, .close-modal');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeAllModals();
        });
    });
    
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
    
    const editForm = document.getElementById('edit-order-form');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveEditedOrder();
        });
    }
    
    const deliveryNowRadio = document.getElementById('edit-delivery-now');
    const deliveryLaterRadio = document.getElementById('edit-delivery-later');
    const timePicker = document.getElementById('edit-time-picker');
    
    if (deliveryNowRadio && deliveryLaterRadio && timePicker) {
        deliveryNowRadio.addEventListener('change', function() {
            timePicker.style.display = this.checked ? 'none' : 'block';
        });
        
        deliveryLaterRadio.addEventListener('change', function() {
            timePicker.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', deleteOrder);
    }
}

// ОТКРЫТИЕ МОДАЛЬНОГО ОКНА ПРОСМОТРА (ГЛАВНОЕ ИСПРАВЛЕНИЕ 2)
function openViewModal(order) {
    const modal = document.getElementById('view-order-modal');
    if (!modal) return;
    
    console.log('📋 Открываем детали заказа:', {
        orderNumber: order.orderNumber,
        hasCombo: !!order.combo,
        comboName: order.combo?.name,
        comboPrice: order.combo?.price,
        dishesCount: order.dishes?.length || 0
    });
    
    // Заполняем данные
    document.getElementById('view-order-id').textContent = order.id;
    
    const orderDate = new Date(order.createdAt);
    document.getElementById('view-order-date').textContent = orderDate.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Статус заказа
    const statusText = {
        'new': 'Новый',
        'processing': 'В обработке',
        'delivered': 'Доставлен',
        'cancelled': 'Отменен'
    }[order.status] || order.status;
    
    const statusElement = document.getElementById('view-order-status');
    statusElement.textContent = statusText;
    statusElement.className = 'info-value status ' + order.status;
    
    // СОСТАВ ЗАКАЗА - ОСНОВНОЕ ИСПРАВЛЕНИЕ!
    const dishesContainer = document.getElementById('view-order-dishes');
    dishesContainer.innerHTML = '';
    
    let allItems = [];
    let totalCalculated = 0;
    
    // 1. Добавляем комбо если есть
    if (order.combo && order.combo.name) {
        const comboQuantity = order.combo.quantity || 1;
        const comboTotal = order.combo.price * comboQuantity;
        totalCalculated += comboTotal;
        
        const comboElement = document.createElement('div');
        comboElement.className = 'dish-item combo-item';
        comboElement.innerHTML = `
            <div style="display: flex; flex-direction: column; flex: 1;">
                <span class="name" style="font-weight: bold; color: #ff6347; font-size: 16px;">
                    🍱 ${order.combo.name}${comboQuantity > 1 ? ` (x${comboQuantity})` : ''}
                </span>
                ${order.combo.description ? 
                    `<small style="color: #666; margin-top: 4px; display: block;">${order.combo.description}</small>` : ''}
            </div>
            <span class="price" style="font-weight: bold; color: #ff6347; font-size: 16px;">
                ${comboTotal}₽
                <br>
                <small style="font-weight: normal; color: #888; font-size: 12px;">
                    ${order.combo.price}₽ × ${comboQuantity}
                </small>
            </span>
        `;
        dishesContainer.appendChild(comboElement);
        
        allItems.push({
            name: order.combo.name,
            price: order.combo.price,
            quantity: comboQuantity,
            total: comboTotal,
            isCombo: true
        });
        
        // Добавляем разделитель если будут обычные блюда
        if (order.dishes && order.dishes.length > 0) {
            const separator = document.createElement('div');
            separator.style.height = '15px';
            dishesContainer.appendChild(separator);
        }
    }
    
    // 2. Добавляем обычные блюда если есть
    if (order.dishes && order.dishes.length > 0) {
        order.dishes.forEach(dish => {
            const dishTotal = dish.price * dish.quantity;
            totalCalculated += dishTotal;
            
            const dishElement = document.createElement('div');
            dishElement.className = 'dish-item';
            dishElement.innerHTML = `
                <span class="name">${dish.name}${dish.quantity > 1 ? ` (x${dish.quantity})` : ''}</span>
                <span class="price">${dishTotal}₽</span>
            `;
            dishesContainer.appendChild(dishElement);
            
            allItems.push({
                name: dish.name,
                price: dish.price,
                quantity: dish.quantity,
                total: dishTotal,
                isCombo: false
            });
        });
    }
    
    // 3. Если нет ни комбо, ни блюд
    if (allItems.length === 0) {
        dishesContainer.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">Нет информации о блюдах</div>';
    }
    
    // Стоимость
    document.getElementById('view-order-total').textContent = `${order.total}₽`;
    
    // Информация о доставке
    document.getElementById('view-order-customer').textContent = order.customer || '—';
    document.getElementById('view-order-phone').textContent = order.phone || '—';
    document.getElementById('view-order-email').textContent = order.email || '—';
    document.getElementById('view-order-address').textContent = order.address || '—';
    
    const deliveryTimeText = order.deliveryType === 'now' 
        ? 'Как можно скорее' 
        : `Ко времени: ${order.deliveryTime || '—'}`;
    document.getElementById('view-order-delivery-time').textContent = deliveryTimeText;
    
    document.getElementById('view-order-comment').textContent = order.comment || '—';
    
    // Показываем модальное окно
    modal.classList.add('active');
}

// Открытие модального окна редактирования
function openEditModal(order) {
    const modal = document.getElementById('edit-order-modal');
    if (!modal) return;
    
    document.getElementById('edit-order-id').value = order.id;
    document.getElementById('edit-full-name').value = order.customer;
    document.getElementById('edit-phone').value = order.phone;
    document.getElementById('edit-email').value = order.email;
    document.getElementById('edit-address').value = order.address;
    document.getElementById('edit-comment').value = order.comment || '';
    
    const deliveryNowRadio = document.getElementById('edit-delivery-now');
    const deliveryLaterRadio = document.getElementById('edit-delivery-later');
    const timePicker = document.getElementById('edit-time-picker');
    const deliveryTimeInput = document.getElementById('edit-delivery-time');
    
    if (order.deliveryType === 'now') {
        deliveryNowRadio.checked = true;
        deliveryLaterRadio.checked = false;
        timePicker.style.display = 'none';
        deliveryTimeInput.value = '';
    } else {
        deliveryNowRadio.checked = false;
        deliveryLaterRadio.checked = true;
        timePicker.style.display = 'block';
        deliveryTimeInput.value = order.deliveryTime || '12:00';
    }
    
    modal.classList.add('active');
}

// Сохранение отредактированного заказа
function saveEditedOrder() {
    const orderId = document.getElementById('edit-order-id').value;
    if (!orderId) return;
    
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
        showNotification('Заказ не найден', 'error');
        return;
    }
    
    const formData = {
        customer: document.getElementById('edit-full-name').value.trim(),
        phone: document.getElementById('edit-phone').value.trim(),
        email: document.getElementById('edit-email').value.trim(),
        address: document.getElementById('edit-address').value.trim(),
        deliveryType: document.querySelector('input[name="delivery_type"]:checked').value,
        deliveryTime: document.getElementById('edit-delivery-time').value,
        comment: document.getElementById('edit-comment').value.trim(),
        updatedAt: new Date().toISOString()
    };
    
    if (!formData.customer || !formData.phone || !formData.email || !formData.address) {
        showNotification('Заполните все обязательные поля', 'error');
        return;
    }
    
    if (formData.deliveryType === 'later' && !formData.deliveryTime) {
        showNotification('Укажите время доставки', 'error');
        return;
    }
    
    orders[orderIndex] = {
        ...orders[orderIndex],
        ...formData,
        deliveryTime: formData.deliveryType === 'now' ? null : formData.deliveryTime
    };
    
    if (saveOrdersToStorage()) {
        closeAllModals();
        showNotification('Заказ успешно изменён', 'success');
        loadOrders();
    }
}

// Открытие модального окна подтверждения удаления
function openDeleteModal(order) {
    const modal = document.getElementById('delete-order-modal');
    if (!modal) return;
    
    document.getElementById('delete-order-id').value = order.id;
    document.getElementById('delete-order-number').textContent = `#${order.orderNumber}`;
    
    modal.classList.add('active');
}

// Удаление заказа
function deleteOrder() {
    const orderId = document.getElementById('delete-order-id').value;
    if (!orderId) return;
    
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
        showNotification('Заказ не найден', 'error');
        return;
    }
    
    orders.splice(orderIndex, 1);
    
    if (saveOrdersToStorage()) {
        closeAllModals();
        showNotification('Заказ успешно удалён', 'success');
        loadOrders();
    }
}

// Закрытие всех модальных окон
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Показать/скрыть спиннер загрузки
function showLoading(show) {
    const loadingElement = document.getElementById('orders-loading');
    const ordersListElement = document.getElementById('orders-list');
    
    if (loadingElement) {
        loadingElement.style.display = show ? 'block' : 'none';
    }
    
    if (ordersListElement) {
        ordersListElement.style.display = show ? 'none' : 'flex';
    }
}

// Показать уведомление
function showNotification(message, type = 'info') {
    document.querySelectorAll('.notification').forEach(el => el.remove());
    
    const icons = {
        success: 'bi-check-circle-fill',
        error: 'bi-x-circle-fill',
        info: 'bi-info-circle-fill',
        warning: 'bi-exclamation-triangle-fill'
    };
    
    const bgColor = type === 'success' ? '#4CAF50' : 
                   type === 'error' ? '#f44336' : 
                   type === 'warning' ? '#ff9800' : '#2196F3';
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="bi ${icons[type] || 'bi-info-circle-fill'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// ФУНКЦИЯ ДЛЯ ФИКСА СУЩЕСТВУЮЩИХ ЗАКАЗОВ
function fixExistingOrdersStructure() {
    console.log('🛠️ Проверяем и фиксим структуру существующих заказов...');
    
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!savedOrders) return;
    
    try {
        let existingOrders = JSON.parse(savedOrders);
        let fixedCount = 0;
        
        existingOrders = existingOrders.map(order => {
            // Если заказ имеет комбо в отдельном поле, но его нет в dishes
            if (order.combo && order.combo.name && (!order.dishes || !Array.isArray(order.dishes))) {
                console.log(`🔧 Фиксим заказ №${order.orderNumber} с комбо "${order.combo.name}"`);
                
                // Создаем массив dishes если его нет
                if (!order.dishes) {
                    order.dishes = [];
                }
                
                // НЕ добавляем комбо в dishes - оставляем его отдельно
                // Это важно: комбо должен остаться в поле combo
                fixedCount++;
            }
            
            return order;
        });
        
        if (fixedCount > 0) {
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(existingOrders));
            console.log(`✅ Исправлено ${fixedCount} заказов`);
        }
    } catch (error) {
        console.error('❌ Ошибка при фиксации заказов:', error);
    }
}

// Проверяем что в localStorage
function debugLocalStorage() {
    console.log('🔍 Отладочная информация о localStorage:');
    
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (savedOrders) {
        try {
            const orders = JSON.parse(savedOrders);
            console.log(`Всего заказов: ${orders.length}`);
            
            orders.forEach((order, i) => {
                console.group(`Заказ ${i + 1} (№${order.orderNumber}):`);
                console.log('ID:', order.id);
                console.log('Есть поле combo:', !!order.combo);
                console.log('Название комбо:', order.combo?.name || 'нет');
                console.log('Цена комбо:', order.combo?.price || 0);
                console.log('Количество комбо:', order.combo?.quantity || 0);
                console.log('Блюда (dishes):', order.dishes?.length || 0, 'шт');
                if (order.dishes) {
                    order.dishes.forEach((dish, j) => {
                        console.log(`  ${j + 1}. ${dish.name} (x${dish.quantity}) - ${dish.price}₽`);
                    });
                }
                console.log('Общая сумма:', order.total, '₽');
                console.groupEnd();
            });
        } catch (error) {
            console.error('Ошибка парсинга заказов:', error);
        }
    } else {
        console.log('Нет сохраненных заказов');
    }
}

// Добавляем стили для комбо
if (!document.querySelector('#orders-combo-styles')) {
    const style = document.createElement('style');
    style.id = 'orders-combo-styles';
    style.textContent = `
        .combo-item {
            background: #fff3e0 !important;
            border-left: 4px solid #ff6347 !important;
            padding: 10px !important;
            margin-bottom: 10px !important;
            border-radius: 6px !important;
        }
        
        .dish-item.combo-item {
            background: #fff8e1 !important;
            border: 1px solid #ffecb3 !important;
            border-left: 4px solid #ff6347 !important;
        }
        
        .orders-list .combo-item {
            background: #fff8e1;
            padding: 8px 10px;
            margin: 5px 0;
            border-radius: 6px;
            border: 1px solid #ffecb3;
        }
        
        .orders-list .combo-item strong {
            color: #ff6347;
        }
        
        .orders-list .combo-item small {
            color: #666;
            font-size: 12px;
        }
    `;
    document.head.appendChild(style);
}

// Запускаем фикс и отладку при загрузке
document.addEventListener('DOMContentLoaded', function() {
    fixExistingOrdersStructure();
    debugLocalStorage();
});