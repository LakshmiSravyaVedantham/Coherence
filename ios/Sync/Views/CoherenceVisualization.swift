//
//  CoherenceVisualization.swift
//  Sync
//
//  Sacred geometry mandala visualization
//

import SwiftUI

struct CoherenceVisualization: View {
    let personalCoherence: Double
    let groupCoherence: Double
    let coherencePhase: CoherenceService.CoherencePhase
    
    @State private var animationPhase: Double = 0
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Background gradient
                RadialGradient(
                    colors: [
                        Color.black.opacity(0.9),
                        Color.purple.opacity(0.3)
                    ],
                    center: .center,
                    startRadius: 0,
                    endRadius: geometry.size.width
                )
                
                // Flower of Life pattern
                FlowerOfLifeView(
                    coherence: groupCoherence,
                    animationPhase: animationPhase
                )
                .frame(width: min(geometry.size.width, geometry.size.height) * 0.8)
                
                // Personal coherence wave (bottom)
                PersonalCoherenceWave(
                    coherence: personalCoherence,
                    animationPhase: animationPhase
                )
                .frame(height: 60)
                .offset(y: geometry.size.height / 2 - 40)
            }
        }
        .onAppear {
            withAnimation(.linear(duration: 2).repeatForever(autoreverses: false)) {
                animationPhase = .pi * 2
            }
        }
    }
}

struct FlowerOfLifeView: View {
    let coherence: Double
    let animationPhase: Double
    
    var body: some View {
        Canvas { context, size in
            let center = CGPoint(x: size.width / 2, y: size.height / 2)
            let maxRadius = min(size.width, size.height) / 2
            
            // Base radius scales with coherence (0-100% -> 0.3-1.0 of max)
            let baseRadius = maxRadius * (0.3 + (coherence / 100) * 0.7)
            
            // Draw concentric circles (Flower of Life pattern)
            let circleCount = 7
            for i in 0..<circleCount {
                let radius = baseRadius * (Double(i) / Double(circleCount - 1))
                let alpha = 0.3 + (coherence / 100) * 0.7
                
                // Color based on coherence phase
                let color: Color
                if coherence < 40 {
                    color = .red
                } else if coherence < 60 {
                    color = .yellow
                } else {
                    color = .green
                }
                
                context.stroke(
                    Path(ellipseIn: CGRect(
                        x: center.x - radius,
                        y: center.y - radius,
                        width: radius * 2,
                        height: radius * 2
                    )),
                    with: .color(color.opacity(alpha)),
                    lineWidth: 2
                )
            }
            
            // Draw interlocking circles (simplified Flower of Life)
            let interlockRadius = baseRadius / 3
            for angle in stride(from: 0, to: .pi * 2, by: .pi / 3) {
                let x = center.x + cos(angle + animationPhase) * interlockRadius
                let y = center.y + sin(angle + animationPhase) * interlockRadius
                
                context.stroke(
                    Path(ellipseIn: CGRect(
                        x: x - interlockRadius,
                        y: y - interlockRadius,
                        width: interlockRadius * 2,
                        height: interlockRadius * 2
                    )),
                    with: .color(.white.opacity(0.5)),
                    lineWidth: 1
                )
            }
        }
    }
}

struct PersonalCoherenceWave: View {
    let coherence: Double
    let animationPhase: Double
    
    var body: some View {
        GeometryReader { geometry in
            Path { path in
                let width = geometry.size.width
                let height = geometry.size.height
                let midY = height / 2
                
                // Wave amplitude scales with coherence
                let amplitude = height * 0.3 * (coherence / 100)
                
                // Number of waves
                let frequency = 3.0
                
                path.move(to: CGPoint(x: 0, y: midY))
                
                for x in stride(from: 0, through: width, by: 1) {
                    let normalizedX = x / width
                    let y = midY + sin(normalizedX * frequency * .pi * 2 + animationPhase) * amplitude
                    path.addLine(to: CGPoint(x: x, y: y))
                }
            }
            .stroke(
                coherence < 40 ? Color.red : (coherence < 60 ? Color.yellow : Color.green),
                lineWidth: 2
            )
        }
    }
}

