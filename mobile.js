// 从 main.js 复制并优化移动端交互

let currentUser = null;
let currentTripId = null;
let currentCategory = 'documents';

// 密码哈希
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

// 注册
function register() {
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirm').value;
    const errorEl = document.getElementById('registerError');

    errorEl.textContent = '';
    errorEl.style.display = 'none';

    if (username.length < 4 || username.length > 20) {
        errorEl.textContent = '用户名长度必须在4-20个字符之间';
        errorEl.style.display = 'block';
        return;
    }

    if (password.length < 6) {
        errorEl.textContent = '密码长度至少为6个字符';
        errorEl.style.display = 'block';
        return;
    }

    if (password !== confirm) {
        errorEl.textContent = '两次密码输入不一致';
        errorEl.style.display = 'block';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[username]) {
        errorEl.textContent = '用户名已存在';
        errorEl.style.display = 'block';
        return;
    }

    users[username] = { 
        passwordHash: hashPassword(password), 
        createdAt: new Date().toISOString() 
    };
    localStorage.setItem('users', JSON.stringify(users));

    alert('注册成功！');
    showPage('loginPage');
}

// 登录
function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');

    errorEl.textContent = '';
    errorEl.style.display = 'none';

    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (!users[username]) {
        errorEl.textContent = '用户名不存在';
        errorEl.style.display = 'block';
        return;
    }

    if (users[username].passwordHash !== hashPassword(password)) {
        errorEl.textContent = '密码错误';
        errorEl.style.display = 'block';
        return;
    }

    currentUser = username;
    localStorage.setItem('currentUser', username);
    document.getElementById('currentUser').textContent = username;

    showPage('homePage');
    loadTrips();
}

// 登出
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showPage('loginPage');
}

// 检查登录状态
function checkAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        document.getElementById('currentUser').textContent = savedUser;
        showPage('homePage');
        loadTrips();
    }
}

// 页面切换
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    if (pageId === 'detailPage') {
        document.getElementById('bottomStats').classList.add('active');
    } else {
        document.getElementById('bottomStats').classList.remove('active');
    }

    if (pageId === 'shoppingPage') {
        loadShoppingList();
    }

    // 滚动到顶部
    window.scrollTo(0, 0);
}

// 加载清单列表
function loadTrips() {
    const trips = getTripsData().filter(t => t.userId === currentUser);
    const container = document.getElementById('tripList');

    if (trips.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎒</div>
                <div class="empty-text">还没有旅行清单<br>创建第一个吧！</div>
            </div>
        `;
        return;
    }

    container.innerHTML = trips.map(trip => {
        const stats = calculateTripStats(trip.id);
        const packPercent = Math.round((stats.packed / stats.total) * 100) || 0;
        const weightPercent = trip.maxWeight === 999 ? 0 : Math.round((stats.weight / trip.maxWeight) * 100) || 0;
        const weightDisplay = trip.maxWeight === 999 ? `${stats.weight.toFixed(1)}kg` : `${stats.weight.toFixed(1)}/${trip.maxWeight}kg`;

        return `
            <div class="trip-card" onclick="openTrip('${trip.id}')">
                <div class="trip-card-title">${trip.title}</div>
                <div class="trip-card-meta">${trip.startDate} - ${trip.endDate} · ${getTripTypeLabel(trip.type)}</div>
                <div class="trip-progress">
                    <div class="trip-progress-label">
                        <span>打包进度</span>
                        <span>${stats.packed}/${stats.total}</span>
                    </div>
                    <div class="trip-progress-bar">
                        <div class="trip-progress-fill" style="width: ${packPercent}%"></div>
                    </div>
                </div>
                <div class="trip-progress">
                    <div class="trip-progress-label">
                        <span>行李重量</span>
                        <span>${weightDisplay}</span>
                    </div>
                    <div class="trip-progress-bar">
                        <div class="trip-progress-fill weight" style="width: ${weightPercent}%"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 创建清单
function createTrip() {
    const title = document.getElementById('tripTitle').value.trim();
    const destination = document.getElementById('tripDestination').value.trim();
    const startDate = document.getElementById('tripStartDate').value;
    const endDate = document.getElementById('tripEndDate').value;
    const typeBtn = document.querySelector('#tripTypeOptions .option-btn.selected');
    const luggageBtn = document.querySelector('#luggageOptions .option-btn.selected');
    const genderBtn = document.querySelector('#genderOptions .option-btn.selected');

    if (!title || !destination || !startDate || !endDate || !typeBtn || !luggageBtn || !genderBtn) {
        alert('请填写完整信息');
        return;
    }

    const tripId = 'trip_' + Date.now();
    const trip = {
        id: tripId,
        userId: currentUser,
        title,
        destination,
        startDate,
        endDate,
        type: typeBtn.dataset.value,
        maxWeight: parseFloat(luggageBtn.dataset.value),
        includeMakeup: genderBtn.dataset.value === 'yes',
        createdAt: new Date().toISOString()
    };

    const trips = getTripsData();
    trips.push(trip);
    saveTripsData(trips);

    generateInitialItems(tripId, trip.includeMakeup);

    // 清空表单
    document.getElementById('tripTitle').value = '';
    document.getElementById('tripDestination').value = '';
    document.getElementById('tripStartDate').value = '';
    document.getElementById('tripEndDate').value = '';
    document.querySelectorAll('.option-btn.selected').forEach(btn => btn.classList.remove('selected'));

    openTrip(tripId);
}

// 打开清单详情
function openTrip(tripId) {
    currentTripId = tripId;
    const trip = getTripsData().find(t => t.id === tripId);
    
    if (!trip) return;

    document.getElementById('detailTitle').textContent = trip.title;
    
    renderCategories();
    currentCategory = 'documents';
    loadCategoryItems();
    
    showPage('detailPage');
}

// 渲染分类标签
function renderCategories() {
    const trip = getTripsData().find(t => t.id === currentTripId);
    
    const html = categories
        .filter(cat => {
            if (cat.id === 'makeup' && !trip.includeMakeup) return false;
            return true;
        })
        .map(cat => {
            const stats = getCategoryStats(currentTripId, cat.id);
            return `
                <span class="category-tab ${cat.id === currentCategory ? 'active' : ''}" onclick="switchCategory('${cat.id}')">
                    ${cat.icon} ${cat.name} (${stats.packed}/${stats.total})
                </span>
            `;
        }).join('');
    
    document.getElementById('categoriesNav').innerHTML = html;
}

// 切换分类
function switchCategory(catId) {
    currentCategory = catId;
    loadCategoryItems();
    renderCategories();
    
    // 滚动到分类导航
    document.querySelector('.categories-nav').scrollIntoView({ behavior: 'smooth' });
}

// 加载分类物品
function loadCategoryItems() {
    const allItems = JSON.parse(localStorage.getItem('items') || '[]');
    const items = allItems.filter(item => 
        item.tripId === currentTripId && item.category === currentCategory
    );

    const category = categories.find(c => c.id === currentCategory);
    document.getElementById('categoryTitle').textContent = category.name;

    const html = items.map(item => `
        <div class="item-card">
            <input type="checkbox" class="item-checkbox" ${item.packed ? 'checked' : ''} onchange="toggleItem('${item.id}')">
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-meta">
                    <span>${(item.weight * 1000).toFixed(0)}g</span>
                    <span>待购买 <input type="checkbox" class="buy-checkbox" ${item.needToBuy ? 'checked' : ''} onchange="toggleBuy('${item.id}'); event.stopPropagation();"></span>
                </div>
            </div>
            <span class="item-status ${item.packed ? 'packed' : 'pending'}">
                ${item.packed ? '已打包' : '待打包'}
            </span>
        </div>
    `).join('');

    document.getElementById('itemsList').innerHTML = html;
    updateOverallProgress();
}

// 切换打包状态
function toggleItem(itemId) {
    const allItems = JSON.parse(localStorage.getItem('items') || '[]');
    const item = allItems.find(i => i.id === itemId);
    
    if (item) {
        item.packed = !item.packed;
        localStorage.setItem('items', JSON.stringify(allItems));
        loadCategoryItems();
    }
}

// 切换待购买
function toggleBuy(itemId) {
    const allItems = JSON.parse(localStorage.getItem('items') || '[]');
    const item = allItems.find(i => i.id === itemId);
    
    if (item) {
        item.needToBuy = !item.needToBuy;
        localStorage.setItem('items', JSON.stringify(allItems));
    }
}

// 显示添加物品对话框
function showAddItemDialog() {
    document.getElementById('addItemDialog').classList.add('active');
    document.getElementById('newItemName').value = '';
    document.getElementById('newItemWeight').value = '';
}

// 隐藏添加物品对话框
function hideAddItemDialog() {
    document.getElementById('addItemDialog').classList.remove('active');
}

// 添加新物品
function addNewItem() {
    const name = document.getElementById('newItemName').value.trim();
    const weight = parseFloat(document.getElementById('newItemWeight').value);

    if (!name || !weight || weight <= 0) {
        alert('请输入有效的物品名称和重量');
        return;
    }

    const allItems = JSON.parse(localStorage.getItem('items') || '[]');
    allItems.push({
        id: 'item_' + Date.now(),
        tripId: currentTripId,
        category: currentCategory,
        name,
        weight,
        packed: false,
        needToBuy: false,
        bought: false
    });

    localStorage.setItem('items', JSON.stringify(allItems));
    hideAddItemDialog();
    loadCategoryItems();
}

// 更新整体进度
function updateOverallProgress() {
    const stats = calculateTripStats(currentTripId);
    const trip = getTripsData().find(t => t.id === currentTripId);
    
    const packPercent = Math.round((stats.packed / stats.total) * 100) || 0;
    const weightPercent = trip.maxWeight === 999 ? 0 : Math.round((stats.weight / trip.maxWeight) * 100) || 0;
    const weightDisplay = trip.maxWeight === 999 ? `${stats.weight.toFixed(1)} kg` : `${stats.weight.toFixed(1)} / ${trip.maxWeight} kg`;

    document.getElementById('packProgress').textContent = `${stats.packed} / ${stats.total}`;
    document.getElementById('weightProgress').textContent = weightDisplay;
    document.getElementById('packBar').style.width = packPercent + '%';
    document.getElementById('weightBar').style.width = Math.min(weightPercent, 100) + '%';

    renderCategories();
}

// 加载购物清单
function loadShoppingList() {
    const trips = getTripsData().filter(t => t.userId === currentUser);
    const allItems = JSON.parse(localStorage.getItem('items') || '[]');
    
    const shoppingByTrip = {};
    
    trips.forEach(trip => {
        const toBuyItems = allItems.filter(item => 
            item.tripId === trip.id && item.needToBuy && !item.bought
        );
        if (toBuyItems.length > 0) {
            shoppingByTrip[trip.id] = {
                trip: trip,
                items: toBuyItems
            };
        }
    });

    const container = document.getElementById('shoppingContainer');
    
    if (Object.keys(shoppingByTrip).length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🛍️</div>
                <div class="empty-text">暂无待购买物品<br>在清单详情页勾选"待购买"即可添加</div>
            </div>
        `;
        return;
    }

    const html = Object.values(shoppingByTrip).map(group => `
        <div class="shopping-group">
            <div class="shopping-group-title">
                <span>✈️ ${group.trip.title}</span>
                <span style="font-size: 14px; color: #999; font-weight: 400;">${group.items.length} 件</span>
            </div>
            ${group.items.map(item => `
                <div class="shopping-item">
                    <input type="checkbox" class="shopping-checkbox" onchange="markAsBought('${item.id}')">
                    <div class="shopping-name">${item.name}</div>
                    <div class="shopping-weight">${(item.weight * 1000).toFixed(0)}g</div>
                </div>
            `).join('')}
        </div>
    `).join('');

    container.innerHTML = html;
}

// 标记已购买
function markAsBought(itemId) {
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    const item = items.find(i => i.id === itemId);
    if (item) {
        item.bought = true;
        item.needToBuy = false;
        localStorage.setItem('items', JSON.stringify(items));
        loadShoppingList();
    }
}

// 生成初始物品
function generateInitialItems(tripId, includeMakeup) {
    const allItems = JSON.parse(localStorage.getItem('items') || '[]');
    
    categories.forEach(cat => {
        if (cat.id === 'makeup' && !includeMakeup) return;
        
        const templates = itemsTemplates[cat.id] || [];
        templates.forEach((template, index) => {
            allItems.push({
                id: 'item_' + Date.now() + '_' + index + '_' + Math.random(),
                tripId,
                category: cat.id,
                name: template.name,
                weight: template.weight,
                packed: false,
                needToBuy: false,
                bought: false
            });
        });
    });

    localStorage.setItem('items', JSON.stringify(allItems));
}

// 计算清单统计
function calculateTripStats(tripId) {
    const allItems = JSON.parse(localStorage.getItem('items') || '[]');
    const items = allItems.filter(i => i.tripId === tripId);
    const packedItems = items.filter(i => i.packed);
    return {
        total: items.length,
        packed: packedItems.length,
        weight: packedItems.reduce((sum, i) => sum + i.weight, 0)
    };
}

// 计算分类统计
function getCategoryStats(tripId, category) {
    const allItems = JSON.parse(localStorage.getItem('items') || '[]');
    const items = allItems.filter(i => i.tripId === tripId && i.category === category);
    return {
        total: items.length,
        packed: items.filter(i => i.packed).length
    };
}

// 数据操作
function getTripsData() {
    return JSON.parse(localStorage.getItem('trips') || '[]');
}

function saveTripsData(trips) {
    localStorage.setItem('trips', JSON.stringify(trips));
}

function getTripTypeLabel(type) {
    const labels = {
        'vacation': '度假',
        'self_drive': '自驾',
        'hiking': '徒步',
        'skiing': '滑雪',
        'camping': '露营',
        'business': '出差'
    };
    return labels[type] || type;
}

// 选项按钮事件
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('option-btn')) {
        const parent = e.target.parentElement;
        parent.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
        e.target.classList.add('selected');
    }
});

// 对话框点击遮罩关闭
document.getElementById('addItemDialog').addEventListener('click', function(e) {
    if (e.target === this) {
        hideAddItemDialog();
    }
});

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});
