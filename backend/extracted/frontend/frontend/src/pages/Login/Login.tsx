import "./Login.css";

function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🤖 AI Codebase Explorer</h1>
        <p>Welcome Back</p>

        <input type="email" placeholder="Enter your email" />

        <input type="password" placeholder="Enter your password" />

        <button>Sign In</button>
      </div>
    </div>
  );
}

export default Login;