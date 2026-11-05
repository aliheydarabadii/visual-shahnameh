/**
 * Run in a local Vite reader tab's console:
 * await (await import('/scripts/probe_portal.mjs')).probePortal()
 * Exercises wheel reversal, then checks the actual painting bitmap for holes.
 * Keep the tab foregrounded. This does not freeze the camera or replace input.
 */
export async function probePortal() {
  const journey = window.__journey;
  if (!journey?.world) throw new Error('Open a built section on the local Vite server first');
  const dive = journey.timeline.scenes[1];
  if (!dive) throw new Error('Choose a section with a portal');
  journey.loadAround(0);
  await Promise.all(journey.scenes.slice(0, 3).map(node => node.img.decode()));
  await new Promise(resolve => setTimeout(resolve, 100));
  journey.jumpTo(dive.diveStart + .1);
  const samples = [];
  for (let k = 0; k < 180; k++) {
    const deltaY = k < 48 ? 10 : k < 83 ? -10 : k < 125 ? 10 : k < 155 ? -10 : 15;
    window.dispatchEvent(new WheelEvent('wheel', { deltaY, cancelable: true }));
    await new Promise(resolve => setTimeout(resolve, 22));
    const { width, height } = journey.world;
    const pixels = journey.worldContext.getImageData(0, 0, width, height).data;
    let holes = 0;
    for (let y = 3; y < height; y += 37)
      for (let x = 3; x < width; x += 37)
        if (pixels[(y * width + x) * 4 + 3] < 254) holes++;
    samples.push({ beat: journey.u, holes });
  }
  if (samples.some(sample => sample.holes)) throw new Error('Painting has transparent holes during wheel reversal');
  const beats = samples.map(sample => sample.beat);
  if (Math.max(...beats) < dive.revealed || !beats.some((beat, i) => i && beat < beats[i - 1]))
    throw new Error('Probe did not cross and reverse the portal; keep the tab foregrounded');
  return { pass: true, samples };
}
