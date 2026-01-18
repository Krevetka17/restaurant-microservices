const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/menu_db');

const menuSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  imageUrl: String,
  ingredients: [String],
  allergens: [String],
  rating: Number
});

const Menu = mongoose.model('MenuItem', menuSchema);

const seedData = async () => {
  if (await Menu.countDocuments() === 0) {
    await Menu.insertMany([

      // Пицца 1–20
      { name: "Маргарита", description: "Томат, моцарелла, базилик", price: 89, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1600028068383-ea11a7a101f3?w=800", ingredients: ["томаты","моцарелла","базилик"], allergens: ["глютен","молоко"], rating: 4.7 },
      { name: "Пепперони", description: "Пепперони, сыр, томат", price: 110, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda76b974?w=800", ingredients: ["пепперони","моцарелла"], allergens: ["глютен","молоко"], rating: 4.8 },
      { name: "Четыре сыра", description: "Моцарелла, горгонзола, пармезан, чеддер", price: 125, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800", ingredients: ["моцарелла","горгонзола","пармезан","чеддер"], allergens: ["глютен","молоко"], rating: 4.6 },
      { name: "Гавайская", description: "Ветчина, ананас, сыр", price: 105, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800", ingredients: ["ветчина","ананас","моцарелла"], allergens: ["глютен","молоко"], rating: 4.3 },
      { name: "Диабло", description: "Острая салями, чили", price: 115, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1593560708920-61dd98c60f4f?w=800", ingredients: ["салями","чили"], allergens: ["глютен"], rating: 4.5 },
      { name: "Вегетарианская", description: "Овощи гриль, сыр", price: 99, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=800", ingredients: ["перец","грибы","кукуруза"], allergens: ["глютен","молоко"], rating: 4.4 },
      { name: "Карбонара пицца", description: "Бекон, яйцо, пармезан", price: 120, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1571066811602-716837d681de?w=800", ingredients: ["бекон","яйцо","пармезан"], allergens: ["глютен","яйцо","молоко"], rating: 4.6 },
      { name: "Барбекю курица", description: "Курица BBQ, лук", price: 118, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800", ingredients: ["курица","BBQ"], allergens: ["глютен","молоко"], rating: 4.7 },
      { name: "Морская", description: "Креветки, мидии, кальмары", price: 145, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800", ingredients: ["морепродукты"], allergens: ["глютен","моллюски"], rating: 4.5 },
      { name: "Прошутто руккола", description: "Прошутто, руккола, пармезан", price: 130, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1600028068383-ea11a7a101f3?w=800", ingredients: ["прошутто","руккола"], allergens: ["глютен","молоко"], rating: 4.8 },
      { name: "Салями оливки", description: "Салями, оливки, перец", price: 108, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda76b974?w=800", ingredients: ["салями","оливки"], allergens: ["глютен"], rating: 4.6 },
      { name: "Грибная трюфель", description: "Шампиньоны, трюфельное масло", price: 112, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800", ingredients: ["грибы","трюфель"], allergens: ["глютен","молоко"], rating: 4.5 },
      { name: "Цезарь пицца", description: "Курица, салат, соус цезарь", price: 122, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800", ingredients: ["курица","салат"], allergens: ["глютен","яйцо"], rating: 4.4 },
      { name: "Тунец оливки", description: "Тунец, красный лук, оливки", price: 135, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1593560708920-61dd98c60f4f?w=800", ingredients: ["тунец","оливки"], allergens: ["глютен","рыба"], rating: 4.7 },
      { name: "Буффало", description: "Курица буффало, голубой сыр", price: 128, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1600028068383-ea11a7a101f3?w=800", ingredients: ["курица","сыр"], allergens: ["глютен","молоко"], rating: 4.6 },
      { name: "Мясная deluxe", description: "Говядина, свинина, бекон", price: 140, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda76b974?w=800", ingredients: ["мясо ассорти"], allergens: ["глютен"], rating: 4.8 },
      { name: "Халапеньо спайси", description: "Халапеньо, салями, острый соус", price: 115, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800", ingredients: ["халапеньо","салями"], allergens: ["глютен"], rating: 4.5 },
      { name: "Капрезе", description: "Томаты черри, моцарелла буффало", price: 98, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800", ingredients: ["томаты","моцарелла"], allergens: ["глютен","молоко"], rating: 4.7 },
      { name: "Артишоки прошутто", description: "Артишоки, прошутто, сыр", price: 138, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1600028068383-ea11a7a101f3?w=800", ingredients: ["артишоки","прошутто"], allergens: ["глютен","молоко"], rating: 4.9 },
      { name: "Классическая томатная", description: "Томатный соус, моцарелла", price: 85, category: "Пицца", imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda76b974?w=800", ingredients: ["томаты","моцарелла"], allergens: ["глютен","молоко"], rating: 4.6 },

      // Бургеры 21–40
      { name: "Классический чизбургер", description: "Говядина 150г, сыр, овощи", price: 75, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800", ingredients: ["говядина","сыр","овощи"], allergens: ["глютен","молоко"], rating: 4.6 },
      { name: "BBQ бекон", description: "Говядина, бекон, BBQ соус", price: 95, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800", ingredients: ["говядина","бекон","BBQ"], allergens: ["глютен"], rating: 4.7 },
      { name: "Двойной чиз", description: "Две котлеты, двойной сыр", price: 110, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800", ingredients: ["говядина","сыр"], allergens: ["глютен","молоко"], rating: 4.8 },
      { name: "Куриный классик", description: "Куриная котлета, салат", price: 82, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1607013253062-f8cdda054b8d?w=800", ingredients: ["курица","овощи"], allergens: ["глютен"], rating: 4.5 },
      { name: "Беконатор", description: "Много бекона, говядина", price: 105, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800", ingredients: ["бекон","говядина"], allergens: ["глютен"], rating: 4.7 },
      { name: "Веган бургер", description: "Фалафель, авокадо", price: 88, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800", ingredients: ["фалафель","авокадо"], allergens: ["глютен"], rating: 4.4 },
      { name: "Острый чили", description: "Халапеньо, острый соус", price: 92, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800", ingredients: ["халапеньо","говядина"], allergens: ["глютен"], rating: 4.6 },
      { name: "Рыбный бургер", description: "Треска в панировке", price: 98, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1613769049987-b31b641f25b1?w=800", ingredients: ["треска"], allergens: ["глютен","рыба"], rating: 4.5 },
      { name: "Тройной мясной", description: "Три котлеты, бекон", price: 145, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800", ingredients: ["говядина","бекон"], allergens: ["глютен","молоко"], rating: 4.9 },
      { name: "Грибной", description: "Говядина, жареные грибы", price: 96, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800", ingredients: ["говядина","грибы"], allergens: ["глютен"], rating: 4.6 },
      { name: "Сырный взрыв", description: "Три вида сыра, говядина", price: 102, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800", ingredients: ["сыр","говядина"], allergens: ["глютен","молоко"], rating: 4.7 },
      { name: "Терияки курица", description: "Курица терияки, ананас", price: 90, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1607013253062-f8cdda054b8d?w=800", ingredients: ["курица","терияки"], allergens: ["глютен"], rating: 4.5 },
      { name: "Мексиканский", description: "Говядина, сальса, авокадо", price: 99, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800", ingredients: ["говядина","авокадо"], allergens: ["глютен"], rating: 4.6 },
      { name: "Блю чиз", description: "Голубой сыр, карамелизованный лук", price: 108, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800", ingredients: ["сыр","лук"], allergens: ["глютен","молоко"], rating: 4.8 },
      { name: "Крабовый", description: "Крабовое мясо, соус", price: 115, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1613769049987-b31b641f25b1?w=800", ingredients: ["краб"], allergens: ["глютен","ракообразные"], rating: 4.4 },
      { name: "Свинина BBQ", description: "Свиная котлета, BBQ", price: 94, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800", ingredients: ["свинина","BBQ"], allergens: ["глютен"], rating: 4.7 },
      { name: "Фалафель бургер", description: "Фалафель, тахина, овощи", price: 85, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800", ingredients: ["фалафель","тахина"], allergens: ["глютен","кунжут"], rating: 4.5 },
      { name: "Двойной бекон", description: "Две котлеты, двойной бекон", price: 120, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800", ingredients: ["говядина","бекон"], allergens: ["глютен"], rating: 4.8 },
      { name: "Курица пармезан", description: "Курица, пармезан, соус", price: 97, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1607013253062-f8cdda054b8d?w=800", ingredients: ["курица","пармезан"], allergens: ["глютен","молоко"], rating: 4.6 },
      { name: "Гриль бургер", description: "Говядина гриль, овощи", price: 88, category: "Бургеры", imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800", ingredients: ["говядина","овощи"], allergens: ["глютен"], rating: 4.7 },

      // Салаты 41–60
      { name: "Цезарь курица", description: "Ромэн, курица, пармезан", price: 85, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800", ingredients: ["ромэн","курица","пармезан"], allergens: ["глютен","молоко","яйцо"], rating: 4.8 },
      { name: "Греческий", description: "Огурцы, помидоры, фета", price: 78, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800", ingredients: ["огурцы","помидоры","фета"], allergens: ["молоко"], rating: 4.7 },
      { name: "Тунец", description: "Тунец, яйцо, овощи", price: 92, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800", ingredients: ["тунец","яйцо"], allergens: ["рыба","яйцо"], rating: 4.6 },
      { name: "Нисуаз", description: "Тунец, яйцо, фасоль", price: 98, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800", ingredients: ["тунец","фасоль"], allergens: ["рыба","яйцо"], rating: 4.5 },
      { name: "Капрезе", description: "Томаты, моцарелла, базилик", price: 82, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800", ingredients: ["томаты","моцарелла"], allergens: ["молоко"], rating: 4.7 },
      { name: "Шопский", description: "Огурцы, перец, брынза", price: 75, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800", ingredients: ["овощи","брынза"], allergens: ["молоко"], rating: 4.6 },
      { name: "Овощной микс", description: "Сезонные овощи, масло", price: 68, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800", ingredients: ["овощи"], allergens: [], rating: 4.4 },
      { name: "Курица авокадо", description: "Курица гриль, авокадо", price: 90, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800", ingredients: ["курица","авокадо"], allergens: [], rating: 4.7 },
      { name: "Креветки руккола", description: "Креветки, руккола, лимон", price: 110, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800", ingredients: ["креветки","руккола"], allergens: ["ракообразные"], rating: 4.8 },
      { name: "Киноа овощи", description: "Киноа, брокколи, перец", price: 88, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800", ingredients: ["киноа","овощи"], allergens: [], rating: 4.5 },
      { name: "Фета оливки", description: "Фета, оливки, помидоры", price: 80, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800", ingredients: ["фета","оливки"], allergens: ["молоко"], rating: 4.6 },
      { name: "Лосось шпинат", description: "Лосось копченый, шпинат", price: 120, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800", ingredients: ["лосось","шпинат"], allergens: ["рыба"], rating: 4.8 },
      { name: "Фруктовый салат", description: "Яблоки, груши, орехи", price: 72, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800", ingredients: ["фрукты","орехи"], allergens: ["орехи"], rating: 4.4 },
      { name: "Брокколи бекон", description: "Брокколи, бекон, сыр", price: 86, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800", ingredients: ["брокколи","бекон"], allergens: ["глютен","молоко"], rating: 4.5 },
      { name: "Теплый салат", description: "Курица, грибы, шпинат", price: 94, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800", ingredients: ["курица","грибы"], allergens: [], rating: 4.6 },
      { name: "Морковный изюм", description: "Морковь, изюм, орехи", price: 70, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800", ingredients: ["морковь","изюм"], allergens: ["орехи"], rating: 4.3 },
      { name: "Спаржа пармезан", description: "Спаржа, пармезан, лимон", price: 95, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800", ingredients: ["спаржа","пармезан"], allergens: ["молоко"], rating: 4.7 },
      { name: "Свекла фета", description: "Свекла, фета, орехи", price: 79, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800", ingredients: ["свекла","фета"], allergens: ["молоко","орехи"], rating: 4.5 },
      { name: "Кускус овощной", description: "Кускус, овощи гриль", price: 84, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800", ingredients: ["кускус","овощи"], allergens: ["глютен"], rating: 4.4 },
      { name: "Руккола груша", description: "Руккола, груша, сыр", price: 87, category: "Салаты", imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800", ingredients: ["руккола","груша","сыр"], allergens: ["молоко"], rating: 4.6 },

      // Паста 61–80
      { name: "Карбонара", description: "Спагетти, гуанчале, яйцо", price: 95, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800", ingredients: ["спагетти","гуанчале","яйцо"], allergens: ["глютен","яйцо","молоко"], rating: 4.9 },
      { name: "Болоньезе", description: "Спагетти, мясной соус", price: 98, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800", ingredients: ["спагетти","говядина"], allergens: ["глютен"], rating: 4.8 },
      { name: "Песто", description: "Пенне, песто, пармезан", price: 92, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=800", ingredients: ["пенне","песто"], allergens: ["глютен","орехи"], rating: 4.7 },
      { name: "Арабьята", description: "Пенне, острый томат", price: 88, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800", ingredients: ["пенне","чили"], allergens: ["глютен"], rating: 4.6 },
      { name: "Альфредо", description: "Феттуччине, сливочный соус", price: 105, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800", ingredients: ["феттуччине","сливки"], allergens: ["глютен","молоко"], rating: 4.8 },
      { name: "Лазанья мясная", description: "Лазанья, мясо, бешамель", price: 120, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=800", ingredients: ["лазанья","говядина"], allergens: ["глютен","молоко"], rating: 4.9 },
      { name: "Макароны сыр", description: "Макароны, чеддер, сливки", price: 85, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800", ingredients: ["макароны","сыр"], allergens: ["глютен","молоко"], rating: 4.5 },
      { name: "Равиоли шпинат", description: "Равиоли, шпинат, рикотта", price: 110, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800", ingredients: ["равиоли","шпинат"], allergens: ["глютен","молоко"], rating: 4.7 },
      { name: "Тальятелле грибы", description: "Тальятелле, шампиньоны", price: 102, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=800", ingredients: ["тальятелле","грибы"], allergens: ["глютен","молоко"], rating: 4.6 },
      { name: "Спагетти морепродукты", description: "Спагетти, креветки, мидии", price: 135, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800", ingredients: ["спагетти","морепродукты"], allergens: ["глютен","моллюски"], rating: 4.8 },
      { name: "Пенне с курицей", description: "Пенне, курица, сливочный соус", price: 96, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800", ingredients: ["пенне","курица"], allergens: ["глютен","молоко"], rating: 4.6 },
      { name: "Орекьетте брокколи", description: "Орекьетте, брокколи, чеснок", price: 89, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=800", ingredients: ["орекьетте","брокколи"], allergens: ["глютен"], rating: 4.5 },
      { name: "Фузилли песто", description: "Фузилли, песто, помидоры", price: 93, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800", ingredients: ["фузилли","песто"], allergens: ["глютен","орехи"], rating: 4.7 },
      { name: "Ригатони аматричана", description: "Ригатони, гуанчале, томат", price: 108, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800", ingredients: ["ригатони","гуанчале"], allergens: ["глютен"], rating: 4.8 },
      { name: "Лингвини с лимоном", description: "Лингвини, лимон, креветки", price: 118, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=800", ingredients: ["лингвини","креветки"], allergens: ["глютен","ракообразные"], rating: 4.7 },
      { name: "Паппарделле кабан", description: "Паппарделле, кабан, красное вино", price: 130, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800", ingredients: ["паппарделле","кабан"], allergens: ["глютен"], rating: 4.9 },
      { name: "Спагетти алло олио", description: "Спагетти, чеснок, оливковое масло", price: 78, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800", ingredients: ["спагетти","чеснок"], allergens: ["глютен"], rating: 4.4 },
      { name: "Тортеллини сыр", description: "Тортеллини, сыр, сливки", price: 112, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=800", ingredients: ["тортеллини","сыр"], allergens: ["глютен","молоко"], rating: 4.7 },
      { name: "Фарфалле лосось", description: "Фарфалле, лосось, сливки", price: 125, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800", ingredients: ["фарфалле","лосось"], allergens: ["глютен","рыба"], rating: 4.8 },
      { name: "Пенне с овощами", description: "Пенне, овощи гриль, томат", price: 90, category: "Паста", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800", ingredients: ["пенне","овощи"], allergens: ["глютен"], rating: 4.5 },

      // Суши 81–100
      { name: "Филадельфия", description: "Лосось, сыр, огурец", price: 120, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800", ingredients: ["лосось","сыр","огурец"], allergens: ["рыба","молоко","глютен"], rating: 4.7 },
      { name: "Калифорния", description: "Краб, авокадо, огурец", price: 95, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1550617931-eb3a88e84519?w=800", ingredients: ["краб","авокадо"], allergens: ["ракообразные","глютен"], rating: 4.6 },
      { name: "Дракон", description: "Угорь, авокадо, унаги", price: 140, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800", ingredients: ["угорь","авокадо"], allergens: ["рыба","глютен"], rating: 4.8 },
      { name: "Спайси тунец", description: "Тунец, острый соус", price: 110, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1550617931-eb3a88e84519?w=800", ingredients: ["тунец","спайси"], allergens: ["рыба","глютен"], rating: 4.7 },
      { name: "Креветка темпура", description: "Креветка темпура, соус", price: 105, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800", ingredients: ["креветка"], allergens: ["ракообразные","глютен"], rating: 4.6 },
      { name: "Лосось авокадо", description: "Лосось, авокадо", price: 115, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1550617931-eb3a88e84519?w=800", ingredients: ["лосось","авокадо"], allergens: ["рыба","глютен"], rating: 4.7 },
      { name: "Унаги", description: "Угорь, унаги соус", price: 130, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800", ingredients: ["угорь"], allergens: ["рыба","глютен"], rating: 4.8 },
      { name: "Краб спайси", description: "Краб, острый майо", price: 98, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1550617931-eb3a88e84519?w=800", ingredients: ["краб","майо"], allergens: ["ракообразные","глютен"], rating: 4.5 },
      { name: "Тунец халапеньо", description: "Тунец, халапеньо", price: 112, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800", ingredients: ["тунец","халапеньо"], allergens: ["рыба","глютен"], rating: 4.6 },
      { name: "Сяке", description: "Лосось свежий", price: 100, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1550617931-eb3a88e84519?w=800", ingredients: ["лосось"], allergens: ["рыба"], rating: 4.7 },
      { name: "Эби", description: "Креветка вареная", price: 90, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800", ingredients: ["креветка"], allergens: ["ракообразные"], rating: 4.5 },
      { name: "Хот ролл", description: "Темпура, лосось, сыр", price: 125, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1550617931-eb3a88e84519?w=800", ingredients: ["лосось","сыр"], allergens: ["рыба","молоко","глютен"], rating: 4.8 },
      { name: "Аляска", description: "Лосось, авокадо, огурец", price: 118, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800", ingredients: ["лосось","авокадо"], allergens: ["рыба","глютен"], rating: 4.7 },
      { name: "Канадский", description: "Угорь, сыр, огурец", price: 135, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1550617931-eb3a88e84519?w=800", ingredients: ["угорь","сыр"], allergens: ["рыба","молоко"], rating: 4.8 },
      { name: "Веган ролл", description: "Авокадо, огурец, морковь", price: 85, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800", ingredients: ["авокадо","огурец"], allergens: ["глютен"], rating: 4.4 },
      { name: "Темпура унаги", description: "Угорь темпура", price: 145, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1550617931-eb3a88e84519?w=800", ingredients: ["угорь"], allergens: ["рыба","глютен"], rating: 4.9 },
      { name: "Спайси лосось", description: "Лосось, спайси соус", price: 108, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800", ingredients: ["лосось","спайси"], allergens: ["рыба","глютен"], rating: 4.6 },
      { name: "Радужный ролл", description: "Ассорти рыбы сверху", price: 150, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1550617931-eb3a88e84519?w=800", ingredients: ["рыба ассорти"], allergens: ["рыба","глютен"], rating: 4.9 },
      { name: "Калифорния темпура", description: "Краб темпура, авокадо", price: 110, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800", ingredients: ["краб","авокадо"], allergens: ["ракообразные","глютен"], rating: 4.7 },
      { name: "Сяке темпура", description: "Лосось темпура", price: 128, category: "Суши", imageUrl: "https://images.unsplash.com/photo-1550617931-eb3a88e84519?w=800", ingredients: ["лосось"], allergens: ["рыба","глютен"], rating: 4.8 },

      // Десерты 101–120
      { name: "Тирамису", description: "Маскарпоне, кофе, савоярди", price: 65, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1571877227191-8a008f5e6b7a?w=800", ingredients: ["маскарпоне","кофе"], allergens: ["молоко","глютен","яйцо"], rating: 4.8 },
      { name: "Чизкейк классик", description: "Сливочный сыр, печенье", price: 70, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1533134242-4e6a9a0e0a8e?w=800", ingredients: ["сыр","печенье"], allergens: ["молоко","глютен"], rating: 4.7 },
      { name: "Мороженое ваниль", description: "Ванильное мороженое", price: 45, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800", ingredients: ["молоко","сахар"], allergens: ["молоко"], rating: 4.5 },
      { name: "Шоколадный брауни", description: "Шоколад, орехи", price: 68, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1606313561944-0f5f2c5a6c3a?w=800", ingredients: ["шоколад","орехи"], allergens: ["орехи","глютен"], rating: 4.8 },
      { name: "Панна котта", description: "Сливки, ягоды", price: 62, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800", ingredients: ["сливки","ягоды"], allergens: ["молоко"], rating: 4.6 },
      { name: "Макаронс ассорти", description: "Миндальное печенье", price: 55, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1558312657-b2dead03d494?w=800", ingredients: ["миндаль","сахар"], allergens: ["орехи"], rating: 4.7 },
      { name: "Крем-брюле", description: "Ванильный крем, карамель", price: 75, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1612201142855-7873bc1661b4?w=800", ingredients: ["сливки","яйцо"], allergens: ["молоко","яйцо"], rating: 4.8 },
      { name: "Наполеон", description: "Слоеное тесто, крем", price: 80, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1558301211-1935b23bdcda?w=800", ingredients: ["тесто","крем"], allergens: ["глютен","молоко"], rating: 4.6 },
      { name: "Эклер шоколад", description: "Заварное тесто, шоколад", price: 58, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=800", ingredients: ["тесто","шоколад"], allergens: ["глютен","молоко"], rating: 4.7 },
      { name: "Мильфей", description: "Слоеное тесто, крем", price: 72, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1558301211-1935b23bdcda?w=800", ingredients: ["тесто","крем"], allergens: ["глютен","молоко"], rating: 4.6 },
      { name: "Мороженое шоколад", description: "Шоколадное мороженое", price: 48, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800", ingredients: ["молоко","шоколад"], allergens: ["молоко"], rating: 4.5 },
      { name: "Профитроли", description: "Заварное тесто, крем", price: 85, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=800", ingredients: ["тесто","крем"], allergens: ["глютен","молоко"], rating: 4.8 },
      { name: "Тарт лимон", description: "Лимонный курд, тесто", price: 68, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1563998963-5e0c2e0d8a5d?w=800", ingredients: ["лимон","тесто"], allergens: ["глютен","яйцо"], rating: 4.7 },
      { name: "Мусс манго", description: "Манго, сливки", price: 70, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800", ingredients: ["манго","сливки"], allergens: ["молоко"], rating: 4.6 },
      { name: "Красный бархат", description: "Красный бисквит, крем", price: 78, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800", ingredients: ["бисквит","крем"], allergens: ["глютен","молоко"], rating: 4.8 },
      { name: "Медовик", description: "Медовые коржи, сметана", price: 75, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1558301211-1935b23bdcda?w=800", ingredients: ["мед","сметана"], allergens: ["глютен","молоко"], rating: 4.7 },
      { name: "Павлова", description: "Меренга, ягоды, сливки", price: 82, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800", ingredients: ["меренга","ягоды"], allergens: ["яйцо","молоко"], rating: 4.6 },
      { name: "Трюфели шоколад", description: "Шоколадные трюфели", price: 60, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1606313561944-0f5f2c5a6c3a?w=800", ingredients: ["шоколад"], allergens: ["молоко"], rating: 4.8 },
      { name: "Сникерс торт", description: "Шоколад, карамель, арахис", price: 88, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800", ingredients: ["шоколад","арахис"], allergens: ["арахис","молоко"], rating: 4.9 },
      { name: "Баунти десерт", description: "Кокос, шоколад", price: 65, category: "Десерты", imageUrl: "https://images.unsplash.com/photo-1606313561944-0f5f2c5a6c3a?w=800", ingredients: ["кокос","шоколад"], allergens: ["молоко"], rating: 4.7 },

      // Напитки 121–140
      { name: "Кола", description: "Кола 0.5 л", price: 25, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=800", ingredients: ["вода","сахар"], allergens: [], rating: 4.5 },
      { name: "Апельсиновый сок", description: "Свежевыжатый 0.3 л", price: 38, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800", ingredients: ["апельсин"], allergens: [], rating: 4.6 },
      { name: "Латте", description: "Эспрессо с молоком", price: 45, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=800", ingredients: ["кофе","молоко"], allergens: ["молоко"], rating: 4.7 },
      { name: "Капучино", description: "Эспрессо, молоко, пена", price: 48, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=800", ingredients: ["кофе","молоко"], allergens: ["молоко"], rating: 4.7 },
      { name: "Эспрессо", description: "Крепкий кофе", price: 35, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1494314671902-399b18174975?w=800", ingredients: ["кофе"], allergens: [], rating: 4.6 },
      { name: "Зеленый чай", description: "Зеленый чай 0.4 л", price: 30, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=800", ingredients: ["чай"], allergens: [], rating: 4.5 },
      { name: "Лимонад", description: "Лимон, мята, сахар", price: 40, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800", ingredients: ["лимон","мята"], allergens: [], rating: 4.6 },
      { name: "Мохито безалкогольный", description: "Мята, лайм, содовая", price: 55, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800", ingredients: ["мята","лайм"], allergens: [], rating: 4.7 },
      { name: "Ягодный смузи", description: "Ягоды, йогурт", price: 60, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800", ingredients: ["ягоды","йогурт"], allergens: ["молоко"], rating: 4.6 },
      { name: "Айс-кофе", description: "Холодный кофе со льдом", price: 50, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800", ingredients: ["кофе","лед"], allergens: [], rating: 4.6 },
      { name: "Чай с лимоном", description: "Черный чай, лимон", price: 32, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800", ingredients: ["чай","лимон"], allergens: [], rating: 4.5 },
      { name: "Горячий шоколад", description: "Шоколад, молоко", price: 55, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1542995470-3b4d1a2d4b3e?w=800", ingredients: ["шоколад","молоко"], allergens: ["молоко"], rating: 4.8 },
      { name: "Матча латте", description: "Матча, молоко", price: 65, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=800", ingredients: ["матча","молоко"], allergens: ["молоко"], rating: 4.7 },
      { name: "Гранатовый сок", description: "Гранат 0.3 л", price: 45, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800", ingredients: ["гранат"], allergens: [], rating: 4.6 },
      { name: "Яблочный сок", description: "Яблоко 0.3 л", price: 35, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800", ingredients: ["яблоко"], allergens: [], rating: 4.5 },
      { name: "Минеральная вода", description: "0.5 л", price: 20, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1616118132534-381148898bb4?w=800", ingredients: ["вода"], allergens: [], rating: 4.4 },
      { name: "Квас", description: "Классический квас", price: 30, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=800", ingredients: ["хлеб","сахар"], allergens: ["глютен"], rating: 4.5 },
      { name: "Комбуча", description: "Ферментированный чай", price: 55, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=800", ingredients: ["чай","сахар"], allergens: [], rating: 4.6 },
      { name: "Морс клюквенный", description: "Клюква, сахар", price: 40, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800", ingredients: ["клюква"], allergens: [], rating: 4.6 },
      { name: "Матча холодный", description: "Холодный матча латте", price: 68, category: "Напитки", imageUrl: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=800", ingredients: ["матча","молоко"], allergens: ["молоко"], rating: 4.7 },

      // Завтраки 141–160
      { name: "Овсянка ягоды", description: "Овсянка, клубника, черника", price: 55, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800", ingredients: ["овсянка","ягоды"], allergens: [], rating: 4.6 },
      { name: "Яичница бекон", description: "Яйца, бекон, помидоры", price: 68, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=800", ingredients: ["яйца","бекон"], allergens: ["яйцо"], rating: 4.5 },
      { name: "Тосты авокадо", description: "Хлеб, авокадо, яйцо", price: 72, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=800", ingredients: ["хлеб","авокадо"], allergens: ["глютен"], rating: 4.7 },
      { name: "Сырники", description: "Творог, сахар, сметана", price: 65, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800", ingredients: ["творог","сметана"], allergens: ["молоко","глютен"], rating: 4.8 },
      { name: "Омлет овощной", description: "Яйца, овощи, сыр", price: 70, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=800", ingredients: ["яйца","овощи"], allergens: ["яйцо","молоко"], rating: 4.6 },
      { name: "Гранола йогурт", description: "Гранола, йогурт, фрукты", price: 60, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800", ingredients: ["гранола","йогурт"], allergens: ["молоко","глютен"], rating: 4.7 },
      { name: "Блины с медом", description: "Блины, мед, ягоды", price: 58, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800", ingredients: ["мука","мед"], allergens: ["глютен"], rating: 4.6 },
      { name: "Тосты с яйцом", description: "Хлеб, яйцо пашот", price: 68, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=800", ingredients: ["хлеб","яйцо"], allergens: ["глютен","яйцо"], rating: 4.5 },
      { name: "Каша гречневая", description: "Гречка, молоко", price: 50, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800", ingredients: ["гречка","молоко"], allergens: ["молоко"], rating: 4.4 },
      { name: "Французский тост", description: "Хлеб, яйцо, сироп", price: 75, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1484723091739-30a97d4ef5e7?w=800", ingredients: ["хлеб","яйцо"], allergens: ["глютен","яйцо"], rating: 4.7 },
      { name: "Йогурт с гранолой", description: "Йогурт, гранола, мед", price: 55, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800", ingredients: ["йогурт","гранола"], allergens: ["молоко","глютен"], rating: 4.6 },
      { name: "Круассан с джемом", description: "Круассан, джем", price: 60, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800", ingredients: ["тесто","джем"], allergens: ["глютен"], rating: 4.7 },
      { name: "Овсянка банан", description: "Овсянка, банан, орехи", price: 58, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800", ingredients: ["овсянка","банан"], allergens: ["орехи"], rating: 4.6 },
      { name: "Яйца бенедикт", description: "Яйцо пашот, бекон, соус", price: 85, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=800", ingredients: ["яйцо","бекон"], allergens: ["яйцо","глютен"], rating: 4.8 },
      { name: "Смузи боул", description: "Фрукты, йогурт, гранола", price: 70, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800", ingredients: ["фрукты","йогурт"], allergens: ["молоко","глютен"], rating: 4.7 },
      { name: "Блинчики с творогом", description: "Блины, творог, изюм", price: 65, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800", ingredients: ["блины","творог"], allergens: ["глютен","молоко"], rating: 4.6 },
      { name: "Тосты с арахисовой пастой", description: "Хлеб, арахисовая паста", price: 55, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=800", ingredients: ["хлеб","арахис"], allergens: ["глютен","арахис"], rating: 4.5 },
      { name: "Каша рисовая", description: "Рис, молоко, изюм", price: 52, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800", ingredients: ["рис","молоко"], allergens: ["молоко"], rating: 4.4 },
      { name: "Круассан с сыром", description: "Круассан, сыр", price: 62, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800", ingredients: ["тесто","сыр"], allergens: ["глютен","молоко"], rating: 4.6 },
      { name: "Омлет с ветчиной", description: "Яйца, ветчина, сыр", price: 72, category: "Завтраки", imageUrl: "https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=800", ingredients: ["яйца","ветчина"], allergens: ["яйцо","молоко"], rating: 4.6 },

      // Гриль 161–180
      { name: "Рибай стейк", description: "Говядина рибай 300г", price: 220, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1600891964096-4316024b71f0?w=800", ingredients: ["говядина"], allergens: [], rating: 4.9 },
      { name: "Куриные крылья BBQ", description: "Крылья, BBQ соус", price: 85, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800", ingredients: ["курица","BBQ"], allergens: [], rating: 4.6 },
      { name: "Свиные рёбрышки", description: "Рёбрышки в соусе", price: 140, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1544025162-d766942659cb?w=800", ingredients: ["свинина"], allergens: [], rating: 4.8 },
      { name: "Куриная грудка гриль", description: "Грудка, специи", price: 90, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800", ingredients: ["курица"], allergens: [], rating: 4.5 },
      { name: "Стейк стриплойн", description: "Говядина стриплойн 250г", price: 200, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1600891964096-4316024b71f0?w=800", ingredients: ["говядина"], allergens: [], rating: 4.8 },
      { name: "Люля-кебаб", description: "Баранина, специи", price: 110, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1544025162-d766942659cb?w=800", ingredients: ["баранина"], allergens: [], rating: 4.7 },
      { name: "Шашлык из свинины", description: "Свинина, лук, маринад", price: 120, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1544025162-d766942659cb?w=800", ingredients: ["свинина"], allergens: [], rating: 4.7 },
      { name: "Котлеты на гриле", description: "Говядина, специи", price: 95, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1600891964096-4316024b71f0?w=800", ingredients: ["говядина"], allergens: [], rating: 4.6 },
      { name: "Овощи гриль", description: "Перец, кабачок, баклажан", price: 70, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1604908177730-87e4e61c0e7a?w=800", ingredients: ["овощи"], allergens: [], rating: 4.5 },
      { name: "Форель гриль", description: "Форель, лимон, травы", price: 150, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1560717789-0d4be2b0c4a7?w=800", ingredients: ["форель"], allergens: ["рыба"], rating: 4.8 },
      { name: "Креветки гриль", description: "Креветки, чеснок", price: 130, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1560717789-0d4be2b0c4a7?w=800", ingredients: ["креветки"], allergens: ["ракообразные"], rating: 4.7 },
      { name: "Бургер на гриле", description: "Говядина гриль", price: 98, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800", ingredients: ["говядина"], allergens: ["глютен"], rating: 4.7 },
      { name: "Колбаски гриль", description: "Свиные колбаски", price: 88, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1544025162-d766942659cb?w=800", ingredients: ["свинина"], allergens: [], rating: 4.6 },
      { name: "Куриные наггетсы гриль", description: "Курица, специи", price: 80, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800", ingredients: ["курица"], allergens: [], rating: 4.5 },
      { name: "Стейк фланк", description: "Говядина фланк", price: 180, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1600891964096-4316024b71f0?w=800", ingredients: ["говядина"], allergens: [], rating: 4.7 },
      { name: "Скумбрия гриль", description: "Скумбрия, лимон", price: 110, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1560717789-0d4be2b0c4a7?w=800", ingredients: ["скумбрия"], allergens: ["рыба"], rating: 4.6 },
      { name: "Баранина ребрышки", description: "Баранина, специи", price: 160, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1544025162-d766942659cb?w=800", ingredients: ["баранина"], allergens: [], rating: 4.8 },
      { name: "Гриль микс", description: "Ассорти мяса", price: 250, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1600891964096-4316024b71f0?w=800", ingredients: ["мясо ассорти"], allergens: [], rating: 4.9 },
      { name: "Кальмары гриль", description: "Кальмары, чеснок", price: 115, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1560717789-0d4be2b0c4a7?w=800", ingredients: ["кальмары"], allergens: ["моллюски"], rating: 4.6 },
      { name: "Кукуруза гриль", description: "Кукуруза, масло", price: 45, category: "Гриль", imageUrl: "https://images.unsplash.com/photo-1604908177730-87e4e61c0e7a?w=800", ingredients: ["кукуруза"], allergens: [], rating: 4.5 },

      // Веган 181–200
      { name: "Фалафель в пите", description: "Нут, овощи, тахина", price: 70, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1593003292466-9e0c0e0b9b0e?w=800", ingredients: ["нут","овощи","тахина"], allergens: ["глютен","кунжут"], rating: 4.7 },
      { name: "Веган бургер", description: "Растительная котлета", price: 88, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800", ingredients: ["раст. котлета"], allergens: ["глютен"], rating: 4.5 },
      { name: "Киноа салат", description: "Киноа, авокадо, овощи", price: 82, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800", ingredients: ["киноа","авокадо"], allergens: [], rating: 4.6 },
      { name: "Хумус с питой", description: "Нут, тахина, специи", price: 60, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1577906096429-f73c2c312435?w=800", ingredients: ["нут","тахина"], allergens: ["кунжут","глютен"], rating: 4.7 },
      { name: "Веган паста", description: "Спагетти, томат, овощи", price: 85, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800", ingredients: ["спагетти","овощи"], allergens: ["глютен"], rating: 4.5 },
      { name: "Веган пицца", description: "Томат, овощи, веган сыр", price: 95, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=800", ingredients: ["овощи"], allergens: ["глютен"], rating: 4.6 },
      { name: "Смузи боул", description: "Фрукты, семена чиа", price: 68, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800", ingredients: ["фрукты","чиа"], allergens: [], rating: 4.7 },
      { name: "Тофу стир-фрай", description: "Тофу, овощи, соевый соус", price: 90, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800", ingredients: ["тофу","овощи"], allergens: ["соя"], rating: 4.6 },
      { name: "Чечевица карри", description: "Чечевица, кокосовое молоко", price: 75, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800", ingredients: ["чечевица","кокос"], allergens: [], rating: 4.7 },
      { name: "Веган тако", description: "Фасоль, авокадо, тортилья", price: 80, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800", ingredients: ["фасоль","авокадо"], allergens: ["глютен"], rating: 4.6 },
      { name: "Батат фри", description: "Батат, специи", price: 55, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1585109640785-8a2b7b4e6e6f?w=800", ingredients: ["батат"], allergens: [], rating: 4.5 },
      { name: "Веган суп томат", description: "Томаты, базилик", price: 65, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800", ingredients: ["томаты"], allergens: [], rating: 4.6 },
      { name: "Фалафель боул", description: "Фалафель, хумус, овощи", price: 85, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1593003292466-9e0c0e0b9b0e?w=800", ingredients: ["фалафель","хумус"], allergens: ["кунжут"], rating: 4.7 },
      { name: "Веган ролл", description: "Авокадо, огурец, морковь", price: 70, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800", ingredients: ["авокадо","огурец"], allergens: ["глютен"], rating: 4.5 },
      { name: "Кускус овощной", description: "Кускус, овощи", price: 78, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800", ingredients: ["кускус","овощи"], allergens: ["глютен"], rating: 4.6 },
      { name: "Веган чили", description: "Фасоль, томаты, специи", price: 82, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800", ingredients: ["фасоль","томаты"], allergens: [], rating: 4.7 },
      { name: "Салат табуле", description: "Булгур, петрушка, помидоры", price: 65, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800", ingredients: ["булгур","петрушка"], allergens: ["глютен"], rating: 4.6 },
      { name: "Веган паэлья", description: "Рис, овощи, шафран", price: 95, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800", ingredients: ["рис","овощи"], allergens: [], rating: 4.7 },
      { name: "Бобы эдамаме", description: "Эдамаме, соль", price: 50, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1589785209709-58eaaa9e0c3f?w=800", ingredients: ["эдамаме"], allergens: ["соя"], rating: 4.5 },
      { name: "Веган карри", description: "Овощи, кокосовое молоко", price: 88, category: "Веган", imageUrl: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800", ingredients: ["овощи","кокос"], allergens: [], rating: 4.7 }

    ]);
    console.log("База заполнена — ровно 200 позиций");
  }
};

seedData().catch(console.error);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/menu', async (req, res) => {
  const items = await Menu.find();
  res.json(items);
});

app.listen(5001, () => console.log("Menu Service running on http://localhost:5001"));