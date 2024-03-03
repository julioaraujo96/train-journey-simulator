<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { io } from '$lib/webSocketConnection.js';
  import 'leaflet/dist/leaflet.css';

  import type { TrainLocation } from '../../../common/types/types';
  import type { Map, Marker } from 'leaflet';
  import { timeStore } from './store';

  let map: Map;
  let trainMarker: Marker;
  let pathCoordinates: [number, number][] = [];

  onMount(async () => {
    if (browser) {
      const L = await import('leaflet');
      map = L.map('map').setView([41.19, -8.68], 18);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      trainMarker = L.marker([0, 0]).addTo(map);
      trainMarker.setIcon(
        L.icon({
          iconUrl: '/marker.png',
          iconSize: [32, 50],
        })
      );

      io.on('trainUpdate', (data: TrainLocation) => {
        if (data) {
          console.log('Updating train location');
          updateMarkerPosition(data, trainMarker, map);
          // Desenha a linha do percurso
          L.polyline(pathCoordinates, { color: 'blue' }).addTo(map);
        }
      });

      io.on('resetPath', () => {
        pathCoordinates = [];
      });

      io.on('disconnect', () => {
        console.log('Disconnected');
        // Limpar as coordenadas da polyline
        pathCoordinates = [];
        // Remover a polyline existente do mapa
        if (map) {
          map.eachLayer((layer) => {
            if (layer instanceof L.Polyline) {
              map.removeLayer(layer);
            }
          });
        }
      });

      io.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });
    }
  });

  function updateMarkerPosition(
    data: TrainLocation,
    trainMarker: Marker,
    map: Map
  ) {
    const currentZoom = map.getZoom();
    const { latitude, longitude, time }: TrainLocation = data;

    if (time) {
      timeStore.set(time.toString());
    }

    // Atualiza a posição do marker
    trainMarker.setLatLng([latitude, longitude]);

    // Adiciona a nova coordenada à lista de coordenadas
    pathCoordinates.push([latitude, longitude]);

    map.setView([latitude, longitude], currentZoom); // Ajustar a view
  }
</script>

<div id="map" class="container"></div>
{#if !map}
 <div class="error-message">De momento não foi possível carregar o mapa..</div>
{/if}

<style>
  .container {
    height: 600px;
    width: 100%;
  }
</style>
