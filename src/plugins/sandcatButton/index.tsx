/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors (including imeesa)
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ChatBarButton, ChatBarButtonFactory } from "@api/ChatButtons";
import { Devs } from "@utils/constants";
import { getCurrentChannel } from "@utils/discord";
import definePlugin, { PluginNative } from "@utils/types";
import { ChannelStore, DraftType, UploadHandler } from "@webpack/common";

import { settings } from "./settings";

const Native = VencordNative.pluginHelpers.SandcatButton as PluginNative<typeof import("./native")>;

/**
 * A wrapper for adding attachments to a channel.
 * Taken from https://discord.com/channels/1015060230222131221/1032770730703716362/1383071718003838998
 * @param files The files to attach
 * @param channelId The channel to attach them to
 */
export function addAttachments(files: File[], channelId: string) {
    UploadHandler.promptToUpload(files, ChannelStore.getChannel(channelId), DraftType.ChannelMessage);
}

/**
 * A utility function to convert various data formats to a Blob.
 * This function supports ArrayBuffer, Uint8Array, and arrays of numbers.
 * It is useful for preparing data to be sent as a file attachment.
 * @param data The data to convert to a Blob. Can be an ArrayBuffer, Uint8Array, or an array of numbers.
 * @param mimeType The MIME type of the Blob. Defaults to "image/png".
 * @returns Blob object containing the data.
 * @throws Error if the data is not in a valid format.
 */
function arrayToBlob(data: number[] | ArrayBuffer | Uint8Array, mimeType = "image/png"): Blob {
    if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
        return new Blob([data], { type: mimeType });
    }

    return new Blob([new Uint8Array(data)], { type: mimeType });
}

const SandcatChatBarIcon: ChatBarButtonFactory = ({ isMainChat }) => {
    if (!isMainChat) return null;

    const button = (
        <ChatBarButton
            tooltip="Add Sandcat Image"
            onClick={async e => {
                const currentChannel = getCurrentChannel();
                if (currentChannel === undefined) return;

                const image = await Native.getSandcatImage(settings.store.sandcatApiUrl, settings.store.sandcatImageTimeout);

                if (image.status === -1) return;

                addAttachments(
                    [new File([(arrayToBlob(image.imageData))], image.imageFilename, { type: image.imageMimeType })],
                    currentChannel.id
                );

            }}

        >
            <img src="https://cdn.discordapp.com/emojis/1281770531124678687.webp?size=96" alt="Sandcat Icon" width={20} height={20} />
        </ChatBarButton >
    );

    return button;
};

export default definePlugin({
    name: "SandcatButton",
    description: "Adds a button to the message input to send a Sandcat Image.",
    authors: [Devs.Eesa],
    settings,
    renderChatBarButton: SandcatChatBarIcon,
});
