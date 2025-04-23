import {ParticipantsList} from "@/types/participants";

export const participants: ParticipantsList = [
  {
    id: 'player',
    name: 'とじょりん',
    strategy: {
      type: 'center',
      passChance: 0,
    },
    img: "heart_Q",
    colors: {
      background: '#FFCCCC',  // 薄いピンク
      text: '#660000',        // 暗めの赤茶
      border: '#FF6666',      // 少し濃いピンク
    },
    lines: {
      start: ['こんこんりんか～', 'おはおはりんか～'],
      pass: ['止めてるの誰？（パス）', '建設員ならわかってるよね？ ね？（パス）'],
      giveUp: ['そうんな～（ギブアップ）', 'もう一回！（ギブアップ）'],
      win: ['やった！上がり～！', 'いえーい！'],
    },
  },
  {
    id: 'npc1',
    name: 'むぅむぅ',
    strategy: {
      type: 'first',
      passChance: 20,
    },
    img: "heart_A",
    colors: {
      background: '#FFE0E0',  // さらに薄いピンク
      text: '#552222',        // 柔らかいブラウン
      border: '#FF9999',      // パステルピンク
    },
    lines: {
      start: ['むむぅむ！', 'むぅ！'],
      pass: ['むむぅ（パス）', 'むぅ（パス）'],
      giveUp: ['むぅぅ（ギブアップ）', 'むむぅむぅ（ギブアップ）'],
      win: ['むぅむぅ！', 'むぅぅ～～！'],
    },
  },
  {
    id: 'npc2',
    name: 'ばけごろう',
    strategy: {
      type: 'edge',
      passChance: 10,
    },
    img: "heart_K",
    colors: {
      background: '#F0F8FF',  // 薄い水色（アリスブルー）
      text: '#003366',        // 深めのブルー
      border: '#A3D3F5',      // 淡い青
    },
    lines: {
      start: [
        "がんばるんだばけ〜！ヘ(・。・ヘ)♡ふふぅ",
        "きょうももよろしくなんだばけ〜！ヘ(・。・ヘ)♡えへへ",
      ],
      playCard: [
        "いくんだばけ〜！ヘ(・。・ヘ)♡",
        "これできまりなんだばけ〜！ヘ(・。・ヘ)♡",
      ],
      pass: [
        "パスするんだばけ〜！ヘ(・。・ヘ)♡",
        "つぎなんだばけ〜！ヘ(・。・ヘ)♡（パス）",
      ],
      giveUp: [
        "しっぱいなんてないよ〜じんせいはいちどきり〜ヘ(・。・ヘ)♡（ギブアップ）",
        "ボグ、やっぱりむじゅかしかったんだばけ〜ヘ(・。・ヘ)♡（ギブアップ）",
      ],
      win: [
        "ボグのかちなんだばけ〜！ヘ(・。・ヘ)♡やったやった〜",
        "わ〜いわ〜い〜ヘ(・。・ヘ)♡",
      ],
    },
  },
  {
    id: 'npc3',
    name: 'ミニばけ',
    strategy: {
      type: 'random',
      passChance: 50,
    },
    img: "heart_J",
    colors: {
      background: '#FFF5E5',  // 柔らかいオレンジベージュ
      text: '#8B4000',        // やや濃いブラウン
      border: '#E6B27A',      // 淡いオレンジ
    },
    lines: {
      start: [
        "ぷににぃ！（ミニばけ、がんばっちゃうぷに！）",
        "ぷにぃ〜！（お兄ちゃんにいいとこ見せるぷに！）",
      ],
      playCard: [
        "ぷににっ！（これで決まりぷに！）",
        "ぷにぃ！（いい感じぷに！）",
      ],
      pass: [
        "ぷにゅ〜（しかたないぷにぃ…）（パス）",
        "ぷにっ…（今回は見送るぷに）（パス）",
      ],
      giveUp: [
        "ぷにゃぁ…（ミニばけ、負けちゃったぷに…）（ギブアップ）",
        "ぷにぃ〜！（まだまだ修行が足りないぷに…）（ギブアップ）",
      ],
      win: [
        "ぷにぷにっ！（ミニばけ、優勝ぷに〜？）",
        "ぷににぃ！（お兄ちゃん、見てたぷに！？）",
      ],
    },
  },
  // 必要に応じて追加
] as const;
