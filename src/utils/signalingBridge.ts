// 같은 페이지 내에서 두 패널 간 시그널링을 위한 브릿지
// 실제 환경에서는 WebSocket 서버를 통해 시그널링해야 함

import { VirtualScreenId } from "../components/VirtualScreens";
import { TeacherVirtualScreenId } from "../components/TeacherVirtualScreens";

type SignalingMessage = 
  | { type: "offer"; offer: RTCSessionDescriptionInit; from: "teacher" | "student" }
  | { type: "answer"; answer: RTCSessionDescriptionInit; from: "teacher" | "student" }
  | { type: "ice-candidate"; candidate: RTCIceCandidateInit; from: "teacher" | "student" }
  | { type: "share-request"; from: "teacher" }
  | { type: "REQUEST_STUDENT_SCREEN"; from: "teacher" }
  | { type: "STUDENT_VIRTUAL_SCREEN_SHARED"; screenId: VirtualScreenId; from: "student" }
  | { type: "STUDENT_SHARE_ENDED"; from: "student" }
  | { type: "TEACHER_VIRTUAL_SCREEN_SHARED"; screenId: TeacherVirtualScreenId; from: "teacher" }
  | { type: "TEACHER_SHARE_ENDED"; from: "teacher" };

class SignalingBridge {
  private listeners: Map<string, Set<(message: SignalingMessage) => void>> = new Map();

  constructor() {
    // window 이벤트 리스너로 다른 컴포넌트와 통신
    if (typeof window !== "undefined") {
      window.addEventListener("webrtc-signaling", ((e: CustomEvent<SignalingMessage>) => {
        const message = e.detail;
        // 모든 타입의 리스너에게 전달
        this.listeners.forEach((listenerSet, type) => {
          if (type === message.type || type === "*") {
            listenerSet.forEach((listener) => listener(message));
          }
        });
      }) as EventListener);
    }
  }

  send(message: SignalingMessage) {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("webrtc-signaling", { detail: message });
      window.dispatchEvent(event);
    }
  }

  on(messageType: string, callback: (message: SignalingMessage) => void) {
    if (!this.listeners.has(messageType)) {
      this.listeners.set(messageType, new Set());
    }
    this.listeners.get(messageType)!.add(callback);
  }

  off(messageType: string, callback: (message: SignalingMessage) => void) {
    const listeners = this.listeners.get(messageType);
    if (listeners) {
      listeners.delete(callback);
    }
  }
}

// 싱글톤 인스턴스
export const signalingBridge = new SignalingBridge();

