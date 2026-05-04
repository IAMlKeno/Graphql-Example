import { useRef, useState } from "react";
import { AppTypeEnum, useAppSelector } from "~/context/SelectedAppProvider";

export default function AppSelector() {
  const [rickApp, setRickApp] = useState(false);
  const [quoteApp, setQuoteApp] = useState(true);
  const { setSelectedApp } = useAppSelector();
  // const showQuoteBtn = useRef(document.querySelector('.show-quote-btn'));
  // const showRickBtn = useRef(document.querySelector('.show-rick-btn'));

  const handleShowQuoteApp = () => {
    setRickApp(false);
    setQuoteApp(true);
    setSelectedApp(AppTypeEnum.QUOTE_APP);
  }
  const handleShowRickApp = () => {
    setQuoteApp(false);
    setRickApp(true);
    setSelectedApp(AppTypeEnum.RICK_APP);
  }

  return (
    <>
      <div className="app-selector">
        <div className="login-signup" style={{ display: "flex", margin: "auto", width: "80%", justifyContent: "center" }}>
          <button
            type="button"
            className="w-full bg-blue-200 text-white py-2 rounded-lg hover:bg-blue-300 show-quote-btn"
            onClick={handleShowQuoteApp}
            disabled={quoteApp === true}
          >Quote App</button> |
          {/* ---------- */}
          <button
            type="button"
            className="w-full bg-blue-200 text-white py-2 rounded-lg hover:bg-blue-300 show-rick-btn"
            onClick={handleShowRickApp}
            disabled={rickApp === true}
          >Rick and Morty App</button>
        </div>
      </div>
    </>
  );
}