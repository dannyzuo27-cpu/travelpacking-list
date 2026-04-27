// 全局状态
let currentUser = null;
let currentTripId = null;
let currentCategory = 'documents';

// ===== 用户认证 =====

function register() {
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirm').value;
    const errorEl = document.getElementById('registerError');

    errorEl.textContent = '';

    if (username.length < 4 || username.length > 20) {
        errorEl.textContent = '用户名长度必须在4-20个字符之间';
        return;
    }

    if (password.length < 6) {
        errorEl.textContent = '密码长度至少为6个字符';
        return;
    }

    if (password !== confirm) {
        errorEl.textContent = '两次密码输入不一致';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[username]) {
        errorEl.textContent = '用户名已存在';
        return;
    }

    users[username] = { password, createdAt: new Date().toISOString() };
    localStorage.setItem('users', JSON.stringify(users));

    alert('注册成功！');
    showPage('loginPage');
}

function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');

    errorEl.textContent = '';

    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (!users[username]) {
        errorEl.textContent = '用户名不存在';
        return;
    }

    if (users[username].password !== password) {
        errorEl.textContent = '密码错误';
        return;
    }

    currentUser = username;
    localStorage.setItem('currentUser', username);
    document.getElementById('currentUser').textContent = username;

    showPage('homePage');
    loadTrips();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showPage('loginPage');
}

function checkAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        document.getElementById('currentUser').textContent = savedUser;
        showPage('homePage');
        loadTrips();
    }
}

// ===== 页面导航 =====

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    if (pageId === 'detailPage') {
        document.getElementById('bottomStats').classList.add('active');
    } else {
        document.getElementById('bottomStats').classList.remove('active');
    }
}

// ===== 清单管理 =====

function loadTrips() {
    const trips = getTripsData();
    const userTrips = trips.filter(t => t.userId === currentUser);
    const container = document.getElementById('tripsContainer');

    if (userTrips.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎒</div>
                <div class="empty-state-text">还没有旅行清单，创建第一个吧！</div>
                <button class="nav-btn" onclick="showPage('createPage')">＋ 创建新清单</button>
            </div>
        `;
        return;
    }

    const cardsHtml = userTrips.map(trip => {
        const stats = calculateTripStats(trip.id);
        const packPercent = Math.round((stats.packed / stats.total) * 100) || 0;
        const weightPercent = Math.round((stats.weight / trip.maxWeight) * 100) || 0;

        return `
            <div class="trip-card" onclick="openTrip('${trip.id}')">
                <div class="trip-card-title">${trip.title}</div>
                <div class="trip-card-meta">${trip.startDate} - ${trip.endDate} · ${getTripTypeLabel(trip.type)}</div>
                <div class="trip-card-progress">
                    <div class="progress-item">
                        <span>打包进度</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${packPercent}%"></div>
                        </div>
                        <span>${stats.packed}/${stats.total}</span>
                    </div>
                    <div class="progress-item">
                        <span>行李重量</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${weightPercent}%"></div>
                        </div>
                        <span>${stats.weight.toFixed(1)}/${trip.maxWeight}kg</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `<div class="cards-grid">${cardsHtml}</div>`;
}

function createTrip() {
    const title = document.getElementById('tripTitle').value.trim();
    const destination = document.getElementById('tripDestination').value.trim();
    const startDate = document.getElementById('tripStartDate').value;
    const endDate = document.getElementById('tripEndDate').value;
    const typeBtn = document.querySelector('#tripTypeOptions .option-btn.selected');
    const luggageBtn = document.querySelector('#luggageOptions .option-btn.selected');

    if (!title || !destination || !startDate || !endDate || !typeBtn || !luggageBtn) {
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
        createdAt: new Date().toISOString()
    };

    const trips = getTripsData();
    trips.push(trip);
    saveTripsData(trips);

    // 生成初始物品
    generateInitialItems(tripId);

    // 清空表单
    document.getElementById('tripTitle').value = '';
    document.getElementById('tripDestination').value = '';
    document.getElementById('tripStartDate').value = '';
    document.getElementById('tripEndDate').value = '';
    document.querySelectorAll('.option-btn.selected').forEach(btn => btn.classList.remove('selected'));

    // 打开新清单
    openTrip(tripId);
}

function generateInitialItems(tripId) {
    const items = [];
    
    categories.forEach(cat => {
        const templates = itemsTemplates[cat.id] || [];
        templates.forEach(template => {
            items.push({
                id: 'item_' + Date.now() + '_' + Math.random(),
                tripId,
                category: cat.id,
                name: template.name,
                weight: template.weight,
                packed: false
            });
        });
    });

    saveItemsData(items);
}

function openTrip(tripId) {
    currentTripId = tripId;
    const trip = getTripsData().find(t => t.id === tripId);
    
    if (!trip) return;

    document.getElementById('detailTripTitle').textContent = trip.title;
    
    // 渲染分类列表
    renderCategories();
    
    // 加载第一个分类
    currentCategory = 'documents';
    loadCategoryItems();
    
    showPage('detailPage');
}

function renderCategories() {
    const html = categories.map(cat => {
        const stats = getCategoryStats(currentTripId, cat.id);
        return `
            <div class="category-nav-item ${cat.id === currentCategory ? 'active' : ''}" onclick="switchCategory('${cat.id}')">
                <span>${cat.icon} ${cat.name}</span>
                <span class="category-badge">${stats.packed}/${stats.total}</span>
            </div>
        `;
    }).join('');
    
    document.getElementById('categoriesList').innerHTML = html;
}

function switchCategory(catId) {
    currentCategory = catId;
    loadCategoryItems();
    renderCategories();
}

function loadCategoryItems() {
    const items = getItemsData().filter(item => 
        item.tripId === currentTripId && item.category === currentCategory
    );

    const category = categories.find(c => c.id === currentCategory);
    document.getElementById('categoryTitle').textContent = category.name;

    const tbody = document.getElementById('itemsTableBody');
    tbody.innerHTML = items.map(item => `
        <tr>
            <td><input type="checkbox" class="item-checkbox" ${item.packed ? 'checked' : ''} onchange="toggleItem('${item.id}')"></td>
            <td><div class="item-name">${item.name}</div></td>
            <td><div class="item-weight">${(item.weight * 1000).toFixed(0)}g</div></td>
            <td><span class="item-status ${item.packed ? 'packed' : 'pending'}">${item.packed ? '已打包' : '待打包'}</span></td>
        </tr>
    `).join('');

    updateOverallProgress();
}

function toggleItem(itemId) {
    const items = getItemsData();
    const item = items.find(i => i.id === itemId);
    if (item) {
        item.packed = !item.packed;
        saveItemsData(items);
        loadCategoryItems();
    }
}

// ===== 添加物品 =====

function showAddItemDialog() {
    document.getElementById('addItemDialog').classList.add('active');
    document.getElementById('newItemName').value = '';
    document.getElementById('newItemWeight').value = '';
}

function hideAddItemDialog() {
    document.getElementById('addItemDialog').classList.remove('active');
}

function addNewItem() {
    const name = document.getElementById('newItemName').value.trim();
    const weight = parseFloat(document.getElementById('newItemWeight').value);

    if (!name || !weight || weight <= 0) {
        alert('请输入有效的物品名称和重量');
        return;
    }

    const items = getItemsData();
    items.push({
        id: 'item_' + Date.now(),
        tripId: currentTripId,
        category: currentCategory,
        name,
        weight,
        packed: false
    });

    saveItemsData(items);
    hideAddItemDialog();
    loadCategoryItems();
}

// ===== 统计计算 =====

function calculateTripStats(tripId) {
    const items = getItemsData().filter(i => i.tripId === tripId);
    return {
        total: items.length,
        packed: items.filter(i => i.packed).length,
        weight: items.reduce((sum, i) => sum + i.weight, 0)
    };
}

function getCategoryStats(tripId, category) {
    const items = getItemsData().filter(i => i.tripId === tripId && i.category === category);
    return {
        total: items.length,
        packed: items.filter(i => i.packed).length
    };
}

function updateOverallProgress() {
    const stats = calculateTripStats(currentTripId);
    const trip = getTripsData().find(t => t.id === currentTripId);
    
    const packPercent = Math.round((stats.packed / stats.total) * 100) || 0;
    const weightPercent = Math.round((stats.weight / trip.maxWeight) * 100) || 0;

    document.getElementById('totalPackProgress').textContent = `${stats.packed} / ${stats.total} 件`;
    document.getElementById('totalWeightProgress').textContent = `${stats.weight.toFixed(1)} / ${trip.maxWeight} kg`;
    document.getElementById('totalPackBar').style.width = packPercent + '%';
    document.getElementById('totalWeightBar').style.width = Math.min(weightPercent, 100) + '%';

    renderCategories();
}

// ===== 数据持久化 =====

function getTripsData() {
    return JSON.parse(localStorage.getItem('trips') || '[]');
}

function saveTripsData(trips) {
    localStorage.setItem('trips', JSON.stringify(trips));
}

function getItemsData() {
    return JSON.parse(localStorage.getItem('items') || '[]');
}

function saveItemsData(items) {
    localStorage.setItem('items', JSON.stringify(items));
}

// ===== 辅助函数 =====

function getTripTypeLabel(type) {
    const labels = {
        'vacation': '度假休闲',
        'self_drive': '自驾游',
        'hiking': '徒步',
        'skiing': '滑雪',
        'camping': '露营',
        'business': '商务出差'
    };
    return labels[type] || type;
}

// ===== 事件监听 =====

document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        this.parentElement.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
    });
});

document.getElementById('addItemDialog').addEventListener('click', function(e) {
    if (e.target === this) {
        hideAddItemDialog();
    }
});

// ===== 初始化 =====

window.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});
