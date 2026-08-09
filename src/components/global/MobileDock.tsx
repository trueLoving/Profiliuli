import { BsGithub, BsSpotify, BsLinkedin, BsGrid3X3, BsBook, BsClock } from 'react-icons/bs';
import { IoIosMail, IoIosCall } from 'react-icons/io';
import { useUserConfig } from '../../config/hooks';
import { BsStickyFill } from 'react-icons/bs';
import { RiTerminalFill } from 'react-icons/ri';
import { BsFilePdf } from 'react-icons/bs';
import { useI18n } from '../../i18n/context';

interface MobileDockProps {
  onGitHubClick: () => void;
  onAboutClick: () => void;
  onHandbookClick: () => void;
  onNowClick: () => void;
  onResumeClick: () => void;
  onTerminalClick: () => void;
  onSystemAppsClick: () => void;
}

export default function MobileDock({
  onGitHubClick,
  onAboutClick,
  onHandbookClick,
  onNowClick,
  onResumeClick,
  onTerminalClick,
  onSystemAppsClick,
}: MobileDockProps) {
  const userConfig = useUserConfig();
  const { t } = useI18n();

  const handleEmailClick = () => {
    window.location.href = `mailto:${userConfig.contact.email}`;
  };

  const handleSpotifyClick = () => {
    window.open(`https://open.spotify.com/playlist/${userConfig.spotify.playlistId}`, '_blank');
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 md:hidden flex flex-col items-center z-10 space-y-2"
      role="navigation"
      aria-label="Mobile dock"
    >
      <div
        className="mx-4 mb-4 p-3 rounded-3xl space-x-3 flex justify-around items-center max-w-[480px] mx-auto overflow-x-auto"
        role="toolbar"
        aria-label="Apps"
      >
        <button
          onClick={onGitHubClick}
          aria-label={t('dock.github')}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
            <BsGithub size={40} className="text-white" />
          </div>
        </button>
        <button
          onClick={onAboutClick}
          aria-label={t('dock.about')}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="w-16 h-16 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-2xl flex items-center justify-center">
            <BsStickyFill size={40} className="text-white" />
          </div>
        </button>
        <button
          onClick={onHandbookClick}
          aria-label={t('dock.handbook')}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="w-16 h-16 bg-gradient-to-t from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center">
            <BsBook size={40} className="text-white" />
          </div>
        </button>
        <button
          onClick={onNowClick}
          aria-label={t('dock.now')}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="w-16 h-16 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-2xl flex items-center justify-center">
            <BsClock size={40} className="text-white" />
          </div>
        </button>
        <button
          onClick={onResumeClick}
          aria-label={t('dock.resume')}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="w-16 h-16 bg-gradient-to-t from-red-600 to-red-400 rounded-2xl flex items-center justify-center">
            <BsFilePdf size={40} className="text-white" />
          </div>
        </button>
        <button
          onClick={onTerminalClick}
          aria-label={t('dock.terminal')}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
            <RiTerminalFill size={40} className="text-white" />
          </div>
        </button>
        <button
          onClick={onSystemAppsClick}
          aria-label={t('dock.systemApps')}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="w-16 h-16 bg-gradient-to-t from-slate-600 to-slate-400 rounded-2xl flex items-center justify-center">
            <BsGrid3X3 size={40} className="text-white" />
          </div>
        </button>
      </div>

      <div
        className="mx-4 mb-4 p-3 bg-gradient-to-t from-gray-700 to-gray-800 backdrop-blur-xl rounded-3xl space-x-4 flex justify-around items-center max-w-[400px] mx-auto"
        role="toolbar"
        aria-label="Contact shortcuts"
      >
        {userConfig.contact.phone && (
          <a
            href={`tel:${userConfig.contact.phone}`}
            className="flex flex-col items-center"
            aria-label={`Call ${userConfig.contact.phone}`}
          >
            <div className="w-16 h-16 bg-gradient-to-t from-green-600 to-green-400 rounded-2xl flex items-center justify-center">
              <IoIosCall size={40} className="text-white" />
            </div>
          </a>
        )}

        <button
          onClick={handleEmailClick}
          aria-label={`Email ${userConfig.contact.email}`}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="w-16 h-16 bg-gradient-to-t from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center">
            <IoIosMail size={40} className="text-white" />
          </div>
        </button>

        {userConfig.social.linkedin && (
          <a
            href={userConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
            aria-label="LinkedIn"
          >
            <div className="w-16 h-16 bg-gradient-to-t from-blue-700 to-blue-500 rounded-2xl flex items-center justify-center">
              <BsLinkedin size={40} className="text-white" />
            </div>
          </a>
        )}

        <button
          onClick={handleSpotifyClick}
          aria-label="Spotify"
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="w-16 h-16 bg-gradient-to-t from-green-700 to-green-500 rounded-2xl flex items-center justify-center">
            <BsSpotify size={40} className="text-white" />
          </div>
        </button>
      </div>
    </div>
  );
}
