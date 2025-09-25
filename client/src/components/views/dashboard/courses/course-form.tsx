"use client";
import { slugifyText } from "@/utils/slugify";
import {
  Button,
  Card,
  Chip,
  ChipProps,
  Input,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import {
  MdAccessTime,
  MdDescription,
  MdLink,
  MdSignalCellular4Bar,
  MdStar,
  MdTitle,
  MdTag,
  MdImage,
  MdPeople,
} from "react-icons/md";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import Image from "next/image";

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

export default function CourseForm({
  mode,
  onSubmit,
  register,
  errors,
  isSubmitting,
  handleSubmit,
  router,
  watch,
  setValue,
  initialValues,
}: any) {
  const [tagsAz, setTagsAz] = useState<string[]>(
    initialValues?.newTags?.az || []
  );
  const [tagsRu, setTagsRu] = useState<string[]>(
    initialValues?.newTags?.ru || []
  );
  const [tagInputAz, setTagInputAz] = useState("");
  const [tagInputRu, setTagInputRu] = useState("");

  const [descriptionAz, setDescriptionAz] = useState("");
  const [descriptionRu, setDescriptionRu] = useState("");
  const [shortDescriptionAz, setShortDescriptionAz] = useState("");
  const [shortDescriptionRu, setShortDescriptionRu] = useState("");
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  console.log(selectedImage)
  useEffect(() => {
    if (mode === "edit" && initialValues) {
      const watchedDescAz = watch("description.az");
      const watchedDescRu = watch("description.ru");
      const watchedShortDescAz = watch("shortDescription.az");
      const watchedShortDescRu = watch("shortDescription.ru");
      
      if (watchedDescAz) setDescriptionAz(watchedDescAz);
      if (watchedDescRu) setDescriptionRu(watchedDescRu);
      if (watchedShortDescAz) setShortDescriptionAz(watchedShortDescAz);
      if (watchedShortDescRu) setShortDescriptionRu(watchedShortDescRu);

      if (initialValues?.imageUrl) {
        setImagePreview(initialValues.imageUrl);
        
      }
    }
  }, [mode, watch, initialValues]);

  useEffect(() => {
    if (initialValues) {
      if (initialValues.newTags?.az) setTagsAz(initialValues.newTags.az);
      if (initialValues.newTags?.ru) setTagsRu(initialValues.newTags.ru);
    }
  }, [initialValues]);

  const levels = [
    {
      value: {
        az: "Başlanğıc",
        ru: "Начинающий",
      },
    },
    {
      value: {
        az: "Orta",
        ru: "Средний",
      },
    },
    {
      value: {
        az: "Qabaqcıl",
        ru: "Продвинутый",
      },
    },
  ];

  const isPublished = watch("published", false);

  const handleTitleChange = (lang: string, value: string) => {
    const slugValue = slugifyText(value);
    setValue(`slug.${lang}`, slugValue);
  };

  const handleDescriptionChange = (lang: string, value: string) => {
    setValue(`description.${lang}`, value);
    if (lang === "az") {
      setDescriptionAz(value);
    } else {
      setDescriptionRu(value);
    }
  };

  const handleShortDescriptionChange = (lang: string, value: string) => {
    setValue(`shortDescription.${lang}`, value);
    if (lang === "az") {
      setShortDescriptionAz(value);
    } else {
      setShortDescriptionRu(value);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setValue("image", file);
      

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };




  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    setValue("image", null);

    const fileInput = document.getElementById("course-image") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
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

  const handleAddTagAz = () => {
    if (tagInputAz.trim() && !tagsAz.includes(tagInputAz.trim())) {
      const newTags = [...tagsAz, tagInputAz.trim()];
      setTagsAz(newTags);
      setValue("newTags.az", newTags);
      setTagInputAz("");
    }
  };

  const handleAddTagRu = () => {
    if (tagInputRu.trim() && !tagsRu.includes(tagInputRu.trim())) {
      const newTags = [...tagsRu, tagInputRu.trim()];
      setTagsRu(newTags);
      setValue("newTags.ru", newTags);
      setTagInputRu("");
    }
  };

  const handleRemoveTagAz = (tagToRemove: string) => {
    const newTags = tagsAz.filter((tag) => tag !== tagToRemove);
    setTagsAz(newTags);
    setValue("newTags.az", newTags);
  };

  const handleRemoveTagRu = (tagToRemove: string) => {
    const newTags = tagsRu.filter((tag) => tag !== tagToRemove);
    setTagsRu(newTags);
    setValue("newTags.ru", newTags);
  };

  const handleKeyDownAz = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInputAz.trim()) {
      e.preventDefault();
      handleAddTagAz();
    }
  };

  const handleKeyDownRu = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInputRu.trim()) {
      e.preventDefault();
      handleAddTagRu();
    }
  };

  return (
    <div className="p-6 min-h-screen w-full flex items-center justify-center">
      <div className="w-full">
        <Card className="w-full max-w-4xl p-6 bg-white shadow-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-black">
              {mode === "create" ? "Yeni Kurs Yarat" : "Kursa Düzəliş Et"}
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <MdImage className="text-gray-400" />
                <label className="text-sm font-medium">Kurs Şəkli</label>
              </div>


            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MdDescription className="text-gray-400" />
                  Qısa Təsvir (AZ)
                </label>
                <Input
                  type="text"
                  variant="bordered"
                  placeholder="Texnologiya dünyasına ilk addımını at!"
                  value={shortDescriptionAz}
                  onChange={(e) => handleShortDescriptionChange("az", e.target.value)}
                  isDisabled={isSubmitting}
                  classNames={{
                    input: "bg-transparent",
                    inputWrapper: [
                      "bg-white border-2 hover:border-primary focus:border-primary",
                    ],
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MdDescription className="text-gray-400" />
                  Краткое описание (RU)
                </label>
                <Input
                  type="text"
                  variant="bordered"
                  placeholder="Сделай первый шаг в мир технологий!"
                  value={shortDescriptionRu}
                  onChange={(e) => handleShortDescriptionChange("ru", e.target.value)}
                  isDisabled={isSubmitting}
                  classNames={{
                    input: "bg-transparent",
                    inputWrapper: [
                      "bg-white border-2 hover:border-primary focus:border-primary",
                    ],
                  }}
                />
              </div>
            </div>


            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Rəng Teması</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Arxa Plan Rəngi</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-12 h-10 rounded border border-gray-300"
                      {...register("backgroundColor")}
                    />
                    <Input
                      type="text"
                      variant="bordered"
                      placeholder="#FEF3C7"
                      {...register("backgroundColor")}
                      classNames={{
                        input: "bg-transparent",
                        inputWrapper: [
                          "bg-white border-2 hover:border-primary focus:border-primary",
                        ],
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Kənar Rəngi</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-12 h-10 rounded border border-gray-300"
                      {...register("borderColor")}
                    />
                    <Input
                      type="text"
                      variant="bordered"
                      placeholder="#F59E0B"
                      {...register("borderColor")}
                      classNames={{
                        input: "bg-transparent",
                        inputWrapper: [
                          "bg-white border-2 hover:border-primary focus:border-primary",
                        ],
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mətn Rəngi</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-12 h-10 rounded border border-gray-300"
                      {...register("textColor")}
                    />
                    <Input
                      type="text"
                      variant="bordered"
                      placeholder="#1F2937"
                      {...register("textColor")}
                      classNames={{
                        input: "bg-transparent",
                        inputWrapper: [
                          "bg-white border-2 hover:border-primary focus:border-primary",
                        ],
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {imagePreview ? (
                  <div className="relative">
                    <div className="relative w-[200px] h-48 rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Course preview"
                        fill
                        className="object-cover"
                        unoptimized={true}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white min-w-0 w-8 h-8 p-0"
                      size="sm"
                    >
                      ×
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MdImage className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <label htmlFor="course-image" className="cursor-pointer">
                        <span className="text-primary hover:text-primary/80">
                          Şəkil seçin
                        </span>
                        <span className="text-gray-500"> və ya buraya atın</span>
                      </label>
                      <input
                        id="course-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF (max. 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  label="Başlıq (AZ)"
                  variant="bordered"
                  startContent={<MdTitle className="text-gray-400" />}
                  isDisabled={isSubmitting}
                  {...register("title.az", {
                    required: "Başlıq tələb olunur",
                    onChange: (e: any) =>
                      handleTitleChange("az", e.target.value),
                  })}
                  isInvalid={!!errors.title?.az}
                  errorMessage={errors.title?.az?.message}
                  classNames={{
                    input: "bg-transparent",
                    inputWrapper: [
                      "bg-white border-2 hover:border-primary focus:border-primary",
                    ],
                  }}
                />

                <Input
                  type="text"
                  label="Slug (AZ)"
                  variant="bordered"
                  startContent={<MdLink className="text-gray-400" />}
                  isDisabled={true}
                  {...register("slug.az")}
                  classNames={{
                    input: "bg-transparent",
                    inputWrapper: ["bg-white border-2"],
                  }}
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="text"
                  label="Заголовок (RU)"
                  variant="bordered"
                  startContent={<MdTitle className="text-gray-400" />}
                  isDisabled={isSubmitting}
                  {...register("title.ru", {
                    required: "Заголовок обязателен",
                    onChange: (e: any) =>
                      handleTitleChange("ru", e.target.value),
                  })}
                  isInvalid={!!errors.title?.ru}
                  errorMessage={errors.title?.ru?.message}
                  classNames={{
                    input: "bg-transparent",
                    inputWrapper: [
                      "bg-white border-2 hover:border-primary focus:border-primary",
                    ],
                  }}
                />

                <Input
                  type="text"
                  label="Slug (RU)"
                  variant="bordered"
                  startContent={<MdLink className="text-gray-400" />}
                  isDisabled={true}
                  {...register("slug.ru")}
                  classNames={{
                    input: "bg-transparent",
                    inputWrapper: ["bg-white border-2"],
                  }}
                />
              </div>
            </div>


            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MdDescription className="text-gray-400" />
                  Təsvir (AZ)
                </label>
                <div className="h-64">
                  <ReactQuill
                    theme="snow"
                    value={descriptionAz}
                    onChange={(value) => handleDescriptionChange("az", value)}
                    modules={modules}
                    formats={formats}
                    className="h-48 bg-white"
                    readOnly={isSubmitting}
                  />
                </div>
                {errors.description?.az && (
                  <p className="text-danger text-sm">
                    {errors.description.az.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MdDescription className="text-gray-400" />
                  Описание (RU)
                </label>
                <div className="h-64">
                  <ReactQuill
                    theme="snow"
                    value={descriptionRu}
                    onChange={(value) => handleDescriptionChange("ru", value)}
                    modules={modules}
                    formats={formats}
                    className="h-48 bg-white"
                    readOnly={isSubmitting}
                  />
                </div>
                {errors.description?.ru && (
                  <p className="text-danger text-sm">
                    {errors.description.ru.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Müddət (ay)"
                variant="bordered"
                startContent={<MdAccessTime className="text-gray-400" />}
                placeholder="məs: 12"
                isDisabled={isSubmitting}
                {...register("duration", {
                  required: "Müddət tələb olunur",
                  valueAsNumber: true,
                  validate: (value: number) => {
                    if (isNaN(value) || value <= 0) {
                      return "Müddət müsbət rəqəm olmalıdır";
                    }
                    return true;
                  },
                })}
                isInvalid={!!errors.duration}
                errorMessage={errors.duration?.message}
                classNames={{
                  input: "bg-transparent",
                  inputWrapper: [
                    "bg-white border-2 hover:border-primary focus:border-primary",
                  ],
                }}
              />

              <Input
                type="text"
                label="Yaş Aralığı"
                variant="bordered"
                startContent={<MdPeople className="text-gray-400" />}
                placeholder="məs: 9-15"
                isDisabled={isSubmitting}
                {...register("ageRange")}
                classNames={{
                  input: "bg-transparent",
                  inputWrapper: [
                    "bg-white border-2 hover:border-primary focus:border-primary",
                  ],
                }}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Select
                  label="Səviyyə (AZ)"
                  variant="bordered"
                  startContent={
                    <MdSignalCellular4Bar className="text-gray-400" />
                  }
                  isDisabled={isSubmitting}
                  defaultSelectedKeys={[watch("level.az") || "Başlanğıc"]}
                  {...register("level.az", {
                    required: "Səviyyə tələb olunur",
                  })}
                  isInvalid={!!errors.level?.az}
                  errorMessage={errors.level?.az?.message}
                  classNames={{
                    trigger:
                      "bg-white border-2 hover:border-primary focus:border-primary",
                    value: "bg-transparent",
                  }}
                >
                  {levels.map((level) => (
                    <SelectItem key={level.value.az} value={level.value.az}>
                      {level.value.az}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Select
                  label="Уровень (RU)"
                  variant="bordered"
                  startContent={
                    <MdSignalCellular4Bar className="text-gray-400" />
                  }
                  isDisabled={isSubmitting}
                  defaultSelectedKeys={[watch("level.ru") || "Начинающий"]}
                  {...register("level.ru", {
                    required: "Уровень обязателен",
                  })}
                  isInvalid={!!errors.level?.ru}
                  errorMessage={errors.level?.ru?.message}
                  classNames={{
                    trigger:
                      "bg-white border-2 hover:border-primary focus:border-primary",
                    value: "bg-transparent",
                  }}
                >
                  {levels.map((level) => (
                    <SelectItem key={level.value.ru} value={level.value.ru}>
                      {level.value.ru}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>


            <div className="space-y-2">
              <Input
                type="text"
                label="İkon"
                variant="bordered"
                startContent={<MdStar className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("icon", {
                  required: "İkon tələb olunur",
                })}
                isInvalid={!!errors.icon}
                errorMessage={errors.icon?.message}
                classNames={{
                  input: "bg-transparent",
                  inputWrapper: [
                    "bg-white border-2 hover:border-primary focus:border-primary",
                  ],
                }}
              />
            </div>


            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  type="text"
                  label="Teq əlavə edin (AZ)"
                  variant="bordered"
                  startContent={<MdTag className="text-gray-400" />}
                  value={tagInputAz}
                  onChange={(e) => setTagInputAz(e.target.value)}
                  onKeyDown={handleKeyDownAz}
                  className="flex-grow"
                  classNames={{
                    input: "bg-transparent",
                    inputWrapper: [
                      "bg-white border-2 hover:border-primary focus:border-primary",
                    ],
                  }}
                />
                <Button
                  onClick={handleAddTagAz}
                  type="button"
                  className="bg-jsyellow text-white"
                  isDisabled={!tagInputAz.trim()}
                >
                  Əlavə et
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[50px]">
                {tagsAz.map((tag, index) => (
                  <Chip
                    key={index}
                    onClose={() => handleRemoveTagAz(tag)}
                    color={getTagColor(tag)}
                    variant="flat"
                  >
                    {tag}
                  </Chip>
                ))}
                {tagsAz.length === 0 && (
                  <span className="text-gray-400 text-sm">
                    Teqlər əlavə edin (AZ)
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Input
                  type="text"
                  label="Добавить тег (RU)"
                  variant="bordered"
                  startContent={<MdTag className="text-gray-400" />}
                  value={tagInputRu}
                  onChange={(e) => setTagInputRu(e.target.value)}
                  onKeyDown={handleKeyDownRu}
                  className="flex-grow"
                  classNames={{
                    input: "bg-transparent",
                    inputWrapper: [
                      "bg-white border-2 hover:border-primary focus:border-primary",
                    ],
                  }}
                />
                <Button
                  onClick={handleAddTagRu}
                  type="button"
                  className="bg-jsyellow text-white"
                  isDisabled={!tagInputRu.trim()}
                >
                  Добавить
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[50px]">
                {tagsRu.map((tag, index) => (
                  <Chip
                    key={index}
                    onClose={() => handleRemoveTagRu(tag)}
                    color={getTagColor(tag)}
                    variant="flat"
                  >
                    {tag}
                  </Chip>
                ))}
                {tagsRu.length === 0 && (
                  <span className="text-gray-400 text-sm">
                    Добавьте теги (RU)
                  </span>
                )}
              </div>
            </div>


            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-small font-medium">Status</span>
                <span className="text-tiny text-default-400">
                  Kurs{" "}
                  {isPublished ? "dərc ediləcək" : "qaralama kimi saxlanılacaq"}
                </span>
              </div>
              <Switch
                isSelected={isPublished}
                size="lg"
                color="warning"
                {...register("published")}
              >
                {isPublished ? "Dərc edilib" : "Qaralama"}
              </Switch>
            </div>


            <div className="flex justify-end space-x-4">
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
      </div>
    </div>
  );
}