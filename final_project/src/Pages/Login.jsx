import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FormError from "../components/FormError";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    login(data);
    navigate("/procurement");
  };

  return (
    <section className="login-container">
      <h2 className="login-title">Login to GCDL</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            {...register("username", { required: "Username is required" })}
            className="form-input"
          />
          {errors.username && <FormError message={errors.username.message} />}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="form-input"
          />
          {errors.password && <FormError message={errors.password.message} />}
        </div>
        <button type="submit" className="form-button">
          Login
        </button>
      </form>
    </section>
  );
}

export default Login;