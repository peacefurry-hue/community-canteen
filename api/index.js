// Vercel serverless函数入口
export default function handler(req, res) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, method } = req;
  
  // 健康检查
  if (url === '/api/health') {
    return res.json({
      status: 'ok',
      message: '社区小饭桌API服务运行正常',
      timestamp: new Date().toISOString(),
      version: '1.1.0'
    });
  }
  
  // 菜品分类列表
  if (url === '/api/menu/categories/list') {
    const categories = [
      { key: 'main', name: '主菜', icon: '🍖' },
      { key: 'dessert', name: '甜点', icon: '🍰' },
      { key: 'fruit', name: '水果', icon: '🍎' },
      { key: 'drink', name: '饮品', icon: '🥤' }
    ];
    
    return res.json({
      success: true,
      data: categories
    });
  }
  
  // 菜品列表
  if (url === '/api/menu' || url.startsWith('/api/menu?')) {
    const menuItems = [
      {
        id: '1',
        name: '红烧肉',
        price: 28,
        category: 'main',
        description: '肥瘦相间，入口即化',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop',
        available: true,
        isHot: true
      },
      {
        id: '2',
        name: '麻婆豆腐',
        price: 18,
        category: 'main',
        description: '麻辣鲜香，嫩滑可口',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop',
        available: true,
        isHot: true
      },
      {
        id: '3',
        name: '绿豆糕',
        price: 15,
        category: 'dessert',
        description: '清香淡雅，口感细腻',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop',
        available: true,
        isHot: true
      },
      {
        id: '4',
        name: '时令水果拼盘',
        price: 20,
        category: 'fruit',
        description: '新鲜时令，营养丰富',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop',
        available: true,
        isHot: true
      },
      {
        id: '5',
        name: '柠檬蜂蜜茶',
        price: 18,
        category: 'drink',
        description: '酸甜清香，生津止渴',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop',
        available: true,
        isHot: true
      }
    ];
    
    return res.json({
      success: true,
      data: menuItems,
      total: menuItems.length
    });
  }
  
  // 创建订单
  if (url === '/api/orders' && method === 'POST') {
    const orderData = req.body;
    const orderId = 'ORDER_' + Date.now();
    
    return res.json({
      success: true,
      message: '订单创建成功',
      data: {
        id: orderId,
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    });
  }
  
  // 管理后台相关
  if (url.startsWith('/admin/')) {
    // 返回简单的管理页面
    const adminHtml = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>社区小饭桌 - 管理后台</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            h1 { color: #333; text-align: center; }
            .status { padding: 20px; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; color: #155724; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🍱 社区小饭桌管理后台</h1>
            <div class="status">
                <h3>✅ 系统状态正常</h3>
                <p>API服务已成功部署到Vercel</p>
                <p>访问时间: ${new Date().toLocaleString('zh-CN')}</p>
            </div>
        </div>
    </body>
    </html>`;
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(adminHtml);
  }
  
  // 404处理
  res.status(404).json({
    success: false,
    error: '接口不存在',
    path: url
  });
}