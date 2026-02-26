import { writable, type Readable } from 'svelte/store';

export interface CurrentReadable<T> extends Readable<T> {
	readonly current: T;
}

export interface CurrentWritable<T> extends CurrentReadable<T> {
	set: (value: T) => void;
	update: (updater: (value: T) => T) => void;
}

export function currentWritable<T>(
	initialValue: T,
	onChange?: (value: T) => void
): CurrentWritable<T> {
	let current = initialValue;
	const store = writable(initialValue);

	const set = (value: T) => {
		current = value;
		store.set(value);
		onChange?.(value);
	};

	return {
		get current() {
			return current;
		},
		subscribe: store.subscribe,
		set,
		update(updater) {
			set(updater(current));
		}
	};
}
