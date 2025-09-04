"use client";
import { EventStatus, PostType } from "@/types/enums";
import { slugifyText } from "@/utils/slugify";
import {
  Button,
  Card,
  Chip,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  MdAccessTime,
  MdCalendarMonth,
  MdCategory,
  MdDescription,
  MdLink,
  MdLocalOffer,
  MdTag,
  MdTitle,
} from "react-icons/md";
import "react-quill/dist/quill.snow.css";

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
    ["link", "image"],
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
  "image",
];

const formatDateTimeForISO = (dateTimeStr: any) => {
  if (!dateTimeStr) return "";

  if (
    dateTimeStr.includes("Z") ||
    dateTimeStr.includes("+") ||
    dateTimeStr.includes("-")
  ) {
    return dateTimeStr;
  }

  return `${dateTimeStr}:00Z`;
};

const formatISOForInput = (isoString: any) => {
  if (!isoString) return "";

  return isoString.replace("Z", "").replace(/(\+|-)\d\d:\d\d$/, "");
};

export default function PostForm({
  mode,
  onSubmit,
  register,
  errors,
  isSubmitting,
  handleSubmit,
  router,
  watch,
  setValue,
}: any) {
  const [contentAz, setContentAz] = useState("");
  const [contentRu, setContentRu] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const postType = watch("postType", PostType.BLOG);
  const isEvent = postType === PostType.EVENT;
  const isOffer = postType === PostType.OFFERS;
  const isPublished = watch("published", false);

  useEffect(() => {
    if (mode === "edit") {
      const watchedContentAz = watch("content.az");
      const watchedContentRu = watch("content.ru");
      const watchedTags = watch("tags");
      const watchedEventDate = watch("eventDate");
      const watchedOfferStartDate = watch("offerStartDate");
      const watchedOfferEndDate = watch("offerEndDate");
      const watchedSlugAz = watch("slug.az");
      const watchedSlugRu = watch("slug.ru");

      if (watchedContentAz) setContentAz(watchedContentAz);
      if (watchedContentRu) setContentRu(watchedContentRu);
      if (watchedTags) setTags(watchedTags);

      if (watchedEventDate) {
        setValue("eventDate", formatISOForInput(watchedEventDate));
      }

      if (watchedOfferStartDate) {
        setValue("offerStartDate", formatISOForInput(watchedOfferStartDate));
      }

      if (watchedOfferEndDate) {
        setValue("offerEndDate", formatISOForInput(watchedOfferEndDate));
      }

      if (!watchedSlugAz && watch("title.az")) {
        setValue("slug.az", slugifyText(watch("title.az")));
      }

      if (!watchedSlugRu && watch("title.ru")) {
        setValue("slug.ru", slugifyText(watch("title.ru")));
      }
    }
  }, [mode, watch, setValue]);

  const handleTitleChange = (lang: string, value: string) => {
    const slugValue = slugifyText(value);
    setValue(`slug.${lang}`, slugValue);
  };

  const handleContentChange = (lang: string, value: string) => {
    setValue(`content.${lang}`, value);
    if (lang === "az") {
      setContentAz(value);
    } else {
      setContentRu(value);
    }

    const currentSlug = watch(`slug.${lang}`);
    if (!currentSlug) {
      const title = watch(`title.${lang}`);
      if (title) {
        setValue(`slug.${lang}`, slugifyText(title));
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    setValue("tags", newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = (data: any) => {
    const newData = {
      ...data,
      ...(data.eventDate && {
        eventDate: formatDateTimeForISO(data.eventDate),
      }),
      ...(data.offerStartDate && {
        offerStartDate: formatDateTimeForISO(data.offerStartDate),
      }),
      ...(data.offerEndDate && {
        offerEndDate: formatDateTimeForISO(data.offerEndDate),
      }),
    };
    onSubmit(newData);
  };

  return (
    <div className="p-6 min-h-screen w-full flex items-center justify-center">
      <div className="w-full">
        <Card className="w-full max-w-4xl p-6 bg-white shadow-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-black">
              {mode === "create" ? "Yeni Post Yarat" : "Posta Düzəliş Et"}
            </h1>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
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
                  Məzmun (AZ)
                </label>
                <div className="h-64">
                  <ReactQuill
                    theme="snow"
                    value={contentAz}
                    onChange={(value) => handleContentChange("az", value)}
                    modules={modules}
                    formats={formats}
                    className="h-48 bg-white"
                    readOnly={isSubmitting}
                  />
                </div>
                {errors.content?.az && (
                  <p className="text-danger text-sm">
                    {errors.content.az.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MdDescription className="text-gray-400" />
                  Содержание (RU)
                </label>
                <div className="h-64">
                  <ReactQuill
                    theme="snow"
                    value={contentRu}
                    onChange={(value) => handleContentChange("ru", value)}
                    modules={modules}
                    formats={formats}
                    className="h-48 bg-white"
                    readOnly={isSubmitting}
                  />
                </div>
                {errors.content?.ru && (
                  <p className="text-danger text-sm">
                    {errors.content.ru.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Şəkil</label>
                <Input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  {...register("image", {
                    required: mode === "create" ? "Şəkil tələb olunur" : false,
                  })}
                />
                {errors.image && (
                  <p className="text-tiny text-danger">
                    {errors.image.message}
                  </p>
                )}
                {previewUrl && (
                  <div className="relative w-32 h-32 mx-auto mt-2 rounded-full overflow-hidden">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Select
                label="Post Növü"
                variant="bordered"
                startContent={<MdCategory className="text-gray-400" />}
                isDisabled={isSubmitting}
                defaultSelectedKeys={[watch("postType") || PostType.BLOG]}
                {...register("postType")}
                isInvalid={!!errors.postType}
                errorMessage={errors.postType?.message}
                classNames={{
                  trigger:
                    "bg-white border-2 hover:border-primary focus:border-primary",
                  value: "bg-transparent",
                }}
              >
                <SelectItem key={PostType.BLOG} value={PostType.BLOG}>
                  Bloq
                </SelectItem>
                <SelectItem key={PostType.NEWS} value={PostType.NEWS}>
                  Xəbər
                </SelectItem>
                <SelectItem key={PostType.EVENT} value={PostType.EVENT}>
                  Tədbir
                </SelectItem>
                <SelectItem key={PostType.OFFERS} value={PostType.OFFERS}>
                  Kampaniya
                </SelectItem>
              </Select>
            </div>

            {isEvent && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <DatePicker
                    label="Tədbir tarixi"
                    variant="bordered"
                    startContent={<MdCalendarMonth className="text-gray-400" />}
                    isDisabled={isSubmitting}
                    onChange={(date) => {
                      console.log(
                        "Selected date:",
                        date.toDate("UTC").toISOString()
                      );
                      setValue("eventDate", date.toDate("UTC").toISOString());
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Select
                    label="Tədbir statusu"
                    variant="bordered"
                    startContent={<MdAccessTime className="text-gray-400" />}
                    isDisabled={isSubmitting}
                    defaultSelectedKeys={[
                      watch("eventStatus") || EventStatus.UPCOMING,
                    ]}
                    {...register("eventStatus", {
                      required: isEvent ? "Tədbir statusu tələb olunur" : false,
                    })}
                    isInvalid={!!errors.eventStatus}
                    errorMessage={errors.eventStatus?.message}
                    classNames={{
                      trigger:
                        "bg-white border-2 hover:border-primary focus:border-primary",
                      value: "bg-transparent",
                    }}
                  >
                    <SelectItem
                      key={EventStatus.UPCOMING}
                      value={EventStatus.UPCOMING}
                    >
                      Gələcək
                    </SelectItem>
                    <SelectItem
                      key={EventStatus.ONGOING}
                      value={EventStatus.ONGOING}
                    >
                      Davam edir
                    </SelectItem>
                    <SelectItem key={EventStatus.PAST} value={EventStatus.PAST}>
                      Keçmiş
                    </SelectItem>
                  </Select>
                </div>
              </div>
            )}

            {isOffer && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <DatePicker
                    label="Kampaniyanın başlama tarixi"
                    variant="bordered"
                    startContent={<MdCalendarMonth className="text-gray-400" />}
                    isDisabled={isSubmitting}
                    onChange={(date) => {
                      setValue(
                        "offerStartDate",
                        date.toDate("UTC").toISOString()
                      );
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <DatePicker
                    label="Kampaniyanın bitmə tarixi"
                    variant="bordered"
                    startContent={<MdCalendarMonth className="text-gray-400" />}
                    isDisabled={isSubmitting}
                    onChange={(date) => {
                      setValue(
                        "offerEndDate",
                        date.toDate("UTC").toISOString()
                      );
                    }}
                  />
                  {errors.offerEndDate && (
                    <p className="text-danger text-sm">
                      {errors.offerEndDate.message}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Qeyd: Kampaniyanın statusu (Gələcək/Davam edir/Keçmiş)
                    başlama və bitmə tarixlərinə əsasən avtomatik təyin olunur.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MdTag className="text-gray-400" />
                Teqlər
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    onClose={() => handleRemoveTag(tag)}
                    variant="flat"
                    color="warning"
                  >
                    {tag}
                  </Chip>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Yeni teq əlavə et"
                  variant="bordered"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  startContent={<MdLocalOffer className="text-gray-400" />}
                  isDisabled={isSubmitting}
                  classNames={{
                    input: "bg-transparent",
                    inputWrapper: [
                      "bg-white border-2 hover:border-primary focus:border-primary",
                    ],
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  isDisabled={!tagInput.trim() || isSubmitting}
                  className="bg-jsyellow text-white"
                >
                  Əlavə et
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-small font-medium">Status</span>
                <span className="text-tiny text-default-400">
                  Post{" "}
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
