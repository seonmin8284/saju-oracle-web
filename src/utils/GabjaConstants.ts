export const SIBGAN_HANGUL = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
export const SIBGAN_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const SIBIJI_HANGUL = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
export const SIBIJI_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const convertHangulToHanja = (hangul: string): string => {
  let result = '';
  for (let char of hangul) {
    const ganIndex = SIBGAN_HANGUL.indexOf(char);
    if (ganIndex !== -1) {
      result += SIBGAN_HANJA[ganIndex];
      continue;
    }
    const jiIndex = SIBIJI_HANGUL.indexOf(char);
    if (jiIndex !== -1) {
      result += SIBIJI_HANJA[jiIndex];
      continue;
    }
    result += char;
  }
  return result;
};

export const convertHanjaToHangul = (hanja: string): string => {
  let result = '';
  for (let char of hanja) {
    const ganIndex = SIBGAN_HANJA.indexOf(char);
    if (ganIndex !== -1) {
      result += SIBGAN_HANGUL[ganIndex];
      continue;
    }
    const jiIndex = SIBIJI_HANJA.indexOf(char);
    if (jiIndex !== -1) {
      result += SIBIJI_HANGUL[jiIndex];
      continue;
    }
    result += char;
  }
  return result;
}; 