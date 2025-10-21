"use client";
import api from "@/utils/api/axios";
import {
  Button,
  Chip,
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
import { useCallback, useEffect, useState } from "react";
import { MdDelete, MdVisibility } from "react-icons/md";
import { toast } from "sonner";
import {
  Request,
  RequestResponse,
  statusColorMap,
  statusLabels,
  languageLabels,
} from "@/types/request";
import { ViewModal } from "@/components/views/dashboard/requests/view-modal";
import { DeleteModal } from "@/components/views/dashboard/requests/delete-modal";
import { useSession } from "next-auth/react";
import { Role } from "@/types/enums";

export default function RequestsPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<Request[]>([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [viewRequest, setViewRequest] = useState<Request | null>(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<RequestResponse>(
        `/requests?page=${page}&limit=${rowsPerPage}`
      );
      setRequests(data.items);
      setTotalRequests(data.meta.total);
    } catch (error) {
      toast.error("Sorğular yüklənərkən xəta baş verdi");
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleView = async (request: Request) => {
    try {
      const { data } = await api.get(`/requests/${request.id}`);
      setViewRequest(data);
      await api.post(`/requests/${request.id}/view`);
      fetchRequests();
    } catch (error) {
      console.error("Error fetching request details:", error);
      toast.error("Sorğu detalları yüklənərkən xəta baş verdi");
    }
  };

  const handleDelete = (request: Request) => {
    setSelectedRequest(request);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (!selectedRequest) return;

    try {
      await api.delete(`/requests/${selectedRequest.id}`);
      toast.success("Sorğu uğurla silindi");
      fetchRequests();
    } catch (error) {
      toast.error("Sorğu silinərkən xəta baş verdi");
      console.error("Error deleting request:", error);
    } finally {
      onDeleteClose();
      setSelectedRequest(null);
    }
  };

  const columns = [
    { name: "AD SOYAD", uid: "fullName" },
    { name: "ƏLAQƏ", uid: "contact" },
    { name: "MÜRACİƏT NÖVÜ", uid: "intent" }, 
    { name: "STATUS", uid: "status" },
    { name: "TARİX", uid: "createdAt" },
    { name: "ƏMƏLIYYATLAR", uid: "actions" },
  ];

  const renderCell = (request: Request, columnKey: string) => {
    switch (columnKey) {
      case "fullName":
        return (
          <div>
            <p className="font-medium">{`${request.name} ${request.surname}`}</p>
          </div>
        );
      case "contact":
        return <div>{request.number}</div>;
    
      case "status":
        return (
          <div className="flex flex-wrap gap-2">
            <Chip
              className="cursor-pointer"
              color={statusColorMap[request.status]}
              variant="flat"
            >
              {statusLabels[request.status]}
            </Chip>
          </div>
        );
        case "intent": {
  const info = request.additionalInfo as any;
  if (!info || !info.kind) return <div>—</div>;

  if (info.kind === "advice") {
    return <Chip color="secondary" variant="flat">Məsləhət</Chip>;
  }

  if (info.kind === "course") {
    return (
      <div className="flex flex-col">
        <Chip color="primary" variant="flat">Kurs</Chip>
        <span className="text-tiny text-default-500 mt-1">
          {info.courseTitle ?? info.courseId}
        </span>
      </div>
    );
  }
  return <div>—</div>;
}
      case "createdAt":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">
              {new Date(request.createdAt).toLocaleDateString("az-AZ")}
            </p>
            <p className="text-bold text-tiny text-default-400">
              {new Date(request.createdAt).toLocaleTimeString("az-AZ")}
            </p>
          </div>
        );
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="Bax">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={() => handleView(request)}
              >
                <MdVisibility className="text-default-400" size={20} />
              </Button>
            </Tooltip>
            {session?.user.role === Role.ADMIN && (
              <Tooltip content="Sil" color="danger">
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onClick={() => handleDelete(request)}
                >
                  <MdDelete className="text-danger" size={20} />
                </Button>
              </Tooltip>
            )}
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
            <h1 className="text-2xl font-bold text-black">Sorğular</h1>
            <p className="text-gray-500">Daxil olan sorğuları idarə edin</p>
          </div>
        </div>

        <Table
          aria-label="Requests table"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="warning"
                page={page}
                total={Math.ceil(totalRequests / rowsPerPage)}
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
            items={requests}
            loadingContent={<div>Yüklənir...</div>}
            loadingState={loading ? "loading" : "idle"}
          >
            {(request) => (
              <TableRow key={request.id}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(request, columnKey.toString())}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <DeleteModal
          request={selectedRequest}
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={confirmDelete}
        />

        <ViewModal
          request={viewRequest}
          isOpen={!!viewRequest}
          onClose={() => setViewRequest(null)}
        />
      </motion.div>
    </div>
  );
}
