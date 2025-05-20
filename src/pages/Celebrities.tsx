
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { celebrities } from '../data/dummyData';
import { ArrowRight } from 'lucide-react';

const Celebrities = () => {
  const [selectedCelebrity, setSelectedCelebrity] = useState(celebrities[0]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-indigo text-center">유명인 사주</h1>
        <p className="text-gray-600 mb-10 text-center">
          유명인들의 사주를 살펴보고 그들의 성공 비결을 알아보세요
        </p>
        
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {celebrities.map((celebrity) => (
            <div
              key={celebrity.id}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedCelebrity.id === celebrity.id 
                  ? 'bg-indigo text-white shadow-md' 
                  : 'bg-lavender/50 hover:bg-lavender'
              }`}
              onClick={() => setSelectedCelebrity(celebrity)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 mb-3 overflow-hidden">
                  <img 
                    src={celebrity.image} 
                    alt={celebrity.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium">{celebrity.name}</h3>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in">
          <div className="md:flex gap-8">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="bg-gray-200 rounded-lg overflow-hidden mb-4 aspect-square">
                <img 
                  src={selectedCelebrity.image} 
                  alt={selectedCelebrity.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold text-indigo">{selectedCelebrity.name}</h2>
              <p className="text-gray-600">{selectedCelebrity.birth}</p>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-lg font-medium text-indigo mb-3">사주 정보</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-lavender/30 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">연주</p>
                  <p className="font-medium">{selectedCelebrity.sajuElements.yearPillar}</p>
                </div>
                <div className="bg-lavender/30 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">월주</p>
                  <p className="font-medium">{selectedCelebrity.sajuElements.monthPillar}</p>
                </div>
                <div className="bg-lavender/30 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">일주</p>
                  <p className="font-medium">{selectedCelebrity.sajuElements.dayPillar}</p>
                </div>
                <div className="bg-lavender/30 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">시주</p>
                  <p className="font-medium">{selectedCelebrity.sajuElements.hourPillar}</p>
                </div>
              </div>
              <h3 className="text-lg font-medium text-indigo mb-3">성격 및 특징</h3>
              <p className="text-gray-700 leading-relaxed">
                {selectedCelebrity.description}
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">나의 사주도 확인해보고 싶으신가요?</p>
          <a href="/saju-input" className="primary-button inline-flex">
            사주 입력하기 <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default Celebrities;
