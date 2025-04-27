const audioContext = new AudioContext();

/**
 * PC speaker beep
 * @param vol Volume (0-100)
 * @param freq Frequency (Hz)
 * @param duration Duration (ms)
 */
export function beep(vol: number, freq: number = 800, duration: number = 200) {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain);
  osc.frequency.value = freq;
  osc.type = "square";
  gain.connect(audioContext.destination);
  gain.gain.value = vol * 0.01;
  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + duration * 0.001);
}
