import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null; user: User | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Set up the auth state listener first
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (
        event === "SIGNED_IN" &&
        currentSession?.user &&
        !isInitialMount.current
      ) {
        toast({
          title: "로그인 성공",
          description: "환영합니다!",
        });

        // We use setTimeout to avoid calling Supabase functions directly inside the callback
        setTimeout(() => {
          checkUserProfile(currentSession.user.id);
        }, 0);
      }

      if (event === "SIGNED_OUT") {
        toast({
          title: "로그아웃 완료",
          description: "다음에 또 만나요!",
        });
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        checkUserProfile(initialSession.user.id);
      }

      setLoading(false);
      isInitialMount.current = false;
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Check if user has a profile, if not create one
  const checkUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      // Create profile if it doesn't exist
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{ id: userId }]);

      if (profileError) {
        console.error("Error creating user profile:", profileError);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      return { error, user: data?.user || null };
    } catch (error) {
      return { error, user: null };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const contextValue: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
