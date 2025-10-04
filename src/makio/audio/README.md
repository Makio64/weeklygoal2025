# audio

use case:
```
import stage from 'mnf/core/stage'
import audio from 'mnf-audio/audio'
import AudioAnalyser from 'mnf-audio/AudioAnalyser'
import AudioDebugger from 'mnf-audio/AudioDebugger'

//...
audio.start({
	live : false,
	playlist : ["audio/galvanize.mp3"],
	mute : false,
	onLoad : ()=>{
		//optionnal stuffs
		audio.analyser = new AudioAnalyser(audio)
		audio.analyser.debugger = new AudioDebugger(audio.analyser)
		audio.onBeat.add(()=>{/* beat event */})
		stage.onUpdate.add(this.update)
	}
})

```
