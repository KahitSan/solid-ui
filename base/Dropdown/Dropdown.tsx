import type { Component } from 'solid-js'
import { createSignal, onCleanup, onMount } from 'solid-js'
import { ChevronDown } from 'lucide-solid'

export interface DropdownOption {
  id: string
  label: string
  value: string
  description?: string
  disabled?: boolean
  badge?: string
  badgeColor?: string
  status?: 'open' | 'closed'
  icon?: string
}

export interface DropdownProps {
  options: DropdownOption[]
  value?: string
  placeholder?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
  minWidth?: string
  'data-testid'?: string
}

const Dropdown: Component<DropdownProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false)
  const [selectedOption, setSelectedOption] = createSignal<DropdownOption | undefined>(
    props.options.find(opt => opt.value === props.value)
  )

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return

    setSelectedOption(option)
    setIsOpen(false)
    props.onValueChange?.(option.value)
  }

  const closeDropdown = () => setIsOpen(false)

  onMount(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('[data-dropdown-container]')) {
        closeDropdown()
      }
    }
    document.addEventListener('click', handleClickOutside)

    onCleanup(() => {
      document.removeEventListener('click', handleClickOutside)
    })
  })

  return (
    <div
      class={`relative inline-block select-none ${props.className || ''}`}
      data-dropdown-container
      data-testid={props['data-testid']}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !props.disabled && setIsOpen(!isOpen())}
        disabled={props.disabled}
        class={`flex items-center gap-3 px-4 py-3 bg-zinc-900/50 border border-zinc-800/50 rounded-lg hover:bg-zinc-900/70 transition-all backdrop-blur-sm ${
          props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        style={{ 'min-width': props.minWidth || '280px' }}
      >
        <div class="flex-1 text-left">
          <div class="font-semibold text-white">
            {selectedOption()?.label || props.placeholder || 'Select an option'}
          </div>
          {selectedOption()?.description && (
            <div class="text-xs text-zinc-400">{selectedOption()?.description}</div>
          )}
        </div>
        <ChevronDown
          size={18}
          class={`text-zinc-400 transition-transform ${isOpen() ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen() && (
        <div class="absolute top-full left-0 mt-2 w-full bg-zinc-900/95 border border-zinc-800/50 rounded-lg backdrop-blur-xl z-50 shadow-xl max-h-96 overflow-y-auto">
          {props.options.map((option) => {
            const isSelected = selectedOption()?.id === option.id
            const statusColor = option.status === 'open' ? '#10B981' : option.status === 'closed' ? '#6B7280' : 'transparent'

            return (
              <button
                type="button"
                onClick={() => handleSelect(option)}
                disabled={option.disabled}
                class={`w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-800/50 transition-all first:rounded-t-lg last:rounded-b-lg ${
                  isSelected ? 'bg-zinc-800/30' : ''
                } ${
                  option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {/* Status Indicator */}
                {option.status && (
                  <div
                    class="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: statusColor }}
                  />
                )}

                {/* Icon */}
                {option.icon && (
                  <div class="text-lg">{option.icon}</div>
                )}

                {/* Content */}
                <div class="flex-1 text-left">
                  <div class="font-medium text-white flex items-center gap-2">
                    {option.label}
                    {option.status === 'closed' && (
                      <span class="px-2 py-0.5 text-xs font-medium bg-zinc-700/50 text-zinc-400 rounded">
                        CLOSED
                      </span>
                    )}
                    {option.badge && (
                      <span
                        class="px-2 py-0.5 text-xs font-medium rounded"
                        style={{
                          background: option.badgeColor,
                          color: option.badgeColor === '#C9A961' ? '#000' : '#fff'
                        }}
                      >
                        {option.badge}
                      </span>
                    )}
                  </div>
                  {option.description && (
                    <div class="text-xs text-zinc-400">{option.description}</div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Dropdown