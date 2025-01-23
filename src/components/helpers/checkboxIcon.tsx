import { Box } from "@mantine/core";

export function CheckboxIcon({ checked, onChange, checkedIcon, uncheckedIcon }: { checked: boolean; onChange: (checked: boolean) => void; checkedIcon: React.ReactNode; uncheckedIcon: React.ReactNode; }) {
  return (
    <Box onClick={() => onChange(!checked)}>
      {checked ? checkedIcon : uncheckedIcon}
    </Box>
  )
}