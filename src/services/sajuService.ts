import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { DateTime } from 'luxon';
import { Season24Service } from './Season24Service';
import * as GabjaConstants from '../utils/GabjaConstants';

export interface SajuFormData {
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  birthMinute: string;
  gender: 'male' | 'female';
  birthplace: string;
}

export interface YearlyPrediction {
  year: string;
  description: string;
}

export interface SajuAnalysisResult {
  id: string;
  ohaeng: string;
  sipsin: string;
  personality: string[];
  career: string[];
  relationship: string[];
  yearly: YearlyPrediction[];
}

export interface SajuResult {
  yearHanjaGanji: string;
  monthHanjaGanji: string;
  dayHanjaGanji: string;
  timeHanjaGanji: string;
  yearHangulGanji: string;
  monthHangulGanji: string;
  dayHangulGanji: string;
  timeHangulGanji: string;
}

export class SajuCalculator {
  private season24Service: Season24Service;
  private userBirth: DateTime;
  private isTimeInclude: boolean;

  constructor(birthDate: DateTime, isTimeInclude: boolean = true) {
    this.userBirth = birthDate;
    this.isTimeInclude = isTimeInclude;
    this.season24Service = Season24Service.getInstance();
  }

  public calculateSaju(): SajuResult {
    const yearHanjaGanji = this.calcYearGanji();
    const monthHanjaGanji = this.calcMonthGanji(yearHanjaGanji);
    const dayHanjaGanji = this.calcDayGanji();
    const timeHanjaGanji = this.calcTimeGanji(dayHanjaGanji);

    return {
      yearHanjaGanji,
      monthHanjaGanji,
      dayHanjaGanji,
      timeHanjaGanji,
      yearHangulGanji: GabjaConstants.convertHanjaToHangul(yearHanjaGanji),
      monthHangulGanji: GabjaConstants.convertHanjaToHangul(monthHanjaGanji),
      dayHangulGanji: GabjaConstants.convertHanjaToHangul(dayHanjaGanji),
      timeHangulGanji: GabjaConstants.convertHanjaToHangul(timeHanjaGanji)
    };
  }

  private calcYearGanji(): string {
    const sibganForYear = ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'];
    const sibijiForYear = ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'];

    let targetYear = this.userBirth.year;
    if (!this.season24Service.isReachSpring(this.userBirth)) {
      targetYear--;
    }

    const sibgan = sibganForYear[targetYear % 10];
    const sibiji = sibijiForYear[targetYear % 12];

    return sibgan + sibiji;
  }

  private calcMonthGanji(yearHanjaGanji: string): string {
    const monthGanjiMap = {
      '甲己': ['丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉', '甲戌', '乙亥', '丙子', '丁丑'],
      '乙庚': ['戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未', '甲申', '乙酉', '丙戌', '丁亥', '戊子', '己丑'],
      '丙辛': ['庚寅', '辛卯', '壬辰', '癸巳', '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑'],
      '丁壬': ['壬寅', '癸卯', '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑'],
      '戊癸': ['甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥', '甲子', '乙丑']
    };

    const yearGan = yearHanjaGanji[0];
    let monthGanjiList;
    
    for (const [key, value] of Object.entries(monthGanjiMap)) {
      if (key.includes(yearGan)) {
        monthGanjiList = value;
        break;
      }
    }

    if (!monthGanjiList) {
      throw new Error('Invalid year ganji');
    }

    let month = this.userBirth.month - 1;
    if (!this.season24Service.isReachMonth(this.userBirth)) {
      month = (month - 1 + 12) % 12;
    }

    return monthGanjiList[month];
  }

  private calcDayGanji(): string {
    const baseDate = DateTime.fromObject({ year: 1900, month: 1, day: 1 });
    let daySibganIndex = 0;
    let daySibijiIndex = 10;

    const diffDays = Math.floor(this.userBirth.diff(baseDate, 'days').days);

    daySibganIndex = (daySibganIndex + diffDays) % 10;
    daySibijiIndex = (daySibijiIndex + diffDays) % 12;

    if (this.isTimeInclude && this.userBirth.hour >= 23 && this.userBirth.minute >= 30) {
      daySibganIndex = (daySibganIndex + 1) % 10;
      daySibijiIndex = (daySibijiIndex + 1) % 12;
    }

    return GabjaConstants.SIBGAN_HANJA[daySibganIndex] + GabjaConstants.SIBIJI_HANJA[daySibijiIndex];
  }

  private calcTimeGanji(dayHanjaGanji: string): string {
    const timeGanjiMap = {
      '甲己': ['甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉', '甲戌', '乙亥'],
      '乙庚': ['丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未', '甲申', '乙酉', '丙戌', '丁亥'],
      '丙辛': ['戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳', '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥'],
      '丁壬': ['庚子', '辛丑', '壬寅', '癸卯', '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥'],
      '戊癸': ['壬子', '癸丑', '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥']
    };

    const dayGan = dayHanjaGanji[0];
    let timeGanjiList;

    for (const [key, value] of Object.entries(timeGanjiMap)) {
      if (key.includes(dayGan)) {
        timeGanjiList = value;
        break;
      }
    }

    if (!timeGanjiList) {
      throw new Error('Invalid day ganji');
    }

    const hour = this.userBirth.hour;
    let timeIndex;

    if ((hour >= 23 && hour < 24) || (hour >= 0 && hour < 1)) timeIndex = 0;
    else if (hour >= 1 && hour < 3) timeIndex = 1;
    else if (hour >= 3 && hour < 5) timeIndex = 2;
    else if (hour >= 5 && hour < 7) timeIndex = 3;
    else if (hour >= 7 && hour < 9) timeIndex = 4;
    else if (hour >= 9 && hour < 11) timeIndex = 5;
    else if (hour >= 11 && hour < 13) timeIndex = 6;
    else if (hour >= 13 && hour < 15) timeIndex = 7;
    else if (hour >= 15 && hour < 17) timeIndex = 8;
    else if (hour >= 17 && hour < 19) timeIndex = 9;
    else if (hour >= 19 && hour < 21) timeIndex = 10;
    else timeIndex = 11;

    return timeGanjiList[timeIndex];
  }
}

// 오행 판단 로직
const determineOhaeng = (saju: SajuResult): string => {
  // 간지의 오행 속성
  const ganOhaeng: { [key: string]: string } = {
    '甲': '목(木)', '乙': '목(木)',
    '丙': '화(火)', '丁': '화(火)',
    '戊': '토(土)', '己': '토(土)',
    '庚': '금(金)', '辛': '금(金)',
    '壬': '수(水)', '癸': '수(水)'
  };

  // 일간(日干)의 오행을 기준으로 판단
  const dayGan = saju.dayHanjaGanji[0];
  return ganOhaeng[dayGan] || '목(木)';
};

// 십신 판단 로직
const determineSipsin = (saju: SajuResult): string => {
  // 일간과 다른 간의 관계에 따른 십신 판단
  const dayGan = saju.dayHanjaGanji[0];
  const yearGan = saju.yearHanjaGanji[0];
  
  // 간의 순서
  const ganOrder = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  
  const dayIndex = ganOrder.indexOf(dayGan);
  const yearIndex = ganOrder.indexOf(yearGan);
  
  // 십신 관계 판단 (예시)
  const diff = (yearIndex - dayIndex + 10) % 10;
  const sipsinMap = [
    '비견(比肩)', '겁재(劫財)', '식신(食神)', '상관(傷官)',
    '편재(偏財)', '정재(正財)', '편관(偏官)', '정관(正官)',
    '편인(偏印)', '정인(正印)'
  ];
  
  return sipsinMap[diff];
};

// 실제 사주 계산 및 해석
export const generateSajuResult = (formData: SajuFormData): SajuAnalysisResult => {
  // 1. DateTime 객체 생성
  const birthDate = DateTime.fromObject({
    year: parseInt(formData.birthYear),
    month: parseInt(formData.birthMonth),
    day: parseInt(formData.birthDay),
    hour: parseInt(formData.birthHour),
    minute: parseInt(formData.birthMinute)
  });

  // 2. 사주 계산
  const calculator = new SajuCalculator(birthDate, true);
  const saju = calculator.calculateSaju();

  // 3. 오행과 십신 판단
  const ohaeng = determineOhaeng(saju);
  const sipsin = determineSipsin(saju);

  // 4. 성격, 진로, 관계성 해석 (예시 - 실제로는 더 복잡한 규칙 적용 필요)
  const personality = [
    '창의적이고 열정적인 성격을 가지고 있습니다.',
    '새로운 아이디어를 창출하는 능력이 뛰어납니다.',
    '긍정적인 에너지로 주변 사람들에게 영감을 줍니다.',
    '예술적 감각이 풍부하며 아름다움을 추구합니다.',
    '때로는 충동적인 결정을 내릴 수 있으니 주의가 필요합니다.'
  ];

  const career = [
    '창의력을 발휘할 수 있는 예술, 디자인 분야에 적합합니다.',
    '마케팅, 광고, 기획 등의 분야에서도 능력을 발휘할 수 있습니다.',
    '자신만의 독특한 시각으로 혁신을 이끌어낼 수 있는 직업이 좋습니다.',
    '팀 프로젝트보다는 개인의 창의성을 발휘할 수 있는 역할이 적합합니다.'
  ];

  const relationship = [
    '열정적이고 로맨틱한 연애 스타일을 가지고 있습니다.',
    '파트너에게 풍부한 영감과 에너지를 제공합니다.',
    '안정적이고 차분한 성향의 파트너와 균형을 이룰 수 있습니다.',
    '감정 표현이 풍부하여 관계에서 진실된 소통이 가능합니다.',
    '때로는 감정의 기복이 있을 수 있으니 이해와 인내가 필요합니다.'
  ];

  const yearly = [
    {
      year: '2025',
      description: '창의적인 에너지가 높아지는 해로, 새로운 프로젝트나 계획을 시작하기에 좋은 시기입니다. 특히 3월~7월 사이에 중요한 기회가 올 수 있으니 준비하세요.'
    },
    {
      year: '2026',
      description: '안정과 성장이 함께 이루어지는 해입니다. 기존의 관계와 사업이 더욱 견고해지며, 건강 관리에 특히 신경 써야 합니다.'
    },
    {
      year: '2027',
      description: '변화와 도전이 많은 해가 될 수 있습니다. 유연한 마음가짐으로 변화에 적응하면 더 나은 결과를 얻을 수 있을 것입니다.'
    }
  ];

  return {
    id: 'temp',
    ohaeng,
    sipsin,
    personality,
    career,
    relationship,
    yearly
  };
};

export const saveSajuResult = async (formData: SajuFormData): Promise<string | null> => {
  try {
    const user = supabase.auth.getUser();
    const sajuResult = generateSajuResult(formData);
    
    const { data, error } = await supabase
      .from('saju_results')
      .insert([
        {
          user_id: (await user).data.user?.id,
          birth_year: parseInt(formData.birthYear),
          birth_month: parseInt(formData.birthMonth),
          birth_day: parseInt(formData.birthDay),
          birth_hour: parseInt(formData.birthHour),
          birth_minute: parseInt(formData.birthMinute),
          gender: formData.gender,
          birthplace: formData.birthplace,
          raw_data: JSON.parse(JSON.stringify(formData)) as Json,
          parsed_result: JSON.parse(JSON.stringify(sajuResult)) as Json
        }
      ])
      .select();

    if (error) {
      console.error('Error saving saju result:', error);
      return null;
    }

    return data[0].id;
  } catch (error) {
    console.error('Error in saveSajuResult:', error);
    return null;
  }
};

export const getSajuResult = async (id: string): Promise<SajuAnalysisResult | null> => {
  try {
    const { data, error } = await supabase
      .from('saju_results')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching saju result:', error);
      return null;
    }

    if (!data.parsed_result) {
      console.error('Invalid saju result data structure');
      return null;
    }

    const parsedResult = data.parsed_result as Record<string, unknown>;
    
    return {
      id: data.id,
      ohaeng: typeof parsedResult.ohaeng === 'string' ? parsedResult.ohaeng : '',
      sipsin: typeof parsedResult.sipsin === 'string' ? parsedResult.sipsin : '',
      personality: Array.isArray(parsedResult.personality) ? parsedResult.personality : [],
      career: Array.isArray(parsedResult.career) ? parsedResult.career : [],
      relationship: Array.isArray(parsedResult.relationship) ? parsedResult.relationship : [],
      yearly: Array.isArray(parsedResult.yearly) ? 
        parsedResult.yearly.map((item: YearlyPrediction) => ({
          year: typeof item.year === 'string' ? item.year : '',
          description: typeof item.description === 'string' ? item.description : ''
        })) : []
    };
  } catch (error) {
    console.error('Error in getSajuResult:', error);
    return null;
  }
};

// For non-authenticated users, we'll store the data in session storage temporarily
export const saveSajuToSessionStorage = (formData: SajuFormData): void => {
  sessionStorage.setItem('sajuFormData', JSON.stringify(formData));
};

export const getSajuFromSessionStorage = (): SajuFormData | null => {
  const storedData = sessionStorage.getItem('sajuFormData');
  
  if (!storedData) {
    return null;
  }
  
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Error parsing stored saju data:', error);
    return null;
  }
};
