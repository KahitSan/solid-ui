import { Component, JSX, splitProps, createMemo } from 'solid-js';
import { Clock } from 'lucide-solid';
import styles from './ProgressBar.module.css';

export interface ProgressBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  // Core functionality
  progress: number; // Required progress percentage (0-100 for normal, >100 for overdue)

  // Display options
  icon?: Component<{ size: number; class?: string }>; // Custom icon component
  label?: string; // Additional label (right side)
  statusLabel?: string; // Status label (left side)
  shimmer?: boolean; // Whether to show continuous shimmer effect

  // Positioning
  position?: 'left' | 'right'; // Direction of progress fill

  // Styling
  class?: string;
}

// Utility to combine class names
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Utility to extract color family from Tailwind classes
function extractColorInfo(className: string) {
  const colorMap = {
    'red': {
      fill: 'rgba(255, 68, 68, 0.2)',
      indicator: '#FF4444',
      stripe: 'rgba(255, 68, 68, 0.4)',
      overdue: 'rgba(255, 68, 68, 0.4)',
      shimmer: 'rgba(255, 68, 68, 0.3)',
    },
    'green': {
      fill: 'rgba(0, 204, 136, 0.2)',
      indicator: '#00CC88',
      stripe: 'rgba(0, 204, 136, 0.4)',
      overdue: 'rgba(0, 204, 136, 0.4)',
      shimmer: 'rgba(0, 204, 136, 0.3)',
    },
    'blue': {
      fill: 'rgba(74, 158, 255, 0.2)',
      indicator: '#4A9EFF',
      stripe: 'rgba(74, 158, 255, 0.4)',
      overdue: 'rgba(74, 158, 255, 0.4)',
      shimmer: 'rgba(74, 158, 255, 0.3)',
    },
    'amber': {
      fill: 'rgba(245, 158, 11, 0.2)',
      indicator: '#F59E0B',
      stripe: 'rgba(245, 158, 11, 0.4)',
      overdue: 'rgba(245, 158, 11, 0.4)',
      shimmer: 'rgba(245, 158, 11, 0.3)',
    },
    'orange': {
      fill: 'rgba(255, 136, 51, 0.2)',
      indicator: '#FF8833',
      stripe: 'rgba(255, 136, 51, 0.4)',
      overdue: 'rgba(255, 136, 51, 0.4)',
      shimmer: 'rgba(255, 136, 51, 0.3)',
    },
    'purple': {
      fill: 'rgba(168, 85, 247, 0.2)',
      indicator: '#A855F7',
      stripe: 'rgba(168, 85, 247, 0.4)',
      overdue: 'rgba(168, 85, 247, 0.4)',
      shimmer: 'rgba(168, 85, 247, 0.3)',
    },
    'slate': {
      fill: 'rgba(148, 163, 184, 0.2)',
      indicator: '#94A3B8',
      stripe: 'rgba(148, 163, 184, 0.4)',
      overdue: 'rgba(148, 163, 184, 0.4)',
      shimmer: 'rgba(148, 163, 184, 0.3)',
    },
    'gray': {
      fill: 'rgba(156, 163, 175, 0.2)',
      indicator: '#9CA3AF',
      stripe: 'rgba(156, 163, 175, 0.4)',
      overdue: 'rgba(156, 163, 175, 0.4)',
      shimmer: 'rgba(156, 163, 175, 0.3)',
    },
  };

  for (const [colorName, colorValues] of Object.entries(colorMap)) {
    if (className.includes(colorName)) {
      return colorValues;
    }
  }

  return colorMap.green; // default
}

// Extract text size for icon scaling
function extractTextSize(className: string): number {
  if (className.includes('text-xs')) return 12;
  if (className.includes('text-sm')) return 14;
  if (className.includes('text-base')) return 16;
  if (className.includes('text-lg')) return 18;
  if (className.includes('text-xl')) return 20;
  if (className.includes('text-2xl')) return 24;
  return 16; // default
}

const ProgressBar: Component<ProgressBarProps> = (props) => {
  const [local, others] = splitProps(props, [
    'progress',
    'icon',
    'label',
    'statusLabel',
    'shimmer',
    'position',
    'class',
  ]);

  // ✅ Use accessors for reactivity with defaults
  const progressVal = () => local.progress ?? 0;
  const Icon = () => local.icon ?? null;
  const position = () => local.position ?? 'left';
  const shimmer = () => local.shimmer ?? false;
  const statusLabel = () => local.statusLabel;
  const label = () => local.label;
  const classProp = () => local.class;

  // Calculate progress and overdue
  const progressInfo = createMemo(() => {
    const p = Math.max(0, Math.min(100, progressVal()));
    const overdue = Math.max(0, progressVal() - 100);
    return { progress: p, overdue };
  });

  // Extract color info from class
  const colorInfo = createMemo(() => extractColorInfo(classProp() || ''));

  // Extract icon size from text class
  const iconSize = createMemo(() => extractTextSize(classProp() || ''));

  // Container classes with defaults
  const containerClasses = createMemo(() => {
    return cn(
      'select-none relative overflow-hidden rounded bg-black/20 border border-gray-600/30',
      'h-8', // default height
      !classProp()?.includes('w-') ? 'w-80' : '', // default width
      classProp()
    );
  });

  // Progress fill style
  const progressStyle = createMemo(() => {
    const colors = colorInfo();
    const { progress } = progressInfo();
    const isRight = position() === 'right';

    return {
      width: `${progress}%`,
      'background-color': colors.fill,
      ...(isRight && {
        position: 'absolute',
        right: 0,
        'border-radius': '0 4px 4px 0',
      }),
    };
  });

  // Overdue section style
  const overdueStyle = createMemo(() => {
    const colors = colorInfo();
    const { overdue } = progressInfo();
    const isRight = position() === 'right';
    const visibleOverdue = Math.min(90, overdue); // cap visualization

    if (isRight) {
      return {
        width: `${visibleOverdue}%`,
        'background-color': colors.overdue,
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
        'border-radius': '4px 0 0 4px',
      };
    } else {
      const startPosition = Math.max(10, 100 - visibleOverdue);
      return {
        width: `${visibleOverdue}%`,
        'background-color': colors.overdue,
        position: 'absolute',
        left: `${startPosition}%`,
        top: 0,
        height: '100%',
        'border-radius': '0 4px 4px 0',
      };
    }
  });

  // Indicator line style (progress edge)
  const indicatorStyle = createMemo(() => {
    const colors = colorInfo();
    const isRight = position() === 'right';
    return {
      'background-color': colors.indicator,
      ...(isRight ? { left: 0 } : { right: 0 }),
    };
  });

  // Overdue indicator line style
  const overdueIndicatorStyle = createMemo(() => {
    const colors = colorInfo();
    const isRight = position() === 'right';
    return {
      'background-color': colors.indicator,
      ...(isRight ? { right: 0 } : { left: 0 }),
    };
  });

  // Text/icon color based on theme
  const textColor = createMemo(() => ({
    color: colorInfo().indicator,
  }));

  // Shimmer animation style
  const shimmerStyle = createMemo(() => ({
    background: `linear-gradient(90deg, transparent, ${colorInfo().shimmer}, transparent)`,
  }));

  return (
    <div class={containerClasses()} {...others}>
      {/* Progress fill */}
      <div
        class={cn('h-full transition-all duration-1000 relative', styles['ks-progress-fill'])}
        style={progressStyle()}
      >
        {/* Shimmer effect */}
        {shimmer() && progressInfo().overdue <= 0 && (
          <div
            class={cn('absolute inset-0', styles['animate-shimmer'])}
            style={shimmerStyle()}
          />
        )}

        {/* Progress indicator line */}
        {progressInfo().overdue <= 0 && (
          <div
            class="absolute top-0 w-1 h-full ks-progress-indicator animate-pulse"
            style={indicatorStyle()}
          />
        )}
      </div>

      {/* Overdue section */}
      {progressInfo().overdue > 0 && (
        <div
          class={cn('transition-all duration-1000 relative animate-pulse', styles['ks-progress-overdue'])}
          style={overdueStyle()}
        >
          <div
            class="absolute top-0 w-1 h-full ks-progress-indicator animate-pulse"
            style={overdueIndicatorStyle()}
          />
        </div>
      )}

      {/* Content overlay */}
      <div class="absolute inset-0 flex items-center justify-between px-3">
        {/* Left side: icon, status, label */}
        <div class="flex items-center gap-2 min-w-0 flex-1">
          {(() => {
            const IconComponent = Icon();
            return IconComponent ? <IconComponent size={iconSize()} style={textColor()} /> : null;
          })()}

          {statusLabel() && (
            <span class="font-medium" style={textColor()}>
              {statusLabel()}
            </span>
          )}

          {label() && (
            <>
              {(Icon() || statusLabel()) && <span class="text-gray-500 mx-1">•</span>}
              <span class="flex-1 min-w-0">
                <span class="text-gray-400 block overflow-hidden text-ellipsis whitespace-nowrap">
                  {label()}
                </span>
              </span>
            </>
          )}
        </div>

        {/* Right side: percentage */}
        <div class="flex-shrink-0 ml-2 text-right">
          <span class="font-mono font-medium text-gray-400">
            {Math.round(progressVal())}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;