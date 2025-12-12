// orders.js - скрипт для страницы "Мои заказы"

// Ключи для localStorage
const ORDERS_STORAGE_KEY = 'food_delivery_orders';
const CURRENT_USER_KEY = 'current_user';

// Текущий пользователь (для демонстрации)
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

// Создание демо-заказов
function createDemoOrders() {
    const demoOrders = [
        {
            id: 'order_' + Date.now(),
            orderNumber: 1,
            userId: currentUser.id,
            customer: currentUser.name,
            phone: currentUser.phone,
            email: currentUser.email,
            address: 'г. Москва, ул. Примерная, д. 1, кв. 5',
            dishes: [
                { name: 'Томатный суп', price: 180, quantity: 1 },
                { name: 'Паста Карбонара', price: 350, quantity: 1 },
                { name: 'Апельсиновый сок', price: 120, quantity: 2 }
            ],
            total: 770,
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
            dishes: [
                { name: 'Куриный суп с лапшой', price: 200, quantity: 1 },
                { name: 'Куриные котлеты с пюре', price: 280, quantity: 1 },
                { name: 'Цезарь с курицей', price: 320, quantity: 1 },
                { name: 'Зеленый чай', price: 80, quantity: 1 }
            ],
            total: 880,
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
            dishes: [
                { name: 'Комбо 1: Полный обед', price: 980, quantity: 1 },
                { name: 'Тирамису', price: 220, quantity: 2 }
            ],
            total: 1420,
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
        // Показываем сообщение "нет заказов"
        ordersListElement.style.display = 'none';
        if (noOrdersElement) {
            noOrdersElement.style.display = 'block';
        }
        return;
    }
    
    // Скрываем сообщение "нет заказов"
    if (noOrdersElement) {
        noOrdersElement.style.display = 'none';
    }
    ordersListElement.style.display = 'flex';
    
    // Создаем карточки заказов
    ordersList.forEach((order, index) => {
        const orderCard = createOrderCard(order, index + 1);
        ordersListElement.appendChild(orderCard);
    });
}

// Создание карточки заказа
function createOrderCard(order, index) {
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
    
    // Форматируем список блюд
    const dishesList = order.dishes
        .map(dish => `${dish.name}${dish.quantity > 1 ? ` (x${dish.quantity})` : ''}`)
        .join(', ');
    
    // Время доставки
    const deliveryTimeText = order.deliveryType === 'now' 
        ? 'Как можно скорее (с 7:00 до 23:00)' 
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
                <span>${dishesList}</span>
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
                    order.dishes.some(dish => 
                        dish.name.toLowerCase().includes(searchTerm)
                    ) ||
                    order.id.toLowerCase().includes(searchTerm) ||
                    order.orderNumber.toString().includes(searchTerm)
                );
                
                displayOrders(filteredOrders);
            } else {
                loadOrders();
            }
        });
    }
    
    // Обработчики для кнопок действий в карточках
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
    // Получаем все модальные окна
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close, .close-modal');
    
    // Закрытие модальных окон
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeAllModals();
        });
    });
    
    // Закрытие при клике вне модального окна
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
    
    // Обработка формы редактирования
    const editForm = document.getElementById('edit-order-form');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveEditedOrder();
        });
    }
    
    // Переключение времени доставки в форме редактирования
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
    
    // Подтверждение удаления
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', deleteOrder);
    }
}

// Открытие модального окна просмотра
function openViewModal(order) {
    const modal = document.getElementById('view-order-modal');
    if (!modal) return;
    
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
    
    // Состав заказа
    const dishesContainer = document.getElementById('view-order-dishes');
    dishesContainer.innerHTML = '';
    
    order.dishes.forEach(dish => {
        const dishElement = document.createElement('div');
        dishElement.className = 'dish-item';
        dishElement.innerHTML = `
            <span class="name">${dish.name}${dish.quantity > 1 ? ` (x${dish.quantity})` : ''}</span>
            <span class="price">${dish.price * dish.quantity}₽</span>
        `;
        dishesContainer.appendChild(dishElement);
    });
    
    // Стоимость
    document.getElementById('view-order-total').textContent = `${order.total}₽`;
    
    // Информация о доставке
    document.getElementById('view-order-customer').textContent = order.customer;
    document.getElementById('view-order-phone').textContent = order.phone;
    document.getElementById('view-order-email').textContent = order.email;
    document.getElementById('view-order-address').textContent = order.address;
    
    const deliveryTimeText = order.deliveryType === 'now' 
        ? 'Как можно скорее (с 7:00 до 23:00)' 
        : `Ко времени: ${order.deliveryTime}`;
    document.getElementById('view-order-delivery-time').textContent = deliveryTimeText;
    
    document.getElementById('view-order-comment').textContent = order.comment || '—';
    
    // Показываем модальное окно
    modal.classList.add('active');
}

// Открытие модального окна редактирования
function openEditModal(order) {
    const modal = document.getElementById('edit-order-modal');
    if (!modal) return;
    
    // Заполняем форму
    document.getElementById('edit-order-id').value = order.id;
    document.getElementById('edit-full-name').value = order.customer;
    document.getElementById('edit-phone').value = order.phone;
    document.getElementById('edit-email').value = order.email;
    document.getElementById('edit-address').value = order.address;
    document.getElementById('edit-comment').value = order.comment || '';
    
    // Время доставки
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
    
    // Показываем модальное окно
    modal.classList.add('active');
}

// Сохранение отредактированного заказа
function saveEditedOrder() {
    const orderId = document.getElementById('edit-order-id').value;
    if (!orderId) return;
    
    // Находим заказ
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
        showNotification('Заказ не найден', 'error');
        return;
    }
    
    // Собираем данные из формы
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
    
    // Валидация
    if (!formData.customer || !formData.phone || !formData.email || !formData.address) {
        showNotification('Заполните все обязательные поля', 'error');
        return;
    }
    
    if (formData.deliveryType === 'later' && !formData.deliveryTime) {
        showNotification('Укажите время доставки', 'error');
        return;
    }
    
    // Обновляем заказ
    orders[orderIndex] = {
        ...orders[orderIndex],
        ...formData,
        deliveryTime: formData.deliveryType === 'now' ? null : formData.deliveryTime
    };
    
    // Сохраняем в хранилище
    if (saveOrdersToStorage()) {
        // Закрываем модальное окно
        closeAllModals();
        
        // Показываем уведомление
        showNotification('Заказ успешно изменён', 'success');
        
        // Обновляем список заказов
        loadOrders();
    }
}

// Открытие модального окна подтверждения удаления
function openDeleteModal(order) {
    const modal = document.getElementById('delete-order-modal');
    if (!modal) return;
    
    // Заполняем данные
    document.getElementById('delete-order-id').value = order.id;
    document.getElementById('delete-order-number').textContent = `#${order.orderNumber}`;
    
    // Показываем модальное окно
    modal.classList.add('active');
}

// Удаление заказа
function deleteOrder() {
    const orderId = document.getElementById('delete-order-id').value;
    if (!orderId) return;
    
    // Находим индекс заказа
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
        showNotification('Заказ не найден', 'error');
        return;
    }
    
    // Удаляем заказ
    orders.splice(orderIndex, 1);
    
    // Сохраняем в хранилище
    if (saveOrdersToStorage()) {
        // Закрываем модальное окно
        closeAllModals();
        
        // Показываем уведомление
        showNotification('Заказ успешно удалён', 'success');
        
        // Обновляем список заказов
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
    // Удаляем старые уведомления
    document.querySelectorAll('.notification').forEach(el => el.remove());
    
    // Иконка для типа уведомления
    const icons = {
        success: 'bi-check-circle-fill',
        error: 'bi-x-circle-fill',
        info: 'bi-info-circle-fill',
        warning: 'bi-exclamation-triangle-fill'
    };
    
    // Цвет фона
    const bgColor = type === 'success' ? '#4CAF50' : 
                   type === 'error' ? '#f44336' : 
                   type === 'warning' ? '#ff9800' : '#2196F3';
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="bi ${icons[type] || 'bi-info-circle-fill'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Автоматически удаляем через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Добавляем стили для анимаций, если их нет
if (!document.querySelector('#orders-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'orders-animation-styles';
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
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}