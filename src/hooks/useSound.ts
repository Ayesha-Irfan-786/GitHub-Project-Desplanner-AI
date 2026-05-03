import { Howl } from 'howler';

const SOUNDS = {
  correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', // Simple ping
  wrong: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3', // Dull thud
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Click
  complete: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Ta-da
};

export function useSoundEffect() {
  const playSound = (type: keyof typeof SOUNDS) => {
    const sound = new Howl({
      src: [SOUNDS[type]],
      volume: 0.5,
    });
    sound.play();
  };

  return { playSound };
}
