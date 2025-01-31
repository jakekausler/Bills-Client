import { Simulation } from "../../types/types";

export const fetchSimulations = async () => {
  const response = await fetch("/api/simulations");
  return response.json();
};

export const fetchSaveSimulations = async (simulations: Simulation[]) => {
  const response = await fetch("/api/simulations", {
    method: "POST",
    body: JSON.stringify(simulations),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

export const fetchUsedVariables = async () => {
  const response = await fetch("/api/simulations/used_variables");
  return response.json();
};
