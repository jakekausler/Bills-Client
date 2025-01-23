import { ActionIcon, Button, Group, Modal, Stack } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { toggleGraph } from "../../features/graph/slice";
import { useDisclosure } from "@mantine/hooks";
import {
  selectEndDate,
  selectStartDate,
} from "../../features/activities/select";
import {
  newActivity,
  newBill,
  setEndDate,
  setStartDate,
} from "../../features/activities/slice";
import { loadInterests } from "../../features/activities/actions";
import { selectSelectedAccount } from "../../features/accounts/select";
import { EditableDateInput } from "../helpers/editableDateInput";
import { IconActivity, IconCalendar, IconClockDollar, IconCurrencyDollar, IconPercentage } from "@tabler/icons-react";

export default function SmallScreenControls({
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
  const dispatch = useDispatch<AppDispatch>();
  const [opened, { open, close }] = useDisclosure();

  const startDate = useSelector(selectStartDate);
  const endDate = useSelector(selectEndDate);
  const accountId = useSelector(selectSelectedAccount)?.id;

  return (
    <>
      <Group
        visibleFrom={visibleFrom}
        hiddenFrom={hiddenFrom}
        w="100%"
        h={h}
        preventGrowOverflow={false}
        grow
        style={style}
      >
        <ActionIcon onClick={open}>
          <IconCalendar />
        </ActionIcon>
        <ActionIcon onClick={() => dispatch(newActivity())}>
          <IconCurrencyDollar />
        </ActionIcon>
        <ActionIcon
          onClick={() => {
            dispatch(newBill());
          }}
        >
          <IconClockDollar />
        </ActionIcon>
        <ActionIcon
          onClick={() => {
            if (!accountId) return;
            dispatch(loadInterests(accountId));
          }}
        >
          <IconPercentage />
        </ActionIcon>
        <ActionIcon onClick={() => dispatch(toggleGraph())}>
          <IconActivity />
        </ActionIcon>
      </Group>
      <Modal opened={opened} title="Select Dates" onClose={close}>
        <Stack>
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
          <Button onClick={close}>Close</Button>
        </Stack>
      </Modal>
    </>
  );
}

