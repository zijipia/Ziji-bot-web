import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
	FaPlay,
	FaPause,
	FaStepForward,
	FaStepBackward,
	FaVolumeUp,
	FaRandom,
	FaRedo,
	FaMusic,
} from "react-icons/fa";
import { formatTime } from "@/utils/format-time";

export function PlayerControls({
	playerStats,
	connectionStatus,
	voiceChannel,
	sendCommand,
	handleVolumeChange,
	handleVolumeCommit,
	handleLyrics,
	session,
}) {
	if (!playerStats.currentTrack) return null;

	return (
		<div className='md:col-span-1'>
			<div className='rounded-2xl p-px bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] dark:from-[hsl(var(--dark-gradient-start))] dark:to-[hsl(var(--dark-gradient-end))]'>
				<Card className='rounded-[calc(1.0rem-1px)] bg-slate-50 dark:bg-slate-950 h-[750px]'>
					<CardHeader>
						<CardTitle>
							Now Playing {voiceChannel && `in ${voiceChannel.name}`}
							<Badge
								variant={connectionStatus === "Connected" ? "success" : "destructive"}
								className='ml-3'>
								{connectionStatus}
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-6'>
							<div className='relative rounded-lg overflow-hidden'>
								<img
									src={playerStats.currentTrack.thumbnail || session.user?.image_url}
									alt={playerStats.currentTrack.title}
									className='object-cover w-full h-full max-h-96'
								/>
							</div>

							<div className='space-y-2 text-center'>
								<h3 className='font-semibold line-clamp-1'>{playerStats.currentTrack.title}</h3>
								<p className='text-sm text-muted-foreground'>
									{formatTime(playerStats.duration.current)} /{" "}
									{formatTime(playerStats.duration.total)}
								</p>
							</div>

							<Progress value={(playerStats.duration.current / playerStats.duration.total) * 100} />

							<div className='flex justify-center items-center gap-4'>
								<Button
									variant='ghost'
									size='icon'
									onClick={() => sendCommand("back")}>
									<FaStepBackward className='h-4 w-4' />
								</Button>
								<Button
									variant='default'
									size='icon'
									onClick={() => sendCommand("pause")}>
									{playerStats.isPlaying ?
										<FaPause className='h-4 w-4' />
									:	<FaPlay className='h-4 w-4' />}
								</Button>
								<Button
									variant='ghost'
									size='icon'
									onClick={() => sendCommand("skip")}>
									<FaStepForward className='h-4 w-4' />
								</Button>
							</div>

							<div className='space-y-2'>
								<div className='flex items-center gap-2'>
									<FaVolumeUp className='h-4 w-4' />
									<Slider
										value={[playerStats.volume]}
										onValueChange={handleVolumeChange}
										onValueCommit={handleVolumeCommit}
										max={100}
										step={1}
									/>
								</div>
							</div>

							<div className='flex justify-center gap-2'>
								<Button
									variant={playerStats.shuffle ? "default" : "ghost"}
									size='icon'
									onClick={() => sendCommand("shuffle")}>
									<FaRandom className='h-4 w-4' />
								</Button>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant={playerStats.repeatMode !== 0 ? "default" : "ghost"}
												size='icon'
												onClick={() =>
													sendCommand("loop", { mode: (playerStats.repeatMode + 1) % 4 })
												}>
												<FaRedo className='h-4 w-4' />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											{playerStats.repeatMode === 0 && "Loop: Off"}
											{playerStats.repeatMode === 1 && "Loop: Track"}
											{playerStats.repeatMode === 2 && "Loop: Queue"}
											{playerStats.repeatMode === 3 && "Loop: AutoPlay"}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								<Button
									variant='ghost'
									size='icon'
									onClick={handleLyrics}>
									<FaMusic className='h-4 w-4' />
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
