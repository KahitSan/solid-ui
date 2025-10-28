import type { Component, JSX } from 'solid-js';
import { splitProps } from 'solid-js';
import { useNavigate } from '@solidjs/router';

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

  /** Custom logo or icon JSX element */
  logo?: JSX.Element;

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
            {local.logo}
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
          <button
            class="px-6 py-3 bg-amber-600/20 border border-amber-600/60 text-amber-400 rounded font-medium hover:bg-amber-600/30 hover:border-amber-500 transition-all duration-200"
            onClick={handleButtonClick}
          >
            {local.buttonText || 'Go Back Home'}
          </button>
        )}

      </div>
    </div>
  );
};

export default NotFound;
