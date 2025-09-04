"use client";
import { Eligibility } from "@/types/course";
import api from "@/utils/api/axios";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import { toast } from "sonner";

interface EligibilitesResponse {
  items: Eligibility[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export default function EligibilitiesPage() {
  const router = useRouter();
  const [eligibilities, setEligibilities] = useState<Eligibility[]>([]);
  const [totalEligibilities, setTotalEligibilities] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEligibility, setSelectedEligibility] =
    useState<Eligibility | null>(null);

  const fetchEligibilities = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<EligibilitesResponse>(
        `/course-eligibility?page=${page}&limit=${rowsPerPage}`
      );
      setEligibilities(data.items);
      setTotalEligibilities(data.meta.total);
    } catch (error) {
      toast.error("Tələb yüklənə bilmədi");
      console.error("Tələbin yükləmə xətası:", error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchEligibilities();
  }, [fetchEligibilities]);

  const handleDelete = async (eligibility: Eligibility) => {
    setSelectedEligibility(eligibility);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!selectedEligibility) return;

    try {
      await api.delete(`/course-eligibility/${selectedEligibility.id}`);
      toast.success("Tələb uğurla silindi");
      fetchEligibilities();
    } catch (error) {
      toast.error("Tələbi silmək mümkün olmadı");
      console.error("Tələbi silmə xətası:", error);
    } finally {
      onClose();
      setSelectedEligibility(null);
    }
  };

  const columns = [
    { name: "BAŞLIQ", uid: "title" },
    { name: "TƏSVİR", uid: "description" },
    { name: "YARADILMA TARİXİ", uid: "createdAt" },
    { name: "ƏMƏLİYYATLAR", uid: "actions" },
  ];

  const renderCell = (eligibility: Eligibility, columnKey: string) => {
    switch (columnKey) {
      case "title":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{eligibility.title.az}</p>
          </div>
        );
      case "description":
        return (
          <p className="text-small">
            {eligibility.description.az.length > 100
              ? `${eligibility.description.az.substring(0, 100)}...`
              : eligibility.description.az}
          </p>
        );
      case "category":
        return <p className="text-small">{eligibility.title.az}</p>;
      case "createdAt":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">
              {new Date(eligibility.createdAt).toLocaleDateString("az-AZ")}
            </p>
            <p className="text-bold text-tiny text-default-400">
              {new Date(eligibility.createdAt).toLocaleTimeString("az-AZ")}
            </p>
          </div>
        );
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="Düzəliş et">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={() =>
                  router.push(`/dashboard/eligibilities/edit/${eligibility.id}`)
                }
              >
                <MdEdit className="text-default-400" size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Sil" color="danger">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={() => handleDelete(eligibility)}
              >
                <MdDelete className="text-danger" size={20} />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Tələblər</h1>
            <p className="text-gray-500">Tələbləri idarə edin</p>
          </div>
          <Button
            color="primary"
            className="bg-jsyellow text-white"
            startContent={<MdAdd size={24} />}
            onClick={() => router.push("/dashboard/eligibilities/create")}
          >
            Yeni Tələb
          </Button>
        </div>

        <Table
          aria-label="Tələbə layihələri cədvəli"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="warning"
                page={page}
                total={Math.ceil(totalEligibilities / rowsPerPage)}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={eligibilities}
            loadingContent={<div>Yüklənir...</div>}
            loadingState={loading ? "loading" : "idle"}
          >
            {(eligibility) => (
              <TableRow key={eligibility.id}>
                {columns.map((column) => (
                  <TableCell key={column.uid}>
                    {renderCell(eligibility, column.uid)}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Layihəni Sil</ModalHeader>
                <ModalBody>
                  <p>
                    &quot;{selectedEligibility?.title.az}&quot; layihəsini
                    silmək istədiyinizə əminsiniz?
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Ləğv et
                  </Button>
                  <Button color="danger" onPress={confirmDelete}>
                    Sil
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </motion.div>
    </div>
  );
}
