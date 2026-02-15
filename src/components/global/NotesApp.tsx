import { useEffect, useState } from 'react';
import { FaGraduationCap, FaBriefcase, FaChevronLeft, FaCode } from 'react-icons/fa';
import { useUserConfig } from '../../config/hooks';
import DraggableWindow from './DraggableWindow';
import { useI18n } from '../../i18n/context';

export type Section = 'menu' | 'education' | 'experience' | 'skills';

interface NotesAppProps {
  isOpen: boolean;
  onClose: () => void;
  section?: Section; // external control of active section
  onFocus?: () => void;
}

// Type for storing image indices per item
type ImageIndicesState = Record<string, number>;

interface Image {
  url: string;
  alt?: string;
  description?: string;
}

const NotesApp = ({ isOpen, onClose, section, onFocus }: NotesAppProps) => {
  const { t } = useI18n();
  const userConfig = useUserConfig();
  const [activeSection, setActiveSection] = useState<Section>('menu');
  // Store image indices in an object: { 'itemId': index }
  const [activeImageIndices, setActiveImageIndices] = useState<ImageIndicesState>({});

  const handleSectionClick = (section: Section) => {
    setActiveSection(section);
    // No need to reset image indices globally here,
    // they are per-item now and will default to 0 if not set
  };

  const handleBackClick = () => {
    setActiveSection('menu');
  };

  // Update image index for a specific item
  const handleNextImage = (itemId: string, images: readonly Image[]) => {
    setActiveImageIndices(prevIndices => ({
      ...prevIndices,
      [itemId]: ((prevIndices[itemId] ?? -1) + 1) % images.length,
    }));
  };

  // Update image index for a specific item
  const handlePrevImage = (itemId: string, images: readonly Image[]) => {
    setActiveImageIndices(prevIndices => ({
      ...prevIndices,
      [itemId]: ((prevIndices[itemId] ?? 0) - 1 + images.length) % images.length,
    }));
  };

  // Sync external section prop to internal state
  useEffect(() => {
    if (section && section !== activeSection) {
      setActiveSection(section);
    }
  }, [section]);

  if (!isOpen) return null;

  const education = userConfig.education || [];
  const experience = userConfig.experience || [];
  const skills = userConfig.skills || [];

  const renderBackButton = () => (
    <button
      onClick={handleBackClick}
      aria-label="Back to Notes menu"
      className="flex items-center gap-2 text-gray-300 hover:text-gray-100 mb-4"
    >
      <FaChevronLeft />
      <span>{t('notes.backToMenu')}</span>
    </button>
  );

  // Accepts itemId to manage state correctly
  const renderImageCarousel = (itemId: string, images: readonly Image[]) => {
    const currentIndex = activeImageIndices[itemId] ?? 0;
    if (!images || images.length === 0 || currentIndex >= images.length) {
      return null;
    }

    return (
      <div className="mt-4">
        <div className="rounded-lg overflow-hidden mb-2">
          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].alt || t('notes.image.screenshot')}
            decoding="async"
            loading="lazy"
            className="w-full h-48 object-contain bg-gray-900 rounded-lg"
          />
        </div>

        <div className="text-sm text-gray-400 mb-3" aria-live="polite">
          {images[currentIndex].description}
        </div>

        {images.length > 1 && (
          <div className="flex justify-between mt-2">
            <button
              onClick={() => handlePrevImage(itemId, images)}
              aria-label={t('notes.image.previous')}
              className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              ←
            </button>
            <span className="text-gray-400">
              {currentIndex + 1} / {images.length}
            </span>
            <button
              onClick={() => handleNextImage(itemId, images)}
              aria-label={t('notes.image.next')}
              className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              →
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderEducation = () => (
    <div className="space-y-6">
      {renderBackButton()}
      <h2 className="text-2xl font-bold text-gray-200 mb-6">{t('notes.education.title')}</h2>
      <div className="flex flex-wrap gap-6">
        {education.map((item, index) => {
          const itemId = `education-${index}`;
          return (
            <div
              key={itemId}
              className="bg-gray-800/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex-1 min-w-[300px]"
            >
              <h3 className="text-xl font-semibold text-gray-200 mb-2">
                {item.degree} {item.major && `- ${item.major}`}
              </h3>
              <div className="text-gray-300 mb-2">
                {item.institution}, {item.location}
              </div>
              <div className="text-gray-400 mb-3">{item.year}</div>
              <p className="text-gray-300 mb-4">{item.description}</p>
              {item.relevantCourses && item.relevantCourses.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-200 mb-2">Relevant Courses:</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.relevantCourses.map((course, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {item.images && item.images.length > 0 && renderImageCarousel(itemId, item.images)}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      {renderBackButton()}
      <h2 className="text-2xl font-bold text-gray-200 mb-6">{t('notes.experience.title')}</h2>
      <div className="space-y-6">
        {experience.map((item, index) => {
          const itemId = `experience-${index}`;
          return (
            <div
              key={itemId}
              className="bg-gray-800/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-200 mb-2">{item.title}</h3>
              <div className="text-gray-300 mb-2">
                {item.company}, {item.location}
              </div>
              <div className="text-gray-400 mb-3">{item.period}</div>
              <p className="text-gray-300 mb-4">{item.description}</p>
              {item.achievements && item.achievements.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-200 mb-2">Key Achievements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                    {item.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
              {item.technologies && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.technologies.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                      {tech.replace(/'/g, '&apos;')}
                    </span>
                  ))}
                </div>
              )}
              {item.images && item.images.length > 0 && renderImageCarousel(itemId, item.images)}
            </div>
          );
        })}
      </div>
    </div>
  );

  const SKILL_CATEGORY_ORDER = [
    'languages',
    'frontend',
    'backend',
    'mobile',
    'desktop',
    'databases',
    'devops',
    'emerging',
  ] as const;

  const renderSkills = () => {
    const skillsByCategory = userConfig.skillsByCategory;
    const freq: Record<string, number> = {};
    for (const p of userConfig.projects || []) {
      for (const tech of p.techStack) {
        freq[tech] = (freq[tech] || 0) + 1;
      }
    }
    const max = Object.values(freq).reduce((a, b) => Math.max(a, b), 1);
    const getIntensity = (skillName: string) => {
      const f = freq[skillName] || 0;
      const ratio = Math.min(1, f / max);
      if (ratio > 0.66) return 'bg-green-600/70';
      if (ratio > 0.33) return 'bg-green-600/40';
      if (ratio > 0) return 'bg-green-600/20';
      return 'bg-gray-700';
    };

    if (skillsByCategory && Object.keys(skillsByCategory).length > 0) {
      return (
        <div className="space-y-6">
          {renderBackButton()}
          <h2 className="text-2xl font-bold text-gray-200 mb-2">{t('notes.skills.title')}</h2>
          <p className="text-sm text-gray-400 mb-4">{t('notes.skills.intensityDescription')}</p>
          <div className="space-y-6">
            {SKILL_CATEGORY_ORDER.map((catKey) => {
              const list = skillsByCategory[catKey];
              if (!list || list.length === 0) return null;
              const categoryLabelKey = `notes.skills.categories.${catKey}`;
              const label = t(categoryLabelKey);
              return (
                <div key={catKey} className="bg-gray-800/50 p-4 rounded-xl shadow-lg">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    {label}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {list.map((item, index) => (
                      <span
                        key={`${catKey}-${index}`}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-200 ${getIntensity(item.name)} hover:bg-green-500/40 transition-colors`}
                        title={t('notes.skills.usedInProjects').replace('{count}', `${freq[item.name] || 0}`)}
                      >
                        <span className="font-medium">{item.name}</span>
                        {item.level && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-gray-600/80 text-gray-300">
                            {t(`notes.skills.level.${item.level}`)}
                          </span>
                        )}
                        {item.years != null && (
                          <span className="text-xs text-gray-400">{item.years}y</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {renderBackButton()}
        <h2 className="text-2xl font-bold text-gray-200 mb-2">{t('notes.skills.title')}</h2>
        <p className="text-sm text-gray-400 mb-4">{t('notes.skills.intensityDescription')}</p>
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {skills.map((skill, index) => (
              <button
                key={index}
                className={`px-3 py-2 rounded text-sm text-gray-100 text-left transition-colors ${getIntensity(skill)} hover:bg-green-500/60`}
                title={t('notes.skills.usedInProjects').replace('{count}', `${freq[skill] || 0}`)}
                onClick={() => {}}
              >
                <span className="font-medium">{skill}</span>
                <span className="ml-2 text-xs text-gray-200/70">{freq[skill] || 0}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMenu = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-200 mb-6">{t('notes.title')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Education */}
        <button
          type="button"
          className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors text-left"
          onClick={() => handleSectionClick('education')}
          aria-label="Open Education section"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <FaGraduationCap size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-200">{t('notes.sections.education')}</h3>
          </div>
          <p className="text-gray-400">{t('notes.menu.educationDescription')}</p>
        </button>

        {/* Experience */}
        <button
          type="button"
          className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors text-left"
          onClick={() => handleSectionClick('experience')}
          aria-label="Open Professional Experience section"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <FaBriefcase size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-200">
              {t('notes.sections.experience')}
            </h3>
          </div>
          <p className="text-gray-400">{t('notes.menu.experienceDescription')}</p>
        </button>

        {/* Skills */}
        <button
          type="button"
          className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors text-left"
          onClick={() => handleSectionClick('skills')}
          aria-label="Open Skills section"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
              <FaCode size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-200">{t('notes.sections.skills')}</h3>
          </div>
          <p className="text-gray-400">{t('notes.menu.skillsDescription')}</p>
        </button>
      </div>
    </div>
  );

  const getWindowTitle = () => {
    switch (activeSection) {
      case 'menu':
        return t('notes.title');
      case 'education':
        return `${t('notes.sections.education')} - ${t('notes.title')}`;
      case 'experience':
        return `${t('notes.sections.experience')} - ${t('notes.title')}`;
      case 'skills':
        return `${t('notes.sections.skills')} - ${t('notes.title')}`;
      default:
        return t('notes.title');
    }
  };

  return (
    <DraggableWindow
      title={getWindowTitle()}
      onClose={onClose}
      initialPosition={{
        x: Math.floor(window.innerWidth * 0.3),
        y: Math.floor(window.innerHeight * 0.2),
      }}
      className="w-[93vw] md:max-w-4xl max-h-[90vh] flex flex-col"
      initialSize={{ width: 700, height: 600 }}
      onFocus={onFocus}
    >
      <div className="flex flex-col flex-grow min-h-0 h-full">
        <div className="overflow-y-auto flex-grow min-h-0 p-4 md:p-6">
          {activeSection === 'menu' && renderMenu()}
          {activeSection === 'education' && renderEducation()}
          {activeSection === 'experience' && renderExperience()}
          {activeSection === 'skills' && renderSkills()}
        </div>
      </div>
    </DraggableWindow>
  );
};

export default NotesApp;
