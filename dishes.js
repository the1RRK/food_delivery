// dishes.js - загрузка и хранение данных о блюдах

// Глобальная переменная для хранения блюд
let dishes = [];

// Функция для загрузки блюд из API
async function loadDishes() {
    try {
        console.log('Загрузка данных о блюдах из API...');
        
        const response = await fetch('https://raw.githubusercontent.com/the1RRK/food_delivery/main/dishes.json');
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Проверяем, что данные получены и являются массивом
        if (!Array.isArray(data)) {
            throw new Error('Данные не являются массивом');
        }
        
        console.log(`Успешно загружено ${data.length} блюд из API`);
        dishes = data;
        
        // Вызываем событие, чтобы другие скрипты знали, что данные загружены
        document.dispatchEvent(new CustomEvent('dishesLoaded', { 
            detail: { count: dishes.length }
        }));
        
        return dishes;
        
    } catch (error) {
        console.error('Ошибка при загрузке блюд из API:', error);
        
        // Если API не работает, используем локальные данные (fallback)
        console.log('Используем локальные данные...');
        dishes = getLocalDishes();
        
        // Вызываем событие с локальными данными
        document.dispatchEvent(new CustomEvent('dishesLoaded', { 
            detail: { count: dishes.length, isLocal: true }
        }));
        
        return dishes;
    }
}

// Функция с локальными данными (как fallback)
function getLocalDishes() {
    return [
        // Супы
        {
            keyword: 'tomato_soup',
            name: 'Томатный суп',
            price: 180,
            category: 'soup',
            count: '350 мл',
            image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop',
            kind: 'veg'
        },
        {
            keyword: 'chicken_soup',
            name: 'Куриный суп с лапшой',
            price: 200,
            category: 'soup',
            count: '400 мл',
            image: 'https://brusnika-kitchen.ru/d/sup_lapsha_kurinyj.jpg',
            kind: 'meat'
        },
        {
            keyword: 'mushroom_cream_soup',
            name: 'Грибной крем-суп',
            price: 220,
            category: 'soup',
            count: '350 мл',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
            kind: 'veg'
        },
        {
            keyword: 'fish_soup',
            name: 'Уха по-фински',
            price: 280,
            category: 'soup',
            count: '400 мл',
            image: 'https://sushilka-nt.ru/d/2c92ee2b7db82a303e7a077f786b5554.jpg',
            kind: 'fish'
        },
        {
            keyword: 'borscht',
            name: 'Борщ с говядиной',
            price: 240,
            category: 'soup',
            count: '400 мл',
            image: 'https://avatars.mds.yandex.net/i?id=f106fccde8ece161e9a479becd14b203_l-5655834-images-thumbs&n=13',
            kind: 'meat'
        },
        {
            keyword: 'pumpkin_soup',
            name: 'Тыквенный крем-суп',
            price: 210,
            category: 'soup',
            count: '350 мл',
            image: 'https://avatars.mds.yandex.net/i?id=4c1c4c53eb9ead00a8e6f69d504562abf41cfad7-4391477-images-thumbs&n=13',
            kind: 'veg'
        },
        
        // Главные блюда
        {
            keyword: 'pasta_carbonara',
            name: 'Паста Карбонара',
            price: 350,
            category: 'main',
            count: '350 г',
            image: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=300&h=200&fit=crop',
            kind: 'meat'
        },
        {
            keyword: 'chicken_cutlets',
            name: 'Куриные котлеты с пюре',
            price: 280,
            category: 'main',
            count: '400 г',
            image: 'https://avatars.mds.yandex.net/i?id=08c382906385215026658bb6803596dc100910d9-8496994-images-thumbs&n=13',
            kind: 'meat'
        },
        {
            keyword: 'vegetable_ratatouille',
            name: 'Овощной рататуй с сыром',
            price: 320,
            category: 'main',
            count: '380 г',
            image: 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=300&h=200&fit=crop',
            kind: 'veg'
        },
        {
            keyword: 'grilled_salmon',
            name: 'Лосось на гриле',
            price: 420,
            category: 'main',
            count: '300 г',
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop',
            kind: 'fish'
        },
        {
            keyword: 'beef_stroganoff',
            name: 'Бефстроганов',
            price: 380,
            category: 'main',
            count: '350 г',
            image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=300&h=200&fit=crop',
            kind: 'meat'
        },
        {
            keyword: 'vegetable_curry',
            name: 'Овощное карри',
            price: 290,
            category: 'main',
            count: '400 г',
            image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=300&h=200&fit=crop',
            kind: 'veg'
        },
        
        // Напитки
        {
            keyword: 'orange_juice',
            name: 'Апельсиновый сок',
            price: 120,
            category: 'drink',
            count: '300 мл',
            image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=200&fit=crop',
            kind: 'cold'
        },
        {
            keyword: 'apple_juice',
            name: 'Яблочный сок',
            price: 90,
            category: 'drink',
            count: '300 мл',
            image: 'https://avatars.mds.yandex.net/i?id=846336955cd2c93458b224b22843372feca9d704-9214559-images-thumbs&n=13',
            kind: 'cold'
        },
        {
            keyword: 'carrot_juice',
            name: 'Морковный сок',
            price: 110,
            category: 'drink',
            count: '300 мл',
            image: 'https://main-cdn.sbermegamarket.ru/big2/hlr-system/-15/876/480/409/191/726/100029253367b0.jpg',
            kind: 'cold'
        },
        {
            keyword: 'green_tea',
            name: 'Зеленый чай',
            price: 80,
            category: 'drink',
            count: '400 мл',
            image: 'https://img.freepik.com/premium-photo/cup-green-tea-with-leaves-white-background_787273-2374.jpg',
            kind: 'hot'
        },
        {
            keyword: 'black_tea',
            name: 'Черный чай',
            price: 80,
            category: 'drink',
            count: '400 мл',
            image: 'https://avatars.mds.yandex.net/i?id=304222a94e53b67474ad22c0f3c88ef1_l-5222242-images-thumbs&n=13',
            kind: 'hot'
        },
        {
            keyword: 'coffee',
            name: 'Кофе американо',
            price: 130,
            category: 'drink',
            count: '300 мл',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop',
            kind: 'hot'
        },
        
        // Салаты и стартеры
        {
            keyword: 'caesar_salad',
            name: 'Цезарь с курицей',
            price: 320,
            category: 'salad',
            count: '280 г',
            image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop',
            kind: 'meat'
        },
        {
            keyword: 'shrimp_salad',
            name: 'Салат с креветками',
            price: 380,
            category: 'salad',
            count: '250 г',
            image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=300&h=200&fit=crop',
            kind: 'fish'
        },
        {
            keyword: 'greek_salad',
            name: 'Греческий салат',
            price: 280,
            category: 'salad',
            count: '300 г',
            image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
            kind: 'veg'
        },
        {
            keyword: 'caprese_salad',
            name: 'Капрезе',
            price: 260,
            category: 'salad',
            count: '220 г',
            image: 'https://avatars.mds.yandex.net/i?id=e09925ca240bd55c35db3a320533d5a7_l-9099802-images-thumbs&n=13',
            kind: 'veg'
        },
        {
            keyword: 'vegetable_salad',
            name: 'Овощной салат',
            price: 190,
            category: 'salad',
            count: '300 г',
            image: 'https://avatars.mds.yandex.net/i?id=47ed65ddd8221d733d8ab8dd19e1eed3_l-6533913-images-thumbs&n=13',
            kind: 'veg'
        },
        {
            keyword: 'fruit_salad',
            name: 'Фруктовый салат',
            price: 210,
            category: 'salad',
            count: '280 г',
            image: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=300&h=200&fit=crop',
            kind: 'veg'
        },
        
        // Десерты
        {
            keyword: 'tiramisu',
            name: 'Тирамису',
            price: 220,
            category: 'dessert',
            count: '150 г',
            image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop',
            kind: 'medium'
        },
        {
            keyword: 'cheesecake',
            name: 'Чизкейк Нью-Йорк',
            price: 240,
            category: 'dessert',
            count: '180 г',
            image: 'https://avatars.mds.yandex.net/i?id=22311dc6b809da2359eb66e02e171123f1605054-2856395-images-thumbs&n=13',
            kind: 'medium'
        },
        {
            keyword: 'chocolate_cake',
            name: 'Шоколадный торт',
            price: 190,
            category: 'dessert',
            count: '120 г',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop',
            kind: 'small'
        },
        {
            keyword: 'apple_pie',
            name: 'Яблочный пирог',
            price: 160,
            category: 'dessert',
            count: '130 г',
            image: 'https://cdn.food.ru/unsigned/fit/640/480/ce/0/czM6Ly9tZWRpYS9waWN0dXJlcy8yMDI0MDYxNC8zUWVIRUYucG5n.jpg',
            kind: 'small'
        },
        {
            keyword: 'ice_cream',
            name: 'Мороженое пломбир',
            price: 140,
            category: 'dessert',
            count: '100 г',
            image: 'https://avatars.mds.yandex.net/get-eda/3813301/549fbc53ff37cedf87c80e65d356e5fa/orig',
            kind: 'small'
        },
        {
            keyword: 'napoleon_cake',
            name: 'Торт Наполеон',
            price: 280,
            category: 'dessert',
            count: '200 г',
            image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=300&h=200&fit=crop',
            kind: 'large'
        }
    ];
}

// Экспортируем функции и переменные для использования в других скриптах
if (typeof module !== 'undefined' && module.exports) {
    // Для Node.js
    module.exports = { dishes, loadDishes, getLocalDishes };
} else {
    // Для браузера - делаем глобально доступными
    window.dishes = dishes;
    window.loadDishes = loadDishes;
    window.getLocalDishes = getLocalDishes;
}