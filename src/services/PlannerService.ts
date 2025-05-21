import { DateTime } from 'luxon';

interface DayInfo {
  isGoodFor: string[];
  isBadFor: string[];
  specialNote?: string;
}

export class PlannerService {
  private static instance: PlannerService;

  private constructor() {}

  public static getInstance(): PlannerService {
    if (!PlannerService.instance) {
      PlannerService.instance = new PlannerService();
    }
    return PlannerService.instance;
  }

  /**
   * 양력 날짜에 대한 플래너 정보 생성
   */
  public getSolarPlanInfo(date: DateTime): string {
    const dayInfo = this.getDayInfo(date);
    
    let planInfo = '';
    
    if (dayInfo.isGoodFor.length > 0) {
      planInfo += '▶ 길한 일: ' + dayInfo.isGoodFor.join(', ') + '\n';
    }
    
    if (dayInfo.isBadFor.length > 0) {
      planInfo += '▶ 피할 일: ' + dayInfo.isBadFor.join(', ') + '\n';
    }
    
    if (dayInfo.specialNote) {
      planInfo += '▶ 특이사항: ' + dayInfo.specialNote;
    }
    
    return planInfo.trim();
  }

  /**
   * 음력 날짜에 대한 플래너 정보 생성
   */
  public getLunarPlanInfo(lunarDate: { month: number; day: number }): string {
    const traditions = this.getLunarTraditions(lunarDate);
    const customs = this.getLunarCustoms(lunarDate);
    
    let planInfo = '';
    
    if (traditions.length > 0) {
      planInfo += '▶ 전통 행사: ' + traditions.join(', ') + '\n';
    }
    
    if (customs.length > 0) {
      planInfo += '▶ 풍습: ' + customs.join(', ');
    }
    
    return planInfo.trim();
  }

  /**
   * 날짜별 길흉 정보
   */
  private getDayInfo(date: DateTime): DayInfo {
    // 요일별 기본 정보
    const weekdayInfo: { [key: number]: DayInfo } = {
      1: { // 월요일
        isGoodFor: ['새로운 시작', '계획 수립', '학업'],
        isBadFor: ['즉흥적인 결정', '과도한 지출']
      },
      2: { // 화요일
        isGoodFor: ['활동적인 일', '운동', '경쟁'],
        isBadFor: ['중요한 계약', '장거리 여행']
      },
      3: { // 수요일
        isGoodFor: ['의사소통', '미팅', '단기 여행'],
        isBadFor: ['충동적인 결정', '위험한 활동']
      },
      4: { // 목요일
        isGoodFor: ['중요한 결정', '투자', '승진'],
        isBadFor: ['불필요한 다툼', '과도한 욕심']
      },
      5: { // 금요일
        isGoodFor: ['예술 활동', '만남', '쇼핑'],
        isBadFor: ['새로운 시작', '이사']
      },
      6: { // 토요일
        isGoodFor: ['정리정돈', '마무리', '휴식'],
        isBadFor: ['재테크', '중요한 선택']
      },
      7: { // 일요일
        isGoodFor: ['휴식', '가족 모임', '취미 활동'],
        isBadFor: ['업무', '스트레스 받는 일']
      }
    };

    const weekday = date.weekday;
    return weekdayInfo[weekday] || { isGoodFor: [], isBadFor: [] };
  }

  /**
   * 음력 날짜별 전통 행사
   */
  private getLunarTraditions(date: { month: number; day: number }): string[] {
    const traditions: { [key: string]: string[] } = {
      '1-1': ['설날', '세배'],
      '1-15': ['정월대보름', '더위팔기'],
      '3-3': ['삼짇날', '화전놀이'],
      '5-5': ['단오', '창포물에 머리감기'],
      '7-7': ['칠월칠석', '견우와 직녀'],
      '8-15': ['추석', '차례'],
      '9-9': ['중양절', '국화주']
    };

    const dateKey = `${date.month}-${date.day}`;
    return traditions[dateKey] || [];
  }

  /**
   * 음력 날짜별 풍습
   */
  private getLunarCustoms(date: { month: number; day: number }): string[] {
    const customs: { [key: string]: string[] } = {
      '1-1': ['떡국 먹기', '새해 복 빌기'],
      '1-15': ['오곡밥 먹기', '부럼 깨기', '달맞이'],
      '3-3': ['화전 먹기', '창포물에 머리 감기'],
      '5-5': ['수리취떡 먹기', '그네뛰기'],
      '7-7': ['밀국수 먹기', '견우직녀에게 소원 빌기'],
      '8-15': ['송편 빚기', '강강술래'],
      '9-9': ['국화전 부치기', '등산하기']
    };

    const dateKey = `${date.month}-${date.day}`;
    return customs[dateKey] || [];
  }
} 