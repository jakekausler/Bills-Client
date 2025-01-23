import { selectGraphViewEndDate, selectGraphViewLabels } from "../../features/graphView/select";

import { useSelector } from "react-redux";
import { selectGraphViewDatasets, selectGraphViewLoaded, selectGraphViewType } from "../../features/graphView/select";
import { Graph } from "../graph/graph";
import { setGraphViewEndDate } from "../../features/graphView/slice";

export default function GraphView() {
  const datasets = useSelector(selectGraphViewDatasets);
  const labels = useSelector(selectGraphViewLabels);
  const endDate = useSelector(selectGraphViewEndDate);
  const type = useSelector(selectGraphViewType);
  const loaded = useSelector(selectGraphViewLoaded);

  return (
    <Graph
      datasets={datasets}
      labels={labels}
      endDate={endDate}
      type={type}
      loaded={loaded}
      setGraphEndDate={setGraphViewEndDate}
    />
  );
}
