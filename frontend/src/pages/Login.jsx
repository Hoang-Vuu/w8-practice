import useField from "../hooks/useField";
import useLogin from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const email = useField("email");
  const password = useField("password");

  const { login, error, isLoading } = useLogin("/api/users/login");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const result = await login({
      email: email.value,
      password: password.value,
    });

    if (result.ok) {
      navigate("/", { state: { flash: "Login successful!" } });
    }
  };

  return (
    <div className="create">
      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Email address:</label>
        <input {...email} required />

        <label>Password:</label>
        <input {...password} required />

        <button disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
