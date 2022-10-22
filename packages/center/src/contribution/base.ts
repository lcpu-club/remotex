export class ContributionPoint<C, M> {
  contributions: Record<keyof C, M> = Object.create(null)

  set(key: keyof C, meta: M) {
    this.contributions[key] = meta
  }

  get(key: string): M | undefined {
    return this.contributions[key as keyof C]
  }
}
