import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import ProgressBar from './ProgressBar';
import { 
  Clock, Timer, Zap, Battery, Download, Upload, 
  Play, Pause, CheckCircle, AlertTriangle, Cpu, 
  HardDrive, Wifi, Activity, Target, TrendingUp
} from 'lucide-solid';

// Icon mapping for Storybook controls
const iconMap = {
  None: undefined,
  Clock, Timer, Zap, Battery, Download, Upload,
  Play, Pause, CheckCircle, AlertTriangle, Cpu,
  HardDrive, Wifi, Activity, Target, TrendingUp
};

const meta: Meta<typeof ProgressBar> = {
  title: 'Base/ProgressBar',
  component: ProgressBar,
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
        component: 'Advanced HUD-style ProgressBar component. Shows progress with optional overflow section and shimmer effect. Supports bidirectional progress.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    progress: {
      control: { type: 'range', min: 0, max: 500, step: 1 },
      description: 'Required progress percentage (0-100 for normal, >100 for overflow)',
    },
    shimmer: {
      control: { type: 'boolean' },
      description: 'Enable continuous shimmer mode',
    },
    position: {
      control: { type: 'radio' },
      options: ['left', 'right'],
      description: 'Direction of progress fill',
    },
    hidePercentage: {
      control: { type: 'boolean' },
      description: 'Hide the percentage text display',
    },
    icon: {
      control: { type: 'select' },
      options: Object.keys(iconMap),
      mapping: iconMap,
      description: 'Icon component (size automatically matches text size)',
    },
    statusLabel: {
      control: { type: 'text' },
      description: 'Status label text (left side)',
    },
    label: {
      control: { type: 'text' },
      description: 'Additional label text (right side)',
    },
    class: {
      control: { type: 'text' },
      description: 'Tailwind CSS classes for full customization',
      defaultValue: 'h-8 text-sm text-green-400 border-green-600/30 w-80',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// === PROGRESS MODES ===
export const Default: Story = {
  args: {
    progress: 65,
    statusLabel: 'Processing',
    class: 'h-8 text-sm text-green-400 border-green-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default progress mode showing progress bar with status label and percentage display.',
      },
    },
  },
};

export const ProgressOnly: Story = {
  args: {
    progress: 75,
    icon: undefined,
    statusLabel: undefined,
    class: 'h-6 text-green-400 border-green-600/30 w-64',
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal progress bar with only the progress fill - no icon, labels, or visible percentage text.',
      },
    },
  },
};

export const NoIcon: Story = {
  args: {
    progress: 88,
    statusLabel: 'Upload Complete',
    icon: undefined,
    class: 'h-8 text-sm text-green-400 border-green-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar without icon - just status label and percentage.',
      },
    },
  },
};

export const WithAdditionalLabel: Story = {
  args: {
    progress: 55,
    statusLabel: 'Processing',
    label: 'Step 2 of 3',
    class: 'h-8 text-sm text-amber-400 border-amber-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar with both status label (left) and additional label (right).',
      },
    },
  },
};

// === OVERFLOW MODES ===
export const OverflowProgress: Story = {
  args: {
    progress: 120,
    statusLabel: 'Overflow',
    class: 'h-8 text-sm text-red-400 border-red-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar showing overflow status with secondary overflow section.',
      },
    },
  },
};

export const HighlyOverflow: Story = {
  args: {
    progress: 180,
    statusLabel: 'Highly Overflow',
    class: 'h-8 text-sm text-red-400 border-red-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar showing significant overflow status with large excess percentage.',
      },
    },
  },
};

export const MaximumOverflow: Story = {
  args: {
    progress: 300,
    statusLabel: 'Maximum Overflow',
    class: 'h-8 text-sm text-red-400 border-red-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar with extreme overflow - capped at 90% visualization to prevent container overflow.',
      },
    },
  },
};

// === HIDE PERCENTAGE MODES ===
export const HiddenPercentage: Story = {
  args: {
    progress: 65,
    statusLabel: 'Processing',
    hidePercentage: true,
    class: 'h-8 text-sm text-green-400 border-green-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar with hidden percentage display - shows only status label and progress fill.',
      },
    },
  },
};

export const HiddenPercentageWithIcon: Story = {
  args: {
    progress: 42,
    statusLabel: 'Downloading',
    icon: Download,
    hidePercentage: true,
    class: 'h-8 text-sm text-blue-400 border-blue-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar with icon and hidden percentage - clean look for dashboard widgets.',
      },
    },
  },
};

export const HiddenPercentageMinimal: Story = {
  args: {
    progress: 30,
    icon: Activity,
    hidePercentage: true,
    class: 'h-6 text-xs text-purple-400 border-purple-600/30 w-48',
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal progress bar with only icon and progress fill - no text labels.',
      },
    },
  },
};

export const HiddenPercentageOverflow: Story = {
  args: {
    progress: 135,
    statusLabel: 'Overflow State',
    hidePercentage: true,
    class: 'h-8 text-sm text-red-400 border-red-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Overflow progress bar with hidden percentage - shows overflow visualization without numerical display.',
      },
    },
  },
};

// === SHIMMER MODE ===
export const ContinuousShimmer: Story = {
  args: {
    progress: 45,
    shimmer: true,
    statusLabel: 'Processing',
    class: 'h-8 text-sm text-green-400 border-green-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Continuous shimmer mode for ongoing processes without defined end time.',
      },
    },
  },
};

export const ShimmerNoLabel: Story = {
  args: {
    progress: 30,
    shimmer: true,
    icon: Activity,
    statusLabel: undefined,
    class: 'h-8 text-sm text-blue-400 border-blue-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Continuous mode without label - just icon and shimmer effect.',
      },
    },
  },
};

export const ShimmerHiddenPercentage: Story = {
  args: {
    progress: 60,
    shimmer: true,
    statusLabel: 'Syncing',
    hidePercentage: true,
    class: 'h-8 text-sm text-cyan-400 border-cyan-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shimmer mode with hidden percentage - perfect for indeterminate progress states.',
      },
    },
  },
};

// === POSITION VARIANTS ===
export const RightPosition: Story = {
  args: {
    progress: 65,
    position: 'right',
    statusLabel: 'Processing',
    class: 'h-8 text-sm text-green-400 border-green-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar filling from right to left with indicator on the left side.',
      },
    },
  },
};

export const RightPositionOverflow: Story = {
  args: {
    progress: 120,
    position: 'right',
    statusLabel: 'Overflow',
    class: 'h-8 text-sm text-red-400 border-red-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Overflow progress bar filling from right to left.',
      },
    },
  },
};

// === COLOR VARIANTS ===
export const Success: Story = {
  args: {
    progress: 100,
    statusLabel: 'Complete',
    icon: CheckCircle,
    class: 'h-8 text-sm text-green-400 border-green-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Success variant with green theme for completed tasks.',
      },
    },
  },
};

export const Warning: Story = {
  args: {
    progress: 85,
    statusLabel: 'Low Space',
    icon: AlertTriangle,
    class: 'h-8 text-sm text-orange-400 border-orange-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Warning variant with orange theme.',
      },
    },
  },
};

export const Danger: Story = {
  args: {
    progress: 95,
    statusLabel: 'Critical',
    icon: AlertTriangle,
    class: 'h-8 text-sm text-red-400 border-red-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Danger variant with red theme for critical situations.',
      },
    },
  },
};

export const Info: Story = {
  args: {
    progress: 45,
    statusLabel: 'Processing',
    icon: Activity,
    class: 'h-8 text-sm text-blue-400 border-blue-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Info variant with blue theme for general processes.',
      },
    },
  },
};

// === SIZE VARIANTS ===
export const Small: Story = {
  args: {
    progress: 60,
    statusLabel: 'Small',
    class: 'h-6 text-xs text-green-400 border-green-600/30 w-64',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small size using h-6 and text-xs Tailwind classes.',
      },
    },
  },
};

export const Medium: Story = {
  args: {
    progress: 70,
    statusLabel: 'Medium',
    class: 'h-8 text-sm text-green-400 border-green-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium size (default) using h-8 and text-sm Tailwind classes.',
      },
    },
  },
};

export const Large: Story = {
  args: {
    progress: 80,
    statusLabel: 'Large Process',
    class: 'h-12 text-lg text-green-400 border-green-600/30 w-96',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size using h-12 and text-lg Tailwind classes.',
      },
    },
  },
};

// === ICON VARIANTS ===
export const DownloadProgress: Story = {
  args: {
    progress: 42,
    statusLabel: 'Downloading',
    icon: Download,
    class: 'h-8 text-sm text-blue-400 border-blue-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Download progress with custom download icon.',
      },
    },
  },
};

export const UploadProgress: Story = {
  args: {
    progress: 78,
    statusLabel: 'Uploading',
    icon: Upload,
    class: 'h-8 text-sm text-green-400 border-green-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Upload progress with custom upload icon.',
      },
    },
  },
};

export const BatteryIndicator: Story = {
  args: {
    progress: 35,
    statusLabel: 'Battery',
    icon: Battery,
    class: 'h-8 text-sm text-orange-400 border-orange-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Battery indicator with custom battery icon.',
      },
    },
  },
};

export const CPUUsage: Story = {
  args: {
    progress: 67,
    statusLabel: 'CPU Usage',
    icon: Cpu,
    class: 'h-8 text-sm text-purple-400 border-purple-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'CPU usage indicator with custom CPU icon.',
      },
    },
  },
};

// === REAL-WORLD EXAMPLES ===
export const SessionProgress: Story = {
  args: {
    progress: 72,
    statusLabel: 'Session Progress',
    icon: Play,
    class: 'h-10 text-base text-green-400 border-green-600/30 w-96 rounded-lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Gaming session progress with larger size and rounded corners.',
      },
    },
  },
};

export const BackupProgress: Story = {
  args: {
    progress: 23,
    statusLabel: 'System Backup',
    icon: HardDrive,
    class: 'h-6 text-xs text-blue-400 border-blue-600/30 w-64 bg-black/40',
  },
  parameters: {
    docs: {
      description: {
        story: 'System backup progress for dashboard widgets with darker background.',
      },
    },
  },
};

export const NetworkTransfer: Story = {
  args: {
    progress: 88,
    statusLabel: 'Network Transfer',
    icon: Wifi,
    class: 'h-8 text-sm text-cyan-400 border-cyan-600/30 w-80 shadow-lg shadow-cyan-600/10',
  },
  parameters: {
    docs: {
      description: {
        story: 'Network transfer with cyan theme and subtle glow shadow.',
      },
    },
  },
};

export const CompactWidget: Story = {
  args: {
    progress: 60,
    icon: Timer,
    hidePercentage: true,
    class: 'h-4 text-xs text-green-400 border-green-600/30 w-32 rounded-full',
  },
  parameters: {
    docs: {
      description: {
        story: 'Ultra-compact widget for sidebar or status bar with rounded appearance and hidden percentage.',
      },
    },
  },
};

// === INTERACTIVE DEMO ===
export const Interactive: Story = {
  args: {
    progress: 65,
    statusLabel: 'Interactive Demo',
    icon: Clock,
    class: 'h-8 text-sm text-green-400 border-green-600/30 w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo - use the controls to explore options.',
      },
    },
  },
};

// === COMPARISON VIEWS ===
export const ModeComparison: Story = {
  render: () => (
    <div class="space-y-4 w-80">
      <div class="text-gray-400 text-sm font-medium">Normal Progress</div>
      <ProgressBar
        progress={75}
        statusLabel="Upload Progress"
        class="h-8 text-sm text-green-400 border-green-600/30"
      />
      <ProgressBar
        progress={45}
        statusLabel="Processing"
        class="h-8 text-sm text-blue-400 border-blue-600/30"
      />
      
      <div class="text-gray-400 text-sm font-medium mt-6">Overflow Progress</div>
      <ProgressBar
        progress={120}
        statusLabel="Overflow"
        class="h-8 text-sm text-red-400 border-red-600/30"
      />
      
      <div class="text-gray-400 text-sm font-medium mt-6">Shimmer Mode</div>
      <ProgressBar
        progress={45}
        shimmer={true}
        statusLabel="Processing"
        class="h-8 text-sm text-purple-400 border-purple-600/30"
      />
      
      <div class="text-gray-400 text-sm font-medium mt-6">Right Position</div>
      <ProgressBar
        progress={65}
        position="right"
        statusLabel="Processing"
        class="h-8 text-sm text-amber-400 border-amber-600/30"
      />
      
      <div class="text-gray-400 text-sm font-medium mt-6">Hidden Percentage</div>
      <ProgressBar
        progress={80}
        statusLabel="Processing"
        hidePercentage={true}
        class="h-8 text-sm text-cyan-400 border-cyan-600/30"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison showing all major modes: normal, overflow, shimmer, position variants, and hidden percentage.',
      },
    },
    controls: { disable: true }, // disables all controls for this story
  },
};

export const ColorComparison: Story = {
  render: () => (
    <div class="space-y-4 w-80">
      <ProgressBar
        progress={75}
        statusLabel="Green Theme"
        class="h-8 text-sm text-green-400 border-green-600/30"
      />
      <ProgressBar
        progress={65}
        statusLabel="Blue Theme"
        class="h-8 text-sm text-blue-400 border-blue-600/30"
      />
      <ProgressBar
        progress={85}
        statusLabel="Orange Theme"
        class="h-8 text-sm text-orange-400 border-orange-600/30"
      />
      <ProgressBar
        progress={95}
        statusLabel="Red Theme"
        class="h-8 text-sm text-red-400 border-red-600/30"
      />
      <ProgressBar
        progress={100}
        statusLabel="Gray Theme"
        class="h-8 text-sm text-gray-400 border-gray-600/30"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different color themes using Tailwind color classes.',
      },
    },
    controls: { disable: true }, // disables all controls for this story
  },
};

export const SizeComparison: Story = {
  render: () => (
    <div class="space-y-4 w-96">
      <ProgressBar
        progress={65}
        statusLabel="Extra Small"
        class="h-4 text-xs text-green-400 border-green-600/30"
      />
      <ProgressBar
        progress={65}
        statusLabel="Small"
        class="h-6 text-xs text-green-400 border-green-600/30"
      />
      <ProgressBar
        progress={65}
        statusLabel="Medium (Default)"
        class="h-8 text-sm text-green-400 border-green-600/30"
      />
      <ProgressBar
        progress={65}
        statusLabel="Large"
        class="h-12 text-lg text-green-400 border-green-600/30"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different sizes using Tailwind height and text size classes.',
      },
    },
    controls: { disable: true }, // disables all controls for this story
  },
};

export const PercentageDisplayComparison: Story = {
  render: () => (
    <div class="space-y-4 w-80">
      <div class="text-gray-400 text-sm font-medium">With Percentage</div>
      <ProgressBar
        progress={65}
        statusLabel="Standard Display"
        class="h-8 text-sm text-green-400 border-green-600/30"
      />
      <ProgressBar
        progress={120}
        statusLabel="Overflow Display"
        class="h-8 text-sm text-red-400 border-red-600/30"
      />
      
      <div class="text-gray-400 text-sm font-medium mt-6">Hidden Percentage</div>
      <ProgressBar
        progress={65}
        statusLabel="Clean Display"
        hidePercentage={true}
        class="h-8 text-sm text-green-400 border-green-600/30"
      />
      <ProgressBar
        progress={120}
        statusLabel="Overflow Hidden"
        hidePercentage={true}
        class="h-8 text-sm text-red-400 border-red-600/30"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison between showing and hiding percentage display for both normal and overflow states.',
      },
    },
    controls: { disable: true }, // disables all controls for this story
  },
};