import { useEffect, useState, type ReactNode } from 'react';
import {
  FaGraduationCap,
  FaBriefcase,
  FaChevronLeft,
  FaCode,
  FaUser,
  FaRoad,
} from 'react-icons/fa';
import { useUserConfig } from '../../config/hooks';
import type { AboutSection, Image } from '../../types';
import DraggableWindow from './DraggableWindow';
import { useI18n } from '../../i18n/context';

export type Section = AboutSection;

interface AboutAppProps {
  isOpen: boolean;
  onClose: () => void;
  section?: Section;
  onFocus?: () => void;
}

type ImageIndicesState = Record<string, number>;

const AboutApp = ({ isOpen, onClose, section, onFocus }: AboutAppProps) => {
  const { t } = useI18n();
  const userConfig = useUserConfig();
  const [activeSection, setActiveSection] = useState<Section>('menu');
  const [activeImageIndices, setActiveImageIndices] = useState<ImageIndicesState>({});

  const handleSectionClick = (next: Section) => {
    setActiveSection(next);
  };

  const handleBackClick = () => {
    setActiveSection('menu');
  };

  const handleNextImage = (itemId: string, images: readonly Image[]) => {
    setActiveImageIndices(prev => ({
      ...prev,
      [itemId]: ((prev[itemId] ?? -1) + 1) % images.length,
    }));
  };

  const handlePrevImage = (itemId: string, images: readonly Image[]) => {
    setActiveImageIndices(prev => ({
      ...prev,
      [itemId]: ((prev[itemId] ?? 0) - 1 + images.length) % images.length,
    }));
  };

  useEffect(() => {
    if (section && section !== activeSection) {
      setActiveSection(section);
    }
  }, [section]);

  if (!isOpen) return null;

  const education = userConfig.education || [];
  const experience = userConfig.experience || [];
  const skills = userConfig.skills || [];
  const identity = userConfig.about?.identity;
  const journey = userConfig.about?.journey || [];

  const renderBackButton = () => (
    <button
      onClick={handleBackClick}
      aria-label="Back to About menu"
      className="flex items-center gap-2 text-gray-300 hover:text-gray-100 mb-4"
    >
      <FaChevronLeft />
      <span>{t('about.backToMenu')}</span>
    </button>
  );

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
            alt={images[currentIndex].alt || t('about.image.screenshot')}
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
              aria-label={t('about.image.previous')}
              className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              ←
            </button>
            <span className="text-gray-400">
              {currentIndex + 1} / {images.length}
            </span>
            <button
              onClick={() => handleNextImage(itemId, images)}
              aria-label={t('about.image.next')}
              className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              →
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderIdentity = () => (
    <div className="space-y-6">
      {renderBackButton()}
      <h2 className="text-2xl font-bold text-gray-200 mb-2">{t('about.identity.title')}</h2>
      <div className="bg-gray-800/50 p-6 rounded-xl space-y-4">
        <h3 className="text-xl font-semibold text-gray-100">{identity?.headline}</h3>
        <p className="text-gray-300 leading-relaxed">{identity?.summary}</p>
        <div>
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
            {t('about.identity.values')}
          </h4>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {(identity?.values || []).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
            {t('about.identity.focus')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {(identity?.focus || []).map(item => (
              <span key={item} className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-200">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderJourney = () => (
    <div className="space-y-6">
      {renderBackButton()}
      <h2 className="text-2xl font-bold text-gray-200 mb-2">{t('about.journey.title')}</h2>
      <p className="text-sm text-gray-400 mb-4">{t('about.journey.subtitle')}</p>
      <div className="space-y-4">
        {journey.map(item => (
          <div key={item.id} className="bg-gray-800/50 p-5 rounded-xl border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-mono text-blue-300">{item.date}</span>
              {item.category && (
                <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                  {t(`about.journey.categories.${item.category}`)}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-1">{item.title}</h3>
            <p className="text-gray-300">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      {renderBackButton()}
      <h2 className="text-2xl font-bold text-gray-200 mb-6">{t('about.education.title')}</h2>
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
                  <h4 className="text-sm font-semibold text-gray-200 mb-2">
                    {t('about.education.relevantCourses')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.relevantCourses.map((course, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
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
      <h2 className="text-2xl font-bold text-gray-200 mb-6">{t('about.experience.title')}</h2>
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
                  <h4 className="text-sm font-semibold text-gray-200 mb-2">
                    {t('about.experience.achievements')}
                  </h4>
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
          <h2 className="text-2xl font-bold text-gray-200 mb-2">{t('about.skills.title')}</h2>
          <p className="text-sm text-gray-400 mb-4">{t('about.skills.intensityDescription')}</p>
          <div className="space-y-6">
            {SKILL_CATEGORY_ORDER.map(catKey => {
              const list = skillsByCategory[catKey];
              if (!list || list.length === 0) return null;
              return (
                <div key={catKey} className="bg-gray-800/50 p-4 rounded-xl shadow-lg">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    {t(`about.skills.categories.${catKey}`)}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {list.map((item, index) => (
                      <span
                        key={`${catKey}-${index}`}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-200 ${getIntensity(item.name)} hover:bg-green-500/40 transition-colors`}
                        title={t('about.skills.usedInProjects').replace(
                          '{count}',
                          `${freq[item.name] || 0}`
                        )}
                      >
                        <span className="font-medium">{item.name}</span>
                        {item.level && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-gray-600/80 text-gray-300">
                            {t(`about.skills.level.${item.level}`)}
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
        <h2 className="text-2xl font-bold text-gray-200 mb-2">{t('about.skills.title')}</h2>
        <p className="text-sm text-gray-400 mb-4">{t('about.skills.intensityDescription')}</p>
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {skills.map((skill, index) => (
              <button
                key={index}
                className={`px-3 py-2 rounded text-sm text-gray-100 text-left transition-colors ${getIntensity(skill)} hover:bg-green-500/60`}
                title={t('about.skills.usedInProjects').replace('{count}', `${freq[skill] || 0}`)}
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

  const menuCards: Array<{
    id: Section;
    icon: ReactNode;
    color: string;
    titleKey: string;
    descKey: string;
  }> = [
    {
      id: 'identity',
      icon: <FaUser size={24} className="text-white" />,
      color: 'bg-purple-600',
      titleKey: 'about.sections.identity',
      descKey: 'about.menu.identityDescription',
    },
    {
      id: 'journey',
      icon: <FaRoad size={24} className="text-white" />,
      color: 'bg-amber-600',
      titleKey: 'about.sections.journey',
      descKey: 'about.menu.journeyDescription',
    },
    {
      id: 'education',
      icon: <FaGraduationCap size={28} className="text-white" />,
      color: 'bg-blue-600',
      titleKey: 'about.sections.education',
      descKey: 'about.menu.educationDescription',
    },
    {
      id: 'experience',
      icon: <FaBriefcase size={28} className="text-white" />,
      color: 'bg-green-600',
      titleKey: 'about.sections.experience',
      descKey: 'about.menu.experienceDescription',
    },
    {
      id: 'skills',
      icon: <FaCode size={28} className="text-white" />,
      color: 'bg-red-600',
      titleKey: 'about.sections.skills',
      descKey: 'about.menu.skillsDescription',
    },
  ];

  const renderMenu = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-200 mb-2">{t('about.title')}</h2>
      <p className="text-gray-400 mb-6">{t('about.subtitle')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {menuCards.map(card => (
          <button
            key={card.id}
            type="button"
            className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors text-left"
            onClick={() => handleSectionClick(card.id)}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-200">{t(card.titleKey)}</h3>
            </div>
            <p className="text-gray-400">{t(card.descKey)}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const getWindowTitle = () => {
    if (activeSection === 'menu') return t('about.title');
    return `${t(`about.sections.${activeSection}`)} - ${t('about.title')}`;
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
          {activeSection === 'identity' && renderIdentity()}
          {activeSection === 'journey' && renderJourney()}
          {activeSection === 'education' && renderEducation()}
          {activeSection === 'experience' && renderExperience()}
          {activeSection === 'skills' && renderSkills()}
        </div>
      </div>
    </DraggableWindow>
  );
};

export default AboutApp;
