import { describe, expect, it } from 'vitest';
import {
	attachShaderCompilationDiagnostics,
	getShaderCompilationDiagnostics
} from '../../lib/core/error-diagnostics';

describe('error diagnostics', () => {
	it('attaches and extracts shader diagnostics payload', () => {
		const error = attachShaderCompilationDiagnostics(new Error('compile failed'), {
			kind: 'shader-compilation',
			diagnostics: [
				{
					generatedLine: 12,
					message: 'unknown symbol',
					linePos: 8,
					lineLength: 4,
					sourceLocation: { kind: 'fragment', line: 3 }
				}
			],
			fragmentSource: 'fn frag(uv: vec2f) -> vec4f {\n\treturn vec4f(0.0);\n}',
			includeSources: {
				tone: 'fn tone() -> f32 { return 1.0; }'
			},
			materialSource: {
				component: 'Scene.svelte',
				line: 22,
				column: 5
			}
		});

		const payload = getShaderCompilationDiagnostics(error);
		expect(payload).not.toBeNull();
		expect(payload?.diagnostics[0]).toMatchObject({
			generatedLine: 12,
			message: 'unknown symbol'
		});
		expect(payload?.materialSource?.component).toBe('Scene.svelte');
	});

	it('returns null for non-error values and unrelated payload kinds', () => {
		expect(getShaderCompilationDiagnostics('broken')).toBeNull();

		const error = new Error('broken') as Error & { motiongpuDiagnostics: unknown };
		error.motiongpuDiagnostics = {
			kind: 'other'
		};
		expect(getShaderCompilationDiagnostics(error)).toBeNull();
	});

	it('rejects malformed diagnostics payload shapes', () => {
		const malformed = new Error('broken') as Error & { motiongpuDiagnostics: unknown };
		malformed.motiongpuDiagnostics = {
			kind: 'shader-compilation',
			diagnostics: [
				{
					generatedLine: '12',
					message: 'bad',
					sourceLocation: { kind: 'fragment', line: 1 }
				}
			],
			fragmentSource: 'fn frag(uv: vec2f) -> vec4f { return vec4f(0.0); }',
			includeSources: {
				tone: 1
			},
			materialSource: {
				line: 'x'
			}
		};

		expect(getShaderCompilationDiagnostics(malformed)).toBeNull();
	});
});
