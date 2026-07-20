"use client";

import { useEffect, useState } from "react";
import { useConnectionStore } from "@/store/useConnectionStore";
import { getTmdbPosterUrl, PosterSizeTier } from "@/utils/tmdbImage";

export function useAdaptivePosterUrl(
    posterPath: string | null | undefined,
    sizes: PosterSizeTier
): string {
    const isConfirmedFast = useConnectionStore((state) => state.connectionSpeed === "fast");
    const lowUrl = getTmdbPosterUrl(posterPath, sizes.low);
    const highUrl = getTmdbPosterUrl(posterPath, sizes.high);
    const targetUrl = isConfirmedFast ? highUrl : lowUrl;

    const [posterUrl, setPosterUrl] = useState(targetUrl);
    const [resolvedPath, setResolvedPath] = useState(posterPath);

    // The poster path itself changed (new movie card, or a different watchlist
    // item got selected) — jump straight to whichever size is already known to
    // be correct. Adjusting state during render (not in an effect) avoids ever
    // painting the previous movie's image under the new movie's info panel.
    if (posterPath !== resolvedPath) {
        setResolvedPath(posterPath);
        setPosterUrl(targetUrl);
    }

    // The connection was just confirmed fast while this same poster's low-res
    // image is already on screen — preload the high-res version and only swap
    // once it has fully loaded, so the upgrade is instant and never shows a
    // half-loaded image replacing the sharp low-res one.
    useEffect(() => {
        if (!isConfirmedFast || posterUrl === highUrl || !highUrl) return;
        let cancelled = false;
        const preload = new Image();
        preload.onload = () => {
            if (!cancelled) setPosterUrl(highUrl);
        };
        preload.src = highUrl;
        return () => {
            cancelled = true;
        };
    }, [isConfirmedFast, highUrl, posterUrl]);

    return posterUrl;
}
