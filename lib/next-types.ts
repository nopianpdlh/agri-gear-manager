// Common types for Next.js pages with Next.js 15+ compatibility

export type NextPageParams<T = {}> = Promise<T>;

export type NextPageSearchParams<
  T = { [key: string]: string | string[] | undefined }
> = Promise<T>;

export type NextPageProps<
  T = {},
  S = { [key: string]: string | string[] | undefined }
> = {
  params: NextPageParams<T>;
  searchParams?: NextPageSearchParams<S>;
};
