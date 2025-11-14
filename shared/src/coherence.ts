/**
 * Coherence calculation engine
 * Based on HeartMath coherence protocols
 */

import { HRVMetric, CoherenceState, CoherenceScore } from './types';

/**
 * Calculate coherence score from HRV data
 * 
 * Formula: Peak Power (0.04-0.26 Hz) / Total Power (0-0.4 Hz)
 * 
 * HeartMath thresholds:
 * - Low: 0-40%
 * - Medium: 40-60%
 * - High: 60-100%
 */
export class CoherenceCalculator {
  private static readonly COHERENCE_BAND_LOW = 0.04; // Hz
  private static readonly COHERENCE_BAND_HIGH = 0.26; // Hz
  private static readonly TOTAL_BAND_HIGH = 0.4; // Hz
  private static readonly SAMPLING_RATE = 1.0; // 1 Hz (1 sample per second)

  /**
   * Calculate coherence from a window of HRV metrics
   * Requires at least 30 seconds of data for accurate frequency analysis
   */
  static calculateCoherence(hrvMetrics: HRVMetric[]): CoherenceState | null {
    if (hrvMetrics.length < 30) {
      return null; // Need at least 30 seconds of data
    }

    // Extract R-R intervals (in milliseconds)
    const rrIntervals = hrvMetrics.map(m => m.meanRR);

    // Convert to seconds for frequency analysis
    const rrSeconds = rrIntervals.map(rr => rr / 1000.0);

    // Calculate power spectral density using FFT
    const { peakPower, totalPower } = this.calculatePowerSpectralDensity(
      rrSeconds,
      this.SAMPLING_RATE
    );

    // Calculate coherence score (0-100%)
    const coherenceRatio = peakPower / totalPower;
    const score = Math.min(100, Math.max(0, coherenceRatio * 100));

    // Determine phase
    let phase: 'low' | 'medium' | 'high';
    if (score < 40) {
      phase = 'low';
    } else if (score < 60) {
      phase = 'medium';
    } else {
      phase = 'high';
    }

    return {
      timestamp: Date.now(),
      score: score as CoherenceScore,
      peakPower,
      totalPower,
      phase,
    };
  }

  /**
   * Calculate power spectral density using FFT
   * Simplified implementation - in production, use a proper FFT library
   */
  private static calculatePowerSpectralDensity(
    signal: number[],
    samplingRate: number
  ): { peakPower: number; totalPower: number } {
    // Simple FFT approximation using periodogram
    // For production, use a proper FFT library like fft.js or numpy
    
    const n = signal.length;
    const frequencies: number[] = [];
    const power: number[] = [];

    // Calculate frequency resolution
    const freqResolution = samplingRate / n;

    // Calculate power at each frequency
    for (let k = 0; k < n / 2; k++) {
      const freq = k * freqResolution;
      frequencies.push(freq);

      // Simple periodogram calculation
      let real = 0;
      let imag = 0;

      for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * k * i) / n;
        real += signal[i] * Math.cos(angle);
        imag += signal[i] * Math.sin(angle);
      }

      const magnitude = Math.sqrt(real * real + imag * imag) / n;
      power.push(magnitude * magnitude);
    }

    // Calculate peak power in coherence band (0.04-0.26 Hz)
    let peakPower = 0;
    for (let i = 0; i < frequencies.length; i++) {
      if (
        frequencies[i] >= this.COHERENCE_BAND_LOW &&
        frequencies[i] <= this.COHERENCE_BAND_HIGH
      ) {
        peakPower += power[i];
      }
    }

    // Calculate total power (0-0.4 Hz)
    let totalPower = 0;
    for (let i = 0; i < frequencies.length; i++) {
      if (frequencies[i] <= this.TOTAL_BAND_HIGH) {
        totalPower += power[i];
      }
    }

    return { peakPower, totalPower };
  }

  /**
   * Calculate rolling coherence from a sliding window
   */
  static calculateRollingCoherence(
    hrvMetrics: HRVMetric[],
    windowSize: number = 30 // seconds
  ): CoherenceState[] {
    const results: CoherenceState[] = [];

    for (let i = windowSize; i <= hrvMetrics.length; i++) {
      const window = hrvMetrics.slice(i - windowSize, i);
      const coherence = this.calculateCoherence(window);
      if (coherence) {
        results.push(coherence);
      }
    }

    return results;
  }

  /**
   * Get coherence phase from score
   */
  static getCoherencePhase(score: CoherenceScore): 'low' | 'medium' | 'high' {
    if (score < 40) return 'low';
    if (score < 60) return 'medium';
    return 'high';
  }
}

