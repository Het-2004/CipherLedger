import { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { AuthContext } from "../../context/AuthContext";
import GlobalAiChatbot from "../ai/GlobalAiChatbot";

export default function Layout({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  // Redirect to login if user is not authenticated and is not already on login page
  if (!user && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if user is logged in and tries to access login page
  if (user && isLoginPage) {
    return <Navigate to="/" replace />;
  }

  if (isLoginPage) {
    return (
      <div className="min-h-screen w-screen bg-[#020617] flex items-center justify-center relative overflow-hidden">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100 relative">
      {/* Sidebar - fixed width */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-grow p-8 overflow-y-auto relative z-10">
          {children}
        </main>
      </div>

      {/* Floating Global Chatbot Widget */}
      <GlobalAiChatbot />
    </div>
  );
}