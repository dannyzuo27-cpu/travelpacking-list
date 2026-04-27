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

    // 读取现有用户
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    // 严格检查用户名是否已存在（不区分大小写）
    const existingUsernames = Object.keys(users).map(u => u.toLowerCase());
    if (existingUsernames.includes(username.toLowerCase())) {
        errorEl.textContent = '用户名已存在，请换一个';
        errorEl.style.display = 'block';
        return;
    }

    // 保存新用户
    users[username] = { 
        passwordHash: hashPassword(password), 
        createdAt: new Date().toISOString() 
    };
    
    // 保存到 localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // 立即验证是否保存成功
    const savedUsers = JSON.parse(localStorage.getItem('users') || '{}');
    if (!savedUsers[username]) {
        errorEl.textContent = '注册失败，请重试';
        errorEl.style.display = 'block';
        console.error('Failed to save user to localStorage');
        return;
    }

    console.log('✅ 注册成功:', username);
    console.log('当前所有用户:', Object.keys(savedUsers));
    
    alert('注册成功！请登录');
    
    // 清空表单
    document.getElementById('registerUsername').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('registerConfirm').value = '';
    
    showPage('loginPage');
}

// 登录
function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');

    errorEl.textContent = '';
    errorEl.style.display = 'none';

    console.log('🔑 尝试登录:', username);
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    console.log('📋 当前所有用户:', Object.keys(users));
    
    if (!users[username]) {
        console.log('❌ 用户不存在:', username);
        errorEl.textContent = '用户名不存在';
        errorEl.style.display = 'block';
        return;
    }

    const inputHash = hashPassword(password);
    const savedHash = users[username].passwordHash;
    console.log('🔐 密码哈希对比:', { inputHash, savedHash, match: inputHash === savedHash });
    
    if (savedHash !== inputHash) {
        console.log('❌ 密码错误');
        errorEl.textContent = '密码错误';
        errorEl.style.display = 'block';
        return;
    }

    console.log('✅ 登录成功');
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

// 创建清单（异步）
async function createTrip() {
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

    // 显示加载提示
    const submitBtn = document.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '正在生成清单...';
    submitBtn.disabled = true;

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

    // 异步生成物品（含天气查询）
    await generateInitialItems(tripId, trip.includeMakeup);

    // 清空表单
    document.getElementById('tripTitle').value = '';
    document.getElementById('tripDestination').value = '';
    document.getElementById('tripStartDate').value = '';
    document.getElementById('tripEndDate').value = '';
    document.querySelectorAll('.option-btn.selected').forEach(btn => btn.classList.remove('selected'));
    
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    openTrip(tripId);
}

// 打开清单详情
function openTrip(tripId) {
    currentTripId = tripId;
    const trip = getTripsData().find(t => t.id === tripId);
    
    if (!trip) return;

    document.getElementById('detailTitle').textContent = trip.title;
    
    // 渲染旅行信息卡片
    renderTripInfo(trip);
    
    // 加载协作信息
    loadMembersList();
    
    renderCategories();
    currentCategory = 'documents';
    loadCategoryItems();
    
    showPage('detailPage');
}

// 渲染旅行信息（先显示估算，后台加载真实天气）
async function renderTripInfo(trip) {
    console.log('开始渲染天气，trip:', trip);
    
    // 立即显示估算天气
    const estimatedWeather = getEstimatedWeather(trip.startDate, trip.endDate);
    console.log('估算天气:', estimatedWeather);
    displayTripInfo(trip, estimatedWeather, true);
    
    // 后台加载真实天气
    if (!trip.weather) {
        console.log('开始加载真实天气...');
        getWeather(trip.destination, trip.startDate, trip.endDate)
            .then(weather => {
                console.log('真实天气加载成功:', weather);
                saveWeatherToTrip(trip.id, weather);
                displayTripInfo(trip, weather, false);
            })
            .catch(err => {
                console.log('天气加载失败，使用估算值', err);
            });
    } else {
        // 使用缓存的天气
        console.log('使用缓存天气:', trip.weather);
        displayTripInfo(trip, trip.weather, false);
    }
}

// 显示旅行信息
function displayTripInfo(trip, weather, isEstimated) {
    console.log('========== 显示天气 ==========');
    console.log('weather对象:', weather);
    console.log('weather.days:', weather.days);
    console.log('days是数组吗?', Array.isArray(weather.days));
    console.log('days长度:', weather.days?.length);
    console.log('第一天数据:', weather.days?.[0]);
    
    const estimatedTag = isEstimated ? '<span style="font-size: 10px; color: #999;"> (估算)</span>' : '';
    
    let weatherHtml;
    if (weather.days && Array.isArray(weather.days) && weather.days.length > 0) {
        console.log('使用多天天气显示');
        weatherHtml = weather.days.map(day => {
            console.log('渲染日期:', day.date, day.tempMin, day.tempMax, day.icon);
            return `
                <div class="weather-day">
                    <span class="weather-day-date">${formatMonthDay(day.date)} ${day.icon}</span>
                    <span class="weather-day-temp">${day.tempMin}°-${day.tempMax}°</span>
                </div>
            `;
        }).join('');
    } else {
        console.log('使用单温度显示');
        weatherHtml = `<div class="trip-info-temp">${weather.tempAvg}°${estimatedTag}</div>`;
    }
    
    const html = `
        <div class="trip-info-header">
            <div class="trip-info-main">
                <div class="trip-info-destination">📍 ${trip.destination}</div>
                <div class="trip-info-dates">🗓 ${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}</div>
            </div>
            <div class="trip-info-weather">
                ${weatherHtml}
            </div>
        </div>
    `;
    
    document.getElementById('tripInfoCard').innerHTML = html;
}

// 估算天气（根据月份）
function getEstimatedWeather(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dayCount = Math.min(Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1, 7);
    
    const days = [];
    for (let i = 0; i < dayCount; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        const month = date.getMonth() + 1;
        
        let tempMin, tempMax, icon;
        if (month >= 6 && month <= 8) {
            tempMin = 25; tempMax = 35; icon = '🌤';
        } else if (month >= 3 && month <= 5) {
            tempMin = 15; tempMax = 25; icon = '☀️';
        } else if (month >= 9 && month <= 11) {
            tempMin = 10; tempMax = 20; icon = '🍂';
        } else {
            tempMin = -5; tempMax = 10; icon = '❄️';
        }
        
        days.push({
            date: date.toISOString().split('T')[0],
            tempMin,
            tempMax,
            tempAvg: Math.round((tempMin + tempMax) / 2),
            icon
        });
    }
    
    const avgTemp = Math.round(days.reduce((sum, d) => sum + d.tempAvg, 0) / days.length);
    return { days, tempAvg: avgTemp };
}

// 格式化月日
function formatMonthDay(dateStr) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
}

// 保存天气到清单
function saveWeatherToTrip(tripId, weather) {
    const trips = JSON.parse(localStorage.getItem('trips') || '[]');
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
        trip.weather = weather;
        localStorage.setItem('trips', JSON.stringify(trips));
    }
}

// 格式化日期
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
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

    const html = items.map(item => {
        const packedByInfo = item.packed && item.packedBy 
            ? `<div class="packed-by">✓ <span class="packed-by-name">${item.packedBy}</span></div>`
            : '';
        
        return `
            <div class="item-card">
                <input type="checkbox" class="item-checkbox" ${item.packed ? 'checked' : ''} onchange="toggleItem('${item.id}')">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-meta">
                        <span>${(item.weight * 1000).toFixed(0)}g</span>
                        <span>待购买 <input type="checkbox" class="buy-checkbox" ${item.needToBuy ? 'checked' : ''} onchange="toggleBuy('${item.id}'); event.stopPropagation();"></span>
                    </div>
                    ${packedByInfo}
                </div>
                <span class="item-status ${item.packed ? 'packed' : 'pending'}">
                    ${item.packed ? '已打包' : '待打包'}
                </span>
            </div>
        `;
    }).join('');

    document.getElementById('itemsList').innerHTML = html;
    updateOverallProgress();
}

// 切换打包状态（记录打包人）
function toggleItem(itemId) {
    const allItems = JSON.parse(localStorage.getItem('items') || '[]');
    const item = allItems.find(i => i.id === itemId);
    
    if (item) {
        item.packed = !item.packed;
        
        if (item.packed) {
            // 记录打包人和时间
            item.packedBy = currentUser;
            item.packedAt = new Date().toISOString();
        } else {
            // 取消打包时清除记录
            delete item.packedBy;
            delete item.packedAt;
        }
        
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

// 生成初始物品（含目的地特殊物品和天气推荐）
async function generateInitialItems(tripId, includeMakeup) {
    const allItems = JSON.parse(localStorage.getItem('items') || '[]');
    const trip = getTripsData().find(t => t.id === tripId);
    
    // 获取天气
    const weather = await getWeather(trip.destination, trip.startDate, trip.endDate);
    saveWeatherToTrip(tripId, weather);
    
    // 基础物品（除了衣物，衣物根据天气推荐）
    categories.forEach(cat => {
        if (cat.id === 'makeup' && !includeMakeup) return;
        if (cat.id === 'clothing') return; // 衣物单独处理
        
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

    // 根据天气推荐衣物
    const clothingRecommendations = recommendClothingByWeather(weather.tempAvg);
    clothingRecommendations.forEach((item, index) => {
        allItems.push({
            id: 'item_weather_' + Date.now() + '_' + index + '_' + Math.random(),
            tripId,
            category: item.category,
            name: item.name,
            weight: item.weight,
            packed: false,
            needToBuy: false,
            bought: false,
            isWeatherRecommended: true
        });
    });

    // 目的地特殊物品
    if (trip && trip.destination) {
        addDestinationSpecialItems(allItems, tripId, trip.destination);
    }

    localStorage.setItem('items', JSON.stringify(allItems));
}

// 根据目的地添加特殊物品
function addDestinationSpecialItems(allItems, tripId, destination) {
    for (const [keywords, config] of Object.entries(destinationSpecialItems)) {
        const regex = new RegExp(keywords);
        if (regex.test(destination)) {
            config.items.forEach((item, index) => {
                allItems.push({
                    id: 'item_special_' + Date.now() + '_' + index + '_' + Math.random(),
                    tripId,
                    category: item.category,
                    name: item.name,
                    weight: item.weight,
                    packed: false,
                    needToBuy: false,
                    bought: false,
                    isSpecial: true
                });
            });
            break; // 只匹配第一个规则
        }
    }
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

// ===== 协作功能 =====

function showCollabDialog() {
    document.getElementById('collabDialog').classList.add('active');
    loadCollabInfo();
}

function hideCollabDialog() {
    document.getElementById('collabDialog').classList.remove('active');
}

function loadCollabInfo() {
    // 生成邀请码
    const code = generateInviteCode(currentTripId);
    document.getElementById('inviteCode').textContent = code;
    
    // 加载成员列表
    loadMembersList();
}

function generateInviteCode(tripId) {
    // 简单的邀请码生成（实际应该用服务器生成）
    const hash = tripId.split('_')[1];
    return hash ? hash.substring(0, 6).toUpperCase() : 'ABC123';
}

function joinCollab() {
    const code = document.getElementById('joinCode').value.trim().toUpperCase();
    
    if (!code || code.length !== 6) {
        alert('请输入6位邀请码');
        return;
    }

    // 查找对应的清单
    const trips = getTripsData();
    const targetTrip = trips.find(t => generateInviteCode(t.id) === code);
    
    if (!targetTrip) {
        alert('邀请码无效或清单不存在');
        return;
    }

    // 添加协作关系
    addCollabMember(targetTrip.id, currentUser);
    
    alert('加入成功！');
    hideCollabDialog();
    
    // 重新加载清单列表
    showPage('homePage');
    loadTrips();
}

function addCollabMember(tripId, username) {
    const collabs = JSON.parse(localStorage.getItem('collaborations') || '{}');
    
    if (!collabs[tripId]) {
        collabs[tripId] = { members: [] };
    }
    
    if (!collabs[tripId].members.includes(username)) {
        collabs[tripId].members.push(username);
        localStorage.setItem('collaborations', JSON.stringify(collabs));
    }
}

function getCollabMembers(tripId) {
    const collabs = JSON.parse(localStorage.getItem('collaborations') || '{}');
    const trip = getTripsData().find(t => t.id === tripId);
    
    const members = [trip.userId]; // 创建者
    if (collabs[tripId]) {
        members.push(...collabs[tripId].members.filter(m => m !== trip.userId));
    }
    
    return [...new Set(members)];
}

function loadMembersList() {
    const members = getCollabMembers(currentTripId);
    const trip = getTripsData().find(t => t.id === currentTripId);
    
    document.getElementById('memberCount').textContent = members.length;
    
    const html = members.map(username => {
        const isOwner = username === trip.userId;
        const avatar = username.charAt(0).toUpperCase();
        
        return `
            <div class="member-item">
                <div class="member-avatar">${avatar}</div>
                <div class="member-name">${username}</div>
                <div class="member-role">${isOwner ? '创建者' : '协作者'}</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('membersList').innerHTML = html;
    
    // 更新协作横幅
    if (members.length > 1) {
        document.getElementById('collabBanner').style.display = 'flex';
        document.getElementById('collabMembers').textContent = `与 ${members.length - 1} 人协作`;
    } else {
        document.getElementById('collabBanner').style.display = 'none';
    }
}

// 修改 loadTrips 以包含协作清单
function loadTrips() {
    const trips = getTripsData();
    const collabs = JSON.parse(localStorage.getItem('collaborations') || '{}');
    
    // 自己创建的清单 + 协作的清单
    const myTrips = trips.filter(t => t.userId === currentUser);
    const collabTrips = trips.filter(t => {
        const members = collabs[t.id]?.members || [];
        return members.includes(currentUser) && t.userId !== currentUser;
    });
    
    const allTrips = [...myTrips, ...collabTrips];
    const container = document.getElementById('tripList');

    if (allTrips.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎒</div>
                <div class="empty-text">还没有旅行清单<br>创建第一个吧！</div>
            </div>
        `;
        return;
    }

    container.innerHTML = allTrips.map(trip => {
        const stats = calculateTripStats(trip.id);
        const packPercent = Math.round((stats.packed / stats.total) * 100) || 0;
        const weightPercent = trip.maxWeight === 999 ? 0 : Math.round((stats.weight / trip.maxWeight) * 100) || 0;
        const weightDisplay = trip.maxWeight === 999 ? `${stats.weight.toFixed(1)}kg` : `${stats.weight.toFixed(1)}/${trip.maxWeight}kg`;
        
        const isCollab = trip.userId !== currentUser;
        const collabTag = isCollab ? '<div style="display: inline-block; background: #a4ceb7; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: 8px;">协作</div>' : '';
        const creatorInfo = `<div style="font-size: 12px; color: #999; margin-top: 4px;">创建人: ${trip.userId}</div>`;

        return `
            <div class="trip-card" onclick="openTrip('${trip.id}')">
                <div class="trip-card-title">${trip.title}${collabTag}</div>
                <div class="trip-card-meta">${trip.startDate} - ${trip.endDate} · ${getTripTypeLabel(trip.type)}</div>
                ${creatorInfo}
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

// 快速加入协作
function showJoinDialog() {
    document.getElementById('quickJoinDialog').classList.add('active');
    document.getElementById('quickJoinCode').value = '';
}

function hideQuickJoinDialog() {
    document.getElementById('quickJoinDialog').classList.remove('active');
}

function quickJoinCollab() {
    const code = document.getElementById('quickJoinCode').value.trim().toUpperCase();
    
    if (!code || code.length !== 6) {
        alert('请输入6位邀请码');
        return;
    }

    // 查找对应的清单
    const trips = getTripsData();
    const targetTrip = trips.find(t => generateInviteCode(t.id) === code);
    
    if (!targetTrip) {
        alert('邀请码无效或清单不存在');
        return;
    }

    // 添加协作关系
    addCollabMember(targetTrip.id, currentUser);
    
    alert('加入成功！');
    hideQuickJoinDialog();
    
    // 重新加载清单列表
    loadTrips();
}

// 对话框关闭事件
document.getElementById('collabDialog').addEventListener('click', function(e) {
    if (e.target === this) {
        hideCollabDialog();
    }
});

document.getElementById('quickJoinDialog').addEventListener('click', function(e) {
    if (e.target === this) {
        hideQuickJoinDialog();
    }
});

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});
