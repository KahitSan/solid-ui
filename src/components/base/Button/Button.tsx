import { Component, JSX, splitProps, createSignal, onCleanup, createMemo, mergeProps, createEffect } from 'solid-js';
import styles from './Button.module.css';

// Define possible HUD effects as a type
type HUDEffect =
  | 'scanline'
  | 'clip-top-left-bottom-right'
  | 'clip-top-right-bottom-left'
  | 'clip-minimal-top-left-bottom-right'
  | 'clip-minimal-top-right-bottom-left'
  | 'clip-inset-top-left-bottom-right'
  | 'glow'
  | 'pulse';

export interface ButtonProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  // Custom props for HUD functionality
  effect?: HUDEffect | HUDEffect[] | string;
  ripple?: boolean;
  icon?: Component<{ size: number; class?: string }>;
  iconPosition?: 'left' | 'right';
  iconSize?: number;
  
  // Override onClick to ensure proper typing
  onClick?: (event: MouseEvent) => void;
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Utility to extract color family from Tailwind classes
function extractColorInfo(className: string) {
  const colorMap = {
    // Red family
    'red': { 
      r: 255, g: 68, b: 68,
      ripple: 'rgba(255, 255, 255, 0.3)',
      effect: 'rgba(255, 68, 68, 0.4)',
      effectBg: 'rgba(255, 68, 68, 0.1)',
      effectBorder: 'rgba(255, 68, 68, 0.4)',
      effectGlow: 'rgba(255, 68, 68, 0.3)'
    },
    // Green family
    'green': { 
      r: 0, g: 204, b: 136,
      ripple: 'rgba(255, 255, 255, 0.3)',
      effect: 'rgba(0, 204, 136, 0.4)',
      effectBg: 'rgba(0, 204, 136, 0.1)',
      effectBorder: 'rgba(0, 204, 136, 0.4)',
      effectGlow: 'rgba(0, 204, 136, 0.3)'
    },
    // Blue family
    'blue': { 
      r: 74, g: 158, b: 255,
      ripple: 'rgba(255, 255, 255, 0.3)',
      effect: 'rgba(74, 158, 255, 0.4)',
      effectBg: 'rgba(74, 158, 255, 0.1)',
      effectBorder: 'rgba(74, 158, 255, 0.4)',
      effectGlow: 'rgba(74, 158, 255, 0.3)'
    },
    // Purple family
    'purple': { 
      r: 168, g: 85, b: 247,
      ripple: 'rgba(255, 255, 255, 0.3)',
      effect: 'rgba(168, 85, 247, 0.4)',
      effectBg: 'rgba(168, 85, 247, 0.1)',
      effectBorder: 'rgba(168, 85, 247, 0.4)',
      effectGlow: 'rgba(168, 85, 247, 0.3)'
    },
    // Pink family
    'pink': { 
      r: 244, g: 114, b: 182,
      ripple: 'rgba(255, 255, 255, 0.3)',
      effect: 'rgba(244, 114, 182, 0.4)',
      effectBg: 'rgba(244, 114, 182, 0.1)',
      effectBorder: 'rgba(244, 114, 182, 0.4)',
      effectGlow: 'rgba(244, 114, 182, 0.3)'
    },
    // Yellow family
    'yellow': { 
      r: 255, g: 220, b: 93,
      ripple: 'rgba(0, 0, 0, 0.2)', // Dark ripple for light colors
      effect: 'rgba(255, 220, 93, 0.4)',
      effectBg: 'rgba(255, 220, 93, 0.1)',
      effectBorder: 'rgba(255, 220, 93, 0.4)',
      effectGlow: 'rgba(255, 220, 93, 0.3)'
    },
    // Amber family (default)
    'amber': { 
      r: 201, g: 169, b: 97,
      ripple: 'rgba(255, 255, 255, 0.3)',
      effect: 'rgba(201, 169, 97, 0.4)',
      effectBg: 'rgba(201, 169, 97, 0.1)',
      effectBorder: 'rgba(201, 169, 97, 0.4)',
      effectGlow: 'rgba(201, 169, 97, 0.3)'
    },
    // Orange family
    'orange': { 
      r: 255, g: 165, b: 0,
      ripple: 'rgba(255, 255, 255, 0.3)',
      effect: 'rgba(255, 165, 0, 0.4)',
      effectBg: 'rgba(255, 165, 0, 0.1)',
      effectBorder: 'rgba(255, 165, 0, 0.4)',
      effectGlow: 'rgba(255, 165, 0, 0.3)'
    },
    // Slate/Gray family
    'slate': { 
      r: 148, g: 163, b: 184,
      ripple: 'rgba(255, 255, 255, 0.3)',
      effect: 'rgba(148, 163, 184, 0.4)',
      effectBg: 'rgba(148, 163, 184, 0.1)',
      effectBorder: 'rgba(148, 163, 184, 0.4)',
      effectGlow: 'rgba(148, 163, 184, 0.3)'
    },
    'gray': { 
      r: 156, g: 163, b: 175,
      ripple: 'rgba(255, 255, 255, 0.3)',
      effect: 'rgba(156, 163, 175, 0.4)',
      effectBg: 'rgba(156, 163, 175, 0.1)',
      effectBorder: 'rgba(156, 163, 175, 0.4)',
      effectGlow: 'rgba(156, 163, 175, 0.3)'
    }
  };

  // Look for color family in className
  for (const [colorName, colorValues] of Object.entries(colorMap)) {
    if (className.includes(colorName)) {
      return colorValues;
    }
  }

  // Default to amber if no color found
  return colorMap.amber;
}

const Button: Component<ButtonProps> = (props) => {
  // Default props
  const defaultProps = {
    ripple: true,
    iconPosition: 'left' as const,
    iconSize: 16,
  };

  const merged = mergeProps(defaultProps, props);
  
  const [local, others] = splitProps(merged, [
    'effect',
    'ripple',
    'icon',
    'iconPosition',
    'iconSize',
    'class',
    'children',
    'onClick',
  ]);

  const [ripples, setRipples] = createSignal<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      isFading: boolean;
    }>
  >([]);

  const [blink, setBlink] = createSignal(false);

  let buttonRef: HTMLButtonElement | undefined;
  let mouseDownTime = 0;

  // Auto-detect icon-only mode when no children provided
  const isIconOnly = createMemo(() => !local.children && local.icon);

  // Extract color information from Tailwind classes
  const colorInfo = createMemo(() => {
    return extractColorInfo(local.class || '');
  });

  // Default ripple to true, but disable for clip-inset effects
  const hasRipple = createMemo(() => {
    if (local.ripple === false) return false;
    
    // Disable ripple for clip-inset effects as they interfere with the layout
    const effects = Array.isArray(local.effect) 
      ? local.effect 
      : (local.effect || '').split(' ').map(e => e.trim()).filter(Boolean);
    
    if (effects.includes('clip-inset-top-left-bottom-right')) return false;
    
    return true;
  });

  // Parse effects once - handle array, single effect, or space-delimited string
  const parsedEffects = createMemo(() => {
    if (!local.effect) return [];

    const effectsArray = Array.isArray(local.effect)
      ? local.effect
      : local.effect.split(' ').map((e) => e.trim()).filter(Boolean);

    return effectsArray.map((effect) => {
      const effectMap: Record<string, string> = {
        'scanline': styles['ks-hud-scan-line'],
        'clip-top-left-bottom-right': styles['ks-hud-clip-top-left-bottom-right'],
        'clip-top-right-bottom-left': styles['ks-hud-clip-top-right-bottom-left'],
        'clip-minimal-top-left-bottom-right': styles['ks-hud-clip-minimal-top-left-bottom-right'],
        'clip-minimal-top-right-bottom-left': styles['ks-hud-clip-minimal-top-right-bottom-left'],
        'clip-inset-top-left-bottom-right': styles['ks-hud-clip-inset-top-left-bottom-right'],
        'glow': styles['ks-hud-glow'],
        'pulse': styles['ks-hud-pulse'],
      };
      return effectMap[effect];
    }).filter(Boolean) as string[];
  });

  // Dynamic CSS custom properties based on detected colors
  const customProperties = createMemo(() => {
    const colors = colorInfo();
    return {
      '--ks-effect-color': colors.effect,
      '--ks-effect-bg': colors.effectBg,
      '--ks-effect-border': colors.effectBorder,
      '--ks-effect-bg-hover': colors.effect.replace('0.1', '0.2'),
      '--ks-effect-border-hover': colors.effect.replace('0.4', '0.6'),
      '--ks-effect-glow': colors.effectGlow,
      '--ks-effect-glow-hover': colors.effectGlow.replace('0.3', '0.5'),
      '--ks-effect-pulse-bg': colors.effectBg,
      '--ks-effect-pulse-bg-mid': colors.effect.replace('0.4', '0.2'),
      '--ks-effect-pulse-glow': colors.effectGlow.replace('0.3', '0.2'),
      '--ks-effect-pulse-glow-mid': colors.effectGlow,
      '--ks-ripple-color': colors.ripple,
    };
  });

  const classes = createMemo(() => {
    // Core structural classes that should never be overridden
    const coreClasses = 'select-none inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none';
    
    // Default styling classes as fallbacks (user classes will override these)
    const defaultStyling = 'px-4 py-2 text-sm rounded bg-amber-600/20 border border-amber-600/60 text-amber-400 hover:bg-amber-600/30 hover:border-amber-500';
    
    return cn(
      coreClasses, // Always applied - core layout
      defaultStyling, // Default styling as fallback
      local.class, // User's classes override defaults where they conflict
      hasRipple() && styles['ks-btn-ripple'], // Add ripple container if needed
      !hasRipple() && styles['ks-interactive'], // Basic interaction for non-ripple buttons
      isIconOnly() && 'aspect-square !p-2', // Icon-only adjustments (using !p-2 to override padding)
      ...parsedEffects(), // Custom HUD effects
      blink() && styles['ks-btn-link-blink'], // Link blink effect (controlled by stories)
    );
  });

  const handleMouseDown = (event: MouseEvent) => {
    if (others.disabled) return;

    // Ripple effect for buttons with ripple enabled
    if (hasRipple() && buttonRef) {
      mouseDownTime = Date.now();

      const rect = buttonRef.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;

      const rippleId = Date.now() + Math.random();
      setRipples((prev) => [...prev, { id: rippleId, x, y, size, isFading: false }]);
    }
  };

  const handleMouseUp = () => {
    if (!hasRipple() || others.disabled) return;

    const timeSinceMouseDown = Date.now() - mouseDownTime;
    const minExpandTime = 400; // ripple expand duration

    const delayBeforeFade = Math.max(0, minExpandTime - timeSinceMouseDown);

    setTimeout(() => {
      // Start fading ripples
      setRipples((prev) => prev.map((ripple) => ({ ...ripple, isFading: true })));

      // After fade completes, cleanup
      setTimeout(() => {
        setRipples([]); // cleanup ripples
      }, 400); // matches ks-btn-ripple-fade animation duration
    }, delayBeforeFade);
  };

  const handleMouseLeave = () => {
    handleMouseUp();
  };

  const handleClick = (event: MouseEvent) => {
    if (local.onClick && !others.disabled) {
      local.onClick(event);
    }
  };

  const renderContent = createMemo(() => {
    const IconComponent = local.icon;
    const iconSize = local.iconSize!;

    if (isIconOnly() && IconComponent) {
      return <IconComponent size={iconSize} />;
    }

    if (IconComponent && local.children) {
      const icon = <IconComponent size={iconSize} />;
      const position = local.iconPosition;

      return position === 'left' ? (
        <>
          {icon}
          {local.children}
        </>
      ) : (
        <>
          {local.children}
          {icon}
        </>
      );
    }

    if (IconComponent) {
      return <IconComponent size={iconSize} />;
    }

    return local.children;
  });

  // Cleanup
  onCleanup(() => {
    setRipples([]);
  });

  return (
    <button
      ref={(el) => {
        buttonRef = el;
        if (typeof others.ref === 'function') {
          others.ref(el);
        }
      }}
      class={classes()}
      style={customProperties()}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...others}
    >
      {renderContent()}

      {/* Render ripples for buttons with ripple enabled */}
      {hasRipple() &&
        ripples().map((ripple) => (
          <span
            key={ripple.id}
            class={cn(
              styles['ks-btn-ripple-effect'],
              ripple.isFading && styles['ks-btn-ripple-fade']
            )}
            style={{
              left: `${ripple.x - ripple.size / 2}px`,
              top: `${ripple.y - ripple.size / 2}px`,
              width: `${ripple.size}px`,
              height: `${ripple.size}px`,
              'background-color': 'var(--ks-ripple-color, rgba(255, 255, 255, 0.3))',
            }}
          />
        ))}
    </button>
  );
};

export default Button;