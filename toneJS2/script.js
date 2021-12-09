// // const synth = new Tone.Synth().toDestination();
// const synth = new Tone.Synth();
// synth.toDestination();

const { Player } = require("tone");

// synth.triggerAttackRelease("C4", "8n");

function startAudio(){
    Tone.start()
}


const synth = new Tone.MonoSynth({
	oscillator: {
		type: "square"
	},
	envelope: {
		attack: 0.1
	}
}).toDestination();
synth.triggerAttackRelease("C4", "8n");