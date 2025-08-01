import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';

const CACHE_FILE = path.resolve(process.cwd(), 'app/cache/prices.json');

interface PriceCache {
    [location: string]: string;
}

async function readCache(): Promise<PriceCache> {
    try {
        const data = await fs.readFile(CACHE_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.log("Cache file not found, returning empty cache.");
            return {};
        }
        console.error("Error reading cache:", error);
        return {}; // Return empty cache on other errors to prevent blocking
    }
}

async function writeCache(cache: PriceCache): Promise<void> {
    try {
        await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
        await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
        console.log("Cache updated successfully from API route.");
    } catch (error) {
        console.error("Error writing cache from API route:", error);
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const placeName = searchParams.get('placeName');
    const placeAmenity = searchParams.get('placeAmenity');

    if (!placeName || !placeAmenity) {
        return NextResponse.json({ error: 'Missing placeName or placeAmenity' }, { status: 400 });
    }

    const cacheKey = `${placeName}|${placeAmenity}`;
    const cache = await readCache();

    if (cache[cacheKey]) {
        console.log(`API: Cache hit for ${placeName} (${placeAmenity}).`);
        return NextResponse.json({ priceRange: cache[cacheKey] });
    }

    console.log(`API: Cache miss for ${placeName} (${placeAmenity}). Calling /api/prices/gemini...`);

    try {
        const geminiApiRes = await fetch(`${request.url.split('/api/prices')[0]}/api/prices/gemini`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ placeName, placeAmenity }),
        });

        const geminiData = await geminiApiRes.json();

        if (!geminiApiRes.ok) {
            console.error('Error from /api/prices/gemini:', geminiData.error);
            return NextResponse.json({ error: geminiData.error || 'Failed to get price range from Gemini API.' }, { status: geminiApiRes.status });
        }

        const priceRange = geminiData.priceRange;

        // Update cache with new price
        cache[cacheKey] = priceRange;
        await writeCache(cache);

        return NextResponse.json({ priceRange });
    } catch (error) {
        console.error('Error calling /api/prices/gemini:', error);
        return NextResponse.json({ error: 'Failed to get price range from Gemini API.' }, { status: 500 });
    }
}