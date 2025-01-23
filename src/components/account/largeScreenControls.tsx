import { Button, Group } from "@mantine/core";
import {
  newActivity,
  newBill,
  setEndDate,
  setStartDate,
} from "../../features/activities/slice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { selectEndDate } from "../../features/activities/select";
import { selectStartDate } from "../../features/activities/select";
import { AppDispatch } from "../../store";
import { loadInterests } from "../../features/activities/actions";
import { selectSelectedAccount } from "../../features/accounts/select";
import { EditableDateInput } from "../helpers/editableDateInput";

export default function LargeScreenControls({
  visibleFrom,
  hiddenFrom,
  style,
  h,
}: {
  visibleFrom?: string;
  hiddenFrom?: string;
  style?: React.CSSProperties;
  h?: string | number;
}) {
  const accountId = useSelector(selectSelectedAccount)?.id;
  const startDate = useSelector(selectStartDate);
  const endDate = useSelector(selectEndDate);

  const dispatch = useDispatch<AppDispatch>();
  return (
    <Group
      visibleFrom={visibleFrom}
      hiddenFrom={hiddenFrom}
      w="100%"
      h={h}
      grow
      align="end"
      style={style}
    >
      <EditableDateInput
        label="Start date"
        value={startDate}
        onBlur={(value) => {
          if (!value) return;
          dispatch(setStartDate(value));
        }}
        placeholder="Start date"
      />
      <EditableDateInput
        label="End date"
        value={endDate}
        onBlur={(value) => {
          if (!value) return;
          dispatch(setEndDate(value));
        }}
        placeholder="End date"
      />
      <Button
        onClick={() => {
          dispatch(newActivity());
        }}
      >
        + Activity
      </Button>
      <Button
        onClick={() => {
          dispatch(newBill());
        }}
      >
        + Bill
      </Button>
      <Button
        onClick={() => {
          if (!accountId) return;
          dispatch(loadInterests(accountId));
        }}
      >
        + Interest
      </Button>
    </Group>
  );
}
