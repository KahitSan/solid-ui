import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import Button from './Button';
import { 
  Shield, Power, AlertTriangle, Settings, Play, ChevronRight, 
  Zap, Lock, Unlock, Eye, EyeOff, Home, Menu, X, Plus, 
  Minus, Check, ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  Search, Bell, User, Mail, Download, Upload, Trash2,
  Edit, Save, RefreshCw, Wifi, WifiOff, Battery, BatteryLow,
  ExternalLink, PauseCircle, Volume2, VolumeX, Maximize2,
  HelpCircle, Star, Heart, Share, Filter
} from 'lucide-solid';

// Icon mapping for Storybook controls
const iconMap = {
  None: undefined,
  Shield, Power, AlertTriangle, Settings, Play, ChevronRight,
  Zap, Lock, Unlock, Eye, EyeOff, Home, Menu, X, Plus,
  Minus, Check, ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  Search, Bell, User, Mail, Download, Upload, Trash2,
  Edit, Save, RefreshCw, Wifi, WifiOff, Battery, BatteryLow,
  ExternalLink, PauseCircle, Volume2, VolumeX, Maximize2,
  HelpCircle, Star, Heart, Share, Filter
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
        component: 'Versatile Button component for HUD interfaces. Supports multiple sizes, effects, states, and automatically matches effect colors to your Tailwind color scheme. Perfect for gaming UIs, dashboards, and sci-fi interfaces.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    class: {
      control: { type: 'text' },
      description: 'Tailwind CSS classes for styling - effects automatically match colors',
      defaultValue: 'bg-amber-600/20 border border-amber-600/60 text-amber-400 hover:bg-amber-600/30 hover:border-amber-500',
    },
    effect: {
      control: { type: 'text' },
      description: 'HUD effects: scanline, clip-*, glow, pulse. Multiple effects can be combined.',
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
    iconSize: {
      control: { type: 'number' },
      description: 'Icon size in pixels',
      defaultValue: 16,
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
      defaultValue: false,
    },
    ripple: {
      control: { type: 'boolean' },
      description: 'Enable ripple effect - color automatically matches theme',
      defaultValue: true,
    },
    children: {
      description: 'Button content',
    },
    onClick: {
      description: 'Click event handler',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// === BASIC VARIANTS ===
export const Default: Story = {
  args: {
    children: 'SYSTEM STATUS',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default button with HUD amber styling and ripple effect. Good for standard actions.',
      },
    },
  },
};

export const Primary: Story = {
  args: {
    class: 'bg-amber-600/30 border border-amber-600/70 text-amber-300 hover:bg-amber-600/40 hover:border-amber-500 px-6 py-3 text-base font-semibold',
    children: 'ACTIVATE SHIELDS',
    icon: Shield,
  },
  parameters: {
    docs: {
      description: {
        story: 'Primary action button with enhanced styling. Use for main CTAs and important actions.',
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    class: 'bg-transparent border-2 border-amber-600/60 text-amber-400 hover:bg-amber-600/10 hover:border-amber-500',
    children: 'SCAN PERIMETER',
    icon: Search,
  },
  parameters: {
    docs: {
      description: {
        story: 'Secondary button with outline styling. Good for alternative actions.',
      },
    },
  },
};

export const Success: Story = {
  args: {
    class: 'bg-green-600/20 border border-green-600/60 text-green-400 hover:bg-green-600/30 hover:border-green-500',
    children: 'SYSTEMS ONLINE',
    icon: Check,
  },
  parameters: {
    docs: {
      description: {
        story: 'Success variant for positive actions and confirmations.',
      },
    },
  },
};

export const Danger: Story = {
  args: {
    class: 'bg-red-600/20 border border-red-600/60 text-red-400 hover:bg-red-600/30 hover:border-red-500',
    children: 'EMERGENCY STOP',
    icon: AlertTriangle,
  },
  parameters: {
    docs: {
      description: {
        story: 'Danger variant for destructive or critical actions.',
      },
    },
  },
};

export const Ghost: Story = {
  args: {
    class: 'bg-transparent border-transparent text-amber-400 hover:bg-amber-600/10 hover:border-transparent',
    children: 'GHOST MODE',
    icon: Eye,
  },
  parameters: {
    docs: {
      description: {
        story: 'Ghost variant with minimal styling. Good for subtle actions.',
      },
    },
  },
};

export const Link: Story = {
  args: {
    class: 'bg-transparent border-transparent text-blue-400 underline-offset-4 hover:underline hover:bg-transparent hover:border-transparent px-0 py-0',
    children: 'View Documentation',
    icon: ExternalLink,
    iconPosition: 'right',
    ripple: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Link-style button for navigation and external links.',
      },
    },
  },
};

// === SIZES ===
export const Small: Story = {
  args: {
    class: 'px-3 py-1.5 text-xs',
    children: 'PWR',
    icon: Power,
  },
  parameters: {
    docs: {
      description: {
        story: 'Small button for compact interfaces and status indicators.',
      },
    },
  },
};

export const Medium: Story = {
  args: {
    children: 'SYSTEMS',
    icon: Settings,
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium size (default) - good for most interface elements.',
      },
    },
  },
};

export const Large: Story = {
  args: {
    class: 'px-8 py-4 text-lg font-bold',
    children: 'ENGAGE HYPERDRIVE',
    icon: Zap,
    iconSize: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'Large button for primary actions and hero sections.',
      },
    },
  },
};

// === ICON VARIATIONS ===
export const WithIconLeft: Story = {
  args: {
    children: 'DOWNLOAD LOG',
    icon: Download,
    iconPosition: 'left',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with icon on the left (default position).',
      },
    },
  },
};

export const WithIconRight: Story = {
  args: {
    children: 'NEXT PHASE',
    icon: ChevronRight,
    iconPosition: 'right',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with icon on the right. Good for navigation and "next" actions.',
      },
    },
  },
};

export const IconOnly: Story = {
  args: {
    icon: Settings,
    class: 'bg-amber-600/30 border border-amber-600/70 text-amber-300 hover:bg-amber-600/40 hover:border-amber-500',
  },
  parameters: {
    docs: {
      description: {
        story: 'Icon-only button for toolbars and compact interfaces. Auto-detects when no text is provided.',
      },
    },
  },
};

// === HUD EFFECTS ===
export const WithScanLine: Story = {
  args: {
    class: 'bg-blue-600/20 border border-blue-600/60 text-blue-400 hover:bg-blue-600/30 hover:border-blue-500',
    children: 'SCAN INITIATED',
    effect: 'scanline',
    icon: Search,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scan line effect for scanning, searching, or processing actions.',
      },
    },
  },
};

export const WithGlow: Story = {
  args: {
    class: 'bg-green-600/20 border border-green-600/60 text-green-400 hover:bg-green-600/30 hover:border-green-500',
    children: 'POWER CORE ACTIVE',
    effect: 'glow',
    icon: Battery,
  },
  parameters: {
    docs: {
      description: {
        story: 'Glow effect for indicating active states or energy systems.',
      },
    },
  },
};

export const WithPulse: Story = {
  args: {
    class: 'bg-red-600/20 border border-red-600/60 text-red-400 hover:bg-red-600/30 hover:border-red-500',
    children: 'ALERT STATUS',
    effect: 'pulse',
    icon: Bell,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pulse effect for alerts, notifications, or attention-grabbing elements.',
      },
    },
  },
};

export const WithClipCorners: Story = {
  args: {
    class: 'bg-purple-600/30 border border-purple-600/70 text-purple-300 hover:bg-purple-600/40 hover:border-purple-500',
    children: 'TACTICAL MODE',
    effect: 'clip-top-left-bottom-right',
    icon: Shield,
  },
  parameters: {
    docs: {
      description: {
        story: 'Clipped corners for a futuristic, tactical interface aesthetic.',
      },
    },
  },
};

export const CombinedEffects: Story = {
  args: {
    class: 'bg-amber-600/30 border border-amber-600/70 text-amber-300 hover:bg-amber-600/40 hover:border-amber-500',
    children: 'ULTIMATE POWER',
    effect: 'clip-top-left-bottom-right glow pulse',
    icon: Zap,
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple effects combined for maximum visual impact.',
      },
    },
  },
};

// === STATES ===
export const Disabled: Story = {
  args: {
    class: 'bg-amber-600/30 border border-amber-600/70 text-amber-300 hover:bg-amber-600/40 hover:border-amber-500',
    disabled: true,
    children: 'OFFLINE',
    icon: WifiOff,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state with reduced opacity and no interactions.',
      },
    },
  },
};

export const WithoutRipple: Story = {
  args: {
    class: 'bg-slate-600/20 border border-slate-600/60 text-slate-400 hover:bg-slate-600/30 hover:border-slate-500',
    children: 'SILENT MODE',
    ripple: false,
    icon: VolumeX,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with ripple effect disabled for subtle interactions.',
      },
    },
  },
};

// === REAL-WORLD EXAMPLES ===
export const PlayButton: Story = {
  args: {
    class: 'bg-green-600/20 border border-green-600/60 text-green-400 hover:bg-green-600/30 hover:border-green-500 rounded-full px-6 py-3',
    children: 'PLAY',
    icon: Play,
    effect: 'glow',
  },
  parameters: {
    docs: {
      description: {
        story: 'Media player control with rounded styling and glow effect.',
      },
    },
  },
};

export const ToolbarButton: Story = {
  args: {
    class: 'bg-transparent border-transparent text-gray-400 hover:bg-gray-600/20 hover:text-gray-300 p-2',
    icon: Edit,
    ripple: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Toolbar button with minimal styling for editor interfaces.',
      },
    },
  },
};

export const FloatingActionButton: Story = {
  args: {
    class: 'bg-blue-600 border-0 text-white hover:bg-blue-700 rounded-full shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 p-4',
    icon: Plus,
    iconSize: 24,
    effect: 'glow',
  },
  parameters: {
    docs: {
      description: {
        story: 'Floating action button with strong shadow and glow effect.',
      },
    },
  },
};

export const NavigationButton: Story = {
  args: {
    class: 'bg-transparent border border-amber-600/40 text-amber-400 hover:bg-amber-600/10 hover:border-amber-500 justify-between w-48',
    children: 'Navigation Menu',
    icon: ChevronRight,
    iconPosition: 'right',
    effect: 'scanline',
  },
  parameters: {
    docs: {
      description: {
        story: 'Navigation button with space-between layout and scan effect.',
      },
    },
  },
};

export const StatusIndicator: Story = {
  args: {
    class: 'bg-green-600/20 border border-green-600/60 text-green-400 cursor-default pointer-events-none',
    children: 'ONLINE',
    icon: Wifi,
    effect: 'pulse',
    ripple: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Status indicator that looks like a button but acts as a display element.',
      },
    },
  },
};

// === ACCESSIBILITY & INTERACTION ===
export const FocusExample: Story = {
  args: {
    class: 'bg-amber-600/20 border border-amber-600/60 text-amber-400 hover:bg-amber-600/30 hover:border-amber-500 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black',
    children: 'FOCUS EXAMPLE',
    icon: Eye,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with custom focus styling for accessibility.',
      },
    },
  },
};

// === INTERACTIVE DEMO ===
export const Interactive: Story = {
  args: {
    class: 'bg-amber-600/30 border border-amber-600/70 text-amber-300 hover:bg-amber-600/40 hover:border-amber-500',
    children: 'INTERACTIVE DEMO',
    icon: Shield,
    iconPosition: 'left',
    iconSize: 16,
    effect: 'scanline',
    disabled: false,
    ripple: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo - use the controls below to explore all button options.',
      },
    },
  },
};