/** Extract a YouTube video id from common watch / share / embed URLs. */
export function getYouTubeId(url?: string | null): string | null {
    if (!url) return null;
    const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/
    );
    return match?.[1] ?? null;
}
