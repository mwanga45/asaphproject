import React from "react";
import './btn.css'

export default function Btn({name,onclick}) {
  return (
    <div>
      <button  onClick={onclick} className="button-componet">{name}</button>
    </div>
  );
}
