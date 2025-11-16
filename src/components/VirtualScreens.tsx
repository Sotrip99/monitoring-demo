export type VirtualScreenId = "screen1" | "screen2" | "screen3";

export const VIRTUAL_SCREENS: Record<VirtualScreenId, JSX.Element> = {
  screen1: (
    <div style={{ width: "100%", height: "100%", background: "#ffeb3b" }}>
      <h1 style={{ padding: 32 }}>학생 화면 데모 1</h1>
    </div>
  ),
  screen2: (
    <div style={{ width: "100%", height: "100%", background: "#03a9f4" }}>
      <h1 style={{ padding: 32, color: "#fff" }}>학생 화면 데모 2</h1>
    </div>
  ),
  screen3: (
    <div style={{ width: "100%", height: "100%", background: "#4caf50" }}>
      <h1 style={{ padding: 32, color: "#fff" }}>학생 화면 데모 3</h1>
    </div>
  ),
};

