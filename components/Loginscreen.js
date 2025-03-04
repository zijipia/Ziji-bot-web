"use client";

import { LoginButton } from "./login-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCallback, useEffect, useState } from "react";

export function LoginScreen() {
	const [searchResults, setSearchResults] = useState([]);

	useEffect(() => {
		handleSearch();
		return;
	}, []);

	const handleSearch = useCallback(async () => {
		try {
			const searchUrl = `${
				process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_WEBSOCKET_URL
			}/`;
			const proxyUrl = `/api/proxy?url=${encodeURIComponent(searchUrl)}`;

			const response = await fetch(proxyUrl);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Search failed");
			}

			const data = await response.json();
			setSearchResults(data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}, []);

	return (
		<div className='min-h-screen flex items-center justify-center gap-6 p-6'>
			<div className='text-center'>
				<div className='justify-items-center mb-5'>
					<Avatar className='size-[100px]'>
						<AvatarImage
							src={searchResults?.avatars}
							alt={searchResults?.clientName}
						/>
						<AvatarFallback>{searchResults?.clientName?.[0]}</AvatarFallback>
					</Avatar>
				</div>
				<h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-5'>
					Welcome to {searchResults?.clientName || "Ziji Bot"} controller
				</h1>
				<p className='mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mb-5'>
					Enhance your Discord server with moderation, fun commands, and powerful integrations.
				</p>
				<div className='flex justify-center mb-5'>
					<LoginButton />
				</div>
			</div>
		</div>
	);
}
