<script lang="ts">
	import '../app.postcss';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { Menu } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';

	let isSidebarOpen = false;

	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}

	const routes = [
		{
			title: 'Concepts',
			items: [
				{ href: '/csv-processor', label: 'Import Concepts' },
				{ href: '/concepts', label: 'Concept Table' },
				{ href: '/tree', label: 'Concept Tree' },
				{ href: '/concept-examples', label: 'Concept Examples' }
			]
		},
		{
			title: 'Configs',
			items: [
				{ href: '/config-import', label: 'Import Configs' },
				{ href: '/config-graph', label: 'Config Graph' }
			]
		}
	];
</script>

<div class="flex flex-col min-h-screen">
	<header class="bg-gray-800 text-white p-4 fixed top-0 left-0 right-0 z-50">
		<div class="container mx-auto max-w-8xl flex justify-between items-center">
			<h1 class="text-xl font-bold">Concepts / Config Web App</h1>
			<div class="flex items-center space-x-4">
				<div class="hidden md:block">
					{#each routes as route}
						<DropdownMenu>
							<DropdownMenuTrigger>
								<Button variant="ghost">{route.title}</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{#each route.items as item}
									<DropdownMenuItem>
										<a href={item.href}>{item.label}</a>
									</DropdownMenuItem>
								{/each}
							</DropdownMenuContent>
						</DropdownMenu>
					{/each}
				</div>
				<Button variant="ghost" size="icon" on:click={toggleSidebar}>
					<Menu class="h-6 w-6" />
				</Button>
			</div>
		</div>
	</header>

	<div class="flex flex-grow pt-16">
		<aside class="fixed top-16 left-0 z-40 m-4">
			<Sidebar bind:open={isSidebarOpen} />
		</aside>

		<main class="flex-grow p-4 ml-16">
			<div class="container mx-auto max-w-8xl">
				<slot />
			</div>
		</main>
	</div>
</div>

<style>
	/* Add any additional styles here if needed */
</style>
