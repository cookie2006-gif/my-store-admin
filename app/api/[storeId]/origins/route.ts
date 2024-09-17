import { db } from "@/lib/firebase";
import { Origin } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }
    const { name, value } = body;
    if (!name) {
      return new NextResponse("Origin Name is missing!", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Origin Value is missing!", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));
    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Un-Authorized Access", { status: 500 });
      }
    }

    const originData = {
      name,
      value,
      createdAt: serverTimestamp(),
    };

    const originRef = await addDoc(
      collection(db, "stores", params.storeId, "origins"),
      originData
    );

    const id = originRef.id;
    await updateDoc(doc(db, "stores", params.storeId, "origins", id), {
      ...originData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...originData });
  } catch (error) {
    console.log(`ORIGINS_POST:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }

    const originsData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "origins"))
    ).docs.map((doc) => doc.data() as Origin[]);
    return NextResponse.json(originsData);
  } catch (error) {
    console.log(`Origins_GET:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
