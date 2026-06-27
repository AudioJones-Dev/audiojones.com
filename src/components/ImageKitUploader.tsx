"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/Toast";

declare global {
  interface Window {
    ImageKit: any;
  }
}

export default function ImageKitUploader() {
  const ikRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);
  const { show } = useToast();

  useEffect(() => {
    // When the SDK is loaded, initialize ImageKit
    const onReady = () => {
      if (window.ImageKit && !ikRef.current) {
        ikRef.current = new window.ImageKit({
          publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
          urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
          authenticationEndpoint: "/api/imagekit-auth",
        });
        setReady(true);
      }
    };

    // If the script was already loaded
    if (typeof window !== "undefined" && (window as any).ImageKit) {
      onReady();
      return () => {};
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/imagekit-javascript/dist/imagekit.min.js";
    script.async = true;
    script.addEventListener("load", onReady);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", onReady);
      script.remove();
    };
  }, []);

  const onUpload = async () => {
    const input = document.getElementById("ik-file") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) return;
    if (!ikRef.current) return;

    setStatus("Uploading...");
    try {
      const resp = await ikRef.current.upload({
        file,
        fileName: file.name,
        folder: "/AUDIOJONES.COM/uploads",
        tags: ["site-upload"],
      });
      setResult({ url: resp.url, name: resp.name });
      setStatus("Upload complete");
      show({ title: "Uploaded", description: resp.name, variant: "success" });
      // eslint-disable-next-line no-console
      console.log(resp);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setStatus("Upload failed");
      show({ title: "Upload failed", variant: "error" });
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3">
        <input id="ik-file" type="file" accept="image/*" className="text-white" />
        <button
          id="ik-upload"
          onClick={onUpload}
          disabled={!ready}
          className="rounded-full px-5 py-2 bg-white text-black font-semibold disabled:opacity-50"
        >
          Upload
        </button>
      </div>
      <p className="text-white/80 mt-3 text-sm" data-testid="ik-status">{status}</p>
      {result && (
        <div className="mt-3 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${result.url}?tr=w-120,h-120,fo-auto`}
            alt={result.name}
            width={120}
            height={120}
            className="rounded-md ring-1 ring-white/10"
          />
          <a href={result.url} target="_blank" className="underline">
            {result.name}
          </a>
        </div>
      )}
    </div>
  );
}
