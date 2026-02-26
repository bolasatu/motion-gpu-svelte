import { describe, expect, it } from 'vitest';
import {
	normalizeTextureDefinition,
	normalizeTextureDefinitions,
	resolveTextureKeys,
	resolveTextureSize,
	toTextureData
} from './textures';

describe('textures', () => {
	it('resolves sorted texture keys and validates names', () => {
		expect(resolveTextureKeys({ uTextureB: {}, uTextureA: {} })).toEqual([
			'uTextureA',
			'uTextureB'
		]);
		expect(() => resolveTextureKeys({ 'bad-key': {} })).toThrow(/Invalid uniform name/);
	});

	it('applies texture defaults', () => {
		expect(normalizeTextureDefinition(undefined)).toEqual({
			source: null,
			colorSpace: 'srgb',
			format: 'rgba8unorm-srgb',
			flipY: true,
			filter: 'linear',
			addressModeU: 'clamp-to-edge',
			addressModeV: 'clamp-to-edge'
		});
	});

	it('normalizes texture maps by key', () => {
		const normalized = normalizeTextureDefinitions(
			{
				uTexture1: { filter: 'nearest', flipY: false },
				uTexture2: { addressModeU: 'repeat', addressModeV: 'mirror-repeat' }
			},
			['uTexture1', 'uTexture2']
		);

		expect(normalized.uTexture1).toMatchObject({
			colorSpace: 'srgb',
			format: 'rgba8unorm-srgb',
			flipY: false,
			filter: 'nearest',
			addressModeU: 'clamp-to-edge',
			addressModeV: 'clamp-to-edge'
		});
		expect(normalized.uTexture2).toMatchObject({
			colorSpace: 'srgb',
			format: 'rgba8unorm-srgb',
			flipY: true,
			filter: 'linear',
			addressModeU: 'repeat',
			addressModeV: 'mirror-repeat'
		});
	});

	it('converts texture source values into texture data', () => {
		const canvas = document.createElement('canvas');
		canvas.width = 8;
		canvas.height = 4;

		expect(toTextureData(null)).toBeNull();
		expect(toTextureData(canvas)).toEqual({ source: canvas });
		expect(toTextureData({ source: canvas, width: 3, height: 2 })).toEqual({
			source: canvas,
			width: 3,
			height: 2
		});
	});

	it('resolves texture size from source dimensions', () => {
		const canvas = document.createElement('canvas');
		canvas.width = 16;
		canvas.height = 9;

		expect(resolveTextureSize({ source: canvas })).toEqual({ width: 16, height: 9 });
		expect(resolveTextureSize({ source: canvas, width: 4, height: 5 })).toEqual({
			width: 4,
			height: 5
		});
	});

	it('throws on invalid texture dimensions', () => {
		const canvas = document.createElement('canvas');
		expect(() => resolveTextureSize({ source: canvas, width: 0, height: 0 })).toThrow(
			/Texture source must have positive width and height/
		);
	});
});
