//
//  CoherenceService.swift
//  Sync
//
//  Coherence calculation service
//

import Foundation
import Combine

class CoherenceService: ObservableObject {
    @Published var currentCoherence: Double = 0.0
    @Published var coherencePhase: CoherencePhase = .low
    
    enum CoherencePhase {
        case low
        case medium
        case high
    }
    
    private var rrIntervalWindow: [Double] = []
    private let windowSize = 30 // 30 seconds minimum for coherence calculation
    
    func updateRRIntervals(_ intervals: [Double]) {
        rrIntervalWindow = intervals.suffix(windowSize)
        
        if rrIntervalWindow.count >= windowSize {
            calculateCoherence()
        }
    }
    
    private func calculateCoherence() {
        // Simplified coherence calculation
        // In production, this would use the proper FFT-based calculation
        // For now, we'll use a simplified metric based on HRV stability
        
        guard rrIntervalWindow.count >= windowSize else { return }
        
        let mean = rrIntervalWindow.reduce(0, +) / Double(rrIntervalWindow.count)
        let variance = rrIntervalWindow.map { pow($0 - mean, 2) }.reduce(0, +) / Double(rrIntervalWindow.count)
        let stdDev = sqrt(variance)
        
        // Coefficient of variation (lower = more coherent)
        let cv = stdDev / mean
        
        // Convert to coherence score (0-100)
        // Lower CV = higher coherence
        // Typical CV for coherent state: 0.02-0.05
        let coherence = max(0, min(100, 100 * (1 - cv * 10)))
        
        DispatchQueue.main.async {
            self.currentCoherence = coherence
            
            if coherence < 40 {
                self.coherencePhase = .low
            } else if coherence < 60 {
                self.coherencePhase = .medium
            } else {
                self.coherencePhase = .high
            }
        }
    }
}

