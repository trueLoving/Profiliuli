import { useState, useEffect, useRef } from 'react';
import { MdWifi } from 'react-icons/md';
import { FaApple, FaGithub, FaLinkedin, FaEnvelope, FaWindowRestore } from 'react-icons/fa';
import {
  IoSearchSharp,
  IoBatteryHalfOutline,
  IoCellular,
  IoDocumentText,
  IoCodeSlash,
  IoMail,
  IoCall,
  IoHelpCircle,
  IoLanguage,
  IoChevronDown,
} from 'react-icons/io5';
import { VscVscode } from 'react-icons/vsc';
import { useUserConfig } from '../../config/hooks';
import { useI18n } from '../../i18n/context';
import type { Locale } from '../../i18n/types';

type MenuItem = {
  label: string;
  icon?: React.ReactNode;
  action?: () => void;
  submenu?: MenuItem[];
};

interface MacToolbarProps {
  onShowTutorial?: () => void;
  onOpenSpotlight?: () => void;
  onOpenMissionControl?: () => void;
  onToggleShortcuts?: () => void;
  onCloseAllWindows?: () => void;
  onShuffleBackground?: () => void;
  onOpenAdmin?: () => void;
  reducedMotion?: boolean;
  onToggleReducedMotion?: () => void;
  onLanguageSwitch?: (locale: Locale) => void;
  showShortcutHint?: boolean;
  onToggleShortcutHint?: () => void;
}

export default function MacToolbar({
  onShowTutorial,
  onOpenSpotlight,
  onOpenMissionControl,
  onToggleShortcuts,
  onCloseAllWindows,
  onShuffleBackground,
  onOpenAdmin,
  reducedMotion = false,
  onToggleReducedMotion,
  onLanguageSwitch,
  showShortcutHint = true,
  onToggleShortcutHint,
}: MacToolbarProps) {
  const { locale, t, setLocale: setI18nLocale } = useI18n();
  const userConfig = useUserConfig();
  // 初始化为 null，避免服务器端和客户端时间不一致导致的 hydration 错误
  // 客户端挂载后再设置实际时间
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showSignature, setShowSignature] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  // 客户端挂载后设置时间，避免 hydration mismatch
  useEffect(() => {
    setCurrentDateTime(new Date());
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer as unknown as NodeJS.Timeout);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatMacDate = (date: Date) => {
    const localeStr = locale === 'zh-CN' ? 'zh-CN' : 'en-US';
    const weekday = date.toLocaleString(localeStr, { weekday: 'short' });
    const month = date.toLocaleString(localeStr, { month: 'short' });
    const day = date.getDate();
    const hour = date.toLocaleString(localeStr, {
      hour: 'numeric',
      hour12: true,
    });
    const minute = date.getMinutes().toString().padStart(2, '0');
    const period = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${weekday} ${month} ${day} ${hour.replace(/\s?[AP]M/, '')}:${minute} ${period}`;
  };

  const formatIPhoneTime = (date: Date) => {
    let hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, '0');

    hour = hour % 12;
    hour = hour ? hour : 12;

    return `${hour}:${minute}`;
  };

  const handleVSCodeClick = () => {
    window.location.href = 'vscode:/';
  };

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleAction = (action?: () => void) => {
    if (action) {
      action();
      setActiveMenu(null);
    }
  };

  const handleLanguageSwitch = (newLocale: Locale) => {
    setI18nLocale(newLocale);
    setShowLanguageMenu(false);
    // Notify parent to show toast
    onLanguageSwitch?.(newLocale);
  };

  const menus: Record<string, MenuItem[]> = {
    [t('toolbar.file')]: [
      {
        label: t('toolbar.resumePdf'),
        icon: <IoDocumentText size={16} />,
        action: () => window.open(userConfig.resume.url, '_blank'),
      },
      {
        label: t('toolbar.projectsGithub'),
        icon: <IoCodeSlash size={16} />,
        action: () => window.open(userConfig.social.github, '_blank'),
      },
      {
        label: t('toolbar.adminDashboard'),
        icon: <FaWindowRestore size={16} />,
        action: () => {
          if (onOpenAdmin) {
            onOpenAdmin();
          } else {
            window.open('/admin', '_blank');
          }
        },
      },
    ],
    [t('toolbar.view')]: [
      {
        label: t('toolbar.spotlightSearch'),
        icon: <IoSearchSharp size={16} />,
        action: () => onOpenSpotlight?.(),
      },
      {
        label: t('toolbar.missionControl'),
        icon: <FaWindowRestore size={16} />,
        action: () => onOpenMissionControl?.(),
      },
      {
        label: t('toolbar.shortcutsOverlay'),
        icon: <IoHelpCircle size={16} />,
        action: () => onToggleShortcuts?.(),
      },
      {
        label: t('toolbar.resetTutorial'),
        icon: <IoHelpCircle size={16} />,
        action: () => onShowTutorial?.(),
      },
      ...(onToggleReducedMotion
        ? [
            {
              label: reducedMotion ? t('toolbar.enableAnimations') : t('toolbar.reduceMotion'),
              icon: <IoHelpCircle size={16} />,
              action: () => onToggleReducedMotion?.(),
            },
          ]
        : []),
      ...(onToggleShortcutHint
        ? [
            {
              label: showShortcutHint
                ? t('toolbar.hideShortcutHints')
                : t('toolbar.showShortcutHints'),
              icon: <IoHelpCircle size={16} />,
              action: () => onToggleShortcutHint?.(),
            },
          ]
        : []),
    ],
    [t('toolbar.window')]: [
      {
        label: t('toolbar.closeAllWindows'),
        icon: <IoDocumentText size={16} />,
        action: () => onCloseAllWindows?.(),
      },
      {
        label: t('toolbar.shuffleBackground'),
        icon: <IoDocumentText size={16} />,
        action: () => onShuffleBackground?.(),
      },
    ],
    [t('toolbar.go')]: [
      {
        label: t('toolbar.github'),
        icon: <FaGithub size={16} />,
        action: () => window.open(userConfig.social.github, '_blank'),
      },
      ...(userConfig.social.linkedin
        ? [
            {
              label: t('toolbar.linkedin'),
              icon: <FaLinkedin size={16} />,
              action: () => window.open(userConfig.social.linkedin!, '_blank'),
            },
          ]
        : []),
      ...(userConfig.social.medium
        ? [
            {
              label: t('toolbar.medium'),
              icon: <span className="font-bold">M</span>,
              action: () => window.open(userConfig.social.medium!, '_blank'),
            },
          ]
        : []),
      ...(userConfig.social.juejin
        ? [
            {
              label: t('toolbar.juejin'),
              icon: <span>掘</span>,
              action: () => window.open(userConfig.social.juejin!, '_blank'),
            },
          ]
        : []),
      {
        label: t('toolbar.email'),
        icon: <FaEnvelope size={16} />,
        action: () => window.open(`mailto:${userConfig.contact.email}`),
      },
    ],
    [t('toolbar.edit')]: [
      {
        label: t('toolbar.copyEmail'),
        icon: <IoMail size={16} />,
        action: () => {
          navigator.clipboard.writeText(userConfig.contact.email);
          alert(t('toolbar.emailCopied'));
        },
      },
      ...(userConfig.contact.phone
        ? [
            {
              label: t('toolbar.copyPhone'),
              icon: <IoCall size={16} />,
              action: () => {
                navigator.clipboard.writeText(userConfig.contact.phone!);
                alert(t('toolbar.phoneCopied'));
              },
            },
          ]
        : []),
    ],
    [t('toolbar.help')]: [
      {
        label: t('toolbar.keyboardShortcuts'),
        icon: <IoHelpCircle size={16} />,
        action: () => onToggleShortcuts?.(),
      },
    ],
  };

  const renderMenu = (menuItems: MenuItem[]) => (
    <div
      className="absolute top-full left-0 mt-1 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl py-1 min-w-[200px]"
      role="menu"
    >
      {menuItems.map((item, index) => (
        <div key={index}>
          <button
            onClick={() => handleAction(item.action)}
            role="menuitem"
            className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700/50 flex items-center gap-2"
          >
            {item.icon}
            {item.label}
          </button>
          {item.submenu && (
            <div
              className="absolute left-full top-0 ml-1 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl py-1 min-w-[200px]"
              role="menu"
            >
              {item.submenu.map((subItem, subIndex) => (
                <button
                  key={subIndex}
                  onClick={() => handleAction(subItem.action)}
                  role="menuitem"
                  className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700/50 flex items-center gap-2"
                >
                  {subItem.icon}
                  {subItem.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-50 md:hidden bg-transparent text-white h-12 px-8 flex items-center justify-between text-base font-medium">
        <span className="font-semibold" suppressHydrationWarning>
          {currentDateTime ? formatIPhoneTime(currentDateTime) : '--:--'}
        </span>
        <div className="flex items-center gap-1.5">
          <IoCellular size={20} />
          <MdWifi size={20} />
          <IoBatteryHalfOutline size={24} />
        </div>
      </div>

      <div
        className="sticky top-0 z-50 hidden md:flex bg-black/20 backdrop-blur-md text-white h-6 px-4 items-center justify-between text-sm"
        role="menubar"
        aria-label="Application menu bar"
      >
        <div className="flex items-center space-x-4" ref={menuRef}>
          <FaApple size={16} />
          <div className="relative">
            <span
              className="font-semibold hover:text-gray-300 transition-colors cursor-pointer"
              onMouseEnter={() => setShowSignature(true)}
              onMouseLeave={() => setShowSignature(false)}
            >
              {userConfig.name}
            </span>
            {showSignature && (
              <div
                className="absolute top-full left-0 mt-2 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl z-[100] border border-white/20 min-w-[200px]"
                style={{
                  animation: 'fadeInUp 0.3s ease-out',
                }}
              >
                <style>{`
                  @keyframes fadeInUp {
                    from {
                      opacity: 0;
                      transform: translateY(-10px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                `}</style>
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <img
                      src="/me.webp"
                      alt={`${userConfig.name}'s Avatar`}
                      className="relative w-24 h-24 rounded-full object-cover ring-4 ring-white/50 shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 text-sm">{userConfig.name}</h3>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{userConfig.role}</p>
                    <div className="mt-3 pt-3 border-t border-gray-200/50">
                      <a
                        href={userConfig.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium"
                        onClick={e => e.stopPropagation()}
                      >
                        <FaGithub size={12} />
                        {t('toolbar.viewGitHub')}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {Object.entries(menus).map(([menu, items]) => (
            <div key={menu} className="relative">
              <button
                className="cursor-pointer hover:text-gray-300 transition-colors"
                onClick={() => handleMenuClick(menu)}
                aria-haspopup="menu"
                aria-expanded={activeMenu === menu}
                aria-controls={`menu-${menu}`}
                role="menuitem"
              >
                {menu}
              </button>
              {activeMenu === menu && <div id={`menu-${menu}`}>{renderMenu(items)}</div>}
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <VscVscode
            size={16}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleVSCodeClick}
            title={t('toolbar.openInVSCode')}
          />
          <MdWifi size={16} />
          <IoSearchSharp
            size={16}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onOpenSpotlight?.()}
            title={t('toolbar.search')}
            role="button"
            aria-label="Open search"
          />
          <div className="relative" ref={languageMenuRef}>
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              title={t('language.switch')}
              aria-label={t('language.switch')}
            >
              <IoLanguage size={16} />
              <span className="text-xs">{locale === 'zh-CN' ? '中文' : 'EN'}</span>
              <IoChevronDown size={12} className={showLanguageMenu ? 'rotate-180' : ''} />
            </button>
            {showLanguageMenu && (
              <div
                className="absolute top-full right-0 mt-1 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl py-1 min-w-[120px]"
                role="menu"
              >
                <button
                  onClick={() => handleLanguageSwitch('en')}
                  role="menuitem"
                  className={`w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700/50 flex items-center gap-2 ${locale === 'en' ? 'bg-gray-700/50' : ''}`}
                >
                  {t('language.english')}
                  {locale === 'en' && <span className="ml-auto">✓</span>}
                </button>
                <button
                  onClick={() => handleLanguageSwitch('zh-CN')}
                  role="menuitem"
                  className={`w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700/50 flex items-center gap-2 ${locale === 'zh-CN' ? 'bg-gray-700/50' : ''}`}
                >
                  {t('language.chinese')}
                  {locale === 'zh-CN' && <span className="ml-auto">✓</span>}
                </button>
              </div>
            )}
          </div>
          <span className="cursor-default" suppressHydrationWarning>
            {currentDateTime ? formatMacDate(currentDateTime) : '-- -- -- --:-- --'}
          </span>
        </div>
      </div>
    </>
  );
}
