// 物品模板库
const itemsTemplates = {
    "documents": [
        { name: "身份证", weight: 0.05 },
        { name: "护照", weight: 0.1 },
        { name: "边防证", weight: 0.05 },
        { name: "驾驶证", weight: 0.05 },
        { name: "银行卡", weight: 0.01 },
        { name: "信用卡", weight: 0.01 },
        { name: "现金", weight: 0.05 }
    ],
    "clothing": [
        { name: "内衣", weight: 0.05, quantity: 3 },
        { name: "内裤", weight: 0.03, quantity: 5 },
        { name: "袜子", weight: 0.05, quantity: 5 },
        { name: "短袖T恤", weight: 0.15, quantity: 3 },
        { name: "长袖衬衫", weight: 0.2, quantity: 2 },
        { name: "长裤", weight: 0.3, quantity: 2 },
        { name: "短裤", weight: 0.2 },
        { name: "冲锋衣", weight: 0.8 },
        { name: "羽绒服", weight: 1.2 },
        { name: "薄外套", weight: 0.4 },
        { name: "运动鞋", weight: 0.6 },
        { name: "拖鞋", weight: 0.2 },
        { name: "帽子", weight: 0.1 }
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
