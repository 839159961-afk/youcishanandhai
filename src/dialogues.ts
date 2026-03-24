export type DialogueTrigger =
  | 'CLICK'
  | 'RAPID_CLICK'
  | 'IDLE'
  | 'LEVEL_UP'
  | 'RAIN'
  | 'SNOW'
  | 'NIGHT'
  | 'MORNING'
  | 'RETURN'
  | 'FESTIVAL';

export type DialogueCategory = 'ADMIRE' | 'CLINGY' | 'FUNNY' | 'BLESS' | 'SITUATION';

export type HerbalistDialogue = {
  id: string;
  category: DialogueCategory;
  trigger: DialogueTrigger;
  text: string;
};

export const HERBALIST_DIALOGUES: HerbalistDialogue[] = [
  { id: 'd001', category: 'ADMIRE', trigger: 'CLICK', text: '哇！师傅今天帅得连烛龙都要闭上眼避其锋芒了！' },
  { id: 'd002', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你这招“摸摸头”是不是什么绝世神功？阿离觉得好温暖！' },
  { id: 'd003', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你眼里的星辰，比我采的所有灵石都要亮。' },
  { id: 'd004', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，为什么你连翻看药典的样子都这么迷人呀？' },
  { id: 'd005', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你一定是天上掉下来的仙人，特意来收阿离为徒的吧？' },
  { id: 'd006', category: 'ADMIRE', trigger: 'CLICK', text: '师傅笑起来，全大荒的花都开了，阿离也要跟着笑！' },
  { id: 'd007', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你这身道袍真好看，穿出了九重天的气场。' },
  { id: 'd008', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你的智商一定有两万八，伏羲大神都要找你请教八卦吧？' },
  { id: 'd009', category: 'ADMIRE', trigger: 'CLICK', text: '救命！师傅美得太过分了，阿离都要忘记怎么背药名了。' },
  { id: 'd010', category: 'ADMIRE', trigger: 'CLICK', text: '师傅的手真修长，一定是为了拯救苍生才生得这么好看。' },
  { id: 'd011', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你是不是偷吃了西王母的长生露？皮肤怎么这么好！' },
  { id: 'd012', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你走路的姿势都带着仙气，阿离踩着你的脚印走好不好？' },
  { id: 'd013', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你刚才那个眼神，简直比朱雀的火精还要炙热。' },
  { id: 'd014', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你就是阿离心中唯一的、永远的神！' },
  { id: 'd015', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，为什么别的神仙都没你好看？这不公平！' },
  { id: 'd016', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你专注看地图的样子，让阿离觉得这世界好安静、好安心。' },
  { id: 'd017', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你随手一指的方向，就是阿离心中的天堂。' },
  { id: 'd018', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你这气场，走在路上连穷奇都要给你让路。' },
  { id: 'd019', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你教我的不是法术，是让世界变美好的魔法！' },
  { id: 'd020', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你是不是会变魔术？怎么每天都比昨天更好看一点。' },
  { id: 'd021', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，阿离上辈子一定是救了整座昆仑山，这辈子才能当你的徒弟。' },
  { id: 'd022', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你随便拨动一下琴弦，阿离的心都要跟着颤动了。' },
  { id: 'd023', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，别的神仙是高高在上，你是在阿离的心尖上。' },
  { id: 'd024', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你就是这大荒中最亮的那束光！' },
  { id: 'd025', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你低头看我的时候，阿离觉得自己是全世界最幸福的小药童。' },
  { id: 'd026', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你的声音真好听，比黄雀唱歌还治愈。' },
  { id: 'd027', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你这操作太神了，阿离要把这段写进《阿离语录》里！' },
  { id: 'd028', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你一定是这大荒的主角，阿离就是你最忠诚的小跟班。' },
  { id: 'd029', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你的魅力简直是万能药，阿离一看你就不累了。' },
  { id: 'd030', category: 'ADMIRE', trigger: 'CLICK', text: '师傅，你就是完美本美，不接受反驳！' },

  { id: 'd031', category: 'CLINGY', trigger: 'IDLE', text: '师傅师傅，再摸摸阿离的头嘛，就一下！' },
  { id: 'd032', category: 'CLINGY', trigger: 'IDLE', text: '师傅，阿离会努力变强的，以后换阿离保护你！' },
  { id: 'd033', category: 'CLINGY', trigger: 'IDLE', text: '师傅，你去哪儿都要带着阿离哦，拉钩上吊一百年不许变。' },
  { id: 'd034', category: 'CLINGY', trigger: 'IDLE', text: '师傅，阿离采了最甜的野果，第一口一定要给师傅吃。' },
  { id: 'd035', category: 'CLINGY', trigger: 'IDLE', text: '师傅，只要在你身边，阿离就觉得大荒一点都不可怕。' },
  { id: 'd036', category: 'CLINGY', trigger: 'IDLE', text: '师傅，你不在的时候，阿离对着丹炉都在喊你的名字。' },
  { id: 'd037', category: 'CLINGY', trigger: 'IDLE', text: '师傅，你是阿离在这个世界上最崇拜的人。' },
  { id: 'd038', category: 'CLINGY', trigger: 'IDLE', text: '师傅，累了就靠在阿离肩膀上歇一会儿（虽然阿离还小）。' },
  { id: 'd039', category: 'CLINGY', trigger: 'IDLE', text: '师傅，阿离会永远乖乖听话的，别丢下阿离好不好？' },
  { id: 'd040', category: 'CLINGY', trigger: 'IDLE', text: '师傅，你点我一下，我就能多帮你背一个药筐！' },
  { id: 'd041', category: 'CLINGY', trigger: 'IDLE', text: '师傅，阿离今天是不是又变漂亮了一点点？快夸我！' },
  { id: 'd042', category: 'CLINGY', trigger: 'IDLE', text: '师傅，有你在，阿离觉得每天都是春天。' },
  { id: 'd043', category: 'CLINGY', trigger: 'IDLE', text: '师傅，你是阿离心中的大英雄，连饕餮都怕你。' },
  { id: 'd044', category: 'CLINGY', trigger: 'IDLE', text: '师傅，快看！那朵云长得好像你夸我时候的样子。' },
  { id: 'd045', category: 'CLINGY', trigger: 'IDLE', text: '师傅，阿离会帮你把药炉烧得旺旺的。' },
  { id: 'd046', category: 'CLINGY', trigger: 'IDLE', text: '师傅，你对阿离真好，你是世界上最好最好的师傅。' },
  { id: 'd047', category: 'CLINGY', trigger: 'IDLE', text: '师傅，你不在的时候，连小兔子都在问你什么时候回来。' },
  { id: 'd048', category: 'CLINGY', trigger: 'IDLE', text: '师傅，阿离会帮你守好每一棵仙草，谁都不许偷！' },
  { id: 'd049', category: 'CLINGY', trigger: 'IDLE', text: '师傅，你是阿离的避风港。' },
  { id: 'd050', category: 'CLINGY', trigger: 'IDLE', text: '师傅，跟着你闯荡山海，是阿离最开心的事。' },
  { id: 'd051', category: 'CLINGY', trigger: 'IDLE', text: '师傅，你教我的东西我都记在心里啦（虽然有时候会忘记）。' },
  { id: 'd052', category: 'CLINGY', trigger: 'IDLE', text: '师傅，你笑起来最好看了，以后多笑给阿离看嘛。' },
  { id: 'd053', category: 'CLINGY', trigger: 'IDLE', text: '师傅，你是阿离最重要的人，没有之一！' },
  { id: 'd054', category: 'CLINGY', trigger: 'IDLE', text: '师傅，抓着你的衣角，阿离就不会迷路了。' },
  { id: 'd055', category: 'CLINGY', trigger: 'IDLE', text: '师傅，阿离会努力学习，以后当你的左膀右臂！' },

  { id: 'd056', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '师傅，你再点我，我就要赖在你怀里不起来啦！' },
  { id: 'd057', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '师傅，你是不是喜欢阿离呀？老是点人家。' },
  { id: 'd058', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '哎呀，师傅！头发被你点乱了，要赔一个亲亲！' },
  { id: 'd059', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '师傅，你口袋里有没有藏好吃的？阿离的鼻子可是很灵的。' },
  { id: 'd060', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '师傅，刚才那只肥遗在看你，它是不是想拜你为师？阿离不准！' },
  { id: 'd061', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '师傅，别总看地图啦，多看看阿离这张可爱的小脸嘛。' },
  { id: 'd062', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '师傅，我是不是你最爱的唯一的小徒弟？' },
  { id: 'd063', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '师傅，你这身衣服穿上去，简直就是大荒第一男神/女神。' },
  { id: 'd064', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '师傅，我怀疑你偷偷修炼了“迷人神功”，快教教我！' },
  { id: 'd065', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '师傅，你看那边有个坑，别掉进去，阿离可抱不动你。' },
  { id: 'd066', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '师傅，点一下阿离，我就能多长高一厘米吗？' },
  { id: 'd067', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '师傅，别看了，再看我就要害羞得钻进药篓里了。' },
  { id: 'd068', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '师傅，你是吃什么长大的？怎么可以又聪明又好看。' },
  { id: 'd069', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '师傅，我是你的专属小药童，不接受退款，也不接受换货！' },
  { id: 'd070', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '师傅，你是不是有读心术？怎么知道阿离想让你抱抱。' },
  { id: 'd071', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '师傅，你这操作比玄武转身还稳，太帅了！' },
  { id: 'd072', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '师傅，我看你骨骼惊奇，适合当阿离一辈子的师傅。' },
  { id: 'd073', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '师傅，你这么忙还来陪我，阿离要把你排在心里第一位！' },
  { id: 'd074', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '师傅，如果你去参加神仙选美，一定是第一名。' },
  { id: 'd075', category: 'FUNNY', trigger: 'RAPID_CLICK', text: '师傅，点一下阿离，所有的烦恼都“咻”地一声不见啦！' },

  { id: 'd076', category: 'BLESS', trigger: 'RETURN', text: '师傅，阿离刚刚向锦鲤大神许愿了，你下一抽必中！' },
  { id: 'd077', category: 'BLESS', trigger: 'RETURN', text: '师傅，我感觉你今天运气红得发紫，快去开宝箱！' },
  { id: 'd078', category: 'BLESS', trigger: 'RETURN', text: '师傅，带着阿离，保你出门见喜，遇难成祥。' },
  { id: 'd079', category: 'BLESS', trigger: 'RETURN', text: '师傅，这片区域的草药都在排队等着你采呢。' },
  { id: 'd080', category: 'BLESS', trigger: 'RETURN', text: '师傅，你的福气厚得连天雷都不敢劈你。' },
  { id: 'd081', category: 'BLESS', trigger: 'RETURN', text: '师傅，今天的你运气值爆棚，快去试试手气。' },
  { id: 'd082', category: 'BLESS', trigger: 'RETURN', text: '师傅，只要你想，这大荒的宝贝都是你的。' },
  { id: 'd083', category: 'BLESS', trigger: 'RETURN', text: '师傅，愿你所得皆所愿，阿离陪你走天下。' },
  { id: 'd084', category: 'BLESS', trigger: 'RETURN', text: '师傅，你是被整座山海经宠爱的人。' },
  { id: 'd085', category: 'BLESS', trigger: 'RETURN', text: '师傅，有我在，那些“非气”全都被我吹跑了！' },
  { id: 'd086', category: 'BLESS', trigger: 'RETURN', text: '师傅，你随便砍一刀，怪兽都要爆神装。' },
  { id: 'd087', category: 'BLESS', trigger: 'RETURN', text: '师傅，你是天选之子，阿离是天选之徒！' },
  { id: 'd088', category: 'BLESS', trigger: 'RETURN', text: '师傅，愿你的冒险之路开满鲜花，没有荆棘。' },
  { id: 'd089', category: 'BLESS', trigger: 'RETURN', text: '师傅，你的一片真心，连顽石都会点头。' },
  { id: 'd090', category: 'BLESS', trigger: 'RETURN', text: '师傅，祝师傅今天心情比彩虹还要绚丽多彩！' },

  { id: 'd091', category: 'SITUATION', trigger: 'NIGHT', text: '师傅，天黑了，去休息吧，阿离帮你守着灯火。' },
  { id: 'd092', category: 'SITUATION', trigger: 'MORNING', text: '师傅早安！阿离已经帮你准备好洗脸的晨露啦。' },
  { id: 'd093', category: 'SITUATION', trigger: 'RAPID_CLICK', text: '师傅，别点啦，阿离的小脑袋都要被你点晕了，嘻嘻。' },
  { id: 'd094', category: 'SITUATION', trigger: 'RETURN', text: '师傅！你总算回来了，阿离数星星数了好多遍。' },
  { id: 'd095', category: 'SITUATION', trigger: 'LEVEL_UP', text: '哇！师傅又突破了！不愧是我的师傅，太强了！' },
  { id: 'd096', category: 'SITUATION', trigger: 'RAIN', text: '师傅，快躲到阿离的斗篷里来，别湿了衣裳。' },
  { id: 'd097', category: 'SITUATION', trigger: 'SNOW', text: '师傅，阿离帮你暖暖手，别冻着了。' },
  { id: 'd098', category: 'SITUATION', trigger: 'FESTIVAL', text: '祝师傅生辰快乐！阿离会一辈子陪在师傅身边。' },
  { id: 'd099', category: 'SITUATION', trigger: 'FESTIVAL', text: '师傅，快看！外面的烟火好美，但都没师傅美。' },
  { id: 'd100', category: 'SITUATION', trigger: 'RETURN', text: '师傅，遇见你，是阿离这辈子最大的造化。' },
];

export function pickDialogue(
  trigger: DialogueTrigger,
  lastId: string | null,
  history: string[]
): HerbalistDialogue | null {
  const pool = HERBALIST_DIALOGUES.filter((d) => d.trigger === trigger);
  if (pool.length === 0) return null;

  const recent = new Set(history.slice(-5));
  let candidates = pool.filter((d) => !recent.has(d.id));

  if (lastId) {
    const noLast = candidates.filter((d) => d.id !== lastId);
    if (noLast.length > 0) candidates = noLast;
  }

  if (candidates.length === 0) candidates = pool;
  return candidates[Math.floor(Math.random() * candidates.length)] ?? null;
}
