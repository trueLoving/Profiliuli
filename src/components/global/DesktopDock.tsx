import { useState, useEffect, useRef } from 'react';
import {
  BsGithub,
  BsFilePdf,
  BsStickyFill,
  BsLinkedin,
  BsBook,
  BsClock,
} from 'react-icons/bs';
import { IoIosCall, IoIosMail } from 'react-icons/io';
import { FaLink } from 'react-icons/fa';
import ResumeViewer from './ResumeViewer';
import { useUserConfig } from '../../config/hooks';
import { RiTerminalFill } from 'react-icons/ri';
import { useI18n } from '../../i18n/context';
import type { AppId } from '../../types';

interface DesktopDockProps {
  onTerminalClick: () => void;
  onAboutClick: () => void;
  onGitHubClick: () => void;
  onHandbookClick: () => void;
  onNowClick: () => void;
  activeApps: {
    terminal: boolean;
    about: boolean;
    github: boolean;
    resume: boolean;
    spotify: boolean;
    handbook: boolean;
    now: boolean;
    systemApps: boolean;
  };
  focusedApp?: AppId | null;
}

const DesktopDock = ({
  onTerminalClick,
  onAboutClick,
  onGitHubClick,
  onHandbookClick,
  onNowClick,
  activeApps,
  focusedApp,
}: DesktopDockProps) => {
  const { t } = useI18n();
  const userConfig = useUserConfig();
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [showResume, setShowResume] = useState(false);
  const [showLinksPopup, setShowLinksPopup] = useState(false);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const linksPopupRef = useRef<HTMLDivElement>(null);

  const handleLinksClick = () => {
    setShowLinksPopup(!showLinksPopup);
  };

  const handleResumeClick = () => {
    setShowResume(true);
  };

  const handleCloseResume = () => {
    setShowResume(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (linksPopupRef.current && !linksPopupRef.current.contains(event.target as Node)) {
        setShowLinksPopup(false);
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (dockRef.current) {
        const rect = dockRef.current.getBoundingClientRect();
        if (e.clientY >= rect.top - 50 && e.clientY <= rect.bottom + 50) {
          setMouseX(e.clientX);
        } else {
          setMouseX(null);
        }
      }
    };

    const handleMouseLeave = () => {
      setMouseX(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const Tooltip = ({ text }: { text: string }) => (
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
      {text}
    </div>
  );

  const LinksPopup = () => (
    <div
      ref={linksPopupRef}
      className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800/90 w-30 backdrop-blur-sm rounded-lg p-4 shadow-xl"
    >
      <div className="grid grid-cols-1 gap-y-2">
        {userConfig.social.linkedin && (
          <a
            href={userConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <BsLinkedin size={20} />
            <span>{t('toolbar.linkedin')}</span>
          </a>
        )}
        <a
          href={userConfig.social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <BsGithub size={20} />
          <span>{t('toolbar.github')}</span>
        </a>
        {userConfig.social.medium && (
          <a
            href={userConfig.social.medium}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <span className="text-lg font-bold">M</span>
            <span>{t('toolbar.medium')}</span>
          </a>
        )}
        {userConfig.social.juejin && (
          <a
            href={userConfig.social.juejin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <span className="text-lg">掘</span>
            <span>{t('toolbar.juejin')}</span>
          </a>
        )}
        <a
          href={`mailto:${userConfig.contact.email}`}
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <IoIosMail size={20} />
          <span>{t('toolbar.email')}</span>
        </a>
        {userConfig.contact.phone && (
          <a
            href={`tel:${userConfig.contact.phone}`}
            className="flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <IoIosCall size={20} />
            <span>Call</span>
          </a>
        )}
      </div>
    </div>
  );

  const icons = [
    {
      id: 'github',
      label: t('dock.github'),
      onClick: onGitHubClick,
      icon: BsGithub,
      color: 'from-black to-black/60',
      active: activeApps.github,
      isFocused: focusedApp === 'github',
    },
    {
      id: 'about',
      label: t('dock.about'),
      onClick: onAboutClick,
      icon: BsStickyFill,
      color: 'from-yellow-600 to-yellow-400',
      active: activeApps.about,
      isFocused: focusedApp === 'about',
    },
    {
      id: 'handbook',
      label: t('dock.handbook'),
      onClick: onHandbookClick,
      icon: BsBook,
      color: 'from-blue-600 to-blue-400',
      active: activeApps.handbook,
      isFocused: focusedApp === 'handbook',
    },
    {
      id: 'now',
      label: t('dock.now'),
      onClick: onNowClick,
      icon: BsClock,
      color: 'from-emerald-600 to-emerald-400',
      active: activeApps.now,
      isFocused: focusedApp === 'now',
    },
    {
      id: 'resume',
      label: t('dock.resume'),
      onClick: handleResumeClick,
      icon: BsFilePdf,
      color: 'from-red-600 to-red-400',
      active: activeApps.resume,
      isFocused: focusedApp === 'resume',
    },
    {
      id: 'links',
      label: t('dock.links'),
      onClick: handleLinksClick,
      icon: FaLink,
      color: 'from-purple-600 to-purple-400',
      active: false,
      isFocused: false,
    },
    {
      id: 'terminal',
      label: t('dock.terminal'),
      onClick: onTerminalClick,
      icon: RiTerminalFill,
      color: 'from-black to-black/60',
      active: activeApps.terminal,
      isFocused: focusedApp === 'terminal',
    },
  ];

  return (
    <>
      <nav
        aria-label="Dock"
        className="fixed bottom-0 left-0 right-0 hidden md:flex justify-center pb-4 z-100"
      >
        <div ref={dockRef} className="bg-gray-600/50 backdrop-blur-sm rounded-2xl p-2 shadow-xl">
          <div className="flex space-x-2" role="menubar">
            {icons.map(item => {
              const Icon = item.icon;
              const scale = 1;
              void mouseX;
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  aria-label={item.label}
                  aria-haspopup={item.id === 'links' ? 'menu' : undefined}
                  aria-expanded={item.id === 'links' ? showLinksPopup : undefined}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      item.onClick();
                    }
                  }}
                  onMouseEnter={() => setHoveredIcon(item.id)}
                  onMouseLeave={() => setHoveredIcon(null)}
                  className="relative group"
                  style={{
                    transform: `scale(${scale})`,
                    transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  <div
                    className={`relative w-12 h-12 bg-gradient-to-t ${item.color} rounded-xl flex items-center justify-center shadow-lg active:scale-95 ${
                      item.isFocused
                        ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-600/50'
                        : item.active
                          ? 'ring-2 ring-white/50'
                          : ''
                    }`}
                  >
                    <Icon size={item.id === 'links' ? 30 : 35} className="text-white" />
                    {item.active && !item.isFocused && (
                      <span
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  {hoveredIcon === item.id && <Tooltip text={item.label} />}
                  {item.id === 'links' && showLinksPopup && <LinksPopup />}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <ResumeViewer isOpen={showResume} onClose={handleCloseResume} />
    </>
  );
};

export default DesktopDock;
