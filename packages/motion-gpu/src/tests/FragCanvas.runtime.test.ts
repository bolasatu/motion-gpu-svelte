import { cleanup, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FragCanvas from '../lib/FragCanvas.svelte';
import { attachShaderCompilationDiagnostics } from '../lib/core/error-diagnostics';
import { defineMaterial } from '../lib/core/material';

const { createRendererMock } = vi.hoisted(() => ({
	createRendererMock: vi.fn()
}));

vi.mock('../lib/core/renderer', () => ({
	createRenderer: createRendererMock
}));

const material = defineMaterial({
	fragment: `
fn frag(uv: vec2f) -> vec4f {
	return vec4f(uv.x, uv.y, 0.5, 1.0);
}
`
});
const alternateMaterial = defineMaterial({
	fragment: `
fn frag(uv: vec2f) -> vec4f {
	return vec4f(1.0 - uv.x, uv.y, 0.2, 1.0);
}
`
});

interface MockRenderer {
	render: ReturnType<typeof vi.fn>;
	destroy: ReturnType<typeof vi.fn>;
}

let rafQueue: FrameRequestCallback[] = [];

async function flushFrame(timestamp: number): Promise<void> {
	const callback = rafQueue.shift();
	if (!callback) {
		throw new Error('No queued animation frame callback');
	}

	callback(timestamp);
	await Promise.resolve();
	await Promise.resolve();
}

describe('FragCanvas runtime', () => {
	beforeEach(() => {
		rafQueue = [];
		vi.stubGlobal(
			'requestAnimationFrame',
			vi.fn((callback: FrameRequestCallback) => {
				rafQueue.push(callback);
				return rafQueue.length;
			})
		);
		vi.stubGlobal('cancelAnimationFrame', vi.fn());
		createRendererMock.mockReset();
	});

	afterEach(() => {
		cleanup();
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it('rebuilds renderer when outputColorSpace changes', async () => {
		const created: Array<{ renderer: MockRenderer; options: { outputColorSpace: string } }> = [];
		createRendererMock.mockImplementation(async (options: { outputColorSpace: string }) => {
			const renderer: MockRenderer = {
				render: vi.fn(),
				destroy: vi.fn()
			};
			created.push({ renderer, options });
			return renderer;
		});

		const view = render(FragCanvas, {
			props: {
				material,
				showErrorOverlay: false
			}
		});

		await flushFrame(16);
		await waitFor(() => {
			expect(createRendererMock).toHaveBeenCalledTimes(1);
		});

		await flushFrame(32);
		await waitFor(() => {
			expect(created[0]?.renderer.render).toHaveBeenCalled();
		});

		await view.rerender({
			material,
			outputColorSpace: 'linear',
			showErrorOverlay: false
		});
		await flushFrame(48);
		await waitFor(() => {
			expect(createRendererMock).toHaveBeenCalledTimes(2);
		});

		expect(created[1]?.options.outputColorSpace).toBe('linear');
		expect(created[0]?.renderer.destroy).toHaveBeenCalledTimes(1);

		await flushFrame(64);
		await waitFor(() => {
			expect(created[1]?.renderer.render).toHaveBeenCalled();
		});
	});

	it('applies retry backoff after renderer initialization failure and recovers', async () => {
		let now = 0;
		vi.spyOn(performance, 'now').mockImplementation(() => now);

		const recoveredRenderer: MockRenderer = {
			render: vi.fn(),
			destroy: vi.fn()
		};
		createRendererMock.mockRejectedValueOnce(new Error('bootstrap failed'));
		createRendererMock.mockResolvedValue(recoveredRenderer);

		const onError = vi.fn();
		render(FragCanvas, {
			props: {
				material,
				onError,
				showErrorOverlay: false
			}
		});

		await flushFrame(16);
		await waitFor(() => {
			expect(createRendererMock).toHaveBeenCalledTimes(1);
			expect(onError).toHaveBeenCalledWith(
				expect.objectContaining({
					phase: 'initialization',
					rawMessage: 'bootstrap failed'
				})
			);
		});

		now = 100;
		await flushFrame(32);
		expect(createRendererMock).toHaveBeenCalledTimes(1);

		now = 300;
		await flushFrame(48);
		await waitFor(() => {
			expect(createRendererMock).toHaveBeenCalledTimes(2);
		});

		await flushFrame(64);
		await waitFor(() => {
			expect(recoveredRenderer.render).toHaveBeenCalled();
		});
	});

	it('resets retry backoff immediately when material signature changes', async () => {
		let now = 0;
		vi.spyOn(performance, 'now').mockImplementation(() => now);

		const recoveredRenderer: MockRenderer = {
			render: vi.fn(),
			destroy: vi.fn()
		};
		createRendererMock.mockRejectedValueOnce(new Error('bootstrap failed'));
		createRendererMock.mockResolvedValue(recoveredRenderer);

		const view = render(FragCanvas, {
			props: {
				material,
				showErrorOverlay: false
			}
		});

		await flushFrame(16);
		await waitFor(() => {
			expect(createRendererMock).toHaveBeenCalledTimes(1);
		});

		now = 120;
		await view.rerender({
			material: alternateMaterial,
			showErrorOverlay: false
		});
		await flushFrame(32);
		await waitFor(() => {
			expect(createRendererMock).toHaveBeenCalledTimes(2);
		});
	});

	it('renders shader diagnostics source, details and stack in overlay', async () => {
		const diagnosticsError = attachShaderCompilationDiagnostics(
			new Error('WGSL compilation failed:\nmissing return'),
			{
				kind: 'shader-compilation',
				diagnostics: [
					{
						generatedLine: 21,
						message: 'missing return',
						linePos: 6,
						lineLength: 7,
						sourceLocation: { kind: 'fragment', line: 2 }
					},
					{
						generatedLine: 22,
						message: 'expected ;',
						sourceLocation: { kind: 'fragment', line: 3 }
					}
				],
				fragmentSource: [
					'fn frag(uv: vec2f) -> vec4f {',
					'\tlet broken = uv.x',
					'\treturn vec4f(uv, 0.0, 1.0);',
					'}'
				].join('\n'),
				includeSources: {},
				materialSource: { component: 'OverlayScene.svelte' }
			}
		);
		diagnosticsError.stack = ['Error: WGSL compilation failed', 'at render (Renderer.ts:42:7)'].join(
			'\n'
		);
		const throwingRenderer: MockRenderer = {
			render: vi.fn(() => {
				throw diagnosticsError;
			}),
			destroy: vi.fn()
		};
		createRendererMock.mockResolvedValue(throwingRenderer);

		render(FragCanvas, { props: { material } });
		await flushFrame(16);
		await flushFrame(32);

		const overlay = await screen.findByTestId('motiongpu-error');
		expect(overlay.textContent).toContain('WGSL compilation failed');
		expect(overlay.textContent).toContain('missing return');
		expect(overlay.textContent).toContain('OverlayScene.svelte (fragment line 2');
		expect(overlay.textContent).toContain('let broken = uv.x');
		expect(overlay.textContent).toContain('Additional diagnostics');
		expect(overlay.textContent).toContain('expected ;');
		expect(overlay.textContent).toContain('Stack trace');
		expect(overlay.textContent).toContain('at render (Renderer.ts:42:7)');
	});

	it('recovers when material becomes valid after initial initialization error', async () => {
		const renderer: MockRenderer = {
			render: vi.fn(),
			destroy: vi.fn()
		};
		createRendererMock.mockResolvedValue(renderer);

		const onError = vi.fn();
		const invalidMaterial = {
			fragment: 'fn frag(uv: vec2f) -> vec4f { return vec4f(uv, 0.0, 1.0); }',
			uniforms: {},
			textures: {},
			defines: {}
		};
		const view = render(FragCanvas, {
			props: {
				material: invalidMaterial as unknown as typeof material,
				onError,
				showErrorOverlay: false
			}
		});

		await waitFor(() => {
			expect(onError).toHaveBeenCalledWith(
				expect.objectContaining({
					phase: 'initialization',
					rawMessage: expect.stringContaining('Invalid material instance')
				})
			);
		});
		expect(createRendererMock).not.toHaveBeenCalled();

		await view.rerender({
			material,
			onError,
			showErrorOverlay: false
		});

		await flushFrame(16);
		await waitFor(() => {
			expect(createRendererMock).toHaveBeenCalledTimes(1);
		});
		await flushFrame(32);
		await waitFor(() => {
			expect(renderer.render).toHaveBeenCalled();
		});
	});
});
