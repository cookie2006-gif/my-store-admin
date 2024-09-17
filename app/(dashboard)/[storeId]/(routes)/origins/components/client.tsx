"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { OriginColumns, columns } from "./columns";
import ApiList from "@/components/api-list";

interface OriginClientProps {
  data: OriginColumns[];
}

export default function OriginClient({ data }: OriginClientProps) {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Origins (${data.length})`}
          description="Manage origins for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/origins/new`)}>
          <Plus className="h-4 w-4 mr-2" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />

      {/* <Heading title="API" description="API calls for origins" />
      <Separator />
      <ApiList entityName="origins" entityNameId="originId" /> */}
    </>
  );
}
