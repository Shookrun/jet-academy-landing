import { Request, statusColorMap, statusLabels } from "@/types/request";
import api from "@/utils/api/axios";
import {
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { useEffect } from "react";
import { toast } from "sonner";

interface ViewModalProps {
  request: Request | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewModal({ request, isOpen, onClose }: ViewModalProps) {
  useEffect(() => {
    const updateStatus = async (requestId: string) => {
      try {
        await api.post(`/requests/${requestId}/view`);
        toast.success("Status uğurla yeniləndi");
      } catch (error) {
        toast.error("Status yenilənərkən xəta baş verdi");
        console.error("Error updating status:", error);
      }
    };

    if (isOpen && request?.status === "PENDING") {
      updateStatus(request.id);
    }
  }, [isOpen, request]);

  if (!request) return null;

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Sorğu Detalları
              {request.viewedBy && (
                <p className="text-small text-default-500">
                  {request.viewedBy} tərəfindən{" "}
                  {new Date(request.viewedAt!).toLocaleString("az-AZ")}{" "}
                  tarixində baxılıb
                </p>
              )}
            </ModalHeader>
            <ModalBody className="pb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-small font-bold">Ad Soyad</h3>
                  <p>
                    {request.name} {request.surname}
                  </p>
                </div>

                <div>
                  <h3 className="text-small font-bold">Telefon</h3>
                  <p>{request.number}</p>
                </div>
                <div>
                  <h3 className="text-small font-bold">Status</h3>
                  <Chip color={statusColorMap[request.status]} variant="flat">
                    {statusLabels[request.status]}
                  </Chip>
                </div>
                <div className="col-span-2">
                  <h3 className="text-small font-bold">Uşağın yaşı</h3>
                  <p className="whitespace-pre-wrap">{request.childAge}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="text-small font-bold">
                    Uşağın oxuycağı sektor
                  </h3>
                  <p className="whitespace-pre-wrap">{request.childLanguage}</p>
                </div>
               
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
