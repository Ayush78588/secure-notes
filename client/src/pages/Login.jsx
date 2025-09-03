import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp, loginWithOtp, loginWithGoogle } from "../api";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loginMethod, setLoginMethod] = useState(null);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await sendOtp(email);
      setOtpSent(true);
      setLoginMethod("otp");
    } catch (err) {
      console.error("Error sending OTP:", err);
      alert("Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const { data } = await loginWithOtp(email, otp);
      console.log(data,1111);
      
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.accessToken);
      console.log(data.accessToken);
      

      navigate("/dashboard");
    } catch (err) {
      console.error("Error verifying OTP:", err);
      alert("Invalid OTP");
    }
  };

  const handleGoogleLogin = async () => {
    try {
    
      const fakeGoogleToken = "demo_google_token";
      const { data } = await loginWithGoogle(fakeGoogleToken);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setLoginMethod("google");
      localStorage.setItem("token", data.accessToken);

      navigate("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);
      alert("Google login failed");
    }
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
          {!otpSent ? (
            <button onClick={handleSendOtp} style={{ marginLeft: "10px" }}>
              Send OTP
            </button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ marginLeft: "10px", padding: "10px" }}
              />
              <button onClick={handleVerifyOtp} style={{ marginLeft: "10px" }}>
                Verify OTP
              </button>
            </>
          )}
        </div>
      )}

      {loginMethod !== "otp" && (
        <div>
          <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
      )}
    </div>
  );
}

export default Login;
