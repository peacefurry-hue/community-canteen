import { Food, FoodCategory } from '../types';

export const mockFoods: Food[] = [
  // 主菜
  {
    id: 'main-1',
    name: '红烧肉',
    price: 28,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=delicious%20braised%20pork%20belly%20in%20brown%20sauce%2C%20Chinese%20cuisine%2C%20glossy%20and%20tender%2C%20food%20photography&image_size=square',
    category: FoodCategory.MAIN,
    description: '肥瘦相间，入口即化',
    nutrition: '蛋白质丰富',
    isPopular: true
  },
  {
    id: 'main-2', 
    name: '宫保鸡丁',
    price: 25,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=kung%20pao%20chicken%20with%20peanuts%20and%20dried%20chili%2C%20Chinese%20stir%20fry%20dish%2C%20colorful%20and%20appetizing%2C%20food%20photography&image_size=square',
    category: FoodCategory.MAIN,
    description: '酸甜微辣，嫩滑爽口',
    nutrition: '高蛋白低脂肪'
  },
  {
    id: 'main-3',
    name: '麻婆豆腐',
    price: 18,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=mapo%20tofu%20with%20minced%20meat%20and%20spicy%20sauce%2C%20Sichuan%20cuisine%2C%20red%20oil%20and%20tender%20tofu%2C%20food%20photography&image_size=square',
    category: FoodCategory.MAIN,
    description: '麻辣鲜香，嫩滑可口',
    nutrition: '植物蛋白丰富',
    isPopular: true
  },

  // 甜点
  {
    id: 'dessert-1',
    name: '红豆汤圆',
    price: 12,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=sweet%20red%20bean%20soup%20with%20glutinous%20rice%20balls%2C%20traditional%20Chinese%20dessert%2C%20warm%20and%20comforting%2C%20food%20photography&image_size=square',
    category: FoodCategory.DESSERT,
    description: '软糯香甜，温暖心田',
    nutrition: '碳水化合物'
  },
  {
    id: 'dessert-2',
    name: '绿豆糕',
    price: 15,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20Chinese%20mung%20bean%20cake%2C%20delicate%20green%20color%2C%20square%20shaped%20pastry%2C%20elegant%20presentation%2C%20food%20photography&image_size=square',
    category: FoodCategory.DESSERT,
    description: '清香淡雅，口感细腻',
    nutrition: '清热解毒',
    isPopular: true
  },

  // 水果
  {
    id: 'fruit-1',
    name: '时令水果拼盘',
    price: 20,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20seasonal%20fruit%20platter%20with%20colorful%20mixed%20fruits%2C%20apple%20orange%20grape%20kiwi%2C%20healthy%20and%20vibrant%2C%20food%20photography&image_size=square',
    category: FoodCategory.FRUIT,
    description: '新鲜时令，营养丰富',
    nutrition: '维生素C丰富',
    isPopular: true
  },
  {
    id: 'fruit-2',
    name: '蜜瓜球',
    price: 16,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20cantaloupe%20melon%20balls%20in%20a%20bowl%2C%20orange%20colored%20sweet%20fruit%2C%20refreshing%20and%20juicy%2C%20food%20photography&image_size=square',
    category: FoodCategory.FRUIT,
    description: '香甜多汁，清爽解腻',
    nutrition: '水分充足'
  },

  // 饮品
  {
    id: 'drink-1',
    name: '柠檬蜂蜜茶',
    price: 18,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=refreshing%20lemon%20honey%20tea%20in%20glass%20cup%2C%20golden%20color%20with%20lemon%20slices%2C%20healthy%20beverage%2C%20food%20photography&image_size=square',
    category: FoodCategory.DRINK,
    description: '酸甜清香，生津止渴',
    nutrition: '维生素C',
    isPopular: true
  },
  {
    id: 'drink-2',
    name: '银耳莲子汤',
    price: 22,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20Chinese%20white%20fungus%20and%20lotus%20seed%20soup%2C%20clear%20nutritious%20broth%2C%20healthy%20dessert%20drink%2C%20food%20photography&image_size=square',
    category: FoodCategory.DRINK,
    description: '滋阴润燥，美容养颜',
    nutrition: '胶原蛋白'
  },
  {
    id: 'drink-3',
    name: '乌龙茶',
    price: 15,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20oolong%20tea%20in%20ceramic%20teacup%2C%20amber%20colored%20tea%2C%20elegant%20Chinese%20tea%20culture%2C%20food%20photography&image_size=square',
    category: FoodCategory.DRINK,
    description: '清香回甘，去油解腻',
    nutrition: '抗氧化'
  }
];

// 获取热门菜品
export const getPopularFoods = (): Food[] => {
  return mockFoods.filter(food => food.isPopular);
};

// 根据分类获取菜品
export const getFoodsByCategory = (category: FoodCategory): Food[] => {
  return mockFoods.filter(food => food.category === category);
};

// 根据ID获取菜品
export const getFoodById = (id: string): Food | undefined => {
  return mockFoods.find(food => food.id === id);
};