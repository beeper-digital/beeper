const React = require("react");
const { useState } = React;

const { bulletin, store } = require("../services");

const {
  UPDATE_SEQUENCE,
  SEQ_ACTIVE_UPDATE,
  SEQ_GAIN_UPDATE,
  SEQ_LENGTH_UPDATE,
  SEQ_PITCH_UPDATE,
} = require("../services/actions");

const dragIcon = document.createElement("img");
dragIcon.src = "./assets/blank.png";
dragIcon.width = 0;
dragIcon.height = 0;

function Tile(props) {
  const [highlight, setHighlight] = useState(false);
  const [activeSlider, setActiveSlider] = useState(null);
  const [mode, setMode] = useState("pitch");
  const [pitch, setPitch] = useState(60);
  const [gain, setGain] = useState(0.5);
  const [length, setLength] = useState(500);
  const [active, setActive] = useState(false);

  useState(() => {
    bulletin.subscribe("heartbeat", (step) => {
      setHighlight(props.sequenceNum === step);
    });

    store.subscribe(() => {
      let mode = store.getState().get("mode");
      setMode(mode);
    });
  });

  const handleChange = (e, prop) => {
    let value;
    let type;
    switch (prop) {
      case "active":
        value = !active;
        setActive(value);
        type = SEQ_ACTIVE_UPDATE;
        break;
      case "pitch":
        value = 71 - parseInt(e.target.value, 10);
        setPitch(value);
        type = SEQ_PITCH_UPDATE;
        break;
      case "gain":
        value = (100 - parseInt(e.target.value, 10)) / 100;
        setGain(value);
        type = SEQ_GAIN_UPDATE;
        break;
      case "length":
        value = parseInt(e.target.value, 10);
        console.log("length", value);
        setLength(value);
        type = SEQ_LENGTH_UPDATE;
        break;
    }

    store.dispatch({
      type: type,
      layer: props.layer,
      tile: props.sequenceNum,
      value,
    });
  };

  return (
    <button
      onClick={(e) => handleChange(e, "active")}
      className={
        "tile " +
        (highlight ? "highlight" : "") +
        " " +
        (active ? "active" : "")
      }
    >
      <input
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => handleChange(e, "pitch")}
        data-prop="pitch"
        className="control-slider slider-note"
        type="range"
        value={71 - pitch}
        min="0"
        max="23"
      />
      <input
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => handleChange(e, "gain")}
        data-prop="gain"
        className="control-slider slider-volume"
        type="range"
        value={100 - gain * 100}
        min="0"
        max="100"
      />
      <input
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => handleChange(e, "length")}
        data-prop="length"
        className="control-slider slider-length"
        type="range"
        value={length}
        min="0"
        max="1000"
      />
    </button>
  );
}

module.exports = Tile;
