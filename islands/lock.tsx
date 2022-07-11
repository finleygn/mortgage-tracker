/** @jsx h */
import { h } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";

const unlock = `┌────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░                                      ░│
│░                                      ░│
│░             ▄████████▄               ░│
│░            ███      ███              ░│
│░            ██        ██              ░│
│░         ██████████████████           ░│
│░         ███████▀  ▀███████           ░│
│░         ███████    ███████           ░│
│░         ████████  ████████           ░│
│░         ████████  ████████           ░│
│░         ██████████████████           ░│
│░                                      ░│
│░ █ █ █▀█ █  █▀█ █▀ █▄▀ ############## ░│
│░ ▀▀▀ ▀ ▀ ▀▀ ▀▀▀ ▀▀ ▀ ▀ ────────────── ░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└────────────────────────────────────────┘`;

const Lock = ({ error }) => {
  const [color, setColor] = useState(error ? "red" : "white");
  const [item, setItem] = useState("");
  const ref = useRef();

  const padding = unlock.split("").reduce((acc, item) => item === "#" ? acc+1 : acc, 0);
  const removed = unlock.replace("#".repeat(padding), "*".repeat(item.length).padEnd(padding, " "));

  useEffect(() => {
    setColor("white")
  }, [])

  return (
    <pre style={{ lineHeight: 1, fontFamily: 'monospace', padding: "1vw 1vw 0vw 1vw", fontSize: '1vw', color: color, transition: 'color 1s', backdropFilter: 'brightness(0.05)' }} onClick={() => ref.current.focus()}>
      {removed}
      <form method="POST">
        <input name="pw" value={item} onInput={(e) => setItem(e.target.value.substring(0, padding))} ref={ref} autoFocus style={{ height: '0px' }} />
      </form>
    </pre>
  )
}

export default Lock;