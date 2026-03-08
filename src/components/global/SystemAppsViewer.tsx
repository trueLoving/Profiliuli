import { useState, useMemo, Suspense, lazy } from 'react';
import { BsCalculator } from 'react-icons/bs';
import { useI18n } from '../../i18n/context';
import DraggableWindow from './DraggableWindow';

/** Lazy loaders: only run when user opens the app */
const appLoaders: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  calculator: () => import('./apps/CalculatorApp'),
};

const lazyCache: Record<string, React.LazyExoticComponent<React.ComponentType>> = {};

function getLazyApp(id: string): React.LazyExoticComponent<React.ComponentType> | null {
  if (!appLoaders[id]) return null;
  if (!lazyCache[id]) {
    lazyCache[id] = lazy(appLoaders[id]);
  }
  return lazyCache[id];
}

const BUILTIN_APPS: { id: string; nameKey: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'calculator', nameKey: 'systemApps.calculator', icon: BsCalculator },
];

interface SystemAppsViewerProps {
  isOpen: boolean;
  onClose: () => void;
  onFocus?: () => void;
}

export default function SystemAppsViewer({ isOpen, onClose, onFocus }: SystemAppsViewerProps) {
  const { t } = useI18n();
  const [openedAppId, setOpenedAppId] = useState<string | null>(null);

  const LazyApp = openedAppId ? getLazyApp(openedAppId) : null;

  const title = useMemo(() => {
    if (openedAppId) {
      const app = BUILTIN_APPS.find(a => a.id === openedAppId);
      return app ? t(app.nameKey) : t('systemApps.title');
    }
    return t('systemApps.title');
  }, [openedAppId, t]);

  const handleBack = () => setOpenedAppId(null);

  if (!isOpen) return null;

  return (
    <DraggableWindow
      title={title}
      onClose={openedAppId ? handleBack : onClose}
      onFocus={onFocus}
      initialSize={{ width: 360, height: 480 }}
      initialPosition={{ x: 120, y: 80 }}
      className="min-w-[320px] min-h-[400px]"
    >
      <div className="flex flex-col h-full min-h-0 overflow-hidden">
        {!openedAppId ? (
          <>
            <p className="text-gray-400 text-sm mb-3 flex-shrink-0">{t('systemApps.subtitle')}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1 min-h-0 content-start overflow-auto">
              {BUILTIN_APPS.map(app => {
                const Icon = app.icon;
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setOpenedAppId(app.id)}
                    className="flex flex-col items-center justify-center gap-2 min-h-[100px] p-4 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label={t(app.nameKey)}
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-t from-gray-600 to-gray-500 flex items-center justify-center flex-shrink-0">
                      <Icon className="text-white w-8 h-8 sm:w-9 sm:h-9" />
                    </div>
                    <span className="text-gray-200 text-sm font-medium truncate max-w-full">{t(app.nameKey)}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleBack}
                className="text-gray-400 hover:text-white text-sm px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                ← {t('common.back')}
              </button>
            </div>
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              {LazyApp && (
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center flex-1 text-gray-400">
                      {t('common.loading')}
                    </div>
                  }
                >
                  <LazyApp />
                </Suspense>
              )}
            </div>
          </>
        )}
      </div>
    </DraggableWindow>
  );
}
