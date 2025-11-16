export type TeacherVirtualScreenId = "teacher-demo-1";

export const TEACHER_VIRTUAL_SCREENS: Record<
  TeacherVirtualScreenId,
  JSX.Element
> = {
  "teacher-demo-1": (
    <div style={{ width: "100%", height: "100%", background: "#212121" }}>
      <h1 style={{ padding: 32, color: "#fff" }}>교사 화면 데모</h1>
      <p style={{ padding: 32, color: "#ccc" }}>
        여기에서 선생님이 설명하는 화면이라고 가정합니다.
      </p>
    </div>
  ),
};

