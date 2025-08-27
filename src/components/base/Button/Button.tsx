import { Component, JSX } from 'solid-js';
import './Button.css'; // Vite will bundle this automatically

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: JSX.Element;
  onClick?: () => void;
  class?: string;
}

const Button: Component<ButtonProps> = (props) => {
  const classes = () => {
    const base = 'ks-btn';
    const variant = `ks-btn-${props.variant || 'primary'}`;
    const size = props.size ? `ks-btn-${props.size}` : '';
  
    return [base, variant, size, props.class].filter(Boolean).join(' ');
  };

  return (
    <button
      class={classes()}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;