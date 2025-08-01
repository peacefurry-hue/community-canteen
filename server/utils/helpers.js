// 工具函数集合

// 生成唯一订单号
function generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD${timestamp.slice(-8)}${random}`;
}

// 验证邮箱格式
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 验证手机号格式
function isValidPhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// 格式化日期
function formatDate(date) {
    return new Date(date).toLocaleDateString('zh-CN');
}

// 格式化时间
function formatDateTime(date) {
    return new Date(date).toLocaleString('zh-CN');
}

// 计算两个日期之间的天数差
function daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}

// 验证配送日期是否有效（不能是过去的日期）
function isValidDeliveryDate(dateString) {
    const deliveryDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return deliveryDate >= today;
}

// 验证配送时间是否有效
function isValidMealTime(mealTime) {
    return ['lunch', 'dinner'].includes(mealTime);
}

// 计算订单总价
function calculateOrderTotal(items, menuItems) {
    let total = 0;
    
    for (const orderItem of items) {
        const menuItem = menuItems.find(item => item.id === orderItem.id);
        if (menuItem && menuItem.available) {
            total += menuItem.price * orderItem.quantity;
        }
    }
    
    return Math.round(total * 100) / 100; // 保留两位小数
}

// 验证订单项目
function validateOrderItems(items, menuItems) {
    if (!Array.isArray(items) || items.length === 0) {
        return { valid: false, message: '订单项目不能为空' };
    }
    
    for (const item of items) {
        if (!item.id || !item.quantity || item.quantity <= 0) {
            return { valid: false, message: '订单项目格式无效' };
        }
        
        const menuItem = menuItems.find(m => m.id === item.id);
        if (!menuItem) {
            return { valid: false, message: `菜品 ${item.id} 不存在` };
        }
        
        if (!menuItem.available) {
            return { valid: false, message: `菜品 ${menuItem.name} 暂不可用` };
        }
    }
    
    return { valid: true };
}

// 生成随机字符串
function generateRandomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// 安全地解析JSON
function safeJsonParse(str, defaultValue = null) {
    try {
        return JSON.parse(str);
    } catch (error) {
        return defaultValue;
    }
}

// 分页计算
function calculatePagination(page, limit, total) {
    const currentPage = Math.max(1, parseInt(page) || 1);
    const pageSize = Math.max(1, Math.min(100, parseInt(limit) || 10));
    const totalPages = Math.ceil(total / pageSize);
    const offset = (currentPage - 1) * pageSize;
    
    return {
        currentPage,
        pageSize,
        totalPages,
        total,
        offset,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
    };
}

// 过滤敏感信息
function sanitizeUser(user) {
    const { password, ...safeUser } = user;
    return safeUser;
}

// 验证订单状态
function isValidOrderStatus(status) {
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'];
    return validStatuses.includes(status);
}

// 获取状态的中文名称
function getStatusText(status) {
    const statusMap = {
        pending: '待处理',
        confirmed: '已确认',
        preparing: '制作中',
        ready: '待配送',
        delivering: '配送中',
        completed: '已完成',
        cancelled: '已取消'
    };
    return statusMap[status] || status;
}

// 获取分类的中文名称
function getCategoryText(category) {
    const categoryMap = {
        main: '主菜',
        dessert: '甜点',
        fruit: '水果',
        drink: '饮品'
    };
    return categoryMap[category] || category;
}

module.exports = {
    generateOrderNumber,
    isValidEmail,
    isValidPhone,
    formatDate,
    formatDateTime,
    daysBetween,
    isValidDeliveryDate,
    isValidMealTime,
    calculateOrderTotal,
    validateOrderItems,
    generateRandomString,
    safeJsonParse,
    calculatePagination,
    sanitizeUser,
    isValidOrderStatus,
    getStatusText,
    getCategoryText
};