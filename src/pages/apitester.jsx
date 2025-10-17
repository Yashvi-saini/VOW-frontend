import React, { useEffect } from "react";

const ApiTester = () => {
  useEffect(() => {
    const baseUrl = "https://vow-org.me/auth"; // ✅ Correct base URL

    const testUser = {
      email: "testuser@example.com",
      password: "12345678",
      username: "testuser",
    };

    const callApi = async (endpoint, method = "GET", body = null) => {
      console.log(`\n🚀 Calling ${endpoint}`);
      try {
        const res = await fetch(`${baseUrl}${endpoint}`, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: body ? JSON.stringify(body) : null,
        });

        const text = await res.text();
        console.log(`📡 Status: ${res.status}`);
        console.log("🧾 Response:", text);
      } catch (error) {
        console.error(`❌ Error calling ${endpoint}:`, error);
      }
    };

    // 1️⃣ Register
    callApi("/register", "POST", {
      email: testUser.email,
      username: testUser.username,
      password: testUser.password,
    });

    // 2️⃣ Login
    callApi("/login", "POST", {
      email: testUser.email,
      password: testUser.password,
    });

    // 3️⃣ Resend verification email
    callApi("/resend", "POST", {
      email: testUser.email,
    });

    // 4️⃣ Forgot Password
    callApi("/forgetpassword", "POST", {
      email: testUser.email,
    });

    // Optional: Uncomment these when you have a valid OTP
    // callApi("/verifyemail", "POST", { email: testUser.email, code: "123456" });
    // callApi("/resetpassword", "POST", { email: testUser.email, code: "123456", newPassword: "newpass123" });

  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🔍 Testing VOW API Endpoints</h2>
      <p>Open your browser console to view results.</p>
    </div>
  );
};

export default ApiTester;
