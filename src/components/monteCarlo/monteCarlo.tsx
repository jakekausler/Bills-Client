import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectMonteCarloDatasets,
  selectMonteCarloError,
  selectMonteCarloEndDate,
  selectMonteCarloLoaded,
  selectMonteCarloLabels,
  selectMonteCarloStartDate,
  selectNSimulations,
} from '../../features/monteCarlo/select';
import { Graph } from '../graph/graph';
import { setMonteCarloEndDate } from '../../features/monteCarlo/slice';
import { AppDispatch } from '../../store';

export default function MonteCarlo() {
  const datasets = useSelector(selectMonteCarloDatasets);
  const labels = useSelector(selectMonteCarloLabels);
  const startDate = useSelector(selectMonteCarloStartDate);
  const endDate = useSelector(selectMonteCarloEndDate);
  const nSimulations = useSelector(selectNSimulations);
  const loaded = useSelector(selectMonteCarloLoaded);
  const error = useSelector(selectMonteCarloError);
  const dispatch = useDispatch<AppDispatch>();
  return (
    <Graph
      datasets={datasets}
      labels={labels}
      endDate={endDate}
      loaded={loaded}
      type="monteCarlo"
      setGraphEndDate={setMonteCarloEndDate}
    />
  );
}
