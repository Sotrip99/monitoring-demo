import React, { useState } from "react";
import { VirtualScreenId, VIRTUAL_SCREENS } from "./VirtualScreens";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (screenId: VirtualScreenId) => void;
}

export const StudentScreenShareModal: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [selected, setSelected] = useState<VirtualScreenId>("screen1");

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 800,
          background: "#fff",
          borderRadius: 8,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
          공유할 화면을 선택하세요
        </h3>
        {/* 크롬 화면 공유 창 느낌으로 타일 3개 */}
        <div style={{ display: "flex", gap: 12 }}>
          {(["screen1", "screen2", "screen3"] as VirtualScreenId[]).map(
            (id) => (
              <div
                key={id}
                onClick={() => setSelected(id)}
                style={{
                  flex: 1,
                  border:
                    selected === id
                      ? "2px solid #1976d2"
                      : "1px solid #ccc",
                  borderRadius: 4,
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (selected !== id) {
                    e.currentTarget.style.borderColor = "#1976d2";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selected !== id) {
                    e.currentTarget.style.borderColor = "#ccc";
                  }
                }}
              >
                <div style={{ height: 140 }}>{VIRTUAL_SCREENS[id]}</div>
                <div
                  style={{
                    padding: 8,
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: selected === id ? 600 : 400,
                  }}
                >
                  {id}
                </div>
              </div>
            )
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 8,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: 4,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            취소
          </button>
          <button
            onClick={() => {
              onConfirm(selected);
              onClose();
            }}
            style={{
              padding: "8px 16px",
              borderRadius: 4,
              border: "none",
              background: "#1976d2",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            공유
          </button>
        </div>
      </div>
    </div>
  );
};

