"use client";
import { useState, useCallback, useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
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
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdArrowUpward,
  MdArrowDownward,
} from "react-icons/md";
import { toast } from "sonner";
import api from "@/utils/api/axios";

interface GlossaryCategory {
  id: string;
  name: {
    az: string;
    en: string;
  };
  description?: {
    az: string;
    en: string;
  };
  slug: {
    az: string;
    en: string;
  };
  order: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    glossaryTerms: number;
  };
}

export default function GlossaryCategoriesDashboardPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<GlossaryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCategory, setSelectedCategory] =
    useState<GlossaryCategory | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<GlossaryCategory[]>(
        `/glossary-categories`
      );
      setCategories(data);
    } catch (error) {
      toast.error("Kateqoriyalar yüklənə bilmədi");
      console.error("Kateqoriyaları yükləmə xətası:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (category: GlossaryCategory) => {
    setSelectedCategory(category);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;

    try {
      await api.delete(`/glossary-categories/${selectedCategory.id}`);
      toast.success("Kateqoriya uğurla silindi");
      fetchCategories();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Kateqoriyanı silmək mümkün olmadı";
      toast.error(errorMessage);
      console.error("Kateqoriyanı silmə xətası:", error);
    } finally {
      onClose();
      setSelectedCategory(null);
    }
  };

  const handleMove = async (
    category: GlossaryCategory,
    direction: "up" | "down"
  ) => {
    try {
      const newOrder =
        direction === "up" ? category.order - 1 : category.order + 1;
      await api.patch(`/glossary-categories/${category.id}`, {
        order: newOrder,
      });

      await fetchCategories();
      toast.success("Sıralama uğurla yeniləndi");
    } catch (error) {
      toast.error("Sıralama yenilənə bilmədi");
      console.error("Sıralama yeniləmə xətası:", error);
    }
  };

  const columns = [
    { name: "KATEQORİYA ADI", uid: "name" },
    { name: "TƏSVİR", uid: "description" },
    { name: "TERMİN SAYI", uid: "termCount" },
    { name: "SIRALA", uid: "order" },
    { name: "YARADILMA TARİXİ", uid: "createdAt" },
    { name: "ƏMƏLİYYATLAR", uid: "actions" },
  ];

  const renderCell = (category: GlossaryCategory, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{category.name.az}</p>
            <p className="text-tiny text-default-400">{category.name.en}</p>
          </div>
        );
      case "description":
        return (
          <div className="flex flex-col">
            <p className="text-small">
              {category.description?.az
                ? category.description.az.length > 100
                  ? `${category.description.az.substring(0, 100)}...`
                  : category.description.az
                : ""}
            </p>
            {category.description?.en && (
              <p className="text-tiny text-default-400">
                {category.description.en.length > 50
                  ? `${category.description.en.substring(0, 50)}...`
                  : category.description.en}
              </p>
            )}
          </div>
        );
      case "termCount":
        return (
          <div className="flex justify-center">
            <span className="text-small">
              {category._count?.glossaryTerms || 0}
            </span>
          </div>
        );
      case "order":
        return (
          <div className="flex flex-col gap-1 items-center">
            <Tooltip content="Yuxarı">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                isDisabled={category.order === 0}
                onClick={() => handleMove(category, "up")}
              >
                <MdArrowUpward className="text-default-400" size={20} />
              </Button>
            </Tooltip>
            <span className="text-tiny text-default-400">
              Sıra: {category.order + 1}
            </span>
            <Tooltip content="Aşağı">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                isDisabled={category.order === categories.length - 1}
                onClick={() => handleMove(category, "down")}
              >
                <MdArrowDownward className="text-default-400" size={20} />
              </Button>
            </Tooltip>
          </div>
        );
      case "createdAt":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">
              {new Date(category.createdAt).toLocaleDateString("az-AZ")}
            </p>
            <p className="text-bold text-tiny text-default-400">
              {new Date(category.createdAt).toLocaleTimeString("az-AZ")}
            </p>
          </div>
        );
      case "actions":
        return (
          <div className="flex items-center gap-2 justify-center">
            <Tooltip content="Düzəliş et">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={() =>
                  router.push(
                    `/dashboard/glossary/categories/edit/${category.id}`
                  )
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
                onClick={() => handleDelete(category)}
                isDisabled={
                  category._count?.glossaryTerms
                    ? category._count.glossaryTerms > 0
                    : false
                }
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
            <h1 className="text-2xl font-bold">Glossariy Kateqoriyaları</h1>
            <p className="text-gray-500">Kateqoriyaları idarə edin</p>
          </div>
          <div className="flex gap-3">
            <Button
              color="warning"
              variant="flat"
              onClick={() => router.push("/dashboard/glossary")}
            >
              Terminlərə Qayıt
            </Button>
            <Button
              color="primary"
              className="bg-jsyellow text-white"
              startContent={<MdAdd size={24} />}
              onClick={() =>
                router.push("/dashboard/glossary/categories/create")
              }
            >
              Yeni Kateqoriya
            </Button>
          </div>
        </div>

        <Table aria-label="Kateqoriyalar cədvəli">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={
                  column.uid === "actions" ||
                  column.uid === "termCount" ||
                  column.uid === "order"
                    ? "center"
                    : "start"
                }
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={categories}
            loadingContent={<div>Yüklənir...</div>}
            loadingState={loading ? "loading" : "idle"}
            emptyContent={"Heç bir kateqoriya tapılmadı"}
          >
            {(category) => (
              <TableRow key={category.id}>
                {columns.map((column) => (
                  <TableCell key={column.uid}>
                    {renderCell(category, column.uid)}
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
                <ModalHeader>Kateqoriyanı Sil</ModalHeader>
                <ModalBody>
                  {selectedCategory?._count?.glossaryTerms &&
                  selectedCategory._count.glossaryTerms > 0 ? (
                    <p className="text-danger">
                      Bu kateqoriyada {selectedCategory._count.glossaryTerms}{" "}
                      termin var. Əvvəlcə terminləri başqa kateqoriyaya köçürün
                      və ya silin.
                    </p>
                  ) : (
                    <>
                      <p>
                        &quot;{selectedCategory?.name.az}&quot; kateqoriyasını
                        silmək istədiyinizə əminsiniz?
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Bu əməliyyat geri qaytarıla bilməz.
                      </p>
                    </>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Ləğv et
                  </Button>
                  <Button
                    color="danger"
                    onPress={confirmDelete}
                    isDisabled={
                      selectedCategory?._count?.glossaryTerms
                        ? selectedCategory._count.glossaryTerms > 0
                        : false
                    }
                  >
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
