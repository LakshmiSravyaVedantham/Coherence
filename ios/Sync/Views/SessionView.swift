//
//  SessionView.swift
//  Sync
//
//  Active session view with visualization
//

import SwiftUI

struct SessionView: View {
    @ObservedObject var healthKitService: HealthKitService
    @ObservedObject var coherenceService: CoherenceService
    @ObservedObject var sessionService: SessionService
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        VStack(spacing: 20) {
            // Group metrics header
            GroupMetricsHeader(sessionService: sessionService)
            
            // Main visualization
            CoherenceVisualization(
                personalCoherence: coherenceService.currentCoherence,
                groupCoherence: sessionService.groupMetrics?.averageCoherence ?? 0,
                coherencePhase: coherenceService.coherencePhase
            )
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            
            // Personal metrics
            PersonalMetricsView(
                heartRate: healthKitService.currentHeartRate,
                coherence: coherenceService.currentCoherence,
                coherencePhase: coherenceService.coherencePhase
            )
            
            // Leave button
            Button("Leave Session") {
                sessionService.leaveSession()
            }
            .buttonStyle(.bordered)
        }
        .padding()
    }
}

struct GroupMetricsHeader: View {
    @ObservedObject var sessionService: SessionService
    
    var body: some View {
        VStack(spacing: 8) {
            Text("\(sessionService.participantCount) people breathing with you")
                .font(.headline)
            
            if let metrics = sessionService.groupMetrics {
                HStack {
                    Text("Group Coherence:")
                        .font(.subheadline)
                    Text("\(Int(metrics.averageCoherence))%")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(coherenceColor(metrics.coherencePhase))
                }
            }
        }
    }
    
    private func coherenceColor(_ phase: GroupMetrics.CoherencePhase) -> Color {
        switch phase {
        case .low: return .red
        case .medium: return .yellow
        case .high: return .green
        }
    }
}

struct PersonalMetricsView: View {
    let heartRate: Double
    let coherence: Double
    let coherencePhase: CoherenceService.CoherencePhase
    
    var body: some View {
        HStack(spacing: 30) {
            VStack {
                Text("Heart Rate")
                    .font(.caption)
                Text("\(Int(heartRate))")
                    .font(.title3)
                    .fontWeight(.semibold)
            }
            
            VStack {
                Text("Your Coherence")
                    .font(.caption)
                Text("\(Int(coherence))%")
                    .font(.title3)
                    .fontWeight(.semibold)
                    .foregroundColor(coherenceColor(coherencePhase))
            }
        }
    }
    
    private func coherenceColor(_ phase: CoherenceService.CoherencePhase) -> Color {
        switch phase {
        case .low: return .red
        case .medium: return .yellow
        case .high: return .green
        }
    }
}

