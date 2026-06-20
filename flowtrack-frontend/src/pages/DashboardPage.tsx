import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCredentials } from '../store/authSlice';
import { logout } from '../api/auth';

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await logout();
    dispatch(clearCredentials());
    navigate('/');
  };

  return (
    <div style={{ maxWidth: 600, margin: '100px auto', padding: '0 16px' }}>
      <h1>Dashboard</h1>
      <p>You are logged in.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
