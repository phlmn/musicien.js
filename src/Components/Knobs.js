import React from 'react';
import Knob from 'react-canvas-knob';
import {subscribe2Midi} from './midi';

export default class Knobs extends React.Component{
  constructor() {
    super();

    this.state = {
      active: null,
      mapping: {}
    }

    subscribe2Midi(e => {
      const {data} = e;
      const [cmd, knob, value] = data;
      if(cmd === 176 || cmd == 224) {
        // we actually have a knob event
        if(this.state.active) {
          this.state.mapping[knob] = this.state.active;
          this.setState({active: null, mapping: this.state.mapping});
        } else if (this.state.mapping[knob]) {
          this.props.knobs[this.state.mapping[knob]] = value / 127;
          this.props.onChange(this.props.knobs);
        }
      }
    });
  }

  render() {
    const {knobs, onChange} = this.props;
    
    return (
      <div className='knobs'>
        {Object.keys(knobs).map((name, i) => {
          return (
            <div key={i} className='knob' onClick={() => this.setState({active: this.state.active === name ? null : name})}>
              <Knob
                min={0}
                max={1}
                step={1/127}
                
                value={knobs[name]}
                onChange={newValue => {
                  knobs[name] = newValue
                  onChange(knobs)
                }}

                angleArc={270}
                angleOffset={-135}
                width={100}
                height={100}
                displayInput={false}
                displayCustom={() => <span>{knobs[name].toFixed(2)}</span>}
                fgColor='#569CD6'
                bgColor='#264F78'
              />
              <label style={this.state.active === name ? {color: '#f77'} : {}}>{name}</label>
            </div>
          );
        })}
      </div>
    )
  }
}
