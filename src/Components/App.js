import React, { Component } from 'react';
import SplitterLayout from 'react-splitter-layout';

import audioWorklet from './audioWorklet.js';

import {CodeEditor} from './CodeEditor';
import Keyboard from './Keyboard';
import Knobs from './Knobs';


export default class App extends Component {
  constructor() {
    super();

    this.state = {
      knobs: {},
      keys: [],
      error: '',

    }

    this.port = null;
    this.startAudio();
  }

  render() {
    return (
      <SplitterLayout vertical percentage secondaryInitialSize={20}>
        <SplitterLayout percentage secondaryInitialSize={35}>
          <div className='editorWithError'>
            <CodeEditor 
              onChange={newValue => this.updateCode(newValue)}
            />
            {this.state.error ? <div className='errorField error'>{this.state.error}</div> : <div className='errorField sucess'/>}
          </div>
          <Knobs
            knobs={this.state.knobs} 
            onChange={newKnobs => this.setState({knobs: newKnobs})}
          />
        </SplitterLayout>
        <Keyboard
          keys={this.state.keys}
          onChange={newKeys => this.setState({keys: newKeys})}
        />
      </SplitterLayout>
    );
  }

  updateCode(code) {
    this.port.postMessage({shaderFunc: `(() => function() {${code}})()`});
  }

  startAudio() {
    const audioContext = new AudioContext();

    audioContext.audioWorklet.addModule(audioWorklet).then(() => {
      const audioWorklet = new AudioWorkletNode(audioContext, 'synth');
      this.port = audioWorklet.port;

      this.port.onmessage = event => {
        const {data} = event;

        if(data.hasOwnProperty('error')) {
          this.setState({error: data.error})
        }
      };

      audioWorklet.connect(audioContext.destination);
    });
  }
}
