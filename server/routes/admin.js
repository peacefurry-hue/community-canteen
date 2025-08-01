import express from 'express';
import { db } from '../data/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 所有管理员路由都需要身份验证
router.use(authenticateToken);

// 获取仪表板数据
router.get('/dashboard', (req, res) => {
  try {
    const statistics = db.getStatistics();
    const orders = db.getOrders();
    const menuItems = db.getMenuItems();
    
    // 最近订单
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
    
    // 订单状态分布
    const statusDistribution = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    
    // 每日订单趋势（最近7天）
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    }).reverse();
    
    const dailyOrders = last7Days.map(date => ({
      date,
      count: orders.filter(order => 
        new Date(order.createdAt).toDateString() === date
      ).length,
      revenue: orders
        .filter(order => new Date(order.createdAt).toDateString() === date)
        .reduce((sum, order) => sum + order.totalPrice, 0)
    }));
    
    const dashboardData = {
      statistics,
      recentOrders,
      statusDistribution,
      dailyOrders,
      menuStats: {
        total: menuItems.length,
        available: menuItems.filter(item => item.available).length,
        unavailable: menuItems.filter(item => !item.available).length
      }
    };
    
    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取仪表板数据失败',
      error: error.message
    });
  }
});

// 管理菜品 - 添加菜品
router.post('/menu', (req, res) => {
  try {
    const { name, category, price, description, nutrition, image } = req.body;
    
    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: '菜品名称、分类和价格不能为空'
      });
    }
    
    const newItem = db.addMenuItem({
      name,
      category,
      price: parseFloat(price),
      description: description || '',
      nutrition: nutrition || '',
      image: image || '',
      available: true,
      preparationTime: 10
    });
    
    res.status(201).json({
      success: true,
      message: '菜品添加成功',
      data: newItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '添加菜品失败',
      error: error.message
    });
  }
});

// 管理菜品 - 更新菜品
router.put('/menu/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates.price) {
      updates.price = parseFloat(updates.price);
    }
    
    const updatedItem = db.updateMenuItem(id, updates);
    
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: '菜品不存在'
      });
    }
    
    res.json({
      success: true,
      message: '菜品更新成功',
      data: updatedItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新菜品失败',
      error: error.message
    });
  }
});

// 管理菜品 - 删除菜品
router.delete('/menu/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = db.deleteMenuItem(id);
    
    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: '菜品不存在'
      });
    }
    
    res.json({
      success: true,
      message: '菜品删除成功',
      data: deletedItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除菜品失败',
      error: error.message
    });
  }
});

// 获取所有订单（管理员视图）
router.get('/orders', (req, res) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;
    let orders = db.getOrders();
    
    // 筛选
    if (status) {
      orders = orders.filter(order => order.status === status);
    }
    
    if (date) {
      orders = orders.filter(order => 
        new Date(order.createdAt).toDateString() === new Date(date).toDateString()
      );
    }
    
    // 排序
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedOrders = orders.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedOrders,
      pagination: {
        current: parseInt(page),
        pageSize: parseInt(limit),
        total: orders.length,
        totalPages: Math.ceil(orders.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取订单列表失败',
      error: error.message
    });
  }
});

// 批量更新订单状态
router.patch('/orders/batch-status', (req, res) => {
  try {
    const { orderIds, status } = req.body;
    
    if (!orderIds || !Array.isArray(orderIds) || !status) {
      return res.status(400).json({
        success: false,
        message: '订单ID列表和状态不能为空'
      });
    }
    
    const updatedOrders = [];
    const errors = [];
    
    orderIds.forEach(id => {
      try {
        const updatedOrder = db.updateOrderStatus(id, status);
        if (updatedOrder) {
          updatedOrders.push(updatedOrder);
        } else {
          errors.push(`订单 ${id} 不存在`);
        }
      } catch (error) {
        errors.push(`更新订单 ${id} 失败: ${error.message}`);
      }
    });
    
    res.json({
      success: true,
      message: `成功更新 ${updatedOrders.length} 个订单`,
      data: {
        updated: updatedOrders,
        errors
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '批量更新订单状态失败',
      error: error.message
    });
  }
});

// 获取营业报告
router.get('/reports/business', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const orders = db.getOrders();
    
    let filteredOrders = orders;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= start && orderDate <= end;
      });
    }
    
    const report = {
      period: {
        startDate: startDate || '全部',
        endDate: endDate || '全部'
      },
      summary: {
        totalOrders: filteredOrders.length,
        totalRevenue: filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0),
        averageOrderValue: filteredOrders.length > 0 
          ? filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0) / filteredOrders.length 
          : 0,
        completedOrders: filteredOrders.filter(order => order.status === 'completed').length
      },
      statusBreakdown: filteredOrders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {}),
      popularItems: getPopularItems(filteredOrders),
      hourlyDistribution: getHourlyDistribution(filteredOrders)
    };
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取营业报告失败',
      error: error.message
    });
  }
});

// 辅助函数：获取热门商品
function getPopularItems(orders) {
  const itemCounts = {};
  
  orders.forEach(order => {
    order.items.forEach(item => {
      if (itemCounts[item.id]) {
        itemCounts[item.id].count += item.quantity;
        itemCounts[item.id].revenue += item.subtotal;
      } else {
        itemCounts[item.id] = {
          id: item.id,
          name: item.name,
          count: item.quantity,
          revenue: item.subtotal
        };
      }
    });
  });
  
  return Object.values(itemCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

// 辅助函数：获取小时分布
function getHourlyDistribution(orders) {
  const hourCounts = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: 0,
    revenue: 0
  }));
  
  orders.forEach(order => {
    const hour = new Date(order.createdAt).getHours();
    hourCounts[hour].count++;
    hourCounts[hour].revenue += order.totalPrice;
  });
  
  return hourCounts;
}

export default router;