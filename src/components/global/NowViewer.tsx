import { FaClock, FaTools, FaBookOpen, FaBullseye, FaBook } from 'react-icons/fa';
import { useUserConfig } from '../../config/hooks';
import { useI18n } from '../../i18n/context';
import type { NowItem } from '../../types';
import DraggableWindow from './DraggableWindow';

interface NowViewerProps {
  isOpen: boolean;
  onClose: () => void;
  onFocus?: () => void;
}

const kindIcon = (kind: NowItem['kind']) => {
  switch (kind) {
    case 'building':
      return <FaTools className="text-green-400" />;
    case 'learning':
      return <FaBookOpen className="text-blue-400" />;
    case 'reading':
      return <FaBook className="text-amber-400" />;
    case 'focus':
      return <FaBullseye className="text-purple-400" />;
    default:
      return <FaClock className="text-gray-400" />;
  }
};

const NowViewer = ({ isOpen, onClose, onFocus }: NowViewerProps) => {
  const userConfig = useUserConfig();
  const { t, locale } = useI18n();
  const now = userConfig.now;

  if (!isOpen) return null;

  const updatedLabel = now?.updatedAt
    ? new Date(now.updatedAt).toLocaleDateString(locale === 'zh-CN' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <DraggableWindow
      title={t('now.title')}
      onClose={onClose}
      initialPosition={{
        x: Math.floor(window.innerWidth * 0.25),
        y: Math.floor(window.innerHeight * 0.22),
      }}
      className="w-[93vw] md:max-w-2xl max-h-[90vh] flex flex-col"
      initialSize={{ width: 640, height: 520 }}
      onFocus={onFocus}
    >
      <div className="flex flex-col flex-grow min-h-0 h-full">
        <div className="overflow-y-auto flex-grow min-h-0 p-4 md:p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-200 mb-2">{t('now.title')}</h2>
            <p className="text-gray-300 mb-1">{now?.headline}</p>
            {updatedLabel && (
              <p className="text-xs text-gray-500">
                {t('now.updatedAt')}: {updatedLabel}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {(now?.items || []).map(item => (
              <div key={item.id} className="bg-gray-800/50 p-4 rounded-xl flex gap-3">
                <div className="mt-1">{kindIcon(item.kind)}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-100">{item.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                      {t(`now.kinds.${item.kind}`)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DraggableWindow>
  );
};

export default NowViewer;
