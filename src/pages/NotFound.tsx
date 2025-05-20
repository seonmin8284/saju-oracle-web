
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl text-indigo mb-6">404</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">페이지를 찾을 수 없습니다</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          죄송합니다. 요청하신 페이지를 찾을 수 없습니다. 
          주소가 올바르게 입력되었는지 확인해주세요.
        </p>
        <Link to="/" className="primary-button">
          <Home size={18} /> 홈으로 돌아가기
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
