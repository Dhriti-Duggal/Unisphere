import { useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

// Add global types for Botpress
declare global {
  interface Window {
    botpressWebChat: any;
  }
}

export function BotpressChat() {
  const { user } = useUser();

  useEffect(() => {
    // 1. Inject Botpress script (v3.6)
    const injectScript = document.createElement('script');
    injectScript.src = "https://cdn.botpress.cloud/webchat/v3.6/inject.js";
    injectScript.async = true;
    document.body.appendChild(injectScript);

    // 2. Inject Botpress Config script
    const configScript = document.createElement('script');
    configScript.src = "https://files.bpcontent.cloud/2026/05/20/06/20260520061815-S5ZMULUL.js";
    configScript.defer = true;
    document.body.appendChild(configScript);

    // 2. Listen for the webchat opening so we can pass the token payload
    const handleMessage = (event: MessageEvent) => {
      // When the chat is opened/ready, we silently send the authentication token
      // so the bot can make secure API calls to our backend.
      if (event.data && event.data.type === 'webchatReady') {
        const token = localStorage.getItem('token');
        if (token && window.botpressWebChat) {
          window.botpressWebChat.sendEvent({
            type: 'proactive-trigger', // custom event the bot can listen to
            channel: 'web',
            payload: {
              token: token,
              userId: user?.id,
              userName: user?.name,
              role: user?.role
            }
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (document.body.contains(injectScript)) {
        document.body.removeChild(injectScript);
      }
      if (document.body.contains(configScript)) {
        document.body.removeChild(configScript);
      }
    };
  }, [user]);

  return null; // This component doesn't render its own UI, it just injects the bot script
}
