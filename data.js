// 目的地特殊物品配置
const destinationSpecialItems = {
    "国际|出国|国外|日本|韩国|泰国|美国|英国|法国|德国|意大利|西班牙|澳洲|新西兰|加拿大|新加坡|马来西亚|越南|柬埔寨|印尼|菲律宾|缅甸|老挝": {
        category: "international",
        items: [
            { name: "护照", weight: 0.1, category: "documents" },
            { name: "签证", weight: 0.01, category: "documents" },
            { name: "外币", weight: 0.05, category: "documents" },
            { name: "机票确认单", weight: 0.01, category: "documents" },
            { name: "酒店确认单", weight: 0.01, category: "documents" },
            { name: "保险单", weight: 0.01, category: "documents" },
            { name: "转换插头", weight: 0.1, category: "electronics" }
        ]
    },
    "自驾|开车": {
        category: "driving",
        items: [
            { name: "驾驶证", weight: 0.05, category: "documents" },
            { name: "行驶证", weight: 0.05, category: "documents" }
        ]
    },
    "学生|校园|大学": {
        category: "student",
        items: [
            { name: "学生证", weight: 0.01, category: "documents" }
        ]
    },
    "边境|西藏|新疆|珠峰|拉萨": {
        category: "border",
        items: [
            { name: "边防证", weight: 0.05, category: "documents" }
        ]
    },
    "海边|海南|三亚|巴厘岛|普吉岛|马尔代夫|冲绳": {
        category: "beach",
        items: [
            { name: "泳衣", weight: 0.15, category: "clothing" },
            { name: "泳裤", weight: 0.1, category: "clothing" },
            { name: "防晒衣", weight: 0.2, category: "clothing" },
            { name: "人字拖", weight: 0.15, category: "clothing" },
            { name: "沙滩裙", weight: 0.15, category: "clothing" },
            { name: "防水袋", weight: 0.05, category: "toiletries" },
            { name: "晒后修复", weight: 0.1, category: "toiletries" },
            { name: "浮潜装备", weight: 0.3, category: "toiletries" },
            { name: "防水手机袋", weight: 0.02, category: "electronics" }
        ]
    },
    "高原|西藏|青海|云南|拉萨|香格里拉": {
        category: "highland",
        items: [
            { name: "红景天", weight: 0.05, category: "medicine" },
            { name: "氧气瓶", weight: 0.3, category: "medicine" },
            { name: "保温杯", weight: 0.3, category: "toiletries" },
            { name: "润唇膏", weight: 0.02, category: "toiletries" },
            { name: "厚外套", weight: 0.8, category: "clothing" },
            { name: "羽绒服", weight: 1.2, category: "clothing" }
        ]
    },
    "雪山|滑雪|北海道|长白山|阿尔卑斯": {
        category: "snow",
        items: [
            { name: "滑雪服", weight: 1.5, category: "clothing" },
            { name: "滑雪手套", weight: 0.2, category: "clothing" },
            { name: "护目镜", weight: 0.1, category: "clothing" },
            { name: "暖宝宝", weight: 0.05, category: "medicine" },
            { name: "保暖内衣", weight: 0.2, category: "clothing" },
            { name: "雪地靴", weight: 0.8, category: "clothing" }
        ]
    },
    "徒步|登山|尼泊尔|新西兰|瑞士": {
        category: "hiking",
        items: [
            { name: "登山杖", weight: 0.5, category: "clothing" },
            { name: "速干衣裤", weight: 0.3, category: "clothing" },
            { name: "登山鞋", weight: 0.8, category: "clothing" },
            { name: "急救包", weight: 0.2, category: "medicine" },
            { name: "能量棒", weight: 0.1, category: "medicine" },
            { name: "压缩袋", weight: 0.05, category: "toiletries" }
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

// 物品模板库（精简基础款）
const itemsTemplates = {
    "documents": [
        { name: "身份证", weight: 0.05 },
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
        { name: "拖鞋", weight: 0.2 },
        { name: "凉鞋", weight: 0.3 },
        { name: "帽子", weight: 0.1 },
        { name: "太阳镜", weight: 0.05 },
        { name: "腰带", weight: 0.1 },
        { name: "睡衣", weight: 0.2 },
        { name: "运动服", weight: 0.3 },
        { name: "运动裤", weight: 0.25 },
        { name: "牛仔裤", weight: 0.4 },
        { name: "连衣裙", weight: 0.25 },
        { name: "丝袜", weight: 0.02 }
    ],
    "electronics": [
        { name: "手机", weight: 0.2 },
        { name: "手机充电器", weight: 0.1 },
        { name: "充电宝", weight: 0.3 },
        { name: "数据线", weight: 0.05 },
        { name: "耳机", weight: 0.05 }
    ],
    "medicine": [
        { name: "感冒药", weight: 0.05 },
        { name: "止泻药", weight: 0.05 },
        { name: "创可贴", weight: 0.02 },
        { name: "晕车药", weight: 0.03 }
    ],
    "toiletries": [
        { name: "牙刷", weight: 0.02 },
        { name: "牙膏", weight: 0.1 },
        { name: "洗面奶", weight: 0.12 },
        { name: "洗发水", weight: 0.15 },
        { name: "沐浴露", weight: 0.15 },
        { name: "毛巾", weight: 0.15 },
        { name: "防晒霜", weight: 0.1 },
        { name: "梳子", weight: 0.05 },
        { name: "纸巾", weight: 0.05 }
    ],
    "makeup": [
        { name: "粉底液", weight: 0.05 },
        { name: "气垫", weight: 0.08 },
        { name: "遮瑕", weight: 0.03 },
        { name: "散粉", weight: 0.05 },
        { name: "定妆喷雾", weight: 0.1 },
        { name: "妆前乳", weight: 0.05 },
        { name: "隔离霜", weight: 0.05 },
        { name: "BB霜", weight: 0.05 },
        { name: "CC霜", weight: 0.05 },
        { name: "眉笔", weight: 0.02 },
        { name: "眉粉", weight: 0.03 },
        { name: "染眉膏", weight: 0.02 },
        { name: "眼线笔", weight: 0.02 },
        { name: "眼线液", weight: 0.02 },
        { name: "睫毛膏", weight: 0.03 },
        { name: "睫毛夹", weight: 0.05 },
        { name: "假睫毛", weight: 0.01 },
        { name: "睫毛胶水", weight: 0.02 },
        { name: "眼影盘", weight: 0.1 },
        { name: "单色眼影", weight: 0.03 },
        { name: "高光", weight: 0.05 },
        { name: "阴影粉", weight: 0.05 },
        { name: "腮红", weight: 0.05 },
        { name: "口红", weight: 0.02 },
        { name: "唇釉", weight: 0.02 },
        { name: "唇彩", weight: 0.02 },
        { name: "唇线笔", weight: 0.01 },
        { name: "卸妆水", weight: 0.15 },
        { name: "卸妆油", weight: 0.15 },
        { name: "卸妆膏", weight: 0.1 },
        { name: "卸妆棉", weight: 0.05 },
        { name: "化妆棉", weight: 0.05 },
        { name: "化妆刷套装", weight: 0.15 },
        { name: "粉扑", weight: 0.02 },
        { name: "美妆蛋", weight: 0.02 },
        { name: "化妆镜", weight: 0.1 },
        { name: "化妆包", weight: 0.15 },
        { name: "双眼皮贴", weight: 0.01 },
        { name: "美瞳", weight: 0.01 },
        { name: "美瞳盒", weight: 0.05 },
        { name: "护理液", weight: 0.1 }
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
