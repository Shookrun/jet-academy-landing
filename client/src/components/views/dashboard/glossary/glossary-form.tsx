import api from "@/utils/api/axios";
import { slugifyText } from "@/utils/slugify";
import {
  Button,
  Card,
  Checkbox,
  Chip,
  ChipProps,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import { MdCategory, MdDescription, MdSearch, MdTag, MdTitle } from "react-icons/md";
import "react-quill/dist/quill.snow.css";
import { debounce } from "lodash";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "color",
  "background",
];

interface GlossaryCategory {
  id: string;
  name: {
    az: string;
    ru: string;
  };
}

interface GlossaryTerm {
  id: string;
  name: {
    az: string;
    ru: string;
  };
}

interface GlossaryFormProps {
  mode: "create" | "edit";
  onSubmit: (data: any) => Promise<void>;
  register: any;
  errors: any;
  isSubmitting: boolean;
  handleSubmit: any;
  router: any;
  setValue?: any;
  getValues?: any;
  watch?: any;
  initialValues?: any;
}

export default function GlossaryForm({
  mode,
  onSubmit,
  register,
  errors,
  isSubmitting,
  handleSubmit,
  router,
  setValue,
  watch,
  initialValues,
}: GlossaryFormProps) {
  const [categories, setCategories] = useState<GlossaryCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [relatedTerms, setRelatedTerms] = useState<GlossaryTerm[]>([]);
  console.log(relatedTerms)
  const [isLoadingTerms, setIsLoadingTerms] = useState(false);
  const [tags, setTags] = useState<string[]>(initialValues?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [selectedRelatedTerms, setSelectedRelatedTerms] = useState<string[]>(
    initialValues?.relatedTerms || []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTerms, setFilteredTerms] = useState<GlossaryTerm[]>([]);

  const [definitionAz, setDefinitionAz] = useState("");
  const [definitionRu, setDefinitionRu] = useState("");

  useEffect(() => {
    if (mode === "edit") {
      const watchedDefAz = watch("definition.az");
      const watchedDefRu = watch("definition.ru");
      if (watchedDefAz) setDefinitionAz(watchedDefAz);
      if (watchedDefRu) setDefinitionRu(watchedDefRu);
    }
  }, [mode, watch]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/glossary-categories");
    
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const fetchRelatedTerms = useCallback(async () => {
    try {
      setIsLoadingTerms(true);
      const { data } = await api.get(
        `https://api.jetacademy.az/api/glossary/search?q=${encodeURIComponent(searchTerm)}`
      );
     


      const terms = Array.isArray(data.items)
        ? data.items.map((item: any) => ({
            id: item.id,
            name: {
              az: item.term?.az || "", 
              ru: item.term?.ru || "",
            },
          }))
        : [];

    


      const filteredTerms =
        mode === "edit" && initialValues
          ? terms.filter((term: GlossaryTerm) => term.id !== initialValues.id)
          : terms;

      setRelatedTerms(filteredTerms || []);
      setFilteredTerms(filteredTerms || []);
    } catch (error: any) {
      console.error("Error fetching related terms:", error.message, error.response?.data);
      setRelatedTerms([]);
      setFilteredTerms([]);
    } finally {
      setIsLoadingTerms(false);
    }
  }, [initialValues, mode, searchTerm]);

  const debouncedFetchRelatedTerms = useCallback(debounce(fetchRelatedTerms, 300), [
    fetchRelatedTerms,
  ]);

  useEffect(() => {
    fetchCategories();
    debouncedFetchRelatedTerms();

    return () => {
      debouncedFetchRelatedTerms.cancel();
    };
  }, [debouncedFetchRelatedTerms]);

  useEffect(() => {
    if (initialValues) {
      if (initialValues.tags) {
        setTags(initialValues.tags);
      }
      if (initialValues.relatedTerms) {
        setSelectedRelatedTerms(initialValues.relatedTerms);
      }
    }
  }, [initialValues]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      if (setValue) {
        setValue("tags", newTags);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    if (setValue) {
      setValue("tags", newTags);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRelatedTermChange = (termId: string) => {
    let newSelected;

    if (selectedRelatedTerms.includes(termId)) {
      newSelected = selectedRelatedTerms.filter((id) => id !== termId);
    } else {
      newSelected = [...selectedRelatedTerms, termId];
    }

    setSelectedRelatedTerms(newSelected);
    if (setValue) {
      setValue("relatedTerms", newSelected);
    }
  };

  const getTagColor = (tag: string): ChipProps["color"] => {
    const colors: ChipProps["color"][] = [
      "primary",
      "secondary",
      "success",
      "warning",
      "danger",
    ];
    const index = tag.length % colors.length;
    return colors[index];
  };

  const handleDefinitionChange = (value: string, lang: string) => {
    if (setValue) {
      setValue(`definition.${lang}`, value);
    }
    if (lang === "az") {
      setDefinitionAz(value);
    } else {
      setDefinitionRu(value);
    }
  };

  const handleTermChange = (lang: string, value: string) => {
    const slugValue = slugifyText(value);
    setValue(`slug.${lang}`, slugValue);
  };

  return (
    <div className="p-6 min-h-screen w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="w-full max-w-4xl p-6 bg-white shadow-lg mx-auto">
          <div className="text-center mb-8">
            <motion.h1
              className="text-2xl font-bold text-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {mode === "create" ? "Yeni Termin Yarat" : "Terminə Düzəliş Et"}
            </motion.h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  label="Termin (AZ)"
                  variant="bordered"
                  startContent={<MdTitle className="text-gray-400" />}
                  isDisabled={isSubmitting}
                  {...register("term.az", {
                    required: "Termin tələb olunur",
                    minLength: {
                      value: 2,
                      message: "Termin ən azı 2 simvol olmalıdır",
                    },
                    onChange: (e: any) =>
                      handleTermChange("az", e.target.value),
                  })}
                  isInvalid={!!errors.term?.az}
                  errorMessage={errors.term?.az?.message}
                  classNames={{
                    input: "bg-transparent",
                    inputWrapper: [
                      "bg-white border-2 hover:border-primary focus:border-primary",
                    ],
                  }}
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="text"
                  label="Термин (RU)"
                  variant="bordered"
                  startContent={<MdTitle className="text-gray-400" />}
                  isDisabled={isSubmitting}
                  {...register("term.ru", {
                    required: "Термин обязателен",
                    minLength: {
                      value: 2,
                      message: "Минимум 2 символа",
                    },
                    onChange: (e: any) =>
                      handleTermChange("ru", e.target.value),
                  })}
                  isInvalid={!!errors.term?.ru}
                  errorMessage={errors.term?.ru?.message}
                  classNames={{
                    input: "bg-transparent",
                    inputWrapper: [
                      "bg-white border-2 hover:border-primary focus:border-primary",
                    ],
                  }}
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="text"
                  label="Slug (AZ)"
                  variant="bordered"
                  startContent={<MdTitle className="text-gray-400" />}
                  isDisabled={true}
                  {...register("slug.az")}
                  isInvalid={!!errors.slug?.az}
                  errorMessage={errors.slug?.az?.message}
                  classNames={{
                    input: "bg-transparent",
                    inputWrapper: [
                      "bg-white border-2 hover:border-primary focus:border-primary",
                    ],
                  }}
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="text"
                  label="Slug (RU)"
                  variant="bordered"
                  startContent={<MdTitle className="text-gray-400" />}
                  isDisabled={true}
                  {...register("slug.ru")}
                  isInvalid={!!errors.slug?.ru}
                  errorMessage={errors.slug?.ru?.message}
                  classNames={{
                    input: "bg-transparent",
                    inputWrapper: [
                      "bg-white border-2 hover:border-primary focus:border-primary",
                    ],
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                <Select
                  label="Kateqoriya"
                  variant="bordered"
                  startContent={<MdCategory className="text-gray-400" />}
                  isDisabled={isSubmitting || isLoadingCategories}
                  {...register("categoryId")}
                  isInvalid={!!errors.categoryId}
                  errorMessage={errors.categoryId?.message}
                  classNames={{
                    trigger:
                      "bg-white border-2 hover:border-primary focus:border-primary",
                    value: "bg-transparent",
                  }}
                  isLoading={isLoadingCategories}
                >
                  {categories.map((category: GlossaryCategory) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name.az}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="space-y-2 pt-4">
                <Checkbox
                  isSelected={watch ? watch("published") : false}
                  onValueChange={(value) =>
                    setValue && setValue("published", value)
                  }
                  size="lg"
                  color="success"
                >
                  Dərc edilsin
                </Checkbox>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MdDescription className="text-gray-400" />
                  Tərif (AZ)
                </label>
                <div className="h-64">
                  <ReactQuill
                    theme="snow"
                    value={definitionAz}
                    onChange={(value) => handleDefinitionChange(value, "az")}
                    modules={modules}
                    formats={formats}
                    className="h-48 bg-white"
                    readOnly={isSubmitting}
                  />
                </div>
                {errors.definition?.az && (
                  <p className="text-danger text-sm">
                    {errors.definition.az.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MdDescription className="text-gray-400" />
                  Определение (RU)
                </label>
                <div className="h-64">
                  <ReactQuill
                    theme="snow"
                    value={definitionRu}
                    onChange={(value) => handleDefinitionChange(value, "ru")}
                    modules={modules}
                    formats={formats}
                    className="h-48 bg-white"
                    readOnly={isSubmitting}
                  />
                </div>
                {errors.definition?.ru && (
                  <p className="text-danger text-sm">
                    {errors.definition.ru.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  type="text"
                  label="Teq əlavə edin"
                  variant="bordered"
                  startContent={<MdTag className="text-gray-400" />}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-grow"
                  classNames={{
                    input: "bg-transparent",
                    inputWrapper: [
                      "bg-white border-2 hover:border-primary focus:border-primary",
                    ],
                  }}
                />
                <Button
                  onClick={handleAddTag}
                  type="button"
                  className="bg-jsyellow text-white"
                  isDisabled={!tagInput.trim()}
                >
                  Əlavə et
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[50px]">
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    onClose={() => handleRemoveTag(tag)}
                    color={getTagColor(tag)}
                    variant="flat"
                  >
                    {tag}
                  </Chip>
                ))}
                {tags.length === 0 && (
                  <span className="text-gray-400 text-sm">
                    Teqlər əlavə edin
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-medium">Əlaqəli Terminlər</h3>
              <Input
                type="text"
                label="Termin axtar"
                variant="bordered"
                startContent={<MdSearch className="text-gray-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                classNames={{
                  input: "bg-transparent",
                  inputWrapper: [
                    "bg-white border-2 hover:border-primary focus:border-primary",
                  ],
                }}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border-2 border-gray-200 rounded-lg">
                {isLoadingTerms ? (
                  <div className="col-span-full text-center">Yüklənir...</div>
                ) : filteredTerms.length > 0 ? (
                  filteredTerms.map((term) => (
                    <div key={term.id} className="flex items-center gap-2">
                      <Checkbox
                        isSelected={selectedRelatedTerms.includes(term.id)}
                        onValueChange={() => handleRelatedTermChange(term.id)}
                      >
                        <span className="text-sm">{term.name.az}</span>
                        <span className="text-xs text-gray-400 block">
                          {term.name.ru}
                        </span>
                      </Checkbox>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-400">
                    Uyğun terminlər yoxdur
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <Button
                onClick={() => router.back()}
                variant="light"
                className="text-gray-600"
                size="lg"
              >
                Ləğv et
              </Button>
              <Button
                type="submit"
                className="bg-jsyellow text-white hover:bg-jsyellow/90 disabled:opacity-50"
                size="lg"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {mode === "create"
                  ? isSubmitting
                    ? "Yaradılır..."
                    : "Yarat"
                  : isSubmitting
                  ? "Yenilənir..."
                  : "Yenilə"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}