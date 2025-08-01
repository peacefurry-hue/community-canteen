// 模拟数据库 - 在生产环境中应该使用真实数据库
import { v4 as uuidv4 } from 'uuid';

// 菜品数据
export const menuItems = [
  // 主菜
  {
    id: '1',
    name: '红烧肉',
    category: 'main',
    price: 28,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
    description: '肥瘦相间，软糯香甜',
    nutrition: '蛋白质丰富',
    available: true,
    preparationTime: 15
  },
  {
    id: '2',
    name: '宫保鸡丁',
    category: 'main',
    price: 25,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop',
    description: '酸甜微辣，嫩滑爽口',
    nutrition: '高蛋白低脂',
    available: true,
    preparationTime: 12
  },
  {
    id: '3',
    name: '麻婆豆腐',
    category: 'main',
    price: 18,
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop',
    description: '麻辣鲜香，嫩滑可口',
    nutrition: '植物蛋白',
    available: true,
    preparationTime: 10
  },
  {
    id: '4',
    name: '糖醋里脊',
    category: 'main',
    price: 32,
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&h=200&fit=crop',
    description: '酸甜可口，外酥内嫩',
    nutrition: '优质蛋白',
    available: true,
    preparationTime: 18
  },
  // 甜点
  {
    id: '5',
    name: '红豆汤圆',
    category: 'dessert',
    price: 12,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop',
    description: '软糯香甜，传统美味',
    nutrition: '碳水化合物',
    available: true,
    preparationTime: 8
  },
  {
    id: '6',
    name: '绿豆糕',
    category: 'dessert',
    price: 15,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop',
    description: '清香甘甜，口感细腻',
    nutrition: '维生素B',
    available: true,
    preparationTime: 5
  },
  // 水果
  {
    id: '7',
    name: '时令水果拼盘',
    category: 'fruit',
    price: 20,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
    description: '新鲜时令水果组合',
    nutrition: '维生素C丰富',
    available: true,
    preparationTime: 5
  },
  {
    id: '8',
    name: '苹果',
    category: 'fruit',
    price: 8,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=200&fit=crop',
    description: '脆甜多汁，营养丰富',
    nutrition: '膳食纤维',
    available: true,
    preparationTime: 2
  },
  // 饮品
  {
    id: '9',
    name: '柠檬蜂蜜茶',
    category: 'drink',
    price: 15,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop',
    description: '清香甘甜，生津止渴',
    nutrition: '维生素C',
    available: true,
    preparationTime: 3
  },
  {
    id: '10',
    name: '绿茶',
    category: 'drink',
    price: 10,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop',
    description: '清香淡雅，回甘悠长',
    nutrition: '抗氧化',
    available: true,
    preparationTime: 2
  }
];

// 订单数据
export let orders = [];

// 管理员数据
export const admins = [
  {
    id: 'admin1',
    username: 'admin',
    password: '$2a$10$3aDDQh/ORuXl9Gtd.RmslODzkRUlvfpVKtW8XQUR0ldgd3akCmio.', // password
    name: '管理员',
    role: 'admin',
    email: 'admin@community-canteen.com',
    createdAt: new Date().toISOString()
  }
];

// 统计数据
export let statistics = {
  totalOrders: 0,
  totalRevenue: 0,
  todayOrders: 0,
  todayRevenue: 0,
  popularItems: [],
  lastUpdated: new Date().toISOString()
};

// 数据库操作函数
export const db = {
  // 菜品操作
  getMenuItems: () => menuItems,
  getMenuItemById: (id) => menuItems.find(item => item.id === id),
  addMenuItem: (item) => {
    const newItem = { ...item, id: uuidv4(), createdAt: new Date().toISOString() };
    menuItems.push(newItem);
    return newItem;
  },
  updateMenuItem: (id, updates) => {
    const index = menuItems.findIndex(item => item.id === id);
    if (index !== -1) {
      menuItems[index] = { ...menuItems[index], ...updates, updatedAt: new Date().toISOString() };
      return menuItems[index];
    }
    return null;
  },
  deleteMenuItem: (id) => {
    const index = menuItems.findIndex(item => item.id === id);
    if (index !== -1) {
      return menuItems.splice(index, 1)[0];
    }
    return null;
  },

  // 订单操作
  getOrders: () => orders,
  getOrderById: (id) => orders.find(order => order.id === id),
  addOrder: (order) => {
    const newOrder = {
      ...order,
      id: uuidv4(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedTime: calculateEstimatedTime(order.deliveryDate, order.mealTime)
    };
    orders.push(newOrder);
    updateStatistics(newOrder);
    return newOrder;
  },
  updateOrderStatus: (id, status) => {
    const index = orders.findIndex(order => order.id === id);
    if (index !== -1) {
      orders[index].status = status;
      orders[index].updatedAt = new Date().toISOString();
      return orders[index];
    }
    return null;
  },

  // 管理员操作
  getAdminByUsername: (username) => admins.find(admin => admin.username === username),
  
  // 统计数据
  getStatistics: () => {
    updateDailyStatistics();
    return statistics;
  }
};

// 计算预计送达时间
function calculateEstimatedTime(deliveryDate, mealTime) {
  const date = new Date(deliveryDate);
  if (mealTime === 'lunch') {
    date.setHours(12, 0, 0, 0);
  } else {
    date.setHours(18, 30, 0, 0);
  }
  return date.toISOString();
}

// 更新统计数据
function updateStatistics(newOrder) {
  statistics.totalOrders++;
  statistics.totalRevenue += newOrder.totalPrice;
  
  // 更新热门商品
  newOrder.items.forEach(item => {
    const existing = statistics.popularItems.find(p => p.id === item.id);
    if (existing) {
      existing.count += item.quantity;
    } else {
      statistics.popularItems.push({
        id: item.id,
        name: item.name,
        count: item.quantity
      });
    }
  });
  
  // 排序热门商品
  statistics.popularItems.sort((a, b) => b.count - a.count);
  statistics.popularItems = statistics.popularItems.slice(0, 10);
  
  statistics.lastUpdated = new Date().toISOString();
}

// 更新每日统计
function updateDailyStatistics() {
  const today = new Date().toDateString();
  const todayOrders = orders.filter(order => 
    new Date(order.createdAt).toDateString() === today
  );
  
  statistics.todayOrders = todayOrders.length;
  statistics.todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalPrice, 0);
}