"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

export function useWebSocket() {
	const [connectionStatus, setConnectionStatus] = useState("Connecting");
	const [socket, setSocket] = useState(null);
	const [voiceChannel, setVoiceChannel] = useState(null);
	const [guildInfo, setGuildInfo] = useState(null);
	const [playerStats, setPlayerStats] = useState({
		currentTrack: null,
		playlist: [],
		isPlaying: false,
		volume: 50,
		duration: {
			current: 0,
			total: 0,
		},
		repeatMode: 0,
		shuffle: false,
	});

	const { data: session } = useSession();
	const { toast } = useToast();

	useEffect(() => {
		if (session?.accessToken) {
			const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

			const ws = new WebSocket(wsUrl);
			ws.onopen = () => {
				setConnectionStatus("Connected");
				setSocket(ws);
				ws.send(JSON.stringify({ event: "GetVoice", userID: session.user.id }));
			};

			ws.onmessage = (event) => {
				const data = JSON.parse(event.data);
				switch (data.event) {
					case "statistics":
						setPlayerStats((prev) => ({
							...prev,
							currentTrack: data.track,
							playlist: data.queue || [],
							isPlaying: !data.paused,
							volume: data.volume,
							duration: {
								current: data.timestamp?.current ?? 0,
								total: data.timestamp?.total ?? 0,
							},
							repeatMode: data.repeatMode,
							shuffle: data.shuffle,
						}));
						break;
					case "ReplyVoice":
						setVoiceChannel(data.channel);
						setGuildInfo(data.guild);
						break;
				}
			};

			ws.onclose = () => {
				setConnectionStatus("Disconnected");
			};

			ws.onerror = (error) => {
				console.error("WebSocket error:", error);
				setConnectionStatus("Error");
			};

			return () => ws.close();
		}
	}, [session]);

	// Update player progress
	useEffect(() => {
		let progressInterval = null;

		if (playerStats.isPlaying) {
			progressInterval = setInterval(() => {
				setPlayerStats((prev) => ({
					...prev,
					duration: {
						...prev.duration,
						current: Math.min(prev.duration.current + 1000, prev.duration.total),
					},
				}));
			}, 1000);
		}

		return () => {
			if (progressInterval) clearInterval(progressInterval);
		};
	}, [playerStats.isPlaying]);

	const sendCommand = useCallback(
		(command, payload = {}) => {
			if (socket?.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ event: command, userID: session?.user.id, ...payload }));
				toast({ title: "Command Sent", description: `Sent ${command} command` });
			} else {
				toast({ title: "Error", description: "Not connected to server", variant: "destructive" });
			}
		},
		[socket, session, toast],
	);

	const handleVolumeChange = useCallback((value) => {
		setPlayerStats((prev) => ({
			...prev,
			volume: value[0],
		}));
	}, []);

	const handleVolumeCommit = useCallback(
		(value) => {
			sendCommand("volume", { volume: value[0] });
		},
		[sendCommand],
	);

	return {
		connectionStatus,
		voiceChannel,
		guildInfo,
		playerStats,
		setPlayerStats,
		sendCommand,
		handleVolumeChange,
		handleVolumeCommit,
	};
}
