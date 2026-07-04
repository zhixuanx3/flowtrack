interface ApiError {
  response?: { data?: { message?: string } };
  message?: string;
}

export const getErrorMessage = (err: unknown): string => {
  const apiErr = err as ApiError;
  return apiErr?.response?.data?.message ?? apiErr?.message ?? "Something went wrong";
};
