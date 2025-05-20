
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { dummySajuResult } from '../data/dummyData';
import { ArrowRight, Download, MessageSquare } from 'lucide-react';

type FormData = {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  gender: string;
  birthplace: string;
};

const SajuResult = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    // Retrieve form data from session storage
    const storedData = sessionStorage.getItem('sajuFormData');
    
    if (!storedData) {
      // Redirect to input page if no data is found
      navigate('/saju-input');
      return;
    }
    
    try {
      setFormData(JSON.parse(storedData));
    } catch (error) {
      console.error('Error parsing stored saju data:', error);
      navigate('/saju-input');
    }
  }, [navigate]);

  if (!formData) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  const handleDownloadReport = () => {
    alert('운세 리포트 다운로드는 유료 서비스입니다.');
  };

  const handleOpenChat = () => {
    navigate('/chat');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-indigo text-center">사주 해석 결과</h1>
        <p className="text-gray-600 mb-2 text-center">
          {formData.birthYear}년 {formData.birthMonth}월 {formData.birthDay}일 {formData.birthHour}시 {formData.birthMinute}분
        </p>
        <p className="text-gray-600 mb-10 text-center">
          {formData.gender === 'female' ? '여성' : '남성'} | {formData.birthplace === 'korea' ? '한국' : formData.birthplace}
        </p>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="flex border-b">
            <button
              className={`py-4 px-6 font-medium text-sm flex-1 ${
                activeTab === 'basic' 
                  ? 'bg-indigo text-white' 
                  : 'bg-white hover:bg-lavender/50 text-gray-700'
              }`}
              onClick={() => setActiveTab('basic')}
            >
              기본 정보
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm flex-1 ${
                activeTab === 'personality' 
                  ? 'bg-indigo text-white' 
                  : 'bg-white hover:bg-lavender/50 text-gray-700'
              }`}
              onClick={() => setActiveTab('personality')}
            >
              성격 및 특성
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm flex-1 ${
                activeTab === 'yearly' 
                  ? 'bg-indigo text-white' 
                  : 'bg-white hover:bg-lavender/50 text-gray-700'
              }`}
              onClick={() => setActiveTab('yearly')}
            >
              연도별 운세
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'basic' && (
              <div className="animate-fade-in">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-lavender/20 p-4 rounded-lg">
                    <h3 className="font-medium text-lg text-indigo mb-2">나의 오행</h3>
                    <p className="text-xl font-semibold">{dummySajuResult.ohaeng}</p>
                    <p className="text-gray-600 mt-2">
                      오행은 동양 철학에서 우주의 기본 요소를 나타내는 개념으로, 
                      개인의 성격과 에너지 특성을 이해하는 데 도움이 됩니다.
                    </p>
                  </div>
                  <div className="bg-lavender/20 p-4 rounded-lg">
                    <h3 className="font-medium text-lg text-indigo mb-2">나의 십신</h3>
                    <p className="text-xl font-semibold">{dummySajuResult.sipsin}</p>
                    <p className="text-gray-600 mt-2">
                      십신은 사주에서 개인의 기본 성향과 삶의 흐름을 나타내는 요소로,
                      인생의 방향성을 제시합니다.
                    </p>
                  </div>
                </div>
                
                <h3 className="font-medium text-lg text-indigo mb-3">사주 간략 해석</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  귀하의 사주는 {dummySajuResult.ohaeng} 오행과 {dummySajuResult.sipsin} 십신을 중심으로 구성되어 있습니다. 
                  이는 창의적이고 예술적인 기질을 가진 사람으로, 새로운 아이디어를 생각해내는 능력이 뛰어난 것을 의미합니다. 
                  감성이 풍부하고 열정적인 성향으로, 주변 사람들에게 긍정적인 영향을 주는 특성이 있습니다.
                </p>
                
                <div className="flex justify-center gap-4 mt-8">
                  <button onClick={handleDownloadReport} className="secondary-button">
                    <Download size={18} /> 상세 리포트 보기
                  </button>
                  <button onClick={handleOpenChat} className="primary-button">
                    <MessageSquare size={18} /> AI 상담 시작하기
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'personality' && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h3 className="font-medium text-lg text-indigo mb-4">성격 및 특성</h3>
                  <ul className="space-y-3">
                    {dummySajuResult.personality.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-indigo mr-2">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-8">
                  <h3 className="font-medium text-lg text-indigo mb-4">직업 및 진로</h3>
                  <ul className="space-y-3">
                    {dummySajuResult.career.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-indigo mr-2">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg text-indigo mb-4">연애 및 대인관계</h3>
                  <ul className="space-y-3">
                    {dummySajuResult.relationship.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-indigo mr-2">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-center gap-4 mt-8">
                  <button onClick={handleDownloadReport} className="secondary-button">
                    <Download size={18} /> 상세 리포트 보기
                  </button>
                  <button onClick={handleOpenChat} className="primary-button">
                    <MessageSquare size={18} /> AI 상담 시작하기
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'yearly' && (
              <div className="animate-fade-in">
                <h3 className="font-medium text-lg text-indigo mb-4">연도별 운세</h3>
                
                <div className="space-y-6">
                  {dummySajuResult.yearly.map((item, index) => (
                    <div key={index} className="bg-lavender/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo mb-2">{item.year}년</h4>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center gap-4 mt-8">
                  <button onClick={handleDownloadReport} className="secondary-button">
                    <Download size={18} /> 상세 리포트 보기
                  </button>
                  <button onClick={handleOpenChat} className="primary-button">
                    <MessageSquare size={18} /> AI 상담 시작하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">다른 생년월일로 사주를 보고 싶으신가요?</p>
          <Link to="/saju-input" className="secondary-button inline-flex">
            다시 입력하기 <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default SajuResult;
