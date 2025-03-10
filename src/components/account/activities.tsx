import React from 'react';
import { Box, Button, Group, LoadingOverlay, Modal, Select, Stack, Table, useMantineTheme } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActivitiesLoaded,
  selectAllActivities,
  selectEndDate,
  selectInterests,
  selectSelectedActivity,
  selectSelectedBill,
  selectStartDate,
} from '../../features/activities/select';
import { ActivitiesProps } from './types';
import {
  duplicateActivity,
  setSelectedActivity,
  setSelectedBill,
  updateInterests,
} from '../../features/activities/slice';
import { AppDispatch } from '../../store';
import { Account, Activity } from '../../types/types';
import {
  changeAccountForActivity,
  changeAccountForBill,
  loadAndDuplicateBill,
  loadAndSelectBill,
  loadBillActivity,
  loadInterestActivity,
  loadInterests,
  loadNames,
  removeActivity,
  removeBill,
  saveInterests,
  skipBill as skipBillAction,
  skipInterest as skipInterestAction,
} from '../../features/activities/actions';
import { BillEditor } from '../activityEditor/billEditor';
import { InterestEditor } from '../activityEditor/interestEditor';
import { ActivityEditor } from '../activityEditor/activityEditor';
import { selectAllAccounts, selectSelectedAccount } from '../../features/accounts/select';
import { useEffect, useState } from 'react';
import { useContextMenu } from 'mantine-contextmenu';
import {
  IconCurrencyDollar,
  IconEdit,
  IconFlag,
  IconPlayerSkipForward,
  IconSwitch,
  IconTrash,
  IconCopy,
} from '@tabler/icons-react';
import { selectGraphEndDate, selectGraphStartDate } from '../../features/graph/select';

export default function Activities({ style }: ActivitiesProps) {
  const activities = useSelector(selectAllActivities) || [];
  const currentActivity = useSelector(selectSelectedActivity);
  const currentBill = useSelector(selectSelectedBill);
  const interests = useSelector(selectInterests);
  const account = useSelector(selectSelectedAccount);
  const accountId = account?.id;
  const startDate = new Date(useSelector(selectStartDate));
  const endDate = new Date(useSelector(selectEndDate));
  const activitiesLoaded = useSelector(selectActivitiesLoaded);
  const graphStartDate = new Date(useSelector(selectGraphStartDate));
  const graphEndDate = new Date(useSelector(selectGraphEndDate));
  const accounts = useSelector(selectAllAccounts);

  const [editorActivity, setEditorActivity] = useState<Activity | null>(null);
  const [editorChoice, setEditorChoice] = useState<string | null>(null);
  const [changeAccountActivity, setChangeAccountActivity] = useState<Activity | null>(null);

  const lastActivityBeforeToday = [...activities].reverse().find((a) => new Date(a.date) < new Date());

  const [showLoading, setShowLoading] = useState(false);

  const { showContextMenu } = useContextMenu();

  useEffect(() => {
    const isLoading = !activitiesLoaded;

    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [activitiesLoaded]);

  const dispatch = useDispatch<AppDispatch>();

  const resetSelected = () => {
    dispatch(setSelectedActivity(null));
    dispatch(setSelectedBill(null));
    dispatch(updateInterests(null));
    dispatch(loadNames());
  };

  const resetEditor = () => {
    setEditorActivity(null);
    setEditorChoice(null);
  };

  const openBillEditor = (activity: Activity) => {
    if (!accountId) return;
    dispatch(loadAndSelectBill(accountId, activity.billId as string, activity.isTransfer));
    resetEditor();
  };

  const openInterestEditor = () => {
    if (!accountId) return;
    dispatch(loadInterests(accountId));
    resetEditor();
  };

  const billAsActivityEditor = (activity: Activity) => {
    if (!accountId) return;
    dispatch(loadBillActivity(account, activity.billId as string, activity.isTransfer, startDate, endDate));
    resetEditor();
  };

  const interestAsActivityEditor = (activity: Activity) => {
    if (!accountId) return;
    dispatch(loadInterestActivity(accountId, activity.interestId as string, startDate, endDate));
    resetEditor();
  };

  const skipBill = (activity: Activity) => {
    if (!accountId) return;
    dispatch(
      skipBillAction(
        account as Account,
        activity.billId as string,
        activity.isTransfer,
        startDate,
        endDate,
        graphStartDate,
        graphEndDate,
      ),
    );
    resetEditor();
  };

  const skipInterest = () => {
    if (!accountId) return;
    dispatch(skipInterestAction(account as Account, startDate, endDate, graphStartDate, graphEndDate));
    resetEditor();
  };

  const selectActivity = (activity: Activity) => {
    if (!activity) return;
    if (!activity.id || ['TAX', 'SOCIAL-SECURITY', 'PENSION'].includes(activity.id)) {
      return;
    }

    // Reset any existing selections first
    resetSelected();

    if (!!activity.billId && !!accountId) {
      if (activity.firstBill) {
        setEditorChoice('bill');
        setEditorActivity(activity);
      } else {
        dispatch(loadAndSelectBill(accountId, activity.billId, activity.isTransfer));
      }
    } else if (!!activity.interestId && !!accountId) {
      if (activity.firstInterest) {
        setEditorChoice('interest');
        setEditorActivity(activity);
      } else {
        dispatch(loadInterests(accountId));
      }
    } else if (accountId) {
      dispatch(setSelectedActivity(activity));
    }
  };

  const theme = useMantineTheme();

  return (
    <>
      <Stack pos="relative" h="100%">
        <LoadingOverlay
          visible={showLoading}
          loaderProps={{ color: 'blue.6', size: 'xl' }}
          overlayProps={{ blur: 1, opacity: 1, zIndex: 1000 }}
        />
        <Stack h="100%" style={{ ...style, overflow: 'auto' }}>
          <Table style={{ width: '100%', tableLayout: 'auto' }} stickyHeader stickyHeaderOffset={0}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th></Table.Th>
                <Table.Th fz="xs">Date</Table.Th>
                <Table.Th fz="xs">Payee</Table.Th>
                <Table.Th fz="xs">Category</Table.Th>
                <Table.Th fz="xs">Amount</Table.Th>
                <Table.Th fz="xs">Balance</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {activities.map((activity, idx) => {
                return (
                  <Table.Tr
                    key={`${activity.id}-${idx}`}
                    bg={idx % 2 === 0 ? 'gray.9' : ''}
                    onClick={() => selectActivity(activity)}
                    style={{
                      cursor: 'pointer',
                      borderBottom:
                        activity.id === lastActivityBeforeToday?.id
                          ? '4px solid var(--mantine-color-gray-6)'
                          : undefined,
                    }}
                    c={
                      activity.flag
                        ? activity.flagColor
                          ? theme.colors[activity.flagColor][activity.billId && activity.firstBill ? 6 : 4]
                          : 'gray'
                        : ''
                    }
                    fs={activity.billId ? 'italic' : undefined}
                    fw={activity.firstBill ? 'bold' : activity.firstInterest ? 'bold' : ''}
                    onContextMenu={showContextMenu(
                      [
                        {
                          key: 'edit',
                          title: 'Edit',
                          icon: <IconEdit size={16} />,
                          onClick: () => {
                            if (
                              (activity.billId && activity.firstBill) ||
                              (activity.interestId && activity.firstInterest)
                            ) {
                              activity.billId
                                ? dispatch(
                                    loadAndSelectBill(account?.id as string, activity.billId, activity.isTransfer),
                                  )
                                : dispatch(loadInterests(account?.id as string));
                            } else {
                              selectActivity(activity);
                            }
                          },
                        },
                        {
                          key: 'delete',
                          title: 'Delete',
                          icon: <IconTrash size={16} />,
                          onClick: () => {
                            if (activity.billId) {
                              dispatch(
                                removeBill(
                                  account as Account,
                                  activity.billId as string,
                                  activity.isTransfer,
                                  startDate,
                                  endDate,
                                  graphStartDate,
                                  graphEndDate,
                                ),
                              );
                            } else if (activity.interestId) {
                              dispatch(
                                saveInterests(account as Account, [], startDate, endDate, graphStartDate, graphEndDate),
                              );
                            } else {
                              dispatch(
                                removeActivity(
                                  account as Account,
                                  activity.id as string,
                                  activity.isTransfer,
                                  startDate,
                                  endDate,
                                  graphStartDate,
                                  graphEndDate,
                                ),
                              );
                            }
                          },
                        },
                        ...((activity.billId && activity.firstBill) || (activity.interestId && activity.firstInterest)
                          ? [
                              {
                                key: 'enter',
                                title: 'Enter',
                                icon: <IconCurrencyDollar size={16} />,
                                onClick: () => {
                                  activity.billId ? billAsActivityEditor(activity) : interestAsActivityEditor(activity);
                                },
                              },
                              {
                                key: 'skip',
                                title: 'Skip',
                                icon: <IconPlayerSkipForward size={16} />,
                                onClick: () => {
                                  activity.billId ? skipBill(activity) : skipInterest();
                                },
                              },
                            ]
                          : []),
                        ...(!activity.interestId
                          ? [
                              {
                                key: 'changeAccount',
                                title: 'Change Account',
                                icon: <IconSwitch size={16} />,
                                onClick: () => {
                                  setChangeAccountActivity(activity);
                                },
                              },
                              {
                                key: 'duplicate',
                                title: 'Duplicate',
                                icon: <IconCopy size={16} />,
                                onClick: () => {
                                  if (activity.billId && account) {
                                    dispatch(
                                      loadAndDuplicateBill(
                                        account.id as string,
                                        activity.billId as string,
                                        activity.isTransfer,
                                      ),
                                    );
                                  } else {
                                    dispatch(duplicateActivity(activity));
                                  }
                                },
                              },
                            ]
                          : []),
                      ].sort((a, b) => {
                        const order = { enter: 0, edit: 1, skip: 2, delete: 3 };
                        return order[a.key as keyof typeof order] - order[b.key as keyof typeof order];
                      }),
                    )}
                  >
                    <Table.Td fz="xs">
                      {activity.flag ? (
                        <IconFlag color={activity.flagColor ? theme.colors[activity.flagColor][4] : 'gray'} size={16} />
                      ) : (
                        ''
                      )}
                    </Table.Td>
                    <Table.Td style={{ whiteSpace: 'nowrap' }} fz="xs">
                      {new Date(`${activity.date}T00:00:00`).toLocaleDateString()}
                    </Table.Td>
                    <Table.Td fz="xs">{activity.name}</Table.Td>
                    <Table.Td fz="xs">{activity.category.split('.')[1]}</Table.Td>
                    <Table.Td
                      fz="xs"
                      style={{ whiteSpace: 'nowrap' }}
                      c={(activity.amount as number) < 0 ? 'red' : 'green'}
                    >
                      {'$ ' + (activity.amount as number).toFixed(2)}
                    </Table.Td>
                    <Table.Td fz="xs" style={{ whiteSpace: 'nowrap' }} c={activity.balance < 0 ? 'red' : 'green'}>
                      {'$ ' + activity.balance.toFixed(2)}
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Stack>
      </Stack>
      <Modal opened={!!currentActivity || !!currentBill || !!interests} onClose={resetSelected} withCloseButton={false}>
        {currentBill && <BillEditor resetSelected={resetSelected} />}
        {interests && <InterestEditor resetSelected={resetSelected} />}
        {currentActivity && <ActivityEditor resetSelected={resetSelected} />}
      </Modal>
      <Modal opened={!!editorActivity && !!editorChoice} onClose={resetEditor} withCloseButton={false}>
        <Group w="100%" grow>
          <Button
            onClick={
              editorChoice === 'bill' ? () => openBillEditor(editorActivity as Activity) : () => openInterestEditor()
            }
          >
            Edit {editorChoice}
          </Button>
          <Button
            onClick={
              editorChoice === 'bill'
                ? () => billAsActivityEditor(editorActivity as Activity)
                : () => interestAsActivityEditor(editorActivity as Activity)
            }
          >
            Enter {editorChoice}
          </Button>
          <Button
            onClick={() => {
              editorChoice === 'bill' ? skipBill(editorActivity as Activity) : skipInterest();
            }}
          >
            Skip {editorChoice}
          </Button>
        </Group>
      </Modal>
      <Modal opened={!!changeAccountActivity} onClose={() => setChangeAccountActivity(null)} withCloseButton={false}>
        <Stack>
          <Select
            data={accounts.map((acc) => {
              return {
                value: acc.id,
                label: acc.name,
                disabled: acc.id === account?.id || acc.name === changeAccountActivity?.to,
              };
            })}
            value={undefined}
            onChange={(value) => {
              if (!account || value === account.id || !changeAccountActivity) return;
              if (changeAccountActivity.billId) {
                dispatch(
                  changeAccountForBill(
                    account,
                    changeAccountActivity.billId as string,
                    value as string,
                    changeAccountActivity.isTransfer as boolean,
                    startDate,
                    endDate,
                    graphStartDate,
                    graphEndDate,
                  ),
                );
              } else {
                dispatch(
                  changeAccountForActivity(
                    account,
                    changeAccountActivity.id as string,
                    value as string,
                    changeAccountActivity.isTransfer as boolean,
                    startDate,
                    endDate,
                    graphStartDate,
                    graphEndDate,
                  ),
                );
              }
              setChangeAccountActivity(null);
            }}
          />
        </Stack>
      </Modal>
    </>
  );
}
