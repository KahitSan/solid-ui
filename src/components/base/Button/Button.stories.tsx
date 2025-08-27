import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'Base/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'SHIELDS UP',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'SYSTEMS CHECK',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'EMERGENCY STOP',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'PWR',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'ACTIVATE SHIELDS',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'OFFLINE',
  },
};

// HUD Showcase Story
export const HUDShowcase: Story = {
  render: () => (
    <div class="min-h-screen p-8 flex items-center justify-center" style="background: #0a0a0a;">
      <div class="max-w-md mx-auto space-y-6">
        <h1 class="text-3xl font-digital text-center mb-8 ks-text-glow" style="color: #C9A961;">
          KAHITSAN HUD SYSTEM
        </h1>
        
        <div class="grid grid-cols-1 gap-4">
          <Button variant="primary">SHIELDS ACTIVATE</Button>
          <Button variant="secondary">SYSTEMS CHECK</Button>
          <Button variant="danger">EMERGENCY STOP</Button>
        </div>
        
        <div class="grid grid-cols-3 gap-2">
          <Button size="sm" variant="primary">PWR</Button>
          <Button size="sm" variant="secondary">SYS</Button>
          <Button size="sm" variant="danger">ALT</Button>
        </div>
        
        <div class="flex justify-center">
          <Button size="lg" variant="primary">ENGAGE HYPERDRIVE</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};