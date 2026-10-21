import { useProfile } from '@/app/ProfileContext';

export function App() {
  const state = useProfile();

  switch (state.status) {
    case 'loading':
      return <p role="status">Loading profile…</p>;
    case 'error':
      return <p role="alert">Could not load profile: {state.error.message}</p>;
    case 'ready':
      return (
        <main>
          <h1>{state.profile.identity.fullName}</h1>
        </main>
      );
  }
}
