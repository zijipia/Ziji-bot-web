"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Paintbrush } from "lucide-react";
import { useEffect } from "react";

const themes = [
	{
		name: "Zinc",
		class: "theme-zinc",
		color: "bg-zinc-500",
	},
	{
		name: "Red",
		class: "theme-red",
		color: "bg-red-500",
	},
	{
		name: "Rose",
		class: "theme-rose",
		color: "bg-pink-500",
	},
	{
		name: "Orange",
		class: "theme-orange",
		color: "bg-orange-500",
	},
	{
		name: "Green",
		class: "theme-green",
		color: "bg-green-500",
	},
	{
		name: "Blue",
		class: "theme-blue",
		color: "bg-blue-500",
	},
	{
		name: "Yellow",
		class: "theme-yellow",
		color: "bg-yellow-500",
	},
	{
		name: "Violet",
		class: "theme-violet",
		color: "bg-violet-500",
	},
];

export function ColorTheme() {
	useEffect(() => {
		// Load Theme history from localStorage when component mounts
		const savedHistory = localStorage.getItem("ColorTheme");
		if (savedHistory) {
			setTheme(JSON.parse(savedHistory));
		}
	}, []);

	const setTheme = (theme) => {
		const root = document.documentElement;
		themes.forEach((t) => {
			root.classList.remove(t.class);
		});
		root.classList.add(theme);
		// Add to Theme history
		localStorage.setItem("ColorTheme", JSON.stringify(theme));
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='outline'
					size='icon'>
					<Paintbrush className='h-[1.2rem] w-[1.2rem]' />
					<span className='sr-only'>Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				{themes.map((theme) => (
					<DropdownMenuItem
						key={theme.name}
						onClick={() => setTheme(theme.class)}
						className='flex items-center gap-2'>
						<div className={cn("h-4 w-4 rounded", theme.color)} />
						{theme.name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
