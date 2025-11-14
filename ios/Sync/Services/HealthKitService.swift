//
//  HealthKitService.swift
//  Sync
//
//  HealthKit integration for HRV and heart rate monitoring
//

import Foundation
import HealthKit
import Combine

class HealthKitService: ObservableObject {
    private let healthStore = HKHealthStore()
    private var heartRateQuery: HKQuery?
    private var hrvQuery: HKQuery?
    
    @Published var currentHeartRate: Double = 0.0
    @Published var currentHRV: Double = 0.0
    @Published var rrIntervals: [Double] = [] // R-R intervals in milliseconds
    @Published var isAuthorized = false
    
    private let rrIntervalBuffer = CircularBuffer<Double>(size: 300) // 5 minutes at 1 Hz
    
    init() {
        requestAuthorization()
    }
    
    func requestAuthorization() {
        guard HKHealthStore.isHealthDataAvailable() else {
            print("HealthKit not available")
            return
        }
        
        let readTypes: Set<HKObjectType> = [
            HKObjectType.quantityType(forIdentifier: .heartRate)!,
            HKObjectType.quantityType(forIdentifier: .heartRateVariabilitySDNN)!,
            HKObjectType.quantityType(forIdentifier: .respiratoryRate)!,
        ]
        
        healthStore.requestAuthorization(toShare: nil, read: readTypes) { [weak self] success, error in
            DispatchQueue.main.async {
                self?.isAuthorized = success
                if success {
                    self?.startHeartRateMonitoring()
                    self?.startHRVMonitoring()
                }
            }
        }
    }
    
    private func startHeartRateMonitoring() {
        guard let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate) else {
            return
        }
        
        let query = HKAnchoredObjectQuery(
            type: heartRateType,
            predicate: nil,
            anchor: nil,
            limit: HKObjectQueryNoLimit
        ) { [weak self] query, samples, deletedObjects, anchor, error in
            self?.processHeartRateSamples(samples)
        }
        
        query.updateHandler = { [weak self] query, samples, deletedObjects, anchor, error in
            self?.processHeartRateSamples(samples)
        }
        
        healthStore.execute(query)
        self.heartRateQuery = query
    }
    
    private func startHRVMonitoring() {
        guard let hrvType = HKObjectType.quantityType(forIdentifier: .heartRateVariabilitySDNN) else {
            return
        }
        
        let query = HKAnchoredObjectQuery(
            type: hrvType,
            predicate: nil,
            anchor: nil,
            limit: HKObjectQueryNoLimit
        ) { [weak self] query, samples, deletedObjects, anchor, error in
            self?.processHRVSamples(samples)
        }
        
        query.updateHandler = { [weak self] query, samples, deletedObjects, anchor, error in
            self?.processHRVSamples(samples)
        }
        
        healthStore.execute(query)
        self.hrvQuery = query
    }
    
    private func processHeartRateSamples(_ samples: [HKSample]?) {
        guard let samples = samples as? [HKQuantitySample] else { return }
        
        for sample in samples {
            let heartRateUnit = HKUnit.count().unitDivided(by: HKUnit.minute())
            let heartRate = sample.quantity.doubleValue(for: heartRateUnit)
            
            DispatchQueue.main.async {
                self.currentHeartRate = heartRate
                
                // Calculate R-R interval from heart rate (in milliseconds)
                let rrInterval = 60000.0 / heartRate
                self.rrIntervalBuffer.append(rrInterval)
                self.rrIntervals = Array(self.rrIntervalBuffer.buffer)
            }
        }
    }
    
    private func processHRVSamples(_ samples: [HKSample]?) {
        guard let samples = samples as? [HKQuantitySample] else { return }
        
        for sample in samples {
            let hrv = sample.quantity.doubleValue(for: HKUnit.secondUnit(with: .milli))
            
            DispatchQueue.main.async {
                self.currentHRV = hrv
            }
        }
    }
    
    func stopMonitoring() {
        if let query = heartRateQuery {
            healthStore.stop(query)
        }
        if let query = hrvQuery {
            healthStore.stop(query)
        }
    }
}

// Simple circular buffer for R-R intervals
class CircularBuffer<T> {
    private var buffer: [T?]
    private var writeIndex = 0
    private var isFull = false
    
    init(size: Int) {
        buffer = Array(repeating: nil, count: size)
    }
    
    func append(_ element: T) {
        buffer[writeIndex] = element
        writeIndex = (writeIndex + 1) % buffer.count
        if writeIndex == 0 {
            isFull = true
        }
    }
    
    var elements: [T] {
        if isFull {
            return Array(buffer[writeIndex...] + buffer[..<writeIndex]).compactMap { $0 }
        } else {
            return buffer[..<writeIndex].compactMap { $0 }
        }
    }
}

