import { LocationHeader } from "../components/LocationHeader";
import CuisineLocationClientPage from "./components/CuisineLocationClientPage";

interface LocationPageProps {
  params: Promise<{
    cuisine: string;
  }>;
}

export default async function CuisineLocationPage({
  params,
}: LocationPageProps) {
  const { cuisine } = await params;
  const decodedCuisine = decodeURIComponent(cuisine);

  const title = `Top Locations for ${decodedCuisine} Cuisine`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 pb-12">
      <LocationHeader title={title} showBackButton={true} />
      <CuisineLocationClientPage cuisine={decodedCuisine} />
    </div>
  );
}
