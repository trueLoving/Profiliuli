import React, { useEffect } from 'react';
import { BsGithub, BsStickyFill, BsFilePdf, BsBook, BsGrid3X3, BsClock } from 'react-icons/bs';
import { RiTerminalFill } from 'react-icons/ri';
import { BsSpotify } from 'react-icons/bs';
import type { AppId } from '../../types';
import { useI18n } from '../../i18n/context';

interface MissionControlProps {
  isOpen: boolean;
  onClose: () => void;
  activeApps: Record<AppId, boolean>;
  onAppClick: (app: AppId) => void;
  onAppClose: (app: AppId) => void;
}

export default function MissionControl({
  isOpen,
  onClose,
  activeApps,
  onAppClick,
  onAppClose,
}: MissionControlProps) {
  const { t } = useI18n();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const apps: Array<{
    id: AppId;
    name: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    color: string;
    active: boolean;
  }> = [
    {
      id: 'github',
      name: t('dock.github'),
      icon: BsGithub,
      color: 'from-black to-black/60',
      active: activeApps.github,
    },
    {
      id: 'about',
      name: t('dock.about'),
      icon: BsStickyFill,
      color: 'from-yellow-600 to-yellow-400',
      active: activeApps.about,
    },
    {
      id: 'handbook',
      name: t('dock.handbook'),
      icon: BsBook,
      color: 'from-blue-600 to-blue-400',
      active: activeApps.handbook,
    },
    {
      id: 'now',
      name: t('dock.now'),
      icon: BsClock,
      color: 'from-emerald-600 to-emerald-400',
      active: activeApps.now,
    },
    {
      id: 'terminal',
      name: t('dock.terminal'),
      icon: RiTerminalFill,
      color: 'from-black to-black/60',
      active: activeApps.terminal,
    },
    {
      id: 'resume',
      name: t('dock.resume'),
      icon: BsFilePdf,
      color: 'from-red-600 to-red-400',
      active: activeApps.resume,
    },
    {
      id: 'systemApps',
      name: t('dock.systemApps'),
      icon: BsGrid3X3,
      color: 'from-slate-600 to-slate-400',
      active: activeApps.systemApps,
    },
    {
      id: 'spotify',
      name: 'Spotify',
      icon: BsSpotify,
      color: 'from-green-600 to-green-400',
      active: activeApps.spotify,
    },
  ];

  const activeWindows = apps.filter(app => app.active);

  const handleAppClick = (app: (typeof apps)[0]) => {
    onAppClick(app.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[96]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative h-full flex items-center justify-center p-6">
        <div className="w-full max-w-5xl">
          <h2 className="text-white text-2xl font-semibold mb-6 text-center">
            {t('toolbar.missionControl')}
          </h2>
          {activeWindows.length === 0 ? (
            <p className="text-center text-gray-400">No open windows</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {activeWindows.map(app => {
                const Icon = app.icon;
                return (
                  <div
                    key={app.id}
                    className="relative group bg-gray-800/80 border border-white/10 rounded-2xl p-4 hover:border-white/30 transition-colors"
                  >
                    <button
                      type="button"
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 text-white text-xs opacity-0 group-hover:opacity-100"
                      onClick={e => {
                        e.stopPropagation();
                        onAppClose(app.id);
                      }}
                      aria-label={`Close ${app.name}`}
                    >
                      ×
                    </button>
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => handleAppClick(app)}
                    >
                      <div
                        className={`w-14 h-14 mb-3 bg-gradient-to-t ${app.color} rounded-xl flex items-center justify-center`}
                      >
                        <Icon size={28} className="text-white" />
                      </div>
                      <div className="text-white font-medium">{app.name}</div>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
