import React from 'react';
import { Stack } from '@mantine/core';
import Activities from './activities';
import { Graph } from '../graph/graph';
import LargeScreenControls from './largeScreenControls';
import SmallScreenControls from './smallScreenControls';
import { selectShowGraph } from '../../features/activities/select';
import { useSelector } from 'react-redux';
import {
  selectGraphDatasets,
  selectGraphLabels,
  selectGraphEndDate,
  selectGraphType,
  selectGraphLoaded,
  selectGraphStartDate,
} from '../../features/graph/select';
import { setGraphStartDate, setGraphEndDate } from '../../features/graph/slice';

export default function Account() {
  const showGraph = useSelector(selectShowGraph);
  const datasets = useSelector(selectGraphDatasets);
  const labels = useSelector(selectGraphLabels);
  const startDate = useSelector(selectGraphStartDate);
  const endDate = useSelector(selectGraphEndDate);
  const type = useSelector(selectGraphType);
  const loaded = useSelector(selectGraphLoaded);

  return (
    <Stack h="100%">
      <LargeScreenControls visibleFrom="sm" h={60} />
      <div style={{ flex: showGraph ? 2 : 1, overflow: 'auto' }}>
        <Activities />
      </div>
      <SmallScreenControls hiddenFrom="sm" h={30} />
      {showGraph && (
        <div style={{ flex: 1, overflow: 'auto', minHeight: '300px' }}>
          <Graph
            datasets={datasets}
            labels={labels}
            startDate={startDate}
            endDate={endDate}
            type={type}
            loaded={loaded}
            setGraphStartDate={setGraphStartDate}
            setGraphEndDate={setGraphEndDate}
          />
        </div>
      )}
    </Stack>
  );
}
