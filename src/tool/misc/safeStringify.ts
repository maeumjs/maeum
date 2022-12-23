export default function safeStringify<T>(data: T, stringify?: (value: any) => string): string {
  try {
    return stringify != null ? stringify(data) : JSON.stringify(data);
  } catch {
    return '{}';
  }
}
