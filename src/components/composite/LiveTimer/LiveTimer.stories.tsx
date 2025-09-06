import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import LiveTimer from './LiveTimer';
import { 
  Clock, Timer, Play, Zap, Shield, AlertTriangle, 
  Calendar, Coffee, Gamepad2, Trophy, Target,
  Battery, Wifi, Download, Upload, Check,
  User, MapPin, Briefcase, BookOpen
} from 'lucide-solid';

// Icon mapping for Storybook controls
const iconMap = {
  None: undefined,
  Clock, Timer, Play, Zap, Shield, AlertTriangle,
  Calendar, Coffee, Gamepad2, Trophy, Target,
  Battery, Wifi, Download, Upload, Check,
  User, MapPin, Briefcase, BookOpen
};

const meta: Meta<typeof LiveTimer> = {
  title: 'Composite/LiveTimer',
  component: LiveTimer,
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
        component: 'LiveTimer component that wraps ProgressBar to create dynamic countdown and elapsed time displays. Features overdue tracking, automatic color transitions, and flexible timing scenarios.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    startAt: {
      control: { type: 'date' },
      description: 'Start date and time (required)',
    },
    endAt: {
      control: { type: 'date' },
      description: 'End date and time (optional)',
    },
    overdue: {
      control: { type: 'boolean' },
      description: 'Allow counting past endAt when completed',
      defaultValue: false,
    },
    icon: {
      control: { type: 'select' },
      options: Object.keys(iconMap),
      mapping: iconMap,
      description: 'Custom icon override',
    },
    class: {
      control: { type: 'text' },
      description: 'Custom Tailwind classes for styling',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to create dates relative to now
const now = new Date();
const in30Seconds = new Date(now.getTime() + 30 * 1000);
const in2Minutes = new Date(now.getTime() + 2 * 60 * 1000);
const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);
const ago30Seconds = new Date(now.getTime() - 30 * 1000);
const ago2Minutes = new Date(now.getTime() - 2 * 60 * 1000);
const ago1Hour = new Date(now.getTime() - 60 * 60 * 1000);
const ago5Minutes = new Date(now.getTime() - 5 * 60 * 1000);
const in30Minutes = new Date(now.getTime() + 30 * 60 * 1000);

// === COUNTDOWN TO START SCENARIOS ===
export const CountdownToStart: Story = {
  args: {
    startAt: in2Minutes,
    endAt: new Date(in2Minutes.getTime() + 10 * 60 * 1000), // 10 minutes after start
  },
  parameters: {
    docs: {
      description: {
        story: 'Timer counting down to start time. Uses blue styling with right-aligned progress. Time shows in statusLabel.',
      },
    },
  },
};

export const CountdownToStartSoon: Story = {
  args: {
    startAt: in30Seconds,
    endAt: new Date(in30Seconds.getTime() + 5 * 60 * 1000),
    icon: Timer,
  },
  parameters: {
    docs: {
      description: {
        story: 'Timer with only 30 seconds until start - great for last-minute preparations.',
      },
    },
  },
};

// === ACTIVE COUNTDOWN TIMER SCENARIOS ===
export const JustStarted: Story = {
  args: {
    startAt: ago30Seconds,
    endAt: new Date(ago30Seconds.getTime() + 10 * 60 * 1000),
  },
  parameters: {
    docs: {
      description: {
        story: 'Timer that just started (green phase). Shows remaining time in statusLabel with "Remaining" label.',
      },
    },
  },
};

export const InProgress: Story = {
  args: {
    startAt: ago2Minutes,
    endAt: new Date(ago2Minutes.getTime() + 5 * 60 * 1000),
    icon: Zap,
  },
  parameters: {
    docs: {
      description: {
        story: 'Timer in progress (amber phase). About halfway through the duration.',
      },
    },
  },
};

export const AlmostFinished: Story = {
  args: {
    startAt: ago1Hour,
    endAt: new Date(ago1Hour.getTime() + 70 * 60 * 1000), // 70 minutes duration, 10 left
    icon: AlertTriangle,
  },
  parameters: {
    docs: {
      description: {
        story: 'Timer almost finished (red phase). Creates urgency with red styling.',
      },
    },
  },
};

// === COMPLETED SCENARIOS ===
export const Completed: Story = {
  args: {
    startAt: ago1Hour,
    endAt: ago30Seconds,
    icon: Trophy,
  },
  parameters: {
    docs: {
      description: {
        story: 'Timer that has completed. Shows duration consumed (e.g., "59m") instead of HH:MM:SS format.',
      },
    },
  },
};

export const CompletedLongDuration: Story = {
  args: {
    startAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
    endAt: ago30Seconds,
    icon: Check,
  },
  parameters: {
    docs: {
      description: {
        story: 'Completed timer with longer duration showing hours and minutes format.',
      },
    },
  },
};

// === OVERDUE SCENARIOS ===
export const Overdue: Story = {
  args: {
    startAt: ago1Hour,
    endAt: ago5Minutes,
    overdue: true,
    icon: AlertTriangle,
  },
  parameters: {
    docs: {
      description: {
        story: 'Timer that has exceeded its end time. Shows overdue time in statusLabel with "Overdue" label and progress > 100%.',
      },
    },
  },
};

export const OverdueLong: Story = {
  args: {
    startAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
    endAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago (2h overdue)
    overdue: true,
    icon: AlertTriangle,
  },
  parameters: {
    docs: {
      description: {
        story: 'Timer that is significantly overdue, demonstrating overflow progress visualization.',
      },
    },
  },
};

// === OPEN TIMER SCENARIOS ===
export const OpenTimer: Story = {
  args: {
    startAt: ago2Minutes,
    // No endAt - open timer
  },
  parameters: {
    docs: {
      description: {
        story: 'Open timer showing elapsed time since start. Uses shimmer effect and hides percentage.',
      },
    },
  },
};

export const OpenTimerLong: Story = {
  args: {
    startAt: ago1Hour,
    icon: Coffee,
  },
  parameters: {
    docs: {
      description: {
        story: 'Open timer that has been running for over an hour. Perfect for tracking work sessions.',
      },
    },
  },
};

// === CUSTOM STYLING ===
export const CustomStyling: Story = {
  args: {
    startAt: ago30Seconds,
    endAt: in30Minutes,
    class: 'w-96 h-10 text-lg', // Let component handle colors
    icon: Shield,
  },
  parameters: {
    docs: {
      description: {
        story: 'Timer with custom sizing while maintaining automatic color transitions.',
      },
    },
  },
};

export const FullCustomStyling: Story = {
  args: {
    startAt: ago2Minutes,
    endAt: new Date(ago2Minutes.getTime() + 15 * 60 * 1000),
    class: 'bg-purple-600/20 border border-purple-600/60 text-purple-400 hover:bg-purple-600/30 hover:border-purple-500 w-80 h-12 text-lg',
    icon: Shield,
  },
  parameters: {
    docs: {
      description: {
        story: 'Timer with full custom purple styling that overrides automatic colors.',
      },
    },
  },
};

export const CompactTimer: Story = {
  args: {
    startAt: ago2Minutes,
    endAt: new Date(ago2Minutes.getTime() + 15 * 60 * 1000),
    class: 'w-48 h-6 text-xs',
    icon: Target,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact timer for dashboard widgets and small spaces.',
      },
    },
  },
};

// === REAL-WORLD EXAMPLES ===
export const MeetingTimer: Story = {
  args: {
    startAt: ago2Minutes,
    endAt: new Date(ago2Minutes.getTime() + 30 * 60 * 1000),
    overdue: true, // Allow meetings to run over
    icon: Calendar,
    class: 'w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Meeting timer with overdue enabled - tracks both remaining time and overtime.',
      },
    },
  },
};

export const GameSessionTimer: Story = {
  args: {
    startAt: ago1Hour,
    endAt: new Date(ago1Hour.getTime() + 90 * 60 * 1000),
    icon: Gamepad2,
    class: 'w-96 h-12 text-lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Gaming session timer with larger display for easy visibility.',
      },
    },
  },
};

export const DownloadProgress: Story = {
  args: {
    startAt: ago30Seconds,
    endAt: new Date(ago30Seconds.getTime() + 2 * 60 * 1000),
    icon: Download,
  },
  parameters: {
    docs: {
      description: {
        story: 'Download timer with automatic blue-amber-red color progression.',
      },
    },
  },
};

export const WorkSessionTracker: Story = {
  args: {
    startAt: new Date(now.getTime() - 45 * 60 * 1000), // Started 45 minutes ago
    // No end time - open session
    icon: Coffee,
    class: 'w-72',
  },
  parameters: {
    docs: {
      description: {
        story: 'Work session tracker showing elapsed time since starting work.',
      },
    },
  },
};

// === TABLE SHOWCASE ===
export const TableShowcase: Story = {
  render: () => (
    <div class="bg-black/20 border border-gray-600/30 rounded-lg p-6 w-full max-w-4xl">
      <h3 class="text-amber-400 font-semibold mb-4 text-lg">Task Management Dashboard</h3>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-600/30">
              <th class="text-left text-gray-400 font-medium py-2 px-3">Task</th>
              <th class="text-left text-gray-400 font-medium py-2 px-3">Assigned To</th>
              <th class="text-left text-gray-400 font-medium py-2 px-3 w-80">Timer</th>
              <th class="text-left text-gray-400 font-medium py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-600/20">
            <tr>
              <td class="py-3 px-3 text-gray-300">Website Redesign</td>
              <td class="py-3 px-3 text-gray-400">Sarah Chen</td>
              <td class="py-3 px-3">
                <LiveTimer 
                  startAt={ago2Minutes}
                  endAt={new Date(ago2Minutes.getTime() + 4 * 60 * 60 * 1000)}
                  icon={Briefcase}
                  class="w-full h-8 text-sm"
                />
              </td>
              <td class="py-3 px-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-amber-600/20 text-amber-400">
                  In Progress
                </span>
              </td>
            </tr>
            <tr>
              <td class="py-3 px-3 text-gray-300">Code Review</td>
              <td class="py-3 px-3 text-gray-400">Mike Johnson</td>
              <td class="py-3 px-3">
                <LiveTimer 
                  startAt={ago1Hour}
                  endAt={ago5Minutes}
                  overdue={true}
                  icon={AlertTriangle}
                  class="w-full h-8 text-sm"
                />
              </td>
              <td class="py-3 px-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-red-600/20 text-red-400">
                  Overdue
                </span>
              </td>
            </tr>
            <tr>
              <td class="py-3 px-3 text-gray-300">Documentation</td>
              <td class="py-3 px-3 text-gray-400">Alex Kim</td>
              <td class="py-3 px-3">
                <LiveTimer 
                  startAt={in30Seconds}
                  endAt={new Date(in30Seconds.getTime() + 2 * 60 * 60 * 1000)}
                  icon={BookOpen}
                  class="w-full h-8 text-sm"
                />
              </td>
              <td class="py-3 px-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-600/20 text-blue-400">
                  Starting Soon
                </span>
              </td>
            </tr>
            <tr>
              <td class="py-3 px-3 text-gray-300">Testing Phase</td>
              <td class="py-3 px-3 text-gray-400">Jordan Lee</td>
              <td class="py-3 px-3">
                <LiveTimer 
                  startAt={new Date(now.getTime() - 3 * 60 * 60 * 1000)}
                  endAt={ago30Seconds}
                  icon={Check}
                  class="w-full h-8 text-sm"
                />
              </td>
              <td class="py-3 px-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-600/20 text-green-400">
                  Completed
                </span>
              </td>
            </tr>
            <tr>
              <td class="py-3 px-3 text-gray-300">Research Session</td>
              <td class="py-3 px-3 text-gray-400">Taylor Brown</td>
              <td class="py-3 px-3">
                <LiveTimer 
                  startAt={ago30Seconds}
                  icon={User}
                  class="w-full h-6 text-xs"
                />
              </td>
              <td class="py-3 px-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-600/20 text-green-400">
                  Active
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'LiveTimer components integrated into a task management table, showing various timer states including countdown, active, overdue, completed, and open timers.',
      },
    },
  },
};

// === EDGE CASES ===
export const VeryShortTimer: Story = {
  args: {
    startAt: ago30Seconds,
    endAt: new Date(ago30Seconds.getTime() + 60 * 1000), // 1 minute total
    overdue: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Very short timer (1 minute) to test rapid color transitions and overdue behavior.',
      },
    },
  },
};

export const CountdownStartingSoon: Story = {
  args: {
    startAt: new Date(now.getTime() + 10 * 1000), // 10 seconds from now
    endAt: new Date(now.getTime() + 5 * 60 * 1000 + 10 * 1000), // 5 minutes after start
    icon: Timer,
  },
  parameters: {
    docs: {
      description: {
        story: 'Timer starting in just 10 seconds - watch it transition from countdown to active mode.',
      },
    },
  },
};

// === INTERACTIVE DEMO ===
export const Interactive: Story = {
  args: {
    startAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    endAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    overdue: true,
    icon: Clock,
    class: 'w-80',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo - adjust the times, overdue setting, and styling using the controls below. Dates will be automatically converted to proper Date objects.',
      },
    },
  },
};