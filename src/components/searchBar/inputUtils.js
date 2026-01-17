export const isLikelyUrl = (input) => {
    const v = input.trim().toLowerCase();
    if (!v || v.includes(" ")) return false;

    if (/^(https?|ftp):\/\//.test(v)) return true;
    if (v.startsWith("localhost")) return true;

    return /^[a-z0-9-]+\.[a-z]{2,}(:\d+)?(\/.*)?$/.test(v);
};

export const normalizeUrl = (input) => {
    const value = input.trim();

    if (/^(https?|ftp):\/\//i.test(value)) return value;

    if (
        value.startsWith("localhost") ||
        /^\d{1,3}(\.\d{1,3}){3}/.test(value)
    ) {
        return `http://${value}`;
    }

    return `https://${value}`;
};
