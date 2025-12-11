import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const name = useField("text");
  const email = useField("email");
  const password = useField("password");
  const phoneNumber = useField("text");
  const gender = useField("text");
  const dateOfBirth = useField("date");
  const street = useField("text");
  const city = useField("text");
  const state = useField("text");
  const zipCode = useField("text");

  const { signup, error, isLoading } = useSignup("/api/users/signup");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const result = await signup({
      name: name.value,
      email: email.value,
      password: password.value,
      phoneNumber: phoneNumber.value,
      gender: gender.value,
      dateOfBirth: dateOfBirth.value,
      address: {
        street: street.value,
        city: city.value,
        state: state.value,
        zipCode: zipCode.value,
      },
    });

    if (result.ok) {
     navigate("/", { state: { flash: "Signup successful!" } });
    }
  };

  return (
    <div className="create">
      <h2>Sign Up</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Name:</label>
        <input {...name} required />

        <label>Email address:</label>
        <input {...email} required />

        <label>Password:</label>
        <input {...password} required />

        <label>Phone Number:</label>
        <input {...phoneNumber} required />

        <label>Gender:</label>
        <input {...gender} placeholder="male/female" />

        <label>Date of Birth:</label>
        <input {...dateOfBirth} required />

        <label>Street:</label>
        <input {...street} required />

        <label>City:</label>
        <input {...city} required />

        <label>State:</label>
        <input {...state} required />

        <label>Zip Code:</label>
        <input {...zipCode} required />

        <button disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign up"}
        </button>

        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Signup;
