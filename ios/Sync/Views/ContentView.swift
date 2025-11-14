//
//  ContentView.swift
//  Sync
//
//  Main content view
//

import SwiftUI
import Combine

struct ContentView: View {
    @EnvironmentObject var appState: AppState
    @StateObject private var healthKitService = HealthKitService()
    @StateObject private var coherenceService = CoherenceService()
    @StateObject private var sessionService = SessionService()
    @State private var showingIntentionPicker = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                if appState.currentSession == nil {
                    // Welcome/Join Session View
                    WelcomeView(
                        healthKitService: healthKitService,
                        sessionService: sessionService,
                        showingIntentionPicker: $showingIntentionPicker
                    )
                } else {
                    // Active Session View
                    SessionView(
                        healthKitService: healthKitService,
                        coherenceService: coherenceService,
                        sessionService: sessionService
                    )
                }
            }
            .sheet(isPresented: $showingIntentionPicker) {
                IntentionPickerView { intention in
                    sessionService.joinSession(intention: intention)
                    showingIntentionPicker = false
                }
            }
        }
        .onAppear {
            // Connect to session service
            let userId = UUID().uuidString // In production, use persistent user ID
            sessionService.connect(userId: userId)
            
            // Link services
            healthKitService.$rrIntervals
                .sink { intervals in
                    coherenceService.updateRRIntervals(intervals)
                }
                .store(in: &cancellables)
            
            coherenceService.$currentCoherence
                .sink { coherence in
                    sessionService.updateCoherence(coherence)
                }
                .store(in: &cancellables)
        }
    }
    
    @State private var cancellables = Set<AnyCancellable>()
}

struct WelcomeView: View {
    @ObservedObject var healthKitService: HealthKitService
    @ObservedObject var sessionService: SessionService
    @Binding var showingIntentionPicker: Bool
    
    var body: some View {
        VStack(spacing: 30) {
            Text("Sync")
                .font(.system(size: 48, weight: .bold))
            
            Text("Collective Coherence Platform")
                .font(.title2)
                .foregroundColor(.secondary)
            
            if !healthKitService.isAuthorized {
                Button("Authorize HealthKit") {
                    healthKitService.requestAuthorization()
                }
                .buttonStyle(.borderedProminent)
            } else {
                Button("Join Session") {
                    showingIntentionPicker = true
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
            }
        }
        .padding()
    }
}

