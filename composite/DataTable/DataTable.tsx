// DataTable.tsx
import {
  createSignal,
  createMemo,
  createEffect,
  onCleanup,
  For,
  Show,
  splitProps
} from 'solid-js';
import {
  ChevronLeft,
  ChevronRight,
  Search, Upload, Edit3,
  Trash2,
  Eye,
  X,
  Check,
  AlertTriangle,
  Loader,
  ChevronDown, FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-solid';
import Button from '../../base/Button/Button';
import EditableText from '../../base/EditableText/EditableText';
import { DataTableAPI } from './DataTableAPI';
import ComboBox from './ComboBox';

// Data type definitions (Notion-inspired)
export const DataTypes = {
  TEXT: 'text',
  NUMBER: 'number',
  EMAIL: 'email',
  PHONE: 'phone',
  DATE: 'date',
  BOOLEAN: 'boolean',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
  URL: 'url',
  CURRENCY: 'currency',
  PERCENT: 'percent'
} as const;

export type DataType = typeof DataTypes[keyof typeof DataTypes];

// Column definition interface
export interface ColumnDef {
  key: string;
  title: string;
  type: DataType;
  sortable?: boolean;
  editable?: boolean;
  options?: { value: string; label: string }[];
}

// Button configuration interface
export interface ButtonConfig {
  label: string;
  intent?: 'primary' | 'secondary' | 'danger' | 'success' | 'info';
  icon?: Component;
  onClick: () => void;
  disabled?: boolean;
}

// Import result interface
export interface ImportResult {
  file: File;
  mappings: Record<string, string>;
  csvData: string[][];
  headers: string[];
}


// EditableCell component using EditableText for text-based types and custom editors for complex types
const EditableCell = (props: {
  value: any;
  type: DataType;
  options?: { value: string; label: string }[];
  isEditing: boolean;
  onStartEdit: () => void;
  onSave: (value: any) => void;
  onCancel: () => void;
}) => {
  const [editValue, setEditValue] = createSignal(props.value);
  const [showComplexEditor, setShowComplexEditor] = createSignal(false);

  createEffect(() => {
    setEditValue(props.value);
  });

  // Handle save for EditableText
  const handleTextSave = (newValue: string) => {
    let processedValue = newValue;

    // Process value based on type
    switch (props.type) {
      case DataTypes.NUMBER:
      case DataTypes.CURRENCY:
      case DataTypes.PERCENT:
        processedValue = parseFloat(newValue) || 0;
        break;
      default:
        processedValue = newValue;
    }

    props.onSave(processedValue);
  };

  // Handle complex editor save
  const handleComplexSave = () => {
    props.onSave(editValue());
    setShowComplexEditor(false);
  };

  const handleComplexCancel = () => {
    setEditValue(props.value);
    setShowComplexEditor(false);
    props.onCancel();
  };

  // Start editing for complex types
  const startComplexEdit = () => {
    setEditValue(props.value);
    setShowComplexEditor(true);
    props.onStartEdit();
  };

  const formatDisplayValue = (val: any) => {
    if (val == null || val === '') return '';

    switch (props.type) {
      case DataTypes.BOOLEAN:
        return val ? 'Yes' : 'No';

      case DataTypes.CURRENCY:
        return `₱${parseFloat(val).toLocaleString()}`;

      case DataTypes.PERCENT:
        return `${val}%`;

      case DataTypes.MULTISELECT:
        if (Array.isArray(val)) {
          return (
            <div class="flex flex-wrap gap-1">
              <For each={val}>
                {(v) => {
                  const option = (props.options || []).find(opt => opt.value === v);
                  return (
                    <span class="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-xs">
                      {option ? option.label : v}
                    </span>
                  );
                }}
              </For>
            </div>
          );
        }
        return '';

      case DataTypes.SELECT:
        const option = (props.options || []).find(opt => opt.value === val);
        return option ? option.label : val;

      default:
        return val;
    }
  };

  // Render complex type editor
  const renderComplexEditor = () => {
    switch (props.type) {
      case DataTypes.SELECT:
        return (
          <div class="flex items-center space-x-2">
            <div class="flex-1">
              <ComboBox
                value={editValue()}
                options={props.options || []}
                onChange={setEditValue}
                placeholder="Select option..."
              />
            </div>
            <button onClick={handleComplexSave} class="text-emerald-400 hover:text-emerald-300">
              <Check size={14} />
            </button>
            <button onClick={handleComplexCancel} class="text-red-400 hover:text-red-300">
              <X size={14} />
            </button>
          </div>
        );

      case DataTypes.MULTISELECT:
        return (
          <div class="flex items-center space-x-2">
            <div class="flex-1">
              <ComboBox
                value={editValue()}
                options={props.options || []}
                multiple={true}
                onChange={setEditValue}
                placeholder="Select options..."
              />
            </div>
            <button onClick={handleComplexSave} class="text-emerald-400 hover:text-emerald-300">
              <Check size={14} />
            </button>
            <button onClick={handleComplexCancel} class="text-red-400 hover:text-red-300">
              <X size={14} />
            </button>
          </div>
        );

      case DataTypes.BOOLEAN:
        return (
          <div class="flex items-center space-x-2">
            <div class="flex-1">
              <ComboBox
                value={editValue() ? 'true' : 'false'}
                options={[
                  { slug: 'true', label: 'Yes' },
                  { slug: 'false', label: 'No' }
                ]}
                onChange={(val) => setEditValue(val === 'true')}
              />
            </div>
            <button onClick={handleComplexSave} class="text-emerald-400 hover:text-emerald-300">
              <Check size={14} />
            </button>
            <button onClick={handleComplexCancel} class="text-red-400 hover:text-red-300">
              <X size={14} />
            </button>
          </div>
        );

      case DataTypes.DATE:
        return (
          <div class="flex items-center space-x-2">
            <div class="flex-1">
              <input
                type="date"
                value={editValue()}
                onInput={(e) => setEditValue(e.currentTarget.value)}
                class="w-full bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-sm text-white"
                autofocus
              />
            </div>
            <button onClick={handleComplexSave} class="text-emerald-400 hover:text-emerald-300">
              <Check size={14} />
            </button>
            <button onClick={handleComplexCancel} class="text-red-400 hover:text-red-300">
              <X size={14} />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // For complex types that need custom editors
  const isComplexType = () => {
    return [
      DataTypes.SELECT,
      DataTypes.MULTISELECT,
      DataTypes.BOOLEAN,
      DataTypes.DATE
    ].includes(props.type);
  };

  // Show complex editor when editing
  if (showComplexEditor()) {
    return renderComplexEditor();
  }

  // For complex types, show formatted display and handle clicks
  if (isComplexType()) {
    return (
      <div
        onClick={startComplexEdit}
        class="cursor-pointer hover:bg-zinc-800/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors"
      >
        {formatDisplayValue(props.value)}
      </div>
    );
  }

  // For simple text-based types, use EditableText
  return (
    <EditableText
      trigger="click"
      placeholder="Click to edit..."
      onChange={handleTextSave}
      onEditStart={props.onStartEdit}
      onEditEnd={() => { }}
      onCancel={props.onCancel}
      class="text-zinc-300"
    >
      {formatDisplayValue(props.value)}
    </EditableText>
  );
};

// Import modal component
const ImportModal = (props: {
  isOpen: boolean;
  onClose: () => void;
  onImport: (result: ImportResult) => void;
  columns: ColumnDef[];
}) => {
  const [file, setFile] = createSignal<File | null>(null);
  const [csvData, setCsvData] = createSignal<string[][]>([]);
  const [headers, setHeaders] = createSignal<string[]>([]);
  const [mappings, setMappings] = createSignal<Record<string, string>>({});
  const [warnings, setWarnings] = createSignal<{ type: string; message: string }[]>([]);
  const [step, setStep] = createSignal(1); // 1: File select, 2: Header mapping, 3: Validation

  let fileInputRef: HTMLInputElement;

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const csvHeaders = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const rows = lines.slice(1).filter(line => line.trim()).map(line =>
        line.split(',').map(cell => cell.trim().replace(/"/g, ''))
      );

      setCsvData(rows);
      setHeaders(csvHeaders);
      setStep(2);
    };
    reader.readAsText(selectedFile);
  };

  const validateMapping = () => {
    const newWarnings: { type: string; message: string }[] = [];

    // Sample first few rows to check data type compatibility
    const data = csvData();
    if (data.length > 0) {
      Object.entries(mappings()).forEach(([csvHeader, columnKey]) => {
        const column = props.columns.find(col => col.key === columnKey);
        if (column) {
          const csvIndex = headers().indexOf(csvHeader);
          const sampleValues = data.slice(0, 5).map(row => row[csvIndex]);

          // Type validation logic
          sampleValues.forEach(value => {
            if (!validateValueType(value, column.type)) {
              newWarnings.push({
                type: 'warning',
                message: `CSV column "${csvHeader}" contains value "${value}" which may not match expected type "${column.type}"`
              });
            }
          });
        }
      });
    }

    setWarnings(newWarnings);
    setStep(3);
  };

  const validateValueType = (value: string, type: DataType): boolean => {
    if (!value || value.trim() === '') return true; // Empty values are generally acceptable

    switch (type) {
      case DataTypes.EMAIL:
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case DataTypes.PHONE:
        return /^[\+]?[\d\s\-\(\)]{10,}$/.test(value);
      case DataTypes.NUMBER:
      case DataTypes.CURRENCY:
      case DataTypes.PERCENT:
        return !isNaN(parseFloat(value));
      case DataTypes.DATE:
        return !isNaN(Date.parse(value));
      case DataTypes.BOOLEAN:
        return ['true', 'false', '1', '0', 'yes', 'no', 'y', 'n'].includes(value.toLowerCase());
      default:
        return true;
    }
  };

  const handleImport = () => {
    const currentFile = file();
    if (currentFile) {
      props.onImport({
        file: currentFile,
        mappings: mappings(),
        csvData: csvData(),
        headers: headers()
      });
    }
    props.onClose();
    // Reset state
    setFile(null);
    setCsvData([]);
    setHeaders([]);
    setMappings({});
    setWarnings([]);
    setStep(1);
  };

  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-zinc-900/95 backdrop-blur-sm rounded-xl border border-zinc-800/50 w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4">
          <div class="flex items-center justify-between p-6 border-b border-zinc-800/50">
            <h3 class="text-xl font-semibold text-white">Import CSV Data</h3>
            <button onClick={props.onClose} class="text-zinc-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div class="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div class="p-6">
              {/* Step 1: File Selection */}
              <Show when={step() === 1}>
                <div>
                  <div class="border-2 border-dashed border-zinc-600 rounded-lg p-8 text-center mb-4">
                    <Upload size={32} class="mx-auto mb-4 text-zinc-400" />
                    <p class="text-white font-medium mb-2">Drop your CSV file here</p>
                    <p class="text-sm text-zinc-400 mb-4">or click to browse files</p>
                    <Button
                      onClick={() => fileInputRef?.click()}
                      intent="primary"
                    >
                      Choose File
                    </Button>
                    <input
                      ref={fileInputRef!}
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        const selectedFile = e.currentTarget.files?.[0];
                        if (selectedFile) handleFileSelect(selectedFile);
                      }}
                      class="hidden"
                    />
                  </div>
                  <Show when={file()}>
                    <div class="bg-zinc-800/30 rounded-lg p-4">
                      <div class="flex items-center space-x-2">
                        <FileText size={16} class="text-blue-400" />
                        <span class="text-white">{file()?.name}</span>
                        <span class="text-zinc-400 text-sm">({((file()?.size || 0) / 1024).toFixed(1)} KB)</span>
                      </div>
                    </div>
                  </Show>
                </div>
              </Show>

              {/* Step 2: Header Mapping */}
              <Show when={step() === 2}>
                <div>
                  <h4 class="text-lg font-semibold text-white mb-4">Map CSV Headers to Columns</h4>
                  <div class="space-y-4">
                    <For each={headers()}>
                      {(header) => (
                        <div class="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg">
                          <div>
                            <span class="text-white font-medium">"{header}"</span>
                            <div class="text-xs text-zinc-400 mt-1">
                              Sample: {csvData()[0]?.[headers().indexOf(header)] || 'No data'}
                            </div>
                          </div>
                          <select
                            value={mappings()[header] || ''}
                            onChange={(e) => setMappings(prev => ({ ...prev, [header]: e.currentTarget.value }))}
                            class="bg-zinc-800 border border-zinc-600 rounded px-3 py-1 text-white"
                          >
                            <option value="">Skip this column</option>
                            <For each={props.columns}>
                              {(col) => (
                                <option value={col.key}>
                                  {col.title} ({col.type})
                                </option>
                              )}
                            </For>
                          </select>
                        </div>
                      )}
                    </For>
                  </div>
                  <div class="flex items-center justify-end space-x-3 mt-6">
                    <Button intent="secondary" onClick={() => setStep(1)}>Back</Button>
                    <Button intent="primary" onClick={validateMapping}>Validate & Continue</Button>
                  </div>
                </div>
              </Show>

              {/* Step 3: Validation & Import */}
              <Show when={step() === 3}>
                <div>
                  <h4 class="text-lg font-semibold text-white mb-4">Import Summary</h4>

                  <Show when={warnings().length > 0}>
                    <div class="mb-6">
                      <h5 class="text-md font-medium text-orange-400 mb-2">Data Type Warnings</h5>
                      <div class="space-y-2">
                        <For each={warnings()}>
                          {(warning) => (
                            <div class="flex items-start space-x-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                              <AlertTriangle size={16} class="text-orange-400 mt-0.5" />
                              <span class="text-sm text-orange-300">{warning.message}</span>
                            </div>
                          )}
                        </For>
                      </div>
                    </div>
                  </Show>

                  <div class="bg-zinc-800/30 rounded-lg p-4 mb-6">
                    <h5 class="text-md font-medium text-white mb-2">Import Details</h5>
                    <div class="text-sm text-zinc-400 space-y-1">
                      <p>File: {file()?.name}</p>
                      <p>Rows to import: {csvData().length}</p>
                      <p>Mapped columns: {Object.keys(mappings()).filter(k => mappings()[k]).length}</p>
                    </div>
                  </div>

                  <div class="flex items-center justify-end space-x-3">
                    <Button intent="secondary" onClick={() => setStep(2)}>Back</Button>
                    <Button
                      intent={warnings().length > 0 ? "danger" : "primary"}
                      onClick={handleImport}
                    >
                      {warnings().length > 0 ? 'Import with Warnings' : 'Import Data'}
                    </Button>
                  </div>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};


// Main DataTable Props
export interface DataTableProps {
  data?: any[];
  columns: ColumnDef[];
  buttons?: ButtonConfig[];
  pageSize?: number;
  searchable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  editable?: boolean;
  serverSide?: boolean;
  apiService?: DataTableAPI;
  onDataChange?: (data: any[]) => void;
  onImport?: (result: ImportResult) => void;
  loading?: boolean;
  class?: string;
  enableAddModal?: boolean;
}

// Main DataTable component
const DataTable = (props: DataTableProps) => {
  const [local, others] = splitProps(props, [
    'data', 'columns', 'buttons', 'pageSize', 'searchable', 'sortable',
    'selectable', 'editable', 'serverSide', 'apiService', 'onDataChange',
    'onImport', 'loading', 'class', 'enableAddModal'
  ]);

  // State management
  const [currentData, setCurrentData] = createSignal(local.data || []);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [itemsPerPage, setItemsPerPage] = createSignal(local.pageSize || 10);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [sortField, setSortField] = createSignal('');
  const [sortDirection, setSortDirection] = createSignal<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = createSignal(new Set<number>());
  const [editingCell, setEditingCell] = createSignal<{ row: number; column: string } | null>(null);
  const [showImportModal, setShowImportModal] = createSignal(false);
  const [importProgress, setImportProgress] = createSignal<{ status: string; progress: number } | null>(null);
  const [isLoading, setIsLoading] = createSignal(local.loading || false);
  const [error, setError] = createSignal<string | null>(null);
  const [totalCount, setTotalCount] = createSignal(0);
  const [newRowIndex, setNewRowIndex] = createSignal<number | null>(null);

  let tableRef: HTMLDivElement;
  let sseRef: EventSource;

  // Initialize API service
  const api = createMemo(() => local.apiService || new DataTableAPI());

  // Update local data when props change
  createEffect(() => {
    if (!local.serverSide && local.data) {
      setCurrentData(local.data);
      setTotalCount(local.data.length);
    }
  });

  // Server-side data fetching
  const fetchData = async (params: Record<string, any> = {}) => {
    if (!local.serverSide) return;

    setIsLoading(true);
    setError(null);

    try {
      const queryParams = {
        page: currentPage(),
        size: itemsPerPage(),
        search: searchTerm(),
        sortField: sortField(),
        sortDirection: sortDirection(),
        ...params
      };

      const response = await api().fetchData(queryParams);

      if (response) {
        setCurrentData(response.data || []);
        setTotalCount(response.total || 0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Effect for server-side data fetching
  createEffect(() => {
    if (local.serverSide) {
      fetchData();
    }
  });

  // Setup SSE for real-time updates
  createEffect(() => {
    if (local.serverSide && api()) {
      sseRef = api().setupSSE((updateData: any) => {
        // Handle real-time updates
        if (updateData.type === 'INSERT') {
          setCurrentData(prev => [updateData.data, ...prev]);
          setTotalCount(prev => prev + 1);
        } else if (updateData.type === 'UPDATE') {
          setCurrentData(prev =>
            prev.map((item: any) => item.id === updateData.data.id ? updateData.data : item)
          );
        } else if (updateData.type === 'DELETE') {
          setCurrentData(prev => prev.filter((item: any) => item.id !== updateData.id));
          setTotalCount(prev => prev - 1);
        }
      });

      onCleanup(() => {
        if (sseRef) {
          sseRef.close();
        }
      });
    }
  });

  // Focus on new row after addition
  createEffect(() => {
    const rowIndex = newRowIndex();
    if (rowIndex !== null && tableRef) {
      const newRowElement = tableRef.querySelector(`tbody tr:nth-child(${rowIndex + 1})`);
      if (newRowElement) {
        newRowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (newRowElement as HTMLElement).style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
        setTimeout(() => {
          (newRowElement as HTMLElement).style.backgroundColor = '';
        }, 2000);

        // Auto-start editing the first editable cell
        const firstEditableColumn = local.columns.find(col => col.editable !== false);
        if (firstEditableColumn) {
          setTimeout(() => {
            setEditingCell({ row: rowIndex, column: firstEditableColumn.key });
          }, 500);
        }
      }
      setNewRowIndex(null);
    }
  });

  // Filtered and sorted data for client-side processing
  const processedData = createMemo(() => {
    if (local.serverSide) return currentData();

    let filtered = currentData();

    // Apply search filter
    if (searchTerm() && local.searchable !== false) {
      filtered = filtered.filter((row: any) =>
        local.columns.some(column =>
          String(row[column.key] || '').toLowerCase().includes(searchTerm().toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortField() && local.sortable !== false) {
      filtered = [...filtered].sort((a: any, b: any) => {
        const aVal = a[sortField()];
        const bVal = b[sortField()];

        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        const result = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return sortDirection() === 'desc' ? -result : result;
      });
    }

    return filtered;
  });

  // Paginated data
  const paginatedData = createMemo(() => {
    if (local.serverSide) return processedData();

    const startIndex = (currentPage() - 1) * itemsPerPage();
    return processedData().slice(startIndex, startIndex + itemsPerPage());
  });

  // Pagination info
  const totalPages = createMemo(() => {
    return local.serverSide
      ? Math.ceil(totalCount() / itemsPerPage())
      : Math.ceil(processedData().length / itemsPerPage());
  });

  const showPagination = createMemo(() => totalPages() > 1);

  // Handlers
  const handleSort = (columnKey: string) => {
    if (local.sortable === false) return;

    if (sortField() === columnKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(columnKey);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handleRowSelect = (rowIndex: number) => {
    if (local.selectable === false) return;

    setSelectedRows(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(rowIndex)) {
        newSelected.delete(rowIndex);
      } else {
        newSelected.add(rowIndex);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (local.selectable === false) return;

    setSelectedRows(prev =>
      prev.size === paginatedData().length
        ? new Set()
        : new Set(paginatedData().map((_, i) => i))
    );
  };

  const handleCellEdit = async (rowIndex: number, columnKey: string, newValue: any) => {
    if (local.editable === false) return;

    const updatedData = [...currentData()];
    const actualRowIndex = local.serverSide ? rowIndex : (currentPage() - 1) * itemsPerPage() + rowIndex;
    const updatedRow = { ...updatedData[actualRowIndex], [columnKey]: newValue };

    if (local.serverSide && api()) {
      try {
        await api().updateMember(updatedRow.id, updatedRow);
      } catch (error) {
        console.error('Error updating member:', error);
        setError('Failed to update member. Please try again.');
        return;
      }
    }

    updatedData[actualRowIndex] = updatedRow;
    setCurrentData(updatedData);
    setEditingCell(null);
    local.onDataChange?.(updatedData);
  };

  const handleImportData = async (importResult: ImportResult) => {
    setImportProgress({ status: 'processing', progress: 0 });

    try {
      if (local.serverSide && api()) {
        // Server-side import
        setImportProgress({ status: 'processing', progress: 25 });

        const result = await api().importCSV(importResult.csvData, importResult.mappings);

        setImportProgress({ status: 'processing', progress: 75 });

        // Refresh data after import
        await fetchData();

        setImportProgress({ status: 'completed', progress: 100 });
      } else {
        // Client-side import simulation
        setImportProgress({ status: 'processing', progress: 50 });

        // Process CSV data with mappings
        const newMembers = importResult.csvData.map((row, index) => ({
          id: Date.now() + index,
          ...Object.entries(importResult.mappings).reduce((acc: any, [csvHeader, columnKey]) => {
            const csvIndex = importResult.headers.indexOf(csvHeader);
            if (csvIndex !== -1 && row[csvIndex]) {
              acc[columnKey] = row[csvIndex];
            }
            return acc;
          }, {})
        }));

        setCurrentData(prev => [...newMembers, ...prev]);
        setImportProgress({ status: 'completed', progress: 100 });
        local.onDataChange?.([...newMembers, ...currentData()]);
      }

      local.onImport?.(importResult);
    } catch (error) {
      console.error('Import error:', error);
      setImportProgress({ status: 'error', progress: 0 });
      setError('Failed to import data. Please try again.');
    }

    setTimeout(() => {
      setImportProgress(null);
    }, 2000);
  };

  return (
    <div class={`bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/50 ${local.class || ''}`} ref={tableRef!} {...others}>
      {/* Header */}
      <div class="p-4 border-b border-zinc-800/50">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
          <div class="flex items-center space-x-4">
            <h3 class="text-lg font-semibold text-white">Data Table</h3>
            <span class="text-sm text-zinc-400">
              {local.serverSide ? totalCount() : processedData().length} items
            </span>
            <Show when={isLoading() || local.loading}>
              <Loader size={16} class="text-blue-400 animate-spin" />
            </Show>
          </div>

          <div class="flex items-center space-x-2">
            {/* Search */}
            <Show when={local.searchable !== false}>
              <div class="relative">
                <Search size={16} class="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm()}
                  onInput={(e) => {
                    setSearchTerm(e.currentTarget.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                  class="pl-10 pr-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 w-48"
                />
              </div>
            </Show>

            {/* Custom Buttons */}
            <For each={local.buttons || []}>
              {(button) => (
                <Button
                  intent={button.intent || 'secondary'}
                  onClick={button.onClick}
                  icon={button.icon}
                  disabled={button.disabled}
                >
                  {button.label}
                </Button>
              )}
            </For>

            {/* Built-in Actions */}
            <Show when={local.onImport}>
              <Button
                intent="primary"
                onClick={() => setShowImportModal(true)}
                icon={Upload}
              >
                Import
              </Button>
            </Show>
          </div>
        </div>
      </div>

      {/* Error Display */}
      <Show when={error()}>
        <div class="p-3 bg-red-500/10 border-b border-red-500/20">
          <div class="flex items-center space-x-2">
            <AlertCircle size={16} class="text-red-400" />
            <span class="text-red-400 text-sm">{error()}</span>
            <button
              onClick={() => setError(null)}
              class="ml-auto text-red-300 hover:text-red-100"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </Show>

      {/* Import Progress */}
      <Show when={importProgress()}>
        <div class={`p-3 border-b ${importProgress()?.status === 'error'
            ? 'bg-red-500/10 border-red-500/20'
            : 'bg-blue-500/10 border-blue-500/20'
          }`}>
          <div class="flex items-center space-x-3">
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span class={`text-sm font-medium ${importProgress()?.status === 'error' ? 'text-red-400' : 'text-blue-400'
                  }`}>
                  <Show when={importProgress()?.status === 'processing'}>Processing import...</Show>
                  <Show when={importProgress()?.status === 'completed'}>Import completed!</Show>
                  <Show when={importProgress()?.status === 'error'}>Import failed!</Show>
                </span>
                <span class={`text-sm ${importProgress()?.status === 'error' ? 'text-red-300' : 'text-blue-300'
                  }`}>
                  {importProgress()?.progress}%
                </span>
              </div>
              <div class="w-full bg-zinc-700 rounded-full h-1">
                <div
                  class={`h-1 rounded-full transition-all duration-300 ${importProgress()?.status === 'error' ? 'bg-red-400' : 'bg-blue-400'
                    }`}
                  style={{ width: `${importProgress()?.progress || 0}%` }}
                />
              </div>
            </div>
            <Show when={importProgress()?.status === 'completed'}>
              <CheckCircle size={16} class="text-emerald-400" />
            </Show>
          </div>
        </div>
      </Show>

      {/* Table */}
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-zinc-800/50">
              <Show when={local.selectable !== false}>
                <th class="p-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows().size === paginatedData().length && paginatedData().length > 0}
                    onChange={handleSelectAll}
                    class="rounded border-zinc-600 bg-zinc-800"
                  />
                </th>
              </Show>
              <For each={local.columns}>
                {(column) => (
                  <th
                    class={`p-3 text-left text-sm font-medium text-zinc-300 ${local.sortable !== false && column.sortable !== false
                        ? 'cursor-pointer hover:text-white transition-colors'
                        : ''
                      }`}
                    onClick={() => column.sortable !== false && handleSort(column.key)}
                  >
                    <div class="flex items-center space-x-1">
                      <span>{column.title}</span>
                      <span class="text-xs text-zinc-500">({column.type})</span>
                      <Show when={sortField() === column.key}>
                        <span class="text-amber-400">
                          {sortDirection() === 'asc' ? '↑' : '↓'}
                        </span>
                      </Show>
                    </div>
                  </th>
                )}
              </For>
              <th class="p-3 text-left text-sm font-medium text-zinc-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            <For each={paginatedData()}>
              {(row, rowIndex) => (
                <tr class="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors">
                  <Show when={local.selectable !== false}>
                    <td class="p-3">
                      <input
                        type="checkbox"
                        checked={selectedRows().has(rowIndex())}
                        onChange={() => handleRowSelect(rowIndex())}
                        class="rounded border-zinc-600 bg-zinc-800"
                      />
                    </td>
                  </Show>
                  <For each={local.columns}>
                    {(column) => (
                      <td
                        class="p-3 text-sm text-zinc-300"
                        classList={{
                          "border border-white": editingCell()?.row === rowIndex() && editingCell()?.column === column.key
                        }}
                      >
                        <Show
                          when={local.editable !== false && column.editable !== false}
                          fallback={<span>{row[column.key]}</span>}
                        >
                          <EditableCell
                            value={row[column.key]}
                            type={column.type}
                            options={column.options || []}
                            isEditing={editingCell()?.row === rowIndex() && editingCell()?.column === column.key}
                            onStartEdit={() => {
                              // Only set editing state for complex types that need it
                              const complexTypes = [DataTypes.SELECT, DataTypes.MULTISELECT, DataTypes.BOOLEAN, DataTypes.DATE];
                              if (complexTypes.includes(column.type)) {
                                setEditingCell({ row: rowIndex(), column: column.key });
                              }
                            }}
                            onSave={(newValue) => handleCellEdit(rowIndex(), column.key, newValue)}
                            onCancel={() => setEditingCell(null)}
                          />
                        </Show>
                      </td>
                    )}
                  </For>
                  <td class="p-3">
                    <div class="flex items-center space-x-1">
                      <button class="p-1 hover:bg-zinc-700/50 rounded transition-colors">
                        <Eye size={14} class="text-zinc-400 hover:text-emerald-400" />
                      </button>
                      <button class="p-1 hover:bg-zinc-700/50 rounded transition-colors">
                        <Edit3 size={14} class="text-zinc-400 hover:text-blue-400" />
                      </button>
                      <button class="p-1 hover:bg-zinc-700/50 rounded transition-colors">
                        <Trash2 size={14} class="text-zinc-400 hover:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>


        <Show when={isLoading() || local.loading}>
          <div class="text-center py-8 text-zinc-400">
            Loading...
          </div>
          {/* TODO: Replace this with the actual loading indicator */}
        </Show>


        <Show when={paginatedData().length === 0 && !isLoading()}>
          <div class="text-center py-8 text-zinc-400">
            No data available
          </div>
        </Show>
      </div>

      {/* Pagination - Only show if more than 1 page */}
      <Show when={showPagination()}>
        <div class="p-4 border-t border-zinc-800/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <span class="text-sm text-zinc-400">
                Showing {(currentPage() - 1) * itemsPerPage() + 1} to{' '}
                {Math.min(currentPage() * itemsPerPage(), local.serverSide ? totalCount() : processedData().length)} of{' '}
                {local.serverSide ? totalCount() : processedData().length} results
              </span>
              <select
                value={itemsPerPage()}
                onChange={(e) => {
                  setItemsPerPage(Number(e.currentTarget.value));
                  setCurrentPage(1);
                }}
                class="bg-zinc-800/50 border border-zinc-700/50 rounded px-3 py-1 text-sm text-white"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>

            <div class="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage() - 1))}
                disabled={currentPage() === 1}
                class="p-2 bg-zinc-800/50 border border-zinc-700/50 rounded hover:bg-zinc-800/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} class="text-white" />
              </button>

              <span class="text-sm text-zinc-400">
                Page {currentPage()} of {totalPages()}
              </span>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages(), currentPage() + 1))}
                disabled={currentPage() === totalPages()}
                class="p-2 bg-zinc-800/50 border border-zinc-700/50 rounded hover:bg-zinc-800/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} class="text-white" />
              </button>
            </div>
          </div>
        </div>
      </Show>

      {/* Import Modal */}
      <ImportModal
        isOpen={showImportModal()}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportData}
        columns={local.columns}
      />
    </div>
  );
};

export default DataTable;