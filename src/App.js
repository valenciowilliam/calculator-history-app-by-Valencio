import React from "react";
import "./App.css"; // <--- Add this line!
import Header from "./Header";
import Calculator from "./Calculator";
import Footer from "./Footer";
import History from "./History";

function App() {
  const studentName = "Valencio William";
  const todayDate = new Date().toDateString();

  return (
    <>
      <Header name={studentName} />

      <div className="app-layout">
        <Calculator />
        <History />
      </div>

      <Footer date={todayDate} />
    </>
  );
}

export default App;