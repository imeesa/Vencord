/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    sandcatApiUrl: {
        type: OptionType.STRING,
        description: "API URL for Sandcat images",
        default: "https://sandcat.link/api/json",
        hidden: false
    },
    sandcatImageTimeout: {
        type: OptionType.NUMBER,
        description: "Timeout for fetching Sandcat images (ms)",
        default: 3000,
        hidden: false
    },
});
