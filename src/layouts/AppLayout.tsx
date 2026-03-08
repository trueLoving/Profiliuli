import { useEffect, useReducer, useState } from 'react';
import ArticlesViewer from '../components/global/ArticlesViewer';
import BackgroundPicker from '../components/global/BackgroundPicker';
import DesktopDock from '../components/global/DesktopDock';
import GitHubViewer from '../components/global/GitHubViewer';
import MacTerminal from '../components/global/MacTerminal';
import MacToolbar from '../components/global/MacToolbar';
import MissionControl from '../components/global/MissionControl';
import MobileDock from '../components/global/MobileDock';
import type { Section as NotesSection } from '../components/global/NotesApp';
import NotesApp from '../components/global/NotesApp';
import ResumeViewer from '../components/global/ResumeViewer';
import ShortcutHint from '../components/global/ShortcutHint';
import ShortcutsOverlay from '../components/global/ShortcutsOverlay';
import Spotlight from '../components/global/Spotlight';
import SystemAppsViewer from '../components/global/SystemAppsViewer';
import WelcomeTour from '../components/global/WelcomeTour';
import { I18nProvider } from '../i18n/context';
import type { Locale } from '../i18n/types';
import type { AppLayoutProps } from '../types';

export default function Desktop({ initialBg, backgroundMap }: AppLayoutProps) {
  const [currentBg, setCurrentBg] = useState<string>(initialBg);
  type App = 'terminal' | 'notes' | 'github' | 'resume' | 'spotify' | 'articles' | 'systemApps';
  type State = { windows: Record<App, boolean> };
  type Action = { type: 'OPEN' | 'CLOSE' | 'TOGGLE'; app: App } | { type: 'CLOSE_ALL' };

  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case 'OPEN':
        return { windows: { ...state.windows, [action.app]: true } };
      case 'CLOSE':
        return { windows: { ...state.windows, [action.app]: false } };
      case 'TOGGLE':
        return { windows: { ...state.windows, [action.app]: !state.windows[action.app] } };
      case 'CLOSE_ALL':
        return {
          windows: { terminal: false, notes: false, github: false, resume: false, spotify: false, articles: false, systemApps: false },
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    windows: { terminal: false, notes: false, github: false, resume: false, spotify: false, articles: false, systemApps: false },
  });
  const [showTutorial, setShowTutorial] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isMissionControlOpen, setIsMissionControlOpen] = useState(false);
  const [notesSection, setNotesSection] = useState<NotesSection | undefined>(undefined);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [selectedArticleId, setSelectedArticleId] = useState<string | undefined>(undefined);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [focusedApp, setFocusedApp] = useState<
    'terminal' | 'notes' | 'github' | 'resume' | 'articles' | 'systemApps' | null
  >(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [_videoError, setVideoError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);
  // 服务器端和客户端都初始化为 false，避免 hydration mismatch
  // 客户端挂载后再根据实际条件更新
  const [showShortcutHint, setShowShortcutHint] = useState(false);

  // 客户端挂载后设置实际值
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('showShortcutHint');
    if (saved !== null) {
      setShowShortcutHint(saved === 'true');
    } else {
      // Default: show on desktop, hide on mobile
      const isDesktop = window.innerWidth >= 768;
      setShowShortcutHint(isDesktop);
      localStorage.setItem('showShortcutHint', isDesktop.toString());
    }
  }, []);
  // 服务器端和客户端都初始化为 false，避免 hydration 不匹配
  // 客户端 hydration 后，useEffect 会同步 localStorage 和系统偏好
  const [reducedMotion, setReducedMotion] = useState(false);

  // 客户端挂载后，从 localStorage 或系统偏好读取 reducedMotion 设置
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('reducedMotion');
    if (saved !== null) {
      setReducedMotion(saved === 'true');
    } else {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  const activeApps = state.windows;
  const currentBackground = backgroundMap[currentBg] || Object.values(backgroundMap)[0];

  // Show toast notification
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Apply reduced motion class to body
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
    localStorage.setItem('reducedMotion', reducedMotion.toString());
  }, [reducedMotion]);

  // Listen to system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-update if user hasn't manually set preference
      if (localStorage.getItem('reducedMotion') === null) {
        setReducedMotion(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Ensure video plays when mounted or background changes
  useEffect(() => {
    if (videoRef && currentBackground?.type === 'video') {
      setVideoLoaded(false);
      setVideoError(null);
      videoRef.play().catch(error => {
        console.warn('Video autoplay failed:', error);
      });
    }
  }, [videoRef, currentBg, currentBackground]);

  // 只在客户端执行，避免服务器端和客户端使用不同的随机值
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lastBg = localStorage.getItem('lastBackground');
    const hasCompletedTutorial = localStorage.getItem('hasCompletedTutorial') === 'true';

    if (lastBg === initialBg) {
      const bgKeys = Object.keys(backgroundMap);
      const availableBgs = bgKeys.filter(bg => bg !== lastBg);
      const newBg = availableBgs[Math.floor(Math.random() * availableBgs.length)];
      setCurrentBg(newBg);
    }

    // Only show tutorial if user hasn't completed it before
    if (!hasCompletedTutorial) {
      setShowTutorial(true);
    }

    localStorage.setItem('lastBackground', currentBg);
  }, [initialBg, backgroundMap, currentBg]);

  // Spotlight keyboard shortcut (Cmd/Ctrl + K), help overlay (?), and Mission Control (Ctrl/Cmd+Up or F3)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      if (cmdOrCtrl && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSpotlightOpen(true);
      } else if (
        e.key === '?' ||
        (e.key === '/' && e.shiftKey) ||
        (cmdOrCtrl && (e.key === 'h' || e.key === 'H'))
      ) {
        e.preventDefault();
        setShowShortcuts(s => !s);
      } else if (
        (cmdOrCtrl && e.key === 'ArrowUp') ||
        e.key === 'F3' ||
        (cmdOrCtrl && (e.key === 'm' || e.key === 'M'))
      ) {
        e.preventDefault();
        setIsMissionControlOpen(m => !m);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Add this function to reset tutorial
  const resetTutorial = () => {
    setShowTutorial(true);
    localStorage.setItem('hasCompletedTutorial', 'false');
  };

  // Helper actions for Spotlight
  const openNotesSection = (section: NotesSection) => {
    setNotesSection(section);
    handleAppOpen('notes');
  };
  const closeAllWindows = () => dispatch({ type: 'CLOSE_ALL' });
  const shuffleBackground = () => {
    const bgKeys = Object.keys(backgroundMap);
    const availableBgs = bgKeys.filter(bg => bg !== currentBg);
    const newBg = availableBgs.length > 0
      ? availableBgs[Math.floor(Math.random() * availableBgs.length)]
      : bgKeys[0];
    setCurrentBg(newBg);
    localStorage.setItem('lastBackground', newBg);
  };

  const selectBackground = (key: string) => {
    setCurrentBg(key);
    localStorage.setItem('lastBackground', key);
  };

  const openProjectById = (id: string) => {
    setSelectedProjectId(id);
    handleAppOpen('github');
  };

  // Replaced legacy tutorial with WelcomeTour overlay

  const handleAppOpen = (app: App) => {
    dispatch({ type: 'OPEN', app });
    // Track focused app when opening (only for apps that can be focused)
    if (app !== 'spotify') {
      setFocusedApp(app);
    }
  };
  const handleAppClose = (app: App) => {
    dispatch({ type: 'CLOSE', app });
    // Clear focused app if it was the one being closed
    if (focusedApp === app) {
      setFocusedApp(null);
    }
  };

  return (
    <I18nProvider>
      <div className="relative w-screen h-screen overflow-hidden">
        {currentBackground?.type === 'video' ? (
          <>
            <video
              key={currentBg}
              ref={setVideoRef}
              className={`absolute inset-0 w-full h-full object-cover ${
                reducedMotion ? '' : 'transition-opacity duration-1000'
              } ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
              suppressHydrationWarning
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster={currentBackground.src.replace('.mp4', '.webp')}
              onLoadedData={() => {
                setVideoLoaded(true);
                setVideoError(null);
              }}
              onError={e => {
                console.error('Video background failed to load:', currentBackground.src);
                console.error('Video element error:', e);
                setVideoError('视频加载失败');
                setShowToast('背景视频加载失败，已切换到图片背景');
                // Fallback to first image background if video fails
                const firstImageBg = Object.entries(backgroundMap).find(
                  ([_, bg]) => bg.type === 'image'
                );
                if (firstImageBg) {
                  setCurrentBg(firstImageBg[0]);
                }
              }}
            >
              <source src={currentBackground.src} type="video/mp4" />
            </video>
            {/* Poster is handled by video element's poster attribute */}
          </>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentBackground?.src || ''})` }}
          />
        )}

        <div className="relative z-10">
          <MacToolbar
            onShowTutorial={resetTutorial}
            onOpenSpotlight={() => setIsSpotlightOpen(true)}
            onOpenMissionControl={() => setIsMissionControlOpen(true)}
            onToggleShortcuts={() => setShowShortcuts(s => !s)}
            onCloseAllWindows={closeAllWindows}
            onOpenBackgroundPicker={() => setShowBackgroundPicker(true)}
            reducedMotion={reducedMotion}
            onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
            showShortcutHint={showShortcutHint}
            onToggleShortcutHint={() => {
              const newShow = !showShortcutHint;
              setShowShortcutHint(newShow);
              if (typeof window !== 'undefined') {
                localStorage.setItem('showShortcutHint', newShow.toString());
              }
            }}
            onLanguageSwitch={(locale: Locale) => {
              const langName = locale === 'zh-CN' ? '中文' : 'English';
              const message =
                locale === 'zh-CN'
                  ? `语言已切换为 ${langName}。UI、内容和简历已更新。`
                  : `Language switched to ${langName}. UI, content, and resume have been updated.`;
              setShowToast(message);
            }}
          />
        </div>

        <div className="relative z-0 flex items-center justify-center h-[calc(100vh-10rem)] md:h-[calc(100vh-1.5rem)] pt-6"></div>

        <MobileDock
          onGitHubClick={() => {
            handleAppOpen('github');
          }}
          onNotesClick={() => {
            handleAppOpen('notes');
          }}
          onResumeClick={() => {
            handleAppOpen('resume');
          }}
          onTerminalClick={() => {
            handleAppOpen('terminal');
          }}
          onSystemAppsClick={() => {
            handleAppOpen('systemApps');
          }}
        />
        <DesktopDock
          onTerminalClick={() => {
            handleAppOpen('terminal');
          }}
          onNotesClick={() => {
            handleAppOpen('notes');
          }}
          onGitHubClick={() => {
            handleAppOpen('github');
          }}
          onSystemAppsClick={() => {
            handleAppOpen('systemApps');
          }}
          activeApps={{
            terminal: activeApps.terminal,
            notes: activeApps.notes,
            github: activeApps.github,
            resume: activeApps.resume,
            spotify: activeApps.spotify,
            systemApps: activeApps.systemApps,
          }}
          focusedApp={
            focusedApp === 'articles' ? null : focusedApp
          }
        />

        <NotesApp
          isOpen={state.windows.notes}
          onClose={() => {
            handleAppClose('notes');
          }}
          section={notesSection}
          onFocus={() => setFocusedApp('notes')}
        />
        <GitHubViewer
          isOpen={state.windows.github}
          onClose={() => {
            handleAppClose('github');
          }}
          selectedProjectId={selectedProjectId}
          onFocus={() => setFocusedApp('github')}
        />
        <ResumeViewer
          isOpen={state.windows.resume}
          onClose={() => {
            handleAppClose('resume');
          }}
          onFocus={() => setFocusedApp('resume')}
        />
        <MacTerminal
          isOpen={state.windows.terminal}
          onClose={() => {
            handleAppClose('terminal');
          }}
          onFocus={() => setFocusedApp('terminal')}
        />
        <ArticlesViewer
          isOpen={state.windows.articles}
          onClose={() => {
            handleAppClose('articles');
          }}
          selectedArticleId={selectedArticleId}
          onFocus={() => setFocusedApp('articles')}
        />
        <SystemAppsViewer
          isOpen={state.windows.systemApps}
          onClose={() => {
            handleAppClose('systemApps');
          }}
          onFocus={() => setFocusedApp('systemApps')}
        />
        <Spotlight
          isOpen={isSpotlightOpen}
          onClose={() => setIsSpotlightOpen(false)}
          actions={{
            openTerminal: () => handleAppOpen('terminal'),
            openNotes: () => handleAppOpen('notes'),
            openNotesSection: s => openNotesSection(s as NotesSection),
            openGitHub: () => handleAppOpen('github'),
            openResume: () => handleAppOpen('resume'),
            openArticles: () => handleAppOpen('articles'),
            openSystemApps: () => handleAppOpen('systemApps'),
            showTutorial: resetTutorial,
            closeAllWindows,
            shuffleBackground,
            openBackgroundPicker: () => {
              setIsSpotlightOpen(false);
              setShowBackgroundPicker(true);
            },
            openProjectById,
          }}
        />
        <WelcomeTour
          open={showTutorial}
          onClose={() => {
            setShowTutorial(false);
            localStorage.setItem('hasCompletedTutorial', 'true');
          }}
          actions={{
            openSpotlight: () => setIsSpotlightOpen(true),
            openMissionControl: () => setIsMissionControlOpen(true),
            openNotes: () => handleAppOpen('notes'),
            openGitHub: () => handleAppOpen('github'),
            closeAll: closeAllWindows,
          }}
        />
        <ShortcutsOverlay open={showShortcuts} onClose={() => setShowShortcuts(false)} />
        <BackgroundPicker
          open={showBackgroundPicker}
          onClose={() => setShowBackgroundPicker(false)}
          backgroundMap={backgroundMap}
          currentKey={currentBg}
          onSelect={selectBackground}
          onShuffle={shuffleBackground}
        />
        <ShortcutHint
          show={showShortcutHint}
          onToggle={show => {
            setShowShortcutHint(show);
            if (typeof window !== 'undefined') {
              localStorage.setItem('showShortcutHint', show.toString());
            }
          }}
        />
        <MissionControl
          isOpen={isMissionControlOpen}
          onClose={() => setIsMissionControlOpen(false)}
          activeApps={activeApps}
          onAppClick={app => handleAppOpen(app as App)}
          onAppClose={app => handleAppClose(app as App)}
        />
        {/* Toast notification */}
        {showToast && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[100] bg-gray-900/95 text-white px-4 py-3 rounded-lg shadow-xl border border-white/10 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4">
            <p className="text-sm">{showToast}</p>
          </div>
        )}
      </div>
    </I18nProvider>
  );
}
