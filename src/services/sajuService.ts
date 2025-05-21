
import { supabase } from '@/integrations/supabase/client';

type SajuFormData = {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  gender: string;
  birthplace: string;
};

type SajuResult = {
  id: string;
  ohaeng: string;
  sipsin: string;
  personality: string[];
  career: string[];
  relationship: string[];
  yearly: { year: string; description: string }[];
};

// For now, this function generates mock results based on input data
// In a real implementation, this might call an API or use a more complex algorithm
const generateSajuResult = (formData: SajuFormData) => {
  // This is a simplified mock implementation
  // In a real app, this would likely be a more complex calculation
  const mockData = {
    ohaeng: '화(火)',
    sipsin: '식신(食神)',
    personality: [
      '창의적이고 열정적인 성격을 가지고 있습니다.',
      '새로운 아이디어를 창출하는 능력이 뛰어납니다.',
      '긍정적인 에너지로 주변 사람들에게 영감을 줍니다.',
      '예술적 감각이 풍부하며 아름다움을 추구합니다.',
      '때로는 충동적인 결정을 내릴 수 있으니 주의가 필요합니다.'
    ],
    career: [
      '창의력을 발휘할 수 있는 예술, 디자인 분야에 적합합니다.',
      '마케팅, 광고, 기획 등의 분야에서도 능력을 발휘할 수 있습니다.',
      '자신만의 독특한 시각으로 혁신을 이끌어낼 수 있는 직업이 좋습니다.',
      '팀 프로젝트보다는 개인의 창의성을 발휘할 수 있는 역할이 적합합니다.'
    ],
    relationship: [
      '열정적이고 로맨틱한 연애 스타일을 가지고 있습니다.',
      '파트너에게 풍부한 영감과 에너지를 제공합니다.',
      '안정적이고 차분한 성향의 파트너와 균형을 이룰 수 있습니다.',
      '감정 표현이 풍부하여 관계에서 진실된 소통이 가능합니다.',
      '때로는 감정의 기복이 있을 수 있으니 이해와 인내가 필요합니다.'
    ],
    yearly: [
      { year: '2025', description: '창의적인 에너지가 높아지는 해로, 새로운 프로젝트나 계획을 시작하기에 좋은 시기입니다. 특히 3월~7월 사이에 중요한 기회가 올 수 있으니 준비하세요.' },
      { year: '2026', description: '안정과 성장이 함께 이루어지는 해입니다. 기존의 관계와 사업이 더욱 견고해지며, 건강 관리에 특히 신경 써야 합니다.' },
      { year: '2027', description: '변화와 도전이 많은 해가 될 수 있습니다. 유연한 마음가짐으로 변화에 적응하면 더 나은 결과를 얻을 수 있을 것입니다.' }
    ]
  };

  return mockData;
};

export const saveSajuResult = async (formData: SajuFormData): Promise<string | null> => {
  try {
    const user = supabase.auth.getUser();
    
    // Generate the saju result based on the form data
    const sajuResult = generateSajuResult(formData);
    
    // Save to Supabase
    const { data, error } = await supabase
      .from('saju_results')
      .insert([
        {
          user_id: (await user).data.user?.id,
          birth_year: formData.birthYear,
          birth_month: formData.birthMonth,
          birth_day: formData.birthDay,
          birth_hour: formData.birthHour,
          birth_minute: formData.birthMinute,
          gender: formData.gender,
          birthplace: formData.birthplace,
          raw_data: formData,
          parsed_result: sajuResult
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

export const getSajuResult = async (id: string): Promise<SajuResult | null> => {
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

    // Fix: Properly cast and validate the parsed_result before returning
    if (!data.parsed_result || typeof data.parsed_result !== 'object') {
      console.error('Invalid saju result data structure');
      return null;
    }

    // Create a new object that conforms to SajuResult type
    return {
      id: data.id,
      ohaeng: data.parsed_result.ohaeng || '',
      sipsin: data.parsed_result.sipsin || '',
      personality: Array.isArray(data.parsed_result.personality) ? data.parsed_result.personality : [],
      career: Array.isArray(data.parsed_result.career) ? data.parsed_result.career : [],
      relationship: Array.isArray(data.parsed_result.relationship) ? data.parsed_result.relationship : [],
      yearly: Array.isArray(data.parsed_result.yearly) ? data.parsed_result.yearly : []
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
