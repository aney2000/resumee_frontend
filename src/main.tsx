import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/App';
import { ProfileProvider } from '@/app/ProfileContext';
import { profileData } from '@/data/profile.data';
import { StaticProfileRepository } from '@/services/ProfileRepository';
import '@/styles/tokens.css';
import '@/styles/global.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element #root not found');
}

const repository = new StaticProfileRepository(profileData);

createRoot(container).render(
  <StrictMode>
    <ProfileProvider repository={repository}>
      <App />
    </ProfileProvider>
  </StrictMode>,
);
