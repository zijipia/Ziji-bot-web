"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loading from "./Loading";
import { LoginScreen } from "./Loginscreen";

// Import custom hooks
import { useWebSocket } from "@/hooks/use-websocket";
import { useSearch } from "@/hooks/use-search";
import { useLyrics } from "@/hooks/use-lyrics";
import { useShareUtils } from "@/utils/share-utils";

// Import UI components
import { PlayerControls } from "@/components/music/player-controls";
import { QueueView } from "@/components/music/queue-view";
import { SearchView } from "@/components/music/search-view";
import { LyricsView } from "@/components/music/lyrics-view";

export function MusicController() {
	const { data: session, status } = useSession();

	// Use custom hooks
	const {
		connectionStatus,
		voiceChannel,
		guildInfo,
		playerStats,
		sendCommand,
		handleVolumeChange,
		handleVolumeCommit,
	} = useWebSocket();

	const {
		searchQuery,
		setSearchQuery,
		searchResults,
		searchHistory,
		handleSearch,
		handleSearchCancel,
		clearSearchHistory,
		handleHistoryClick,
	} = useSearch();

	const { lyrics, parsedLyrics, currentLyricIndex, lyricsRef, handleLyrics } = useLyrics(
		playerStats.currentTrack,
		playerStats.duration.current,
	);

	const { handleShare } = useShareUtils();

	if (status === "loading") {
		return <Loading />;
	}

	if (!session) {
		return <LoginScreen />;
	}

	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-6 p-6'>
			<div
				className={
					playerStats.currentTrack ? "md:col-span-2 space-y-6" : "md:col-span-3 space-y-6"
				}>
				<Tabs
					defaultValue='queue'
					className='w-full'>
					<div className='rounded-2xl p-px bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] dark:from-[hsl(var(--dark-gradient-start))] dark:to-[hsl(var(--dark-gradient-end))] mb-4'>
						<TabsList className='grid w-full grid-cols-3  rounded-[calc(1.0rem-1px)] bg-slate-50 dark:bg-slate-950'>
							<TabsTrigger value='queue'>Queue</TabsTrigger>
							<TabsTrigger value='search'>Search</TabsTrigger>
							<TabsTrigger value='lyrics'>Lyrics</TabsTrigger>
						</TabsList>
					</div>
					<div className='rounded-2xl p-px bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] dark:from-[hsl(var(--dark-gradient-start))] dark:to-[hsl(var(--dark-gradient-end))]'>
						<Card className='rounded-[calc(1.0rem-1px)] bg-slate-50 dark:bg-slate-950 h-[700px]'>
							<CardContent className='p-6'>
								<TabsContent
									value='queue'
									className='h-full'>
									<QueueView
										playerStats={playerStats}
										guildInfo={guildInfo}
										sendCommand={sendCommand}
										handleShare={handleShare}
										session={session}
									/>
								</TabsContent>

								<TabsContent
									value='search'
									className='h-full'>
									<SearchView
										searchQuery={searchQuery}
										setSearchQuery={setSearchQuery}
										searchResults={searchResults}
										searchHistory={searchHistory}
										handleSearch={handleSearch}
										handleSearchCancel={handleSearchCancel}
										clearSearchHistory={clearSearchHistory}
										handleHistoryClick={handleHistoryClick}
										sendCommand={sendCommand}
										session={session}
									/>
								</TabsContent>

								<TabsContent
									value='lyrics'
									className='h-full'>
									<LyricsView
										lyrics={lyrics}
										parsedLyrics={parsedLyrics}
										currentLyricIndex={currentLyricIndex}
										lyricsRef={lyricsRef}
										handleLyrics={handleLyrics}
										playerStats={playerStats}
									/>
								</TabsContent>
							</CardContent>
						</Card>
					</div>
				</Tabs>
			</div>

			{playerStats.currentTrack && (
				<PlayerControls
					playerStats={playerStats}
					connectionStatus={connectionStatus}
					voiceChannel={voiceChannel}
					sendCommand={sendCommand}
					handleVolumeChange={handleVolumeChange}
					handleVolumeCommit={handleVolumeCommit}
					handleLyrics={handleLyrics}
					session={session}
				/>
			)}
		</div>
	);
}
