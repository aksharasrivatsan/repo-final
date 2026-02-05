import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { GraduationCap, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/request-otp", { email });
      setOtpSent(true);
      alert("OTP sent to your email");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp }
      );

      sessionStorage.setItem("token", res.data.token);
      navigate("/report");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 py-12">

        {/* Logos Header */}
        <div className="flex justify-between items-center mb-10 w-full px-2">
          {/* Increased size of forese-logo to h-20 */}
          <img src="/forese-logo.png" alt="Forese" className="h-20 w-auto object-contain" />
          <img src="/svce-logo.png" alt="SVCE" className="h-8 w-auto object-contain" />
        </div>

        {/* Center Header */}
        <div className="flex flex-col items-center mb-8">
          {/* Graduation Cap Icon */}
          <div className="w-16 h-16 rounded-full bg-[#f0f2ff] flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-[#4a4a68]" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Mocks ’26
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Performance Overview
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={!otpSent ? sendOtp : verifyOtp}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">
              Email Address
            </label>
            {!otpSent ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-600 placeholder:text-gray-300"
                placeholder="student@college.edu"
                required
              />
            ) : (
              <div className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400">
                {email}
              </div>
            )}
          </div>

          {/* OTP Input */}
          {otpSent && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-center tracking-[0.5em] font-mono text-lg"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>
          )}

          {/* Button */}
          {!otpSent ? (
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5244e6] hover:bg-[#4338ca] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send OTP →"
              )}
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP →"
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}