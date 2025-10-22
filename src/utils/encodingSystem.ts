// Character encoding system for data privacy
// Each character maps to a unique number starting from 10

// Generate character mapping
const generateCharacterMap = (): Record<string, number> => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .-@_!#$%&*+=?/';
  const map: Record<string, number> = {};
  
  let counter = 10;
  for (const char of chars) {
    map[char] = counter;
    counter++;
  }
  
  return map;
};

// Generate reverse mapping for decoding
const generateReverseMap = (charMap: Record<string, number>): Record<number, string> => {
  const reverseMap: Record<number, string> = {};
  for (const [char, num] of Object.entries(charMap)) {
    reverseMap[num] = char;
  }
  return reverseMap;
};

export const CHARACTER_MAP = generateCharacterMap();
export const REVERSE_MAP = generateReverseMap(CHARACTER_MAP);

// Encode a string to hyphen-separated numbers
export const encodeString = (input: string): string => {
  if (!input) return '';
  
  const encoded = input
    .split('')
    .map(char => CHARACTER_MAP[char] || CHARACTER_MAP[' '])
    .join('-');
  
  return encoded;
};

// Decode hyphen-separated numbers back to string
export const decodeString = (encoded: string): string => {
  if (!encoded) return '';
  
  try {
    const decoded = encoded
      .split('-')
      .map(num => REVERSE_MAP[parseInt(num)] || '')
      .join('');
    
    return decoded;
  } catch (error) {
    return '';
  }
};

// Export character map as CSV for R script
export const exportCharacterMapCSV = (): string => {
  const rows = Object.entries(CHARACTER_MAP).map(([char, num]) => {
    // Escape special characters for CSV
    const escapedChar = char === '"' ? '""' : char;
    return `"${escapedChar}",${num}`;
  });
  
  return 'character,code\n' + rows.join('\n');
};

// Check if encoded mode is enabled (from localStorage)
export const isEncodedModeEnabled = (): boolean => {
  return localStorage.getItem('encodedDisplayMode') === 'true';
};

// Set encoded mode
export const setEncodedMode = (enabled: boolean): void => {
  localStorage.setItem('encodedDisplayMode', enabled ? 'true' : 'false');
};

// Display string based on current mode
export const displayString = (original: string): string => {
  if (isEncodedModeEnabled()) {
    return encodeString(original);
  }
  return original;
};
