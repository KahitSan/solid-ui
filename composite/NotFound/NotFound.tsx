import { Component, JSX, splitProps } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import Button from '../../base/Button/Button';

export interface NotFoundProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Custom title (default: "404") */
  title?: string;

  /** Custom heading (default: "Page Not Found") */
  heading?: string;

  /** Custom message (default: "The page you're looking for doesn't exist or has been moved.") */
  message?: string;

  /** Custom button text (default: "Go Back Home") */
  buttonText?: string;

  /** Custom navigation path (default: "/") */
  navigateTo?: string;

  /** Custom logo or icon component */
  logo?: Component;

  /** Custom logo props (width, height, etc.) */
  logoProps?: any;

  /** Hide the button (default: false) */
  hideButton?: boolean;

  /** Custom button click handler (overrides default navigation) */
  onButtonClick?: () => void;
}

const NotFound: Component<NotFoundProps> = (props) => {
  const [local, others] = splitProps(props, [
    'title',
    'heading',
    'message',
    'buttonText',
    'navigateTo',
    'logo',
    'logoProps',
    'hideButton',
    'onButtonClick',
    'class'
  ]);

  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (local.onButtonClick) {
      local.onButtonClick();
    } else {
      navigate(local.navigateTo || '/');
    }
  };

  return (
    <div
      class={`flex items-center justify-center min-h-screen ${local.class || ''}`}
      {...others}
    >
      <div class="text-center">

        {/* Logo */}
        {local.logo && (
          <div class="flex items-center justify-center mx-auto mb-6">
            {local.logo(local.logoProps || {})}
          </div>
        )}

        {/* Title (404) */}
        {local.title !== '' && (
          <h1 class="text-6xl font-bold text-amber-500 mb-4">
            {local.title || '404'}
          </h1>
        )}

        {/* Heading */}
        <h3 class="text-2xl font-bold text-white mb-3">
          {local.heading || 'Page Not Found'}
        </h3>

        {/* Message */}
        <p class="text-sm text-zinc-400 max-w-md mb-8">
          {local.message || "The page you're looking for doesn't exist or has been moved."}
        </p>

        {/* Navigation Button */}
        {!local.hideButton && (
          <Button
            intent="primary"
            size="lg"
            onClick={handleButtonClick}
          >
            {local.buttonText || 'Go Back Home'}
          </Button>
        )}

      </div>
    </div>
  );
};

export default NotFound;
