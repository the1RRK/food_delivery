// dishes.js - массив всех блюд с их характеристиками
const dishes = [
    // Супы
    {
        keyword: 'tomato_soup',
        name: 'Томатный суп',
        price: 180,
        category: 'soup',
        count: '350 мл',
        image: 'https://via.placeholder.com/300x200?text=Томатный+суп',
        kind: 'veg' // вегетарианский
    },
    {
        keyword: 'chicken_soup',
        name: 'Куриный суп с лапшой',
        price: 200,
        category: 'soup',
        count: '400 мл',
        image: 'https://via.placeholder.com/300x200?text=Куриный+суп',
        kind: 'meat' // мясной
    },
    {
        keyword: 'mushroom_cream_soup',
        name: 'Грибной крем-суп',
        price: 220,
        category: 'soup',
        count: '350 мл',
        image: 'https://via.placeholder.com/300x200?text=Грибной+крем-суп',
        kind: 'veg' // вегетарианский
    },
    {
        keyword: 'fish_soup',
        name: 'Уха по-фински',
        price: 280,
        category: 'soup',
        count: '400 мл',
        image: 'https://via.placeholder.com/300x200?text=Уха+по-фински',
        kind: 'fish' // рыбный
    },
    {
        keyword: 'borscht',
        name: 'Борщ с говядиной',
        price: 240,
        category: 'soup',
        count: '400 мл',
        image: 'https://via.placeholder.com/300x200?text=Борщ+с+говядиной',
        kind: 'meat' // мясной
    },
    {
        keyword: 'pumpkin_soup',
        name: 'Тыквенный крем-суп',
        price: 210,
        category: 'soup',
        count: '350 мл',
        image: 'https://via.placeholder.com/300x200?text=Тыквенный+крем-суп',
        kind: 'veg' // вегетарианский
    },
    
    // Главные блюда
    {
        keyword: 'pasta_carbonara',
        name: 'Паста Карбонара',
        price: 350,
        category: 'main',
        count: '350 г',
        image: 'https://via.placeholder.com/300x200?text=Паста+Карбонара',
        kind: 'meat' // мясное
    },
    {
        keyword: 'chicken_cutlets',
        name: 'Куриные котлеты с пюре',
        price: 280,
        category: 'main',
        count: '400 г',
        image: 'https://via.placeholder.com/300x200?text=Куриные+котлеты',
        kind: 'meat' // мясное
    },
    {
        keyword: 'vegetable_ratatouille',
        name: 'Овощной рататуй с сыром',
        price: 320,
        category: 'main',
        count: '380 г',
        image: 'https://via.placeholder.com/300x200?text=Овощной+рататуй',
        kind: 'veg' // вегетарианское
    },
    {
        keyword: 'grilled_salmon',
        name: 'Лосось на гриле',
        price: 420,
        category: 'main',
        count: '300 г',
        image: 'https://via.placeholder.com/300x200?text=Лосось+на+гриле',
        kind: 'fish' // рыбное
    },
    {
        keyword: 'beef_stroganoff',
        name: 'Бефстроганов',
        price: 380,
        category: 'main',
        count: '350 г',
        image: 'https://via.placeholder.com/300x200?text=Бефстроганов',
        kind: 'meat' // мясное
    },
    {
        keyword: 'vegetable_curry',
        name: 'Овощное карри',
        price: 290,
        category: 'main',
        count: '400 г',
        image: 'https://via.placeholder.com/300x200?text=Овощное+карри',
        kind: 'veg' // вегетарианское
    },
    
    // Напитки
    {
        keyword: 'orange_juice',
        name: 'Апельсиновый сок',
        price: 120,
        category: 'drink',
        count: '300 мл',
        image: 'https://via.placeholder.com/300x200?text=Апельсиновый+сок',
        kind: 'cold' // холодный
    },
    {
        keyword: 'apple_juice',
        name: 'Яблочный сок',
        price: 90,
        category: 'drink',
        count: '300 мл',
        image: 'https://via.placeholder.com/300x200?text=Яблочный+сок',
        kind: 'cold' // холодный
    },
    {
        keyword: 'carrot_juice',
        name: 'Морковный сок',
        price: 110,
        category: 'drink',
        count: '300 мл',
        image: 'https://via.placeholder.com/300x200?text=Морковный+сок',
        kind: 'cold' // холодный
    },
    {
        keyword: 'green_tea',
        name: 'Зеленый чай',
        price: 80,
        category: 'drink',
        count: '400 мл',
        image: 'https://via.placeholder.com/300x200?text=Зеленый+чай',
        kind: 'hot' // горячий
    },
    {
        keyword: 'black_tea',
        name: 'Черный чай',
        price: 80,
        category: 'drink',
        count: '400 мл',
        image: 'https://via.placeholder.com/300x200?text=Черный+чай',
        kind: 'hot' // горячий
    },
    {
        keyword: 'coffee',
        name: 'Кофе американо',
        price: 130,
        category: 'drink',
        count: '300 мл',
        image: 'https://via.placeholder.com/300x200?text=Кофе+американо',
        kind: 'hot' // горячий
    },
    
    // Салаты и стартеры
    {
        keyword: 'caesar_salad',
        name: 'Цезарь с курицей',
        price: 320,
        category: 'salad',
        count: '280 г',
        image: 'https://via.placeholder.com/300x200?text=Цезарь+с+курицей',
        kind: 'meat' // мясной
    },
    {
        keyword: 'shrimp_salad',
        name: 'Салат с креветками',
        price: 380,
        category: 'salad',
        count: '250 г',
        image: 'https://via.placeholder.com/300x200?text=Салат+с+креветками',
        kind: 'fish' // рыбный
    },
    {
        keyword: 'greek_salad',
        name: 'Греческий салат',
        price: 280,
        category: 'salad',
        count: '300 г',
        image: 'https://via.placeholder.com/300x200?text=Греческий+салат',
        kind: 'veg' // вегетарианский
    },
    {
        keyword: 'caprese_salad',
        name: 'Капрезе',
        price: 260,
        category: 'salad',
        count: '220 г',
        image: 'https://via.placeholder.com/300x200?text=Капрезе',
        kind: 'veg' // вегетарианский
    },
    {
        keyword: 'vegetable_salad',
        name: 'Овощной салат',
        price: 190,
        category: 'salad',
        count: '300 г',
        image: 'https://via.placeholder.com/300x200?text=Овощной+салат',
        kind: 'veg' // вегетарианский
    },
    {
        keyword: 'fruit_salad',
        name: 'Фруктовый салат',
        price: 210,
        category: 'salad',
        count: '280 г',
        image: 'https://via.placeholder.com/300x200?text=Фруктовый+салат',
        kind: 'veg' // вегетарианский
    },
    
    // Десерты
    {
        keyword: 'tiramisu',
        name: 'Тирамису',
        price: 220,
        category: 'dessert',
        count: '150 г',
        image: 'https://via.placeholder.com/300x200?text=Тирамису',
        kind: 'medium' // средняя порция
    },
    {
        keyword: 'cheesecake',
        name: 'Чизкейк Нью-Йорк',
        price: 240,
        category: 'dessert',
        count: '180 г',
        image: 'https://via.placeholder.com/300x200?text=Чизкейк',
        kind: 'medium' // средняя порция
    },
    {
        keyword: 'chocolate_cake',
        name: 'Шоколадный торт',
        price: 190,
        category: 'dessert',
        count: '120 г',
        image: 'https://via.placeholder.com/300x200?text=Шоколадный+торт',
        kind: 'small' // маленькая порция
    },
    {
        keyword: 'apple_pie',
        name: 'Яблочный пирог',
        price: 160,
        category: 'dessert',
        count: '130 г',
        image: 'https://via.placeholder.com/300x200?text=Яблочный+пирог',
        kind: 'small' // маленькая порция
    },
    {
        keyword: 'ice_cream',
        name: 'Мороженое пломбир',
        price: 140,
        category: 'dessert',
        count: '100 г',
        image: 'https://via.placeholder.com/300x200?text=Мороженое',
        kind: 'small' // маленькая порция
    },
    {
        keyword: 'napoleon_cake',
        name: 'Торт Наполеон',
        price: 280,
        category: 'dessert',
        count: '200 г',
        image: 'https://via.placeholder.com/300x200?text=Торт+Наполеон',
        kind: 'large' // большая порция
    }
];