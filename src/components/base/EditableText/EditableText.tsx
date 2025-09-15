// EditableText.tsx - Updated with async support
import { Component, JSX, splitProps, createSignal, createMemo, mergeProps, createEffect } from 'solid-js';

export interface EditableTextProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'onChange'> {
  trigger?: 'click' | 'doubleClick';
  disabled?: boolean;
  placeholder?: string;
  allowBreakLine?: boolean;
  icon?: Component<any>;
  iconPosition?: 'left' | 'right';
  showIconOnHover?: boolean;
  onChange?: (value: string) => void;
  onEditStart?: () => void;
  onEditEnd?: () => void;
  onCancel?: () => void;
  onEmpty?: (options: { 
    currentValue: string; 
    originalValue: string;
    confirm: (value: string) => void;
    cancel: () => void;
  }) => void | Promise<void>;
  children?: JSX.Element;
}

const EditableText: Component<EditableTextProps> = (props) => {
  const defaultProps = {
    trigger: 'click' as const,
    disabled: false,
    iconPosition: 'right' as const,
    showIconOnHover: false,
    placeholder: 'Click to edit...',
    allowBreakLine: false,
  };

  const merged = mergeProps(defaultProps, props);
  const [local, others] = splitProps(merged, [
    'trigger',
    'disabled',
    'placeholder',
    'allowBreakLine',
    'icon',
    'iconPosition',
    'showIconOnHover',
    'children',
    'onChange',
    'onEditStart',
    'onEditEnd',
    'onCancel',
    'onEmpty',
  ]);

  const [isEditing, setIsEditing] = createSignal(false);
  const [originalValue, setOriginalValue] = createSignal('');
  const [isHovered, setIsHovered] = createSignal(false);
  const [isSaving, setIsSaving] = createSignal(false);

  let contentRef: HTMLSpanElement | undefined;

  // Extract text content from children
  const extractTextContent = (node: any): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractTextContent).join('');
    return '';
  };

  const currentText = createMemo(() => extractTextContent(local.children));

  // Handle disabled state changes during editing
  createEffect(() => {
    if (local.disabled && isEditing() && !isSaving()) {
      // If disabled while editing, save the current content
      handleSave();
    }
  });

  // Focus and setup when editing starts
  createEffect(() => {
    if (isEditing() && contentRef) {
      const textToEdit = currentText() || '';
      contentRef.textContent = textToEdit;
      
      // CRITICAL: Copy computed styles from parent to ensure proper inheritance
      if (contentRef.parentElement) {
        const computedStyles = window.getComputedStyle(contentRef.parentElement);
        contentRef.style.whiteSpace = computedStyles.whiteSpace;
      }
      
      setTimeout(() => {
        if (contentRef) {
          contentRef.focus();
          const range = document.createRange();
          range.selectNodeContents(contentRef);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0);
    }
  });

  const handleStartEdit = () => {
    if (local.disabled) return;
    
    setOriginalValue(currentText());
    setIsEditing(true);
    local.onEditStart?.();
  };

  const completeSave = (finalValue: string) => {
    setIsSaving(false);
    setIsEditing(false);
    
    if (finalValue !== originalValue()) {
      local.onChange?.(finalValue);
    }
    
    local.onEditEnd?.();
  };

  const handleSave = () => {
    if (!contentRef || isSaving()) return;
    
    const newValue = contentRef.textContent?.trim() || '';
    const isEmpty = newValue === '';
    
    // Handle empty content with custom handler
    if (isEmpty && local.onEmpty) {
      setIsSaving(true);
      
      const confirm = (value: string) => {
        completeSave(value);
      };
      
      const cancel = () => {
        // Revert to original value in the UI
        if (contentRef) {
          contentRef.textContent = originalValue();
        }
        setIsSaving(false);
      };
      
      const result = local.onEmpty({
        currentValue: newValue,
        originalValue: originalValue(),
        confirm,
        cancel
      });
      
      // Handle async handlers
      if (result instanceof Promise) {
        result.catch(() => {
          cancel(); // Cancel on error
        });
      }
      
      return;
    }
    
    // Normal save behavior
    completeSave(newValue);
  };

  const handleCancel = () => {
    if (contentRef) {
      contentRef.textContent = originalValue();
    }
    setIsEditing(false);
    local.onCancel?.();
  };

  const handleClick = (e: MouseEvent) => {
    if (local.trigger === 'click' && !isEditing()) {
      e.preventDefault();
      handleStartEdit();
    }
  };

  const handleDoubleClick = (e: MouseEvent) => {
    if (local.trigger === 'doubleClick' && !isEditing()) {
      e.preventDefault();
      handleStartEdit();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isEditing() || isSaving()) return;

    if (e.key === 'Enter') {
      if (local.allowBreakLine && e.shiftKey) {
        return; // Allow Shift+Enter for line breaks
      } else {
        e.preventDefault();
        handleSave();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleInput = () => {
    if (!local.allowBreakLine && contentRef) {
      const text = contentRef.textContent || '';
      if (text.includes('\n')) {
        const cleanText = text.replace(/\n/g, ' ');
        contentRef.textContent = cleanText;
        
        // Restore cursor position
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(contentRef);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    if (!isEditing() || isSaving()) return;
    
    e.preventDefault();
    
    const text = e.clipboardData?.getData('text/plain') || '';
    const cleanText = local.allowBreakLine ? text : text.replace(/\n/g, ' ');
    
    document.execCommand('insertText', false, cleanText);
  };

  const handleBlur = (e: FocusEvent) => {
    // Small delay to allow for potential click events
    setTimeout(() => {
      if (isEditing() && !isSaving()) {
        handleSave();
      }
    }, 100);
  };

  const shouldShowIcon = createMemo(() => {
    if (!local.icon) return false;
    
    // If showIconOnHover is true, show icon on hover OR when editing
    if (local.showIconOnHover) {
      return isHovered() || isEditing();
    }
    
    // If showIconOnHover is false, only show icon when editing
    return isEditing();
  });

  const renderIcon = () => {
    const IconComponent = local.icon;
    if (!IconComponent || !shouldShowIcon()) return null;

    return (
      <IconComponent 
        style={{
          color: 'rgba(201, 169, 97, 0.6)',
          'flex-shrink': '0',
          transition: 'all 0.2s ease',
          opacity: local.showIconOnHover && !isHovered() && !isEditing() ? '0' : '1',
          transform: local.showIconOnHover && !isHovered() && !isEditing() ? 'scale(0.8)' : 'scale(1)',
        }}
      />
    );
  };

  const renderContent = () => {
    const isEmpty = !currentText();
    const displayText = isEmpty ? local.placeholder : currentText();

    const contentSpan = (
      <span 
        ref={contentRef}
        contentEditable={isEditing() && !isSaving()}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onPaste={handlePaste}
        onBlur={handleBlur}
        style={{ 
          color: isEmpty && !isEditing() ? 'rgba(201, 169, 97, 0.4)' : 'inherit', 
          'font-style': isEmpty && !isEditing() ? 'italic' : 'inherit',
          outline: 'none',
          'user-select': isEditing() ? 'text' : 'none',
          // CRITICAL: Properly inherit white-space behavior
          'white-space': 'inherit',
          // Override only when explicitly needed
          ...(isEditing() && !local.allowBreakLine ? { 'white-space': 'nowrap' } : {}),
          // Show saving state
          ...(isSaving() ? { opacity: '0.7' } : {}),
        }}
      >
        {displayText}
      </span>
    );

    if (local.iconPosition === 'left') {
      return (
        <>
          {renderIcon()}
          {contentSpan}
        </>
      );
    } else {
      return (
        <>
          {contentSpan}
          {renderIcon()}
        </>
      );
    }
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        'align-items': 'flex-start',
        gap: local.icon ? '0.5rem' : '0',
        cursor: local.disabled || isSaving() ? 'not-allowed' : (isEditing() ? 'text' : 'pointer'),
        opacity: local.disabled || isSaving() ? '0.5' : '1',
      }}
      onClick={handleClick}
      onDblClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...others}
    >
      {renderContent()}
    </span>
  );
};

export default EditableText;