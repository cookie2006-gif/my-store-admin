import { db } from "@/lib/firebase";
import { Billboards, Category } from "@/types-db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import CategoryForm from "./components/category-form";

export default async function CategoryPage({
  params,
}: {
  params: { storeId: string; categoryId: string };
}) {
  const category = (
    await getDoc(
      doc(db, "stores", params.storeId, "categories", params.categoryId)
    )
  ).data() as Category;

  const billboardsData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "billboards"))
  ).docs.map((doc) => doc.data()) as Billboards[];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm
          billboards={structuredClone(billboardsData)}
          initialData={structuredClone(category)}
        />
      </div>
    </div>
  );
}
