import { db } from "@/lib/firebase";
import { Kitchen } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import KitchenForm from "./components/kitchen-form";

export default async function KitchenPage({
  params,
}: {
  params: { storeId: string; kitchenId: string };
}) {
  const kitchen = (
    await getDoc(doc(db, "stores", params.storeId, "kitchens", params.kitchenId))
  ).data() as Kitchen;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <KitchenForm initialData={structuredClone(kitchen)} />
      </div>
    </div>
  );
}
