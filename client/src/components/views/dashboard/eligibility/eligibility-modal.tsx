"use client";
import { Course, Eligibility } from "@/types/course";
import api from "@/utils/api/axios";
import { getIcon } from "@/utils/icon";
import {
  Button,
  Card,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courseId?: string;
  onUpdate: () => void;
  course: Course;
}

export default function EligibilityModal({
  isOpen,
  onClose,
  courseId,
  onUpdate,
  course,
}: Props) {
  const [eligibilities, setEligibilities] = useState<Eligibility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen || !courseId) return;
      try {
        setLoading(true);
        const { data } = await api.get("/course-eligibility");
        setEligibilities(data.items);
      } catch (error) {
        console.error("Tələblər yüklənmədi:", error);
        toast.error("Tələblər yüklənə bilmədi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, courseId]);

  const handleCheckboxChange = async (
    eligibilityId: string,
    isSelected: boolean
  ) => {
    try {
      if (isSelected) {
        await api.post(
          `/course-eligibility/${eligibilityId}/courses/${courseId}`
        );
        toast.success("Tələb əlavə edildi");
        onClose();
      } else {
        await api.delete(
          `/course-eligibility/${eligibilityId}/courses/${courseId}`
        );
        toast.success("Tələb silindi");
        onClose();
      }
      onUpdate();
      const { data } = await api.get("/course-eligibility");
      setEligibilities(data.items);
    } catch (error) {
      console.error("Əməliyyat xətası:", error);
      toast.error("Əməliyyat uğursuz oldu");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">Kurs Tələbləri</h2>
              <p className="text-small text-default-500">
                {course.title.az} kursu üçün tələbləri seçin
              </p>
            </ModalHeader>
            <ModalBody className="!bg-white">
              <ScrollShadow className="!bg-white max-h-[500px] shadow-none">
                <div className="grid !bg-white grid-cols-1 gap-4">
                  {loading ? (
                    <p>Yüklənir...</p>
                  ) : (
                    eligibilities.map((eligibility) => {
                      const IconComponent = getIcon(eligibility.icon);

                      return (
                        <Card
                          key={eligibility.id}
                          className={`p-4 transition-all shadow-none duration-200 ${
                            course?.eligibility?.some(
                              (e) => e.eligibilityId === eligibility.id
                            )
                              ? "border-2 border-jsyellow bg-jsyellow/5"
                              : "hover:border-jsyellow/50 border-2 border-gray-400"
                          }`}
                        >
                          <Checkbox
                            classNames={{
                              label: "w-full",
                              wrapper: "before:border-jsyellow",
                            }}
                            isSelected={course?.eligibility?.some(
                              (e) => e.eligibilityId === eligibility.id
                            )}
                            onValueChange={(isSelected) =>
                              handleCheckboxChange(eligibility.id, isSelected)
                            }
                          >
                            <div className="flex items-center gap-3 w-full">
                              <span className="material-icons text-jsyellow text-xl mt-1">
                                <IconComponent className="w-6 h-6" />
                              </span>
                              <div className="flex-1">
                                <p className="font-medium text-foreground">
                                  {eligibility.title.az}
                                </p>
                                <p className="text-small text-default-500 mt-1">
                                  {eligibility.description.az}
                                </p>
                              </div>
                            </div>
                          </Checkbox>
                        </Card>
                      );
                    })
                  )}
                </div>
              </ScrollShadow>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} className="font-medium">
                Bağla
              </Button>
              <Button
                color="warning"
                variant="flat"
                className="bg-jsyellow text-white font-medium"
                onPress={onClose}
              >
                Təsdiqlə
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
