// Button.stories.tsx
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
import { userEvent, within, expect, fn } from '@storybook/test';

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
      defaultValue: 'bg-gradient-to-br from-amber-600/30 to-amber-800/10 border border-amber-600/60 text-amber-400 hover:from-amber-600/40 hover:to-amber-800/20 hover:border-amber-500',
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
    onClick: { action: true },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// === FUNCTIONAL STORIES ===
export const DefaultButton: Story = {
  args: {
    children: 'Default Button',
    icon: Shield,
    onClick: fn(),
    class: 'bg-gradient-to-br from-amber-600/30 to-amber-800/10 border border-amber-600/60 text-amber-400 hover:from-amber-600/40 hover:to-amber-800/20 hover:border-amber-500',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic button with gradient styling that responds to clicks, hovers, and keyboard navigation.',
      },
    },
  },
};

export const DisabledButton: Story = {
  args: {
    children: 'Disabled Button',
    icon: Lock,
    disabled: true,
    onClick: fn(),
    class: 'bg-gradient-to-br from-amber-600/30 to-amber-800/10 border border-amber-600/60 text-amber-400 hover:from-amber-600/40 hover:to-amber-800/20 hover:border-amber-500',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story: 'Button in disabled state with visual dimming and interaction prevention.',
      },
    },
  },
};

export const TextOnlyButton: Story = {
  args: {
    children: 'Text Only Button',
    icon: undefined,
    onClick: fn(),
    class: 'bg-gradient-to-br from-amber-600/30 to-amber-800/10 border border-amber-600/60 text-amber-400 hover:from-amber-600/40 hover:to-amber-800/20 hover:border-amber-500',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveTextContent('Text Only Button');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story: 'Button without icons, demonstrating text-only content handling.',
      },
    },
  },
};

export const HoverStates: Story = {
  args: {
    children: 'Hover Button',
    icon: Eye,
    class: 'bg-gradient-to-br from-amber-600/30 to-amber-800/10 border border-amber-600/60 text-amber-400 hover:from-amber-600/40 hover:to-amber-800/20 hover:border-amber-500',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.hover(button);
    await userEvent.unhover(button);
    expect(true).toBe(true);
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with hover state transitions and visual feedback.',
      },
    },
  },
};

export const FocusManagement: Story = {
  args: {
    children: 'Focus Button',
    icon: Eye,
    class: 'bg-gradient-to-br from-amber-600/30 to-amber-800/10 border border-amber-600/60 text-amber-400 hover:from-amber-600/40 hover:to-amber-800/20 hover:border-amber-500 focus:ring-2 focus:ring-amber-400',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    button.focus();
    await expect(button).toHaveFocus();
    button.blur();
    await expect(button).not.toHaveFocus();
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with keyboard focus states and navigation support.',
      },
    },
  },
};

// === INTERACTIVE DEMO ===
export const Interactive: Story = {
  args: {
    class: 'bg-gradient-to-br from-amber-600/40 to-amber-800/20 border border-amber-600/70 text-amber-300 hover:from-amber-600/50 hover:to-amber-800/30 hover:border-amber-500',
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
        story: 'Interactive demo - use the controls below to explore all button options.',
      },
    },
  },
};

// === GRADIENT SHOWCASE ===
export const GradientShowcase: Story = {
  args: {
    class: 'bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-purple-600/30 border-0 shadow-[0_0_0_1px_transparent,0_0_0_2px_theme(colors.cyan.400/0.3),0_0_0_3px_theme(colors.blue.500/0.2),0_0_0_4px_theme(colors.purple.600/0.3)] text-cyan-200 hover:from-cyan-400/40 hover:via-blue-500/30 hover:to-purple-600/40 hover:shadow-[0_0_0_1px_transparent,0_0_0_2px_theme(colors.cyan.400/0.5),0_0_0_3px_theme(colors.blue.500/0.4),0_0_0_4px_theme(colors.purple.600/0.5)] transition-all duration-300',
    children: 'GRADIENT BORDERS & BACKGROUND',
    icon: Zap,
    iconPosition: 'left',
    effect: 'glow',
    disabled: false,
    ripple: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Showcase example demonstrating gradient backgrounds combined with gradient border effects using layered box-shadows. This example shows how to create complex gradient borders alongside gradient backgrounds.',
      },
    },
  },
};

// === STYLE SYSTEM ===
export const StyleSystem: Story = {
  render: () => (
    <div class="space-y-4">
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Default Button</h3>
        <p class="text-gray-400 text-sm mb-2">Standard amber-themed button with gradient background.</p>
        <Button class="bg-gradient-to-r from-amber-600/20 to-amber-700/10 border border-amber-600/60 text-amber-400 hover:from-amber-600/30 hover:to-amber-700/20 hover:border-amber-500">SYSTEM STATUS</Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">With Icon</h3>
        <p class="text-gray-400 text-sm mb-2">Button enhanced with an icon and gradient styling.</p>
        <Button 
          class="bg-gradient-to-r from-amber-600/20 to-amber-700/10 border border-amber-600/60 text-amber-400 hover:from-amber-600/30 hover:to-amber-700/20 hover:border-amber-500"
          icon={Shield}
        >
          ACTIVATE SHIELDS
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Primary Button</h3>
        <p class="text-gray-400 text-sm mb-2">Enhanced gradient styling for primary call-to-action buttons.</p>  
        <Button 
          class="bg-gradient-to-br from-amber-500/40 to-amber-800/20 border border-amber-600/70 text-amber-200 hover:from-amber-500/50 hover:to-amber-800/30 hover:border-amber-500 px-6 py-3 text-base font-semibold"
          icon={Shield}
        >
          ACTIVATE SHIELDS
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Secondary Button</h3>
        <p class="text-gray-400 text-sm mb-2">Outline-style button with subtle gradient hover effect.</p>
        <Button 
          class="bg-gradient-to-r from-transparent to-transparent border-2 border-amber-600/60 text-amber-400 hover:from-amber-600/10 hover:to-amber-700/5 hover:border-amber-500"
          icon={Search}
        >
          SCAN PERIMETER
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Success Button</h3>
        <p class="text-gray-400 text-sm mb-2">Green gradient button for success/confirmation actions.</p>
        <Button 
          class="bg-gradient-to-br from-green-500/30 to-emerald-700/10 border border-green-600/60 text-green-300 hover:from-green-500/40 hover:to-emerald-700/20 hover:border-green-500"
          icon={Check}
        >
          SYSTEMS ONLINE
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Danger Button</h3>
        <p class="text-gray-400 text-sm mb-2">Red gradient button for destructive/critical actions.</p>
        <Button 
          class="bg-gradient-to-br from-red-500/30 to-red-800/10 border border-red-600/60 text-red-300 hover:from-red-500/40 hover:to-red-800/20 hover:border-red-500"
          icon={AlertTriangle}
        >
          EMERGENCY STOP
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Ghost Button</h3>
        <p class="text-gray-400 text-sm mb-2">Minimal styling with subtle gradient hover effect.</p>
        <Button 
          class="bg-gradient-to-r from-transparent to-transparent border-transparent text-amber-400 hover:from-amber-600/10 hover:to-amber-700/5 hover:border-transparent"
          icon={Eye}
        >
          GHOST MODE
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Link Button</h3>
        <p class="text-gray-400 text-sm mb-2">Link-style button with underline and no gradient effects.</p>
        <Button 
          class="bg-transparent border-transparent text-blue-400 underline-offset-4 hover:underline hover:bg-transparent hover:border-transparent px-0 py-0"
          icon={ExternalLink}
          iconPosition="right"
          ripple={false}
        >
          View Documentation
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Button style system with gradient backgrounds showing different visual treatments. From default amber styling to specialized variants like primary actions, secondary options, success states, danger actions, ghost buttons, and link-style buttons.',
      },
    },
    controls: { disable: true }
  },
};

// === SIZE SYSTEM ===
export const SizeSystem: Story = {
  render: () => (
    <div class="space-y-4">
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Small Button</h3>
        <p class="text-gray-400 text-sm mb-2">Compact button with subtle gradient for tight spaces.</p>
        <Button 
          class="bg-gradient-to-r from-amber-600/20 to-amber-700/10 border border-amber-600/60 text-amber-400 hover:from-amber-600/30 hover:to-amber-700/20 hover:border-amber-500 px-3 py-1.5 text-xs"
        >
          SMALL
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Small Button (With Icon)</h3>
        <p class="text-gray-400 text-sm mb-2">Compact button with icon and gradient styling.</p>
        <Button 
          class="bg-gradient-to-r from-amber-600/20 to-amber-700/10 border border-amber-600/60 text-amber-400 hover:from-amber-600/30 hover:to-amber-700/20 hover:border-amber-500 px-3 py-1.5 text-xs"
          icon={Power}
        >
          PWR
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Medium Button (Default)</h3>
        <p class="text-gray-400 text-sm mb-2">Standard size with balanced gradient effect.</p>
        <Button 
          class="bg-gradient-to-r from-amber-600/20 to-amber-700/10 border border-amber-600/60 text-amber-400 hover:from-amber-600/30 hover:to-amber-700/20 hover:border-amber-500"
          icon={Settings}
        >
          SYSTEMS
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Large Button</h3>
        <p class="text-gray-400 text-sm mb-2">Large button with bold gradient for primary actions.</p>
        <Button 
          class="bg-gradient-to-br from-amber-500/40 to-amber-800/20 border border-amber-600/70 text-amber-200 hover:from-amber-500/50 hover:to-amber-800/30 hover:border-amber-500 px-8 py-4 text-lg font-bold"
          icon={Zap}
        >
          ENGAGE HYPERDRIVE
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Button sizing system with gradient backgrounds from compact small buttons to large hero buttons. Gradient intensity scales with button importance.',
      },
    },
    controls: { disable: true }
  },
};

// === ICON INTEGRATION ===
export const IconIntegration: Story = {
  render: () => (
    <div class="space-y-4">
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Text Only</h3>
        <p class="text-gray-400 text-sm mb-2">Button without any icon, gradient text-only content.</p>
        <Button class="bg-gradient-to-r from-amber-600/20 to-amber-700/10 border border-amber-600/60 text-amber-400 hover:from-amber-600/30 hover:to-amber-700/20 hover:border-amber-500">
          TEXT ONLY
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Icon Left (Default)</h3>
        <p class="text-gray-400 text-sm mb-2">Button with icon positioned on the left with gradient background.</p>
        <Button 
          class="bg-gradient-to-r from-blue-600/20 to-blue-700/10 border border-blue-600/60 text-blue-400 hover:from-blue-600/30 hover:to-blue-700/20 hover:border-blue-500"
          icon={Download}
          iconPosition="left"
        >
          DOWNLOAD LOG
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Icon Right</h3>
        <p class="text-gray-400 text-sm mb-2">Button with icon positioned on the right with gradient styling.</p>
        <Button 
          class="bg-gradient-to-r from-purple-600/20 to-purple-700/10 border border-purple-600/60 text-purple-400 hover:from-purple-600/30 hover:to-purple-700/20 hover:border-purple-500"
          icon={ChevronRight}
          iconPosition="right"
        >
          NEXT PHASE
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Icon Only</h3>
        <p class="text-gray-400 text-sm mb-2">Button with only an icon and circular gradient background.</p>
        <Button 
          class="bg-gradient-to-br from-amber-500/40 to-amber-800/20 border border-amber-600/70 text-amber-300 hover:from-amber-500/50 hover:to-amber-800/30 hover:border-amber-500"
          icon={Settings}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icon integration system with gradient backgrounds supporting various configurations and color themes.',
      },
    },
    controls: { disable: true }
  },
};

// === VISUAL EFFECTS ===
export const VisualEffects: Story = {
  render: () => (
    <div class="space-y-4">
      <div>
        <h3 class="text-amber-400 font-medium mb-2">No Effect (Plain)</h3>
        <p class="text-gray-400 text-sm mb-2">Standard button with gradient background and no special effects.</p>
        <Button 
          class="bg-gradient-to-r from-amber-600/20 to-amber-700/10 border border-amber-600/60 text-amber-400 hover:from-amber-600/30 hover:to-amber-700/20 hover:border-amber-500"
          icon={Settings}
        >
          PLAIN BUTTON
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Scan Line Effect</h3>
        <p class="text-gray-400 text-sm mb-2">Scan line animation with blue gradient for scanning actions.</p>
        <Button 
          class="bg-gradient-to-br from-blue-500/30 to-cyan-700/10 border border-blue-600/60 text-blue-300 hover:from-blue-500/40 hover:to-cyan-700/20 hover:border-blue-500"
          icon={Search}
          effect="scanline"
        >
          SCAN INITIATED
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Glow Effect</h3>
        <p class="text-gray-400 text-sm mb-2">Glow effect with green gradient for active energy systems.</p>
        <Button 
          class="bg-gradient-to-br from-green-500/30 to-emerald-700/10 border border-green-600/60 text-green-300 hover:from-green-500/40 hover:to-emerald-700/20 hover:border-green-500"
          icon={Battery}
          effect="glow"
        >
          POWER CORE ACTIVE
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Pulse Effect</h3>
        <p class="text-gray-400 text-sm mb-2">Pulse effect with red gradient for alerts and notifications.</p>
        <Button 
          class="bg-gradient-to-br from-red-500/30 to-red-800/10 border border-red-600/60 text-red-300 hover:from-red-500/40 hover:to-red-800/20 hover:border-red-500"
          icon={Bell}
          effect="pulse"
        >
          ALERT STATUS
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Clip Corners Effect</h3>
        <p class="text-gray-400 text-sm mb-2">Clipped corners with purple gradient for tactical interfaces.</p>
        <Button 
          class="bg-gradient-to-br from-purple-500/40 to-violet-800/20 border border-purple-600/70 text-purple-200 hover:from-purple-500/50 hover:to-violet-800/30 hover:border-purple-500"
          icon={Shield}
          effect="clip-top-left-bottom-right"
        >
          TACTICAL MODE
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Combined Effects</h3>
        <p class="text-gray-400 text-sm mb-2">Multiple effects with dramatic gradient for maximum impact.</p>
        <Button 
          class="bg-gradient-to-br from-amber-400/40 via-orange-500/30 to-amber-800/20 border border-amber-600/70 text-amber-200 hover:from-amber-400/50 hover:via-orange-500/40 hover:to-amber-800/30 hover:border-amber-500"
          icon={Zap}
          effect="clip-top-left-bottom-right glow pulse"
        >
          ULTIMATE POWER
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'HUD visual effects system with gradient backgrounds that enhance each effect type, from subtle gradients to dramatic multi-stop combinations.',
      },
    },
    controls: { disable: true }
  },
};

// === STATE MANAGEMENT ===
export const StateManagement: Story = {
  render: () => (
    <div class="space-y-4">
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Normal State</h3>
        <p class="text-gray-400 text-sm mb-2">Standard enabled button with gradient background.</p>
        <Button class="bg-gradient-to-r from-amber-600/20 to-amber-700/10 border border-amber-600/60 text-amber-400 hover:from-amber-600/30 hover:to-amber-700/20 hover:border-amber-500">
          NORMAL BUTTON
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Disabled State</h3>
        <p class="text-gray-400 text-sm mb-2">Disabled button with dimmed gradient and no interactions.</p>
        <Button 
          class="bg-gradient-to-r from-amber-600/20 to-amber-700/10 border border-amber-600/60 text-amber-400 hover:from-amber-600/30 hover:to-amber-700/20 hover:border-amber-500"
          disabled={true}
        >
          DISABLED BUTTON
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Disabled With Icon</h3>
        <p class="text-gray-400 text-sm mb-2">Disabled button with icon showing consistent gradient styling.</p>
        <Button 
          class="bg-gradient-to-r from-gray-600/20 to-gray-700/10 border border-gray-600/60 text-gray-400 hover:from-gray-600/30 hover:to-gray-700/20 hover:border-gray-500"
          icon={WifiOff}
          disabled={true}
        >
          OFFLINE
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Without Ripple Effect</h3>
        <p class="text-gray-400 text-sm mb-2">Button with ripple disabled and subtle gradient hover.</p>
        <Button 
          class="bg-gradient-to-r from-slate-600/20 to-slate-700/10 border border-slate-600/60 text-slate-400 hover:from-slate-600/30 hover:to-slate-700/20 hover:border-slate-500"
          icon={VolumeX}
          ripple={false}
        >
          SILENT MODE
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Button states with gradient backgrounds including normal operation, disabled state with dimmed gradients, and ripple effect control.',
      },
    },
    controls: { disable: true }
  },
};

// === REAL WORLD USAGE ===
export const RealWorldUsage: Story = {
  render: () => (
    <div class="space-y-6">
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Action Button</h3>
        <p class="text-gray-400 text-sm mb-2">Standard action button with gradient for form submissions.</p>
        <Button 
          class="bg-gradient-to-r from-amber-600/30 to-amber-700/20 border border-amber-600/60 text-amber-300 hover:from-amber-600/40 hover:to-amber-700/30 hover:border-amber-500 px-6 py-3"
        >
          CONFIRM ACTION
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Play Button</h3>
        <p class="text-gray-400 text-sm mb-2">Media player control with rounded gradient and glow effect.</p>
        <Button 
          class="bg-gradient-to-br from-green-500/30 to-emerald-700/20 border border-green-600/60 text-green-300 hover:from-green-500/40 hover:to-emerald-700/30 hover:border-green-500 rounded-full px-6 py-3"
          icon={Play}
          effect="glow"
        >
          PLAY
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Toolbar Button</h3>
        <p class="text-gray-400 text-sm mb-2">Minimal toolbar button with subtle gradient hover effect.</p>
        <Button 
          class="bg-gradient-to-r from-transparent to-transparent border-transparent text-gray-400 hover:from-gray-600/20 hover:to-gray-700/10 hover:text-gray-300 p-2"
          icon={Edit}
          ripple={false}
        />
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Floating Action Button</h3>
        <p class="text-gray-400 text-sm mb-2">Floating action button with vibrant gradient and enhanced shadow.</p>
        <Button 
          class="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border-0 text-white hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 rounded-full shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 p-4"
          icon={Plus}
          effect="glow"
        />
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Navigation Button</h3>
        <p class="text-gray-400 text-sm mb-2">Navigation button with gradient hover and scan effect.</p>
        <Button 
          class="bg-gradient-to-r from-transparent to-transparent border border-amber-600/40 text-amber-400 hover:from-amber-600/10 hover:to-amber-700/5 hover:border-amber-500 justify-between w-48"
          icon={ChevronRight}
          iconPosition="right"
          effect="scanline"
        >
          Navigation Menu
        </Button>
      </div>
      
      <div>
        <h3 class="text-amber-400 font-medium mb-2">Status Indicator</h3>
        <p class="text-gray-400 text-sm mb-2">Status indicator with animated gradient and pulse effect.</p>
        <Button 
          class="bg-gradient-to-r from-green-500/30 to-emerald-600/20 border border-green-600/60 text-green-300 cursor-default pointer-events-none"
          icon={Wifi}
          effect="pulse"
          ripple={false}
        >
          ONLINE
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Practical button implementations with gradient backgrounds showing real-world patterns like action buttons, media controls, toolbar buttons, floating action buttons, navigation elements, and status indicators.',
      },
    },
    controls: { disable: true }
  },
};