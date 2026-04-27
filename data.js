// 目的地特殊物品配置
const destinationSpecialItems = {
    "海边|海南|三亚|巴厘岛|普吉岛|马尔代夫|冲绳": {
        category: "beach",
        items: [
            { name: "泳衣", weight: 0.15, category: "clothing" },
            { name: "防晒衣", weight: 0.2, category: "clothing" },
            { name: "人字拖", weight: 0.15, category: "clothing" },
            { name: "防水袋", weight: 0.05, category: "toiletries" },
            { name: "晒后修复", weight: 0.1, category: "toiletries" }
        ]
    },
    "高原|西藏|青海|云南|拉萨|香格里拉": {
        category: "highland",
        items: [
            { name: "红景天", weight: 0.05, category: "medicine" },
            { name: "氧气瓶", weight: 0.3, category: "medicine" },
            { name: "保温杯", weight: 0.3, category: "toiletries" },
            { name: "润唇膏", weight: 0.02, category: "toiletries" }
        ]
    },
    "雪山|滑雪|北海道|长白山|阿尔卑斯": {
        category: "snow",
        items: [
            { name: "滑雪服", weight: 1.5, category: "clothing" },
            { name: "滑雪手套", weight: 0.2, category: "clothing" },
            { name: "护目镜", weight: 0.1, category: "clothing" },
            { name: "暖宝宝", weight: 0.05, category: "medicine" }
        ]
    },
    "徒步|登山|尼泊尔|新西兰|瑞士": {
        category: "hiking",
        items: [
            { name: "登山杖", weight: 0.5, category: "clothing" },
            { name: "速干衣裤", weight: 0.3, category: "clothing" },
            { name: "登山鞋", weight: 0.8, category: "clothing" },
            { name: "急救包", weight: 0.2, category: "medicine" },
            { name: "能量棒", weight: 0.1, category: "medicine" }
        ]
    },
    "东南亚|泰国|越南|柬埔寨|印尼": {
        category: "tropical",
        items: [
            { name: "驱蚊液", weight: 0.1, category: "toiletries" },
            { name: "肠胃药", weight: 0.05, category: "medicine" },
            { name: "一次性马桶垫", weight: 0.05, category: "toiletries" }
        ]
    },
    "日本|韩国|东京|首尔|大阪": {
        category: "asia_city",
        items: [
            { name: "交通卡", weight: 0.01, category: "documents" },
            { name: "便携购物袋", weight: 0.05, category: "toiletries" }
        ]
    },
    "欧洲|法国|意大利|英国|德国": {
        category: "europe",
        items: [
            { name: "转换插头（欧标）", weight: 0.15, category: "electronics" },
            { name: "围巾", weight: 0.2, category: "clothing" }
        ]
    }
};

// 物品模板库（基础款）
const itemsTemplates = {
    "documents": [
        { name: "身份证", weight: 0.05 },
        { name: "护照", weight: 0.1 },
        { name: "驾驶证", weight: 0.05 },
        { name: "银行卡", weight: 0.01 },
        { name: "现金", weight: 0.05 }
    ],
    "clothing": [
        { name: "内衣", weight: 0.05 },
        { name: "内裤", weight: 0.03 },
        { name: "袜子", weight: 0.05 },
        { name: "短袖T恤", weight: 0.15 },
        { name: "长袖衬衫", weight: 0.2 },
        { name: "长裤", weight: 0.3 },
        { name: "短裤", weight: 0.2 },
        { name: "外套", weight: 0.5 },
        { name: "运动鞋", weight: 0.6 },
        { name: "拖鞋", weight: 0.2 }
    ],
    "electronics": [
        { name: "手机", weight: 0.2 },
        { name: "手机充电器", weight: 0.1 },
        { name: "充电宝", weight: 0.3 },
        { name: "数据线", weight: 0.05 },
        { name: "转换插头", weight: 0.15 },
        { name: "相机", weight: 0.5 },
        { name: "耳机", weight: 0.05 }
    ],
    "medicine": [
        { name: "感冒药", weight: 0.05 },
        { name: "退烧药", weight: 0.05 },
        { name: "止泻药", weight: 0.05 },
        { name: "创可贴", weight: 0.02 },
        { name: "红景天", weight: 0.05 }
    ],
    "toiletries": [
        { name: "牙刷", weight: 0.02 },
        { name: "牙膏", weight: 0.1 },
        { name: "洗面奶", weight: 0.12 },
        { name: "洗发水", weight: 0.15 },
        { name: "沐浴露", weight: 0.15 },
        { name: "毛巾", weight: 0.15 },
        { name: "防晒霜", weight: 0.1 }
    ],
    "makeup": [
        { name: "粉底液", weight: 0.05 },
        { name: "气垫", weight: 0.08 },
        { name: "遮瑕", weight: 0.03 },
        { name: "散粉", weight: 0.05 },
        { name: "眉笔", weight: 0.02 },
        { name: "眼线笔", weight: 0.02 },
        { name: "睫毛膏", weight: 0.03 },
        { name: "眼影盘", weight: 0.1 },
        { name: "腮红", weight: 0.05 },
        { name: "口红", weight: 0.02, quantity: 2 },
        { name: "唇釉", weight: 0.02 },
        { name: "卸妆水", weight: 0.15 },
        { name: "化妆棉", weight: 0.05 },
        { name: "化妆刷", weight: 0.1 },
        { name: "美妆蛋", weight: 0.02 }
    ]
};

const categories = [
    { id: 'documents', name: '证件类', icon: '📄' },
    { id: 'clothing', name: '衣物类', icon: '👕' },
    { id: 'electronics', name: '电子产品', icon: '📱' },
    { id: 'medicine', name: '药品类', icon: '💊' },
    { id: 'toiletries', name: '洗漱用品', icon: '🧴' },
    { id: 'makeup', name: '化妆品', icon: '💄', forFemale: true }
];
