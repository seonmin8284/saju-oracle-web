
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { ArrowRight } from 'lucide-react';

const SajuInput = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    birthYear: new Date().getFullYear() - 30,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 12,
    birthMinute: 0,
    gender: 'female',
    birthplace: 'korea'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to session storage for result page to retrieve
    sessionStorage.setItem('sajuFormData', JSON.stringify(formData));
    navigate('/saju-result');
  };

  // Generate year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // Generate month options
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Generate day options (simplified)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Generate hour options
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Generate minute options
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-indigo text-center">사주 입력</h1>
        <p className="text-gray-600 mb-10 text-center">
          정확한 사주 해석을 위해 생년월일과 태어난 시간을 입력해주세요
        </p>
        
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-indigo mb-4">생년월일</h2>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700 mb-1">
                    년
                  </label>
                  <select
                    id="birthYear"
                    name="birthYear"
                    value={formData.birthYear}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-indigo"
                    required
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}년</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="birthMonth" className="block text-sm font-medium text-gray-700 mb-1">
                    월
                  </label>
                  <select
                    id="birthMonth"
                    name="birthMonth"
                    value={formData.birthMonth}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-indigo"
                    required
                  >
                    {months.map(month => (
                      <option key={month} value={month}>{month}월</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="birthDay" className="block text-sm font-medium text-gray-700 mb-1">
                    일
                  </label>
                  <select
                    id="birthDay"
                    name="birthDay"
                    value={formData.birthDay}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-indigo"
                    required
                  >
                    {days.map(day => (
                      <option key={day} value={day}>{day}일</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-indigo mb-4">태어난 시간</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="birthHour" className="block text-sm font-medium text-gray-700 mb-1">
                    시
                  </label>
                  <select
                    id="birthHour"
                    name="birthHour"
                    value={formData.birthHour}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-indigo"
                  >
                    {hours.map(hour => (
                      <option key={hour} value={hour}>{hour}시</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="birthMinute" className="block text-sm font-medium text-gray-700 mb-1">
                    분
                  </label>
                  <select
                    id="birthMinute"
                    name="birthMinute"
                    value={formData.birthMinute}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-indigo"
                  >
                    {minutes.map(minute => (
                      <option key={minute} value={minute}>{minute}분</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 italic">
                시간을 모르시는 경우 12시 0분으로 설정해주세요. (정확한 해석을 위해서는 시간 정보가 중요합니다)
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-indigo mb-4">추가 정보</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    성별
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-indigo"
                    required
                  >
                    <option value="female">여성</option>
                    <option value="male">남성</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="birthplace" className="block text-sm font-medium text-gray-700 mb-1">
                    출생지
                  </label>
                  <select
                    id="birthplace"
                    name="birthplace"
                    value={formData.birthplace}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-indigo"
                    required
                  >
                    <option value="korea">한국</option>
                    <option value="japan">일본</option>
                    <option value="china">중국</option>
                    <option value="usa">미국</option>
                    <option value="other">기타</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <button type="submit" className="w-full primary-button">
                사주 해석하기 <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SajuInput;
