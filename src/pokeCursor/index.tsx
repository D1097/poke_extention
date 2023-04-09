import React, { useEffect, useState } from 'react';
import { FC, CSSProperties } from 'react';
import { animated } from 'react-spring';
import useMouseStalker from './useMouseStalker';
import ReactDOM from 'react-dom/client';

// オーバーレイ用のdiv要素を作成する
const addDiv = document.createElement("div");
addDiv.id = "poke-div";
addDiv.style.position = "fixed";
addDiv.style.width = "0";
addDiv.style.height = "0";
addDiv.style.backgroundColor = "rgba(0, 0, 0, 1)";
addDiv.style.zIndex = "100000";

// オーバーレイをページに追加する
document.body.appendChild(addDiv);

const initMouse = {
  width: 0,
  height: 0,
  borderRadius: 0,
  opacity: 0,
  top: 0,
  left: 0,
};

const springConfig = {
  // 変化の速さ. 大きくすると遅くなる.
  frequency: 0.75,
  // どのタイミングで減速するか. 大きくすると減速の開始が速くなる.
  damping: 1,
};

const mouseStyles: CSSProperties = {
  pointerEvents: 'none',
  position: 'fixed',
  backgroundColor: 'rgb(255, 255, 255, 1)',
};

const MouseStalker: FC = () => {
  const springStyles = useMouseStalker(initMouse, springConfig);
  const [num, setNum] = useState(Math.floor( Math.random() * 1008 ) + 1)

  return (
    <animated.div
      style={{
        ...mouseStyles,
        ...springStyles,
      }}
      id='poke-cursor-api'
    >
      <img style={{
        width: '75px',
        height: '75px',
      }}
      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${num}.png`} />
    </animated.div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#poke-div'))
root.render(<MouseStalker />)

// ReactDOM.createRoot(
//   document.querySelector('#poke-div'), <MouseStalker />
// );
