<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { io } from '$lib/webSocketConnection.js';
  import 'leaflet/dist/leaflet.css';

  import type { LatLngExpression, Map, Marker } from 'leaflet';
  import { timeStore } from './store';

  interface TrainLocation {
    latitude: number;
    longitude: number;
    time?: number | string;
    date?: number;
  }

  let map: Map;
  let trainMarker: Marker;
  let pathCoordinates: [number, number][] = [];
  let fullJourney: [number, number][] = [];

  onMount(async () => {
    if (browser) {
      const L = await import('leaflet');
      map = L.map('map').setView([41.19, -8.68], 16);

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

      const storedFullJourney = localStorage.getItem('fullJourney');

      if (storedFullJourney) {
        fullJourney = JSON.parse(storedFullJourney);
        drawPolyline(fullJourney, '#0097e6', map);
      }

      io.on('trainJourney', (coords) => {
        const latLngs = coords.map((coord: TrainLocation) => [
          coord.latitude,
          coord.longitude,
        ]);
        fullJourney = latLngs;
        // Idealmente isto ficava em cache no redis ou uma solução parecida
        localStorage.setItem('fullJourney', JSON.stringify(fullJourney));
        drawPolyline(fullJourney, '#0097e6', map);
      });

      io.on('trainUpdate', (data: TrainLocation) => {
        if (data) {
          updateMarkerPosition(data, trainMarker, map);
          // Desenha a linha do percurso
          drawPolyline(pathCoordinates, 'blue', map);
        }
      });

      io.on('resetPath', () => {
        resetLines();
      });

      io.on('disconnect', () => {
        console.log('Disconnected');
        resetLines();
      });

      io.on('connect_error', (error) => {
        console.error('Connection error:', error);
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

      function drawPolyline(data: LatLngExpression[], color: string, map: Map) {
        L.polyline(data, { color }).addTo(map);
      }

      function resetLines() {
        // Limpar as coordenadas da polyline
        pathCoordinates = [];

        if (map) {
          // Remover a polyline existente do mapa
          map.eachLayer((layer) => {
            if (layer instanceof L.Polyline) {
              map.removeLayer(layer);
            }
          });
        }
      }
    }
  });
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
