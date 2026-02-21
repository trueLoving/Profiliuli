import { useI18n } from '../../i18n/context';
import type { BackgroundItem } from '../../types';

interface BackgroundPickerProps {
  open: boolean;
  onClose: () => void;
  backgroundMap: Record<string, BackgroundItem>;
  currentKey: string;
  onSelect: (key: string) => void;
  onShuffle: () => void;
}

export default function BackgroundPicker({
  open,
  onClose,
  backgroundMap,
  currentKey,
  onSelect,
  onShuffle,
}: BackgroundPickerProps) {
  const { t } = useI18n();

  if (!open) return null;

  const entries = Object.entries(backgroundMap);
  if (entries.length === 0) return null;

  const handleSelect = (key: string) => {
    onSelect(key);
    onClose();
  };

  const handleShuffle = () => {
    onShuffle();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[75] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('backgroundPicker.title')}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-2xl rounded-xl border border-white/10 bg-gray-900/95 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            {t('backgroundPicker.title')}
          </h2>
          <button
            type="button"
            className="text-gray-400 hover:text-white p-1 rounded"
            onClick={onClose}
            aria-label={t('common.close')}
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {entries.map(([key, item]) => {
              const isSelected = key === currentKey;
              const thumbSrc =
                item.type === 'video'
                  ? item.src.replace(/\.mp4$/i, '.webp')
                  : item.src;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelect(key)}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                    isSelected
                      ? 'border-rose-500 ring-2 ring-rose-500/50'
                      : 'border-transparent hover:border-white/30'
                  }`}
                >
                  {item.type === 'video' ? (
                    <img
                      src={thumbSrc}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.src})` }}
                    />
                  )}
                  {isSelected && (
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-xs bg-rose-500 text-white">
                      {t('backgroundPicker.current')}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleShuffle}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium"
            >
              {t('backgroundPicker.random')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
