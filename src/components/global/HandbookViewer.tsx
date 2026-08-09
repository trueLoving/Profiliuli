import { useEffect, useMemo, useState } from 'react';
import {
  FaBook,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaEye,
  FaHeart,
  FaHandPaper,
} from 'react-icons/fa';
import { useUserConfig } from '../../config/hooks';
import { useI18n } from '../../i18n/context';
import type { HandbookCategory, HandbookEntry } from '../../types';
import DraggableWindow from './DraggableWindow';
import MarkdownRenderer from './MarkdownRenderer';

interface HandbookViewerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEntryId?: string;
  onFocus?: () => void;
}

const CATEGORIES: HandbookCategory[] = [
  'engineering',
  'architecture',
  'product-thinking',
  'decision-records',
  'lessons-learned',
  'philosophy',
  'articles',
];

const HandbookViewer = ({ isOpen, onClose, selectedEntryId, onFocus }: HandbookViewerProps) => {
  const userConfig = useUserConfig();
  const { t, locale } = useI18n();
  const [selectedEntry, setSelectedEntry] = useState<HandbookEntry | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [activeCategory, setActiveCategory] = useState<HandbookCategory | 'all'>('all');

  const entries = userConfig.handbook || userConfig.articles || [];

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return entries;
    return entries.filter(entry => entry.category === activeCategory);
  }, [entries, activeCategory]);

  const handleEntryClick = (entry: HandbookEntry) => {
    setSelectedEntry(entry);
    setShowContent(true);
  };

  const handleBackClick = () => {
    setShowContent(false);
    setSelectedEntry(null);
  };

  useEffect(() => {
    if (!isOpen) return;
    if (selectedEntryId) {
      const entry = entries.find(a => a.id === selectedEntryId) || null;
      if (entry) {
        setSelectedEntry(entry);
        setShowContent(true);
      }
    }
  }, [selectedEntryId, isOpen, entries]);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'zh-CN' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <DraggableWindow
      title={showContent ? selectedEntry?.title || t('handbook.title') : t('handbook.title')}
      onClose={onClose}
      initialPosition={{
        x: Math.floor(window.innerWidth * 0.2),
        y: Math.floor(window.innerHeight * 0.2),
      }}
      className="w-[93vw] md:max-w-4xl max-h-[90vh] flex flex-col"
      initialSize={{ width: 900, height: 700 }}
      onFocus={onFocus}
    >
      <div className="flex flex-col flex-grow min-h-0 h-full">
        <div className="overflow-y-auto flex-grow min-h-0 p-4 md:p-6">
          {!showContent ? (
            <>
              <h2 className="text-2xl font-bold mb-2 text-gray-200">{t('handbook.myHandbook')}</h2>
              <p className="text-gray-400 mb-4">{t('handbook.subtitle')}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1 rounded-full text-xs ${
                    activeCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {t('handbook.categories.all')}
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs ${
                      activeCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {t(`handbook.categories.${cat}`)}
                  </button>
                ))}
              </div>
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FaBook className="mx-auto mb-4 text-4xl opacity-50" />
                  <p>{t('handbook.noEntries')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map(entry => (
                    <div
                      key={entry.id}
                      className="bg-gray-800/50 p-4 rounded-lg cursor-pointer transition-colors hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                      onClick={() => handleEntryClick(entry)}
                      tabIndex={0}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleEntryClick(entry);
                        }
                      }}
                      role="button"
                      aria-label={`View handbook entry: ${entry.title}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                          {t(`handbook.categories.${entry.category}`)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-200 mb-2 line-clamp-2">
                        {entry.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-3">{entry.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {entry.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(entry.publishDate)}</span>
                        {entry.readTime && (
                          <span>
                            {entry.readTime} {t('handbook.minRead')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : selectedEntry ? (
            <div className="space-y-6">
              <button
                onClick={handleBackClick}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4"
                aria-label={t('common.back')}
              >
                <FaChevronLeft />
                <span>{t('common.back')}</span>
              </button>

              <div className="bg-gray-800/50 p-6 rounded-xl">
                <div className="mb-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                    {t(`handbook.categories.${selectedEntry.category}`)}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-200 mb-4">{selectedEntry.title}</h1>

                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-400">
                  <span>{formatDate(selectedEntry.publishDate)}</span>
                  {selectedEntry.readTime && (
                    <span>
                      • {selectedEntry.readTime} {t('handbook.minRead')}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedEntry.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {selectedEntry.platforms && (
                  <div className="flex flex-wrap gap-4 mb-6">
                    {selectedEntry.platforms.juejin && (
                      <a
                        href={selectedEntry.platforms.juejin.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#1e80ff] hover:bg-[#1e80ff]/80 rounded-lg text-white text-sm transition-colors"
                      >
                        <FaExternalLinkAlt size={12} />
                        <span>掘金</span>
                        {selectedEntry.platforms.juejin.views && (
                          <span className="flex items-center gap-1">
                            <FaEye size={12} />
                            {selectedEntry.platforms.juejin.views}
                          </span>
                        )}
                        {selectedEntry.platforms.juejin.likes && (
                          <span className="flex items-center gap-1">
                            <FaHeart size={12} />
                            {selectedEntry.platforms.juejin.likes}
                          </span>
                        )}
                      </a>
                    )}
                    {selectedEntry.platforms.medium && (
                      <a
                        href={selectedEntry.platforms.medium.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 rounded-lg text-white text-sm transition-colors"
                      >
                        <FaExternalLinkAlt size={12} />
                        <span>Medium</span>
                        {selectedEntry.platforms.medium.views && (
                          <span className="flex items-center gap-1">
                            <FaEye size={12} />
                            {selectedEntry.platforms.medium.views}
                          </span>
                        )}
                        {selectedEntry.platforms.medium.claps && (
                          <span className="flex items-center gap-1">
                            <FaHandPaper size={12} />
                            {selectedEntry.platforms.medium.claps}
                          </span>
                        )}
                      </a>
                    )}
                    {selectedEntry.platforms.wechat && (
                      <a
                        href={selectedEntry.platforms.wechat.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#07c160] hover:bg-[#07c160]/80 rounded-lg text-white text-sm transition-colors"
                      >
                        <FaExternalLinkAlt size={12} />
                        <span>微信</span>
                      </a>
                    )}
                  </div>
                )}

                <MarkdownRenderer content={selectedEntry.content} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </DraggableWindow>
  );
};

export default HandbookViewer;
