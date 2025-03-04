"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export function useSearch() {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searchHistory, setSearchHistory] = useState([]);
	const { toast } = useToast();

	useEffect(() => {
		const savedHistory = localStorage.getItem("searchHistory");
		if (savedHistory) {
			setSearchHistory(JSON.parse(savedHistory));
		}
	}, []);

	const handleSearch = useCallback(async () => {
		if (!searchQuery.trim()) return;

		try {
			const searchUrl = `${
				process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_WEBSOCKET_URL
			}/api/search?query=${encodeURIComponent(searchQuery)}`;
			const proxyUrl = `/api/proxy?url=${encodeURIComponent(searchUrl)}`;

			const response = await fetch(proxyUrl);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Search failed");
			}

			const data = await response.json();
			setSearchResults(data);

			const newHistory = [searchQuery, ...searchHistory.filter((q) => q !== searchQuery)].slice(
				0,
				5,
			);
			setSearchHistory(newHistory);
			localStorage.setItem("searchHistory", JSON.stringify(newHistory));
		} catch (error) {
			console.error("Search error:", error);
			toast({
				title: "Search Error",
				description: error.message || "Failed to perform search. Please try again.",
				variant: "destructive",
			});
		}
	}, [searchQuery, searchHistory, toast]);

	const handleSearchCancel = useCallback(() => {
		setSearchResults([]);
	}, []);

	const clearSearchHistory = useCallback(() => {
		setSearchHistory([]);
		localStorage.removeItem("searchHistory");
		toast({
			title: "Search History Cleared",
			description: "Your search history has been cleared.",
		});
	}, [toast]);

	const handleHistoryClick = useCallback(
		(query) => {
			setSearchQuery(query);

			const doSearch = async (q) => {
				try {
					const searchUrl = `${
						process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_WEBSOCKET_URL
					}/api/search?query=${encodeURIComponent(q)}`;
					const proxyUrl = `/api/proxy?url=${encodeURIComponent(searchUrl)}`;

					const response = await fetch(proxyUrl);

					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.error || "Search failed");
					}

					const data = await response.json();
					setSearchResults(data);

					const newHistory = [q, ...searchHistory.filter((item) => item !== q)].slice(0, 5);
					setSearchHistory(newHistory);
					localStorage.setItem("searchHistory", JSON.stringify(newHistory));
				} catch (error) {
					console.error("Search error:", error);
					toast({
						title: "Search Error",
						description: error.message || "Failed to perform search. Please try again.",
						variant: "destructive",
					});
				}
			};

			doSearch(query);
		},
		[searchHistory, toast],
	);

	return {
		searchQuery,
		setSearchQuery,
		searchResults,
		searchHistory,
		handleSearch,
		handleSearchCancel,
		clearSearchHistory,
		handleHistoryClick,
	};
}
