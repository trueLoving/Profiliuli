export type Locale = 'en' | 'zh-CN';

export interface Translations {
  common: {
    close: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    back: string;
    next: string;
    previous: string;
    search: string;
    loading: string;
    error: string;
    success: string;
    copied: string;
    copyFailed: string;
  };
  toolbar: {
    file: string;
    view: string;
    window: string;
    go: string;
    edit: string;
    help: string;
    resumePdf: string;
    projectsGithub: string;
    adminDashboard: string;
    spotlightSearch: string;
    missionControl: string;
    shortcutsOverlay: string;
    resetTutorial: string;
    contact: string;
    closeAllWindows: string;
    shuffleBackground: string;
    github: string;
    linkedin: string;
    email: string;
    copyEmail: string;
    copyPhone: string;
    keyboardShortcuts: string;
    emailCopied: string;
    phoneCopied: string;
    viewGitHub: string;
    openInVSCode: string;
    search: string;
  };
  spotlight: {
    placeholder: string;
    noResults: string;
    categories: {
      projects: string;
      experience: string;
      education: string;
      skills: string;
      actions: string;
    };
    actions: {
      openTerminal: string;
      openTerminalSubtitle: string;
      openNotesExperience: string;
      openNotesExperienceSubtitle: string;
      openNotesEducation: string;
      openNotesEducationSubtitle: string;
      openNotes: string;
      openNotesSubtitle: string;
      closeAllWindows: string;
      closeAllWindowsSubtitle: string;
      shuffleBackground: string;
      shuffleBackgroundSubtitle: string;
    };
  };
  notes: {
    title: string;
    backToMenu: string;
    sections: {
      education: string;
      experience: string;
      skills: string;
    };
    education: {
      title: string;
      degree: string;
      institution: string;
      year: string;
      location: string;
      major: string;
      description: string;
    };
    experience: {
      title: string;
      company: string;
      position: string;
      period: string;
      location: string;
      description: string;
      technologies: string;
    };
    skills: {
      title: string;
      intensityDescription: string;
      usedInProjects: string;
    };
    menu: {
      educationDescription: string;
      experienceDescription: string;
      skillsDescription: string;
    };
    image: {
      screenshot: string;
      previous: string;
      next: string;
    };
  };
  dock: {
    terminal: string;
    notes: string;
    github: string;
    resume: string;
    contact: string;
    links: string;
    systemApps: string;
  };
  systemApps: {
    title: string;
    subtitle: string;
    calculator: string;
  };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    success: string;
    error: string;
    validation: {
      required: string;
      emailInvalid: string;
    };
  };
  terminal: {
    title: string;
    placeholder: string;
    send: string;
    thinking: string;
    error: string;
  };
  language: {
    switch: string;
    english: string;
    chinese: string;
  };
  shortcutHint: {
    search: string;
    contact: string;
    help: string;
    missionControl: string;
  };
  projects: {
    title: string;
    myProjects: string;
    backToProjects: string;
    highlights: string;
    technicalChallenges: string;
    techStack: string;
    screenshots: string;
    repository: string;
    liveDemo: string;
    quickLook: string;
    visitGitHub: string;
    visitLiveSite: string;
    openDetails: string;
    openRepo: string;
    openLive: string;
  };
}
