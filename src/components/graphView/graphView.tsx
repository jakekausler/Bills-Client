import React from 'react';
import {
  selectGraphViewEndDate,
  selectGraphViewLabels,
  selectGraphViewStartDate,
} from '../../features/graphView/select';

import { useSelector } from 'react-redux';
import { selectGraphViewDatasets, selectGraphViewLoaded, selectGraphViewType } from '../../features/graphView/select';
import { Graph } from '../graph/graph';
import { setGraphViewStartDate, setGraphViewEndDate } from '../../features/graphView/slice';
import { VisuallyHidden } from '@mantine/core';

export default function GraphView() {
  const datasets = useSelector(selectGraphViewDatasets);
  const labels = useSelector(selectGraphViewLabels);
  const startDate = useSelector(selectGraphViewStartDate);
  const endDate = useSelector(selectGraphViewEndDate);
  const type = useSelector(selectGraphViewType);
  const loaded = useSelector(selectGraphViewLoaded);

  return (
    <>
      <VisuallyHidden component="h2">Account Balance Graph</VisuallyHidden>
      <Graph
        datasets={datasets}
        labels={labels}
        startDate={startDate}
        endDate={endDate}
        type={type}
        loaded={loaded}
        setGraphStartDate={setGraphViewStartDate}
        setGraphEndDate={setGraphViewEndDate}
      />
    </>
  );
}
