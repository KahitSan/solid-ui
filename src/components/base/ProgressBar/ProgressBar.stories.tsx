import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import ProgressBar from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'HUD/ProgressBar',
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
        component: 'HUD-style ProgressBar component perfect for timers, loading states, and system monitoring. Features dynamic status coloring, pulse animations, and clean typography.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value from 0 to 100',
      defaultValue: 65,
    },
    timeRemaining: {
      control: { type: 'text' },
      description: 'Time remaining text (e.g., "2:30:45", "5 min left")',
      defaultValue: '01:23:45',
    },
    status: {
      control: { type: 'select' },
      options: ['active', 'warning', 'urgent', 'completed', 'paused'],
      description: 'Status determines color scheme and animations',
      defaultValue: 'active',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Component size',
      defaultValue: 'md',
    },
    showPercentage: {
      control: { type: 'boolean' },
      description: 'Show percentage completion on the right',
      defaultValue: true,
    },
    showIcon: {
      control: { type: 'boolean' },
      description: 'Show clock icon',
      defaultValue: true,
    },
    label: {
      control: { type: 'text' },
      description: 'Optional label text',
    },
    class: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// === BASIC USAGE ===
export const Default: Story = {
  args: {
    progress: 65,
    timeRemaining: '01:23:45',
    status: 'active',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default progress bar with active status. Good for ongoing processes and timers.',
      },
    },
  },
};

// === STATUS VARIANTS ===
export const Active: Story = {
  args: {
    progress: 75,
    timeRemaining: '45:30',
    status: 'active',
    label: 'Session Time',
  },
  parameters: {
    docs: {
      description: {
        story: 'Active status with green theme for normal operation.',
      },
    },
  },
};

export const Warning: Story = {
  args: {
    progress: 85,
    timeRemaining: '15:00',
    status: 'warning',
    label: 'Low Time',
  },
  parameters: {
    docs: {
      description: {
        story: 'Warning status with orange theme and pulse animation. Used when time is running low.',
      },
    },
  },
};

export const Urgent: Story = {
  args: {
    progress: 95,
    timeRemaining: '05:00',
    status: 'urgent',
    label: 'Critical',
  },
  parameters: {
    docs: {
      description: {
        story: 'Urgent status with red theme and strong pulse animation. Used for critical situations.',
      },
    },
  },
};

export const Completed: Story = {
  args: {
    progress: 100,
    timeRemaining: '00:00',
    status: 'completed',
    label: 'Finished',
  },
  parameters: {
    docs: {
      description: {
        story: 'Completed status with muted gray theme for finished processes.',
      },
    },
  },
};

export const Paused: Story = {
  args: {
    progress: 45,
    timeRemaining: '02:15:30',
    status: 'paused',
    label: 'Paused',
  },
  parameters: {
    docs: {
      description: {
        story: 'Paused status with blue theme for temporarily stopped processes.',
      },
    },
  },
};

// === SIZES ===
export const Small: Story = {
  args: {
    progress: 60,
    timeRemaining: '30:15',
    status: 'active',
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small size for compact interfaces and dashboards.',
      },
    },
  },
};

export const Medium: Story = {
  args: {
    progress: 70,
    timeRemaining: '01:45:00',
    status: 'active',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium size (default) for most use cases.',
      },
    },
  },
};

export const Large: Story = {
  args: {
    progress: 80,
    timeRemaining: '03:30:45',
    status: 'active',
    size: 'lg',
    label: 'Main Process',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size for prominent displays and main timers.',
      },
    },
  },
};

// === DISPLAY OPTIONS ===
export const WithoutPercentage: Story = {
  args: {
    progress: 65,
    timeRemaining: '01:23:45',
    status: 'active',
    showPercentage: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar without percentage display for cleaner look.',
      },
    },
  },
};

export const WithoutIcon: Story = {
  args: {
    progress: 65,
    timeRemaining: '01:23:45',
    status: 'active',
    showIcon: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar without clock icon for minimal design.',
      },
    },
  },
};

export const MinimalDisplay: Story = {
  args: {
    progress: 65,
    timeRemaining: '01:23:45',
    status: 'active',
    showPercentage: false,
    showIcon: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal display with just the timer text and progress fill.',
      },
    },
  },
};

export const WithCustomLabel: Story = {
  args: {
    progress: 42,
    timeRemaining: '2h 15m',
    status: 'active',
    label: 'Rendering Video',
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar with custom label for process identification.',
      },
    },
  },
};

export const LongLabelEllipsis: Story = {
  args: {
    progress: 65,
    timeRemaining: '01:23:45',
    status: 'active',
    label: 'Very Long Process Name That Should Be Truncated With Ellipsis',
    class: 'w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates ellipsis truncation when label text is too long. Label will show "..." and percentage remains visible.',
      },
    },
  },
};

// === PROGRESS STATES ===
export const AlmostEmpty: Story = {
  args: {
    progress: 5,
    timeRemaining: '02:55:30',
    status: 'active',
    label: 'Just Started',
  },
  parameters: {
    docs: {
      description: {
        story: 'Very low progress state showing minimal fill.',
      },
    },
  },
};

export const HalfComplete: Story = {
  args: {
    progress: 50,
    timeRemaining: '01:30:00',
    status: 'active',
    label: 'Halfway',
  },
  parameters: {
    docs: {
      description: {
        story: 'Exactly halfway progress for balanced visual.',
      },
    },
  },
};

export const AlmostComplete: Story = {
  args: {
    progress: 98,
    timeRemaining: '00:02:15',
    status: 'warning',
    label: 'Almost Done',
  },
  parameters: {
    docs: {
      description: {
        story: 'Nearly complete with warning status and minimal time remaining.',
      },
    },
  },
};

// === REAL-WORLD EXAMPLES ===
export const SessionTimer: Story = {
  args: {
    progress: 72,
    timeRemaining: '28:45',
    status: 'active',
    label: 'Gaming Session',
    class: 'w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Gaming session timer with fixed width for dashboard display.',
      },
    },
  },
};

export const ProcessingJob: Story = {
  args: {
    progress: 35,
    timeRemaining: '~15 min',
    status: 'active',
    label: 'Processing Data',
    size: 'lg',
    class: 'w-96',
  },
  parameters: {
    docs: {
      description: {
        story: 'Long-running process with estimated time remaining.',
      },
    },
  },
};

export const CriticalAlert: Story = {
  args: {
    progress: 90,
    timeRemaining: '10:00',
    status: 'urgent',
    label: 'Server Maintenance',
    size: 'lg',
    class: 'w-96',
  },
  parameters: {
    docs: {
      description: {
        story: 'Critical system alert with urgent status and pulsing animation.',
      },
    },
  },
};

export const CompactDashboard: Story = {
  args: {
    progress: 83,
    timeRemaining: '17:30',
    status: 'warning',
    size: 'sm',
    showPercentage: false,
    class: 'w-48',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact timer for dashboard widgets with limited space.',
      },
    },
  },
};

export const SystemMonitor: Story = {
  args: {
    progress: 23,
    timeRemaining: '6h 45m',
    status: 'active',
    label: 'Backup Progress',
    showIcon: false,
    class: 'w-64',
  },
  parameters: {
    docs: {
      description: {
        story: 'System monitoring display for long-running background tasks.',
      },
    },
  },
};

// === INTERACTIVE DEMO ===
export const Interactive: Story = {
  args: {
    progress: 65,
    timeRemaining: '01:23:45',
    status: 'active',
    size: 'md',
    showPercentage: true,
    showIcon: true,
    label: 'Interactive Demo',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo - use the controls to explore all options and see how the component responds to different states.',
      },
    },
  },
};

// === COMPARISON VIEW ===
export const StatusComparison: Story = {
  render: () => (
    <div class="space-y-4 w-80">
      <ProgressBar
        progress={75}
        timeRemaining="45:30"
        status="active"
        label="Active Status"
      />
      <ProgressBar
        progress={85}
        timeRemaining="15:00"
        status="warning"
        label="Warning Status"
      />
      <ProgressBar
        progress={95}
        timeRemaining="05:00"
        status="urgent"
        label="Urgent Status"
      />
      <ProgressBar
        progress={45}
        timeRemaining="02:15:30"
        status="paused"
        label="Paused Status"
      />
      <ProgressBar
        progress={100}
        timeRemaining="00:00"
        status="completed"
        label="Completed Status"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all status variants to show different color schemes and animations.',
      },
    },
  },
};

export const SizeComparison: Story = {
  render: () => (
    <div class="space-y-4 w-80">
      <ProgressBar
        progress={65}
        timeRemaining="01:23:45"
        status="active"
        size="sm"
        label="Small Size"
      />
      <ProgressBar
        progress={65}
        timeRemaining="01:23:45"
        status="active"
        size="md"
        label="Medium Size"
      />
      <ProgressBar
        progress={65}
        timeRemaining="01:23:45"
        status="active"
        size="lg"
        label="Large Size"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all size variants showing different proportions and text sizes.',
      },
    },
  },
};