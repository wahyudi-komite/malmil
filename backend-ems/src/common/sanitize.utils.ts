const COLUMN_REGEX = /^[a-zA-Z_][a-zA-Z0-9_.]*$/;
const SORT_DIRECTIONS = ['ASC', 'DESC'];

export function sanitizeColumn(column: string): string {
  if (!COLUMN_REGEX.test(column)) {
    throw new Error(`Invalid column name: ${column}`);
  }
  return column;
}

export function sanitizeColumns(columns: string[]): string[] {
  return columns.map(sanitizeColumn);
}

export function sanitizeSortDirection(dir?: string): 'ASC' | 'DESC' {
  if (!dir) return 'DESC';
  const upper = dir.toUpperCase();
  if (!SORT_DIRECTIONS.includes(upper)) {
    return 'DESC';
  }
  return upper as 'ASC' | 'DESC';
}
