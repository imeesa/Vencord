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

                const image = await Native.getSandcatImage();

                if (image.status === -1) return;

                addAttachments(
                    [new File([(arrayToBlob(image.imageData))], image.imageFilename, { type: image.imageMimeType })],
                    currentChannel.id
                );

            }}

        >
            {/* <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 576 512">
                <path style={{ fill: "var(--interactive-normal)", stroke: "var(--interactive-normal)" }} d="M320 192l17.1 0c22.1 38.3 63.5 64 110.9 64c11 0 21.8-1.4 32-4l0 4 0 32 0 192c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-140.8L280 448l56 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-144 0c-53 0-96-43-96-96l0-223.5c0-16.1-12-29.8-28-31.8l-7.9-1c-17.5-2.2-30-18.2-27.8-35.7s18.2-30 35.7-27.8l7.9 1c48 6 84.1 46.8 84.1 95.3l0 85.3c34.4-51.7 93.2-85.8 160-85.8zm160 26.5s0 0 0 0c-10 3.5-20.8 5.5-32 5.5c-28.4 0-54-12.4-71.6-32c0 0 0 0 0 0c-3.7-4.1-7-8.5-9.9-13.2C357.3 164 352 146.6 352 128c0 0 0 0 0 0l0-96 0-20 0-1.3C352 4.8 356.7 .1 362.6 0l.2 0c3.3 0 6.4 1.6 8.4 4.2c0 0 0 0 0 .1L384 21.3l27.2 36.3L416 64l64 0 4.8-6.4L512 21.3 524.8 4.3c0 0 0 0 0-.1c2-2.6 5.1-4.2 8.4-4.2l.2 0C539.3 .1 544 4.8 544 10.7l0 1.3 0 20 0 96c0 17.3-4.6 33.6-12.6 47.6c-11.3 19.8-29.6 35.2-51.4 42.9zM432 128a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm48 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32z" />
            </svg> */}
            <img src="https://cdn.discordapp.com/emojis/1281770531124678687.webp?size=96" alt="Sandcat Icon" width={20} height={20} />
        </ChatBarButton >
    );

    return button;
};

export default definePlugin({
    name: "SandcatButton",
    description: "Adds a button to the message input to send a Sandcat Image.",
    authors: [Devs.Eesa],
    renderChatBarButton: SandcatChatBarIcon,
});
