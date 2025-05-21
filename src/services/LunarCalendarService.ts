import axios from 'axios';

interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
}

interface KAGPSResponse {
  lunYear: string;
  lunMonth: string;
  lunDay: string;
  solYear: string;
  solMonth: string;
  solDay: string;
  solWeek: string;
  isLeapMonth: boolean;
}

interface KAGPSApiResponse {
  response: {
    body: {
      items: {
        item: KAGPSResponse;
      };
    };
  };
}

export class LunarCalendarService {
  private static instance: LunarCalendarService;
  private readonly API_KEY = process.env.REACT_APP_KAGPS_API_KEY;
  private readonly BASE_URL = 'http://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService';

  private constructor() {}

  public static getInstance(): LunarCalendarService {
    if (!LunarCalendarService.instance) {
      LunarCalendarService.instance = new LunarCalendarService();
    }
    return LunarCalendarService.instance;
  }

  /**
   * 양력을 음력으로 변환
   */
  public async convertToLunar(date: Date): Promise<LunarDate> {
    try {
      const { data } = await axios.get<KAGPSApiResponse>(`${this.BASE_URL}/getLunCalInfo`, {
        params: {
          serviceKey: this.API_KEY,
          solYear: date.getFullYear(),
          solMonth: (date.getMonth() + 1).toString().padStart(2, '0'),
          solDay: date.getDate().toString().padStart(2, '0'),
          _type: 'json'
        }
      });

      const item = data.response.body.items.item;

      return {
        year: parseInt(item.lunYear),
        month: parseInt(item.lunMonth),
        day: parseInt(item.lunDay),
        isLeapMonth: item.isLeapMonth
      };
    } catch (error) {
      console.error('Error converting to lunar date:', error);
      throw new Error('음력 변환 중 오류가 발생했습니다.');
    }
  }

  /**
   * 음력을 양력으로 변환
   */
  public async convertToSolar(lunarDate: LunarDate): Promise<Date> {
    try {
      const { data } = await axios.get<KAGPSApiResponse>(`${this.BASE_URL}/getSolCalInfo`, {
        params: {
          serviceKey: this.API_KEY,
          lunYear: lunarDate.year,
          lunMonth: lunarDate.month.toString().padStart(2, '0'),
          lunDay: lunarDate.day.toString().padStart(2, '0'),
          isLeapMonth: lunarDate.isLeapMonth ? 'Y' : 'N',
          _type: 'json'
        }
      });

      const item = data.response.body.items.item;

      return new Date(
        parseInt(item.solYear),
        parseInt(item.solMonth) - 1,
        parseInt(item.solDay)
      );
    } catch (error) {
      console.error('Error converting to solar date:', error);
      throw new Error('양력 변환 중 오류가 발생했습니다.');
    }
  }
} 