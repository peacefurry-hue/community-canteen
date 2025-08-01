// 菜品类型枚举
export enum FoodCategory {
  MAIN = 'main',
  DESSERT = 'dessert', 
  FRUIT = 'fruit',
  DRINK = 'drink'
}

// 用餐时段枚举
export enum MealTime {
  LUNCH = 'lunch',
  DINNER = 'dinner'
}

// 菜品接口
export interface Food {
  id: string;
  name: string;
  price: number;
  image: string;
  category: FoodCategory;
  description?: string;
  nutrition?: string;
  isPopular?: boolean;
}

// 购物车项目接口
export interface CartItem {
  food: Food;
  quantity: number;
}

// 订单接口
export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  deliveryDate: string;
  mealTime: MealTime;
  address: string;
  createdAt: Date;
  status: 'pending' | 'preparing' | 'completed';
}

// 地址接口
export interface Address {
  street: string;
  building?: string;
  room?: string;
  phone: string;
  note?: string;
}