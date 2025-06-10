import React from "react";

interface SajuTableProps {
  solarDate: string;
  gender: string;
  birthplace: string;
  adjustedTime: string;
  lunarDate: string;
  sajuData: {
    year: {
      cheongan: string;
      jiji: string;
      jijanggan: string;
      twelveGods: string;
      twelveKillers: string;
    };
    month: {
      cheongan: string;
      jiji: string;
      jijanggan: string;
      twelveGods: string;
      twelveKillers: string;
    };
    day: {
      cheongan: string;
      jiji: string;
      jijanggan: string;
      twelveGods: string;
      twelveKillers: string;
    };
    hour: {
      cheongan: string;
      jiji: string;
      jijanggan: string;
      twelveGods: string;
      twelveKillers: string;
    };
  };
}

const SajuTable: React.FC<SajuTableProps> = ({
  solarDate,
  gender,
  birthplace,
  adjustedTime,
  lunarDate,
  sajuData,
}) => {
  // 천간과 십성을 분리하는 함수
  const splitCheongan = (cheongan: string) => {
    const [gan, sipsung] = cheongan.split(" (");
    return {
      gan: gan,
      sipsung: sipsung ? sipsung.replace(")", "") : "",
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-indigo mb-4">기본 정보</h2>
        <div className="space-y-2">
          <p className="text-gray-600">
            양 {solarDate} {gender} {birthplace}
          </p>
          <p className="text-gray-600">
            음(평달) {lunarDate} {gender} {birthplace}
          </p>
          <p className="text-gray-600">
            양 {adjustedTime} {gender} {birthplace} (지역시 -24분)
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-indigo mb-4">사주 결과</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo/5">
                <th className="border border-gray-200 p-3 text-left">구분</th>
                <th className="border border-gray-200 p-3 text-center">생시</th>
                <th className="border border-gray-200 p-3 text-center">생일</th>
                <th className="border border-gray-200 p-3 text-center">생월</th>
                <th className="border border-gray-200 p-3 text-center">생년</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 p-3 font-medium">천간</td>
                <td className="border border-gray-200 p-3 text-center">
                  {splitCheongan(sajuData.hour.cheongan).gan}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {splitCheongan(sajuData.day.cheongan).gan}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {splitCheongan(sajuData.month.cheongan).gan}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {splitCheongan(sajuData.year.cheongan).gan}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-medium">십성</td>
                <td className="border border-gray-200 p-3 text-center">
                  {splitCheongan(sajuData.hour.cheongan).sipsung}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {splitCheongan(sajuData.day.cheongan).sipsung}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {splitCheongan(sajuData.month.cheongan).sipsung}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {splitCheongan(sajuData.year.cheongan).sipsung}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-medium">지지</td>
                <td className="border border-gray-200 p-3 text-center">
                  {sajuData.hour.jiji}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {sajuData.day.jiji}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {sajuData.month.jiji}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {sajuData.year.jiji}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-medium">
                  지장간
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {sajuData.hour.jijanggan}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {sajuData.day.jijanggan}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {sajuData.month.jijanggan}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {sajuData.year.jijanggan}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-medium">
                  12운성
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {sajuData.hour.twelveGods}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {sajuData.day.twelveGods}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {sajuData.month.twelveGods}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {sajuData.year.twelveGods}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-medium">
                  12신살
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {sajuData.hour.twelveKillers}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {sajuData.day.twelveKillers}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {sajuData.month.twelveKillers}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {sajuData.year.twelveKillers}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SajuTable;
