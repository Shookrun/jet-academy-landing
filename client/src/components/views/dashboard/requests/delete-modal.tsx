import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Request } from "@/types/request";

interface DeleteModalProps {
  request: Request | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({
  request,
  isOpen,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  if (!request) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Sorğunu Sil</ModalHeader>
            <ModalBody>
              <p>
                {request.name} {request.surname} tərəfindən göndərilən sorğunu
                silmək istədiyinizə əminsiniz?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Ləğv et
              </Button>
              <Button color="danger" onPress={onConfirm}>
                Sil
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
