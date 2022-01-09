let key = -1;
export function generateKey() {
    return key++;
}

export type Key = number;