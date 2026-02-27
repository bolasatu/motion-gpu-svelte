import type { CurrentReadable } from './current-writable';
import { useFragkit, type FragkitUserNamespace } from './fragkit-context';

type UserContextStore = Record<FragkitUserNamespace, unknown>;
type UserContextEntry = Record<string, unknown>;

export interface SetFragkitUserContextOptions {
	existing?: 'merge' | 'replace' | 'skip';
}

function isObjectEntry(value: unknown): value is UserContextEntry {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function useFragkitUserContext<
	UC extends UserContextStore = UserContextStore
>(): CurrentReadable<UC>;
export function useFragkitUserContext<UCT = unknown>(
	namespace: FragkitUserNamespace
): CurrentReadable<UCT | undefined>;
export function useFragkitUserContext<UCT extends UserContextEntry = UserContextEntry>(
	namespace: FragkitUserNamespace,
	value: UCT | (() => UCT),
	options?: SetFragkitUserContextOptions
): UCT;
export function useFragkitUserContext<
	UCOrEntry extends UserContextStore | UserContextEntry,
	Value extends UserContextEntry | (() => UserContextEntry),
	Result = UCOrEntry extends UserContextStore
		? CurrentReadable<UCOrEntry>
		: Value extends UserContextEntry
			? UserContextEntry
			: CurrentReadable<UserContextEntry | undefined>
>(namespace?: FragkitUserNamespace, value?: Value, options?: SetFragkitUserContextOptions): Result {
	const userStore = useFragkit().user;

	if (namespace === undefined) {
		return userStore as Result;
	}

	if (value === undefined) {
		const scopedStore: CurrentReadable<UserContextEntry | undefined> = {
			get current() {
				return userStore.current[namespace] as UserContextEntry | undefined;
			},
			subscribe(run) {
				return userStore.subscribe((context) =>
					run(context[namespace] as UserContextEntry | undefined)
				);
			}
		};
		return scopedStore as Result;
	}

	const mode = options?.existing ?? 'skip';
	userStore.update((context) => {
		const hasExisting = namespace in context;
		if (hasExisting && mode === 'skip') {
			return context;
		}

		const nextValue = typeof value === 'function' ? value() : value;
		if (hasExisting && mode === 'merge') {
			const currentValue = context[namespace];
			if (isObjectEntry(currentValue) && isObjectEntry(nextValue)) {
				context[namespace] = {
					...currentValue,
					...nextValue
				};
				return context;
			}
		}

		context[namespace] = nextValue;
		return context;
	});

	return userStore.current[namespace] as Result;
}
