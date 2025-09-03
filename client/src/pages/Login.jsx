import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp, loginWithOtp, loginWithGoogle } from "../api";
import { GoogleLogin } from "@react-oauth/google";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loginMethod, setLoginMethod] = useState(null);
  const [isSending, setIsSending] = useState(false); // prevent multiple clicks
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!email) return alert("Please enter your email");

    if (isSending) return; 

    setIsSending(true); 

    try {
      await sendOtp(email);
      setOtpSent(true);
      setLoginMethod("otp");
      setCountdown(60); 
    } catch (err) {
      console.error("Error sending OTP:", err);
      alert("Failed to send OTP");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const { data } = await loginWithOtp(email, otp);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.accessToken);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error verifying OTP:", err);
      alert("Invalid OTP");
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential; // JWT from Google
      const { data } = await loginWithGoogle(token);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.accessToken);
      setLoginMethod("google");
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed");
    }
  };

  const handleGoogleLoginError = () => {
    alert("Google login failed");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      {loginMethod !== "google" && (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "10px", width: "60%" }}
          />

          {!otpSent && (
            <div style={{ marginTop: "10px" }}>
              <button onClick={handleSendOtp} disabled={isSending}>
                {isSending ? "Sending..." : "Send OTP"}
              </button>
            </div>
          )}

          {otpSent && (
            <div style={{ marginTop: "20px" }}>
              {countdown > 0 ? (
                <div style={{ marginBottom: "10px" }}>
                  Resend OTP in {countdown}s
                </div>
              ) : (
                <button
                  onClick={handleSendOtp}
                  disabled={isSending}
                  style={{ marginBottom: "10px" }}
                >
                  {isSending ? "Sending..." : "Resend OTP"}
                </button>
              )}

              <div style={{ marginBottom: "10px" }}>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{ padding: "10px", width: "60%" }}
                />
              </div>

              <div>
                <button onClick={handleVerifyOtp}>Verify OTP</button>
              </div>
            </div>
          )}
        </div>
      )}

      {loginMethod !== "otp" && (
        <div style={{ marginTop: "10px" }}>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />
        </div>
      )}
    </div>
  );
}

export default Login;
