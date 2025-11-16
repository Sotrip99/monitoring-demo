import React from "react";

type ShareChipVariant = "student-monitoring" | "teacher-mirroring";

interface ShareChipProps {
  visible: boolean;
  variant: ShareChipVariant;
  onStopClick?: () => void; // teacher-mirroring일 때만 사용
}

export const ShareChip: React.FC<ShareChipProps> = ({
  visible,
  variant,
  onStopClick,
}) => {
  if (!visible) return null;

  const label =
    variant === "student-monitoring"
      ? "선생님과 실시간 화면 공유 중입니다."
      : "접속한 학생과 실시간 화면 공유 중입니다.";

  const showStopButton = variant === "teacher-mirroring";

  return (
    <div
      style={{
        position: "fixed",
        top: 8,
        left: "50%",
        transform: "translateX(-50%)",
        padding: "8px 16px",
        borderRadius: 999,
        background: "rgba(0,0,0,0.8)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 12,
        zIndex: 9999,
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      <span>{label}</span>
      {showStopButton && (
        <button
          onClick={onStopClick}
          style={{
            padding: "4px 12px",
            borderRadius: 999,
            border: "none",
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 500,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.2)";
          }}
        >
          공유 중지
        </button>
      )}
    </div>
  );
};

