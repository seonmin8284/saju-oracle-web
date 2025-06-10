import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  saveSajuResult,
  saveSajuToSessionStorage,
  SajuFormData,
} from "../services/sajuService";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import {
  getSajuFromSessionStorage,
  getSajuResult,
} from "../services/sajuService";

interface ApiResponse {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  gender: string;
  location: string;
  result: {
    [key: string]: string;
  };
}

const SajuInput = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SajuFormData>({
    birthYear: "1996",
    birthMonth: "5",
    birthDay: "13",
    birthHour: "5",
    birthMinute: "5",
    gender: "male",
    birthplace: "korea",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API 호출
      await axios.post<ApiResponse>(
        "https://sajuapi-production.up.railway.app/calculate",
        {
          year: parseInt(formData.birthYear, 10),
          month: parseInt(formData.birthMonth, 10),
          day: parseInt(formData.birthDay, 10),
          hour: parseInt(formData.birthHour, 10),
          minute: parseInt(formData.birthMinute, 10),
          gender: formData.gender === "male" ? "남자" : "여자",
          location:
            formData.birthplace === "korea"
              ? "부산광역시"
              : formData.birthplace,
          offset: 24,
        }
      );

      if (user) {
        // If user is authenticated, save to Supabase
        const sajuId = await saveSajuResult(formData);

        if (sajuId) {
          // Navigate to result page with the ID
          navigate(`/saju-result?id=${sajuId}`);
        } else {
          toast({
            title: "오류",
            description: "사주 데이터를 저장하는 중 문제가 발생했습니다.",
            variant: "destructive",
          });
        }
      } else {
        // If not authenticated, save to session storage
        saveSajuToSessionStorage(formData);
        navigate("/saju-result");
      }
    } catch (error) {
      console.error("Error submitting saju data:", error);
      toast({
        title: "오류",
        description: "사주 데이터를 처리하는 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-3xl font-bold mb-6 text-indigo text-center">
          사주 입력
        </h1>
        <p className="text-gray-600 mb-10 text-center">
          정확한 사주 해석을 위해 생년월일과 태어난 시간을 입력해주세요
        </p>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-indigo mb-4">
                생년월일
              </h2>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="birthYear"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}년
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="birthMonth"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}월
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="birthDay"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}일
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-indigo mb-4">
                태어난 시간
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="birthHour"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    시
                  </label>
                  <select
                    id="birthHour"
                    name="birthHour"
                    value={formData.birthHour}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-indigo"
                  >
                    {hours.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}시
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="birthMinute"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    분
                  </label>
                  <select
                    id="birthMinute"
                    name="birthMinute"
                    value={formData.birthMinute}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-indigo"
                  >
                    {minutes.map((minute) => (
                      <option key={minute} value={minute}>
                        {minute}분
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-sm text-gray-500 italic">
                시간을 모르시는 경우 12시 0분으로 설정해주세요. (정확한 해석을
                위해서는 시간 정보가 중요합니다)
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-indigo mb-4">
                추가 정보
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                  <label
                    htmlFor="birthplace"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                    <option value="korea">부산광역시</option>
                    <option value="japan">일본</option>
                    <option value="china">중국</option>
                    <option value="usa">미국</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full primary-button"
                disabled={loading}
              >
                {loading ? "처리 중..." : "사주 해석하기"}{" "}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          </form>
        </div>

        {!user && (
          <div className="text-center mt-4 p-4 bg-lavender/20 rounded-lg">
            <p className="text-gray-700 mb-2">
              로그인하시면 사주 결과를 저장하고 나중에 다시 볼 수 있습니다.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="secondary-button"
            >
              로그인 또는 회원가입
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SajuInput;
