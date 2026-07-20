"use client";

import { useEffect } from "react";
import { useConnectionStore } from "@/store/useConnectionStore";

const SLOW_THRESHOLD_KBPS = 1000; // ~1 Mbps cutoff

export function ConnectionSpeedProbe() {
    const setConnectionSpeed = useConnectionStore((state) => state.setConnectionSpeed);

    useEffect(() => {
        const start = performance.now();

        fetch(`/network-speed-test.bin?cb=${Date.now()}`, { cache: "no-store" })
            .then((res) => res.blob())
            .then((blob) => {
                const seconds = (performance.now() - start) / 1000;
                const kbps = (blob.size * 8) / seconds / 1000;
                setConnectionSpeed(kbps < SLOW_THRESHOLD_KBPS ? "slow" : "fast");
            })
            .catch(() => setConnectionSpeed("fast"));
    }, [setConnectionSpeed]);

    return null;
}
