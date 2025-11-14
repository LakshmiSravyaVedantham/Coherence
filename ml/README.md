# ML & Data Processing

Python-based coherence calculation and data analysis tools for the Sync platform.

## Setup

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Usage

### Coherence Calculation

```python
from coherence_calculator import CoherenceCalculator

calculator = CoherenceCalculator(sampling_rate=1.0)

# Calculate coherence from R-R intervals (in milliseconds)
rr_intervals = [850, 860, 855, 870, 865, ...]  # Your HRV data
result = calculator.calculate_coherence(rr_intervals)

if result:
    score, metadata = result
    print(f"Coherence Score: {score:.2f}%")
    print(f"Phase: {metadata['phase']}")
```

### Synchronization Analysis

```python
from coherence_calculator import calculate_group_coherence_matrix

# Multiple participant signals
signals = [
    [850, 860, 855, ...],  # Participant 1
    [840, 850, 845, ...],  # Participant 2
    ...
]

sync_matrix = calculate_group_coherence_matrix(signals)
# Returns NxN matrix of synchronization strengths
```

## Research Analysis

This module provides research-grade analysis tools for:
- Individual coherence calculation
- Pairwise synchronization
- Group coherence networks
- Time-series analysis
- Statistical validation

