/**
 * Chant library and configuration
 */

export interface Chant {
  id: string
  name: string
  description: string
  duration: number // in seconds
  tradition: 'hindu' | 'buddhist' | 'christian' | 'secular' | 'universal'
  frequency: number // Hz tuning (432, 528, etc.)
  bpm?: number // Beats per minute for rhythm
  filename?: string // Actual filename in /public/audio directory
}

export const AVAILABLE_CHANTS: Chant[] = [
  {
    id: 'om-chant-432hz',
    name: 'Om Chant - 108 Times',
    description: 'Sacred Om mantra chanted 108 times for deep meditation and spiritual connection',
    duration: 15 * 60, // 15 minutes
    tradition: 'hindu',
    frequency: 432,
    bpm: 5, // 5 breaths/min for optimal HRV
    filename: 'Om 108 Times - Music for Yoga & Meditation [ijfLsKg8jFY].mp3',
  },
  {
    id: 'gayatri-mantra-432hz',
    name: 'Gayatri Mantra - 108 Times',
    description: 'Ancient Vedic mantra for enlightenment, inner peace, and spiritual awakening',
    duration: 15 * 60,
    tradition: 'hindu',
    frequency: 432,
    bpm: 5,
    filename: 'Powerful GAYATRI MANTRA CHANTING 108 Times for Inner Peace, Positive Aura, Healing and Meditation [fJEKwjoXpdQ].mp3',
  },
  {
    id: 'maha-mrityunjaya-mantra',
    name: 'Maha Mrityunjaya Mantra - 108 Times',
    description: 'Powerful mantra for healing, protection, and overcoming fear of death',
    duration: 15 * 60,
    tradition: 'hindu',
    frequency: 432,
    bpm: 5,
    filename: 'Maha Mrityunjaya Mantra [108 times] - महामृत्युंजय मंत्र _ Lyrics & Meaning _ Sounds of Isha [OV9LXGOXjgs].mp3',
  },
  {
    id: 'om-mani-padme-hum-528hz',
    name: 'Om Mani Padme Hum - 528 Hz',
    description: 'Buddhist mantra of compassion, tuned to 528 Hz (Love frequency)',
    duration: 15 * 60,
    tradition: 'buddhist',
    frequency: 528,
    bpm: 5,
  },
  {
    id: 'gregorian-chant-432hz',
    name: 'Gregorian Chant - 432 Hz',
    description: 'Sacred Christian chant for contemplation and divine connection',
    duration: 15 * 60,
    tradition: 'christian',
    frequency: 432,
    bpm: 5,
  },
  {
    id: 'universal-tone-432hz',
    name: 'Universal Tone - 432 Hz',
    description: 'Pure 432 Hz tone for meditation and coherence, no specific tradition',
    duration: 15 * 60,
    tradition: 'secular',
    frequency: 432,
    bpm: 5,
  },
  {
    id: 'shiva-mantra-432hz',
    name: 'Shiva Mantra - 432 Hz',
    description: 'Om Namah Shivaya - Mantra for transformation and inner peace',
    duration: 15 * 60,
    tradition: 'hindu',
    frequency: 432,
    bpm: 5,
  },
]

// Extended Chant interface with optional filename
export interface ChantWithFile extends Chant {
  filename?: string
}

export function getChantById(id: string): Chant | undefined {
  return AVAILABLE_CHANTS.find((chant) => chant.id === id)
}

export function getChantsByTradition(tradition: Chant['tradition']): Chant[] {
  return AVAILABLE_CHANTS.filter((chant) => chant.tradition === tradition)
}

/**
 * Get the audio file path for a chant
 * Uses filename if available, otherwise falls back to id-based naming
 */
export function getChantAudioPath(chant: Chant): string {
  if (chant.filename) {
    return `/audio/${encodeURIComponent(chant.filename)}`
  }
  return `/audio/${chant.id}.mp3`
}

