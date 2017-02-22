const React = require('react')

class ControlInput extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="controls__section">
        <label>{this.props.name}</label>
        <input onChange={(e) => this.props.handleChange(e, this.props.valueName)} value={this.props.value} min={this.props.min} max={this.props.max} type="range" />
      </div>
    )
  }
}

module.exports = ControlInput
