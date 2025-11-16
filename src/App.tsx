import { TeacherPanel } from "./components/TeacherPanel";
import { StudentPanel } from "./components/StudentPanel";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          flex: 1,
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
      <Footer />
    </div>
  );
}

export default App;

