//
//  SessionService.swift
//  Sync
//
//  Session management and WebSocket communication
//

import Foundation
import Combine
import Starscream // Note: You'll need to add this dependency

class SessionService: ObservableObject {
    @Published var currentSession: SessionInfo?
    @Published var groupMetrics: GroupMetrics?
    @Published var isConnected = false
    @Published var participantCount = 0
    
    private var socket: WebSocket?
    private let baseURL: String
    
    init(baseURL: String = "ws://localhost:3000") {
        self.baseURL = baseURL
    }
    
    func connect(userId: String) {
        guard let url = URL(string: "\(baseURL)/socket.io/?EIO=4&transport=websocket") else {
            return
        }
        
        var request = URLRequest(url: url)
        request.setValue(userId, forHTTPHeaderField: "X-User-Id")
        
        socket = WebSocket(request: request)
        socket?.delegate = self
        socket?.connect()
    }
    
    func joinSession(intention: SessionIntention?) {
        let message: [String: Any] = [
            "event": "join_session",
            "data": [
                "intention": intention?.category ?? ""
            ]
        ]
        
        if let data = try? JSONSerialization.data(withJSONObject: message),
           let string = String(data: data, encoding: .utf8) {
            socket?.write(string: string)
        }
    }
    
    func updateCoherence(_ coherence: Double) {
        let message: [String: Any] = [
            "event": "update_coherence",
            "data": [
                "coherence": coherence
            ]
        ]
        
        if let data = try? JSONSerialization.data(withJSONObject: message),
           let string = String(data: data, encoding: .utf8) {
            socket?.write(string: string)
        }
    }
    
    func leaveSession() {
        let message: [String: Any] = [
            "event": "leave_session"
        ]
        
        if let data = try? JSONSerialization.data(withJSONObject: message),
           let string = String(data: data, encoding: .utf8) {
            socket?.write(string: string)
        }
        
        socket?.disconnect()
    }
}

extension SessionService: WebSocketDelegate {
    func didReceive(event: WebSocketEvent, client: WebSocketClient) {
        switch event {
        case .connected:
            DispatchQueue.main.async {
                self.isConnected = true
            }
            
        case .disconnected:
            DispatchQueue.main.async {
                self.isConnected = false
            }
            
        case .text(let string):
            handleMessage(string)
            
        case .error(let error):
            print("WebSocket error: \(error?.localizedDescription ?? "Unknown")")
            
        default:
            break
        }
    }
    
    private func handleMessage(_ message: String) {
        guard let data = message.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            return
        }
        
        // Handle different event types
        if let event = json["event"] as? String {
            switch event {
            case "session_joined":
                if let sessionData = json["data"] as? [String: Any] {
                    // Parse session info
                }
                
            case "group_metrics_update":
                if let metricsData = json["data"] as? [String: Any] {
                    // Parse group metrics
                }
                
            default:
                break
            }
        }
    }
}

// Note: This is a simplified implementation
// In production, you'd use Socket.IO client library for proper protocol handling

