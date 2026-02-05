'use client';

import {
  Container,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Box,
  Divider,
  InputAdornment,
  Paper,
} from '@mui/material';
import { usePersistentState } from '../hooks/usePersistentState';
import { useBESSCalculator, BESSInputs } from '../hooks/useBESSCalculator';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const defaultInputs: BESSInputs = {
  cellChemistry: 'LFP',
  cellVoltage: 3.2,
  cellCapacity: 100,
  cellMaxVoltage: 3.65,
  cellMinVoltage: 2.5,
  seriesCells: 12,
  parallelCells: 1,
  seriesModules: 20,
  parallelModules: 5,
  targetEnergy: 400,
  targetRackEnergy: 80,
  dod: 0.9,
  cRate: 1,
  efficiency: 0.95,
  cellsPerIC: 12,
  maxICPerChain: 16,
  protectionMargin: 125,
  peakMultiplier: 2,
  packResistanceMilliOhm: 50,
};

export default function Dashboard() {
  const [inputs, setInputs] = usePersistentState<BESSInputs>('bess-inputs', defaultInputs);
  const results = useBESSCalculator(inputs);

  const handleInputChange = (field: keyof BESSInputs) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'number' ? parseFloat(event.target.value) || 0 : event.target.value;
    setInputs({ ...inputs, [field]: value });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
          <BatteryChargingFullIcon sx={{ fontSize: 48, verticalAlign: 'middle', mr: 2 }} />
          BESS Engineering Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Battery Energy Storage System Calculator & Design Tool
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* LEFT COLUMN: INPUTS */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 33.333%' } }}>
          {/* Cell Specifications */}
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Cell Specifications
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TextField
                fullWidth
                label="Cell Chemistry"
                value={inputs.cellChemistry}
                onChange={handleInputChange('cellChemistry')}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Nominal Cell Voltage"
                type="number"
                value={inputs.cellVoltage}
                onChange={handleInputChange('cellVoltage')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">V</InputAdornment>,
                }}
                inputProps={{ step: 0.1 }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Cell Capacity"
                type="number"
                value={inputs.cellCapacity}
                onChange={handleInputChange('cellCapacity')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">Ah</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Cell Max Voltage"
                type="number"
                value={inputs.cellMaxVoltage}
                onChange={handleInputChange('cellMaxVoltage')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">V</InputAdornment>,
                }}
                inputProps={{ step: 0.01 }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Cell Min Voltage"
                type="number"
                value={inputs.cellMinVoltage}
                onChange={handleInputChange('cellMinVoltage')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">V</InputAdornment>,
                }}
                inputProps={{ step: 0.01 }}
              />
            </CardContent>
          </Card>

          {/* Module Topology */}
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Module Topology
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TextField
                fullWidth
                label="Cells in Series"
                type="number"
                value={inputs.seriesCells}
                onChange={handleInputChange('seriesCells')}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Cells in Parallel"
                type="number"
                value={inputs.parallelCells}
                onChange={handleInputChange('parallelCells')}
              />
            </CardContent>
          </Card>

          {/* System Topology */}
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                System Topology
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TextField
                fullWidth
                label="Series Modules"
                type="number"
                value={inputs.seriesModules}
                onChange={handleInputChange('seriesModules')}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Parallel Modules (Pack)"
                type="number"
                value={inputs.parallelModules}
                onChange={handleInputChange('parallelModules')}
              />
            </CardContent>
          </Card>

          {/* System Targets */}
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                System Targets
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TextField
                fullWidth
                label="Target BESS Energy"
                type="number"
                value={inputs.targetEnergy}
                onChange={handleInputChange('targetEnergy')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kWh</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Target Rack Energy"
                type="number"
                value={inputs.targetRackEnergy}
                onChange={handleInputChange('targetRackEnergy')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kWh</InputAdornment>,
                }}
              />
            </CardContent>
          </Card>

          {/* Performance */}
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Performance
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TextField
                fullWidth
                label="Depth of Discharge (DOD)"
                type="number"
                value={inputs.dod}
                onChange={handleInputChange('dod')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                inputProps={{ step: 0.01, min: 0, max: 1 }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Discharge C-Rate"
                type="number"
                value={inputs.cRate}
                onChange={handleInputChange('cRate')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">C</InputAdornment>,
                }}
                inputProps={{ step: 0.1 }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="System Efficiency"
                type="number"
                value={inputs.efficiency}
                onChange={handleInputChange('efficiency')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                inputProps={{ step: 0.01, min: 0, max: 1 }}
              />
            </CardContent>
          </Card>

          {/* BMS & Protection */}
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                BMS & Protection
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TextField
                fullWidth
                label="Cells Per Monitoring IC"
                type="number"
                value={inputs.cellsPerIC}
                onChange={handleInputChange('cellsPerIC')}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Maximum IC per Chain"
                type="number"
                value={inputs.maxICPerChain}
                onChange={handleInputChange('maxICPerChain')}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Protection Safety Margin"
                type="number"
                value={inputs.protectionMargin}
                onChange={handleInputChange('protectionMargin')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Peak Current Multiplier"
                type="number"
                value={inputs.peakMultiplier}
                onChange={handleInputChange('peakMultiplier')}
                inputProps={{ step: 0.1 }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Pack Internal Resistance"
                type="number"
                value={inputs.packResistanceMilliOhm}
                onChange={handleInputChange('packResistanceMilliOhm')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">mΩ</InputAdornment>,
                }}
              />
            </CardContent>
          </Card>
        </Box>

        {/* RIGHT COLUMN: RESULTS */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 66.666%' } }}>
          {/* Status Alerts */}
          <Box sx={{ mb: 3 }}>
            <Alert 
              severity={results.designStatus === 'Optimal' ? 'success' : results.designStatus === 'Increase Modules' ? 'error' : 'warning'}
              icon={results.designStatus === 'Optimal' ? undefined : <WarningAmberIcon />}
              sx={{ mb: 2, fontSize: '1rem', fontWeight: 500 }}
            >
              Design Status: {results.designStatus} (Required: {results.requiredModules} modules, Designed: {results.totalModules} modules)
            </Alert>
            
            <Alert 
              severity={results.energyStatus === 'Energy Target Met' ? 'success' : 'error'}
              sx={{ fontSize: '1rem', fontWeight: 500 }}
            >
              {results.energyStatus} (Usable: {results.usableEnergyKwh.toFixed(2)} kWh, Target: {inputs.targetEnergy} kWh)
            </Alert>
          </Box>

          {/* Key Metrics */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white', boxShadow: 4 }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Pack Energy
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {results.packEnergyKwh.toFixed(2)}
                </Typography>
                <Typography variant="caption">kWh</Typography>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: 'success.main', color: 'white', boxShadow: 4 }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Usable Energy
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {results.usableEnergyKwh.toFixed(2)}
                </Typography>
                <Typography variant="caption">kWh ({(inputs.dod * 100).toFixed(0)}% DOD)</Typography>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: 'secondary.main', color: 'white', boxShadow: 4 }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Max Power
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {results.maxPowerKw.toFixed(2)}
                </Typography>
                <Typography variant="caption">kW</Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Cell & Module Details */}
          <Card sx={{ mt: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Cell & Module Configuration
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Cell Energy</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.cellEnergyWh.toFixed(2)} Wh</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Module Voltage</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.moduleVoltage.toFixed(1)} V</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Module Capacity</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.moduleCapacity.toFixed(1)} Ah</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Module Energy</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.moduleEnergyKwh.toFixed(2)} kWh</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Total Modules</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.totalModules}</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Total Cells</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.totalCellCount}</Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>

          {/* Pack Specifications */}
          <Card sx={{ mt: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Pack Specifications
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Pack Voltage</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.packVoltage.toFixed(1)} V</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Pack Capacity</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.packCapacity.toFixed(1)} Ah</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Operating Range</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{results.operatingRange}</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Max Voltage</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.maxPackVoltage.toFixed(1)} V</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Min Voltage</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.minPackVoltage.toFixed(1)} V</Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>

          {/* Rack Architecture */}
          <Card sx={{ mt: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Rack Architecture
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Rack Count</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.rackCount}</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Energy Per Rack</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.energyPerRack.toFixed(1)} kWh</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Modules Per Rack</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.modulesPerRack.toFixed(1)}</Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>

          {/* Electrical Performance */}
          <Card sx={{ mt: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Electrical Performance
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Max Current</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.maxCurrent.toFixed(1)} A</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Peak Current</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.peakCurrent.toFixed(1)} A</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Discharge Time</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.dischargeTimeHours.toFixed(2)} h</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Heat Loss</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.heatLossKw.toFixed(3)} kW</Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>

          {/* BMS & Protection */}
          <Card sx={{ mt: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                BMS & Protection
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Total CMUs</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.totalCMU}</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">ICs Per Rack</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.icPerRack}</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Daisy Chains</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.daisyChains}</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">ICs Per Chain</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.icPerChain}</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Contactor Rating</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.contactorRating.toFixed(1)} A</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary">Fuse Rating</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{results.fuseRating.toFixed(1)} A</Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
