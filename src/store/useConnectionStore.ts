import { create } from "zustand";

export type ConnectionSpeed = "unknown" | "slow" | "fast";

interface ConnectionStore {
    connectionSpeed: ConnectionSpeed;
    setConnectionSpeed: (speed: ConnectionSpeed) => void;
}

export const useConnectionStore = create<ConnectionStore>((set) => ({
    connectionSpeed: "unknown",
    setConnectionSpeed: (speed) => set({ connectionSpeed: speed }),
}));
