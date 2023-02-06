/**
 * Convert string half width to full width
 * @param {*} txtstring string need convert
 * @example txtstring = 'ｽｾｿ';
 * @returns 'ズゼゾ'
 */
export const toFullSize = function (txtstring) {
  const kanaMap = {
    ｶﾞ: "ガ",
    ｷﾞ: "ギ",
    ｸﾞ: "グ",
    ｹﾞ: "ゲ",
    ｺﾞ: "ゴ",
    ｻﾞ: "ザ",
    ｼﾞ: "ジ",
    ｽﾞ: "ズ",
    ｾﾞ: "ゼ",
    ｿﾞ: "ゾ",
    ﾀﾞ: "ダ",
    ﾁﾞ: "ヂ",
    ﾂﾞ: "ヅ",
    ﾃﾞ: "デ",
    ﾄﾞ: "ド",
    ﾊﾞ: "バ",
    ﾋﾞ: "ビ",
    ﾌﾞ: "ブ",
    ﾍﾞ: "ベ",
    ﾎﾞ: "ボ",
    ﾊﾟ: "パ",
    ﾋﾟ: "ピ",
    ﾌﾟ: "プ",
    ﾍﾟ: "ペ",
    ﾎﾟ: "ポ",
    ｳﾞ: "ヴ",
    ﾜﾞ: "ヷ",
    ｦﾞ: "ヺ",
    ｱ: "ア",
    ｲ: "イ",
    ｳ: "ウ",
    ｴ: "エ",
    ｵ: "オ",
    ｶ: "カ",
    ｷ: "キ",
    ｸ: "ク",
    ｹ: "ケ",
    ｺ: "コ",
    ｻ: "サ",
    ｼ: "シ",
    ｽ: "ス",
    ｾ: "セ",
    ｿ: "ソ",
    ﾀ: "タ",
    ﾁ: "チ",
    ﾂ: "ツ",
    ﾃ: "テ",
    ﾄ: "ト",
    ﾅ: "ナ",
    ﾆ: "ニ",
    ﾇ: "ヌ",
    ﾈ: "ネ",
    ﾉ: "ノ",
    ﾊ: "ハ",
    ﾋ: "ヒ",
    ﾌ: "フ",
    ﾍ: "ヘ",
    ﾎ: "ホ",
    ﾏ: "マ",
    ﾐ: "ミ",
    ﾑ: "ム",
    ﾒ: "メ",
    ﾓ: "モ",
    ﾔ: "ヤ",
    ﾕ: "ユ",
    ﾖ: "ヨ",
    ﾗ: "ラ",
    ﾘ: "リ",
    ﾙ: "ル",
    ﾚ: "レ",
    ﾛ: "ロ",
    ﾜ: "ワ",
    ｦ: "ヲ",
    ﾝ: "ン",
    ｧ: "ァ",
    ｨ: "ィ",
    ｩ: "ゥ",
    ｪ: "ェ",
    ｫ: "ォ",
    ｯ: "ッ",
    ｬ: "ャ",
    ｭ: "ュ",
    ｮ: "ョ",
    "｡": "。",
    "､": "、",
    ｰ: "ー",
    "｢": "「",
    "｣": "」",
    "･": "・",
    "-": "－",
  };

  const reg = new RegExp("(" + Object.keys(kanaMap).join("|") + ")", "g");
  const stringText = txtstring
    .replace(reg, function (match) {
      return kanaMap[match];
    })
    .replace(/ﾞ/g, "゛")
    .replace(/ﾟ/g, "゜");

  let tmp = "";
  for (let i = 0; i < txtstring.length; i++) {
    if (txtstring.charCodeAt(i) === 32) {
      tmp = tmp + String.fromCharCode(12288);
    } else {
      if (txtstring.charCodeAt(i) < 127) {
        tmp = tmp + String.fromCharCode(stringText.charCodeAt(i) + 65248);
      } else {
        tmp = tmp + String.fromCharCode(stringText.charCodeAt(i));
      }
    }
  }
  return tmp;
};
