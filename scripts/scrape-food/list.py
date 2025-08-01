#!/usr/bin/env python3
import requests
import geocoder
import math

# Maximum number of results to display
RESULT_LIMIT = 50

# Radius in meters to search around current location
SEARCH_RADIUS = 1000

def get_my_location():
    """Get latitude and longitude based on public IP."""
    g = geocoder.ip('me')
    if not g.ok:
        raise RuntimeError("Could not determine location from IP")
    return g.latlng  # [lat, lng]


def haversine(lat1, lon1, lat2, lon2):
    """
    Calculate the great-circle distance between two points on the Earth
    using the Haversine formula. Returns distance in meters.
    """
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)

    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return 6371000 * c  # Earth radius in meters


def find_food_places(lat, lng, radius=SEARCH_RADIUS):
    """
    Query Overpass API for food-related amenities within radius (meters).
    Returns a list of dicts with 'name', 'amenity', 'lat', 'lon'.
    Filters out entries without a name.
    """
    query = f"""
    [out:json][timeout:25];
    (
      node["amenity"~"restaurant|cafe|fast_food|bar"](around:{radius},{lat},{lng});
    );
    out body;
    """
    resp = requests.post("https://overpass-api.de/api/interpreter", data=query.strip())
    resp.raise_for_status()
    data = resp.json()

    places = []
    for el in data.get('elements', []):
        tags = el.get('tags', {})
        name = tags.get('name')
        if not name:
            # Skip places without a name
            continue
        places.append({
            'name': name,
            'amenity': tags.get('amenity', 'unknown'),
            'lat': el.get('lat'),
            'lon': el.get('lon')
        })
    return places


def main():
    try:
        lat, lng = get_my_location()
        print(f"Your approximate location: {lat:.5f}, {lng:.5f}\n")

        places = find_food_places(lat, lng)
        if not places:
            print("No named food places found within 1 km.")
            return

        # Compute distance for each place
        for p in places:
            p['distance'] = haversine(lat, lng, p['lat'], p['lon'])

        # Sort by distance and limit results
        nearest = sorted(places, key=lambda x: x['distance'])[:RESULT_LIMIT]

        print(f"Showing top {len(nearest)} closest places within {SEARCH_RADIUS}m:\n")
        for i, p in enumerate(nearest, 1):
            print(
                f"{i}. {p['name']} ({p['amenity']}) — "
                f"{p['lat']:.5f}, {p['lon']:.5f} "
                f"[{p['distance']:.1f} m]"
            )

    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    main()