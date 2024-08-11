"use client";

import { useEffect, useState } from "react";
import { Modal } from "../modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal = ({
  isOpen,
  loading,
  onClose,
  onConfirm,
}: AlertModalProps) => {
  const [isMounted, setIsMountded] = useState(false);

  useEffect(() => {
    setIsMountded(true);
  }, []);
  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Are you sure ?"
      description="This action cannot be undone!.."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end ww-full">
        <Button disabled={loading} onClick={onClose} variant={"outline"}>
          Cancel
        </Button>
        <Button disabled={loading} onClick={onConfirm} variant={"destructive"}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};
