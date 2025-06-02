import React from "react";
import './btn.css'

export default function Btn({name}) {
  return (
    <div>
      <button  className="button-componet">{name}</button>
    </div>
  );
}
