import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	FaPlay,
	FaTrash,
	FaShareAlt,
	FaFacebook,
	FaTwitter,
	FaWhatsapp,
	FaLink,
} from "react-icons/fa";

export function QueueView({ playerStats, guildInfo, sendCommand, handleShare, session }) {
	return (
		<>
			<h3 className='text-lg font-semibold mb-4 text-center'>Queue in {guildInfo?.name}</h3>
			{!playerStats.playlist.length && (
				<div className='flex justify-center items-center h-[200px]'>
					Không có bài hát nào trong hàng đợi
				</div>
			)}
			<ScrollArea className='h-[600px] pr-4'>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto'>
					{playerStats.playlist.map((track, index) => (
						<Card
							key={index}
							className='overflow-hidden'>
							<CardContent className='p-0'>
								<img
									src={track.thumbnail || session.user?.image_url}
									alt={track.title}
									className='w-full h-32 object-cover'
								/>
							</CardContent>
							<CardHeader className='p-4'>
								<CardTitle className='text-sm line-clamp-1'>{track.title}</CardTitle>
								<CardDescription className='text-xs'>
									<h4 className='font-medium line-clamp-1'>{track.artist || track.author}</h4>
									{track.duration}
								</CardDescription>
							</CardHeader>
							<CardFooter className='p-4 flex justify-between'>
								<Button
									variant='ghost'
									size='icon'
									onClick={() =>
										sendCommand("Playnext", {
											TrackPosition: index + 1,
											trackUrl: track.url,
										})
									}>
									<FaPlay className='h-4 w-4' />
								</Button>
								<div className='flex gap-2'>
									<TooltipProvider>
										<Button
											variant='ghost'
											size='icon'
											onClick={() => sendCommand("DelTrack", { TrackPosition: index + 1 })}>
											<Tooltip>
												<TooltipTrigger asChild>
													<FaTrash className='h-4 w-4' />
												</TooltipTrigger>
												<TooltipContent>Remove from Queue</TooltipContent>
											</Tooltip>
										</Button>
									</TooltipProvider>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant='ghost'
												size='icon'>
												<FaShareAlt className='h-4 w-4' />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<DropdownMenuItem onClick={() => handleShare("facebook", track)}>
												<FaFacebook className='mr-2 h-4 w-4' /> Facebook
											</DropdownMenuItem>
											<DropdownMenuItem onClick={() => handleShare("twitter", track)}>
												<FaTwitter className='mr-2 h-4 w-4' /> Twitter
											</DropdownMenuItem>
											<DropdownMenuItem onClick={() => handleShare("whatsapp", track)}>
												<FaWhatsapp className='mr-2 h-4 w-4' /> WhatsApp
											</DropdownMenuItem>
											<DropdownMenuItem onClick={() => handleShare("copy", track)}>
												<FaLink className='mr-2 h-4 w-4' /> Copy Link
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</CardFooter>
						</Card>
					))}
				</div>
			</ScrollArea>
		</>
	);
}
