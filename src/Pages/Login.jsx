import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FormError from '../components/FormError';

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login, error: authError } = useAuth(); // Get authError from context
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data);// Call login from AuthContext
      navigate('/procurement');
    } catch (err) {
      // Error is handled in AuthContext, no need to set state here
      console.error('Login error:', err);
    }
  };

  return (
    <section className="login-container">
      <h2 className="login-title">Login to GCDL</h2>
      {authError && <FormError message={authError} />}
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email address',
              },
            })}
            className="form-input"
          />
          {errors.email && <FormError message={errors.email.message} />}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
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