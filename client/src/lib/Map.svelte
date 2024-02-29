<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { io } from '$lib/webSocketConnection.js';
    import 'leaflet/dist/leaflet.css';
    
    import type{ TrainLocation } from '../../../common/types/types'
    
    let map;
    let trainMarker;

    onMount(async () => {
       if (browser) {
         const L = await import('leaflet');
         map = L.map('map').setView([41.19, -8.68], 13);
   
         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
           attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
         }).addTo(map);
   
         // Example of adding a marker
        //  L.marker([41.5, -0.09]).addTo(map)
        //    .bindPopup('A sample marker.')
        //    .openPopup();

        io.on('trainUpdate', (data : TrainLocation) => {
          // const { latitude, longitude } : TrainLocation = data;
          // console.log('Train Update: ',latitude, longitude);
        });

        io.on('connect_error', (error) => {
          console.error('Connection error:', error);
        });
       }
       
    });
   </script>
   
   <div id="map" class="container"></div>

<style>
  .container{
    height: 600px;
    width: 80%;
  }
</style>