import heic2any from "heic2any";


export const convertHeicToJpgBatch = async (files: File[]): Promise<File[]> => {
    const convertedFiles: File[] = [];

    await Promise.all(files.map(async (file) => {
        console.log("📂 Processing file:", file.name, "Type:", file.type);

        if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
            try {
                console.log("🚀 Converting HEIC:", file.name);

                const arrayBuffer = await file.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);  // 确保格式正确
                const blob = new Blob([uint8Array], { type: "image/heic" });

                const convertedBlob = await heic2any({
                    blob: blob,
                    toType: "image/jpeg",
                    quality: 0.8,
                }) as Blob;

                if (convertedBlob && convertedBlob instanceof Blob) {
                    const newFile = new File([convertedBlob], file.name.replace(/\.heic$/i, ".jpg"), { type: "image/jpeg" });
                    console.log("✅ HEIC Converted Successfully:", newFile.name);
                    convertedFiles.push(newFile);
                } else {
                    console.error("❌ HEIC conversion failed: Invalid Blob output for", file.name);
                }
            } catch (error) {
                console.error("❌ HEIC conversion failed for", file.name, "Error:", error);
            }
        } else {
            console.log("Skipping non-HEIC file:", file.name);
            convertedFiles.push(file);
        }
    }));

    console.log("Final converted files:", convertedFiles.map(f => f.name));
    return convertedFiles;
};

export const convertHeicToJpg = async (file: File): Promise<File | null> => {
    if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
        try {
            console.log(`Converting HEIC file: ${file.name}`);
            const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" }) as Blob;

            if (!convertedBlob || !(convertedBlob instanceof Blob)) {
                console.error("HEIC conversion failed: Invalid Blob output");
                return null;
            }

            const newFile = new File([convertedBlob], file.name.replace(/\.heic$/i, ".jpg"), {
                type: "image/jpeg"
            });

            console.log(`HEIC converted successfully: ${newFile.name}`);
            return newFile;

        } catch (error) {
            console.error("HEIC conversion failed:", error);
            return null;
        }
    }
    return file;
};


export const dataURLtoBlob = (dataURL: string) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }