import { db } from "@/lib/firebase";
import { Origin } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import OriginForm from "./components/origin-form";

export default async function OriginPage({
  params,
}: {
  params: { storeId: string; originId: string };
}) {
  const origin = (
    await getDoc(doc(db, "stores", params.storeId, "origins", params.originId))
  ).data() as Origin;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OriginForm initialData={structuredClone(origin)} />
      </div>
    </div>
  );
}
