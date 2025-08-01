// 管理后台JavaScript代码
class AdminApp {
    constructor() {
        // 自动检测环境并设置正确的API地址
        this.baseURL = this.getApiBaseUrl();
        this.token = localStorage.getItem('adminToken');
        this.currentPage = 'dashboard';
        this.isLoading = false;
        this.init();
    }

    getApiBaseUrl() {
        // 检测当前环境
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            // 本地开发环境
            return 'http://localhost:3001/api';
        } else if (hostname.includes('vercel.app')) {
            // Vercel部署环境
            return `${window.location.protocol}//${window.location.host}/api`;
        } else {
            // 其他环境，使用相对路径
            return '/api';
        }
    }

    init() {
        console.log('初始化管理后台应用...');
        console.log('baseURL:', this.baseURL);
        console.log('当前token:', this.token ? '存在' : '不存在');
        
        // 初始化Lucide图标（安全检查）
        try {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
                console.log('Lucide图标初始化成功');
            } else {
                console.warn('Lucide库未加载，跳过图标初始化');
            }
        } catch (error) {
            console.warn('Lucide图标初始化失败:', error);
        }
        
        // 检查登录状态
        if (this.token) {
            console.log('发现已保存的token，验证中...');
            this.verifyToken();
        } else {
            console.log('没有token，显示登录页面');
            this.showLoginPage();
        }

        // 绑定事件
        this.bindEvents();
        console.log('管理后台应用初始化完成');
    }

    bindEvents() {
        // 登录表单
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // 退出登录
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // 侧边栏导航
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.switchPage(page);
            });
        });

        // 订单管理
        document.getElementById('orderStatusFilter').addEventListener('change', () => {
            this.loadOrders();
        });

        document.getElementById('refreshOrders').addEventListener('click', () => {
            this.loadOrders();
        });

        // 菜品管理
        document.getElementById('addMenuItemBtn').addEventListener('click', () => {
            this.showAddMenuModal();
        });

        document.getElementById('cancelAddMenu').addEventListener('click', () => {
            this.hideAddMenuModal();
        });

        document.getElementById('addMenuForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addMenuItem();
        });

        // 报告生成
        document.getElementById('generateReport').addEventListener('click', () => {
            this.generateReport();
        });
    }

    async login() {
        // 防止重复提交
        if (this.isLoading) {
            console.log('登录正在进行中，忽略重复请求');
            return;
        }

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        console.log('开始登录:', { username, baseURL: this.baseURL });
        
        if (!username || !password) {
            this.showError('loginError', '请输入用户名和密码');
            return;
        }
        
        this.isLoading = true;
        this.setLoading('login', true);
        
        try {
            console.log('发送登录请求...');
            const response = await fetch(`${this.baseURL}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            console.log('收到响应:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('响应数据:', data);

            if (data.success) {
                console.log('登录成功');
                this.token = data.data.token;
                localStorage.setItem('adminToken', this.token);
                localStorage.setItem('adminInfo', JSON.stringify(data.data.user));
                this.showMainApp();
                this.loadDashboard();
            } else {
                console.log('登录失败:', data.message);
                this.showError('loginError', data.message || '登录失败');
            }
        } catch (error) {
            console.error('登录错误:', error);
            this.showError('loginError', '登录失败: ' + error.message);
        } finally {
            console.log('重置登录按钮状态');
            this.isLoading = false;
            this.setLoading('login', false);
        }
    }

    async verifyToken() {
        // 简化验证逻辑，如果有token就直接显示主应用
        // 在实际项目中应该向服务器验证token的有效性
        if (this.token) {
            this.showMainApp();
            this.loadDashboard();
        } else {
            this.logout();
        }
    }

    logout() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        this.token = null;
        this.showLoginPage();
    }

    showLoginPage() {
        document.getElementById('loginPage').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }

    showMainApp() {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        
        // 显示管理员信息
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
        document.getElementById('adminName').textContent = adminInfo.name || '管理员';
    }

    switchPage(page) {
        // 更新侧边栏状态
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(p => {
            p.classList.add('hidden');
        });

        // 显示目标页面
        document.getElementById(`${page}Page`).classList.remove('hidden');
        this.currentPage = page;

        // 加载页面数据
        switch (page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'orders':
                this.loadOrders();
                break;
            case 'menu':
                this.loadMenu();
                break;
            case 'reports':
                this.loadReports();
                break;
        }
    }

    async loadDashboard() {
        try {
            const response = await fetch(`${this.baseURL}/admin/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                this.updateDashboardStats(data.data);
                this.renderOrdersChart(data.data.dailyOrders);
                this.renderRecentOrders(data.data.recentOrders);
            }
        } catch (error) {
            console.error('加载仪表板数据失败:', error);
        }
    }

    updateDashboardStats(data) {
        document.getElementById('todayOrders').textContent = data.statistics.todayOrders;
        document.getElementById('todayRevenue').textContent = `¥${data.statistics.todayRevenue.toFixed(2)}`;
        
        // 计算待处理订单数
        const pendingCount = data.statusDistribution.pending || 0;
        document.getElementById('pendingOrders').textContent = pendingCount;
        
        document.getElementById('totalMenuItems').textContent = data.menuStats.total;
    }

    renderOrdersChart(dailyOrders) {
        const ctx = document.getElementById('ordersChart').getContext('2d');
        
        // 销毁现有图表
        if (this.ordersChart) {
            this.ordersChart.destroy();
        }

        this.ordersChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dailyOrders.map(d => new Date(d.date).toLocaleDateString()),
                datasets: [{
                    label: '订单数量',
                    data: dailyOrders.map(d => d.count),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    renderRecentOrders(orders) {
        const container = document.getElementById('recentOrders');
        
        if (orders.length === 0) {
            container.innerHTML = '<p class="text-gray-500">暂无订单</p>';
            return;
        }

        container.innerHTML = orders.slice(0, 5).map(order => `
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                    <p class="font-medium">${order.orderNumber}</p>
                    <p class="text-sm text-gray-600">¥${order.totalPrice.toFixed(2)}</p>
                </div>
                <span class="px-2 py-1 text-xs rounded-full ${this.getStatusColor(order.status)}">
                    ${this.getStatusText(order.status)}
                </span>
            </div>
        `).join('');
    }

    async loadOrders() {
        try {
            const status = document.getElementById('orderStatusFilter').value;
            const params = new URLSearchParams();
            if (status) params.append('status', status);

            const response = await fetch(`${this.baseURL}/admin/orders?${params}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                this.renderOrdersTable(data.data);
            }
        } catch (error) {
            console.error('加载订单失败:', error);
        }
    }

    renderOrdersTable(orders) {
        const container = document.getElementById('ordersTable');
        
        if (orders.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">暂无订单</p>';
            return;
        }

        container.innerHTML = `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单号</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">配送时间</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${orders.map(order => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    ${order.orderNumber}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ¥${order.totalPrice.toFixed(2)}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs rounded-full ${this.getStatusColor(order.status)}">
                                        ${this.getStatusText(order.status)}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${order.deliveryDate} ${order.mealTime === 'lunch' ? '午餐' : '晚餐'}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${new Date(order.createdAt).toLocaleString()}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <select onchange="adminApp.updateOrderStatus('${order.id}', this.value)" 
                                            class="text-sm border border-gray-300 rounded px-2 py-1">
                                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>待处理</option>
                                        <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>已确认</option>
                                        <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>制作中</option>
                                        <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>待配送</option>
                                        <option value="delivering" ${order.status === 'delivering' ? 'selected' : ''}>配送中</option>
                                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>已完成</option>
                                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>已取消</option>
                                    </select>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    async updateOrderStatus(orderId, status) {
        try {
            const response = await fetch(`${this.baseURL}/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ status })
            });

            const data = await response.json();

            if (data.success) {
                this.showToast('订单状态更新成功', 'success');
                this.loadOrders(); // 重新加载订单列表
            } else {
                this.showToast(data.message, 'error');
            }
        } catch (error) {
            this.showToast('更新失败', 'error');
        }
    }

    async loadMenu() {
        try {
            const response = await fetch(`${this.baseURL}/menu`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                this.renderMenuTable(data.data);
            }
        } catch (error) {
            console.error('加载菜品失败:', error);
        }
    }

    renderMenuTable(menuItems) {
        const container = document.getElementById('menuTable');
        
        container.innerHTML = `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">图片</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${menuItems.map(item => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <img src="${item.image}" alt="${item.name}" class="h-12 w-12 rounded-lg object-cover">
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    ${item.name}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${this.getCategoryText(item.category)}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ¥${item.price.toFixed(2)}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs rounded-full ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                        ${item.available ? '可用' : '不可用'}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button onclick="adminApp.toggleMenuItemStatus('${item.id}', ${!item.available})" 
                                            class="text-blue-600 hover:text-blue-900">
                                        ${item.available ? '禁用' : '启用'}
                                    </button>
                                    <button onclick="adminApp.deleteMenuItem('${item.id}')" 
                                            class="text-red-600 hover:text-red-900">
                                        删除
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    showAddMenuModal() {
        document.getElementById('addMenuModal').classList.remove('hidden');
    }

    hideAddMenuModal() {
        document.getElementById('addMenuModal').classList.add('hidden');
        document.getElementById('addMenuForm').reset();
    }

    async addMenuItem() {
        const form = document.getElementById('addMenuForm');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch(`${this.baseURL}/admin/menu`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                this.showToast('菜品添加成功', 'success');
                this.hideAddMenuModal();
                this.loadMenu();
            } else {
                this.showToast(result.message, 'error');
            }
        } catch (error) {
            this.showToast('添加失败', 'error');
        }
    }

    async toggleMenuItemStatus(itemId, available) {
        try {
            const response = await fetch(`${this.baseURL}/admin/menu/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ available })
            });

            const result = await response.json();

            if (result.success) {
                this.showToast('状态更新成功', 'success');
                this.loadMenu();
            } else {
                this.showToast(result.message, 'error');
            }
        } catch (error) {
            this.showToast('更新失败', 'error');
        }
    }

    async deleteMenuItem(itemId) {
        if (!confirm('确定要删除这个菜品吗？')) {
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/admin/menu/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const result = await response.json();

            if (result.success) {
                this.showToast('菜品删除成功', 'success');
                this.loadMenu();
            } else {
                this.showToast(result.message, 'error');
            }
        } catch (error) {
            this.showToast('删除失败', 'error');
        }
    }

    loadReports() {
        // 设置默认日期范围（最近7天）
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
        document.getElementById('endDate').value = endDate.toISOString().split('T')[0];

        this.generateReport();
    }

    async generateReport() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        try {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await fetch(`${this.baseURL}/admin/reports/business?${params}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                this.renderReport(data.data);
            }
        } catch (error) {
            console.error('生成报告失败:', error);
        }
    }

    renderReport(report) {
        const container = document.getElementById('reportContent');
        
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="card">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">总订单数</h3>
                    <p class="text-3xl font-bold text-blue-600">${report.summary.totalOrders}</p>
                </div>
                <div class="card">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">总营收</h3>
                    <p class="text-3xl font-bold text-green-600">¥${report.summary.totalRevenue.toFixed(2)}</p>
                </div>
                <div class="card">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">平均订单价值</h3>
                    <p class="text-3xl font-bold text-purple-600">¥${report.summary.averageOrderValue.toFixed(2)}</p>
                </div>
                <div class="card">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">完成订单数</h3>
                    <p class="text-3xl font-bold text-orange-600">${report.summary.completedOrders}</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="card">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">热门菜品</h3>
                    <div class="space-y-3">
                        ${report.popularItems.slice(0, 10).map((item, index) => `
                            <div class="flex justify-between items-center">
                                <span class="text-sm font-medium">${index + 1}. ${item.name}</span>
                                <span class="text-sm text-gray-600">${item.count}份 / ¥${item.revenue.toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="card">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">订单状态分布</h3>
                    <div class="space-y-3">
                        ${Object.entries(report.statusBreakdown).map(([status, count]) => `
                            <div class="flex justify-between items-center">
                                <span class="text-sm font-medium">${this.getStatusText(status)}</span>
                                <span class="text-sm text-gray-600">${count}单</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // 工具函数
    getStatusColor(status) {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            preparing: 'bg-orange-100 text-orange-800',
            ready: 'bg-purple-100 text-purple-800',
            delivering: 'bg-indigo-100 text-indigo-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }

    getStatusText(status) {
        const texts = {
            pending: '待处理',
            confirmed: '已确认',
            preparing: '制作中',
            ready: '待配送',
            delivering: '配送中',
            completed: '已完成',
            cancelled: '已取消'
        };
        return texts[status] || status;
    }

    getCategoryText(category) {
        const texts = {
            main: '主菜',
            dessert: '甜点',
            fruit: '水果',
            drink: '饮品'
        };
        return texts[category] || category;
    }

    setLoading(type, loading) {
        console.log(`setLoading: ${type} = ${loading}`);
        
        const text = document.getElementById(`${type}Text`);
        const spinner = document.getElementById(`${type}Loading`);
        
        if (!text) {
            console.error(`找不到元素: ${type}Text`);
            return;
        }
        
        if (!spinner) {
            console.error(`找不到元素: ${type}Loading`);
            return;
        }
        
        if (loading) {
            text.classList.add('hidden');
            spinner.classList.remove('hidden');
            console.log(`显示加载状态: ${type}`);
        } else {
            text.classList.remove('hidden');
            spinner.classList.add('hidden');
            console.log(`隐藏加载状态: ${type}`);
        }
    }

    showError(elementId, message) {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.classList.remove('hidden');
        
        setTimeout(() => {
            element.classList.add('hidden');
        }, 5000);
    }

    showToast(message, type = 'info') {
        // 创建toast元素
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // 3秒后移除
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3000);
    }
}

// 初始化应用
const adminApp = new AdminApp();