import { Component, JSX, splitProps, createMemo, mergeProps } from 'solid-js';
import { Clock } from 'lucide-solid';
import styles from './ProgressBar.module.css';

export type ProgressBarStatus = 'active' | 'warning' | 'urgent' | 'completed' | 'paused';
export type ProgressBarSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  // Core functionality
  progress: number; // 0-100
  timeRemaining: string;
  status?: ProgressBarStatus;
  
  // Display options
  size?: ProgressBarSize;
  showPercentage?: boolean;
  showIcon?: boolean;
  label?: string;
  
  // Styling
  class?: string;
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

const ProgressBar: Component<ProgressBarProps> = (props) => {
  // Default props
  const defaultProps = {
    status: 'active' as const,
    size: 'md' as const,
    showPercentage: true,
    showIcon: true,
  };

  const merged = mergeProps(defaultProps, props);
  
  const [local, others] = splitProps(merged, [
    'progress',
    'timeRemaining', 
    'status',
    'size',
    'showPercentage',
    'showIcon',
    'label',
    'class',
  ]);

  // Status information with colors and behavior
  const statusInfo = createMemo(() => {
    const statusMap = {
      active: {
        color: '#00CC88',
        bgColor: 'rgba(0, 204, 136, 0.15)',
        borderColor: 'rgba(0, 204, 136, 0.3)',
        shouldPulse: false,
      },
      warning: {
        color: '#FF8833',
        bgColor: 'rgba(255, 136, 51, 0.15)',
        borderColor: 'rgba(255, 136, 51, 0.3)',
        shouldPulse: true,
      },
      urgent: {
        color: '#FF4444',
        bgColor: 'rgba(255, 68, 68, 0.15)',
        borderColor: 'rgba(255, 68, 68, 0.3)',
        shouldPulse: true,
      },
      completed: {
        color: '#8A8A8A',
        bgColor: 'rgba(138, 138, 138, 0.15)',
        borderColor: 'rgba(138, 138, 138, 0.3)',
        shouldPulse: false,
      },
      paused: {
        color: '#4A9EFF',
        bgColor: 'rgba(74, 158, 255, 0.15)',
        borderColor: 'rgba(74, 158, 255, 0.3)',
        shouldPulse: false,
      },
    };

    return statusMap[local.status];
  });

  // Size configurations
  const sizeConfig = createMemo(() => {
    const sizeMap = {
      sm: {
        height: 'h-6',
        textSize: 'text-xs',
        iconSize: 12,
      },
      md: {
        height: 'h-8',
        textSize: 'text-sm',
        iconSize: 16,
      },
      lg: {
        height: 'h-10',
        textSize: 'text-base',
        iconSize: 20,
      },
    };

    return sizeMap[local.size];
  });

  // Container classes
  const containerClasses = createMemo(() => {
    const config = sizeConfig();
    const status = statusInfo();
    
    return cn(
      'relative overflow-hidden rounded border transition-all duration-300',
      config.height,
      'bg-black/30',
      // Default width on small screens; full width on mobile if no class sets width
      !local.class?.includes('w-') ? 'w-full sm:w-80' : '',
      status.shouldPulse && styles['ks-timer-pulse'],
      local.class
    );
  });

  // Dynamic styles for theming
  const containerStyle = createMemo(() => {
    const status = statusInfo();
    return {
      'border-color': status.borderColor,
    };
  });

  const progressStyle = createMemo(() => {
    const status = statusInfo();
    return {
      width: `${Math.max(0, Math.min(100, local.progress))}%`,
      'background-color': status.bgColor,
      '--ks-status-color': status.color,
    };
  });

  const textStyle = createMemo(() => {
    const status = statusInfo();
    return {
      color: status.color,
    };
  });

  return (
    <div
      class={containerClasses()}
      style={containerStyle()}
      {...others}
    >
      {/* Progress fill background */}
      <div 
        class={cn(
          'h-full transition-all duration-1000 relative',
          styles['ks-progress-fill'],
          statusInfo().shouldPulse && styles['ks-progress-pulse']
        )}
        style={progressStyle()}
      >
        {/* Animated indicator line at the right edge */}
        <div 
          class={cn(
            'absolute top-0 right-0 w-1 h-full',
            styles['ks-progress-indicator']
          )}
          style={{ 'background-color': statusInfo().color }}
        />
      </div>

      {/* Content overlay with proper spacing */}
      <div class="absolute inset-0 flex items-center justify-between px-3">
        {/* Left side - Timer and label */}
        <div class="flex items-center gap-2 min-w-0 flex-1">
          {local.showIcon && (
            <Clock 
              size={sizeConfig().iconSize} 
              style={textStyle()}
            />
          )}
          <span 
            class={cn(
              sizeConfig().textSize,
              'font-mono font-medium',
              styles['ks-timer-text']
            )}
            style={textStyle()}
          >
            {local.timeRemaining}
          </span>
          {local.label && (
            <>
              <span class="text-gray-500 mx-1">•</span>
              <span class="flex-1 min-w-0">
                <span 
                  class={cn(
                    sizeConfig().textSize,
                    'text-gray-400 block overflow-hidden text-ellipsis whitespace-nowrap'
                  )}
                >
                  {local.label}
                </span>
              </span>
            </>
          )}
        </div>

        {/* Right side - Percentage */}
        {local.showPercentage && (
          <div class="flex-shrink-0 ml-2 text-right">
            <span 
              class={cn(
                sizeConfig().textSize,
                'font-mono font-medium text-gray-400'
              )}
            >
              {Math.round(local.progress)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;