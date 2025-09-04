"use client";
import { Module } from "@/types/course";
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

interface ModulesResponse {
  items: Module[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export default function ModulesPage() {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [totalModules, setTotalModules] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const fetchModules = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<ModulesResponse>(
        `/course-modules?page=${page}&limit=${rowsPerPage}`
      );
      setModules(data.items);
      setTotalModules(data.meta.total);
    } catch (error) {
      console.error("Modullar yüklənmədi:", error);
      toast.error("Modullar yüklənə bilmədi");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const handleDelete = (module: Module) => {
    setSelectedModule(module);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!selectedModule) return;

    try {
      await api.delete(`/course-modules/${selectedModule.id}`);
      toast.success("Modul uğurla silindi");
      fetchModules();
    } catch (error) {
      console.error("Modul silinə bilmədi:", error);
      toast.error("Modulu silmək mümkün olmadı");
    } finally {
      onClose();
      setSelectedModule(null);
    }
  };

  const columns = [
    { name: "BAŞLIQ", uid: "title" },
    { name: "TƏSVİR", uid: "description" },
    { name: "KONTENTLƏR", uid: "content" },
    { name: "YARADILMA TARİXİ", uid: "createdAt" },
    { name: "ƏMƏLİYYATLAR", uid: "actions" },
  ];

  const renderCell = (module: Module, columnKey: string) => {
    switch (columnKey) {
      case "title":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{module.title.az}</p>
            <p className="text-tiny text-default-400">{module.title.ru}</p>
          </div>
        );

      case "description":
        return (
          <p className="text-small">
            {module.description?.az?.length > 100
              ? `${module.description.az.substring(0, 100)}...`
              : module.description?.az}
          </p>
        );

      case "content":
        return (
          <p className="text-small">
            Kontent sayı: {module.content?.length || 0}
          </p>
        );

      case "createdAt":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">
              {new Date(module.createdAt).toLocaleDateString("az-AZ")}
            </p>
            <p className="text-bold text-tiny text-default-400">
              {new Date(module.createdAt).toLocaleTimeString("az-AZ")}
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
                  router.push(`/dashboard/modules/edit/${module.id}`)
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
                onClick={() => handleDelete(module)}
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
            <h1 className="text-2xl font-bold">Modullar</h1>
            <p className="text-gray-500">Modulları idarə edin</p>
          </div>
          <Button
            color="primary"
            className="bg-jsyellow text-white"
            startContent={<MdAdd size={24} />}
            onClick={() => router.push("/dashboard/modules/create")}
          >
            Yeni Modul
          </Button>
        </div>

        <Table
          aria-label="Modullar cədvəli"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="warning"
                page={page}
                total={Math.ceil(totalModules / rowsPerPage)}
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
            items={modules}
            loadingContent={<div>Yüklənir...</div>}
            loadingState={loading ? "loading" : "idle"}
          >
            {(module) => (
              <TableRow key={module.id}>
                {columns.map((column) => (
                  <TableCell key={column.uid}>
                    {renderCell(module, column.uid)}
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
                <ModalHeader>Modulu Sil</ModalHeader>
                <ModalBody>
                  <p>
                    &quot;{selectedModule?.title.az}&quot; modulunu silmək
                    istədiyinizə əminsiniz?
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
