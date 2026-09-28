// Cryptographic helper functions for password hashing, salting, and zero-knowledge fingerprinting

export async function computeSHA256(input: string): Promise<string> {
  if (!input) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateRandomSalt(length: number = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Simulated PBKDF2 / Key Stretching demo
export async function simulatePBKDF2(
  password: string,
  saltHex: string,
  iterations: number = 100000
): Promise<{ hash: string; elapsedMs: number }> {
  const start = performance.now();
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const saltBuffer = new Uint8Array(
    saltHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [0]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: Math.min(iterations, 150000), // safe in browser
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const elapsed = performance.now() - start;
  const hashHex = Array.from(new Uint8Array(derivedBits))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return { hash: hashHex, elapsedMs: Number(elapsed.toFixed(1)) };
}

// Secure Generator: High-Entropy Random Password
export function generateRandomPassword(
  length: number = 18,
  options: {
    upper: boolean;
    lower: boolean;
    numbers: boolean;
    symbols: boolean;
  } = { upper: true, lower: true, numbers: true, symbols: true }
): string {
  let pool = '';
  if (options.lower) pool += 'abcdefghijklmnopqrstuvwxyz';
  if (options.upper) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.numbers) pool += '0123456789';
  if (options.symbols) pool += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!pool) pool = 'abcdefghijklmnopqrstuvwxyz0123456789';

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  let result = '';
  for (let i = 0; i < length; i++) {
    result += pool[array[i] % pool.length];
  }
  return result;
}

// Diceware Wordlist for Memorable High-Entropy Passphrases
const DICEWARE_WORDS = [
  'correct', 'horse', 'battery', 'staple', 'cyber', 'shield', 'quantum',
  'cipher', 'matrix', 'beacon', 'harbor', 'glacier', 'falcon', 'nebula',
  'phoenix', 'timber', 'summit', 'aurora', 'canyon', 'orbit', 'zenith',
  'vector', 'granite', 'radar', 'vortex', 'cobalt', 'echo', 'prism',
  'horizon', 'atlas', 'sentinel', 'crypto', 'shadow', 'kernel', 'silver',
  'ember', 'cascade', 'monarch', 'pulse', 'stellar', 'voyage', 'anchor',
  'bravo', 'circuit', 'delta', 'enigma', 'flame', 'gamma', 'hydra',
  'iron', 'jupiter', 'kestrel', 'lunar', 'meteor', 'neutron', 'omega',
  'plasma', 'quasar', 'rover', 'saturn', 'titan', 'uranus', 'velocity',
  'wildfire', 'xenon', 'yellow', 'zodiac', 'albatross', 'badger', 'cheetah'
];

export function generateDicewarePassphrase(wordCount: number = 4, separator: string = '-'): string {
  const array = new Uint32Array(wordCount);
  crypto.getRandomValues(array);

  const selectedWords: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const word = DICEWARE_WORDS[array[i] % DICEWARE_WORDS.length];
    selectedWords.push(word);
  }

  // Optionally capitalize or add one random number
  const numArr = new Uint32Array(1);
  crypto.getRandomValues(numArr);
  const appendNum = (numArr[0] % 90 + 10).toString();

  return selectedWords.join(separator) + separator + appendNum;
}
