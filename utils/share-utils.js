"use client";

import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export function useShareUtils() {
	const { toast } = useToast();

	const handleShare = useCallback(
		(platform, track) => {
			const shareText = `Check out this track: ${track.title} by ${track.artist || track.author}`;
			const shareUrl = track.url;
			let shareLink;

			switch (platform) {
				case "facebook":
					shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
					break;
				case "twitter":
					shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${shareUrl}`;
					break;
				case "whatsapp":
					shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + " " + decodeURIComponent(shareUrl))}`;
					break;
				case "copy":
					navigator.clipboard.writeText(`${decodeURIComponent(shareUrl)}`);
					toast({ title: "Link Copied", description: "Track link copied to clipboard" });
					return;
				default:
					return;
			}

			window.open(shareLink, "_blank");
		},
		[toast],
	);

	return { handleShare };
}
