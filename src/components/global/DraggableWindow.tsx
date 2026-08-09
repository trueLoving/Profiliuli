import { useState, useRef, useEffect, useCallback } from 'react';

// Global z-index counter
let globalZIndex = 10;

// Minimum window dimensions
const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;

/** macOS menu bar height (matches MacToolbar desktop h-6) */
const MENU_BAR_HEIGHT = 24;
/** Leave space above the dock when maximized (windowed zoom, not fullscreen) */
const DOCK_CLEARANCE = 88;

interface DraggableWindowProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  className?: string;
  onFocus?: () => void;
}

type WindowBounds = {
  position: { x: number; y: number };
  size: { width: number; height: number };
};

function getMaximizedBounds(): WindowBounds {
  const width = window.innerWidth;
  const height = Math.max(MIN_HEIGHT, window.innerHeight - MENU_BAR_HEIGHT - DOCK_CLEARANCE);
  return {
    position: { x: 0, y: MENU_BAR_HEIGHT },
    size: { width, height },
  };
}

export default function DraggableWindow({
  title,
  onClose,
  children,
  initialPosition = { x: 0, y: 0 },
  initialSize = { width: 400, height: 300 },
  className = '',
  onFocus,
}: DraggableWindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<
    'bottom' | 'right' | 'bottom-right' | 'left' | 'bottom-left' | null
  >(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState(globalZIndex);
  const [isMobile, setIsMobile] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const restoreBoundsRef = useRef<WindowBounds>({
    position: initialPosition,
    size: initialSize,
  });
  /** After demaximize-on-drag, continue dragging from the pointer */
  const pendingDragRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Keep maximized window filling the desktop when the viewport changes
  useEffect(() => {
    if (!isMaximized || isMobile) return;

    const handleResize = () => {
      const bounds = getMaximizedBounds();
      setPosition(bounds.position);
      setSize(bounds.size);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMaximized, isMobile]);

  // Focus trap and restore focus on mount/unmount
  useEffect(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Tab') {
        if (!windowRef.current?.contains(document.activeElement)) {
          return;
        }

        const focusableElements = windowRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (
            document.activeElement === firstElement ||
            document.activeElement === windowRef.current
          ) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (
            document.activeElement === lastElement ||
            document.activeElement === windowRef.current
          ) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [onClose]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const bringToFront = () => {
    globalZIndex += 1;
    setZIndex(globalZIndex);
    onFocus?.();
  };

  const maximizeWindow = useCallback(() => {
    restoreBoundsRef.current = { position, size };
    const bounds = getMaximizedBounds();
    setPosition(bounds.position);
    setSize(bounds.size);
    setIsMaximized(true);
    bringToFront();
  }, [position, size]);

  const restoreWindow = useCallback((nextPosition?: { x: number; y: number }) => {
    const restored = restoreBoundsRef.current;
    setPosition(nextPosition ?? restored.position);
    setSize(restored.size);
    setIsMaximized(false);
    bringToFront();
  }, []);

  const toggleMaximize = useCallback(() => {
    if (isMobile) return;
    if (isMaximized) {
      restoreWindow();
    } else {
      maximizeWindow();
    }
  }, [isMobile, isMaximized, maximizeWindow, restoreWindow]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;

    if (e.target instanceof HTMLElement) {
      const isInteractive = e.target.closest(
        'input, textarea, button, [role="button"], a, select, [contenteditable="true"]'
      );
      const isHeader = e.target.closest('.window-header');
      const isResizeHandle = e.target.closest('.resize-handle');
      const isTrafficLight = e.target.closest('.traffic-light');

      if (isHeader || isResizeHandle || !isInteractive) {
        bringToFront();
      }

      // Double-click title bar to zoom (macOS)
      if (isHeader && !isTrafficLight && e.detail === 2) {
        e.preventDefault();
        toggleMaximize();
        return;
      }

      if (isHeader && !isTrafficLight) {
        // macOS: dragging a maximized window restores it, then continues the drag
        if (isMaximized) {
          const restored = restoreBoundsRef.current;
          const offsetX = Math.min(
            Math.max(e.clientX * (restored.size.width / Math.max(window.innerWidth, 1)), 24),
            restored.size.width - 24
          );
          const offsetY = Math.min(e.clientY - MENU_BAR_HEIGHT, 20);
          const nextPosition = {
            x: Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - restored.size.width)),
            y: Math.max(
              MENU_BAR_HEIGHT,
              Math.min(e.clientY - offsetY, window.innerHeight - restored.size.height)
            ),
          };
          pendingDragRef.current = { x: offsetX, y: offsetY };
          restoreWindow(nextPosition);
          setDragOffset({ x: offsetX, y: offsetY });
          setIsDragging(true);
          e.preventDefault();
          return;
        }

        setIsDragging(true);
        const rect = windowRef.current?.getBoundingClientRect();
        if (rect) {
          setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }
        e.preventDefault();
      } else if (isResizeHandle && !isMaximized) {
        setIsResizing(true);
        setResizeDirection(
          e.target.getAttribute('data-direction') as
            | 'bottom'
            | 'right'
            | 'bottom-right'
            | 'left'
            | 'bottom-left'
        );
        e.preventDefault();
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isMobile) return;

    if (isDragging) {
      const offset = pendingDragRef.current || dragOffset;
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;

      const windowWidth = windowRef.current?.offsetWidth || size.width;
      const windowHeight = windowRef.current?.offsetHeight || size.height;

      const maxX = window.innerWidth - windowWidth / 2;
      const maxY = window.innerHeight - windowHeight / 2;
      const minX = -windowWidth / 2;
      const minY = MENU_BAR_HEIGHT;

      setPosition({
        x: Math.max(minX, Math.min(newX, maxX)),
        y: Math.max(minY, Math.min(newY, maxY)),
      });
    } else if (isResizing && !isMaximized) {
      const rect = windowRef.current?.getBoundingClientRect();
      if (rect) {
        const newSize = { ...size };
        const newPosition = { ...position };

        if (resizeDirection?.includes('right')) {
          newSize.width = Math.max(MIN_WIDTH, e.clientX - rect.left);
        }

        if (resizeDirection?.includes('left')) {
          const newWidth = Math.max(MIN_WIDTH, rect.right - e.clientX);
          newSize.width = newWidth;
          newPosition.x = rect.right - newWidth;
        }

        if (resizeDirection?.includes('bottom')) {
          newSize.height = Math.max(MIN_HEIGHT, e.clientY - rect.top);
        }

        if (resizeDirection?.includes('bottom-left')) {
          const newWidth = Math.max(MIN_WIDTH, rect.right - e.clientX);
          newSize.width = newWidth;
          newPosition.x = rect.right - newWidth;
          newSize.height = Math.max(MIN_HEIGHT, e.clientY - rect.top);
        }

        setSize(newSize);
        setPosition(newPosition);
      }
    }
  };

  const handleMouseUp = () => {
    if (isMobile) return;
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
    pendingDragRef.current = null;
  };

  useEffect(() => {
    bringToFront();
    if (isMobile) return;

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, isResizing, resizeDirection, dragOffset, isMobile, size, position, isMaximized]);

  return (
    <div
      ref={windowRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="window-title"
      tabIndex={-1}
      className={`${
        isMobile ? 'fixed inset-0 m-4 rounded-xl' : 'absolute rounded-xl'
      } bg-[#1d1d1f] shadow-xl overflow-hidden p-0 transition-all duration-300 ${
        isDragging ? 'cursor-grabbing' : 'cursor-default'
      } ${isMaximized && !isMobile ? 'rounded-none' : ''} ${className}`}
      style={{
        ...(isMobile
          ? {}
          : {
              left: position.x,
              top: position.y,
              width: size.width,
              height: size.height,
              // Caller classNames often include max-w-* / max-h-* (e.g. md:max-w-4xl);
              // clear them while zoomed so the window can fill the desktop.
              ...(isMaximized ? { maxWidth: 'none', maxHeight: 'none' } : {}),
            }),
        zIndex,
        transition: isDragging || isResizing ? 'none' : 'all 0.2s ease-out',
      }}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
    >
      <div className="window-header group/header bg-gray-800 h-6 flex items-center space-x-2 px-4 sticky top-0 left-0 right-0 z-10 select-none">
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
          aria-label={`Close ${title}`}
          title="Close"
          className="traffic-light relative w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center"
        >
          <span className="pointer-events-none text-[8px] leading-none text-red-950 opacity-0 group-hover/header:opacity-100 font-bold">
            ×
          </span>
        </button>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            // Minimize-to-Dock is not modeled in this shell yet
          }}
          aria-label={`Minimize ${title}`}
          title="Minimize"
          className="traffic-light relative w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors flex items-center justify-center"
        >
          <span className="pointer-events-none text-[8px] leading-none text-yellow-950 opacity-0 group-hover/header:opacity-100 font-bold">
            −
          </span>
        </button>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            toggleMaximize();
          }}
          aria-label={isMaximized ? `Restore ${title}` : `Maximize ${title}`}
          title={isMaximized ? 'Restore' : 'Maximize'}
          className="traffic-light relative w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center disabled:opacity-40"
          disabled={isMobile}
        >
          {isMaximized ? (
            <span
              className="pointer-events-none opacity-0 group-hover/header:opacity-100 relative w-2 h-2"
              aria-hidden="true"
            >
              <span className="absolute left-0 top-0 w-1.5 h-1.5 border border-green-950 rounded-[1px]" />
              <span className="absolute right-0 bottom-0 w-1.5 h-1.5 border border-green-950 rounded-[1px] bg-green-500" />
            </span>
          ) : (
            <span
              className="pointer-events-none text-[9px] leading-none text-green-950 opacity-0 group-hover/header:opacity-100 font-bold"
              aria-hidden="true"
            >
              +
            </span>
          )}
        </button>
        <span
          id="window-title"
          className="text-sm text-gray-300 flex-grow text-center font-semibold pointer-events-none"
        >
          {title}
        </span>
      </div>
      <div className="relative h-[calc(100%-1.5rem)]">
        {children}
        {!isMobile && !isMaximized && (
          <>
            <div
              className="resize-handle absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize"
              data-direction="bottom"
            />
            <div
              className="resize-handle absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize"
              data-direction="right"
            />
            <div
              className="resize-handle absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize"
              data-direction="left"
            />
            <div
              className="resize-handle absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize"
              data-direction="bottom-right"
            />
            <div
              className="resize-handle absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize"
              data-direction="bottom-left"
            />
          </>
        )}
      </div>
    </div>
  );
}
