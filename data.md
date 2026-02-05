# BESS Engineering Dashboard - Calculation Reference

## Overview
This document outlines all input fields, formulas, and calculations implemented in the Battery Energy Storage System (BESS) Engineering Dashboard.

---

## Input Fields

### Cell Specifications
| Field | Variable | Unit | Description |
|-------|----------|------|-------------|
| Cell Chemistry | `cellChemistry` | - | Battery chemistry type (e.g., LFP, NMC) |
| Nominal Cell Voltage | `cellVoltage` | V | Nominal voltage of a single cell |
| Cell Capacity | `cellCapacity` | Ah | Ampere-hour capacity of a single cell |
| Cell Max Voltage | `cellMaxVoltage` | V | Maximum charge voltage per cell |
| Cell Min Voltage | `cellMinVoltage` | V | Minimum discharge voltage per cell |

### Module Topology
| Field | Variable | Unit | Description |
|-------|----------|------|-------------|
| Cells in Series | `seriesCells` | - | Number of cells connected in series per module |
| Cells in Parallel | `parallelCells` | - | Number of cells connected in parallel per module |

### System Topology
| Field | Variable | Unit | Description |
|-------|----------|------|-------------|
| Series Modules | `seriesModules` | - | Number of modules connected in series per pack |
| Parallel Modules | `parallelModules` | - | Number of modules connected in parallel per pack |

### System Targets
| Field | Variable | Unit | Description |
|-------|----------|------|-------------|
| Target BESS Energy | `targetEnergy` | kWh | Desired total system energy capacity |
| Target Rack Energy | `targetRackEnergy` | kWh | Desired energy capacity per rack |

### Performance Parameters
| Field | Variable | Unit | Description |
|-------|----------|------|-------------|
| Depth of Discharge (DOD) | `dod` | - (0-1) | Fraction of capacity used (e.g., 0.9 = 90%) |
| Discharge C-Rate | `cRate` | C | Discharge rate relative to capacity (e.g., 1C) |
| System Efficiency | `efficiency` | - (0-1) | Round-trip efficiency (e.g., 0.95 = 95%) |

### BMS & Protection
| Field | Variable | Unit | Description |
|-------|----------|------|-------------|
| Cells Per Monitoring IC | `cellsPerIC` | - | Number of cells monitored by each IC chip |
| Maximum IC per Chain | `maxICPerChain` | - | Maximum ICs in a daisy chain |
| Protection Safety Margin | `protectionMargin` | % | Safety margin for contactor/fuse sizing |
| Peak Current Multiplier | `peakMultiplier` | - | Multiplier for peak current calculation |
| Pack Internal Resistance | `packResistanceMilliOhm` | mΩ | Internal resistance of the pack |

---

## Calculated Results & Formulas

### Cell & Module Level

#### Cell Energy
```
cellEnergyWh = cellVoltage × cellCapacity
```
**Units:** Wh (Watt-hours)

#### Module Voltage
```
moduleVoltage = cellVoltage × seriesCells
```
**Units:** V (Volts)

#### Module Capacity
```
moduleCapacity = cellCapacity × parallelCells
```
**Units:** Ah (Ampere-hours)

#### Module Energy
```
moduleEnergyKwh = (moduleVoltage × moduleCapacity) ÷ 1000
```
**Units:** kWh (Kilowatt-hours)

---

### Pack / System Level

#### Pack Voltage
```
packVoltage = moduleVoltage × seriesModules
```
**Units:** V (Volts)

#### Pack Capacity
```
packCapacity = moduleCapacity × parallelModules
```
**Units:** Ah (Ampere-hours)

#### Pack Energy
```
packEnergyKwh = (packVoltage × packCapacity) ÷ 1000
```
**Units:** kWh (Kilowatt-hours)

#### Maximum Pack Voltage
```
maxPackVoltage = cellMaxVoltage × seriesCells × seriesModules
```
**Units:** V (Volts)

#### Minimum Pack Voltage
```
minPackVoltage = cellMinVoltage × seriesCells × seriesModules
```
**Units:** V (Volts)

#### Operating Range
```
operatingRange = "maxPackVoltage - minPackVoltage"
```
**Format:** String (e.g., "876.0V - 600.0V")

#### Total Cell Count
```
totalCellCount = seriesCells × parallelCells × seriesModules × parallelModules
```
**Units:** Number of cells

#### Usable Energy
```
usableEnergyKwh = packEnergyKwh × dod
```
**Units:** kWh (Kilowatt-hours)

---

### Rack Architecture

#### Total Modules
```
totalModules = seriesModules × parallelModules
```
**Units:** Number of modules

#### Rack Count
```
rackCount = CEIL(packEnergyKwh ÷ targetRackEnergy)
```
**Units:** Number of racks

#### Energy Per Rack
```
energyPerRack = packEnergyKwh ÷ rackCount
```
**Units:** kWh (Kilowatt-hours)

#### Modules Per Rack
```
modulesPerRack = totalModules ÷ rackCount
```
**Units:** Number of modules

---

### Electrical Performance

#### Maximum Current
```
maxCurrent = packCapacity × cRate
```
**Units:** A (Amperes)

#### Maximum Power
```
maxPowerKw = (packVoltage × maxCurrent) ÷ 1000
```
**Units:** kW (Kilowatts)

#### Discharge Time
```
dischargeTimeHours = 1 ÷ cRate
```
**Units:** Hours

#### Heat Loss (I²R Loss)
```
heatLossKw = (maxCurrent² × (packResistanceMilliOhm ÷ 1000)) ÷ 1000
```
**Units:** kW (Kilowatts)

#### Peak Current
```
peakCurrent = maxCurrent × peakMultiplier
```
**Units:** A (Amperes)

---

### BMS & Protection

#### Total CMUs (Cell Management Units)
```
totalCMU = totalModules
```
**Assumption:** One CMU per module

#### ICs Per Rack
```
icPerRack = CEIL((totalCellCount ÷ cellsPerIC) ÷ rackCount)
```
**Units:** Number of monitoring ICs per rack

#### Daisy Chains
```
daisyChains = CEIL(icPerRack ÷ maxICPerChain)
```
**Units:** Number of daisy chains per rack

#### ICs Per Chain
```
icPerChain = CEIL(icPerRack ÷ daisyChains)
```
**Units:** Number of ICs in each daisy chain

#### Contactor Rating
```
contactorRating = maxCurrent × (protectionMargin ÷ 100)
```
**Units:** A (Amperes)

#### Fuse Rating
```
fuseRating = contactorRating × 1.2
```
**Units:** A (Amperes)
**Note:** 20% additional margin for fuse selection

---

### Status & Validation

#### Required Modules
```
requiredModules = CEIL(targetEnergy ÷ moduleEnergyKwh)
```
**Units:** Number of modules needed to meet target energy

#### Design Status
```
if (totalModules < requiredModules):
    designStatus = "Increase Modules"
else if (totalModules > requiredModules + 5):
    designStatus = "Over-designed"
else:
    designStatus = "Optimal"
```
**Values:** 
- `Optimal` - Design meets requirements efficiently
- `Increase Modules` - Insufficient modules for target energy
- `Over-designed` - More than 5 extra modules

#### Energy Status
```
if (usableEnergyKwh < targetEnergy):
    energyStatus = "Not Enough Usable Energy"
else:
    energyStatus = "Energy Target Met"
```
**Values:**
- `Energy Target Met` - Usable energy meets or exceeds target
- `Not Enough Usable Energy` - Usable energy is below target

---

## Default Values

The application uses the following default configuration:

| Parameter | Default Value |
|-----------|---------------|
| Cell Chemistry | LFP |
| Cell Voltage | 3.2 V |
| Cell Capacity | 100 Ah |
| Cell Max Voltage | 3.65 V |
| Cell Min Voltage | 2.5 V |
| Series Cells | 12 |
| Parallel Cells | 1 |
| Series Modules | 20 |
| Parallel Modules | 5 |
| Target Energy | 400 kWh |
| Target Rack Energy | 80 kWh |
| DOD | 0.9 (90%) |
| C-Rate | 1 C |
| Efficiency | 0.95 (95%) |
| Cells Per IC | 12 |
| Max IC Per Chain | 16 |
| Protection Margin | 125% |
| Peak Multiplier | 2 |
| Pack Resistance | 50 mΩ |

---

## Key Result Metrics

The dashboard displays the following key metrics:

### Primary Metrics (Large Cards)
1. **Pack Energy** - Total nominal energy capacity (kWh)
2. **Usable Energy** - Available energy considering DOD (kWh)
3. **Max Power** - Maximum power output capability (kW)

### Secondary Metrics (Grid Display)
- Cell & Module Configuration (6 values)
- Pack Specifications (5 values)
- Rack Architecture (3 values)
- Electrical Performance (4 values)
- BMS & Protection (6 values)

### Status Alerts
- **Design Status Alert** - Shows whether design is optimal, over/under-designed
- **Energy Status Alert** - Validates if usable energy meets target

---

## Notes

- All calculations use **real-time computation** via React's `useMemo` hook
- State is **persisted to localStorage** for data retention across sessions
- The dashboard uses a **100vh compact layout** with 35/65 split (inputs/results)
- All numeric inputs support **decimal precision** where appropriate
- Unit labels are displayed using Material-UI **InputAdornment** components