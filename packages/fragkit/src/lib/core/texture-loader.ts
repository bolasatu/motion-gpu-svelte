/**
 * Options controlling URL-based texture loading and decode behavior.
 */
export interface TextureLoadOptions {
	/**
	 * Desired decode color space.
	 */
	colorSpace?: 'srgb' | 'linear';
	/**
	 * Fetch options forwarded to `fetch`.
	 */
	requestInit?: RequestInit;
}

/**
 * Loaded texture payload returned by URL loaders.
 */
export interface LoadedTexture {
	/**
	 * Source URL.
	 */
	url: string;
	/**
	 * Decoded bitmap source.
	 */
	source: ImageBitmap;
	/**
	 * Bitmap width in pixels.
	 */
	width: number;
	/**
	 * Bitmap height in pixels.
	 */
	height: number;
	/**
	 * Releases bitmap resources.
	 */
	dispose: () => void;
}

/**
 * In-memory blob cache keyed by request cache mode and URL.
 */
const blobCache = new Map<string, Promise<Blob>>();

/**
 * Clears the internal texture blob cache.
 */
export function clearTextureBlobCache(): void {
	blobCache.clear();
}

/**
 * Fetches and caches texture blobs. Failed fetches are removed from cache.
 *
 * @param url - Texture URL.
 * @param requestInit - Optional request init.
 * @returns Texture blob.
 */
async function fetchTextureBlob(url: string, requestInit?: RequestInit): Promise<Blob> {
	const key = `${requestInit?.cache ?? 'default'}:${url}`;
	const cached = blobCache.get(key);
	if (cached) {
		return cached;
	}

	const request = fetch(url, requestInit)
		.then(async (response) => {
			if (!response.ok) {
				throw new Error(`Texture request failed (${response.status}) for ${url}`);
			}
			return response.blob();
		})
		.catch((error) => {
			blobCache.delete(key);
			throw error;
		});

	blobCache.set(key, request);
	return request;
}

/**
 * Loads a single texture from URL and converts it to an `ImageBitmap`.
 *
 * @param url - Texture URL.
 * @param options - Loading options.
 * @returns Loaded texture object.
 * @throws {Error} When runtime does not support `createImageBitmap` or request fails.
 */
export async function loadTextureFromUrl(
	url: string,
	options: TextureLoadOptions = {}
): Promise<LoadedTexture> {
	if (typeof createImageBitmap !== 'function') {
		throw new Error('createImageBitmap is not available in this runtime');
	}

	const blob = await fetchTextureBlob(url, options.requestInit);
	const bitmap =
		options.colorSpace === 'linear'
			? await createImageBitmap(blob, { colorSpaceConversion: 'none' })
			: await createImageBitmap(blob);

	return {
		url,
		source: bitmap,
		width: bitmap.width,
		height: bitmap.height,
		dispose: () => {
			bitmap.close();
		}
	};
}

/**
 * Loads many textures in parallel from URLs.
 *
 * @param urls - Texture URLs.
 * @param options - Shared loading options.
 * @returns Promise resolving to loaded textures in input order.
 */
export function loadTexturesFromUrls(
	urls: string[],
	options: TextureLoadOptions = {}
): Promise<LoadedTexture[]> {
	return Promise.all(urls.map((url) => loadTextureFromUrl(url, options)));
}
