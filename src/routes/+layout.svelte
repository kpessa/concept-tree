<script>
	import '../app.postcss';
</script>

<nav class="bg-gray-800 p-4">
	<div class="container mx-auto flex justify-between items-center">
		<div class="text-white font-bold text-xl">Concepts Web App</div>
		<ul class="flex space-x-4">
			<li><a href="/" class="text-white hover:text-gray-300">Home</a></li>
			<li><a href="/csv-processor" class="text-white hover:text-gray-300">Data Import</a></li>
			<li><a href="/tree" class="text-white hover:text-gray-300">Tree Visualization</a></li>
			<li><a href="/concepts" class="text-white hover:text-gray-300">Concept Table</a></li>
			<li><a href="/concept-examples" class="text-white hover:text-gray-300">Concept Examples</a></li>
		</ul>
	</div>
</nav>

<main class="container mx-auto mt-8">
	<slot />
</main>