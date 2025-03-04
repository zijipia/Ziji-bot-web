import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FaSearch, FaPlay, FaHeart } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

export function SearchView({
	searchQuery,
	setSearchQuery,
	searchResults,
	searchHistory,
	handleSearch,
	handleSearchCancel,
	clearSearchHistory,
	handleHistoryClick,
	sendCommand,
	session,
}) {
	return (
		<div className='space-y-4'>
			<div className='relative'>
				<Input
					type='text'
					placeholder='Search for music...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onKeyPress={(event) => {
						if (event.key === "Enter") {
							return handleSearch();
						}
					}}
					className='pr-10'
				/>
				{searchResults.length <= 0 ?
					<Button
						size='sm'
						variant='ghost'
						className='absolute right-0 top-1/2 transform -translate-y-1/2'
						onClick={handleSearch}>
						<FaSearch className='h-4 w-4' />
					</Button>
				:	<Button
						size='sm'
						variant='ghost'
						className='absolute right-0 top-1/2 transform -translate-y-1/2'
						onClick={handleSearchCancel}>
						<FaXmark className='h-4 w-4' />
					</Button>
				}
			</div>

			{searchHistory.length > 0 && !searchResults.length && (
				<div className='space-y-2'>
					<div className='flex items-center justify-between'>
						<h4 className='text-sm font-medium'>Recent Searches</h4>
						<Button
							size='sm'
							variant='ghost'
							onClick={clearSearchHistory}>
							Clear History
						</Button>
					</div>
					<div className='flex flex-wrap gap-2'>
						{searchHistory.map((query, index) => (
							<Badge
								key={index}
								variant='secondary'
								className='cursor-pointer hover:bg-secondary/80'
								onClick={() => handleHistoryClick(query)}>
								{query}
							</Badge>
						))}
					</div>
				</div>
			)}
			<ScrollArea className='h-[550px] pr-4'>
				{searchResults.length > 0 && (
					<>
						<h3 className='text-lg font-semibold mb-4'>Search Results</h3>

						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							{searchResults.map((track, index) => (
								<Card
									key={index}
									className='backdrop-blur-sm bg-background/80 dark:bg-background/40 flex'>
									<img
										src={track.thumbnail || session.user?.image_url}
										alt={track.title}
										className='w-24 h-24 object-cover'
									/>
									<div className='flex-1 p-4'>
										<h4 className='font-medium line-clamp-1'>{track.title}</h4>
										<p className='text-sm text-muted-foreground'>
											{track.duration} - {track.artist || track.author}
										</p>
										<div className='flex gap-2 mt-2'>
											<Button
												size='sm'
												variant='ghost'
												onClick={() => sendCommand("play", { trackUrl: track.url })}>
												<FaPlay className='h-4 w-4' />
											</Button>
											<TooltipProvider>
												<Button
													size='sm'
													variant='ghost'>
													<Tooltip>
														<TooltipTrigger asChild>
															<FaHeart className='h-4 w-4' />
														</TooltipTrigger>
														<TooltipContent>Add to Favorites</TooltipContent>
													</Tooltip>
												</Button>
											</TooltipProvider>
										</div>
									</div>
								</Card>
							))}
						</div>
					</>
				)}
			</ScrollArea>
		</div>
	);
}
