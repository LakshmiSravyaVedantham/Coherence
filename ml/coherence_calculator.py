"""
Advanced coherence calculation using proper FFT
More accurate than the TypeScript version for research-grade analysis
"""

import numpy as np
from scipy import signal
from scipy.fft import fft, fftfreq
from typing import List, Tuple, Optional
import pandas as pd


class CoherenceCalculator:
    """
    Calculate HeartMath-style coherence from HRV data
    Uses proper FFT for frequency domain analysis
    """
    
    COHERENCE_BAND_LOW = 0.04  # Hz
    COHERENCE_BAND_HIGH = 0.26  # Hz
    TOTAL_BAND_HIGH = 0.4  # Hz
    
    def __init__(self, sampling_rate: float = 1.0):
        """
        Args:
            sampling_rate: Samples per second (typically 1 Hz for HRV)
        """
        self.sampling_rate = sampling_rate
    
    def calculate_coherence(
        self, 
        rr_intervals: List[float],
        window_size: int = 30
    ) -> Optional[Tuple[float, dict]]:
        """
        Calculate coherence score from R-R intervals
        
        Args:
            rr_intervals: List of R-R intervals in milliseconds
            window_size: Minimum window size in seconds (default 30)
            
        Returns:
            Tuple of (coherence_score, metadata) or None if insufficient data
        """
        if len(rr_intervals) < window_size:
            return None
        
        # Convert to seconds
        rr_seconds = np.array(rr_intervals) / 1000.0
        
        # Calculate power spectral density
        power, frequencies = self._calculate_psd(rr_seconds)
        
        # Calculate peak power in coherence band
        coherence_mask = (frequencies >= self.COHERENCE_BAND_LOW) & \
                        (frequencies <= self.COHERENCE_BAND_HIGH)
        peak_power = np.sum(power[coherence_mask])
        
        # Calculate total power
        total_mask = frequencies <= self.TOTAL_BAND_HIGH
        total_power = np.sum(power[total_mask])
        
        # Avoid division by zero
        if total_power == 0:
            return None
        
        # Calculate coherence ratio (0-1)
        coherence_ratio = peak_power / total_power
        
        # Convert to 0-100 scale
        coherence_score = min(100, max(0, coherence_ratio * 100))
        
        # Determine phase
        if coherence_score < 40:
            phase = 'low'
        elif coherence_score < 60:
            phase = 'medium'
        else:
            phase = 'high'
        
        metadata = {
            'peak_power': float(peak_power),
            'total_power': float(total_power),
            'coherence_ratio': float(coherence_ratio),
            'phase': phase,
            'dominant_frequency': float(frequencies[np.argmax(power)])
        }
        
        return (coherence_score, metadata)
    
    def _calculate_psd(
        self, 
        signal_data: np.ndarray,
        method: str = 'welch'
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Calculate power spectral density
        
        Args:
            signal_data: Time series data
            method: 'welch' (recommended) or 'fft'
            
        Returns:
            Tuple of (power, frequencies)
        """
        if method == 'welch':
            # Welch's method - better for noisy signals
            frequencies, power = signal.welch(
                signal_data,
                fs=self.sampling_rate,
                nperseg=min(len(signal_data), 256),
                noverlap=None,
                nfft=None,
                detrend='linear'
            )
        else:
            # Simple FFT
            n = len(signal_data)
            fft_vals = fft(signal_data)
            frequencies = fftfreq(n, 1.0 / self.sampling_rate)
            
            # Only positive frequencies
            positive_freq_idx = frequencies >= 0
            frequencies = frequencies[positive_freq_idx]
            power = np.abs(fft_vals[positive_freq_idx]) ** 2 / n
        
        return power, frequencies
    
    def calculate_rolling_coherence(
        self,
        rr_intervals: List[float],
        window_size: int = 30,
        step_size: int = 5
    ) -> pd.DataFrame:
        """
        Calculate rolling coherence with sliding window
        
        Args:
            rr_intervals: List of R-R intervals in milliseconds
            window_size: Window size in seconds
            step_size: Step size in seconds
            
        Returns:
            DataFrame with timestamp, coherence_score, and metadata
        """
        results = []
        
        for i in range(0, len(rr_intervals) - window_size, step_size):
            window = rr_intervals[i:i + window_size]
            result = self.calculate_coherence(window, window_size)
            
            if result:
                score, metadata = result
                results.append({
                    'timestamp': i,
                    'coherence_score': score,
                    **metadata
                })
        
        return pd.DataFrame(results)
    
    def calculate_synchronization(
        self,
        signal_a: List[float],
        signal_b: List[float]
    ) -> dict:
        """
        Calculate synchronization between two HRV signals
        
        Returns:
            Dictionary with correlation, phase sync index, and sync strength
        """
        # Align signals (interpolate if needed)
        min_len = min(len(signal_a), len(signal_b))
        signal_a = np.array(signal_a[:min_len])
        signal_b = np.array(signal_b[:min_len])
        
        # Pearson correlation
        correlation = np.corrcoef(signal_a, signal_b)[0, 1]
        
        # Phase synchronization index using Hilbert transform
        analytic_a = signal.hilbert(signal_a)
        analytic_b = signal.hilbert(signal_b)
        
        phase_a = np.angle(analytic_a)
        phase_b = np.angle(analytic_b)
        
        # Phase locking value
        phase_diff = phase_a - phase_b
        phase_lock = np.abs(np.mean(np.exp(1j * phase_diff)))
        
        # Combined sync strength
        sync_strength = (correlation + phase_lock) / 2.0
        
        return {
            'correlation': float(correlation),
            'phase_sync_index': float(phase_lock),
            'sync_strength': float(sync_strength)
        }


def calculate_group_coherence_matrix(
    participant_signals: List[List[float]]
) -> np.ndarray:
    """
    Calculate pairwise synchronization matrix for all participants
    
    Args:
        participant_signals: List of HRV signal arrays (one per participant)
        
    Returns:
        NxN matrix of synchronization strengths
    """
    n = len(participant_signals)
    calculator = CoherenceCalculator()
    sync_matrix = np.zeros((n, n))
    
    for i in range(n):
        for j in range(i + 1, n):
            sync_result = calculator.calculate_synchronization(
                participant_signals[i],
                participant_signals[j]
            )
            sync_strength = sync_result['sync_strength']
            sync_matrix[i, j] = sync_strength
            sync_matrix[j, i] = sync_strength
    
    # Diagonal is self-sync (always 1.0)
    np.fill_diagonal(sync_matrix, 1.0)
    
    return sync_matrix

