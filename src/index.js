import React from 'react';
import { createRoot } from 'react-dom/client';
import { EditorProvider } from './contexts/EditorContext';
import VanillaEditor from './components/Editor/VanillaEditor';
import './styles/main.css';

// Main entry point for the React application
const App = () => {
  return (
    <EditorProvider>
      <VanillaEditor />
    </EditorProvider>
  );
};

// Initialize the app based on the current admin page
document.addEventListener('DOMContentLoaded', () => {
  // Editor page
  const editorRoot = document.getElementById('vanilla-builder-editor-root');
  if (editorRoot) {
    const root = createRoot(editorRoot);
    root.render(<App />);
  }

  // Admin dashboard
  const adminRoot = document.getElementById('vanilla-builder-admin-root');
  if (adminRoot) {
    const AdminDashboard = React.lazy(() => import('./components/Admin/Dashboard'));
    const root = createRoot(adminRoot);
    root.render(
      <React.Suspense fallback={<div>Loading...</div>}>
        <AdminDashboard />
      </React.Suspense>
    );
  }

  // Settings page
  const settingsRoot = document.getElementById('vanilla-builder-settings-root');
  if (settingsRoot) {
    const SettingsPage = React.lazy(() => import('./components/Admin/Settings'));
    const root = createRoot(settingsRoot);
    root.render(
      <React.Suspense fallback={<div>Loading...</div>}>
        <SettingsPage />
      </React.Suspense>
    );
  }
});