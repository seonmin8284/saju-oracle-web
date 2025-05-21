import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { ArrowRight, Download, MessageSquare } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  getSajuFromSessionStorage,
  getSajuResult,
} from "../services/sajuService";
import { toast } from "@/hooks/use-toast";
import PaymentDialog from "@/components/PaymentDialog";
import { createPaymentRequest } from "@/services/paymentService";
import { PAYMENT_PRODUCTS } from "@/lib/constants";

type FormData = {
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
  celestialInfo?: {
    zodiacSign: string;
    moonPhase: string;
    moonPhaseTime: number;
    monthSize: number;
  };
  seasonalTerms?: {
    hanja: string;
    hangul: string;
    timestamp: number;
  };
  additionalInfo?: {
    zodiacAnimal: string;
    dayOfWeek: {
      hanja: string;
      hangul: string;
    };
    isHoliday: boolean;
    solarPlanInfo?: string;
    lunarPlanInfo?: string;
  };
  solarDate?: {
    year: number;
    month: number;
    day: number;
  };
  lunarDate?: {
    year: number;
    month: number;
    day: number;
    isLeapMonth: boolean;
  };
};

type TabType = "basic" | "personality" | "yearly";

const SajuResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [sajuResult, setSajuResult] = useState<SajuResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [loading, setLoading] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentType, setPaymentType] = useState<"download" | "chat" | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Check if we have an ID in the URL (for logged-in users)
        const params = new URLSearchParams(location.search);
        const sajuId = params.get("id");

        if (sajuId && user) {
          // Fetch from Supabase
          const result = await getSajuResult(sajuId);
          if (result) {
            setSajuResult(result);
            // Extract form data from the database result if needed
            // This might require additional API calls depending on your data structure
          } else {
            toast({
              title: "오류",
              description: "사주 데이터를 불러오는 중 문제가 발생했습니다.",
              variant: "destructive",
            });
            navigate("/saju-input");
          }
        } else {
          // Use session storage for non-authenticated users
          const storedData = getSajuFromSessionStorage();

          if (!storedData) {
            navigate("/saju-input");
            return;
          }

          setFormData(storedData);
          // For non-authenticated users, we'll use the dummy result
          setSajuResult({
            id: "temp",
            ohaeng: "화(火)",
            sipsin: "식신(食神)",
            personality: [
              "창의적이고 열정적인 성격을 가지고 있습니다.",
              "새로운 아이디어를 창출하는 능력이 뛰어납니다.",
              "긍정적인 에너지로 주변 사람들에게 영감을 줍니다.",
              "예술적 감각이 풍부하며 아름다움을 추구합니다.",
              "때로는 충동적인 결정을 내릴 수 있으니 주의가 필요합니다.",
            ],
            career: [
              "창의력을 발휘할 수 있는 예술, 디자인 분야에 적합합니다.",
              "마케팅, 광고, 기획 등의 분야에서도 능력을 발휘할 수 있습니다.",
              "자신만의 독특한 시각으로 혁신을 이끌어낼 수 있는 직업이 좋습니다.",
              "팀 프로젝트보다는 개인의 창의성을 발휘할 수 있는 역할이 적합합니다.",
            ],
            relationship: [
              "열정적이고 로맨틱한 연애 스타일을 가지고 있습니다.",
              "파트너에게 풍부한 영감과 에너지를 제공합니다.",
              "안정적이고 차분한 성향의 파트너와 균형을 이룰 수 있습니다.",
              "감정 표현이 풍부하여 관계에서 진실된 소통이 가능합니다.",
              "때로는 감정의 기복이 있을 수 있으니 이해와 인내가 필요합니다.",
            ],
            yearly: [
              {
                year: "2025",
                description:
                  "창의적인 에너지가 높아지는 해로, 새로운 프로젝트나 계획을 시작하기에 좋은 시기입니다. 특히 3월~7월 사이에 중요한 기회가 올 수 있으니 준비하세요.",
              },
              {
                year: "2026",
                description:
                  "안정과 성장이 함께 이루어지는 해입니다. 기존의 관계와 사업이 더욱 견고해지며, 건강 관리에 특히 신경 써야 합니다.",
              },
              {
                year: "2027",
                description:
                  "변화와 도전이 많은 해가 될 수 있습니다. 유연한 마음가짐으로 변화에 적응하면 더 나은 결과를 얻을 수 있을 것입니다.",
              },
            ],
          });
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

  const handleDownloadReport = () => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "운세 리포트 다운로드는 로그인 후 이용 가능합니다.",
      });
      navigate("/auth");
      return;
    }

    setPaymentType("download");
    setShowPaymentDialog(true);
  };

  const handleOpenChat = () => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "AI 상담은 로그인 후 이용 가능합니다.",
      });
      navigate("/auth");
      return;
    }

    setPaymentType("chat");
    setShowPaymentDialog(true);
  };

  const handlePayment = async (productId: string, paymentMethod: string) => {
    if (!user) return;

    try {
      const product = PAYMENT_PRODUCTS[productId];
      const { paymentId, redirectUrl } = await createPaymentRequest(
        user.id,
        product,
        paymentMethod
      );

      // 실제 구현에서는 PG사의 결제창을 엽니다
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

  if (!formData && !sajuResult) {
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

        {formData && (
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
        )}

        {sajuResult && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="flex border-b">
              <button
                className={`py-4 px-6 font-medium text-sm flex-1 ${
                  activeTab === "basic"
                    ? "bg-indigo text-white"
                    : "bg-white hover:bg-lavender/50 text-gray-700"
                }`}
                onClick={() => setActiveTab("basic")}
              >
                기본 정보
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm flex-1 ${
                  activeTab === "personality"
                    ? "bg-indigo text-white"
                    : "bg-white hover:bg-lavender/50 text-gray-700"
                }`}
                onClick={() => setActiveTab("personality")}
              >
                성격 및 특성
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm flex-1 ${
                  activeTab === "yearly"
                    ? "bg-indigo text-white"
                    : "bg-white hover:bg-lavender/50 text-gray-700"
                }`}
                onClick={() => setActiveTab("yearly")}
              >
                연도별 운세
              </button>
            </div>

            <div className="p-6">
              {activeTab === "basic" && (
                <div className="animate-fade-in">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-lavender/20 p-4 rounded-lg">
                      <h3 className="font-medium text-lg text-indigo mb-2">
                        나의 오행
                      </h3>
                      <p className="text-xl font-semibold">
                        {sajuResult.ohaeng}
                      </p>
                      <p className="text-gray-600 mt-2">
                        오행은 동양 철학에서 우주의 기본 요소를 나타내는
                        개념으로, 개인의 성격과 에너지 특성을 이해하는 데 도움이
                        됩니다.
                      </p>
                    </div>
                    <div className="bg-lavender/20 p-4 rounded-lg">
                      <h3 className="font-medium text-lg text-indigo mb-2">
                        나의 십신
                      </h3>
                      <p className="text-xl font-semibold">
                        {sajuResult.sipsin}
                      </p>
                      <p className="text-gray-600 mt-2">
                        십신은 사주에서 개인의 기본 성향과 삶의 흐름을 나타내는
                        요소로, 인생의 방향성을 제시합니다.
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="font-medium text-xl text-indigo mb-4">
                      만세력 정보
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-white shadow-md rounded-lg p-4">
                        <h4 className="font-medium text-lg text-indigo mb-2">
                          날짜 정보
                        </h4>
                        <div className="space-y-2">
                          <p>
                            <span className="text-gray-600">양력:</span>{" "}
                            {sajuResult.solarDate?.year}년{" "}
                            {sajuResult.solarDate?.month}월{" "}
                            {sajuResult.solarDate?.day}일
                          </p>
                          <p>
                            <span className="text-gray-600">음력:</span>{" "}
                            {sajuResult.lunarDate?.year}년{" "}
                            {sajuResult.lunarDate?.month}월{" "}
                            {sajuResult.lunarDate?.day}일
                            {sajuResult.lunarDate?.isLeapMonth && " (윤달)"}
                          </p>
                          <p>
                            <span className="text-gray-600">요일:</span>{" "}
                            {sajuResult.additionalInfo?.dayOfWeek.hangul}요일 (
                            {sajuResult.additionalInfo?.dayOfWeek.hanja})
                          </p>
                        </div>
                      </div>

                      <div className="bg-white shadow-md rounded-lg p-4">
                        <h4 className="font-medium text-lg text-indigo mb-2">
                          천문 정보
                        </h4>
                        <div className="space-y-2">
                          <p>
                            <span className="text-gray-600">별자리:</span>{" "}
                            {sajuResult.celestialInfo?.zodiacSign}
                          </p>
                          <p>
                            <span className="text-gray-600">달의 위상:</span>{" "}
                            {sajuResult.celestialInfo?.moonPhase}
                          </p>
                          <p>
                            <span className="text-gray-600">달의 크기:</span>{" "}
                            {sajuResult.celestialInfo?.monthSize}일
                          </p>
                        </div>
                      </div>

                      <div className="bg-white shadow-md rounded-lg p-4">
                        <h4 className="font-medium text-lg text-indigo mb-2">
                          절기와 명절
                        </h4>
                        <div className="space-y-2">
                          <p>
                            <span className="text-gray-600">절기:</span>{" "}
                            {sajuResult.seasonalTerms?.hangul} (
                            {sajuResult.seasonalTerms?.hanja})
                          </p>
                          <p>
                            <span className="text-gray-600">띠:</span>{" "}
                            {sajuResult.additionalInfo?.zodiacAnimal}띠
                          </p>
                          {sajuResult.additionalInfo?.isHoliday && (
                            <p className="text-red-500 font-medium">공휴일</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white shadow-md rounded-lg p-4">
                        <h4 className="font-medium text-lg text-indigo mb-2">
                          양력 플래너
                        </h4>
                        <div className="whitespace-pre-line text-gray-700">
                          {sajuResult.additionalInfo?.solarPlanInfo ||
                            "플래너 정보가 없습니다."}
                        </div>
                      </div>
                      <div className="bg-white shadow-md rounded-lg p-4">
                        <h4 className="font-medium text-lg text-indigo mb-2">
                          음력 플래너
                        </h4>
                        <div className="whitespace-pre-line text-gray-700">
                          {sajuResult.additionalInfo?.lunarPlanInfo ||
                            "플래너 정보가 없습니다."}
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-medium text-lg text-indigo mb-3">
                    사주 간략 해석
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    귀하의 사주는 {sajuResult.ohaeng} 오행과 {sajuResult.sipsin}{" "}
                    십신을 중심으로 구성되어 있습니다. 이는 창의적이고 예술적인
                    기질을 가진 사람으로, 새로운 아이디어를 생각해내는 능력이
                    뛰어난 것을 의미합니다. 감성이 풍부하고 열정적인 성향으로,
                    주변 사람들에게 긍정적인 영향을 주는 특성이 있습니다.
                  </p>
                </div>
              )}

              {activeTab === "personality" && (
                <div className="animate-fade-in">
                  <div className="mb-8">
                    <h3 className="font-medium text-lg text-indigo mb-4">
                      성격 및 특성
                    </h3>
                    <ul className="space-y-3">
                      {sajuResult.personality.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-indigo mr-2">•</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-8">
                    <h3 className="font-medium text-lg text-indigo mb-4">
                      직업 및 진로
                    </h3>
                    <ul className="space-y-3">
                      {sajuResult.career.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-indigo mr-2">•</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg text-indigo mb-4">
                      연애 및 대인관계
                    </h3>
                    <ul className="space-y-3">
                      {sajuResult.relationship.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-indigo mr-2">•</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "yearly" && (
                <div className="animate-fade-in">
                  <h3 className="font-medium text-lg text-indigo mb-4">
                    연도별 운세
                  </h3>

                  <div className="space-y-6">
                    {sajuResult.yearly.map((item, index) => (
                      <div
                        key={index}
                        className="bg-lavender/20 p-4 rounded-lg"
                      >
                        <h4 className="font-semibold text-indigo mb-2">
                          {item.year}년
                        </h4>
                        <p className="text-gray-700">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
            className="flex items-center gap-2 primary-button"
          >
            <Download size={20} />
            상세 리포트 다운로드
          </button>

          <button
            onClick={handleOpenChat}
            className="flex items-center gap-2 primary-button"
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
      />
    </Layout>
  );
};

export default SajuResult;
