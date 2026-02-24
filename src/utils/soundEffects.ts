type TSoundEffect = 'diceRoll' | 'pieceMove' | 'pieceCapture';

type TNote = {
  frequency: number;
  durationMs: number;
};

const SOUND_SEQUENCES: Record<TSoundEffect, TNote[]> = {
  diceRoll: [
    { frequency: 260, durationMs: 45 },
    { frequency: 320, durationMs: 45 },
    { frequency: 380, durationMs: 65 },
  ],
  pieceMove: [
    { frequency: 520, durationMs: 35 },
    { frequency: 660, durationMs: 50 },
  ],
  pieceCapture: [
    { frequency: 460, durationMs: 45 },
    { frequency: 360, durationMs: 45 },
    { frequency: 240, durationMs: 95 },
  ],
};

const SOUND_VOLUMES: Record<TSoundEffect, number> = {
  diceRoll: 0.08,
  pieceMove: 0.06,
  pieceCapture: 0.1,
};

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioContext) audioContext = new AudioContext();
  return audioContext;
}

function playNote(ctx: AudioContext, startAt: number, note: TNote, gainValue: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(note.frequency, startAt);

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(gainValue, startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + note.durationMs / 1000);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startAt);
  osc.stop(startAt + note.durationMs / 1000 + 0.01);
}

export function playSoundEffect(effect: TSoundEffect) {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    void ctx.resume().catch(() => {});
  }

  const notes = SOUND_SEQUENCES[effect];
  const volume = SOUND_VOLUMES[effect];

  let cursor = ctx.currentTime;
  notes.forEach((note) => {
    playNote(ctx, cursor, note, volume);
    cursor += note.durationMs / 1000;
  });
}
