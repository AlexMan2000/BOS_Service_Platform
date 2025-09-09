// utils/functionPool.ts
const functionPool = new Map<string, Function>();

export function registerFunction(id: string, fn: Function) {
    functionPool.set(id, fn);
}

export function getFunction(id: string): Function | undefined {
    return functionPool.get(id);
}

export function removeFunction(id: string) {
    functionPool.delete(id);
}