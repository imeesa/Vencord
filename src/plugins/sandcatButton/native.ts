/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors (including imeesa)
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { IpcMainInvokeEvent } from "electron";
interface SandcatResponse {
    image?: string;
}

export async function getSandcatImage(_: IpcMainInvokeEvent, apiUrl: string, imageTimeout: number) {
    try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), imageTimeout);

        const res = await fetch(apiUrl, {
            method: "GET",
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
            throw new Error(`Failed to fetch Sandcat image: ${res.status} ${res.statusText}`);
        }

        const data = await res.json() as SandcatResponse;

        // Explicit null/undefined check
        if (!data || typeof data !== "object") {
            throw new Error("Invalid response from Sandcat API: data is not an object");
        }

        if (!data.image || typeof data.image !== "string") {
            throw new Error("Invalid response from Sandcat API: missing or invalid image URL");
        }

        const imageController = new AbortController();
        const imageTimeoutId = setTimeout(() => imageController.abort(), imageTimeout);

        const image = await fetch(data.image, { signal: imageController.signal });

        clearTimeout(imageTimeoutId);

        if (!image.ok) {
            throw new Error(`Failed to fetch Sandcat image data: ${image.status} ${image.statusText}`);
        }

        const imageData = await image.arrayBuffer();

        // Convert ArrayBuffer to regular array for IPC transmission
        const buffer = new Uint8Array(imageData);
        const mimeType = image.headers.get("Content-Type") || "image/png";
        const filename = data.image.split("/").pop() || "sandcat.png";

        // Create a simple serializable object
        const result = {
            status: res.status,
            imageData: Array.from(buffer),
            imageMimeType: mimeType,
            imageFilename: filename
        };

        return result;
    } catch (e) {
        console.error("Error fetching Sandcat image:", e);
        return {
            status: -1,
            error: e instanceof Error ? e.message : String(e),
            imageData: [],
            imageMimeType: "",
            imageFilename: ""
        };
    }
}
