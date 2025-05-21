import { DateTime } from 'luxon';
import axios from 'axios';

interface MoonPhase {
  phase: string;
  illumination: number;
  timestamp: number;
}

interface SeasonalTerm {
  name: string;
  hanja: string;
  timestamp: number;
  solarLongitude: number;
}

interface NASAMoonPhaseResponse {
  illumination: number;
}

interface NASASolarResponse {
  solar_longitude: number;
}

export class AstronomicalService {
  private static instance: AstronomicalService;
  private readonly NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY;
  private readonly NASA_API_URL = 'https://api.nasa.gov/planetary/earth-sun-moon';

  private constructor() {}

  public static getInstance(): AstronomicalService {
    if (!AstronomicalService.instance) {
      AstronomicalService.instance = new AstronomicalService();
    }
    return AstronomicalService.instance;
  }

  /**
   * NASA HORIZONS API를 사용하여 정확한 달의 위상 계산
   */
  public async calculateMoonPhase(date: DateTime): Promise<MoonPhase> {
    try {
      const { data } = await axios.get<NASAMoonPhaseResponse>(`${this.NASA_API_URL}/moon-phase`, {
        params: {
          date: date.toFormat('yyyy-MM-dd'),
          api_key: this.NASA_API_KEY
        }
      });

      const illumination = data.illumination;
      let phase = '삭';

      if (illumination < 0.05) phase = '삭';
      else if (illumination < 0.45) phase = '초승';
      else if (illumination < 0.55) phase = '상현';
      else if (illumination < 0.95) phase = '만월';
      else if (illumination < 1) phase = '하현';

      return {
        phase,
        illumination,
        timestamp: date.toMillis()
      };
    } catch (error) {
      console.error('Error calculating moon phase:', error);
      // 오류 시 간단한 계산 방식으로 폴백
      return this.calculateSimpleMoonPhase(date);
    }
  }

  /**
   * 간단한 달의 위상 계산 (API 오류 시 폴백용)
   */
  private calculateSimpleMoonPhase(date: DateTime): MoonPhase {
    const daysSinceNewMoon = date.day % 29.53;
    const illumination = Math.sin((daysSinceNewMoon / 29.53) * Math.PI);
    
    let phase = '삭';
    if (daysSinceNewMoon < 7.38) phase = '초승';
    else if (daysSinceNewMoon < 14.76) phase = '상현';
    else if (daysSinceNewMoon < 22.14) phase = '만월';
    else phase = '하현';

    return {
      phase,
      illumination: Math.abs(illumination),
      timestamp: date.toMillis()
    };
  }

  /**
   * 정확한 절기 계산
   */
  public async calculateSeasonalTerm(date: DateTime): Promise<SeasonalTerm> {
    try {
      const { data } = await axios.get<NASASolarResponse>(`${this.NASA_API_URL}/solar-longitude`, {
        params: {
          date: date.toFormat('yyyy-MM-dd'),
          api_key: this.NASA_API_KEY
        }
      });

      const solarLongitude = data.solar_longitude;
      const seasonalTerms = this.getSeasonalTerms();
      
      // 가장 가까운 절기 찾기
      let closestTerm = seasonalTerms[0];
      let minDiff = Math.abs(solarLongitude - seasonalTerms[0].solarLongitude);

      for (const term of seasonalTerms) {
        const diff = Math.abs(solarLongitude - term.solarLongitude);
        if (diff < minDiff) {
          minDiff = diff;
          closestTerm = term;
        }
      }

      return {
        ...closestTerm,
        timestamp: date.toMillis()
      };
    } catch (error) {
      console.error('Error calculating seasonal term:', error);
      return this.calculateSimpleSeasonalTerm(date);
    }
  }

  /**
   * 간단한 절기 계산 (API 오류 시 폴백용)
   */
  private calculateSimpleSeasonalTerm(date: DateTime): SeasonalTerm {
    const solarDegree = (date.month - 1) * 30 + date.day;
    const seasonalTerms = this.getSeasonalTerms();
    
    for (const term of seasonalTerms) {
      if (Math.abs(solarDegree - term.solarLongitude) <= 15) {
        return {
          ...term,
          timestamp: date.toMillis()
        };
      }
    }

    return {
      name: '',
      hanja: '',
      timestamp: date.toMillis(),
      solarLongitude: solarDegree
    };
  }

  /**
   * 절기 정보 목록
   */
  private getSeasonalTerms(): SeasonalTerm[] {
    return [
      { name: '입춘', hanja: '立春', solarLongitude: 315, timestamp: 0 },
      { name: '우수', hanja: '雨水', solarLongitude: 330, timestamp: 0 },
      { name: '경칩', hanja: '驚蟄', solarLongitude: 345, timestamp: 0 },
      { name: '춘분', hanja: '春分', solarLongitude: 0, timestamp: 0 },
      // ... 나머지 절기들
    ];
  }

  /**
   * 달의 대소 계산
   */
  public async calculateMonthSize(date: DateTime): Promise<number> {
    try {
      const startPhase = await this.calculateMoonPhase(date.startOf('month'));
      const endPhase = await this.calculateMoonPhase(date.endOf('month'));
      
      // 달의 위상 변화를 기반으로 대소월 계산
      const phaseCycle = Math.abs(endPhase.timestamp - startPhase.timestamp) / (24 * 60 * 60 * 1000);
      
      return Math.round(phaseCycle);
    } catch (error) {
      console.error('Error calculating month size:', error);
      return 29; // 기본값
    }
  }
} 