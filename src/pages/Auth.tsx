import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to home
  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "로그인 오류",
            description:
              error.message === "Invalid login credentials"
                ? "이메일 또는 비밀번호가 올바르지 않습니다."
                : error.message || "로그인 중 문제가 발생했습니다.",
            variant: "destructive",
          });
        } else {
          navigate("/");
        }
      } else {
        // Validate password confirmation
        if (password !== confirmPassword) {
          toast({
            title: "회원가입 오류",
            description: "비밀번호가 일치하지 않습니다.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Validate password strength
        if (password.length < 6) {
          toast({
            title: "회원가입 오류",
            description: "비밀번호는 최소 6자 이상이어야 합니다.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const { error, user } = await signUp(email, password);
        if (error) {
          toast({
            title: "회원가입 오류",
            description:
              error.message === "User already registered"
                ? "이미 등록된 이메일입니다."
                : error.message || "회원가입 중 문제가 발생했습니다.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "회원가입 성공!",
            description: "이메일을 확인하여 계정을 활성화해주세요.",
          });
          setIsLogin(true);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "오류 발생",
          description:
            error.message || "로그인/회원가입 중 문제가 발생했습니다.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-indigo text-center">
          {isLogin ? "로그인" : "회원가입"}
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-indigo"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-indigo"
                required
                minLength={6}
              />
              {!isLogin && (
                <p className="mt-1 text-sm text-gray-500">
                  비밀번호는 최소 6자 이상이어야 합니다.
                </p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-indigo"
                  required
                  minLength={6}
                />
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full primary-button"
              >
                {loading ? "처리 중..." : isLogin ? "로그인" : "회원가입"}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setPassword("");
                setConfirmPassword("");
              }}
              className="text-indigo hover:underline text-sm"
            >
              {isLogin
                ? "계정이 없으신가요? 회원가입"
                : "이미 계정이 있으신가요? 로그인"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
