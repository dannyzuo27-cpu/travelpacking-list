// 天气服务
// 使用 Open-Meteo API（免费，无需密钥）

// 城市坐标库（常见旅游城市）
const cityCoordinates = {
    // 中国
    "北京": { lat: 39.9042, lon: 116.4074 },
    "上海": { lat: 31.2304, lon: 121.4737 },
    "广州": { lat: 23.1291, lon: 113.2644 },
    "深圳": { lat: 22.5431, lon: 114.0579 },
    "成都": { lat: 30.5728, lon: 104.0668 },
    "重庆": { lat: 29.5630, lon: 106.5516 },
    "西安": { lat: 34.2658, lon: 108.9541 },
    "杭州": { lat: 30.2741, lon: 120.1551 },
    "武汉": { lat: 30.5928, lon: 114.3055 },
    "南京": { lat: 32.0603, lon: 118.7969 },
    "天津": { lat: 39.3434, lon: 117.3616 },
    "苏州": { lat: 31.2989, lon: 120.5853 },
    "大连": { lat: 38.9140, lon: 121.6147 },
    "青岛": { lat: 36.0671, lon: 120.3826 },
    "厦门": { lat: 24.4798, lon: 118.0894 },
    "昆明": { lat: 25.0389, lon: 102.7183 },
    "三亚": { lat: 18.2528, lon: 109.5117 },
    "海口": { lat: 20.0444, lon: 110.1999 },
    "拉萨": { lat: 29.6500, lon: 91.1000 },
    "乌鲁木齐": { lat: 43.8256, lon: 87.6168 },
    "哈尔滨": { lat: 45.8038, lon: 126.5340 },
    "长沙": { lat: 28.2282, lon: 112.9388 },
    "南昌": { lat: 28.6829, lon: 115.8579 },
    "福州": { lat: 26.0745, lon: 119.2965 },
    "贵阳": { lat: 26.6470, lon: 106.6302 },
    "西宁": { lat: 36.6171, lon: 101.7782 },
    
    // 国际
    "纽约": { lat: 40.7128, lon: -74.0060 },
    "洛杉矶": { lat: 34.0522, lon: -118.2437 },
    "旧金山": { lat: 37.7749, lon: -122.4194 },
    "芝加哥": { lat: 41.8781, lon: -87.6298 },
    "伦敦": { lat: 51.5074, lon: -0.1278 },
    "巴黎": { lat: 48.8566, lon: 2.3522 },
    "罗马": { lat: 41.9028, lon: 12.4964 },
    "东京": { lat: 35.6762, lon: 139.6503 },
    "首尔": { lat: 37.5665, lon: 126.9780 },
    "大阪": { lat: 34.6937, lon: 135.5023 },
    "京都": { lat: 35.0116, lon: 135.7681 },
    "曼谷": { lat: 13.7563, lon: 100.5018 },
    "新加坡": { lat: 1.3521, lon: 103.8198 },
    "吉隆坡": { lat: 3.1390, lon: 101.6869 },
    "悉尼": { lat: -33.8688, lon: 151.2093 },
    "墨尔本": { lat: -37.8136, lon: 144.9631 },
    "迪拜": { lat: 25.2048, lon: 55.2708 },
    "巴厘岛": { lat: -8.3405, lon: 115.0920 },
    "普吉岛": { lat: 7.8804, lon: 98.3923 },
    "马尔代夫": { lat: 3.2028, lon: 73.2207 },
    "冲绳": { lat: 26.2124, lon: 127.6809 }
};

// 查询天气（多天）
async function getWeather(destination, startDate, endDate) {
    try {
        // 查找城市坐标
        const coords = findCityCoordinates(destination);
        if (!coords) {
            console.log('未找到城市坐标，使用默认天气');
            return getDefaultWeatherMultiDay(startDate, endDate);
        }

        // 判断日期范围，决定用哪个API
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        const daysFromNow = Math.floor((start - today) / (1000 * 60 * 60 * 24));
        
        let queryStartDate, queryEndDate, url, isHistorical = false;
        
        if (daysFromNow < -2) {
            // 历史日期：使用去年同期数据
            const lastYearStart = new Date(start);
            lastYearStart.setFullYear(lastYearStart.getFullYear() - 1);
            queryStartDate = lastYearStart.toISOString().split('T')[0];
            
            const lastYearEnd = new Date(end);
            lastYearEnd.setFullYear(lastYearEnd.getFullYear() - 1);
            queryEndDate = lastYearEnd.toISOString().split('T')[0];
            
            url = `https://archive-api.open-meteo.com/v1/archive?latitude=${coords.lat}&longitude=${coords.lon}&start_date=${queryStartDate}&end_date=${queryEndDate}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
            isHistorical = true;
        } else if (daysFromNow > 16) {
            // 太远的未来：使用去年同期数据
            const lastYearStart = new Date(start);
            lastYearStart.setFullYear(lastYearStart.getFullYear() - 1);
            queryStartDate = lastYearStart.toISOString().split('T')[0];
            
            const lastYearEnd = new Date(end);
            lastYearEnd.setFullYear(lastYearEnd.getFullYear() - 1);
            queryEndDate = lastYearEnd.toISOString().split('T')[0];
            
            url = `https://archive-api.open-meteo.com/v1/archive?latitude=${coords.lat}&longitude=${coords.lon}&start_date=${queryStartDate}&end_date=${queryEndDate}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
            isHistorical = true;
        } else {
            // 近期：使用预报API
            url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
            // 不指定日期范围，获取所有可用的预报
        }

        const response = await fetch(url);
        const data = await response.json();

        if (!data.daily) {
            return getDefaultWeatherMultiDay(startDate, endDate);
        }

        // 解析多天天气数据
        const days = [];
        
        // 如果是预报API，需要找到匹配日期的数据
        let startIndex = 0;
        if (!isHistorical) {
            startIndex = data.daily.time.findIndex(d => d >= startDate);
            if (startIndex === -1) startIndex = 0;
        }
        
        // 计算需要的天数
        const tripDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const length = Math.min(tripDays, data.daily.time.length - startIndex, 7);
        
        for (let i = 0; i < length; i++) {
            const index = startIndex + i;
            const tempMax = Math.round(data.daily.temperature_2m_max[index]);
            const tempMin = Math.round(data.daily.temperature_2m_min[index]);
            const weatherCode = data.daily.weathercode[index];
            
            days.push({
                date: data.daily.time[index],
                tempMax,
                tempMin,
                tempAvg: Math.round((tempMax + tempMin) / 2),
                description: getWeatherDescription(weatherCode),
                icon: getWeatherIcon(weatherCode)
            });
        }

        // 计算平均温度（用于推荐衣物）
        const avgTemp = Math.round(days.reduce((sum, d) => sum + d.tempAvg, 0) / days.length);

        return {
            days,
            tempAvg: avgTemp,
            isHistorical
        };

    } catch (error) {
        console.error('天气查询失败:', error);
        return getDefaultWeatherMultiDay(startDate, endDate);
    }
}

// 默认天气（多天）
function getDefaultWeatherMultiDay(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dayCount = Math.min(Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1, 7);
    
    const days = [];
    for (let i = 0; i < dayCount; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        
        const weather = getDefaultWeather(date.toISOString().split('T')[0]);
        days.push({
            date: date.toISOString().split('T')[0],
            ...weather,
            tempAvg: Math.round((weather.tempMax + weather.tempMin) / 2)
        });
    }
    
    const avgTemp = Math.round(days.reduce((sum, d) => sum + d.tempAvg, 0) / days.length);
    
    return { days, tempAvg: avgTemp };
}

// 查找城市坐标（支持模糊匹配）
function findCityCoordinates(destination) {
    // 精确匹配
    if (cityCoordinates[destination]) {
        return cityCoordinates[destination];
    }

    // 模糊匹配
    for (const [city, coords] of Object.entries(cityCoordinates)) {
        if (destination.includes(city) || city.includes(destination)) {
            return coords;
        }
    }

    return null;
}

// 默认天气（根据月份估算）
function getDefaultWeather(date) {
    const month = new Date(date).getMonth() + 1;
    
    if (month >= 6 && month <= 8) {
        return { tempMin: 25, tempMax: 35, tempAvg: 30, description: '炎热', icon: '🌤' };
    } else if (month >= 3 && month <= 5) {
        return { tempMin: 15, tempMax: 25, tempAvg: 20, description: '温和', icon: '☀️' };
    } else if (month >= 9 && month <= 11) {
        return { tempMin: 10, tempMax: 20, tempAvg: 15, description: '凉爽', icon: '🍂' };
    } else {
        return { tempMin: -5, tempMax: 10, tempAvg: 2, description: '寒冷', icon: '❄️' };
    }
}

// 天气代码转描述
function getWeatherDescription(code) {
    if (code === 0) return '晴朗';
    if (code <= 3) return '多云';
    if (code <= 48) return '有雾';
    if (code <= 67) return '下雨';
    if (code <= 77) return '下雪';
    if (code <= 82) return '阵雨';
    if (code <= 86) return '阵雪';
    return '雷暴';
}

// 天气代码转图标
function getWeatherIcon(code) {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫';
    if (code <= 67) return '🌧';
    if (code <= 77) return '🌨';
    if (code <= 82) return '🌦';
    if (code <= 86) return '🌨';
    return '⛈';
}

// 根据温度推荐衣物
function recommendClothingByWeather(tempAvg) {
    const recommendations = [];
    
    if (tempAvg >= 28) {
        // 炎热（28°C以上）
        recommendations.push(
            { name: "短袖T恤", weight: 0.15, category: "clothing", quantity: 3 },
            { name: "短裤", weight: 0.2, category: "clothing", quantity: 2 },
            { name: "防晒衣", weight: 0.2, category: "clothing" }
        );
    } else if (tempAvg >= 20) {
        // 温暖（20-27°C）
        recommendations.push(
            { name: "短袖T恤", weight: 0.15, category: "clothing", quantity: 2 },
            { name: "长袖衬衫", weight: 0.2, category: "clothing" },
            { name: "薄外套", weight: 0.4, category: "clothing" },
            { name: "长裤", weight: 0.3, category: "clothing", quantity: 2 }
        );
    } else if (tempAvg >= 10) {
        // 凉爽（10-19°C）
        recommendations.push(
            { name: "长袖衬衫", weight: 0.2, category: "clothing", quantity: 2 },
            { name: "外套", weight: 0.5, category: "clothing" },
            { name: "长裤", weight: 0.3, category: "clothing", quantity: 2 },
            { name: "薄毛衣", weight: 0.4, category: "clothing" }
        );
    } else {
        // 寒冷（10°C以下）
        recommendations.push(
            { name: "长袖衬衫", weight: 0.2, category: "clothing", quantity: 2 },
            { name: "毛衣", weight: 0.5, category: "clothing" },
            { name: "厚外套", weight: 0.8, category: "clothing" },
            { name: "羽绒服", weight: 1.2, category: "clothing" },
            { name: "长裤", weight: 0.3, category: "clothing", quantity: 2 },
            { name: "围巾", weight: 0.15, category: "clothing" },
            { name: "手套", weight: 0.1, category: "clothing" }
        );
    }
    
    return recommendations;
}
