<script lang="ts">
    import Map from '$lib/Map.svelte';
    import { timeStore } from '$lib/store';
</script>
<main class="container">
    <h1>Train Journey</h1>
    <Map />
    <p>{$timeStore}</p>
</main>

<style lang="scss">
    :global(body) {
        background-color: #ecf0f1;
        font-family: 'Montserrat';
        color: 268b4f;
    }

    .container{
        padding: 32px;
        h1{
            color: #268b4f;
        }
    }
</style>