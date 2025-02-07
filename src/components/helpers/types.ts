export type CreatableSelectProps = {
  label: string;
  error: string | null;
  data: {
    label: string;
    value: string;
  }[];
  value: string | null;
  onChange: (value: string | null) => void;
  onCreate: (value: string) => void;
};
