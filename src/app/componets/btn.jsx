import React from "react";
import './btn.css'

export default function Btn({name, onClick}) {
  return (
    <div>
      <button  className="button-componet" onClick={onClick}>{name}</button>
    </div>
  );
}
