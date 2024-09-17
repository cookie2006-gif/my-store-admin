import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Cuisine } from "@/types-db";
import { CuisineColumns } from "./components/columns";
import { format } from "date-fns";
import CuisineClient from "./components/client";

export default async function CuisinesPage({
  params,
}: {
  params: { storeId: string };
}) {
  const cuisinesData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "cuisines"))
  ).docs.map((doc) => doc.data()) as Cuisine[];

  const formattedCuisines: CuisineColumns[] = cuisinesData.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CuisineClient data={formattedCuisines} />
      </div>
    </div>
  );
}
