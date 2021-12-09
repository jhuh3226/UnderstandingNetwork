// const synth = new Tone.Synth().toDestination();
const synth = new Tone.Synth();
synth.toMaster();

synth.triggerAttackRelease("C4", "8n");