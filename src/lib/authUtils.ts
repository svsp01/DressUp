import { useRouter } from 'next/navigation';

const handleLogout = async (router: ReturnType<typeof useRouter>) => {
  try {
    await fetch('/api/logout', {
      method: 'POST',
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

export default handleLogout;
