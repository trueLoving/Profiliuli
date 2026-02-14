import { useEffect, useState } from 'react';
import {
  FaGithub,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaLink,
  FaFileAlt,
  FaPlayCircle,
} from 'react-icons/fa';
import { useUserConfig } from '../../config/hooks';
import { useI18n } from '../../i18n/context';
import type { Project } from '../../types';
import DraggableWindow from './DraggableWindow';

interface GitHubViewerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProjectId?: string;
  onFocus?: () => void;
}

const GitHubViewer = ({ isOpen, onClose, selectedProjectId, onFocus }: GitHubViewerProps) => {
  const userConfig = useUserConfig();
  const { t } = useI18n();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showStructure, setShowStructure] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quickLook, setQuickLook] = useState<Project | null>(null);
  const [demoVideoProject, setDemoVideoProject] = useState<Project | null>(null);
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [imageLoadStates, setImageLoadStates] = useState<Record<string, boolean>>({});

  /** Normalize to array: demoVideoUrls if present, else [demoVideoUrl] if present */
  const getDemoVideoList = (project: Project): string[] => {
    if (project.demoVideoUrls?.length) return [...project.demoVideoUrls];
    if (project.demoVideoUrl) return [project.demoVideoUrl];
    return [];
  };

  /** Detect video URL type and return embed src for iframe, or null for direct <video> */
  const getDemoVideoEmbed = (url: string): { type: 'direct'; src: string } | { type: 'youtube' | 'vimeo'; embedSrc: string } => {
    const lower = url.toLowerCase();
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      return { type: 'youtube', embedSrc: `https://www.youtube.com/embed/${youtubeMatch[1]}` };
    }
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) {
      return { type: 'vimeo', embedSrc: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
    }
    return { type: 'direct', src: url };
  };


  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowStructure(true);
    setActiveImageIndex(0);
    // Reset image load states when switching projects
    setImageLoadStates({});
  };

  const handleBackClick = () => {
    setShowStructure(false);
    setSelectedProject(null);
  };

  const handleNextImage = () => {
    if (selectedProject) {
      setActiveImageIndex(prevIndex =>
        prevIndex + 1 >= selectedProject.images.length ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedProject) {
      setActiveImageIndex(prevIndex =>
        prevIndex - 1 < 0 ? selectedProject.images.length - 1 : prevIndex - 1
      );
    }
  };

  // Deep-link support: open a project directly when prop changes
  useEffect(() => {
    if (!isOpen) return;
    if (selectedProjectId) {
      const proj = userConfig.projects.find(p => p.id === selectedProjectId) || null;
      if (proj) {
        setSelectedProject(proj);
        setShowStructure(true);
        setActiveImageIndex(0);
        setImageLoadStates({});
      }
    }
  }, [selectedProjectId, isOpen, userConfig.projects]);

  if (!isOpen) return null;

  return (
    <>
      <DraggableWindow
        title={showStructure ? selectedProject?.title || t('projects.title') : t('projects.title')}
        onClose={onClose}
        initialPosition={{
          x: Math.floor(window.innerWidth * 0.2),
          y: Math.floor(window.innerHeight * 0.2),
        }}
        className="w-[93vw] md:max-w-4xl max-h-[90vh] flex flex-col"
        initialSize={{ width: 800, height: 600 }}
        onFocus={onFocus}
      >
        <div className="flex flex-col flex-grow min-h-0 h-full">
          <div className="overflow-y-auto flex-grow min-h-0 p-4 md:p-6">
            {!showStructure ? (
              <>
                <h2 className="text-2xl font-bold mb-4 text-gray-200">{t('projects.myProjects')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userConfig.projects.map(project => (
                    <div
                      key={project.id}
                      className="bg-gray-800/50 p-4 rounded-lg cursor-pointer transition-colors hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                      onClick={() => handleProjectClick(project)}
                      tabIndex={0}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleProjectClick(project);
                        }
                        if (e.key === ' ') {
                          e.preventDefault();
                          setQuickLook(project);
                        }
                      }}
                    >
                      {project.images && project.images.length > 0 && (
                        <div className="relative w-full h-48 mb-3 overflow-hidden rounded-lg bg-gray-700/50">
                          {!imageLoadStates[`${project.id}-0`] && (
                            <div className="absolute inset-0 animate-pulse bg-gray-700/50" />
                          )}
                          <img
                            src={project.images[0].url}
                            alt={project.images[0].alt}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${
                              imageLoadStates[`${project.id}-0`] ? 'opacity-100' : 'opacity-0'
                            }`}
                            loading="lazy"
                            decoding="async"
                            onLoad={() =>
                              setImageLoadStates(prev => ({ ...prev, [`${project.id}-0`]: true }))
                            }
                          />
                          <button
                            className="absolute bottom-2 right-2 text-xs bg-white/10 text-white border border-white/20 rounded px-2 py-1 hover:bg-white/20 z-10"
                            onClick={e => {
                              e.stopPropagation();
                              setQuickLook(project);
                            }}
                          >
                            {t('projects.quickLook')}
                          </button>
                        </div>
                      )}
                      <h3 className="text-xl font-semibold mb-2 text-gray-200">{project.title}</h3>
                      <p className="text-gray-400 mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.techStack.map(tech => (
                          <span
                            key={tech}
                            className="px-3 py-1.5 bg-gray-700/50 rounded-lg text-xs text-gray-200 border border-gray-600/50"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm hover:text-blue-400 text-gray-300"
                          onClick={e => e.stopPropagation()}
                        >
                          <FaGithub />
                          <span>{t('projects.repository')}</span>
                        </a>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm hover:text-blue-400 text-gray-300"
                            onClick={e => e.stopPropagation()}
                          >
                            <FaExternalLinkAlt />
                            <span>{t('projects.liveDemo')}</span>
                          </a>
                        )}
                        {project.designDocUrl && (
                          <a
                            href={project.designDocUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm hover:text-amber-400 text-gray-300"
                            onClick={e => e.stopPropagation()}
                          >
                            <FaFileAlt />
                            <span>{t('projects.designDoc')}</span>
                          </a>
                        )}
                        {getDemoVideoList(project).length > 0 && (
                          <button
                            type="button"
                            className="flex items-center gap-2 text-sm hover:text-rose-400 text-gray-300"
                            onClick={e => {
                              e.stopPropagation();
                              setDemoVideoProject(project);
                              setCurrentDemoIndex(0);
                            }}
                          >
                            <FaPlayCircle />
                            <span>{t('projects.demoVideo')}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div>
                <button
                  onClick={handleBackClick}
                  aria-label={t('projects.backToProjects')}
                  className="flex items-center gap-2 text-gray-300 hover:text-gray-100 mb-4"
                >
                  <FaChevronLeft />
                  <span>{t('projects.backToProjects')}</span>
                </button>

                {selectedProject && (
                  <div className="mb-6 space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-2xl font-bold text-gray-200 flex-1">{selectedProject.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                          {selectedProject.repoUrl && (
                            <a
                              href={selectedProject.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm hover:text-blue-400 text-gray-300 hover:bg-gray-700/50 px-3 py-1.5 rounded-lg transition-colors"
                              title={t('projects.visitGitHub')}
                            >
                              <FaGithub />
                              <span className="hidden sm:inline">{t('projects.repository')}</span>
                            </a>
                          )}
                          {selectedProject.liveUrl && (
                            <a
                              href={selectedProject.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm hover:text-green-400 text-gray-300 hover:bg-gray-700/50 px-3 py-1.5 rounded-lg transition-colors"
                              title={t('projects.visitLiveSite')}
                            >
                              <FaLink />
                              <span className="hidden sm:inline">{t('projects.liveDemo')}</span>
                            </a>
                          )}
                          {selectedProject.designDocUrl && (
                            <a
                              href={selectedProject.designDocUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm hover:text-amber-400 text-gray-300 hover:bg-gray-700/50 px-3 py-1.5 rounded-lg transition-colors"
                              title={t('projects.designDoc')}
                            >
                              <FaFileAlt />
                              <span className="hidden sm:inline">{t('projects.designDoc')}</span>
                            </a>
                          )}
                          {getDemoVideoList(selectedProject).length > 0 && (
                            <button
                              type="button"
                              className="flex items-center gap-1.5 text-sm hover:text-rose-400 text-gray-300 hover:bg-gray-700/50 px-3 py-1.5 rounded-lg transition-colors"
                              title={t('projects.demoVideo')}
                              onClick={() => {
                                setDemoVideoProject(selectedProject);
                                setCurrentDemoIndex(0);
                              }}
                            >
                              <FaPlayCircle />
                              <span className="hidden sm:inline">{t('projects.demoVideo')}</span>
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4">{selectedProject.description}</p>
                    </div>

                    {selectedProject.highlights && selectedProject.highlights.length > 0 && (
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold mb-3 text-gray-200">{t('projects.highlights')}</h4>
                        <ul className="space-y-2">
                          {selectedProject.highlights.map((highlight, i) => (
                            <li key={i} className="text-gray-300 text-sm flex items-start">
                              <span className="mr-2">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedProject.challenges && selectedProject.challenges.length > 0 && (
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold mb-3 text-gray-200">{t('projects.technicalChallenges')}</h4>
                        <ul className="space-y-2">
                          {selectedProject.challenges.map((challenge, i) => (
                            <li key={i} className="text-gray-300 text-sm flex items-start">
                              <span className="mr-2">•</span>
                              <span>{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedProject.techStack && selectedProject.techStack.length > 0 && (
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold mb-3 text-gray-200">{t('projects.techStack')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.techStack.map(tech => (
                            <span
                              key={tech}
                              className="px-3 py-1.5 bg-gray-700/50 rounded-lg text-sm text-gray-200 border border-gray-600/50"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedProject &&
                  selectedProject.images &&
                  selectedProject.images.length > 0 && (
                    <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-xl font-semibold mb-4 text-gray-200">{t('projects.screenshots')}</h3>
                        <div className="relative">
                          <div className="rounded-lg overflow-hidden mb-2 bg-gray-700/50 relative">
                            {!imageLoadStates[
                              `${selectedProject.id}-detail-${activeImageIndex}`
                            ] && <div className="absolute inset-0 animate-pulse bg-gray-700/50" />}
                            <img
                              src={selectedProject.images[activeImageIndex].url}
                              alt={selectedProject.images[activeImageIndex].alt}
                              className={`w-full max-h-[500px] object-contain transition-opacity duration-300 ${
                                imageLoadStates[`${selectedProject.id}-detail-${activeImageIndex}`]
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              }`}
                              loading="lazy"
                              decoding="async"
                              onLoad={() =>
                                setImageLoadStates(prev => ({
                                  ...prev,
                                  [`${selectedProject.id}-detail-${activeImageIndex}`]: true,
                                }))
                              }
                            />
                          </div>

                          <div className="text-sm text-gray-300 mb-3">
                            {selectedProject.images[activeImageIndex].description}
                          </div>

                          {selectedProject.images.length > 1 && (
                            <div className="flex justify-between mt-2">
                              <button
                                onClick={handlePrevImage}
                                aria-label="Previous screenshot"
                                className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                              >
                                ←
                              </button>
                              <span className="text-gray-400">
                                {activeImageIndex + 1} / {selectedProject.images.length}
                              </span>
                              <button
                                onClick={handleNextImage}
                                aria-label="Next screenshot"
                                className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                              >
                                →
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
              </div>
            )}
          </div>
        </div>
      </DraggableWindow>

      {quickLook && (
        <div
          className="fixed inset-0 z-[70]"
          role="dialog"
          aria-modal="true"
          aria-label={t('projects.quickLook')}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setQuickLook(null)}
          />
          <div className="relative mx-auto mt-16 w-[92%] max-w-3xl rounded-xl border border-white/10 bg-gray-900/95 shadow-2xl">
            <div className="p-4 md:p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-white">{quickLook!.title}</h3>
                <button
                  className="text-gray-400 hover:text-gray-200"
                  onClick={() => setQuickLook(null)}
                >
                  ✕
                </button>
              </div>
              {quickLook!.images && quickLook!.images.length > 0 && (
                <div className="rounded-lg overflow-hidden mb-3 bg-gray-700/50 relative">
                  {!imageLoadStates[`quicklook-${quickLook!.id}`] && (
                    <div className="absolute inset-0 animate-pulse bg-gray-700/50" />
                  )}
                  <img
                    src={quickLook!.images[0].url}
                    alt={quickLook!.images[0].alt}
                    className={`w-full max-h-[400px] object-contain transition-opacity duration-300 ${
                      imageLoadStates[`quicklook-${quickLook!.id}`] ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="lazy"
                    decoding="async"
                    onLoad={() =>
                      setImageLoadStates(prev => ({
                        ...prev,
                        [`quicklook-${quickLook!.id}`]: true,
                      }))
                    }
                  />
                </div>
              )}
              <p className="text-gray-300 mb-3">{quickLook!.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {quickLook!.techStack.map((tech: string) => (
                  <span key={tech} className="px-3 py-1.5 bg-gray-700/50 rounded-lg text-xs text-gray-200 border border-gray-600/50">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  className="text-sm text-blue-400 hover:text-blue-300"
                  onClick={() => {
                    setSelectedProject(quickLook!);
                    setShowStructure(true);
                    setQuickLook(null);
                  }}
                >
                  {t('projects.openDetails')}
                </button>
                <a
                  href={quickLook!.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-blue-400"
                >
                  {t('projects.openRepo')}
                </a>
                {quickLook!.liveUrl && (
                  <a
                    href={quickLook!.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-400 hover:text-green-300"
                  >
                    {t('projects.openLive')}
                  </a>
                )}
                {quickLook!.designDocUrl && (
                  <a
                    href={quickLook!.designDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-amber-400 hover:text-amber-300"
                  >
                    {t('projects.designDoc')}
                  </a>
                )}
                {getDemoVideoList(quickLook!).length > 0 && (
                  <button
                    type="button"
                    className="text-sm text-rose-400 hover:text-rose-300"
                    onClick={() => {
                      setDemoVideoProject(quickLook!);
                      setCurrentDemoIndex(0);
                      setQuickLook(null);
                    }}
                  >
                    {t('projects.demoVideo')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {demoVideoProject && getDemoVideoList(demoVideoProject).length > 0 && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t('projects.demoVideo')}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDemoVideoProject(null)}
          />
          <div
            className="relative w-full max-w-4xl rounded-xl border border-white/10 bg-gray-900/95 shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-white/10 bg-gray-800/50">
              <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-white truncate">
                  {demoVideoProject.title} – {t('projects.demoVideo')}
                </h3>
                {(() => {
                  const list = getDemoVideoList(demoVideoProject);
                  if (list.length <= 1) return null;
                  return (
                    <div className="flex gap-1 flex-shrink-0" role="tablist" aria-label={t('projects.demoVideo')}>
                      {list.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          role="tab"
                          aria-selected={i === currentDemoIndex}
                          aria-label={`${t('projects.demoVideo')} ${i + 1}`}
                          className={`px-2.5 py-1 rounded text-sm font-medium transition-colors ${
                            i === currentDemoIndex
                              ? 'bg-rose-500/80 text-white'
                              : 'text-gray-300 hover:bg-gray-600/50 hover:text-white'
                          }`}
                          onClick={() => setCurrentDemoIndex(i)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>
              <button
                type="button"
                className="flex-shrink-0 text-gray-400 hover:text-white p-1 rounded"
                onClick={() => setDemoVideoProject(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="relative aspect-video bg-black">
              {(() => {
                const list = getDemoVideoList(demoVideoProject);
                const url = list[currentDemoIndex];
                if (!url) return null;
                const embed = getDemoVideoEmbed(url);
                if (embed.type === 'direct') {
                  return (
                    <video
                      key={`${demoVideoProject.id}-${currentDemoIndex}`}
                      className="w-full h-full object-contain"
                      controls
                      autoPlay
                      playsInline
                      src={embed.src}
                    />
                  );
                }
                return (
                  <iframe
                    key={`${demoVideoProject.id}-${currentDemoIndex}`}
                    title={`${t('projects.demoVideo')} ${currentDemoIndex + 1}`}
                    className="absolute inset-0 w-full h-full"
                    src={embed.embedSrc}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GitHubViewer;
