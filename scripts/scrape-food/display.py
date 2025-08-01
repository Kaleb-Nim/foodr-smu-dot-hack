#!/usr/bin/env python3
import requests
import geocoder
import folium
from folium.plugins import MarkerCluster
import math
import webbrowser
import os

# Maximum number of results to display
RESULT_LIMIT = 50
# Radius in meters to search around current location
SEARCH_RADIUS = 1000
# Output HTML file
MAP_FILE = 'interactive_map.html'


def get_my_location():
    """Get latitude and longitude based on public IP."""
    g = geocoder.ip('me')
    if not g.ok:
        raise RuntimeError("Could not determine location from IP")
    return g.latlng  # [lat, lng]


def haversine(lat1, lon1, lat2, lon2):
    """Calculate distance (m) between two lat/lon points."""
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda/2)**2
    return 6371000 * (2 * math.atan2(math.sqrt(a), math.sqrt(1-a)))


def find_food_places(lat, lng, radius=SEARCH_RADIUS):
    """Fetch food amenities from Overpass API; filter out unnamed."""
    query = f"""
    [out:json][timeout:25];
    (
      node["amenity"~"restaurant|cafe|fast_food|bar"](around:{radius},{lat},{lng});
    );
    out body;
    """
    resp = requests.post('https://overpass-api.de/api/interpreter', data=query.strip())
    resp.raise_for_status()
    data = resp.json().get('elements', [])
    places = []
    for el in data:
        tags = el.get('tags', {})
        name = tags.get('name')
        if not name:
            continue
        lat2, lon2 = el.get('lat'), el.get('lon')
        dist = haversine(lat, lng, lat2, lon2)
        places.append({
            'name': name,
            'amenity': tags.get('amenity', 'unknown'),
            'lat': lat2,
            'lon': lon2,
            'distance': dist
        })
    return sorted(places, key=lambda x: x['distance'])[:RESULT_LIMIT]


def create_interactive_map(lat, lng, places, map_file=MAP_FILE):
    """Build and save an interactive Folium map with popups."""
    m = folium.Map(location=[lat, lng], zoom_start=15)
    # Cluster for readability
    cluster = MarkerCluster().add_to(m)
    # Add user location marker
    folium.CircleMarker(
        location=[lat, lng],
        radius=6,
        color='blue',
        fill=True,
        fill_opacity=0.7,
        popup='You are here'
    ).add_to(m)
    # Add food places
    for p in places:
        popup_html = (
            f"<b>{p['name']}</b><br>"
            f"Type: {p['amenity']}<br>"
            f"Distance: {p['distance']:.1f} m"
        )
        folium.Marker(
            location=[p['lat'], p['lon']],
            popup=folium.Popup(popup_html, max_width=250),
            icon=folium.Icon(icon='cutlery', prefix='fa')
        ).add_to(cluster)
    # Save and open
    m.save(map_file)
    print(f"Interactive map saved to {map_file}")
    try:
        webbrowser.open('file://' + os.path.realpath(map_file))
    except:
        print("Open the HTML file manually to view the map.")


def main():
    lat, lng = get_my_location()
    print(f"Your approximate location: {lat:.5f}, {lng:.5f}")
    places = find_food_places(lat, lng)
    if not places:
        print("No named food places found within radius.")
        return
    print(f"Found {len(places)} places; generating interactive map...")
    create_interactive_map(lat, lng, places)


if __name__ == '__main__':
    main()
