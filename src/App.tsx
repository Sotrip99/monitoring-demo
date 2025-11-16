import { TeacherPanel } from "./components/TeacherPanel";
import { StudentPanel } from "./components/StudentPanel";

function App() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          borderRight: "2px solid #ddd",
          overflow: "auto",
        }}
      >
        <TeacherPanel />
      </div>
      <div
        style={{
          overflow: "auto",
        }}
      >
        <StudentPanel />
      </div>
    </div>
  );
}

export default App;

