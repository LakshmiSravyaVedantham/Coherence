//
//  SessionInfo.swift
//  Sync
//
//  Session data models
//

import Foundation

struct SessionInfo: Codable, Identifiable {
    let id: String
    let startedAt: Date
    let duration: TimeInterval
    let currentPhase: SessionPhase
    let participantCount: Int
    let groupMetrics: GroupMetrics
    let audioTrack: AudioTrack
    
    enum SessionPhase: String, Codable {
        case preparation
        case active
        case integration
        case complete
    }
}

struct GroupMetrics: Codable {
    let sessionId: String
    let timestamp: Date
    let participantCount: Int
    let averageCoherence: Double
    let peakCoherence: Double
    let coherencePhase: CoherencePhase
    let coherenceDistribution: CoherenceDistribution
    
    enum CoherencePhase: String, Codable {
        case low
        case medium
        case high
    }
}

struct CoherenceDistribution: Codable {
    let low: Int
    let medium: Int
    let high: Int
}

struct AudioTrack: Codable {
    let id: String
    let name: String
    let duration: TimeInterval
}

struct IntentionCategory: Codable, Hashable {
    let id: String
    let name: String
    let emoji: String
    
    static let categories: [IntentionCategory] = [
        IntentionCategory(id: "physical_healing", name: "Physical Healing", emoji: "🌿"),
        IntentionCategory(id: "emotional_release", name: "Emotional Release", emoji: "💧"),
        IntentionCategory(id: "anxiety", name: "Anxiety", emoji: "🧘"),
        IntentionCategory(id: "abundance", name: "Abundance", emoji: "✨"),
        IntentionCategory(id: "energy", name: "Energy", emoji: "⚡"),
        IntentionCategory(id: "grief", name: "Grief", emoji: "🕯️"),
        IntentionCategory(id: "other", name: "Other", emoji: "💫")
    ]
}

struct SessionIntention: Codable {
    let category: String
    let note: String?
}

