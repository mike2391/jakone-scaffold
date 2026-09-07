export type NewAccountState = {
  formError?: string;
  fieldErrors: Record<string, string>;
};

export const initialNewAccountState: NewAccountState = {
  fieldErrors: {},
};
