const state = {
  // 默认频道
  channels: [
    { id: "default", name: "全部" },
    { id: "tbs", name: "蜕变史" },
    { id: "ms", name: "麦式" },
    { id: "ys", name: "饮食" },
    { id: "zx", name: "作息" },
    { id: "xl", name: "心理" },
  ],

  // 频道过滤
  filters: [
    { id: "recommend", name: "精品" },
    { id: "latest", name: "最新" },
    { id: "hot", name: "最热" },
    { id: "cold", name: "最冷" },
  ]
};

export default {
  state 
};