"use client";
import { useState, useCallback, useEffect } from "react";
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
  Image,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdArrowUpward,
  MdArrowDownward,
  MdShield,
} from "react-icons/md";
import { toast } from "sonner";
import api from "@/utils/api/axios";
import { TeamMember } from "@/types/team";

interface TeamMembersResponse {
  items: TeamMember[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export default function TeamMembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<TeamMembersResponse>(
        `/team?page=${page}&limit=${rowsPerPage}`
      );
      setMembers(data.items);
      setTotalMembers(data.meta.total);
    } catch (error) {
      toast.error("Komanda üzvləri yüklənə bilmədi");
      console.error("Komanda üzvlərini yükləmə xətası:", error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleDelete = async (member: TeamMember) => {
    setSelectedMember(member);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!selectedMember) return;

    try {
      await api.delete(`/team/${selectedMember.id}`);
      toast.success("Komanda üzvü uğurla silindi");
      fetchMembers();
    } catch (error) {
      toast.error("Komanda üzvünü silmək mümkün olmadı");
      console.error("Komanda üzvünü silmə xətası:", error);
    } finally {
      onClose();
      setSelectedMember(null);
    }
  };

  const handleMove = async (member: TeamMember, direction: "up" | "down") => {
    try {
      const newOrder = direction === "up" ? member.order - 1 : member.order + 1;
      await api.patch(`/team/${member.id}`, {
        order: newOrder,
      });

      await fetchMembers();
      toast.success("Sıralama uğurla yeniləndi");
    } catch {
      toast.error("Sıralama yenilənə bilmədi");
    }
  };

  const toggleStatus = async (member: TeamMember) => {
    try {
      const updatedStatus = !member.isActive;
      await api.patch(`/team/${member.id}/status`, {
        isActive: updatedStatus,
      });
      toast.success(
        `Üzv ${updatedStatus ? "aktiv edildi" : "deaktiv edildi"}`
      );
      fetchMembers();
    } catch (error) {
      toast.error("Status yenilənə bilmədi");
      console.error("Status update error:", error);
    }
  };

  const columns = [
    { name: "ŞƏKİL", uid: "image" },
    { name: "AD SOYAD", uid: "fullName" },
    { name: "BİO", uid: "bio" },
    { name: "YARADILMA TARİXİ", uid: "createdAt" },
    { name: "SIRALA", uid: "order" },
    { name: "STATUS", uid: "status" },
    { name: "ƏMƏLİYYATLAR", uid: "actions" },
  ];

  const renderCell = (member: TeamMember, columnKey: string) => {
    switch (columnKey) {
      case "image":
        return (
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${member.imageUrl}`}
              alt={member.fullName}
              className="object-cover w-full h-full"
            />
          </div>
        );
      case "fullName":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{member.fullName}</p>
          </div>
        );
      case "bio":
        return (
          <p className="text-small">
            {member.bio.az.length > 100
              ? `${member.bio.az.substring(0, 100)}...`
              : member.bio.az}
          </p>
        );
      case "createdAt":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">
              {new Date(member.createdAt).toLocaleDateString("az-AZ")}
            </p>
            <p className="text-bold text-tiny text-default-400">
              {new Date(member.createdAt).toLocaleTimeString("az-AZ")}
            </p>
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
                isDisabled={member.order === 0}
                onClick={() => handleMove(member, "up")}
              >
                <MdArrowUpward className="text-default-400" size={20} />
              </Button>
            </Tooltip>
            <span className="text-tiny text-default-400">
              Sıra: {member.order + 1}
            </span>
            <Tooltip content="Aşağı">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                isDisabled={member.order === totalMembers - 1}
                onClick={() => handleMove(member, "down")}
              >
                <MdArrowDownward className="text-default-400" size={20} />
              </Button>
            </Tooltip>
          </div>
        );
      case "status":
        return (
          <Button
            size="sm"
            color={member.isActive ? "success" : "danger"}
            variant="flat"
            onClick={() => toggleStatus(member)}
          >
            {member.isActive ? "Aktiv" : "Deaktiv"}
          </Button>
        );
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="Düzəliş et">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={() => router.push(`/dashboard/team/edit/${member.id}`)}
              >
                <MdEdit className="text-default-400" size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Sil" color="danger">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={() => handleDelete(member)}
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
            <h1 className="text-2xl font-bold">Komanda Üzvləri</h1>
            <p className="text-gray-500">Komanda üzvlərini idarə edin</p>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              color="primary"
              className="bg-jsyellow text-white"
              startContent={<MdShield size={24} />}
              onClick={() => router.push("/dashboard/teacher-roles")}
            >
              Rollar
            </Button>
            <Button
              color="primary"
              className="bg-jsyellow text-white"
              startContent={<MdAdd size={24} />}
              onClick={() => router.push("/dashboard/team/create")}
            >
              Yeni Üzv
            </Button>
          </div>
        </div>

        <Table
          aria-label="Komanda üzvləri cədvəli"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="warning"
                page={page}
                total={Math.ceil(totalMembers / rowsPerPage)}
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
            items={members}
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
                <ModalHeader className="flex flex-col gap-1">
                  Komanda Üzvünü Sil
                </ModalHeader>
                <ModalBody>
                  <p>
                    &quot;{selectedMember?.fullName}&quot; komanda üzvünü silmək
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
