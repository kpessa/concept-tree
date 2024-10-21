<script lang="ts">
	import { page } from '$app/stores';
	import { Sheet, SheetContent } from '$lib/components/ui/sheet';
	import {
		Accordion,
		AccordionItem,
		AccordionTrigger,
		AccordionContent
	} from '$lib/components/ui/accordion';

	export let open = false;

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

	const initiallyExpandedItems = routes.map(route => route.title);
</script>

<Sheet bind:open>
	<SheetContent side="left" class="w-[300px] sm:w-[400px] z-[1000]">
		<nav class="flex flex-col space-y-4">
			<Accordion type="multiple" value={initiallyExpandedItems}>
				{#each routes as route}
					<AccordionItem value={route.title}>
						<AccordionTrigger>{route.title}</AccordionTrigger>
						<AccordionContent>
							<ul class="space-y-2">
								{#each route.items as item}
									<li>
										<a
											href={item.href}
											class="block p-2 hover:bg-gray-100 rounded {$page.url.pathname === item.href
												? 'bg-gray-200'
												: ''}"
											on:click={() => (open = false)}
										>
											{item.label}
										</a>
									</li>
								{/each}
							</ul>
						</AccordionContent>
					</AccordionItem>
				{/each}
			</Accordion>
		</nav>
	</SheetContent>
</Sheet>
