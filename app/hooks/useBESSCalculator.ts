import { useMemo } from 'react';

export interface BESSInputs {
  // Cell Specs
  cellChemistry: string;
  cellVoltage: number;
  cellCapacity: number;
  cellMaxVoltage: number;
  cellMinVoltage: number;

  // Module Topology
  seriesCells: number;
  parallelCells: number;

  // System Topology
  seriesModules: number;
  parallelModules: number;

  // System Targets
  targetEnergy: number;
  targetRackEnergy: number;

  // Performance
  dod: number;
  cRate: number;
  efficiency: number;

  // BMS & Protection
  cellsPerIC: number;
  maxICPerChain: number;
  protectionMargin: number;
  peakMultiplier: number;
  packResistanceMilliOhm: number;
}

export interface BESSResults {
  // Cell & Module Level
  cellEnergyWh: number;
  moduleVoltage: number;
  moduleCapacity: number;
  moduleEnergyKwh: number;
  cellsPerModule: number;
  
  // Pass-Through Outputs (for final report)
  outputCellVoltage: number;
  outputCellCapacity: number;

  // Pack / System Level
  packVoltage: number;
  packCapacity: number;
  packEnergyKwh: number;
  maxPackVoltage: number;
  minPackVoltage: number;
  totalCellCount: number;
  usableEnergyKwh: number;

  // Rack Architecture
  rackCount: number;
  energyPerRack: number;
  totalModules: number;
  modulesPerRack: number;

  // Electrical Performance
  maxCurrent: number;
  maxPowerKw: number;
  dischargeTimeHours: number;
  heatLossKw: number;

  // BMS & Protection Logic
  totalCMU: number;
  packMonitorCount: number;
  icPerRack: number;
  daisyChains: number;
  icPerChain: number;
  contactorRating: number;
  fuseRating: number;
  peakCurrent: number;
  packResistanceOhms: number;

  // Status
  requiredModules: number;
  designStatus: 'Optimal' | 'Increase Modules' | 'Over-designed';
  energyStatus: 'Energy Target Met' | 'Not Enough Usable Energy';
  operatingRange: string;
}

export function useBESSCalculator(inputs: BESSInputs): BESSResults {
  return useMemo(() => {
    // Cell & Module Level
    const cellEnergyWh = inputs.cellVoltage * inputs.cellCapacity;
    const moduleVoltage = inputs.cellVoltage * inputs.seriesCells;
    const moduleCapacity = inputs.cellCapacity * inputs.parallelCells;
    const moduleEnergyKwh = (moduleVoltage * moduleCapacity) / 1000;
    const cellsPerModule = inputs.seriesCells * inputs.parallelCells;
    
    // Pass-Through Outputs
    const outputCellVoltage = inputs.cellVoltage;
    const outputCellCapacity = inputs.cellCapacity;

    // Pack / System Level
    const packVoltage = moduleVoltage * inputs.seriesModules;
    const packCapacity = moduleCapacity * inputs.parallelModules;
    const packEnergyKwh = (packVoltage * packCapacity) / 1000;
    const maxPackVoltage = inputs.cellMaxVoltage * inputs.seriesCells * inputs.seriesModules;
    const minPackVoltage = inputs.cellMinVoltage * inputs.seriesCells * inputs.seriesModules;
    const totalCellCount = inputs.seriesCells * inputs.parallelCells * inputs.seriesModules * inputs.parallelModules;
    const usableEnergyKwh = packEnergyKwh * inputs.dod;

    // Rack Architecture
    const rackCount = Math.ceil(packEnergyKwh / inputs.targetRackEnergy);
    const energyPerRack = packEnergyKwh / rackCount;
    const totalModules = inputs.seriesModules * inputs.parallelModules;
    const modulesPerRack = totalModules / rackCount;

    // Electrical Performance
    const maxCurrent = packCapacity * inputs.cRate;
    const maxPowerKw = (packVoltage * maxCurrent) / 1000;
    const dischargeTimeHours = 1 / inputs.cRate;
    const packResistanceOhms = inputs.packResistanceMilliOhm / 1000;
    const heatLossKw = (Math.pow(maxCurrent, 2) * packResistanceOhms) / 1000;

    // BMS & Protection Logic
    const totalCMU = totalModules;
    const packMonitorCount = rackCount; // 1 Monitor per Rack
    const icPerRack = Math.ceil((totalCellCount / inputs.cellsPerIC) / rackCount);
    const daisyChains = Math.ceil(icPerRack / inputs.maxICPerChain);
    const icPerChain = Math.ceil(icPerRack / daisyChains);
    const contactorRating = maxCurrent * (inputs.protectionMargin / 100);
    const fuseRating = contactorRating * 1.2;
    const peakCurrent = maxCurrent * inputs.peakMultiplier;

    // Status Logic
    const requiredModules = Math.ceil(inputs.targetEnergy / moduleEnergyKwh);
    let designStatus: 'Optimal' | 'Increase Modules' | 'Over-designed' = 'Optimal';

    if (totalModules < requiredModules) {
      designStatus = 'Increase Modules';
    } else if (totalModules > requiredModules + 5) {
      designStatus = 'Over-designed';
    }

    const energyStatus: 'Energy Target Met' | 'Not Enough Usable Energy' = 
      usableEnergyKwh < inputs.targetEnergy ? 'Not Enough Usable Energy' : 'Energy Target Met';

    const operatingRange = `${maxPackVoltage.toFixed(1)}V - ${minPackVoltage.toFixed(1)}V`;

    return {
      cellEnergyWh,
      moduleVoltage,
      moduleCapacity,
      moduleEnergyKwh,
      cellsPerModule,
      outputCellVoltage,
      outputCellCapacity,
      packVoltage,
      packCapacity,
      packEnergyKwh,
      maxPackVoltage,
      minPackVoltage,
      totalCellCount,
      usableEnergyKwh,
      rackCount,
      energyPerRack,
      totalModules,
      modulesPerRack,
      maxCurrent,
      maxPowerKw,
      dischargeTimeHours,
      heatLossKw,
      totalCMU,
      packMonitorCount,
      icPerRack,
      daisyChains,
      icPerChain,
      contactorRating,
      fuseRating,
      peakCurrent,
      packResistanceOhms,
      requiredModules,
      designStatus,
      energyStatus,
      operatingRange,
    };
  }, [inputs]);
}
