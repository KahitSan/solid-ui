import { Component, JSX, splitProps, createSignal, onCleanup } from 'solid-js';
import styles from './Button.module.css';

// Define possible effects as a type
type HUDEffect = 'scanline' | 'clip-path' | 'glow' | 'pulse';

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
    'variant', 'size', 'effect', 'children', 'icon', 'iconPosition', 
    'class', 'style', 'disabled', 'ripple', 'onClick'
  ]);

  const [ripples, setRipples] = createSignal<Array<{ 
    id: number; 
    x: number; 
    y: number; 
    size: number;
    isFading: boolean;
  }>>([]);
  
  let buttonRef: HTMLButtonElement | undefined;
  let mouseDownTime = 0;

  // Auto-detect icon-only mode when no children provided
  const isIconOnly = () => !local.children && local.icon;

  // Default ripple to true
  const hasRipple = () => local.ripple !== false;

  const classes = () => {
    const variant = local.variant || 'default';
    const size = local.size || 'md';

    // Parse effects - handle array, single effect, or space-delimited string
    const effectClasses = local.effect 
      ? (Array.isArray(local.effect) 
          ? local.effect 
          : local.effect.split(' ').map(e => e.trim()).filter(Boolean)
        ).map(effect => {
          const effectMap: Record<HUDEffect, string> = {
            'scanline': styles['hud-scan-line'],
            'clip-path': styles['hud-clip-button'], 
            'glow': styles['hud-glow'],
            'pulse': styles['hud-pulse']
          };
          return effectMap[effect as HUDEffect];
        }).filter(Boolean)
      : [];

    return cn(
      styles['ks-btn-base'],
      styles[`ks-btn-${variant}`],
      styles[`ks-btn-${size}`],
      isIconOnly() && styles['ks-btn-icon-only'],
      hasRipple() && styles['ks-btn-ripple'],
      ...effectClasses,
      local.class
    );
  };

  const getIconSize = () => {
    const sizeMap = {
      sm: 14,
      md: 16,
      lg: 18
    };
    return sizeMap[local.size || 'md'];
  };

  const getRippleClass = () => {
    const variant = local.variant || 'default';
    return styles[`ks-btn-ripple-${variant}`];
  };

  const handleMouseDown = (event: MouseEvent) => {
    // Create ripple effect if enabled
    if (hasRipple() && !local.disabled && buttonRef) {
      mouseDownTime = Date.now();
      
      const rect = buttonRef.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;
      
      const rippleId = Date.now() + Math.random();
      
      // Add ripple - it will automatically expand due to CSS animation
      setRipples(prev => [...prev, { 
        id: rippleId, 
        x, 
        y, 
        size, 
        isFading: false
      }]);
    }
  };

  const handleMouseUp = () => {
    if (!hasRipple() || local.disabled) return;
    
    const timeSinceMouseDown = Date.now() - mouseDownTime;
    const minExpandTime = 400; // Match CSS animation duration
    
    // Calculate delay to ensure ripple finishes expanding before fading
    const delayBeforeFade = Math.max(0, minExpandTime - timeSinceMouseDown);
    
    setTimeout(() => {
      // Mark all ripples for fading
      setRipples(prev => prev.map(ripple => ({ ...ripple, isFading: true })));
      
      // Remove ripples after fade animation completes
      setTimeout(() => {
        setRipples([]);
      }, 400); // Match fade animation duration
    }, delayBeforeFade);
  };

  const handleMouseLeave = () => {
    handleMouseUp();
  };

  const handleClick = (event: MouseEvent) => {
    // Only call user's onClick handler
    if (local.onClick && !local.disabled) {
      local.onClick(event);
    }
  };

  const renderContent = () => {
    const IconComponent = local.icon;
    const iconSize = getIconSize();
    
    if (isIconOnly() && IconComponent) {
      return <IconComponent size={iconSize} />;
    }

    if (IconComponent && local.children) {
      const icon = <IconComponent size={iconSize} />;
      const position = local.iconPosition || 'left';
      
      return position === 'left' 
        ? <>{icon}{local.children}</>
        : <>{local.children}{icon}</>;
    }

    if (IconComponent) {
      return <IconComponent size={iconSize} />;
    }

    return local.children;
  };

  // Cleanup ripples on unmount
  onCleanup(() => {
    setRipples([]);
  });

  return (
    <button
      ref={buttonRef}
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
      
      {/* Ripple effects */}
      {hasRipple() && ripples().map(ripple => (
        <span
          key={ripple.id}
          class={cn(
            styles['ks-btn-ripple-effect'],
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