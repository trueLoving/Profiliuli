import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import type { FuseResult } from 'fuse.js';
import { useUserConfig } from '../../config/hooks';
import { FaGithub, FaLinkedin, FaRegFileAlt } from 'react-icons/fa';
import { IoTerminalOutline, IoBookOutline, IoDocumentTextOutline, IoSearch } from 'react-icons/io5';
import { useI18n } from '../../i18n/context';

type SpotlightItem = {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  keywords?: string[];
  icon?: React.ReactNode;
  action: () => void;
};

export interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  actions: {
    openTerminal: () => void;
    openNotes: () => void;
    openNotesSection: (section: 'education' | 'experience' | 'courses' | 'skills') => void;
    openGitHub: () => void;
    openResume: () => void;
    openArticles?: () => void;
    showTutorial: () => void;
    closeAllWindows: () => void;
    shuffleBackground: () => void;
    openProjectById: (id: string) => void;
  };
}

export default function Spotlight({ isOpen, onClose, actions }: SpotlightProps) {
  const { t } = useI18n();
  const userConfig = useUserConfig();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1200);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} ${t('common.copied')}`);
    } catch (_e) {
      showToast(t('common.copyFailed'));
    }
  };

  const items = useMemo<SpotlightItem[]>(() => {
    const projectItems: SpotlightItem[] = userConfig.projects.map(p => ({
      id: `project:${p.id}`,
      title: p.title,
      subtitle: p.description,
      category: t('spotlight.categories.projects'),
      keywords: [p.repoUrl, p.liveUrl ?? '', ...p.techStack],
      icon: <FaGithub className="text-gray-300" />,
      action: () => actions.openProjectById(p.id),
    }));

    const expItems: SpotlightItem[] = userConfig.experience.map((e, idx) => ({
      id: `experience:${idx}`,
      title: e.title,
      subtitle: `${e.company} • ${e.period}`,
      category: t('spotlight.categories.experience'),
      keywords: [e.company, e.location, ...(e.technologies ?? [])],
      icon: <IoBookOutline className="text-gray-300" />,
      action: () => actions.openNotesSection('experience'),
    }));

    const educationItems: SpotlightItem[] = userConfig.education.map((ed, idx) => ({
      id: `education:${idx}`,
      title: ed.degree,
      subtitle: `${ed.institution} • ${ed.year}`,
      category: t('spotlight.categories.education'),
      keywords: [ed.institution, ed.location ?? '', ed.major ?? ''],
      icon: <IoBookOutline className="text-gray-300" />,
      action: () => actions.openNotesSection('education'),
    }));

    const skillItems: SpotlightItem[] = userConfig.skills.map((s, idx) => ({
      id: `skill:${idx}`,
      title: s,
      category: t('spotlight.categories.skills'),
      icon: <IoSearch className="text-gray-300" />,
      action: () => actions.openNotesSection('skills'),
    }));

    const quickActions: SpotlightItem[] = [
      {
        id: 'action:terminal',
        title: t('spotlight.actions.openTerminal'),
        subtitle: t('spotlight.actions.openTerminalSubtitle'),
        category: t('spotlight.categories.actions'),
        icon: <IoTerminalOutline className="text-gray-300" />,
        action: actions.openTerminal,
      },
      {
        id: 'action:notes-experience',
        title: t('spotlight.actions.openNotesExperience'),
        subtitle: t('spotlight.actions.openNotesExperienceSubtitle'),
        category: t('spotlight.categories.actions'),
        icon: <IoBookOutline className="text-gray-300" />,
        action: () => actions.openNotesSection('experience'),
      },
      {
        id: 'action:notes-education',
        title: t('spotlight.actions.openNotesEducation'),
        subtitle: t('spotlight.actions.openNotesEducationSubtitle'),
        category: t('spotlight.categories.actions'),
        icon: <IoBookOutline className="text-gray-300" />,
        action: () => actions.openNotesSection('education'),
      },
      {
        id: 'action:notes',
        title: t('spotlight.actions.openNotes'),
        subtitle: t('spotlight.actions.openNotesSubtitle'),
        category: t('spotlight.categories.actions'),
        icon: <IoBookOutline className="text-gray-300" />,
        action: actions.openNotes,
      },
      {
        id: 'action:close-all',
        title: t('spotlight.actions.closeAllWindows'),
        subtitle: t('spotlight.actions.closeAllWindowsSubtitle'),
        category: t('spotlight.categories.actions'),
        icon: <FaRegFileAlt className="text-gray-300" />,
        action: actions.closeAllWindows,
      },
      {
        id: 'action:shuffle-bg',
        title: t('spotlight.actions.shuffleBackground'),
        subtitle: t('spotlight.actions.shuffleBackgroundSubtitle'),
        category: t('spotlight.categories.actions'),
        icon: <FaRegFileAlt className="text-gray-300" />,
        action: actions.shuffleBackground,
      },
      {
        id: 'action:copy-email',
        title: 'Copy email to clipboard',
        subtitle: userConfig.contact.email,
        category: 'Actions',
        icon: <IoDocumentTextOutline className="text-gray-300" />,
        action: () => copyToClipboard(userConfig.contact.email, 'Email'),
      },
      ...(userConfig.contact.phone
        ? [
            {
              id: 'action:copy-phone',
              title: 'Copy phone to clipboard',
              subtitle: userConfig.contact.phone,
              category: 'Actions',
              icon: <IoDocumentTextOutline className="text-gray-300" />,
              action: () => copyToClipboard(userConfig.contact.phone!, 'Phone'),
            },
          ]
        : []),
      {
        id: 'action:email-compose',
        title: 'Compose email',
        subtitle: userConfig.contact.email,
        category: 'Actions',
        icon: <IoDocumentTextOutline className="text-gray-300" />,
        action: () => window.open(`mailto:${userConfig.contact.email}`),
      },
      {
        id: 'action:open-website',
        title: 'Open personal website',
        subtitle: userConfig.website,
        category: 'Actions',
        icon: <IoDocumentTextOutline className="text-gray-300" />,
        action: () => window.open(userConfig.website, '_blank'),
      },
      ...(userConfig.contact.calendly
        ? [
            {
              id: 'action:calendly',
              title: 'Open Calendly',
              subtitle: userConfig.contact.calendly,
              category: 'Actions',
              icon: <IoDocumentTextOutline className="text-gray-300" />,
              action: () => window.open(userConfig.contact.calendly!, '_blank'),
            },
          ]
        : []),
      {
        id: 'action:github',
        title: 'Open GitHub Viewer',
        subtitle: 'Browse featured repositories',
        category: 'Actions',
        icon: <FaGithub className="text-gray-300" />,
        action: actions.openGitHub,
      },
      {
        id: 'action:resume',
        title: 'Open Resume',
        subtitle: 'View PDF in a window',
        category: 'Actions',
        icon: <IoDocumentTextOutline className="text-gray-300" />,
        action: actions.openResume,
      },
      ...(actions.openArticles
        ? [
            {
              id: 'action:articles',
              title: 'Open Articles',
              subtitle: 'Browse my recent articles',
              category: 'Actions',
              icon: <FaRegFileAlt className="text-gray-300" />,
              action: actions.openArticles,
            },
          ]
        : []),
      {
        id: 'action:tutorial',
        title: 'Show Tutorial',
        subtitle: 'Quick guided tour',
        category: 'Actions',
        icon: <FaRegFileAlt className="text-gray-300" />,
        action: actions.showTutorial,
      },
      {
        id: 'link:github',
        title: 'Open GitHub Profile',
        subtitle: userConfig.social.github,
        category: 'Links',
        icon: <FaGithub className="text-gray-300" />,
        action: () => window.open(userConfig.social.github, '_blank'),
      },
      ...(userConfig.social.linkedin
        ? [
            {
              id: 'link:linkedin',
              title: 'Open LinkedIn',
              subtitle: userConfig.social.linkedin,
              category: 'Links',
              icon: <FaLinkedin className="text-gray-300" />,
              action: () => window.open(userConfig.social.linkedin!, '_blank'),
            },
          ]
        : []),
      ...(userConfig.social.medium
        ? [
            {
              id: 'link:medium',
              title: 'Open Medium',
              subtitle: userConfig.social.medium,
              category: 'Links',
              icon: <span className="text-gray-300 font-bold">M</span>,
              action: () => window.open(userConfig.social.medium!, '_blank'),
            },
          ]
        : []),
      ...(userConfig.social.juejin
        ? [
            {
              id: 'link:juejin',
              title: 'Open Juejin',
              subtitle: userConfig.social.juejin,
              category: 'Links',
              icon: <span className="text-gray-300">掘</span>,
              action: () => window.open(userConfig.social.juejin!, '_blank'),
            },
          ]
        : []),
      ...(userConfig.social.dailydev
        ? [
            {
              id: 'link:dailydev',
              title: 'Open daily.dev',
              subtitle: userConfig.social.dailydev,
              category: 'Links',
              icon: <span className="text-gray-300 font-bold">d</span>,
              action: () => window.open(userConfig.social.dailydev!, '_blank'),
            },
          ]
        : []),
      {
        id: 'link:resume',
        title: 'Open Resume (PDF URL)',
        subtitle: userConfig.resume.url,
        category: 'Links',
        icon: <IoDocumentTextOutline className="text-gray-300" />,
        action: () => window.open(userConfig.resume.url, '_blank'),
      },
    ];

    return [...quickActions, ...projectItems, ...expItems, ...educationItems, ...skillItems];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, t, userConfig]);

  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: [
        { name: 'title', weight: 0.6 },
        { name: 'subtitle', weight: 0.2 },
        { name: 'category', weight: 0.1 },
        { name: 'keywords', weight: 0.1 },
      ],
      threshold: 0.38,
      ignoreLocation: true,
      includeScore: true,
    });
  }, [items]);

  const results = useMemo<SpotlightItem[]>(() => {
    const pinnedIds = ['action:terminal', 'action:notes'];
    if (!query.trim()) {
      const base = items.slice(0, 8);
      // Ensure pinned are first when empty query
      const pinned = items.filter(i => pinnedIds.includes(i.id));
      const rest = base.filter(i => !pinnedIds.includes(i.id));
      return [...pinned, ...rest].slice(0, 8);
    }
    const searched = fuse
      .search(query)
      .slice(0, 20)
      .map((r: FuseResult<SpotlightItem>) => r.item);
    const pinned = items.filter(i => pinnedIds.includes(i.id));
    // Deduplicate by id while placing pinned first
    const seen = new Set<string>();
    const combined = [...pinned, ...searched].filter(i => {
      if (seen.has(i.id)) return false;
      seen.add(i.id);
      return true;
    });
    return combined.slice(0, 20);
  }, [query, items, fuse]);

  // Group results by category with fixed order
  const grouped = useMemo(() => {
    const order = [
      t('spotlight.categories.actions'),
      t('spotlight.categories.projects'),
      t('spotlight.categories.experience'),
      t('spotlight.categories.education'),
      t('spotlight.categories.skills'),
      'Links',
    ];
    const map = new Map<string, SpotlightItem[]>();
    for (const item of results) {
      const arr = map.get(item.category) ?? [];
      arr.push(item);
      map.set(item.category, arr);
    }
    return order
      .filter(cat => map.has(cat))
      .map(cat => ({ category: cat, items: map.get(cat)!, count: map.get(cat)!.length }));
  }, [results, t]);

  // Show more per group state
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const toggleGroup = (cat: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const close = useCallback(() => {
    onClose();
    setQuery('');
    setActiveIndex(0);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      // Auto-focus input when opening
      setTimeout(() => inputRef.current?.focus(), 0);
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          // macOS-like behavior: first Esc clears input, second Esc closes
          if (query.trim()) {
            setQuery('');
            setActiveIndex(0);
            inputRef.current?.focus();
          } else {
            close();
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setActiveIndex(i => Math.min(i + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setActiveIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          // Check for Shift+Enter first (project live URL)
          if (e.shiftKey) {
            const item = results[activeIndex];
            if (item && item.id.startsWith('project:')) {
              const projId = item.id.split(':')[1];
              const proj = userConfig.projects.find(p => p.id === projId);
              if (proj?.liveUrl) {
                window.open(proj.liveUrl, '_blank');
                close();
                return;
              }
            }
          }
          // Regular Enter key
          const item = results[activeIndex];
          if (item) {
            item.action();
            close();
          }
        } else if ((e.key === 'B' || e.key === 'b') && !e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          actions.shuffleBackground();
          close();
        } else if ((e.key === 'X' || e.key === 'x') && !e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          actions.closeAllWindows();
          close();
        }
      };
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }
  }, [isOpen, results, activeIndex, close, query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-label="Spotlight search"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
      <div className="relative mx-auto mt-20 w-[92%] max-w-2xl rounded-xl border border-white/10 bg-gray-900/95 shadow-2xl">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <IoSearch className="text-gray-400" size={18} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder={t('spotlight.placeholder')}
            className="flex-1 bg-transparent outline-none text-sm md:text-base text-white placeholder-gray-400"
            aria-label="Search input"
          />
          <span className="hidden md:inline text-[10px] text-gray-400 border border-white/10 rounded px-1.5 py-0.5">
            Esc
          </span>
        </div>
        <ul role="listbox" className="max-h-[60vh] overflow-y-auto py-1">
          {results.length === 0 && (
            <li className="px-4 py-3 text-gray-400 text-sm">{t('spotlight.noResults')}</li>
          )}
          {grouped.map(group => (
            <React.Fragment key={`group-${group.category}`}>
              <li className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm px-4 py-2 text-[10px] uppercase tracking-wide text-gray-400 border-b border-white/5 flex items-center justify-between">
                <span>{group.category}</span>
                <span className="opacity-70">{group.count}</span>
              </li>
              {(expandedGroups.has(group.category) ? group.items : group.items.slice(0, 5)).map(
                (item: SpotlightItem) => {
                  const idx = results.findIndex(r => r.id === item.id);
                  return (
                    <li key={item.id}>
                      <button
                        role="option"
                        aria-selected={activeIndex === idx}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => {
                          item.action();
                          close();
                        }}
                        className={`${activeIndex === idx ? 'bg-white/10' : ''} w-full px-4 py-2.5 flex items-start gap-3 text-left`}
                      >
                        <div className="mt-0.5">{item.icon}</div>
                        <div className="flex-1">
                          <div className="text-sm text-white">{item.title}</div>
                          <div className="text-xs text-gray-400">
                            {item.subtitle ?? item.category}
                          </div>
                        </div>
                        {item.id.startsWith('project:') &&
                          (() => {
                            const projId = item.id.split(':')[1];
                            const proj = userConfig.projects.find(p => p.id === projId);
                            return proj?.liveUrl ? (
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  window.open(proj.liveUrl!, '_blank');
                                  close();
                                }}
                                className="text-[10px] text-green-400 hover:text-green-300 border border-green-400/30 rounded px-1.5 py-0.5"
                                title="Open Live"
                              >
                                Live
                              </button>
                            ) : (
                              <span className="text-[10px] text-gray-500 border border-white/10 rounded px-1 py-0.5">
                                {item.category}
                              </span>
                            );
                          })()}
                      </button>
                    </li>
                  );
                }
              )}
              {group.items.length > 5 && (
                <li className="px-4 py-2">
                  <button
                    className="text-xs text-blue-400 hover:text-blue-300"
                    onClick={() => toggleGroup(group.category)}
                  >
                    {expandedGroups.has(group.category)
                      ? 'Show less'
                      : `Show ${group.items.length - 5} more`}
                  </button>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
      {toast && (
        <div className="pointer-events-none fixed right-4 top-4 z-[70] rounded bg-white/10 text-white text-xs px-3 py-2 border border-white/10 shadow">
          {toast}
        </div>
      )}
    </div>
  );
}
