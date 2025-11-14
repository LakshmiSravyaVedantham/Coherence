# Audio Assets

Directory for synchronized audio session tracks.

## Required Audio Files

### MVP Audio Tracks

1. **Om Chant (432 Hz)**
   - Duration: 15 minutes
   - Format: MP3 or WAV
   - Tuning: 432 Hz
   - Tempo: 5 breaths/min (0.083 Hz)

2. **Gayatri Mantra**
   - Duration: 15 minutes
   - Format: MP3 or WAV
   - Tempo: 5 breaths/min

3. **Buddhist Mantra**
   - Duration: 15 minutes
   - Format: MP3 or WAV
   - Tempo: 5 breaths/min

4. **Secular Breath Guidance**
   - Duration: 15 minutes
   - Format: MP3 or WAV
   - Tempo: 5 breaths/min

## Audio Specifications

- **Sample Rate**: 44.1 kHz or 48 kHz
- **Bit Depth**: 16-bit or 24-bit
- **Channels**: Stereo
- **Format**: MP3 (V0 or 320 kbps) or WAV

## Layered Audio Architecture

Each track should have:
- **Layer 1**: Primary chant/mantra (432 Hz or 528 Hz tuning)
- **Layer 2**: Binaural beats (6 Hz theta for meditation)
- **Layer 3**: Schumann resonance (7.83 Hz sub-bass)
- **Layer 4**: Ambient soundscape (optional)

## File Naming Convention

```
{track-id}-{name}-{tuning}.{ext}

Examples:
- om-chant-432hz.mp3
- gayatri-mantra-432hz.mp3
- buddhist-mantra-528hz.mp3
- breath-guidance-secular.mp3
```

## Integration

Audio tracks are referenced in the backend session configuration:
- Track ID maps to filename
- Duration must match session duration (15 minutes)
- Server streams audio with precise timing for synchronization

## Future Enhancements

- Adaptive tempo based on group coherence
- Dynamic binaural beat frequency
- Real-time breath sound generation from group data

