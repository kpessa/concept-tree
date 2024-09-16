<script>
    import { onMount } from 'svelte';

    export let code = '';
    export let language = 'mongodb';

</script>

<pre><code class="language-{language}">{code}</code></pre>

<style>
    pre {
        padding: 1em;
        border-radius: 5px;
        background-color: #f5f5f5;
        word-wrap: break-word;
    }

    
</style>