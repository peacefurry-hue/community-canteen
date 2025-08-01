import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../data/database.js';
import { generateToken, verifyToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 管理员登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      // 检查是否是HTML表单提交
      if (req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded')) {
        return res.status(400).send(`
          <html>
            <head><title>登录失败</title></head>
            <body style="font-family: Arial; text-align: center; padding: 50px;">
              <h2>❌ 登录失败</h2>
              <p>用户名和密码不能为空</p>
              <a href="/admin/pure-html-login.html" style="color: #007bff;">返回登录页面</a>
            </body>
          </html>
        `);
      }
      return res.status(400).json({
        success: false,
        message: '用户名和密码不能为空'
      });
    }
    
    // 查找管理员
    const admin = db.getAdminByUsername(username);
    if (!admin) {
      // 检查是否是HTML表单提交
      if (req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded')) {
        return res.status(401).send(`
          <html>
            <head><title>登录失败</title></head>
            <body style="font-family: Arial; text-align: center; padding: 50px;">
              <h2>❌ 登录失败</h2>
              <p>用户名或密码错误</p>
              <a href="/admin/pure-html-login.html" style="color: #007bff;">返回登录页面</a>
            </body>
          </html>
        `);
      }
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }
    
    // 验证密码
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      // 检查是否是HTML表单提交
      if (req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded')) {
        return res.status(401).send(`
          <html>
            <head><title>登录失败</title></head>
            <body style="font-family: Arial; text-align: center; padding: 50px;">
              <h2>❌ 登录失败</h2>
              <p>用户名或密码错误</p>
              <a href="/admin/pure-html-login.html" style="color: #007bff;">返回登录页面</a>
            </body>
          </html>
        `);
      }
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }
    
    // 生成JWT token
    const token = generateToken({ 
      id: admin.id, 
      username: admin.username, 
      role: admin.role 
    });
    
    // 返回用户信息（不包含密码）
    const { password: _, ...adminInfo } = admin;
    
    // 检查是否是HTML表单提交
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded')) {
      // HTML表单提交，返回成功页面
      return res.send(`
        <html>
          <head>
            <title>登录成功</title>
            <meta charset="UTF-8">
          </head>
          <body style="font-family: Arial; text-align: center; padding: 50px; background: #f8f9fa;">
            <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto;">
              <h2 style="color: #28a745;">✅ 登录成功！</h2>
              <p>登录成功！正在跳转到管理后台...</p>
              <p><a href="/admin/no-js-dashboard.html">如果没有自动跳转，请点击这里</a></p>
              <p><a href="/api/health">查看API数据</a></p>
              <script>
                  setTimeout(() => {
                      window.location.href = '/admin/no-js-dashboard.html';
                  }, 2000);
              </script>
              <script>
                // 保存token到localStorage（如果JavaScript可用）
                try {
                  localStorage.setItem('adminToken', '${token}');
                  console.log('Token已保存到localStorage');
                } catch(e) {
                  console.log('无法保存token:', e);
                }
              </script>
            </div>
          </body>
        </html>
      `);
    }
    
    // JSON API响应
    res.json({
      success: true,
      message: '登录成功',
      data: {
        admin: adminInfo,
        token
      }
    });
  } catch (error) {
    // 检查是否是HTML表单提交
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded')) {
      return res.status(500).send(`
        <html>
          <head><title>服务器错误</title></head>
          <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h2>❌ 服务器错误</h2>
            <p>登录失败: ${error.message}</p>
            <a href="/admin/pure-html-login.html" style="color: #007bff;">返回登录页面</a>
          </body>
        </html>
      `);
    }
    res.status(500).json({
      success: false,
      message: '登录失败',
      error: error.message
    });
  }
});



// 验证当前token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token有效',
    data: {
      user: req.user
    }
  });
});

// 退出登录
router.post('/logout', authenticateToken, (req, res) => {
  // 在实际应用中，可以将token加入黑名单
  res.json({
    success: true,
    message: '退出登录成功'
  });
});

export default router;