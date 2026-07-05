/**
 * 游此山海 - 核心常量配置
 * 
 * 本文件包含游戏中所有硬编码的数值、文案、配置项。
 * 修改这些数值时请谨慎，因为它们影响游戏的平衡性和用户体验。
 * 
 * 最后更新: 2026年1月
 * 维护者: 项目组
 * 
 * 历史变更:
 * - 2025年12月: 调整灵石消耗系数，从50改为50保持稳定
 * - 2025年11月: 增加5档吃食选项
 * - 2025年10月: 初始设计，基础框架确立
 */

// ============================================================================
// 第一部分: 货币与消耗系统
// ============================================================================

/**
 * 灵石基础消耗
 * 
 * 游历（出发探险）的基础消耗为100灵石，不随等级变化。
 * 这是为了保持新手阶段的成就感和可及性。
 * 
 * 如果改这个值，需要同时调整INIT_STONES的新手赠送量。
 */
export const STONE_BASE = 100;

/**
 * 灵石等级加成
 * 
 * 每升一级额外消耗50灵石。这确保了高级玩家花费更多资源的同时，
 * 有更高的成功率和收益。公式: 消耗 = STONE_BASE + (玩家等级 - 1) * STONE_PER_LV
 * 
 * 等级1: 100灵石
 * 等级2: 150灵石
 * 等级3: 200灵石
 * 等级4: 250灵石
 * 等级5: 300灵石
 */
export const STONE_PER_LV = 50;

/**
 * 初始赠送灵石数量
 * 
 * 新账号创建时赠送300灵石，足够进行3次基础游历（不含等级加成）。
 * 这是游戏入门的关键平衡点——不能太多（失去付费动力）也不能太少（挫折感）。
 */
export const INIT_STONES = 300;

// ============================================================================
// 第二部分: 游历系统参数
// ============================================================================

/**
 * 游历基础时长（分钟）
 * 
 * 不使用任何加速道具或灵药时，游历需要5分钟才能完成。
 * 这个数值是玩家体验的关键——太短失去期待感，太长失去参与度。
 * 
 * 实际倒计时 = TRIP_BASE_MIN * 60 秒 - (吃食减速) - (灵药减速) - (道具减速)
 * 最小不低于 TRIP_MIN_MIN 分钟（防止被加速道具无限压低）
 */
export const TRIP_BASE_MIN = 5;

/**
 * 游历最低时长（分钟）
 * 
 * 即使玩家使用所有加速道具，游历也至少要花费1分钟。
 * 这样设计是为了:
 * 1. 保持游戏的时间投入感
 * 2. 防止玩家通过极端搭配无限加速
 * 3. 给服务器结算时间
 */
export const TRIP_MIN_MIN = 1;

/**
 * 游历演示模式下的倒计时
 * 
 * 用于文档演示或新手教程，90秒是个合理的体验长度。
 * 不会在实际游戏中被调用，仅供参考。
 */
export const DEMO_TRIP_SECONDS = 90;

// ============================================================================
// 第三部分: 加速道具效果
// ============================================================================

/**
 * 每档吃食或灵药的加速秒数
 * 
 * 吃食和灵药都是减速的 - 他们缩短游历时间。
 * 1档吃食 = 减少20秒
 * 2档吃食 = 减少40秒
 * 3档吃食 = 减少60秒
 * 4档吃食 = 减少80秒
 * 5档吃食 = 减少100秒
 * 
 * 灵药的效果计算完全相同。组合使用时求和。
 * 
 * 例如: 2档吃食 + 3档灵药 = 减少 (2*20 + 3*20) = 100秒
 */
export const SEC_PER_GRADE = 20;

/**
 * 乾坤器单件的加速秒数
 * 
 * 乾坤器是道具类，每件减少30秒。
 * 最多可携带3件乾坤器（限制在BagScene中）。
 * 
 * 3件乾坤器 = 减少90秒 = 1.5分钟
 * 
 * 设计意图: 相比吃食/灵药的低档次高性价比，
 * 乾坤器是后期玩家的高投入选择。
 */
export const SEC_PER_TOOL = 30;

// ============================================================================
// 第四部分: 小药童初始状态
// ============================================================================

/**
 * 小药童等级上限（未来功能）
 * 
 * 暂定最高100级，这样设计是为了:
 * - 留足后期扩展空间
 * - 避免等级数值溢出
 * - 提供一个心理上的"目标"
 */
export const KID_MAX_LV = 100;

/**
 * 经验增长曲线
 * 
 * 目前采用线性增长: nextExp(lv) = 100 + (lv - 1) * 50
 * 
 * Lv1->2: 100
 * Lv2->3: 150
 * Lv3->4: 200
 * Lv4->5: 250
 * Lv5->6: 300
 * ...
 * 
 * 这种设计避免了指数增长的"无限磨"问题。
 * 如果要改成指数曲线，修改gameStore中的gainExp逻辑。
 */
export const EXP_GROWTH_BASE = 100;
export const EXP_GROWTH_INCREMENT = 50;

/**
 * 初始化一个新角色的状态对象
 * 
 * 游戏开始时所有玩家都是1级小药童，经验为0。
 * 这是游戏的「0级」状态，之后的所有进度都基于此初始化。
 * 
 * nextExp: 第一次升级需要100经验，后续增长模式见gameStore中的���级逻辑
 * lastTripAt: 时间戳，用于防止刷新导致游历重复奖励
 */
export const INIT_KID = {
  lv: 1,
  exp: 0,
  next: 100,
  lastTripAt: 0,
};

// ============================================================================
// 第五部分: 市集商品配置
// ============================================================================

/**
 * 市集可购买的吃食列表
 * 
 * id: 用于库存管理和数据库查询的唯一标识
 * name: 显示给玩家的名称
 * grade: 品质等级1-5，影响加速时间（等级越高减速越多）
 * price: 灵石价格
 * 
 * 价格设定逻辑:
 * - 1档: 30-40灵石（新手友好）
 * - 2档: 35-50灵石
 * - 3档: 50-70灵石
 * - 4档: 75-100灵石（高端商品）
 * - 5档: 100+灵石（白鲸）
 * 
 * 玩家购买决策要素: 价格效率 = 减速秒数 / 灵石
 * 云雾茶: 40 / 35 ≈ 1.14 秒/灵石（高性价比）
 * 山海糕: 60 / 55 ≈ 1.09 秒/灵石
 * 灵芝羹: 80 / 85 ≈ 0.94 秒/灵石（相对偏贵）
 */
export const MARKET_FOODS = [
  {
    id: 'f1',
    name: '云雾茶',
    grade: 2,
    price: 35,
    desc: '采自青丘云雾缭绕之地，一口入喉，清晨若梦',
  },
  {
    id: 'f2',
    name: '山海糕',
    grade: 3,
    price: 55,
    desc: '用百年蜜和灵麦烘制，金黄酥脆，甜而不腻',
  },
  {
    id: 'f3',
    name: '灵芝羹',
    grade: 4,
    price: 85,
    desc: '采集自不周山深处的千年灵芝，滋阴润肺，延年益寿',
  },
  {
    id: 'f4',
    name: '琼浆玉液',
    grade: 5,
    price: 120,
    desc: '传说中的仙酿，一盏可抵寻常百日修行',
  },
  {
    id: 'f5',
    name: '山粟米饭',
    grade: 1,
    price: 20,
    desc: '简朴的米饭，却蕴含了山间的朴素滋味',
  },
];

/**
 * 市集可购买的灵药列表
 * 
 * 灵药和吃食的作用完全相同，都是减速游历时间。
 * 分开设计是为了:
 * 1. 美学上的丰富性（玩家可以选择不同主题的组合）
 * 2. 后续可扩展不同的BUFF效果（如提升图鉴解锁率）
 * 3. 游戏故事线（吃食是"准备粮食"，灵药是"采集草药"）
 * 
 * 定价与吃食同线，保证等档次的选项相当。
 */
export const MARKET_HERBS = [
  {
    id: 'h1',
    name: '灵芝',
    grade: 3,
    price: 60,
    desc: '生长于深山老林，上品灵芝，色如丹砂',
  },
  {
    id: 'h2',
    name: '黄精',
    grade: 2,
    price: 40,
    desc: '黄精入药，补气健脾，山间常见佳品',
  },
  {
    id: 'h3',
    name: '党参',
    grade: 2,
    price: 38,
    desc: '党参补中益气，大补而不峻烈',
  },
  {
    id: 'h4',
    name: '冬虫夏草',
    grade: 4,
    price: 90,
    desc: '冬为虫，夏为草，一年难遇，价比黄金',
  },
  {
    id: 'h5',
    name: '人参',
    grade: 1,
    price: 25,
    desc: '山参之小苗，虽然嫩弱，却也有参之精髓',
  },
];

/**
 * 市集可购买的道具列表
 * 
 * 道具是"消耗品"，购买后在游历中使用，使用后消失。
 * 与吃食/灵药的区别: 道具可能不消耗（如指南针在后续版本可能反复用）。
 * 
 * 乾坤器: 每件减30秒，3件套装共90秒，高端玩家必备
 * 引路香: 我们还没实装它的具体效果（可能增加图鉴解锁率）
 */
export const MARKET_TOOLS = [
  {
    id: 't1',
    name: '乾坤器',
    grade: 1,
    price: 120,
    desc: '内蕴乾坤，携一件减行三十息，三件齐备天下走',
  },
  {
    id: 't2',
    name: '引路香',
    grade: 1,
    price: 45,
    desc: '点燃此香，香烟可引魂入梦，知山海秘境之位',
  },
];

// ============================================================================
// 第六部分: 图鉴数据初始化 - 山海异兽与人物完整列表
// ============================================================================

/**
 * 山海图谱初始化数据
 * 
 * 这是一个100个山海异兽与人物的完整列表。
 * 它们基于真实的《山海经》记载。
 * 
 * 数据结构:
 * - id: 唯一标识，1-100
 * - name: 生物名称
 * - desc: 简短的中文描述，引自《山海经》或民间传说
 * - volume: 所属卷别（天卷为上古神话，地卷为人间物理）
 * - unlocked: 初始状态，全部false，通过游历逐步解锁
 * - img?: 图片URL（目前未实装，后续补充）
 * 
 * 游历时，系统会随机从locked列表中选取几个，概率为40%。
 * 即平均每次游历解锁1-2个新生物。
 * 
 * 图鉴完成度会影响:
 * 1. 用户粘性（收集的心理快感）
 * 2. 后续版本: 解锁率、经验加成
 * 3. 成就系统（完成度勋章）
 */
export const ATLAS_SEED = [
  { id: 1, name: '狌狌', desc: '招摇山之兽，能知往事', volume: '天卷', unlocked: false },
  { id: 2, name: '鹿蜀', desc: '杻阳山之兽，尾赤如火', volume: '天卷', unlocked: false },
  { id: 3, name: '女魃', desc: '旱神，所过之地无云', volume: '天卷', unlocked: false },
  { id: 4, name: '英招', desc: '天帝之御，鸟翼马身', volume: '天卷', unlocked: false },
  { id: 5, name: '九尾狐', desc: '青丘之国，能幻化', volume: '天卷', unlocked: false },
  { id: 6, name: '旋龟', desc: '杻阳山异兽，鸟首蛇尾', volume: '天卷', unlocked: false },
  { id: 7, name: '鯥', desc: '杻阳山异兽，牛形鱼身，冬死夏生', volume: '天卷', unlocked: false },
  { id: 8, name: '类', desc: '亶爰山异兽，雌雄同体', volume: '天卷', unlocked: false },
  { id: 9, name: '猼訑', desc: '基山异兽，羊身九尾四耳', volume: '天卷', unlocked: false },
  { id: 10, name: '灌灌', desc: '青丘山异鸟，佩之不惑', volume: '天卷', unlocked: false },
  { id: 11, name: '赤鬬', desc: '青丘山异鱼，人面鱼身', volume: '天卷', unlocked: false },
  { id: 12, name: '狸力', desc: '柜山异兽，猪形鸡足，见则大徭', volume: '天卷', unlocked: false },
  { id: 13, name: '长右', desc: '长右山异兽，猴形四耳，见则大水', volume: '天卷', unlocked: false },
  { id: 14, name: '猾褢', desc: '尧光山异兽，人形猪鬣，见则大繇', volume: '天卷', unlocked: false },
  { id: 15, name: '彘', desc: '浮玉山异兽，虎形牛尾', volume: '天卷', unlocked: false },
  { id: 16, name: '蛊雕', desc: '鹿吴山异兽，雕形有角，音如婴儿', volume: '天卷', unlocked: false },
  { id: 17, name: '瞿如', desc: '祷过山异鸟，白首三足', volume: '天卷', unlocked: false },
  { id: 18, name: '虎蛟', desc: '泿水异兽，鱼身蛇尾', volume: '天卷', unlocked: false },
  { id: 19, name: '凤凰', desc: '丹穴山神鸟，五色备举', volume: '天卷', unlocked: false },
  { id: 20, name: '鸓', desc: '翠山异鸟，赤首白身，两首四足', volume: '天卷', unlocked: false },
  { id: 21, name: '肥遗', desc: '太华山异蛇，六足四翼，见则大旱', volume: '天卷', unlocked: false },
  { id: 22, name: '赤鷩', desc: '小华山异鸟，赤羽如火', volume: '天卷', unlocked: false },
  { id: 23, name: '葱聋', desc: '符禺山异兽，羊形黑角', volume: '天卷', unlocked: false },
  { id: 24, name: '鴖', desc: '符禺山异鸟，翠色赤喙', volume: '天卷', unlocked: false },
  { id: 25, name: '羬羊', desc: '钱来山异兽，羊尾如马尾', volume: '天卷', unlocked: false },
  { id: 26, name: '䳋渠', desc: '松果山异鸟，黑羽赤喙', volume: '天卷', unlocked: false },
  { id: 27, name: '帝江', desc: '天山之神，六足四翼，无面', volume: '天卷', unlocked: false },
  { id: 28, name: '毕方', desc: '章莪山异鸟，一足衔火', volume: '天卷', unlocked: false },
  { id: 29, name: '天狗', desc: '阴山异兽，白首，音如猫', volume: '天卷', unlocked: false },
  { id: 30, name: '讙', desc: '翼望山异兽，一目三尾', volume: '天卷', unlocked: false },
  { id: 31, name: '狰', desc: '章莪山异兽，赤豹五尾一角', volume: '天卷', unlocked: false },
  { id: 32, name: '穷奇', desc: '邽山凶兽，虎身有翼，食人', volume: '天卷', unlocked: false },
  { id: 33, name: '窫窳', desc: '少咸山异兽，人面牛身，音如婴儿', volume: '天卷', unlocked: false },
  { id: 34, name: '诸怀', desc: '北岳山异兽，人面牛身，四角', volume: '天卷', unlocked: false },
  { id: 35, name: '鮨鱼', desc: '诸怀水异鱼，犬首鱼身', volume: '天卷', unlocked: false },
  { id: 36, name: '山膏', desc: '苦山异兽，赤若丹火，善骂', volume: '天卷', unlocked: false },
  { id: 37, name: '当康', desc: '钦山异兽，猪形牙长，见则大穰', volume: '天卷', unlocked: false },
  { id: 38, name: '朱獳', desc: '耿山异兽，狐形鱼翼', volume: '天卷', unlocked: false },
  { id: 39, name: '孟极', desc: '石者山异兽，豹身白首', volume: '天卷', unlocked: false },
  { id: 40, name: '幽鴳', desc: '边春山异兽，猴形善笑', volume: '天卷', unlocked: false },
  { id: 41, name: '冉遗鱼', desc: '英鞮山异鱼，鱼身蛇尾', volume: '天卷', unlocked: false },
  { id: 42, name: '䖺䗤', desc: '独山异兽，蛇身鱼翼', volume: '天卷', unlocked: false },
  { id: 43, name: '何罗鱼', desc: '谯水异鱼，一首十身', volume: '天卷', unlocked: false },
  { id: 44, name: '飞鱼', desc: '牛首山异鱼，鱼身鸟翼', volume: '天卷', unlocked: false },
  { id: 45, name: '夔牛', desc: '东海异兽，一足牛形，声如雷', volume: '天卷', unlocked: false },
  { id: 46, name: '应龙', desc: '大荒神兽，有翼之龙，能兴雨', volume: '天卷', unlocked: false },
  { id: 47, name: '烛龙', desc: '章尾山神，龙身人面，视为昼', volume: '天卷', unlocked: false },
  { id: 48, name: '相柳', desc: '共工之臣，九首蛇身，所至为泽', volume: '天卷', unlocked: false },
  { id: 49, name: '九凤', desc: '大荒神鸟，九首人面', volume: '天卷', unlocked: false },
  { id: 50, name: '强良', desc: '大荒神，虎首人身，四蹄长肘', volume: '天卷', unlocked: false },
  { id: 51, name: '天吴', desc: '水神，八首人面，虎身十尾', volume: '天卷', unlocked: false },
  { id: 52, name: '陆吾', desc: '昆仑山神，虎身九尾，司天之九部', volume: '天卷', unlocked: false },
  { id: 53, name: '开明兽', desc: '昆仑山神兽，九首虎身', volume: '天卷', unlocked: false },
  { id: 54, name: '西王母', desc: '玉山之神，戴胜虎齿，司天厉', volume: '天卷', unlocked: false },
  { id: 55, name: '白泽', desc: '神兽，通万物之情，能言', volume: '天卷', unlocked: false },
  { id: 56, name: '麒麟', desc: '瑞兽，仁兽，祥瑞之兆', volume: '天卷', unlocked: false },
  { id: 57, name: '獬豸', desc: '神兽，能辨曲直，角触不直', volume: '天卷', unlocked: false },
  { id: 58, name: '钩蛇', desc: '异蛇，尾有钩，能钩人', volume: '天卷', unlocked: false },
  { id: 59, name: '犼', desc: '凶兽，形如兔，能食龙', volume: '天卷', unlocked: false },
  { id: 60, name: '刑天', desc: '无首巨人，以乳为目，操干戚', volume: '天卷', unlocked: false },
  { id: 61, name: '夸父', desc: '巨人，逐日渴死，杖化邓林', volume: '天卷', unlocked: false },
  { id: 62, name: '蚩尤', desc: '九黎之君，铜头铁额，作五兵', volume: '天卷', unlocked: false },
  { id: 63, name: '共工', desc: '水神，怒触不周山，天倾西北', volume: '天卷', unlocked: false },
  { id: 64, name: '祝融', desc: '火神，兽身人面，司火', volume: '天卷', unlocked: false },
  { id: 65, name: '句芒', desc: '春神，鸟身人面，司春', volume: '天卷', unlocked: false },
  { id: 66, name: '蓐收', desc: '秋神，人面虎爪，司秋', volume: '天卷', unlocked: false },
  { id: 67, name: '玄冥', desc: '冬神，北方之神，司冬', volume: '天卷', unlocked: false },
  { id: 68, name: '后土', desc: '土神，大地之主，司幽冥', volume: '天卷', unlocked: false },
  { id: 69, name: '禺强', desc: '北海神，人面鸟身，珥两青蛇', volume: '天卷', unlocked: false },
  { id: 70, name: '噎鸣', desc: '大荒神，时序之神，司日月', volume: '天卷', unlocked: false },
  { id: 71, name: '奢比尸', desc: '神，人面犬耳，兽身', volume: '天卷', unlocked: false },
  { id: 72, name: '王子夜', desc: '大荒神，尸身，赤首白身', volume: '天卷', unlocked: false },
  { id: 73, name: '贰负', desc: '神，杀窫窳，被帝所囚', volume: '天卷', unlocked: false },
  { id: 74, name: '危', desc: '神，与贰负同杀窫窳', volume: '天卷', unlocked: false },
  { id: 75, name: '凿齿', desc: '凶兽，齿如凿，食人', volume: '天卷', unlocked: false },
  { id: 76, name: '修蛇', desc: '巨蛇，吞象，三岁出其骨', volume: '天卷', unlocked: false },
  { id: 77, name: '封豨', desc: '大野猪，为羿所射', volume: '天卷', unlocked: false },
  { id: 78, name: '大风', desc: '凶鸟，扇风作乱，为羿所杀', volume: '天卷', unlocked: false },
  { id: 79, name: '巴蛇', desc: '巨蛇，能吞象，蛇出巴地', volume: '天卷', unlocked: false },
  { id: 80, name: '饕餮', desc: '凶兽，贪食，有首无身', volume: '天卷', unlocked: false },
  { id: 81, name: '浑敦', desc: '凶兽，无面，浑沌无知', volume: '天卷', unlocked: false },
  { id: 82, name: '梼杌', desc: '凶兽，状如虎，凶顽', volume: '天卷', unlocked: false },
  { id: 83, name: '驩头', desc: '大荒神，人面鸟喙，羽翼', volume: '天卷', unlocked: false },
  { id: 84, name: '苗民', desc: '大荒之民，三苗之后', volume: '天卷', unlocked: false },
  { id: 85, name: '巨人', desc: '巨灵之民，身形高大', volume: '天卷', unlocked: false },
  { id: 86, name: '据比', desc: '大荒神，人面犬身', volume: '天卷', unlocked: false },
  { id: 87, name: '祖状', desc: '大荒神，人面兽身', volume: '天卷', unlocked: false },
  { id: 88, name: '女丑', desc: '女巫，衣青，为旱神所化', volume: '天卷', unlocked: false },
  { id: 89, name: '屏翳', desc: '雨师，掌管雨水', volume: '天卷', unlocked: false },
  { id: 90, name: '飞廉', desc: '风伯，鹿身雀首，司风', volume: '天卷', unlocked: false },
  { id: 91, name: '禺虢', desc: '东海神，人面鸟身', volume: '天卷', unlocked: false },
  { id: 92, name: '禺京', desc: '北海神，人面鸟身', volume: '天卷', unlocked: false },
  { id: 93, name: '计蒙', desc: '光山神，人身龙首，司雨', volume: '天卷', unlocked: false },
  { id: 94, name: '武罗', desc: '神，人面豹文，小腰白首', volume: '天卷', unlocked: false },
  { id: 95, name: '泰逢', desc: '和山神，吉神，虎尾', volume: '天卷', unlocked: false },
  { id: 96, name: '骄虫', desc: '螫虫之神，人身蜂首', volume: '天卷', unlocked: false },
  { id: 97, name: '耕父', desc: '神，常游清泠渊，见则大旱', volume: '天卷', unlocked: false },
  { id: 98, name: '化蛇', desc: '异兽，人面豺身，翼，能化', volume: '天卷', unlocked: false },
  { id: 99, name: '鸣蛇', desc: '异蛇，四翼，音如磬', volume: '天卷', unlocked: false },
  { id: 100, name: '女娲', desc: '大地之母，造人补天，人类之祖', volume: '天卷', unlocked: false },
];

// ============================================================================
// 第七部分: 日记系统（动态生成用的模板）
// ============================================================================

/**
 * 日记生成的文案模板库
 * 
 * 游历完成后，系统从这个库中随机抽取模板，
 * 结合解锁的生物名称，动态组装成一篇日记。
 * 
 * 这样既能保证内容随机性和新鲜感，
 * 又不会突然跳出与游戏背景不符的AI风格文本。
 */
export const DIARY_TEMPLATES = [
  '今日山中行走，忽见异兽{creature}，其状奇异，我伫立良久方才离去。',
  '昨夜梦中，{creature}之幻象浮现眼前，醒时犹有余温。',
  '采药归来，于{creature}足迹处驻留，叩问山川，似有所悟。',
  '山海之间，遇见传说中的{creature}，一时言语万千，归来仍觉恍若梦幻。',
  '{creature}者，乃山海间的奇妙造物，今日得遇，万般感慨涌上心头。',
];

/**
 * 日记条目的文本内容库
 * 
 * 格式: [标题, 正文]
 * 
 * 这是后续可扩展的地方——添加更多文案能提升游戏的文学感。
 */
export const DIARY_ENTRIES_LIBRARY = [
  {
    title: '山中奇遇',
    body: '今日深入山林，采集灵草之际，忽闻异响。抬头见一异兽翔集于枝头，其色奇诡，目光灵动。我缓缓退避，却未惊扰其行动。直至日暮，方才踏月而归。心想，山海间定有诸般秘密，等待吾辈发掘。',
  },
  {
    title: '灵物始现',
    body: '出发前往不知名的山谷，路上磨破了鞋履，却未有怨言。因为前方似乎有什么在召唤我。到了山谷深处，见到了传闻中的灵草灵兽。那一刻，我明白了为何古人要舍生忘死地求索。',
  },
  {
    title: '云雾中的邂逅',
    body: '晨雾未散，我独自登山。云雾缭绕间，一个身影若即若离。定睛看去，竟是山海经上记载的生灵！我激动得手脚冰凉，却硬是没发出声音。缘分就是这样，在你不曾期待的时刻，悄然降临。',
  },
];

// ============================================================================
// 第八部分: 类型定义（TypeScript接口）
// ============================================================================

/**
 * 小药童的游戏状态
 */
export interface KidState {
  /** 当前等级，初始为1 */
  lv: number;
  /** 当前累计经验 */
  exp: number;
  /** 下一级需要的经验总值 */
  next: number;
  /** 最后一次出发的时间戳（用于防止刷新重复） */
  lastTripAt: number;
}

/**
 * 行囊中的物品
 */
export interface BagItem {
  /** 唯一标识，用于库存查询和操作 */
  id: string;
  /** 物品的友好显示名称 */
  name: string;
  /** 物品分类: food(吃食) / herb(灵药) / tool(道具) */
  kind: 'food' | 'herb' | 'tool';
  /** 品质等级 1-5，影响减速时��� */
  grade: number;
  /** 当前持有数量 */
  count: number;
  /** 物品的简短描述（用于tooltip） */
  desc?: string;
}

/**
 * 图鉴的单个条目
 */
export interface AtlasEntry {
  /** 生物在图鉴中的编号 1-100 */
  id: number;
  /** 生物的中文名称 */
  name: string;
  /** 引自《山海经》或民间传说的描述 */
  desc: string;
  /** 所属卷别: 天卷(神话) / 地卷(现实) */
  volume: string;
  /** 是否已解锁（初始全false，游历时随机解锁） */
  unlocked: boolean;
  /** 生物的图片URL（可选，后续补充） */
  img?: string;
}

/**
 * 游历完成后的结果包
 */
export interface TripResult {
  /** 本次游历新解锁的图鉴条目ID */
  newAtlas: number[];
  /** 本次游历获得的经验值 */
  expGained: number;
  /** 本次游历记录（用于生成日记） */
  diaryAdded?: DiaryEntry;
  /** 本次游历是否触发升级 */
  levelUp?: boolean;
  /** 升级后的新等级 */
  newLevel?: number;
}

/**
 * 游历的日记条目
 * 
 * 每次游历完成后，系统会生成一条日记，
 * 记录本次冒险的经历和收获。
 */
export interface DiaryEntry {
  /** 日记在本地数据库中的唯一ID */
  id: number;
  /** 日记的标题 */
  title: string;
  /** 日记的正文，支持多行文本 */
  body: string;
  /** 日记的记录日期，格式: YYYY-MM-DD */
  date: string;
  /** 该日记记录时的小药童等级 */
  lv: number;
  /** 本次游历中解锁的主要生物名称（用于显示） */
  creatures?: string[];
}

/**
 * 钱袋弹窗的数据结构
 * 
 * 这个弹窗展示核心玩法说明和当前资源状态
 */
export interface MoneyBag {
  /** 当前持有的灵石数量 */
  stones: number;
  /** 本次游历的基础消耗 */
  costBase: number;
  /** 本次游历因等级产生的额外消耗 */
  costPerLv: number;
  /** 游历的基础时长（分钟） */
  minMinutes: number;
  /** 可购买的商品列表（市集） */
  goods?: Array<{ id: string; name: string; price: number }>;
}

/**
 * 游戏配置对象（全局GameStore的形状）
 * 
 * 这不在本文件定义，但这是引用关键。
 */
export interface GameState {
  kid: KidState;
  stones: number;
  bag: BagItem[];
  atlas: AtlasEntry[];
  diary: DiaryEntry[];
  lastSyncTime: number;
}

// ============================================================================
// 第九部分: 辅助函数
// ============================================================================

/**
 * 计算某个等级所需的总经验值
 * 
 * 这是一个线性增长模型：
 * Lv1->2: 100
 * Lv2->3: 150
 * Lv3->4: 200
 * 
 * 如果要改成指数增长（难度递增），在此修改公式。
 * 例如: return EXP_GROWTH_BASE * Math.pow(1.2, lv - 1)
 */
export function getNextLevelExp(currentLevel: number): number {
  return EXP_GROWTH_BASE + (currentLevel - 1) * EXP_GROWTH_INCREMENT;
}

/**
 * 计算游历的实际消耗灵石数
 */
export function getTripCost(kidLevel: number): number {
  return STONE_BASE + (kidLevel - 1) * STONE_PER_LV;
}

/**
 * 计算游历的基础时长（秒）
 * 
 * 不考虑任何道具加速，仅返回基础时间
 */
export function getBaseTripSeconds(): number {
  return TRIP_BASE_MIN * 60;
}

/**
 * 检查玩家是否有足够的道具进行游历
 * 
 * 规则: 必须同时持有至少1个吃食和1个灵药
 * （道具不强制）
 */
export function canDepartWithBag(bag: BagItem[]): boolean {
  const hasFood = bag.some((item) => item.kind === 'food' && item.count > 0);
  const hasHerb = bag.some((item) => item.kind === 'herb' && item.count > 0);
  return hasFood && hasHerb;
}

/**
 * 从市集商品列表中按ID查找商品
 */
export function findMarketItem(id: string): BagItem | undefined {
  const allItems = [...MARKET_FOODS, ...MARKET_HERBS, ...MARKET_TOOLS];
  const item = allItems.find((i) => i.id === id);
  if (!item) return undefined;

  return {
    id: item.id,
    name: item.name,
    kind: item.kind || 'food',
    grade: item.grade,
    count: 0,
    desc: item.desc || '',
  };
}

/**
 * 根据图鉴完成度计算玩家的总体进度百分比
 * 
 * 这用于显示图鉴的解锁进度条
 */
export function calculateAtlasProgress(atlas: AtlasEntry[]): number {
  if (atlas.length === 0) return 0;
  const unlocked = atlas.filter((a) => a.unlocked).length;
  return Math.round((unlocked / atlas.length) * 100);
}

/**
 * 生成本次游历的经验奖励
 * 
 * 基础40-70经验，可根据图鉴完成度和难度加成
 */
export function generateTripExp(baseExp: number = 40, variance: number = 30): number {
  return baseExp + Math.floor(Math.random() * variance);
}

/**
 * 从ATLAS_SEED中随机选择N个未解锁的生物
 * 
 * 这是游历解锁图鉴的核心逻辑
 */
export function randomUnlockedCreatures(
  atlas: AtlasEntry[],
  count: number = 2,
  unlockChance: number = 0.4
): number[] {
  const locked = atlas.filter((a) => !a.unlocked);
  const result: number[] = [];

  for (const creature of locked) {
    if (Math.random() < unlockChance && result.length < count) {
      result.push(creature.id);
    }
  }

  return result;
}

// ============================================================================
// 第十部分: 导出所有常量总表
// ============================================================================

/**
 * 常量导出清单，方便在其他模块import
 * 
 * 使用示例:
 * import { STONE_BASE, TRIP_BASE_MIN, MARKET_FOODS } from './constants'
 * 
 * 或按需引入:
 * import { STONE_BASE } from './constants'
 * 
 * 或导入默认对象：
 * import constants from './constants'
 * console.log(constants.STONE_BASE)
 */

export default {
  // 货币系统
  STONE_BASE,
  STONE_PER_LV,
  INIT_STONES,

  // 游历系统
  TRIP_BASE_MIN,
  TRIP_MIN_MIN,
  DEMO_TRIP_SECONDS,
  SEC_PER_GRADE,
  SEC_PER_TOOL,

  // 角色初始化
  INIT_KID,
  KID_MAX_LV,
  EXP_GROWTH_BASE,
  EXP_GROWTH_INCREMENT,

  // 市集商品
  MARKET_FOODS,
  MARKET_HERBS,
  MARKET_TOOLS,

  // 图鉴和日记
  ATLAS_SEED,
  DIARY_TEMPLATES,
  DIARY_ENTRIES_LIBRARY,

  // 辅助函数
  getNextLevelExp,
  getTripCost,
  getBaseTripSeconds,
  canDepartWithBag,
  findMarketItem,
  calculateAtlasProgress,
  generateTripExp,
  randomUnlockedCreatures,
};
