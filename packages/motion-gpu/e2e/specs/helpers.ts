import { createHash } from 'node:crypto';
import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export function toNumber(value: string | null): number {
	const parsed = Number(value ?? '');
	if (!Number.isFinite(parsed)) {
		throw new Error(`Expected numeric value, got: ${String(value)}`);
	}

	return parsed;
}

export async function getCanvasHash(page: Page): Promise<string> {
	const image = await page.locator('.canvas-shell canvas').screenshot();
	return createHash('sha1').update(image).digest('hex');
}

export async function waitForCanvasHashChange(
	page: Page,
	previousHash: string,
	timeout = 5_000
): Promise<string> {
	let latest = previousHash;
	await expect
		.poll(
			async () => {
				latest = await getCanvasHash(page);
				return latest === previousHash;
			},
			{ timeout }
		)
		.toBe(false);
	return latest;
}

export async function waitForCanvasHash(
	page: Page,
	expectedHash: string,
	timeout = 5_000
): Promise<void> {
	await expect.poll(async () => getCanvasHash(page), { timeout }).toBe(expectedHash);
}

export async function expectCanvasHashStable(
	page: Page,
	expectedHash: string,
	stableDurationMs = 250
): Promise<void> {
	const startedAt = Date.now();
	await expect
		.poll(
			async () => {
				const current = await getCanvasHash(page);
				if (current !== expectedHash) {
					return 'changed';
				}

				return Date.now() - startedAt >= stableDurationMs ? 'stable' : 'waiting';
			},
			{
				timeout: stableDurationMs + 2_000,
				intervals: [40, 70, 100]
			}
		)
		.toBe('stable');
}

export async function expectValueStable(
	read: () => Promise<number>,
	stableDurationMs = 350
): Promise<number> {
	const baseline = await read();
	const startedAt = Date.now();

	await expect
		.poll(
			async () => {
				const current = await read();
				if (current !== baseline) {
					return 'changed';
				}

				return Date.now() - startedAt >= stableDurationMs ? 'stable' : 'waiting';
			},
			{
				timeout: stableDurationMs + 2_000,
				intervals: [40, 70, 100]
			}
		)
		.toBe('stable');

	return baseline;
}
