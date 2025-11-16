import React, { useState, useEffect } from "react";
import { ShareChip } from "./ShareChip";
import { StudentScreenShareModal } from "./StudentScreenShareModal";
import { VirtualScreenId } from "./VirtualScreens";
import {
  TEACHER_VIRTUAL_SCREENS,
  TeacherVirtualScreenId,
} from "./TeacherVirtualScreens";
import { signalingBridge } from "../utils/signalingBridge";

type FloatingSize = "small" | "medium" | "large";

// 교사 화면 플로팅 뷰어 컴포넌트 (가상 화면 기반)
const FloatingTeacherView: React.FC<{
  screenId: TeacherVirtualScreenId;
  size: FloatingSize;
  onSizeChange: (size: FloatingSize) => void;
  onClose: () => void;
}> = ({ screenId, size, onSizeChange, onClose }) => {
  const sizeStyle =
    size === "small"
      ? { width: 320, height: 180 }
      : size === "medium"
      ? { width: 480, height: 270 }
      : { width: 800, height: 450 };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        backgroundColor: "#000",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        zIndex: 9999,
        ...sizeStyle,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 8,
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "#fff",
          fontSize: 12,
        }}
      >
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => onSizeChange("small")}
            style={{
              padding: "4px 8px",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.3)",
              background: size === "small" ? "rgba(255,255,255,0.3)" : "transparent",
              color: "#fff",
              cursor: "pointer",
              fontSize: 11,
            }}
          >
            작게
          </button>
          <button
            onClick={() => onSizeChange("medium")}
            style={{
              padding: "4px 8px",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.3)",
              background: size === "medium" ? "rgba(255,255,255,0.3)" : "transparent",
              color: "#fff",
              cursor: "pointer",
              fontSize: 11,
            }}
          >
            중간
          </button>
          <button
            onClick={() => onSizeChange("large")}
            style={{
              padding: "4px 8px",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.3)",
              background: size === "large" ? "rgba(255,255,255,0.3)" : "transparent",
              color: "#fff",
              cursor: "pointer",
              fontSize: 11,
            }}
          >
            크게
          </button>
        </div>
        <button
          onClick={onClose}
          style={{
            padding: "4px 8px",
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.3)",
            background: "transparent",
            color: "#fff",
            cursor: "pointer",
            fontSize: 11,
          }}
        >
          닫기
        </button>
      </div>
      {/* 가상 화면 컴포넌트 렌더링 */}
      <div style={{ width: "100%", height: "calc(100% - 40px)", overflow: "hidden" }}>
        {TEACHER_VIRTUAL_SCREENS[screenId]}
      </div>
    </div>
  );
};

export const StudentPanel: React.FC = () => {
  // 모니터링: 내가 선생님에게 공유하는 상태
  const [isSharingToTeacher, setIsSharingToTeacher] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // 미러링: 선생님 화면을 내가 보는 상태
  const [teacherVirtualScreen, setTeacherVirtualScreen] =
    useState<TeacherVirtualScreenId | null>(null);
  const [floatingSize, setFloatingSize] = useState<FloatingSize>("small");

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // 교사 → 학생 "화면 요청" 시그널 수신
    const handleRequestStudentScreen = (msg: any) => {
      if (msg.type === "REQUEST_STUDENT_SCREEN" || msg.type === "share-request") {
        setIsShareModalOpen(true);
      }
    };

    signalingBridge.on("REQUEST_STUDENT_SCREEN", handleRequestStudentScreen);
    signalingBridge.on("share-request", handleRequestStudentScreen);

    // 교사 가상 화면 공유 시작
    const handleTeacherScreenShared = (msg: any) => {
      if (msg.type === "TEACHER_VIRTUAL_SCREEN_SHARED") {
        setTeacherVirtualScreen(msg.screenId);
        alert("선생님이 화면을 공유하기 시작했습니다.");
      }
    };

    // 교사 공유 종료
    const handleTeacherShareEnded = (msg: any) => {
      if (msg.type === "TEACHER_SHARE_ENDED") {
        setTeacherVirtualScreen(null);
        setMessage("교사의 화면 공유가 종료되었습니다.");
        setTimeout(() => setMessage(null), 5000);
      }
    };

    signalingBridge.on("TEACHER_VIRTUAL_SCREEN_SHARED", handleTeacherScreenShared);
    signalingBridge.on("TEACHER_SHARE_ENDED", handleTeacherShareEnded);

    return () => {
      signalingBridge.off("REQUEST_STUDENT_SCREEN", handleRequestStudentScreen);
      signalingBridge.off("share-request", handleRequestStudentScreen);
      signalingBridge.off("TEACHER_VIRTUAL_SCREEN_SHARED", handleTeacherScreenShared);
      signalingBridge.off("TEACHER_SHARE_ENDED", handleTeacherShareEnded);
    };
  }, []);

  // 모달에서 공유 확정 시
  const handleConfirmVirtualScreen = (screenId: VirtualScreenId) => {
    setIsSharingToTeacher(true); // 칩 노출용

    // 교사에게 가상 화면 ID 전송
    signalingBridge.send({
      type: "STUDENT_VIRTUAL_SCREEN_SHARED",
      screenId,
      from: "student",
    });
  };

  // 공유 중지
  const handleStopSharing = () => {
    setIsSharingToTeacher(false);
    signalingBridge.send({
      type: "STUDENT_SHARE_ENDED",
      from: "student",
    });
  };

  const handleCloseTeacherViewer = () => {
    setTeacherVirtualScreen(null);
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
      {/* 모니터링 모드 칩 */}
      <ShareChip
        visible={isSharingToTeacher}
        variant="student-monitoring"
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
        </div>
      )}

      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 24,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ margin: "0 0 16px 0", fontSize: 20, fontWeight: 600 }}>
          학생 패널
        </h2>

        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>모니터링 모드</h3>
          <p style={{ color: "#666", marginBottom: 12, fontSize: 14 }}>
            선생님이 화면 공유를 요청하면 허용할 수 있습니다.
          </p>
          {isSharingToTeacher && (
            <button
              onClick={handleStopSharing}
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

      {/* 화면 공유 모달 */}
      <StudentScreenShareModal
        open={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onConfirm={handleConfirmVirtualScreen}
      />

      {/* 미러링: 교사 화면 플로팅 뷰어 */}
      {teacherVirtualScreen && (
        <FloatingTeacherView
          screenId={teacherVirtualScreen}
          size={floatingSize}
          onSizeChange={setFloatingSize}
          onClose={handleCloseTeacherViewer}
        />
      )}
    </div>
  );
};
