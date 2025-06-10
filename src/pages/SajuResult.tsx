import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { ArrowRight, Download, MessageSquare } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  getSajuFromSessionStorage,
  getSajuResult,
  SajuFormData,
} from "../services/sajuService";
import { toast } from "@/hooks/use-toast";
import PaymentDialog from "@/components/PaymentDialog";
import { createPaymentRequest } from "@/services/paymentService";
import { PAYMENT_PRODUCTS } from "@/lib/constants";
import SajuTable from "@/components/SajuTable";
import axios from "axios";

type FormData = {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  gender: string;
  birthplace: string;
};

interface BaziRequest {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: string;
  location: string;
  offset: number;
}

interface BaziResult {
  ohaeng: string;
  sipsin: string;
  lunar_date: string;
  day_of_week: string;
  zodiac_sign: string;
  moon_phase: string;
  month_size: number;
  seasonal_term: string;
  zodiac_animal: string;
  solar_plan_info: string;
  lunar_plan_info: string;
  analysis: string;
}

interface BaziResponse {
  input_info: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    gender: string;
    location: string;
  };
  corrected_time: string;
  result: BaziResult;
}

interface ValidationError {
  detail: Array<{
    loc: [string, number];
    msg: string;
    type: string;
  }>;
}

type TabType = "basic" | "personality" | "yearly";

const SajuResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [formData, setFormData] = useState<SajuFormData | null>(null);
  const [result, setResult] = useState<BaziResponse | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [loading, setLoading] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentType, setPaymentType] = useState<"download" | "chat" | null>(
    null
  );

  const sajuTableData = {
    solarDate: "1996/05/13 04:41",
    lunarDate: "1996/03/26 04:41",
    gender: "남자",
    birthplace: "부산광역시",
    adjustedTime: "1996/05/13 04:17",
    sajuData: {
      year: {
        cheongan: "병 (정관)",
        jiji: "자",
        jijanggan: "계",
        twelveGods: "병",
        twelveKillers: "반안살:×, 재살:×, 월살:×",
      },
      month: {
        cheongan: "계 (상관)",
        jiji: "사",
        jijanggan: "병,경,무",
        twelveGods: "양",
        twelveKillers: "반안살:×, 재살:×, 월살:×",
      },
      day: {
        cheongan: "경 (비견)",
        jiji: "술",
        jijanggan: "신,정,무",
        twelveGods: "제왕",
        twelveKillers: "반안살:×, 재살:×, 월살:×",
      },
      hour: {
        cheongan: "무 (정인)",
        jiji: "인",
        jijanggan: "갑,병,무",
        twelveGods: "묘",
        twelveKillers: "반안살:×, 재살:×, 월살:×",
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data: SajuFormData | null = null;

        if (user) {
          const searchParams = new URLSearchParams(location.search);
          const id = searchParams.get("id");

          if (id) {
            const analysisResult = await getSajuResult(id);
            if (analysisResult) {
              data = {
                birthYear: analysisResult.id.split("-")[0],
                birthMonth: analysisResult.id.split("-")[1],
                birthDay: analysisResult.id.split("-")[2],
                birthHour: analysisResult.id.split("-")[3],
                birthMinute: analysisResult.id.split("-")[4],
                gender: analysisResult.id.split("-")[5] as "male" | "female",
                birthplace: analysisResult.id.split("-")[6] || "korea",
              };
            }
          }
        } else {
          const storedData = getSajuFromSessionStorage();
          if (storedData) {
            data = storedData;
          }
        }

        if (data) {
          setFormData(data);

          try {
            const response = await axios.post<BaziResponse>(
              "https://sajuapi-production.up.railway.app/calculate",
              {
                year: parseInt(data.birthYear),
                month: parseInt(data.birthMonth),
                day: parseInt(data.birthDay),
                hour: parseInt(data.birthHour),
                minute: parseInt(data.birthMinute),
                gender: data.gender === "male" ? "남자" : "여자",
                location:
                  data.birthplace === "korea" ? "부산광역시" : data.birthplace,
                offset: 24,
              } as BaziRequest,
              {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "POST, OPTIONS",
                  "Access-Control-Allow-Headers": "Content-Type",
                },
                withCredentials: false,
              }
            );

            if (response.data) {
              setResult(response.data);
            } else {
              throw new Error("API 응답 데이터가 없습니다.");
            }
          } catch (apiError) {
            console.error("API 호출 에러:", apiError);
            toast({
              title: "API 오류",
              description:
                "사주 계산 중 문제가 발생했습니다. 다시 시도해주세요.",
              variant: "destructive",
            });
            navigate("/saju-input");
          }
        } else {
          toast({
            title: "오류",
            description: "사주 데이터를 찾을 수 없습니다.",
            variant: "destructive",
          });
          navigate("/saju-input");
        }
      } catch (error) {
        console.error("Error fetching saju data:", error);
        toast({
          title: "오류",
          description: "사주 데이터를 불러오는 중 문제가 발생했습니다.",
          variant: "destructive",
        });
        navigate("/saju-input");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, location.search, user]);

  const handleDownloadReport = async () => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "운세 리포트 다운로드는 로그인 후 이용 가능합니다.",
      });
      navigate("/auth");
      return;
    }

    if (!result) {
      toast({
        title: "오류",
        description: "사주 데이터를 찾을 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    setPaymentType("download");
    setShowPaymentDialog(true);
  };

  const handleOpenChat = async () => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "AI 상담은 로그인 후 이용 가능합니다.",
      });
      navigate("/auth");
      return;
    }

    if (!result) {
      toast({
        title: "오류",
        description: "사주 데이터를 찾을 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    navigate("/chat");
  };

  const handlePayment = async (productId: string, paymentMethod: string) => {
    if (!user || !result) {
      toast({
        title: "오류",
        description: "결제를 진행할 수 없습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      const product = PAYMENT_PRODUCTS[productId];
      if (!product) {
        throw new Error("유효하지 않은 상품입니다.");
      }

      const { paymentId, redirectUrl } = await createPaymentRequest(
        user.id,
        product,
        paymentMethod
      );

      if (!redirectUrl) {
        throw new Error("결제 URL을 생성할 수 없습니다.");
      }

      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "결제 오류",
        description: "결제 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-xl text-indigo">로딩 중...</div>
        </div>
      </Layout>
    );
  }

  if (!formData || !result) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-[50vh]">
          <div className="text-xl text-indigo mb-4">
            사주 데이터를 찾을 수 없습니다.
          </div>
          <Link to="/saju-input" className="primary-button">
            사주 입력하기
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-indigo text-center">
          사주 해석 결과
        </h1>

        <SajuTable {...sajuTableData} />

        {/* {formData && (
          <p className="text-gray-600 mb-2 text-center">
            {formData.birthYear}년 {formData.birthMonth}월 {formData.birthDay}일{" "}
            {formData.birthHour}시 {formData.birthMinute}분
          </p>
        )}

        {formData && (
          <p className="text-gray-600 mb-10 text-center">
            {formData.gender === "female" ? "여성" : "남성"} |{" "}
            {formData.birthplace === "korea" ? "한국" : formData.birthplace}
          </p>
        )} */}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* <h2 className="text-2xl font-bold mb-6 text-indigo text-center">
            사주 분석 결과
          </h2> */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo/5 to-lavender/5 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-indigo">
                기본 정보
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-lg mb-2 text-indigo">
                    나의 오행
                  </h4>
                  <p className="text-2xl font-bold mb-2">
                    {result?.result.ohaeng || "화(火)"}
                  </p>
                  <p className="text-gray-600">
                    오행은 동양 철학에서 우주의 기본 요소를 나타내는 개념으로,
                    개인의 성격과 에너지 특성을 이해하는 데 도움이 됩니다.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-lg mb-2 text-indigo">
                    나의 십신
                  </h4>
                  <p className="text-2xl font-bold mb-2">
                    {result?.result.sipsin || "식신(食神)"}
                  </p>
                  <p className="text-gray-600">
                    십신은 사주에서 개인의 기본 성향과 삶의 흐름을 나타내는
                    요소로, 인생의 방향성을 제시합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo/5 to-lavender/5 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-indigo">
                만세력 정보
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-lg mb-3 text-indigo">
                    날짜 정보
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">양력:</span>
                      <span className="font-medium">
                        {result?.input_info.year}년 {result?.input_info.month}월{" "}
                        {result?.input_info.day}일
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">음력:</span>
                      <span className="font-medium">
                        {result?.result.lunar_date || "정보 없음"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">요일:</span>
                      <span className="font-medium">
                        {result?.result.day_of_week || "정보 없음"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-lg mb-3 text-indigo">
                    천문 정보
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">별자리:</span>
                      <span className="font-medium">
                        {result?.result.zodiac_sign || "정보 없음"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">달의 위상:</span>
                      <span className="font-medium">
                        {result?.result.moon_phase || "정보 없음"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">달의 크기:</span>
                      <span className="font-medium">
                        {result?.result.month_size || "정보 없음"}일
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-lg mb-3 text-indigo">
                    절기와 명절
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">절기:</span>
                      <span className="font-medium">
                        {result?.result.seasonal_term || "정보 없음"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">띠:</span>
                      <span className="font-medium">
                        {result?.result.zodiac_animal || "정보 없음"}띠
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo/5 to-lavender/5 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-indigo">
                플래너 정보
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-lg mb-3 text-indigo">
                    양력 플래너
                  </h4>
                  <p className="text-gray-700 whitespace-pre-line">
                    {result?.result.solar_plan_info ||
                      "플래너 정보가 없습니다."}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-lg mb-3 text-indigo">
                    음력 플래너
                  </h4>
                  <p className="text-gray-700 whitespace-pre-line">
                    {result?.result.lunar_plan_info ||
                      "플래너 정보가 없습니다."}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo/5 to-lavender/5 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-indigo">
                사주 간략 해석
              </h3>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  {result?.result.analysis ||
                    "귀하의 사주는 화(火) 오행과 식신(食神) 십신을 중심으로 구성되어 있습니다. 이는 창의적이고 예술적인 기질을 가진 사람으로, 새로운 아이디어를 생각해내는 능력이 뛰어난 것을 의미합니다. 감성이 풍부하고 열정적인 성향으로, 주변 사람들에게 긍정적인 영향을 주는 특성이 있습니다."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {!user && (
          <div className="bg-lavender/20 p-4 rounded-lg text-center mb-8">
            <p className="text-gray-700 mb-3">
              로그인하시면 사주 결과를 저장하고 추가 기능을 이용할 수 있습니다.
            </p>
            <Link to="/auth" className="primary-button inline-flex">
              로그인 또는 회원가입
            </Link>
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            다른 생년월일로 사주를 보고 싶으신가요?
          </p>
          <Link to="/saju-input" className="secondary-button inline-flex">
            다시 입력하기 <ArrowRight size={18} />
          </Link>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 primary-button disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !result}
          >
            <Download size={20} />
            상세 리포트 다운로드
          </button>

          <button
            onClick={handleOpenChat}
            className="flex items-center gap-2 primary-button disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !result}
          >
            <MessageSquare size={20} />
            AI 상담사와 대화하기
          </button>
        </div>
      </div>

      <PaymentDialog
        open={showPaymentDialog}
        onClose={() => {
          setShowPaymentDialog(false);
          setPaymentType(null);
        }}
        onSelectProduct={handlePayment}
        type={paymentType}
      />
    </Layout>
  );
};

export default SajuResult;
