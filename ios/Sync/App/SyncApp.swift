//
//  SyncApp.swift
//  Sync
//
//  Main app entry point
//

import SwiftUI

@main
struct SyncApp: App {
    @StateObject private var appState = AppState()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
        }
    }
}

// App-wide state
class AppState: ObservableObject {
    @Published var isConnected = false
    @Published var currentSession: SessionInfo?
    @Published var userCoherence: Double = 0.0
    @Published var groupCoherence: Double = 0.0
}

