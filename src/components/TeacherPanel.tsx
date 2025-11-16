import React, { useState, useEffect } from "react";
import { ShareChip } from "./ShareChip";
import { VIRTUAL_SCREENS, VirtualScreenId } from "./VirtualScreens";
import { TeacherVirtualScreenId } from "./TeacherVirtualScreens";
import { signalingBridge } from "../utils/signalingBridge";

export const TeacherPanel: React.FC = () => {
  const [isSharingToStudent, setIsSharingToStudent] = useState(false);
  const [studentSharedScreen, setStudentSharedScreen] =
    useState<VirtualScreenId | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "connecting" | "connected" | "disconnected"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // 학생 가상 화면 공유 시작
    const handleStudentScreenShared = (msg: any) => {
      if (msg.type === "STUDENT_VIRTUAL_SCREEN_SHARED") {
        setStudentSharedScreen(msg.screenId);
        setConnectionStatus("connected");
        setMessage(null);
      }
    };

    // 학생 공유 종료
    const handleStudentShareEnded = (msg: any) => {
      if (msg.type === "STUDENT_SHARE_ENDED") {
        setStudentSharedScreen(null);
        setConnectionStatus("disconnected");
        setMessage("학생의 화면 공유가 중단되었습니다.");
      }
    };

    signalingBridge.on("STUDENT_VIRTUAL_SCREEN_SHARED", handleStudentScreenShared);
    signalingBridge.on("STUDENT_SHARE_ENDED", handleStudentShareEnded);

    return () => {
      signalingBridge.off("STUDENT_VIRTUAL_SCREEN_SHARED", handleStudentScreenShared);
      signalingBridge.off("STUDENT_SHARE_ENDED", handleStudentShareEnded);
    };
  }, []);

  const handleStartMirroring = () => {
    // 실제 getDisplayMedia 대신 데모용으로 가상 화면만 사용
    const screenId: TeacherVirtualScreenId = "teacher-demo-1";
    setIsSharingToStudent(true);

    // 학생에게 교사 화면 공유 시작 알림 + 어떤 화면인지 전달
    signalingBridge.send({
      type: "TEACHER_VIRTUAL_SCREEN_SHARED",
      screenId,
      from: "teacher",
    });
  };

  const handleStopMirroring = () => {
    setIsSharingToStudent(false);
    signalingBridge.send({ type: "TEACHER_SHARE_ENDED", from: "teacher" });
  };

  const handleRequestStudentShare = () => {
    setConnectionStatus("connecting");
    setMessage("학생에게 화면 공유를 요청했습니다.");
    setTimeout(() => setMessage(null), 3000);

    // 학생에게 화면 공유 요청
    signalingBridge.send({
      type: "REQUEST_STUDENT_SCREEN",
      from: "teacher",
    });
  };

  const handleRequestReShare = () => {
    setMessage(null);
    handleRequestStudentShare();
  };

  return (
    <div
      style={{
        padding: 24,
        height: "100vh",
        overflow: "auto",
        background: "#f5f5f5",
      }}
    >
      {/* 미러링 모드 칩 */}
      <ShareChip
        visible={isSharingToStudent}
        variant="teacher-mirroring"
        onStopClick={handleStopMirroring}
      />

      {/* 메시지 출력 영역 */}
      {message && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            background: "#fff",
            borderRadius: 4,
            border: "1px solid #ddd",
            color: "#333",
          }}
        >
          {message}
          {connectionStatus === "disconnected" && (
            <button
              onClick={handleRequestReShare}
              style={{
                marginLeft: 12,
                padding: "4px 12px",
                borderRadius: 4,
                border: "none",
                background: "#007bff",
                color: "#fff",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              재공유 요청
            </button>
          )}
        </div>
      )}

      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 24,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: 24,
        }}
      >
        <h2 style={{ margin: "0 0 16px 0", fontSize: 20, fontWeight: 600 }}>
          교사 패널
        </h2>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>미러링 모드</h3>
          <p style={{ color: "#666", marginBottom: 12, fontSize: 14 }}>
            학생들에게 내 화면을 공유합니다.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {!isSharingToStudent ? (
              <button
                onClick={handleStartMirroring}
                style={{
                  padding: "8px 16px",
                  borderRadius: 4,
                  border: "none",
                  background: "#007bff",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                화면 공유 시작
              </button>
            ) : (
              <button
                onClick={handleStopMirroring}
                style={{
                  padding: "8px 16px",
                  borderRadius: 4,
                  border: "none",
                  background: "#dc3545",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                공유 중지
              </button>
            )}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>모니터링 모드</h3>
          <p style={{ color: "#666", marginBottom: 12, fontSize: 14 }}>
            학생의 화면을 요청하여 확인합니다.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleRequestStudentShare}
              disabled={connectionStatus === "connecting"}
              style={{
                padding: "8px 16px",
                borderRadius: 4,
                border: "none",
                background:
                  connectionStatus === "connecting" ? "#ccc" : "#28a745",
                color: "#fff",
                cursor:
                  connectionStatus === "connecting" ? "not-allowed" : "pointer",
                fontSize: 14,
              }}
            >
              {connectionStatus === "connecting"
                ? "연결 시도 중..."
                : "학생 화면 요청"}
            </button>
          </div>
        </div>
      </div>

      {/* 학생 화면 표시 영역 */}
      <div
        style={{
          background: "#000",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          minHeight: 400,
          position: "relative",
        }}
      >
        {studentSharedScreen ? (
          <div style={{ width: "100%", height: "100%", minHeight: 400 }}>
            {VIRTUAL_SCREENS[studentSharedScreen]}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 400,
              color: "#fff",
              fontSize: 16,
            }}
          >
            {connectionStatus === "connecting"
              ? "연결 시도 중입니다..."
              : "학생의 화면이 표시됩니다."}
          </div>
        )}
      </div>
    </div>
  );
};
