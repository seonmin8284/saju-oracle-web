import { DateTime } from 'luxon';

// 절기 정보
export const SEASONAL_TERMS = {
  '입춘': { hanja: '立春', start: 315 },
  '우수': { hanja: '雨水', start: 330 },
  '경칩': { hanja: '驚蟄', start: 345 },
  '춘분': { hanja: '春分', start: 0 },
  '청명': { hanja: '清明', start: 15 },
  '곡우': { hanja: '穀雨', start: 30 },
  '입하': { hanja: '立夏', start: 45 },
  '소만': { hanja: '小滿', start: 60 },
  '망종': { hanja: '芒種', start: 75 },
  '하지': { hanja: '夏至', start: 90 },
  '소서': { hanja: '小暑', start: 105 },
  '대서': { hanja: '大暑', start: 120 },
  '입추': { hanja: '立秋', start: 135 },
  '처서': { hanja: '處暑', start: 150 },
  '백로': { hanja: '白露', start: 165 },
  '추분': { hanja: '秋分', start: 180 },
  '한로': { hanja: '寒露', start: 195 },
  '상강': { hanja: '霜降', start: 210 },
  '입동': { hanja: '立冬', start: 225 },
  '소설': { hanja: '小雪', start: 240 },
  '대설': { hanja: '大雪', start: 255 },
  '동지': { hanja: '冬至', start: 270 },
  '소한': { hanja: '小寒', start: 285 },
  '대한': { hanja: '大寒', start: 300 }
};

// 별자리 정보
export const ZODIAC_SIGNS = [
  { name: '양자리', start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
  { name: '황소자리', start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
  { name: '쌍둥이자리', start: { month: 5, day: 21 }, end: { month: 6, day: 21 } },
  { name: '게자리', start: { month: 6, day: 22 }, end: { month: 7, day: 22 } },
  { name: '사자자리', start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
  { name: '처녀자리', start: { month: 8, day: 23 }, end: { month: 9, day: 23 } },
  { name: '천칭자리', start: { month: 9, day: 24 }, end: { month: 10, day: 22 } },
  { name: '전갈자리', start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
  { name: '궁수자리', start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
  { name: '염소자리', start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
  { name: '물병자리', start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
  { name: '물고기자리', start: { month: 2, day: 19 }, end: { month: 3, day: 20 } }
];

// 띠 정보
export const ZODIAC_ANIMALS = [
  '쥐', '소', '호랑이', '토끼', '용', '뱀',
  '말', '양', '원숭이', '닭', '개', '돼지'
];

// 달의 위상 계산
export const calculateMoonPhase = (date: DateTime): { phase: string; time: number } => {
  // 달의 위상 계산 로직 (실제로는 더 복잡한 천문학적 계산이 필요)
  const daysSinceNewMoon = date.day % 29.53; // 음력 한 달을 29.53일로 가정
  
  if (daysSinceNewMoon < 7.38) return { phase: '초승달', time: date.toMillis() };
  if (daysSinceNewMoon < 14.76) return { phase: '상현달', time: date.toMillis() };
  if (daysSinceNewMoon < 22.14) return { phase: '보름달', time: date.toMillis() };
  return { phase: '하현달', time: date.toMillis() };
};

// 별자리 계산
export const calculateZodiacSign = (date: DateTime): string => {
  const month = date.month;
  const day = date.day;

  for (const sign of ZODIAC_SIGNS) {
    if (
      (month === sign.start.month && day >= sign.start.day) ||
      (month === sign.end.month && day <= sign.end.day)
    ) {
      return sign.name;
    }
  }

  // 염소자리의 경우 (연말~연초에 걸쳐있음)
  if (
    (month === 12 && day >= 22) ||
    (month === 1 && day <= 19)
  ) {
    return '염소자리';
  }

  return ZODIAC_SIGNS[0].name; // 기본값
};

// 띠 계산
export const calculateZodiacAnimal = (year: number): string => {
  return ZODIAC_ANIMALS[(year - 4) % 12];
};

// 요일 계산
export const calculateDayOfWeek = (date: DateTime): { hanja: string; hangul: string } => {
  const weekDays = {
    1: { hanja: '月', hangul: '월' },
    2: { hanja: '火', hangul: '화' },
    3: { hanja: '水', hangul: '수' },
    4: { hanja: '木', hangul: '목' },
    5: { hanja: '金', hangul: '금' },
    6: { hanja: '土', hangul: '토' },
    7: { hanja: '日', hangul: '일' }
  };
  
  const weekday = date.weekday;
  return weekDays[weekday] || weekDays[7];
};

// 절기 계산
export const calculateSeasonalTerm = (date: DateTime): { hanja: string; hangul: string; timestamp: number } => {
  // 실제 구현에서는 더 정확한 천문학적 계산이 필요합니다
  const solarDegree = (date.month - 1) * 30 + date.day;
  
  for (const [hangul, term] of Object.entries(SEASONAL_TERMS)) {
    if (Math.abs(solarDegree - term.start) <= 15) {
      return {
        hanja: term.hanja,
        hangul: hangul,
        timestamp: date.toMillis()
      };
    }
  }
  
  return {
    hanja: '',
    hangul: '',
    timestamp: date.toMillis()
  };
};

// 공휴일 판단
export const isHoliday = (date: DateTime): boolean => {
  const month = date.month;
  const day = date.day;
  
  // 양력 공휴일 (예시)
  const solarHolidays = [
    { month: 1, day: 1 },    // 신정
    { month: 3, day: 1 },    // 삼일절
    { month: 5, day: 5 },    // 어린이날
    { month: 6, day: 6 },    // 현충일
    { month: 8, day: 15 },   // 광복절
    { month: 10, day: 3 },   // 개천절
    { month: 10, day: 9 },   // 한글날
    { month: 12, day: 25 }   // 성탄절
  ];
  
  return solarHolidays.some(holiday => 
    holiday.month === month && holiday.day === day
  );
}; 