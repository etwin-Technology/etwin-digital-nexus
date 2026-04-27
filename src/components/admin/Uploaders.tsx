import { useRef, useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { apiUpload } from "@/lib/api";

/** Single image picker — uploads to backend and returns the public URL. */
export function ImageUploader({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File) => {
    setBusy(true);
    try {
      const res = await apiUpload(file, "image");
      onChange(res.url);
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1.5 flex items-center gap-3">
        <div className="h-20 w-20 rounded-lg bg-muted overflow-hidden flex items-center justify-center border border-border flex-shrink-0">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-semibold border border-primary/20 hover:bg-primary/20 disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
              {busy ? "Uploading…" : "Upload"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" /> Remove
              </button>
            )}
          </div>
          <input
            type="url"
            placeholder="or paste image URL"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md bg-input/50 border border-border px-3 py-1.5 text-xs focus:outline-none focus:border-primary/60"
          />
        </div>
      </div>
    </div>
  );
}

/** Multi-image gallery picker. */
export function GalleryUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFiles = async (files: FileList) => {
    setBusy(true);
    try {
      const uploads = await Promise.all(Array.from(files).map((f) => apiUpload(f, "image")));
      onChange([...value, ...uploads.map((u) => u.url)]);
      toast.success(`${uploads.length} image(s) added`);
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="text-xs uppercase tracking-wider text-muted-foreground">Gallery</span>
      <div className="mt-1.5 grid grid-cols-4 sm:grid-cols-6 gap-2">
        {value.map((url, i) => (
          <div key={url + i} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute top-1 right-1 h-5 w-5 inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {busy ? "…" : "Add"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/** File uploader (zip/pdf/etc.) for digital products. */
export function FileUploader({
  value,
  onChange,
  label = "Downloadable file",
}: {
  value: string;
  onChange: (path: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File) => {
    setBusy(true);
    try {
      const res = await apiUpload(file, "digital");
      onChange(res.path);
      toast.success(`File uploaded: ${res.name}`);
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1.5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary text-xs font-semibold border border-primary/20 hover:bg-primary/20 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
          {busy ? "Uploading…" : value ? "Replace file" : "Upload file"}
        </button>
        {value && (
          <>
            <span className="text-xs text-muted-foreground truncate flex-1">{value}</span>
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Clear
            </button>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
