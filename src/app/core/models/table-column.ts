export interface TableColumn<T> {
    key: string;
    label: string;
    width?: string;
    cell?: (row: T) => string | number;
}

export interface TableAction<T> {
    icon: string;
    tooltip?: string;
    color?: 'primary' | 'accent' | 'warn';
    onClick: (row: T) => void;
}
