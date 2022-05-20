declare interface Date {
  format(fmt: string): string;
}

declare interface Array<T> {
  diff(list: Array<T>): Array<T>;
}

declare interface String {
  format(...rest: Array<any>): string;
}

declare interface cookieOptions {
  expires?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
}
