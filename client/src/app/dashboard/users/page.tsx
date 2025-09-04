"use client";
import { Role } from "@/types/enums";
import { User, UserResponse } from "@/types/user";
import api from "@/utils/api/axios";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  User as NextUIUser,
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

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const roleColorMap: Record<
    Role,
    "success" | "warning" | "danger" | "secondary" | "primary" | "default"
  > = {
    USER: "success",
    STAFF: "warning",
    ADMIN: "danger",
    CONTENTMANAGER: "secondary",
    CRMOPERATOR: "primary",
    AUTHOR: "default",
    COORDINATOR: "default",
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<UserResponse>(
        `/users?page=${page}&limit=${rowsPerPage}`
      );
      setUsers(data.items);
      setTotalUsers(data.meta.total);
    } catch (error) {
      toast.error("İstifadəçilər yüklənərkən xəta baş verdi");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (user: User) => {
    setSelectedUser(user);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await api.delete(`/users/${selectedUser.id}`);
      toast.success("İstifadəçi uğurla silindi");
      fetchUsers();
    } catch (error) {
      toast.error("İstifadəçi silinərkən xəta baş verdi");
      console.error("Error deleting user:", error);
    } finally {
      onClose();
      setSelectedUser(null);
    }
  };

  const columns = [
    { name: "İSTİFADƏÇİ", uid: "name" },
    { name: "ROL", uid: "role" },
    { name: "QOŞULMA TARİXİ", uid: "createdAt" },
    { name: "ƏMƏLIYYATLAR", uid: "actions" },
  ];

  const renderCell = (user: User, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return (
          <NextUIUser
            name={user.name || "Adsız İstifadəçi"}
            description={user.email}
            avatarProps={{
              src: `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`,
              radius: "lg",
            }}
          />
        );
      case "role":
        return (
          <Chip color={roleColorMap[user.role]} variant="flat" size="sm">
            {user.role}
          </Chip>
        );
      case "createdAt":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">
              {new Date(user.createdAt).toLocaleDateString("az-AZ")}
            </p>
            <p className="text-bold text-tiny text-default-400">
              {new Date(user.createdAt).toLocaleTimeString("az-AZ")}
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
                onClick={() => router.push(`/dashboard/users/edit/${user.id}`)}
              >
                <MdEdit className="text-default-400" size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Sil" color="danger">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={() => handleDelete(user)}
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
            <h1 className="text-2xl font-bold text-black">İstifadəçilər</h1>
            <p className="text-gray-500">İstifadəçiləri idarə edin</p>
          </div>
          <Button
            color="primary"
            className="bg-jsyellow text-white"
            startContent={<MdAdd size={24} />}
            onClick={() => router.push("/dashboard/users/create")}
          >
            Yeni İstifadəçi
          </Button>
        </div>

        <Table
          aria-label="Users table"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="warning"
                page={page}
                total={Math.ceil(totalUsers / rowsPerPage)}
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
            items={users}
            loadingContent={<div>Yüklənir...</div>}
            loadingState={loading ? "loading" : "idle"}
          >
            {(user) => (
              <TableRow key={user.id}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(user, columnKey.toString())}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>İstifadəçini Sil</ModalHeader>
                <ModalBody>
                  <p>
                    {selectedUser?.name || selectedUser?.email} istifadəçisini
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
