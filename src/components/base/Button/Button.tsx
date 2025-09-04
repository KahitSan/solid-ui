import { Component, JSX, splitProps, createSignal, onCleanup, createMemo } from 'solid-js';
import styles from './Button.module.css';
import effects from './effects.module.css';

// Define possible effects as a type
type HUDEffect =
  | 'scanline'
  | 'clip-top-left-bottom-right'
  | 'clip-top-right-bottom-left'
  | 'clip-minimal-top-left-bottom-right'
  | 'clip-minimal-top-right-bottom-left'
  | 'clip-inset-top-left-bottom-right'
  | 'glow'
  | 'pulse';

export interface ButtonProps {
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  effect?: HUDEffect | HUDEffect[] | string; // Allow array, single effect, or space-delimited string
  children?: JSX.Element;
  icon?: Component<{ size: number }>;
  iconPosition?: 'left' | 'right';
  class?: string;
  style?: JSX.CSSProperties;
  disabled?: boolean;
  ripple?: boolean;
  onClick?: (event: MouseEvent) => void;
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

const Button: Component<ButtonProps> = (props) => {
  const [local, others] = splitProps(props, [
    'variant',
    'size',
    'effect',
    'children',
    'icon',
    'iconPosition',
    'class',
    'style',
    'disabled',
    'ripple',
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

  // Get current variant
  const currentVariant = createMemo(() => local.variant || 'default');

  // Parse effects once - handle array, single effect, or space-delimited string
  const parsedEffects = createMemo(() => {
    if (!local.effect) return [];

    const effectsArray = Array.isArray(local.effect)
      ? local.effect
      : local.effect.split(' ').map((e) => e.trim()).filter(Boolean);

    return effectsArray.map((effect) => {
      const effectMap: Record<string, string> = {
        'scanline': effects['ks-hud-scan-line'],
        'clip-top-left-bottom-right': effects['ks-hud-clip-top-left-bottom-right'],
        'clip-top-right-bottom-left': effects['ks-hud-clip-top-right-bottom-left'],
        'clip-minimal-top-left-bottom-right': effects['ks-hud-clip-minimal-top-left-bottom-right'],
        'clip-minimal-top-right-bottom-left': effects['ks-hud-clip-minimal-top-right-bottom-left'],
        'clip-inset-top-left-bottom-right': effects['ks-hud-clip-inset-top-left-bottom-right'],
        'glow': effects['ks-hud-glow'],
        'pulse': effects['ks-hud-pulse'],
      };
      return effectMap[effect];
    }).filter(Boolean) as string[];
  });

  const classes = createMemo(() => {
    const variant = currentVariant();
    const size = local.size || 'md';

    return cn(
      styles['ks-btn'],
      effects[`ks-variant-${variant}`],
      styles[`ks-btn-${size}`],
      isIconOnly() && styles['ks-btn-icon-only'],
      hasRipple() && currentVariant() !== 'link' && styles['ks-btn-ripple'],
      !hasRipple() && effects['ks-interactive'],
      ...parsedEffects(),
      blink() && currentVariant() === 'link' ? styles['ks-btn-link-blink'] : '',
      local.class
    );
  });

  const getIconSize = createMemo(() => {
    const sizeMap = {
      sm: 14,
      md: 16,
      lg: 18,
    };
    return sizeMap[local.size || 'md'];
  });

  // Fix ripple colors: use primary for ghost and outline variants, current variant for others
  const getRippleClass = createMemo(() => {
    const variant = currentVariant();
    const rippleVariant = (variant === 'ghost' || variant === 'outline') ? 'primary' : variant;
    return `${styles['ks-btn-ripple-effect']} ${effects[`ks-variant-${rippleVariant}`]}`;
  });

  const handleMouseDown = (event: MouseEvent) => {
    if (local.disabled) return;

    const variant = currentVariant();

    // Link variant: just blink, no ripple
    if (variant === 'link') {
      setBlink(true);
      setTimeout(() => setBlink(false), 300);
      return;
    }

    // All other variants: ripple effect
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
    if (!hasRipple() || local.disabled || currentVariant() === 'link') return;

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
    if (local.onClick && !local.disabled) {
      local.onClick(event);
    }
  };

  const renderContent = createMemo(() => {
    const IconComponent = local.icon;
    const iconSize = getIconSize();

    if (isIconOnly() && IconComponent) {
      return <IconComponent size={iconSize} />;
    }

    if (IconComponent && local.children) {
      const icon = <IconComponent size={iconSize} />;
      const position = local.iconPosition || 'left';

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
      style={local.style}
      disabled={local.disabled}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...others}
    >
      {renderContent()}

      {/* Render ripples only for non-link variants */}
      {hasRipple() && currentVariant() !== 'link' &&
        ripples().map((ripple) => (
          <span
            key={ripple.id}
            class={cn(
              getRippleClass(),
              ripple.isFading && styles['ks-btn-ripple-fade']
            )}
            style={{
              left: `${ripple.x - ripple.size / 2}px`,
              top: `${ripple.y - ripple.size / 2}px`,
              width: `${ripple.size}px`,
              height: `${ripple.size}px`,
            }}
          />
        ))}
    </button>
  );
};

export default Button;