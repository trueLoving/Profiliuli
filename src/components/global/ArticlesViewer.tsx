import { useEffect, useState } from 'react';
import {
  FaBook,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaLink,
  FaEye,
  FaHeart,
  FaHandPaper,
} from 'react-icons/fa';
import { useUserConfig } from '../../config/hooks';
import { useI18n } from '../../i18n/context';
import type { Article } from '../../types';
import DraggableWindow from './DraggableWindow';
import ReactMarkdown from 'react-markdown';

interface ArticlesViewerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedArticleId?: string;
  onFocus?: () => void;
}

const ArticlesViewer = ({ isOpen, onClose, selectedArticleId, onFocus }: ArticlesViewerProps) => {
  const userConfig = useUserConfig();
  const { t } = useI18n();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showContent, setShowContent] = useState(false);

  const articles = userConfig.articles || [];

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setShowContent(true);
  };

  const handleBackClick = () => {
    setShowContent(false);
    setSelectedArticle(null);
  };

  // Deep-link support: open an article directly when prop changes
  useEffect(() => {
    if (!isOpen) return;
    if (selectedArticleId) {
      const article = articles.find(a => a.id === selectedArticleId) || null;
      if (article) {
        setSelectedArticle(article);
        setShowContent(true);
      }
    }
  }, [selectedArticleId, isOpen, articles]);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(userConfig.name === 'trueLoving' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <DraggableWindow
        title={showContent ? selectedArticle?.title || t('articles.title') : t('articles.title')}
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
                <h2 className="text-2xl font-bold mb-4 text-gray-200">{t('articles.myArticles')}</h2>
                {articles.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <FaBook className="mx-auto mb-4 text-4xl opacity-50" />
                    <p>{t('articles.noArticles')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {articles.map(article => (
                      <div
                        key={article.id}
                        className="bg-gray-800/50 p-4 rounded-lg cursor-pointer transition-colors hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                        onClick={() => handleArticleClick(article)}
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleArticleClick(article);
                          }
                        }}
                        role="button"
                        aria-label={`View article: ${article.title}`}
                      >
                        <h3 className="text-lg font-semibold text-gray-200 mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-3 line-clamp-3">
                          {article.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {article.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                          {article.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-400">
                              +{article.tags.length - 3}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatDate(article.publishDate)}</span>
                          {article.readTime && (
                            <span>{article.readTime} {t('articles.minRead')}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : selectedArticle ? (
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
                  <h1 className="text-3xl font-bold text-gray-200 mb-4">{selectedArticle.title}</h1>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-400">
                    <span>{formatDate(selectedArticle.publishDate)}</span>
                    {selectedArticle.readTime && (
                      <span>• {selectedArticle.readTime} {t('articles.minRead')}</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedArticle.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {selectedArticle.platforms && (
                    <div className="flex flex-wrap gap-4 mb-6">
                      {selectedArticle.platforms.juejin && (
                        <a
                          href={selectedArticle.platforms.juejin.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-[#1e80ff] hover:bg-[#1e80ff]/80 rounded-lg text-white text-sm transition-colors"
                        >
                          <FaExternalLinkAlt size={12} />
                          <span>掘金</span>
                          {selectedArticle.platforms.juejin.views && (
                            <span className="flex items-center gap-1">
                              <FaEye size={12} />
                              {selectedArticle.platforms.juejin.views}
                            </span>
                          )}
                          {selectedArticle.platforms.juejin.likes && (
                            <span className="flex items-center gap-1">
                              <FaHeart size={12} />
                              {selectedArticle.platforms.juejin.likes}
                            </span>
                          )}
                        </a>
                      )}
                      {selectedArticle.platforms.medium && (
                        <a
                          href={selectedArticle.platforms.medium.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 rounded-lg text-white text-sm transition-colors"
                        >
                          <FaExternalLinkAlt size={12} />
                          <span>Medium</span>
                          {selectedArticle.platforms.medium.views && (
                            <span className="flex items-center gap-1">
                              <FaEye size={12} />
                              {selectedArticle.platforms.medium.views}
                            </span>
                          )}
                          {selectedArticle.platforms.medium.claps && (
                            <span className="flex items-center gap-1">
                              <FaHandPaper size={12} />
                              {selectedArticle.platforms.medium.claps}
                            </span>
                          )}
                        </a>
                      )}
                      {selectedArticle.platforms.wechat && (
                        <a
                          href={selectedArticle.platforms.wechat.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-[#07c160] hover:bg-[#07c160]/80 rounded-lg text-white text-sm transition-colors"
                        >
                          <FaExternalLinkAlt size={12} />
                          <span>微信</span>
                          {selectedArticle.platforms.wechat.views && (
                            <span className="flex items-center gap-1">
                              <FaEye size={12} />
                              {selectedArticle.platforms.wechat.views}
                            </span>
                          )}
                          {selectedArticle.platforms.wechat.likes && (
                            <span className="flex items-center gap-1">
                              <FaHeart size={12} />
                              {selectedArticle.platforms.wechat.likes}
                            </span>
                          )}
                        </a>
                      )}
                    </div>
                  )}

                  <div className="prose prose-invert prose-lg max-w-none">
                    <ReactMarkdown
                      components={{
                        code: ({ node, inline, className, children, ...props }) => {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          ) : (
                            <code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm" {...props}>
                              {children}
                            </code>
                          );
                        },
                        h1: ({ children }) => (
                          <h1 className="text-3xl font-bold text-gray-200 mt-8 mb-4">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-2xl font-bold text-gray-200 mt-6 mb-3">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-xl font-semibold text-gray-200 mt-4 mb-2">{children}</h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-gray-300">{children}</li>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-400 my-4">
                            {children}
                          </blockquote>
                        ),
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {selectedArticle.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </DraggableWindow>
    </>
  );
};

export default ArticlesViewer;
