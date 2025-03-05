"use client";

import GridComponent from "../components/GridComponent";
import React, { useState, useEffect } from "react";
import "../components/Page.css";
import Modal from 'react-modal';

export default function Home() {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const appElement = document.getElementById('__next') || document.body;
    console.log('appElement: ', appElement);
    Modal.setAppElement(appElement);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    // Trigger the row addition in GridComponent
    const event = new CustomEvent("addRow", { detail: inputValue });
    window.dispatchEvent(event);
  };

  return (
    <div>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="変化点入力"
          className="input-box"
        />
        <button onClick={handleButtonClick} className="action-button">特定(AI)</button>
      </div>
      <GridComponent />
    </div>
  );
}