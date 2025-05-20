
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import AnimalCard from '../components/AnimalCard';
import { animals } from '../data/dummyData';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  // Display only first 4 animals
  const featuredAnimals = animals.slice(0, 4);

  return (
    <Layout>
      <section className="mt-4 mb-12 text-center">
        <div className="max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-indigo">
            당신의 사주로 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo to-purple-500">미래를 밝히세요</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            사주팔자를 바탕으로 맞춤형 조언과 인생의 방향성을 제시해 드립니다.
            AI 기반 분석으로 더 정확하고 의미 있는 해석을 경험하세요.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/saju-input" className="primary-button">
              사주 입력하기 <ArrowRight size={18} />
            </Link>
            <Link to="/fortune" className="secondary-button">
              오늘의 운세 보기
            </Link>
          </div>
        </div>

        <div className="my-16">
          <h2 className="text-2xl font-bold mb-6 text-indigo">오늘의 운세</h2>
          <p className="text-gray-600 mb-8">
            동물 캐릭터를 선택하여 오늘의 운세를 확인해보세요
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {featuredAnimals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal.name}
                emoji={animal.emoji}
                onClick={() => alert(animal.fortune)}
              />
            ))}
          </div>
          <div className="mt-8">
            <Link to="/fortune" className="text-indigo hover:text-deep-indigo font-medium flex items-center justify-center gap-2 transition-colors">
              더 많은 운세 보기 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        
        <div className="my-16">
          <h2 className="text-2xl font-bold mb-6 text-indigo">나만의 사주 해석</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="saju-card">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="text-xl font-semibold mb-2 text-indigo">기본 해석</h3>
              <p className="text-gray-600 mb-4">생년월일과 태어난 시간을 바탕으로 기본적인 사주 해석을 무료로 제공합니다.</p>
              <Link to="/saju-input" className="text-indigo hover:text-deep-indigo font-medium inline-flex items-center gap-1 transition-colors">
                시작하기 <ArrowRight size={16} />
              </Link>
            </div>
            <div className="saju-card">
              <div className="text-3xl mb-2">📝</div>
              <h3 className="text-xl font-semibold mb-2 text-indigo">상세 리포트</h3>
              <p className="text-gray-600 mb-4">진로, 연애, 재물운 등 다양한 영역에 대한 심층 분석 리포트를 제공합니다.</p>
              <span className="text-indigo font-medium inline-flex items-center gap-1 opacity-50 cursor-not-allowed">
                곧 출시됩니다
              </span>
            </div>
            <div className="saju-card">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="text-xl font-semibold mb-2 text-indigo">AI 챗봇</h3>
              <p className="text-gray-600 mb-4">당신의 사주를 이해하는 AI와 실시간으로 대화하며 궁금한 점을 질문해보세요.</p>
              <span className="text-indigo font-medium inline-flex items-center gap-1 opacity-50 cursor-not-allowed">
                곧 출시됩니다
              </span>
            </div>
          </div>
        </div>
        
        <div className="my-16">
          <h2 className="text-2xl font-bold mb-6 text-indigo">유명인 사주</h2>
          <p className="text-gray-600 mb-8">
            유명인들의 사주를 살펴보고 그들의 성공 비결을 알아보세요
          </p>
          <div className="flex justify-center">
            <Link to="/celebrities" className="secondary-button">
              유명인 사주 보기 <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
