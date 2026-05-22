import { AppTypeEnum, useAppSelector } from "~/context/SelectedAppProvider";

export default function AppSelector() {
  const { selectedApp, setSelectedApp } = useAppSelector();
  const handleAppSelection = (app: AppTypeEnum) => setSelectedApp(app);

  return (
    <>
      <div className="app-selector">
        <div className="login-signup" style={{ display: "flex", margin: "auto", width: "80%", justifyContent: "center" }}>
          <button
            type="button"
            className="w-full bg-blue-200 text-white py-2 rounded-lg hover:bg-blue-300 show-quote-btn"
            onClick={() => handleAppSelection(AppTypeEnum.QUOTE_APP)}
            disabled={selectedApp == AppTypeEnum.QUOTE_APP}
          >Quote App</button> |
          {/* ---------- */}
          <button
            type="button"
            className="w-full bg-blue-200 text-white py-2 rounded-lg hover:bg-blue-300 show-rick-btn"
            onClick={() => handleAppSelection(AppTypeEnum.RICK_APP)}
            disabled={selectedApp == AppTypeEnum.RICK_APP}
          >Rick and Morty App</button> |
          {/* ---------- */}
          <button
            type="button"
            className="w-full bg-blue-200 text-white py-2 rounded-lg hover:bg-blue-300 show-rick-btn"
            onClick={() => handleAppSelection(AppTypeEnum.PROGRESS_FORM_APP)}
            disabled={selectedApp == AppTypeEnum.PROGRESS_FORM_APP}
          >Progress Form App</button>
        </div>
      </div>
    </>
  );
}