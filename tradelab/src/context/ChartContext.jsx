import {
  createContext,
  useContext,
  useState
} from "react";

import indicatorConfig from "../config/indicatorConfig";

const ChartContext =
  createContext();

export function ChartProvider({
  children
}) {
  /*
  ========================================
  INDICATOR VISIBILITY
  ========================================
  */

  const [
    visibleIndicators,
    setVisibleIndicators
  ] = useState(() => {
    const initialState = {};

    Object.values(
      indicatorConfig
    ).forEach((indicator) => {
      initialState[
        indicator.id
      ] =
        indicator.defaultVisible;
    });

    return initialState;
  });

  /*
  ========================================
  INDICATOR PARAMETERS
  ========================================
  */

  const [
    indicatorParameters,
    setIndicatorParameters
  ] = useState(() => {
    const initialState = {};

    Object.values(
      indicatorConfig
    ).forEach((indicator) => {
      initialState[
        indicator.id
      ] = {
        period:
          indicator.period || null
      };
    });

    return initialState;
  });

  /*
  ========================================
  STRATEGY SIGNAL VISIBILITY
  ========================================
  */

  const [
    showStrategySignals,
    setShowStrategySignals
  ] = useState(true);

  /*
  ========================================
  TOGGLE INDICATOR
  ========================================
  */

  const toggleIndicator = (
    indicatorId
  ) => {
    setVisibleIndicators(
      (current) => ({
        ...current,

        [indicatorId]:
          !current[indicatorId]
      })
    );
  };

  /*
  ========================================
  CHECK VISIBILITY
  ========================================
  */

  const isIndicatorVisible = (
    indicatorId
  ) => {
    return Boolean(
      visibleIndicators[
        indicatorId
      ]
    );
  };

  /*
  ========================================
  UPDATE PARAMETER
  ========================================
  */

  const updateIndicatorParameter = (
    indicatorId,
    parameter,
    value
  ) => {
    setIndicatorParameters(
      (current) => ({
        ...current,

        [indicatorId]: {
          ...current[
            indicatorId
          ],

          [parameter]:
            value
        }
      })
    );
  };

  /*
  ========================================
  GET PARAMETERS
  ========================================
  */

  const getIndicatorParameter = (
    indicatorId,
    parameter
  ) => {
    return (
      indicatorParameters[
        indicatorId
      ]?.[parameter]
    );
  };

  return (
    <ChartContext.Provider
      value={{
        visibleIndicators,

        toggleIndicator,

        isIndicatorVisible,

        indicatorParameters,

        updateIndicatorParameter,

        getIndicatorParameter,

        showStrategySignals,

        setShowStrategySignals
      }}
    >
      {children}
    </ChartContext.Provider>
  );
}

export function useChart() {
  return useContext(
    ChartContext
  );
}