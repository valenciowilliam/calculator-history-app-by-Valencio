import "./Calculator.css";
import React, { useState, useEffect, useCallback, useMemo } from "react";

const Calculator = () => {
  const [display, setDisplay] = useState("");
  const [activeButton, setActiveButton] = useState("");

  /* ---------------- HELPERS ---------------- */

  const isOperator = (char) => "+-*/".includes(char);

  // Map keyboard key → calculator button
  const keyToButtonMap = useMemo(() => ({
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",

  "+": "+",
  "-": "-",
  "*": "×",
  "/": "÷",
  ".": ".",

  "Enter": "=",
  "Delete": "AC",
  "Shift": "AC",
}), []);


  const isActive = (btn) => (activeButton === btn ? "active" : "");

  /* ---------------- INPUT HANDLING ---------------- */

  const handleClick = useCallback((value) => {
  if (display === "Error") {
    setDisplay(value);
    return;
  }

  const lastChar = display.slice(-1);
  if (!display && isOperator(value)) return;
  if (isOperator(lastChar) && isOperator(value)) return;
  if (value === "." && lastChar === ".") return;

  setDisplay((prev) => prev + value);
}, [display]);


  const clearAll = useCallback(() => setDisplay(""), []);
  const backspace = useCallback(() => {
  setDisplay((prev) => prev.slice(0, -1));
}, []);


  const calculate = useCallback(async () => {
  if (!display || isOperator(display.slice(-1))) {
    setDisplay("Error");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expression: display }),
    });

    const data = await response.json();
    setDisplay(data.result.toString());
  } catch {
    setDisplay("Error");
  }
}, [display]);

  /* ---------------- KEYBOARD SUPPORT ---------------- */

  useEffect(() => {
  const handleKeyDown = (event) => {
    const key = event.key;

    const mappedButton = keyToButtonMap[key];
    if (mappedButton) {
      setActiveButton(mappedButton);
      setTimeout(() => setActiveButton(""), 150);
    }

    if ("0123456789+-*/().".includes(key)) {
      handleClick(key);
    } else if (key === "Enter") {
      event.preventDefault();
      calculate();
    } else if (key === "Backspace") {
      backspace();
    } else if (key === "Delete" || key === "Shift") {
      clearAll();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [handleClick, calculate, backspace, clearAll, keyToButtonMap]);


  /* ---------------- UI ---------------- */

  return (
    <div className="calculator-container">
      <div className="display">{display || "0"}</div>

      <div className="buttons">
        {/* Scientific */}
        <button onClick={() => handleClick("√(")}>√</button>
        <button onClick={() => handleClick("^2")}>x²</button>
        <button onClick={() => handleClick("/100")}>%</button>
        <button onClick={() => handleClick("1/(")}>1/x</button>

        {/* AC row */}
        <button className={`gray ${isActive("AC")}`} onClick={clearAll}>AC</button>
        <button onClick={() => handleClick("(")}>(</button>
        <button onClick={() => handleClick(")")}>)</button>
        <button className={`operator ${isActive("÷")}`} onClick={() => handleClick("/")}>÷</button>

        {/* Numbers & operators */}
        <button className={isActive("7")} onClick={() => handleClick("7")}>7</button>
        <button className={isActive("8")} onClick={() => handleClick("8")}>8</button>
        <button className={isActive("9")} onClick={() => handleClick("9")}>9</button>
        <button className={`operator ${isActive("×")}`} onClick={() => handleClick("*")}>×</button>

        <button className={isActive("4")} onClick={() => handleClick("4")}>4</button>
        <button className={isActive("5")} onClick={() => handleClick("5")}>5</button>
        <button className={isActive("6")} onClick={() => handleClick("6")}>6</button>
        <button className={`operator ${isActive("-")}`} onClick={() => handleClick("-")}>−</button>

        <button className={isActive("1")} onClick={() => handleClick("1")}>1</button>
        <button className={isActive("2")} onClick={() => handleClick("2")}>2</button>
        <button className={isActive("3")} onClick={() => handleClick("3")}>3</button>
        <button className={`operator plus ${isActive("+")}`} onClick={() => handleClick("+")}>+</button>

        <button className={`zero ${isActive("0")}`} onClick={() => handleClick("0")}>0</button>
        <button className={isActive(".")} onClick={() => handleClick(".")}>.</button>
        <button className={`equal ${isActive("=")}`} onClick={calculate}>=</button>
      </div>
    </div>
  );
};

export default Calculator;
