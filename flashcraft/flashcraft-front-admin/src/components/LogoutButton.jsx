import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <button onClick={handleLogout} className="btn-logout">
      Sair
    </button>
  );
}

export default LogoutButton;
