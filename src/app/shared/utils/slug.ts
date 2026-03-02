export function generateSlug(text: string, id: string): string {
    const shortId = id.substring(0, 4);
    const slug = text
        .toLowerCase()
        .normalize('NFD')                        // descompone acentos
        .replace(/[\u0300-\u036f]/g, '')         // elimina diacríticos
        .replace(/[^a-z0-9\s-]/g, '')           // elimina caracteres especiales
        .trim()
        .replace(/\s+/g, '-')                    // espacios → guiones
        .replace(/-+/g, '-');                    // guiones múltiples → uno

    return `${slug}-${shortId}`;
}

export function extractShortId(slug: string): string {
    const parts = slug.split('-');
    return parts[parts.length - 1];
}