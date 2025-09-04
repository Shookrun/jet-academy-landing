"use client";
import api from "@/utils/api/axios";
import {
  Button,
  Image,
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
import { MdAdd, MdDelete } from "react-icons/md";
import { toast } from "sonner";

interface GalleryImage {
  id: string;
  title: {
    az: string;
    en?: string;
    ru: string;
  };
  imageUrl: string;
  createdAt: string;
  order: number;
}

interface GalleryResponse {
  items: GalleryImage[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export default function GalleryPage() {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [totalImages, setTotalImages] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);


  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<GalleryResponse>(
        `/gallery?page=${page}&limit=${rowsPerPage}`
      );
      const sorted = data.items.sort((a, b) => a.order - b.order);
      setImages(sorted);
      setTotalImages(data.meta.total);
    } catch (error) {
      toast.error("Qaleriya şəkilləri yüklənə bilmədi");
      console.error("Qaleriya şəkillərini yükləmə xətası:", error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);


  const handleDelete = (image: GalleryImage) => {
    setSelectedImage(image);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!selectedImage) return;
    try {
      await api.delete(`/gallery/${selectedImage.id}`);
      toast.success("Şəkil uğurla silindi");
      fetchImages();
    } catch (error) {
      toast.error("Şəkili silmək mümkün olmadı");
      console.error("Şəkili silmə xətası:", error);
    } finally {
      onClose();
      setSelectedImage(null);
    }
  };

  const handleOrderChange = async (imageId: string, newOrder: number) => {
    if (newOrder < 0) return;
    try {
      await api.patch(`/gallery/${imageId}`, { order: newOrder });
      toast.success("Sıra uğurla dəyişdirildi");
      fetchImages();
    } catch (error) {
      toast.error("Sıra dəyişdirilə bilmədi");
      console.error("Order update error:", error);
    }
  };

  const columns = [
    { name: "SIRA", uid: "order" },
    { name: "ŞƏKİL", uid: "image" },
    { name: "BAŞLIQ", uid: "title" },
    { name: "YARADILMA TARİXİ", uid: "createdAt" },
    { name: "ƏMƏLİYYATLAR", uid: "actions" },
  ];

  const renderCell = (image: GalleryImage, columnKey: string) => {
    switch (columnKey) {
      case "order":
        return (
          <input
            type="number"
            value={image.order}
            min={0}
            className="w-16 border rounded px-2"
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) {
                handleOrderChange(image.id, val);
              }
            }}
          />
        );
      case "image":
        return (
          <div className="relative w-32 h-24 rounded-lg overflow-hidden">
            <Image
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${image.imageUrl}`}
              alt={image.title.az || "Gallery image"}
              className="object-cover w-full h-full"
            />
          </div>
        );
      case "title":
        return (
          <div>
            <p className="font-semibold text-sm">
              {image.title.az || "Başlıqsız"}
            </p>
          </div>
        );
      case "createdAt":
        return (
          <div>
            <p className="font-semibold text-sm">
              {new Date(image.createdAt).toLocaleDateString("az-AZ")}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(image.createdAt).toLocaleTimeString("az-AZ")}
            </p>
          </div>
        );
      case "actions":
        return (
          <div className="flex justify-center items-center gap-2">
            <Tooltip content="Sil" color="danger">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={() => handleDelete(image)}
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
            <h1 className="text-2xl font-bold">Qaleriya</h1>
            <p className="text-gray-500">Qaleriya şəkillərini idarə edin</p>
          </div>
          <Button
            color="primary"
            className="bg-jsyellow text-white"
            startContent={<MdAdd size={24} />}
            onClick={() => router.push("/dashboard/gallery/create")}
          >
            Yeni Şəkil
          </Button>
        </div>

        <Table
          aria-label="Qaleriya şəkilləri cədvəli"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="warning"
                page={page}
                total={Math.ceil(totalImages / rowsPerPage)}
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
            items={images}
            loadingContent={<div>Yüklənir...</div>}
            loadingState={loading ? "loading" : "idle"}
          >
            {(item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={column.uid}>
                    {renderCell(item, column.uid)}
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
                <ModalHeader>Şəkili Sil</ModalHeader>
                <ModalBody>
                  <p>Bu şəkili silmək istədiyinizə əminsiniz?</p>
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
