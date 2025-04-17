import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import FormError from '../components/FormError';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const context = useContext(AuthContext);
  const { login, error: authError } = context || { login: async () => {}, error: null };
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate('/procurement');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="form-container">
      <h2>Login to GCDL</h2>
      <p className="card-subtext">"With GOD NOTHING CAN STAND IN OUR WAY"</p>
      {authError && <FormError message={authError} />}
      <form onSubmit={handleSubmit(onSubmit)}>
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
          />
          {errors.email && <FormError message={errors.email.message} />}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <FormError message={errors.password.message} />}
        </div>
        <button type="submit" className="form-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;