export type NotNull<T> = T extends null | infer U ? U : T
export type RemoveNull<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? NotNull<T[P]> : T[P]
}
export type Exists<T, K extends keyof T> = {
  [P in K]-?: T[P]
} & {
  [P in Exclude<keyof T, K>]: T[P]
}
