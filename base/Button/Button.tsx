// Button.tsx
import { splitProps, createSignal, onCleanup, createMemo, mergeProps, Component } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import styles from './Button.module.css';

// Define button types and variants
type ButtonType = 'primary' | 'danger' | 'secondary';
type ButtonVariant = 'clip1' | 'clip2' | 'ghost' | 'link';

export interface ButtonProps {
  // Polymorphic component prop
  as?: any;
  
  // Semantic styling props
  type?: ButtonType;
  variant?: ButtonVariant;
  
  // Effect toggles
  noRipple?: boolean;
  noScanline?: boolean;
  noGlow?: boolean;
  noPulse?: boolean;
  
  // Icon props
  icon?: Component<{ size?: number; class?: string }>;
  iconPosition?: 'left' | 'right';
  
  // Standard HTML attributes
  class?: string;
  disabled?: boolean;
  children?: any;
  
  // Event handlers
  onClick?: (event: MouseEvent) => void;
  
  // Allow any additional props for polymorphic usage
  [key: string]: any;
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Define type configurations
const buttonTypeConfig = {
  primary: {
    textColor: 'text-amber-400',
    background: 'bg-amber-600/20 border-amber-600/60',
    hover: 'hover:bg-amber-600/30 hover:border-amber-500',
    colors: {
      ripple: 'rgba(255, 255, 255, 0.3)',
      effect: 'rgba(201, 169, 97, 0.4)',
      effectBg: 'rgba(201, 169, 97, 0.1)',
      effectBorder: 'rgba(201, 169, 97, 0.4)',
      effectGlow: 'rgba(201, 169, 97, 0.3)'
    }
  },
  danger: {
    textColor: 'text-red-400',
    background: 'bg-red-600/20 border-red-600/60',
    hover: 'hover:bg-red-600/30 hover:border-red-500',
    colors: {
      ripple: 'rgba(255, 255, 255, 0.3)',
      effect: 'rgba(255, 68, 68, 0.4)',
      effectBg: 'rgba(255, 68, 68, 0.1)',
      effectBorder: 'rgba(255, 68, 68, 0.4)',
      effectGlow: 'rgba(255, 68, 68, 0.3)'
    }
  },
  secondary: {
    textColor: 'text-slate-400',
    background: 'bg-slate-600/20 border-slate-600/60',
    hover: 'hover:bg-slate-600/30 hover:border-slate-500',
    colors: {
      ripple: 'rgba(255, 255, 255, 0.3)',
      effect: 'rgba(148, 163, 184, 0.4)',
      effectBg: 'rgba(148, 163, 184, 0.1)',
      effectBorder: 'rgba(148, 163, 184, 0.4)',
      effectGlow: 'rgba(148, 163, 184, 0.3)'
    }
  }
};

// Define variant configurations
const buttonVariantConfig = {
  clip1: {
    effects: ['clip-top-left-bottom-right'],
    baseClasses: 'px-4 py-2 border',
    overrideType: false // Use type-based styling
  },
  clip2: {
    effects: ['clip-top-right-bottom-left'],
    baseClasses: 'px-4 py-2 border',
    overrideType: false // Use type-based styling
  },
  ghost: {
    effects: [],
    baseClasses: 'px-4 py-2 bg-transparent border-transparent hover:bg-current/10 hover:border-transparent',
    overrideType: true // Override type styling for transparent background
  },
  link: {
    effects: [],
    baseClasses: 'px-0 py-0 bg-transparent border-transparent underline-offset-4 hover:underline hover:bg-transparent hover:border-transparent',
    overrideType: true // Override type styling for transparent background
  }
};

// @ts-ignore
const Button: Component<ButtonProps> = (props) => {
  // Default props
  const defaultProps = {
    as: 'button',
    type: 'primary' as ButtonType,
    variant: 'clip1' as ButtonVariant,
    noRipple: false,
    noScanline: false,
    noGlow: false,
    noPulse: false,
    iconPosition: 'left' as const,
  };

  const merged = mergeProps(defaultProps, props);
  
  const [local, others] = splitProps(merged, [
    'as',
    'type',
    'variant',
    'noRipple',
    'noScanline',
    'noGlow',
    'noPulse',
    'icon',
    'iconPosition',
    'class',
    'children',
    'onClick',
    'disabled',
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

  let elementRef: HTMLElement | undefined;
  let mouseDownTime = 0;

  // Auto-detect icon-only mode when no children provided
  const isIconOnly = createMemo(() => !local.children && local.icon);

  // Get type and variant configurations
  const typeConfig = createMemo(() => buttonTypeConfig[local.type]);
  const variantConfig = createMemo(() => buttonVariantConfig[local.variant]);

  // Determine if ripple should be enabled
  const hasRipple = createMemo(() => {
    if (local.noRipple) return false;
    // Disable ripple for link variant as it doesn't make sense (like old implementation)
    if (local.variant === 'link') return false;
    return true;
  });

  // Determine active effects
  const activeEffects = createMemo(() => {
    const effects: string[] = [...variantConfig().effects];
    
    // Add scanline by default unless disabled
    if (!local.noScanline) {
      effects.push('scanline');
    }
    
    // Add other effects if not disabled
    if (!local.noGlow) {
      // Could add glow to certain variants if needed
    }
    
    if (!local.noPulse) {
      // Could add pulse to certain variants if needed
    }
    
    return effects;
  });

  // Map effects to CSS classes
  const effectClasses = createMemo(() => {
    return activeEffects().map((effect) => {
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
    }).filter(Boolean);
  });

  // Dynamic CSS custom properties based on type colors
  const customProperties = createMemo(() => {
    const colors = typeConfig().colors;
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
    // Core structural classes
    const coreClasses = 'select-none inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none text-sm rounded';
    
    // Text color from type (always applied)
    const textColor = typeConfig().textColor;
    
    // Background and hover classes (only if variant doesn't override)
    const backgroundClasses = variantConfig().overrideType ? '' : `${typeConfig().background} ${typeConfig().hover}`;
    
    // Variant-based styling
    const variantClasses = variantConfig().baseClasses;
    
    return cn(
      coreClasses,
      textColor, // Always include text color from type
      backgroundClasses, // Only include if variant allows
      variantClasses,
      local.class, // User's additional classes
      hasRipple() && styles['ks-btn-ripple'],
      !hasRipple() && styles['ks-interactive'],
      isIconOnly() && 'aspect-square !p-2',
      ...effectClasses(),
      local.disabled && 'opacity-50 cursor-not-allowed'
    );
  });

  const handleMouseDown = (event: MouseEvent) => {
    if (local.disabled) return;

    if (hasRipple() && elementRef) {
      mouseDownTime = Date.now();

      const rect = elementRef.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;

      const rippleId = Date.now() + Math.random();
      setRipples((prev) => [...prev, { id: rippleId, x, y, size, isFading: false }]);
    }
  };

  const handleMouseUp = () => {
    if (!hasRipple() || local.disabled) return;

    const timeSinceMouseDown = Date.now() - mouseDownTime;
    const minExpandTime = 400;

    const delayBeforeFade = Math.max(0, minExpandTime - timeSinceMouseDown);

    setTimeout(() => {
      setRipples((prev) => prev.map((ripple) => ({ ...ripple, isFading: true })));

      setTimeout(() => {
        setRipples([]);
      }, 400);
    }, delayBeforeFade);
  };

  const handleMouseLeave = () => {
    if (local.disabled) return;
    handleMouseUp();
  };

  const handleClick = (event: MouseEvent) => {
    if (local.onClick && !local.disabled) {
      local.onClick(event);
    }
  };

  const renderContent = createMemo(() => {
    const IconComponent = local.icon;

    if (isIconOnly() && IconComponent) {
      return <IconComponent />;
    }

    if (IconComponent && local.children) {
      const icon = <IconComponent />;
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
      return <IconComponent />;
    }

    return local.children;
  });

  onCleanup(() => {
    setRipples([]);
  });

  return (
    <Dynamic
      component={local.as}
      ref={(el: HTMLElement) => {
        elementRef = el;
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
      disabled={local.disabled}
      {...others}
    >
      {renderContent()}

      {hasRipple() &&
        ripples().map((ripple) => (
          <span
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
    </Dynamic>
  );
};

export default Button;