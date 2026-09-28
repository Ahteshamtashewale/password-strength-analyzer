import { CharacterSetPool, CrackTimeEstimates, EntropyMetrics } from '../types/security';

export function getCharacterSetPool(password: string): CharacterSetPool {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9\s]/.test(password);
  const hasUnicode = /[^\x00-\x7F]/.test(password);

  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumbers) poolSize += 10;
  if (hasSpecial) poolSize += 33;
  if (hasUnicode) poolSize += 50;

  return {
    hasLower,
    hasUpper,
    hasNumbers,
    hasSpecial,
    hasUnicode,
    poolSize: Math.max(poolSize, 1),
  };
}

export function calculateShannonEntropy(password: string): { bitsPerChar: number; totalBits: number } {
  if (!password || password.length === 0) {
    return { bitsPerChar: 0, totalBits: 0 };
  }

  const freqMap: Record<string, number> = {};
  for (const char of password) {
    freqMap[char] = (freqMap[char] || 0) + 1;
  }

  const length = password.length;
  let shannonEntropy = 0;

  for (const char in freqMap) {
    const probability = freqMap[char] / length;
    shannonEntropy -= probability * Math.log2(probability);
  }

  return {
    bitsPerChar: Number(shannonEntropy.toFixed(2)),
    totalBits: Number((shannonEntropy * length).toFixed(1)),
  };
}

export function calculateEntropyMetrics(
  password: string,
  pool: CharacterSetPool,
  penalties: number = 0
): EntropyMetrics {
  const length = password.length;
  if (length === 0) {
    return {
      shannonEntropy: 0,
      totalShannonEntropy: 0,
      combinatorialEntropy: 0,
      effectiveEntropy: 0,
      poolSize: pool.poolSize,
    };
  }

  const shannon = calculateShannonEntropy(password);
  const combinatorial = length * Math.log2(pool.poolSize);
  const effective = Math.max(0, combinatorial - penalties);

  return {
    shannonEntropy: shannon.bitsPerChar,
    totalShannonEntropy: shannon.totalBits,
    combinatorialEntropy: Number(combinatorial.toFixed(1)),
    effectiveEntropy: Number(effective.toFixed(1)),
    poolSize: pool.poolSize,
  };
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0.001) return 'Instant (< 1 ms)';
  if (seconds < 1) return `${Math.round(seconds * 1000)} milliseconds`;
  if (seconds < 60) return `${seconds.toFixed(1)} seconds`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minutes`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hours`;
  if (seconds < 31536000) return `${(seconds / 86400).toFixed(1)} days`;
  if (seconds < 315360000) return `${(seconds / 31536000).toFixed(1)} years`;

  const years = seconds / 31536000;
  if (years < 1000) return `${Math.round(years)} years`;
  if (years < 1000000) return `${(years / 1000).toFixed(1)} thousand years`;
  if (years < 1000000000) return `${(years / 1000000).toFixed(1)} million years`;
  if (years < 1000000000000) return `${(years / 1000000000).toFixed(1)} billion years`;
  if (years < 1000000000000000) return `${(years / 1000000000000).toFixed(1)} trillion years`;
  return 'Centuries of the Universe (> 10¹⁵ years)';
}

export function calculateCrackTimes(effectiveEntropy: number): CrackTimeEstimates {
  // If entropy is 0 or tiny
  if (effectiveEntropy <= 0) {
    return {
      onlineThrottled: { seconds: 0, formatted: 'Instant' },
      onlineUnthrottled: { seconds: 0, formatted: 'Instant' },
      offlineFastHash: { seconds: 0, formatted: 'Instant' },
      offlineSlowHash: { seconds: 0, formatted: 'Instant' },
    };
  }

  // Combinations = 2^E
  // Average guesses to crack = 2^(E - 1)
  // To avoid floating overflow with 2^E when E > 1024, cap exponent
  const exponent = Math.min(effectiveEntropy, 250);

  // Guesses per second:
  // 1. Online throttled: 100 guesses / hour = 100 / 3600 guesses/sec = 0.02778 guesses/sec
  const rateOnlineThrottled = 100 / 3600;
  // 2. Online unthrottled: 100 guesses / second
  const rateOnlineUnthrottled = 100;
  // 3. Offline fast hash (MD5/SHA256 GPU farm: 8x RTX 4090 ~ 100 Billion hashes/sec)
  const rateOfflineFast = 100_000_000_000;
  // 4. Offline slow hash (bcrypt cost 12 / Argon2id: ~10,000 hashes/sec)
  const rateOfflineSlow = 10_000;

  // seconds = 2^(exponent - 1) / rate
  const calcSeconds = (rate: number): number => {
    if (exponent <= 1) return 0;
    // log2(seconds) = (exponent - 1) - log2(rate)
    const log2Sec = exponent - 1 - Math.log2(rate);
    if (log2Sec > 100) {
      return 1e30; // effectively infinite
    }
    if (log2Sec < -10) {
      return 0.0001;
    }
    return Math.pow(2, log2Sec);
  };

  const secOnlineThrottled = calcSeconds(rateOnlineThrottled);
  const secOnlineUnthrottled = calcSeconds(rateOnlineUnthrottled);
  const secOfflineFast = calcSeconds(rateOfflineFast);
  const secOfflineSlow = calcSeconds(rateOfflineSlow);

  return {
    onlineThrottled: {
      seconds: secOnlineThrottled,
      formatted: formatDuration(secOnlineThrottled),
    },
    onlineUnthrottled: {
      seconds: secOnlineUnthrottled,
      formatted: formatDuration(secOnlineUnthrottled),
    },
    offlineFastHash: {
      seconds: secOfflineFast,
      formatted: formatDuration(secOfflineFast),
    },
    offlineSlowHash: {
      seconds: secOfflineSlow,
      formatted: formatDuration(secOfflineSlow),
    },
  };
}
