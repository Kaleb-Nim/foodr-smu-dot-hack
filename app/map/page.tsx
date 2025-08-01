'use client';

import FoodMap from '../components/FoodMap';
import Link from 'next/link';

export default function MapPage() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Link href="/" style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 10,
          padding: '8px 12px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>
        Back to Group Management
      </Link>
      <FoodMap />
    </div>
  );
}