import { db } from "@/lib/firebase";
import { Origin } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; originId: string } }
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

    const originRef = await getDoc(
      doc(db, "stores", params.storeId, "origins", params.originId)
    );
    if (originRef.exists()) {
      await updateDoc(
        doc(db, "stores", params.storeId, "origins", params.originId),
        {
          ...originRef.data(),
          name,
          value,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Origin Not Found", { status: 404 });
    }

    const origin = (
      await getDoc(doc(db, "stores", params.storeId, "origins", params.originId))
    ).data() as Origin;

    return NextResponse.json(origin);
  } catch (error) {
    console.log(`origins_PATCH:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; originId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 });
    }
    if (!params.originId) {
      return new NextResponse("Origin Id is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));
    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Un-Authorized Access", { status: 500 });
      }
    }

    const originRef = doc(db, "stores", params.storeId, "origins", params.originId);
    await deleteDoc(originRef);

    return NextResponse.json({ msg: "Origin Deleted" });
  } catch (error) {
    console.log(`Origin_DELETE:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
