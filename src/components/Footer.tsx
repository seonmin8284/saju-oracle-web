
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-indigo mb-4">Read My Saju</h3>
            <p className="text-gray-600 text-sm">
              사용자의 사주 데이터를 기반으로 맞춤형 조언과 진로/연애/심리상담을 제공하는 디지털 운세 플랫폼
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-indigo mb-4">페이지</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-indigo text-sm">
                  홈
                </Link>
              </li>
              <li>
                <Link to="/fortune" className="text-gray-600 hover:text-indigo text-sm">
                  오늘의 운세
                </Link>
              </li>
              <li>
                <Link to="/saju-input" className="text-gray-600 hover:text-indigo text-sm">
                  사주 입력
                </Link>
              </li>
              <li>
                <Link to="/celebrities" className="text-gray-600 hover:text-indigo text-sm">
                  유명인 사주
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-indigo mb-4">고객센터</h3>
            <p className="text-gray-600 text-sm mb-2">
              문의사항이 있으시면 아래 연락처로 문의해주세요.
            </p>
            <p className="text-gray-600 text-sm">
              이메일: info@readmysaju.com
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Read My Saju. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
