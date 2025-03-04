import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaMusic } from "react-icons/fa";

export function LyricsView({
	lyrics,
	parsedLyrics,
	currentLyricIndex,
	lyricsRef,
	handleLyrics,
	playerStats,
}) {
	return (
		<ScrollArea
			className='h-[600px] pr-4'
			ref={lyricsRef}>
			{lyrics.length > 0 ?
				<div className='ml-6'>
					<h3 className='text-lg font-semibold mb-2 text-center'>{lyrics[0].name}</h3>
					<h4 className='text-sm font-semibold mb-4 text-center'>{lyrics[0].artistName}</h4>

					{parsedLyrics.length > 0 ?
						<div className='space-y-2 text-lg'>
							{parsedLyrics.map((lyric, index) => (
								<div
									key={index}
									id={`lyric-${index}`}
									className={`py-1 transition-colors duration-300 ${
										index === currentLyricIndex ?
											"text-[hsl(var(--gradient-start))] dark:text-[hsl(var(--dark-gradient-start))] font-medium"
										:	""
									}`}>
									{lyric.text}
								</div>
							))}
						</div>
					:	<div className='whitespace-pre-line'>{lyrics[0].plainLyrics}</div>}
				</div>
			:	<div className='flex flex-col items-center justify-center h-[300px]'>
					<FaMusic className='h-12 w-12 mb-4 text-muted-foreground' />
					<p className='text-muted-foreground'>
						{playerStats.currentTrack ?
							"Click the lyrics button to load lyrics for the current track"
						:	"No track is currently playing"}
					</p>
					{playerStats.currentTrack && (
						<Button
							className='mt-4'
							onClick={handleLyrics}>
							Load Lyrics
						</Button>
					)}
				</div>
			}
		</ScrollArea>
	);
}
