import 'dotenv/config'; // Load environment variables from .env
import fs from 'fs/promises';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const CACHE_FILE = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../cache/prices.json');

interface PriceCache {
    [location: string]: string;
}

async function readCache(): Promise<PriceCache> {
    try {
        const data = await fs.readFile(CACHE_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.log("Cache file not found, creating new cache.");
            return {};
        }
        throw error;
    }
}

async function writeCache(cache: PriceCache): Promise<void> {
    await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
    console.log("Cache updated successfully.");
}

const DEFAULT_LAT = 1.2963; // SMU
const DEFAULT_LON = 103.8502; // SMU
const SEARCH_RADIUS = 1000; // meters
const RESULT_LIMIT = 50;

interface Place {
    id: number;
    name: string;
    amenity: string;
    lat: number;
    lon: number;
}

async function fetchLocations(latitude: number, longitude: number): Promise<Place[]> {
    const query = `
        [out:json][timeout:25];
        (
            node["amenity"~"restaurant|cafe|fast_food|bar"](around:${SEARCH_RADIUS},${latitude},${longitude});
        );
        out body;
    `;

    try {
        const res = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query.trim(),
        });
        const data = await res.json();
        const els: Place[] = (data.elements as any[])
            .filter(el => el.tags?.name)
            .slice(0, RESULT_LIMIT)
            .map(el => ({
                id: el.id,
                name: el.tags.name,
                amenity: el.tags.amenity || 'unknown',
                lat: el.lat,
                lon: el.lon,
            }));
        return els;
    } catch (err) {
        console.error('Overpass fetch error:', err);
        return [];
    }
}

async function main() {
    console.log("Starting precalculation script...");

    const latitude = process.env.CURRENT_LAT ? parseFloat(process.env.CURRENT_LAT) : DEFAULT_LAT;
    const longitude = process.env.CURRENT_LON ? parseFloat(process.env.CURRENT_LON) : DEFAULT_LON;

    if (isNaN(latitude) || isNaN(longitude)) {
        console.error("Invalid CURRENT_LAT or CURRENT_LON environment variables. Using default coordinates.");
        // Fallback to defaults if parsing fails
        const finalLat = DEFAULT_LAT;
        const finalLon = DEFAULT_LON;
        console.log(`Using coordinates: Lat ${finalLat}, Lon ${finalLon}`);
    } else {
        console.log(`Using coordinates from environment variables: Lat ${latitude}, Lon ${longitude}`);
    }

    const cache = await readCache();
    console.log("Current cache size:", Object.keys(cache).length);

    const locations = await fetchLocations(latitude, longitude);
    console.log(`Found ${locations.length} locations within ${SEARCH_RADIUS}m radius.`);

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
        console.error('Gemini API key not configured. Please set GEMINI_API_KEY environment variable.');
        return;
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let updatedCache = { ...cache };
    let newCalculations = 0;

    for (const location of locations) {
        const cacheKey = `${location.name}|${location.amenity}`;
        if (updatedCache[cacheKey]) {
            console.log(`Cache hit for ${location.name} (${location.amenity}).`);
        } else {
            console.log(`Cache miss for ${location.name} (${location.amenity}). Calculating...`);
            const prompt = `Suggest a price range for "${location.name}" which is a ${location.amenity}. Provide a range of prices, for example, a hawker might be $0-$10, a restaurant might be $10-$20. Only provide the price range`;

            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const priceRange = response.text().trim();
                updatedCache[cacheKey] = priceRange;
                newCalculations++;
                console.log(`Calculated price for ${location.name}: ${priceRange}`);
            } catch (error) {
                console.error(`Error calculating price for ${location.name}:`, error);
            }
        }
    }

    if (newCalculations > 0) {
        await writeCache(updatedCache);
        console.log(`Precalculation complete. Added ${newCalculations} new price ranges to cache.`);
    } else {
        console.log("No new calculations needed. Cache is up to date.");
    }
}

main().catch(console.error);