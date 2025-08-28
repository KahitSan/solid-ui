import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import Button from './Button';
import { 
  Shield, Power, AlertTriangle, Settings, Play, ChevronRight, 
  Zap, Lock, Unlock, Eye, EyeOff, Home, Menu, X, Plus, 
  Minus, Check, ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  Search, Bell, User, Mail, Download, Upload, Trash2,
  Edit, Save, RefreshCw, Wifi, WifiOff, Battery, BatteryLow,
  ExternalLink
} from 'lucide-solid';

// Icon mapping for Storybook controls
const iconMap = {
  None: undefined,
  Shield,
  Power,
  AlertTriangle,
  Settings,
  Play,
  ChevronRight,
  Zap,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Home,
  Menu,
  X,
  Plus,
  Minus,
  Check,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Search,
  Bell,
  User,
  Mail,
  Download,
  Upload,
  Trash2,
  Edit,
  Save,
  RefreshCw,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  ExternalLink,
};

const meta: Meta<typeof Button> = {
  title: 'Base/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0a0a0a',
        },
      ],
    },
    docs: {
      description: {
        component: 'Button with multiple variants, sizes, ripple effects (enabled by default), and optional HUD visual effects.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'success', 'danger', 'outline', 'ghost', 'link'],
      description: 'Button appearance variant',
      defaultValue: 'default',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
      defaultValue: 'md',
    },
    effect: {
      control: { type: 'text' },
      description: 'HUD effects as array, single value, or space-delimited string: ["scanline", "glow"] or "scanline glow"',
    },
    icon: {
      control: { type: 'select' },
      options: Object.keys(iconMap),
      mapping: iconMap,
      description: 'Lucide icon component',
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['left', 'right'],
      description: 'Icon position relative to text',
      defaultValue: 'left',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
      defaultValue: false,
    },
    ripple: {
      control: { type: 'boolean' },
      description: 'Enable ripple effect on click (enabled by default)',
      defaultValue: true,
    },
    children: {
      description: 'Button content',
    },
    onClick: {
      description: 'Click event handler',
    },
    class: {
      description: 'Additional CSS classes',
    },
    style: {
      description: 'Inline styles object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    children: 'SYSTEM STATUS',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default button variant with standard HUD styling, gold accents, and ripple effect enabled by default.',
      },
    },
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'ACTIVATE SHIELD',
  },
  parameters: {
    docs: {
      description: {
        story: 'Primary action button with enhanced gold styling for important actions.',
      },
    },
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'SYSTEMS ONLINE',
  },
  parameters: {
    docs: {
      description: {
        story: 'Success variant with green accents for positive status indicators.',
      },
    },
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'EMERGENCY STOP',
  },
  parameters: {
    docs: {
      description: {
        story: 'Danger variant with red accents for critical or destructive actions.',
      },
    },
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'SCAN PERIMETER',
  },
  parameters: {
    docs: {
      description: {
        story: 'Outline variant with transparent background and border-only styling.',
      },
    },
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'GHOST MODE',
  },
  parameters: {
    docs: {
      description: {
        story: 'Ghost variant with no borders or background - subtle hover effect only.',
      },
    },
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'View Details',
    icon: ExternalLink,
    iconPosition: 'right',
  },
  parameters: {
    docs: {
      description: {
        story: 'Link variant styled like a hyperlink with underline on hover.',
      },
    },
  },
};

export const WithoutRipple: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'NO RIPPLE EFFECT',
    ripple: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with ripple effect disabled. Set ripple={false} to turn off the effect.',
      },
    },
  },
};

// Size variants
export const Small: Story = {
  args: {
    size: 'sm',
    variant: 'primary',
    children: 'PWR',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small button size for compact interfaces and control panels.',
      },
    },
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    variant: 'primary',
    children: 'SYSTEMS',
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium button size (default) for standard interface elements.',
      },
    },
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    variant: 'primary',
    children: 'ENGAGE HYPERDRIVE',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large button size for prominent primary actions and hero elements.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    variant: 'primary',
    children: 'OFFLINE',
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state with reduced opacity and no hover effects. Ripple is also disabled.',
      },
    },
  },
};

// HUD Effects
export const WithScanLine: Story = {
  args: {
    variant: 'primary',
    children: 'SCAN INITIATED',
    effect: 'scanline',
    icon: Search,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with scan line animation effect on hover. Use effect="scanline" to enable.',
      },
    },
  },
};

export const WithClipPath: Story = {
  args: {
    variant: 'primary',
    children: 'ANGULAR DESIGN',
    effect: 'clip-path',
    icon: Zap,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with angular clip-path corners. Use effect="clip-path" for HUD-style geometry.',
      },
    },
  },
};

export const WithGlow: Story = {
  args: {
    variant: 'success',
    children: 'SYSTEMS ACTIVE',
    effect: 'glow',
    icon: Battery,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with subtle glow effect that intensifies on hover. Use effect="glow".',
      },
    },
  },
};

export const WithPulse: Story = {
  args: {
    variant: 'danger',
    children: 'ALERT STATUS',
    effect: 'pulse',
    icon: Bell,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with pulsing animation for attention-grabbing elements. Use effect="pulse".',
      },
    },
  },
};

// Icon Examples
export const WithIconLeft: Story = {
  args: {
    variant: 'primary',
    children: 'SHIELDS UP',
    icon: Shield,
    iconPosition: 'left',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with icon positioned on the left side of text (default position).',
      },
    },
  },
};

export const WithIconRight: Story = {
  args: {
    variant: 'success',
    children: 'SYSTEMS ONLINE',
    icon: ChevronRight,
    iconPosition: 'right',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with icon positioned on the right side of text.',
      },
    },
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'primary',
    icon: Power,
  },
  parameters: {
    docs: {
      description: {
        story: 'Icon-only button (auto-detected when no children provided). Perfect for compact interfaces and toolbars.',
      },
    },
  },
};

// Interactive Demo
export const Interactive: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'INTERACTIVE DEMO',
    icon: Shield,
    iconPosition: 'left',
    effect: 'scanline',
    disabled: false,
    ripple: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo - use the controls below to explore all button options including ripple effects.',
      },
    },
  },
};