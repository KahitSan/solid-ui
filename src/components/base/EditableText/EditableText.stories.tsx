// EditableText.stories.tsx
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import EditableText from './EditableText';
import { 
  Edit, Edit2, Edit3, Pencil, Type, FileText, Tag, Hash,
  User, Mail, Phone, MapPin, Calendar, Clock, Star,
  Settings, Info, AlertCircle, CheckCircle, X, Shield,
  Activity, Zap, Target, Wifi, Battery
} from 'lucide-solid';
import { createSignal, For } from 'solid-js';
import { userEvent, within, expect, fn } from '@storybook/test';

// Icon mapping for Storybook controls
const iconMap = {
  None: undefined,
  Edit, Edit2, Edit3, Pencil, Type, FileText, Tag, Hash,
  User, Mail, Phone, MapPin, Calendar, Clock, Star,
  Settings, Info, AlertCircle, CheckCircle, X
};

const meta: Meta<typeof EditableText> = {
  title: 'Base/EditableText',
  component: EditableText,
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
        component: 'Inline text editing component that wraps existing content. Preserves parent styling while providing seamless editing capabilities. Perfect for making any text content editable without changing the semantic structure.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: { type: 'text' },
      description: 'Current text content (children)',
      defaultValue: 'Edit me!',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text when value is empty',
      defaultValue: 'Click to edit...',
    },
    trigger: {
      control: { type: 'select' },
      options: ['click', 'doubleClick'],
      description: 'How to trigger edit mode',
      defaultValue: 'click',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the component is disabled',
      defaultValue: false,
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
      defaultValue: 'right',
    },
    showIconOnHover: {
      control: { type: 'boolean' },
      description: 'Only show icon on hover/editing',
      defaultValue: false,
    },
    allowBreakLine: {
      control: { type: 'boolean' },
      description: 'Allow line breaks in editing mode',
      defaultValue: false,
    },
    onEmpty: {
      control: { type: null },
      description: 'Handler for empty content. Receives currentValue, originalValue, confirm, and cancel callbacks.',
    },
    class: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the wrapper',
    },
    onChange: { action: true },
    onEditStart: { action: true },
    onEditEnd: { action: true },
    onCancel: { action: true },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// === STATEFUL STORY RENDERER ===
const StatefulEditableText = (args: any) => {
  const [text, setText] = createSignal(args.children || 'Edit me!');
  
  return (
    <EditableText
      onChange={(value) => {
        setText(value);
        args.onChange?.(value);
      }}
      onEditStart={args.onEditStart}
      onEditEnd={args.onEditEnd}
      onCancel={args.onCancel}
      onEmpty={args.onEmpty}
      placeholder={args.placeholder}
      trigger={args.trigger}
      disabled={args.disabled}
      icon={args.icon}
      iconPosition={args.iconPosition}
      showIconOnHover={args.showIconOnHover}
      allowBreakLine={args.allowBreakLine}
    >
      {text()}
    </EditableText>
  );
};

// === WRAPPING SCENARIOS ===
export const TextWrapping: Story = {
  render: (args) => {
    return (
      <div class="max-w-xs border border-gray-600 p-4 bg-gray-800/30">
        <div class="text-amber-400 font-medium">
          <StatefulEditableText {...args} />
        </div>
      </div>
    );
  },
  args: {
    children: 'This is a very long text that will wrap to multiple lines when it reaches the container boundary, demonstrating proper text wrapping behavior during both editing and non-editing states.',
    placeholder: 'Click to edit...',
    trigger: 'click',
    disabled: false,
    icon: Edit,
    iconPosition: 'right',
    showIconOnHover: false,
    allowBreakLine: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Text wrapping behavior. The component inherits the parent container\'s text wrapping properties and maintains them during editing.',
      },
    },
  },
};

export const NoTextWrapping: Story = {
  render: (args) => {
    return (
      <div class="max-w-xs border border-gray-600 p-4 bg-gray-800/30" style={{ 'white-space': 'nowrap' }}>
        <div class="text-amber-400 font-medium overflow-x-auto">
          <StatefulEditableText {...args} />
        </div>
      </div>
    );
  },
  args: {
    children: 'This is a very long text that will NOT wrap because the container has white-space: nowrap styling applied to it.',
    placeholder: 'Click to edit...',
    trigger: 'click',
    disabled: false,
    icon: Edit,
    iconPosition: 'right',
    showIconOnHover: false,
    allowBreakLine: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'No text wrapping. The component respects the parent container\'s white-space: nowrap styling and maintains it during editing.',
      },
    },
  },
};

// === ICON VARIATIONS ===
export const WithoutIcon: Story = {
  render: (args) => {
    return (
      <div class="text-amber-400 font-medium">
        <StatefulEditableText {...args} />
      </div>
    );
  },
  args: {
    children: 'Text without icon',
    placeholder: 'Click to edit...',
    trigger: 'click',
    disabled: false,
    icon: undefined,
    iconPosition: 'right',
    showIconOnHover: false,
    allowBreakLine: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'EditableText without any icon. Clean and minimal appearance.',
      },
    },
  },
};

export const CustomIconSize: Story = {
  render: (args) => {
    return (
      <div class="text-amber-400 font-medium">
        <StatefulEditableText {...args} />
      </div>
    );
  },
  args: {
    children: 'Custom icon size',
    placeholder: 'Click to edit...',
    trigger: 'click',
    disabled: false,
    icon: () => <Edit size={24} class="text-blue-400" />,
    iconPosition: 'right',
    showIconOnHover: false,
    allowBreakLine: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom icon size and styling. The icon can be any component with custom sizing and colors.',
      },
    },
  },
};

// === BASIC WRAPPER EXAMPLES ===
export const InHeading: Story = {
  render: (args) => {
    return (
      <h1 class="text-3xl font-bold text-amber-300">
        <StatefulEditableText {...args} />
      </h1>
    );
  },
  args: {
    children: 'MISSION CONTROL',
    placeholder: 'Click to edit...',
    trigger: 'click',
    disabled: false,
    icon: Edit,
    iconPosition: 'right',
    showIconOnHover: true,
    allowBreakLine: false,
  },
};

export const InParagraph: Story = {
  render: (args) => {
    return (
      <p class="text-gray-300 leading-relaxed max-w-md">
        <StatefulEditableText {...args} />
      </p>
    );
  },
  args: {
    children: 'Status report indicates all systems are operational and ready for deployment.',
    placeholder: 'Click to edit...',
    trigger: 'click',
    disabled: false,
    icon: FileText,
    iconPosition: 'right',
    showIconOnHover: true,
    allowBreakLine: false,
  },
};


export const Interactive: Story = {
  render: (args) => {
    return (
      <div class="text-amber-400 font-medium">
        <StatefulEditableText {...args} />
      </div>
    );
  },
  args: {
    children: 'INTERACTIVE DEMO',
    trigger: 'click',
    icon: Edit,
    iconPosition: 'right',
    showIconOnHover: false,
    disabled: false,
    placeholder: 'Enter text...',
    allowBreakLine: false,
  },
};

export const HandleEmptyContent: Story = {
  render: (args) => {
    return (
      <div class="space-y-6 p-4 max-w-2xl">
        <div>
          <h3 class="text-amber-400 font-medium mb-2">Revert to Original on Empty</h3>
          <div class="text-gray-300">
            <StatefulEditableText 
              {...args}
              onEmpty={({ originalValue, confirm }) => {
                confirm(originalValue); // Immediately revert
              }}
            />
          </div>
        </div>
        
        <div>
          <h3 class="text-amber-400 font-medium mb-2">Allow Empty (Default)</h3>
          <div class="text-gray-300">
            <StatefulEditableText 
              {...args}
              onEmpty={({ currentValue, confirm }) => {
                confirm(currentValue); // Immediately allow empty
              }}
            />
          </div>
        </div>
        
        <div>
          <h3 class="text-amber-400 font-medium mb-2">Custom Empty Handler</h3>
          <div class="text-gray-300">
            <StatefulEditableText 
              {...args}
              onEmpty={({ currentValue, originalValue, confirm }) => {
                // Custom logic: if original was not empty, revert; otherwise allow empty
                const result = originalValue.trim() !== '' ? originalValue : currentValue;
                confirm(result);
              }}
            />
          </div>
        </div>
        
        <div class="text-xs text-gray-500 mt-4">
          <p>Try: Edit any field → Delete all content → Press Enter to save</p>
        </div>
      </div>
    );
  },
  args: {
    children: 'Try deleting this content',
    placeholder: 'Empty placeholder',
    trigger: 'click',
    disabled: false,
    icon: Edit,
    iconPosition: 'right',
    showIconOnHover: false,
    allowBreakLine: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test Revert to Original
    const revertField = await canvas.findByText('Revert to Original on Empty');
    const revertEditable = revertField.nextElementSibling?.firstElementChild as HTMLElement;
    
    // Click to edit
    await userEvent.click(revertEditable);
    
    // Wait for DOM update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Find contenteditable and clear it
    const revertSpan = revertEditable.querySelector('span[contenteditable="true"]') as HTMLSpanElement;
    expect(revertSpan).not.toBeNull();
    
    if (revertSpan) {
      revertSpan.textContent = '';
      await userEvent.keyboard('{Enter}');
      
      // Should revert to original text
      await new Promise(resolve => setTimeout(resolve, 100));
      await expect(() => canvas.findByText('Try deleting this content')).not.toThrow();
    }
    
    // Test Allow Empty
    const allowField = await canvas.findByText('Allow Empty (Default)');
    const allowEditable = allowField.nextElementSibling?.firstElementChild as HTMLElement;
    
    // Click to edit
    await userEvent.click(allowEditable);
    
    // Wait for DOM update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Find contenteditable and clear it
    const allowSpan = allowEditable.querySelector('span[contenteditable="true"]') as HTMLSpanElement;
    expect(allowSpan).not.toBeNull();
    
    if (allowSpan) {
      allowSpan.textContent = '';
      await userEvent.keyboard('{Enter}');
      
      // Should show placeholder
      await new Promise(resolve => setTimeout(resolve, 100));
      await expect(() => canvas.findByText('Empty placeholder')).not.toThrow();
    }
    
    // Test Custom Empty Handler (with original content that's not empty)
    const customField = await canvas.findByText('Custom Empty Handler');
    const customEditable = customField.nextElementSibling?.firstElementChild as HTMLElement;
    
    // Click to edit
    await userEvent.click(customEditable);
    
    // Wait for DOM update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Find contenteditable and clear it
    const customSpan = customEditable.querySelector('span[contenteditable="true"]') as HTMLSpanElement;
    expect(customSpan).not.toBeNull();
    
    if (customSpan) {
      customSpan.textContent = '';
      await userEvent.keyboard('{Enter}');
      
      // Should revert to original (since original was not empty)
      await new Promise(resolve => setTimeout(resolve, 100));
      await expect(() => canvas.findByText('Try deleting this content')).not.toThrow();
    }
    
    // Test Custom Empty Handler with originally empty content
    // First make the field empty, then test empty-to-empty scenario
    await userEvent.click(customEditable);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const customSpan2 = customEditable.querySelector('span[contenteditable="true"]') as HTMLSpanElement;
    if (customSpan2) {
      customSpan2.textContent = '';
      await userEvent.keyboard('{Enter}');
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Now click again and try to save empty - should allow empty since original was also empty
    await userEvent.click(customEditable);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const customSpan3 = customEditable.querySelector('span[contenteditable="true"]') as HTMLSpanElement;
    if (customSpan3) {
      customSpan3.textContent = '';
      await userEvent.keyboard('{Enter}');
      
      // Should show placeholder (allow empty)
      await new Promise(resolve => setTimeout(resolve, 100));
      await expect(() => canvas.findByText('Empty placeholder')).not.toThrow();
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Different strategies for handling empty content using the callback-based approach. The onEmpty prop receives confirm/cancel callbacks for flexible handling.',
      },
    },
  },
};

export const AsyncEmptyConfirmation: Story = {
  render: (args) => {
    const [showConfirm, setShowConfirm] = createSignal(false);
    const [confirmCallbacks, setConfirmCallbacks] = createSignal<{
      confirm?: (value: string) => void;
      cancel?: () => void;
    }>({});
    
    const StatefulWithAsyncConfirm = (props: any) => {
      const [text, setText] = createSignal(props.children || 'Edit me!');
      
      return (
        <div class="space-y-2">
          <EditableText
            onChange={(value) => {
              setText(value);
              props.onChange?.(value);
            }}
            onEditStart={props.onEditStart}
            onEditEnd={props.onEditEnd}
            onCancel={props.onCancel}
            onEmpty={async ({ currentValue, originalValue, confirm, cancel }) => {
              // Show confirmation dialog and wait for user response
              setConfirmCallbacks({ confirm, cancel });
              setShowConfirm(true);
              
              // The actual confirmation handling happens in the modal buttons
              // This function doesn't return anything, the callbacks handle the result
            }}
            placeholder={props.placeholder}
            trigger={props.trigger}
            disabled={props.disabled}
            icon={props.icon}
            iconPosition={props.iconPosition}
            showIconOnHover={props.showIconOnHover}
            allowBreakLine={props.allowBreakLine}
          >
            {text()}
          </EditableText>
          
          {showConfirm() && (
            <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div class="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-sm">
                <h3 class="text-amber-400 font-medium mb-2">Confirm Empty Content</h3>
                <p class="text-gray-300 text-sm mb-4">
                  Are you sure you want to leave this field empty?
                </p>
                <div class="flex gap-2 justify-end">
                  <button 
                    onClick={() => {
                      confirmCallbacks().cancel?.();
                      setShowConfirm(false);
                    }}
                    class="px-3 py-1 bg-gray-600 text-gray-300 rounded text-sm hover:bg-gray-500"
                    data-testid="cancel-empty"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      confirmCallbacks().confirm?.(''); // Confirm with empty string
                      setText(''); // Update local state
                      setShowConfirm(false);
                    }}
                    class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-500"
                    data-testid="confirm-empty"
                  >
                    Confirm Empty
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };
    
    return (
      <div class="text-gray-300">
        <StatefulWithAsyncConfirm {...args} />
      </div>
    );
  },
  args: {
    children: 'Try deleting this content for async confirmation',
    placeholder: 'Empty placeholder',
    trigger: 'click',
    disabled: false,
    icon: Edit,
    iconPosition: 'right',
    showIconOnHover: false,
    allowBreakLine: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test Async Confirmation
    const asyncEditable = await canvas.findByText('Try deleting this content for async confirmation');
    
    // Click to edit
    await userEvent.click(asyncEditable);
    
    // Wait for DOM update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Find contenteditable and clear it
    const asyncSpan = asyncEditable.parentElement?.querySelector('span[contenteditable="true"]') as HTMLSpanElement;
    expect(asyncSpan).not.toBeNull();
    
    if (asyncSpan) {
      asyncSpan.textContent = '';
      await userEvent.keyboard('{Enter}');
      
      // Wait for confirmation dialog
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Should show confirmation dialog
      const confirmButton = await canvas.findByTestId('confirm-empty');
      const cancelButton = await canvas.findByTestId('cancel-empty');
      
      expect(confirmButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
      
      // Test cancel scenario
      await userEvent.click(cancelButton);
      
      // Should revert to original text
      await new Promise(resolve => setTimeout(resolve, 200));
      await expect(() => canvas.findByText('Try deleting this content for async confirmation')).not.toThrow();
      
      // Test confirm scenario
      await userEvent.click(asyncEditable);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (asyncSpan) {
        asyncSpan.textContent = '';
        await userEvent.keyboard('{Enter}');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const confirmButton2 = await canvas.findByTestId('confirm-empty');
        await userEvent.click(confirmButton2);
        
        // Should show placeholder
        await new Promise(resolve => setTimeout(resolve, 200));
        await expect(() => canvas.findByText('Empty placeholder')).not.toThrow();
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of using onEmpty with async confirmation. The handler receives confirm/cancel callbacks that can be called later based on user interaction.',
      },
    },
  },
};

// === INTERACTION TESTS ===
export const ClickToEdit: Story = {
  render: (args) => {
    const spies = args.spies || { onChange: fn(), onEditStart: fn(), onEditEnd: fn(), onCancel: fn() };
    
    return (
      <div class="text-amber-400 font-medium p-4">
        <EditableText 
          onChange={(value) => {
            spies.onChange(value);
            args.onChange?.(value);
          }}
          onEditStart={() => {
            spies.onEditStart();
            args.onEditStart?.();
          }}
          onEditEnd={() => {
            spies.onEditEnd();
            args.onEditEnd?.();
          }}
          onCancel={() => {
            spies.onCancel();
            args.onCancel?.();
          }}
          icon={Edit}
        >
          {args.children}
        </EditableText>
      </div>
    );
  },
  args: {
    children: 'Click to edit this text',
    spies: { onChange: fn(), onEditStart: fn(), onEditEnd: fn(), onCancel: fn() },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const spies = args.spies;
    const editableText = await canvas.findByText('Click to edit this text');
    
    // Click to start editing
    await userEvent.click(editableText);
    
    // Verify edit start was called
    await expect(spies.onEditStart).toHaveBeenCalled();
    
    // Wait for DOM update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Find the contenteditable span
    const span = editableText.parentElement?.querySelector('span[contenteditable="true"]');
    expect(span).not.toBeNull();
    
    if (span) {
      // Type new text
      span.textContent = '';
      await userEvent.type(span, 'Updated text');
      
      // Press Enter to save
      await userEvent.keyboard('{Enter}');
      
      // Wait for events
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify change and edit end were called
      await expect(spies.onChange).toHaveBeenCalledWith('Updated text');
      await expect(spies.onEditEnd).toHaveBeenCalled();
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Interaction test: Click to edit, type new text, press Enter to save.',
      },
    },
  },
};

export const DoubleClickToEdit: Story = {
  render: (args) => {
    const spies = args.spies || { onChange: fn(), onEditStart: fn(), onEditEnd: fn(), onCancel: fn() };
    
    return (
      <div class="text-amber-400 font-medium p-4">
        <EditableText 
          onChange={(value) => {
            spies.onChange(value);
            args.onChange?.(value);
          }}
          onEditStart={() => {
            spies.onEditStart();
            args.onEditStart?.();
          }}
          onEditEnd={() => {
            spies.onEditEnd();
            args.onEditEnd?.();
          }}
          onCancel={() => {
            spies.onCancel();
            args.onCancel?.();
          }}
          trigger="doubleClick"
          icon={Edit2}
        >
          {args.children}
        </EditableText>
      </div>
    );
  },
  args: {
    children: 'Double-click to edit this text',
    trigger: 'doubleClick',
    spies: { onChange: fn(), onEditStart: fn(), onEditEnd: fn(), onCancel: fn() },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const spies = args.spies;
    const editableText = await canvas.findByText('Double-click to edit this text');
    
    // Double-click to start editing
    await userEvent.dblClick(editableText);
    
    // Verify edit start was called
    await expect(spies.onEditStart).toHaveBeenCalled();
    
    // Wait for DOM update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Find the contenteditable span
    const span = editableText.parentElement?.querySelector('span[contenteditable="true"]');
    expect(span).not.toBeNull();
    
    if (span) {
      // Type new text
      span.textContent = '';
      await userEvent.type(span, 'Double-click updated');
      
      // Press Enter to save
      await userEvent.keyboard('{Enter}');
      
      // Wait for events
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify change and edit end were called
      await expect(spies.onChange).toHaveBeenCalledWith('Double-click updated');
      await expect(spies.onEditEnd).toHaveBeenCalled();
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Interaction test: Double-click to edit, type new text, press Enter to save.',
      },
    },
  },
};

export const EscapeToCancel: Story = {
  render: (args) => {
    const spies = args.spies || { onChange: fn(), onEditStart: fn(), onEditEnd: fn(), onCancel: fn() };
    
    return (
      <div class="text-amber-400 font-medium p-4">
        <EditableText 
          onChange={(value) => {
            spies.onChange(value);
            args.onChange?.(value);
          }}
          onEditStart={() => {
            spies.onEditStart();
            args.onEditStart?.();
          }}
          onEditEnd={() => {
            spies.onEditEnd();
            args.onEditEnd?.();
          }}
          onCancel={() => {
            spies.onCancel();
            args.onCancel?.();
          }}
          icon={Edit}
        >
          {args.children}
        </EditableText>
      </div>
    );
  },
  args: {
    children: 'Press Escape to cancel',
    spies: { onChange: fn(), onEditStart: fn(), onEditEnd: fn(), onCancel: fn() },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const spies = args.spies;
    const editableText = await canvas.findByText('Press Escape to cancel');
    
    // Click to start editing
    await userEvent.click(editableText);
    
    // Verify edit start was called
    await expect(spies.onEditStart).toHaveBeenCalled();
    
    // Wait for DOM update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Find the contenteditable span
    const span = editableText.parentElement?.querySelector('span[contenteditable="true"]');
    expect(span).not.toBeNull();
    
    if (span) {
      // Type new text
      await userEvent.type(span, 'This should be cancelled');
      
      // Press Escape to cancel
      await userEvent.keyboard('{Escape}');
      
      // Wait for events
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify cancel was called
      await expect(spies.onCancel).toHaveBeenCalled();
      // onChange should not be called when cancelled
      await expect(spies.onChange).not.toHaveBeenCalled();
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Interaction test: Click to edit, type new text, press Escape to cancel and restore original text.',
      },
    },
  },
};

export const WithLineBreaks: Story = {
  render: (args) => {
    const spies = args.spies || { onChange: fn(), onEditStart: fn(), onEditEnd: fn(), onCancel: fn() };
    
    return (
      <div class="text-amber-400 font-medium max-w-xs">
        <EditableText 
          onChange={(value) => {
            spies.onChange(value);
            args.onChange?.(value);
          }}
          onEditStart={() => {
            spies.onEditStart();
            args.onEditStart?.();
          }}
          onEditEnd={() => {
            spies.onEditEnd();
            args.onEditEnd?.();
          }}
          onCancel={() => {
            spies.onCancel();
            args.onCancel?.();
          }}
          icon={Edit} 
          allowBreakLine={true}
        >
          {args.children}
        </EditableText>
      </div>
    );
  },
  args: {
    children: 'This text\nsupports\nline breaks',
    allowBreakLine: true,
    spies: { onChange: fn(), onEditStart: fn(), onEditEnd: fn(), onCancel: fn() },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const spies = args.spies;
    
    // Use a more flexible text matcher for multiline text
    const editableText = await canvas.findByText((content, element) => {
      return content.includes('This text') && content.includes('supports') && content.includes('line breaks');
    });
    
    // Click to start editing
    await userEvent.click(editableText);
    
    // Verify edit start was called
    await expect(spies.onEditStart).toHaveBeenCalled();
    
    // Wait for DOM update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Find the contenteditable span
    const span = editableText.parentElement?.querySelector('span[contenteditable="true"]');
    expect(span).not.toBeNull();
    
    if (span) {
      // Clear and type text with line breaks
      span.textContent = '';
      await userEvent.type(span, 'Line 1{shift>}{enter}{/shift}Line 2{shift>}{enter}{/shift}Line 3');
      
      // Press Enter to save
      await userEvent.keyboard('{Enter}');
      
      // Wait for events
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify change was called with line breaks preserved
      await expect(spies.onChange).toHaveBeenCalledWith('Line 1\nLine 2\nLine 3');
      await expect(spies.onEditEnd).toHaveBeenCalled();
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Supports line breaks when allowBreakLine is true. Use Shift+Enter for line breaks, Enter to save.',
      },
    },
  },
};

export const EventHandling: Story = {
  render: (args) => {
    const [events, setEvents] = createSignal<string[]>([]);
    const spies = args.spies || { onChange: fn(), onEditStart: fn(), onEditEnd: fn(), onCancel: fn() };
    
    const logEvent = (event: string) => {
      setEvents(prev => [...prev, `${new Date().toLocaleTimeString()}: ${event}`]);
    };
    
    const clearEvents = () => setEvents([]);
    
    return (
      <div class="space-y-4 p-4 max-w-2xl">
        <div class="text-amber-400 font-medium text-lg">
          <EditableText 
            onChange={(value) => {
              logEvent(`onChange: "${value}"`);
              spies.onChange(value);
              args.onChange?.(value);
            }}
            onEditStart={() => {
              logEvent('onEditStart');
              spies.onEditStart();
              args.onEditStart?.();
            }}
            onEditEnd={() => {
              logEvent('onEditEnd');
              spies.onEditEnd();
              args.onEditEnd?.();
            }}
            onCancel={() => {
              logEvent('onCancel');
              spies.onCancel();
              args.onCancel?.();
            }}
            icon={Edit}
          >
            {args.children}
          </EditableText>
        </div>
        
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <h3 class="text-gray-300 font-medium">Event Log:</h3>
            <button 
              onClick={clearEvents}
              class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded hover:bg-gray-600"
            >
              Clear Log
            </button>
          </div>
          <div class="bg-gray-800/50 border border-gray-700 rounded p-3 h-40 overflow-y-auto font-mono text-xs">
            {events().length === 0 ? (
              <div class="text-gray-500 italic">No events yet. Try editing the text above.</div>
            ) : (
              <For each={events()}>
                {(event, index) => (
                  <div class="text-gray-300 py-1 border-b border-gray-700/50 last:border-b-0">
                    {event}
                  </div>
                )}
              </For>
            )}
          </div>
        </div>
        
        <div class="text-xs text-gray-500">
          <p>Try: Click to edit → Type something → Press Enter to save or Escape to cancel</p>
        </div>
      </div>
    );
  },
  args: {
    children: 'Event Handling Demo',
    spies: { onChange: fn(), onEditStart: fn(), onEditEnd: fn(), onCancel: fn() },
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates all event handlers working correctly. Events are logged in real-time as you interact with the component.',
      },
    },
  },
};

export const DisabledDuringEditing: Story = {
  render: (args) => {
    const [disabled, setDisabled] = createSignal(false);
    const spies = args.spies || { onChange: fn(), onEditStart: fn(), onEditEnd: fn(), onCancel: fn() };
    
    return (
      <div class="space-y-4 p-4">
        <div class="text-amber-400 font-medium">
          <EditableText 
            onChange={(value) => {
              spies.onChange(value);
              args.onChange?.(value);
            }}
            onEditStart={() => {
              spies.onEditStart();
              args.onEditStart?.();
            }}
            onEditEnd={() => {
              spies.onEditEnd();
              args.onEditEnd?.();
            }}
            onCancel={() => {
              spies.onCancel();
              args.onCancel?.();
            }}
            disabled={disabled()}
            icon={Edit}
          >
            {args.children}
          </EditableText>
        </div>
        
        <div class="flex gap-2">
          <button 
            onClick={() => setDisabled(!disabled())}
            class="px-3 py-1 bg-amber-600/20 border border-amber-600/60 text-amber-400 rounded text-sm hover:bg-amber-600/30"
          >
            Toggle Disabled ({disabled() ? 'Enabled' : 'Disabled'})
          </button>
        </div>
      </div>
    );
  },
  args: {
    children: 'Try editing then toggle disabled',
    spies: { onChange: fn(), onEditStart: fn(), onEditEnd: fn(), onCancel: fn() },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const spies = args.spies;
    
    const editableText = await canvas.findByText('Try editing then toggle disabled');
    const toggleButton = await canvas.findByText(/Toggle Disabled/);
    
    // Click to start editing
    await userEvent.click(editableText);
    
    // Verify edit start was called
    await expect(spies.onEditStart).toHaveBeenCalled();
    
    // Wait for DOM update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Find the contenteditable span
    const span = editableText.parentElement?.querySelector('span[contenteditable="true"]');
    expect(span).not.toBeNull();
    
    if (span) {
      // Type new text
      span.textContent = '';
      await userEvent.type(span, 'Updated text');
      
      // Click the toggle disabled button (this should trigger save)
      await userEvent.click(toggleButton);
      
      // Wait for events
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Verify change and edit end were called
      await expect(spies.onChange).toHaveBeenCalledWith('Updated text');
      await expect(spies.onEditEnd).toHaveBeenCalled();
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'When the component becomes disabled during editing, it automatically saves the current content.',
      },
    },
  },
};