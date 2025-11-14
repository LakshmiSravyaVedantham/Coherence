# Audio Assets Directory

Place your chant audio files here. The app expects MP3 files named according to the chant ID.

## Required Audio Files

Based on the chant library, you need:

1. `om-chant-432hz.mp3` - Om Chant (432 Hz)
2. `gayatri-mantra-432hz.mp3` - Gayatri Mantra (432 Hz)
3. `om-mani-padme-hum-528hz.mp3` - Om Mani Padme Hum (528 Hz)
4. `gregorian-chant-432hz.mp3` - Gregorian Chant (432 Hz)
5. `universal-tone-432hz.mp3` - Universal Tone (432 Hz)
6. `shiva-mantra-432hz.mp3` - Shiva Mantra (432 Hz)

## Audio Specifications

- **Format**: MP3
- **Duration**: 15 minutes (900 seconds)
- **Sample Rate**: 44.1 kHz or 48 kHz
- **Bit Rate**: 192 kbps or higher
- **Channels**: Stereo

## Audio Structure

Each chant should have:
- **Layer 1**: Primary chant/mantra (tuned to specified frequency)
- **Layer 2**: Binaural beats (6 Hz theta for meditation)
- **Layer 3**: Schumann resonance (7.83 Hz sub-bass)
- **Layer 4**: Ambient soundscape (optional)

## Tempo

All chants should be paced at **5 breaths/min (0.083 Hz)** for optimal HRV coherence.

## For Development

If you don't have audio files yet, the app will gracefully handle missing files and show a warning in the console. You can test the UI without audio files.

