import { DateTime } from 'luxon';

interface Season24Data {
  year: number;
  month: number;
  day: number;
  seasonName: string;
}

export class Season24Service {
  private static instance: Season24Service;
  private seasonData: Season24Data[] = [];

  private constructor() {
    // 실제로는 DB나 API에서 데이터를 가져와야 하지만, 예시로 하드코딩
    this.seasonData = [
      { year: 2024, month: 2, day: 4, seasonName: '입춘' },
      { year: 2024, month: 2, day: 19, seasonName: '우수' },
      { year: 2024, month: 3, day: 5, seasonName: '경칩' },
      // ... 더 많은 절기 데이터
    ];
  }

  public static getInstance(): Season24Service {
    if (!Season24Service.instance) {
      Season24Service.instance = new Season24Service();
    }
    return Season24Service.instance;
  }

  public isReachSpring(date: DateTime): boolean {
    const springData = this.seasonData.find(
      season => 
        season.year === date.year && 
        season.month === 2 && 
        season.seasonName === '입춘'
    );

    if (!springData) return false;

    const springDate = DateTime.fromObject({
      year: springData.year,
      month: springData.month,
      day: springData.day
    });

    return date >= springDate;
  }

  public isReachMonth(date: DateTime): boolean {
    // 해당 월의 절기 시작일을 찾아서 비교
    const monthSeasonData = this.seasonData.find(
      season => 
        season.year === date.year && 
        season.month === date.month
    );

    if (!monthSeasonData) return false;

    const seasonDate = DateTime.fromObject({
      year: monthSeasonData.year,
      month: monthSeasonData.month,
      day: monthSeasonData.day
    });

    return date >= seasonDate;
  }
} 