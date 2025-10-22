// Character encoding system for data privacy
// Each character maps to a RANDOM unique number (10-999999) for maximum security

// Generate character mapping with random numbers
const generateCharacterMap = (): Record<string, number> => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .-@_!#$%&*+=?/';
  const map: Record<string, number> = {};
  
  // Pre-generated random mappings (consistent across sessions)
  // These are random numbers between 10-999999 with no pattern
  const randomMappings = [
    847263, 392048, 651829, 238475, 905614, 473829, 128563, 794038, 561920, 314756,
    682943, 195827, 836405, 427691, 954138, 603857, 271549, 918372, 485106, 762894,
    139586, 874201, 526743, 398162, 645970, 281347, 957618, 413829, 769524, 182635,
    904751, 537289, 296843, 871506, 624197, 348765, 915382, 462708, 783951, 251694,
    896537, 374820, 659142, 127485, 943768, 586329, 219573, 804156, 467921, 732685,
    195384, 861749, 524096, 378152, 641827, 293765, 958471, 416803, 729548, 185692,
    907234, 543817, 298364, 876501, 621439, 354987, 918762, 465120, 787694, 256831,
    892745, 371658, 654920, 123897, 948531, 582764
  ];
  
  chars.split('').forEach((char, index) => {
    map[char] = randomMappings[index];
  });
  
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
