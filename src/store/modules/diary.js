const state = {
  // 默认频道
  channels: [
    { id: "default", name: "全部" },
    { id: "masturbation", name: "蜕变史" },
    { id: "obscenity", name: "麦式" },
    { id: "NE", name: "饮食" },
    { id: "prostatitis", name: "作息" },
    { id: "example", name: "心理" },
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