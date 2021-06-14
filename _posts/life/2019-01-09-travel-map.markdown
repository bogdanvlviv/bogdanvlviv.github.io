---
layout: null
lang: "en"
title: "Travel map"
author: "bogdanvlviv"
date: 2019-01-09 19:11:00 +0200
categories: posts life
permalink: /:categories/:title.html
---

<div id="js-map">
</div>

<style>
  #js-map {
    height: 100%;
    width: 100%;
  }
</style>

<script>
  function initMap() {
    var map = new google.maps.Map(
      document.getElementById("js-map"),
      {
        center: {
          lat: 0,
          lng: 0
        },
        zoom: 1
      }
    );

    {%- for place in site.data.places-i-have-visited -%}
    new google.maps.Marker(
      {
        position: {
          lat: {{ place.latitude }},
          lng: {{ place.longitude }}
        },
        map: map,
        title: "{{ place.title }}",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "red",
          fillOpacity: 0.6,
          scale: 5,
          strokeColor: "white",
          strokeWeight: 1
        }
      }
    );
    {%- endfor -%}
  }
</script>

<script async defer src="https://maps.googleapis.com/maps/api/js?key={{ site.google_maps_key }}&callback=initMap">
</script>
