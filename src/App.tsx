import { useProfile } from '@/app/ProfileContext';
import { PortfolioPage } from '@/app/PortfolioPage';

export function App() {
  const state = useProfile();

  switch (state.status) {
    case 'loading':
      return <p role="status">Loading profile…</p>;
    case 'error':
      return <p role="alert">Could not load profile: {state.error.message}</p>;
    case 'ready':
      return <PortfolioPage profile={state.profile} />;
  }
}
