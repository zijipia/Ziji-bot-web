"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export function useLyrics(currentTrack, currentTime) {
	const [lyrics, setLyrics] = useState([]);
	const [parsedLyrics, setParsedLyrics] = useState([]);
	const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
	const lyricsRef = useRef(null);
	const { toast } = useToast();

	useEffect(() => {
		if (lyrics.length > 0 && lyrics[0].syncedLyrics) {
			const syncedLyrics = lyrics[0].syncedLyrics;
			const parsed = parseSyncedLyrics(syncedLyrics);
			setParsedLyrics(parsed);
		} else {
			setParsedLyrics([]);
		}
	}, [lyrics]);

	useEffect(() => {
		if (parsedLyrics.length > 0 && currentTime > 0) {
			let index = -1;
			for (let i = 0; i < parsedLyrics.length; i++) {
				if (
					i === parsedLyrics.length - 1 ||
					(currentTime >= parsedLyrics[i].time && currentTime < parsedLyrics[i + 1].time)
				) {
					index = i;
					break;
				}
			}

			if (index !== currentLyricIndex) {
				setCurrentLyricIndex(index);

				if (index >= 0 && lyricsRef.current) {
					const lyricElement = document.getElementById(`lyric-${index}`);
					if (lyricElement) {
						lyricElement.scrollIntoView({ behavior: "smooth", block: "center" });
					}
				}
			}
		}
	}, [currentTime, parsedLyrics, currentLyricIndex]);

	const parseSyncedLyrics = (syncedLyrics) => {
		if (!syncedLyrics) return [];

		const lines = syncedLyrics.split("\n");
		const parsed = [];

		for (const line of lines) {
			const match = line.match(/\[(\d+):(\d+)\.(\d+)\]\s*(.*)/);
			if (match) {
				const minutes = Number.parseInt(match[1]);
				const seconds = Number.parseInt(match[2]);
				const milliseconds = Number.parseInt(match[3]);
				const text = match[4];

				const timeInMs = minutes * 60 * 1000 + seconds * 1000 + milliseconds * 10;
				parsed.push({
					time: timeInMs,
					text: text,
				});
			}
		}

		return parsed.sort((a, b) => a.time - b.time);
	};

	const handleLyrics = useCallback(async () => {
		if (!currentTrack) return;

		try {
			const searchUrl = `${
				process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_WEBSOCKET_URL
			}/api/lyrics?query=${encodeURIComponent(currentTrack.title)}`;
			const proxyUrl = `/api/proxy?url=${encodeURIComponent(searchUrl)}`;
			const response = await fetch(proxyUrl);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Search failed");
			}

			const data = await response.json();
			if (!data.length) {
				toast({
					title: "No lyrics found",
					description: "No lyrics were found for this track.",
					variant: "destructive",
				});
				return;
			}

			setLyrics(data);

			const lyricsTab = document.querySelector('[data-state="inactive"][value="lyrics"]');
			if (lyricsTab) {
				lyricsTab.click();
			}
		} catch (error) {
			console.error("Lyrics error:", error);
			toast({
				title: "Error",
				description: "Failed to fetch lyrics. Please try again.",
				variant: "destructive",
			});
		}
	}, [currentTrack, toast]);

	return {
		lyrics,
		parsedLyrics,
		currentLyricIndex,
		lyricsRef,
		handleLyrics,
	};
}
