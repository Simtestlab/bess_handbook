'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
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
  const [mounted, setMounted] = useState(false);
  const [inputs, setInputs] = usePersistentState<BESSInputs>('bess-inputs', defaultInputs);
  const results = useBESSCalculator(inputs);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (field: keyof BESSInputs) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'number' ? parseFloat(event.target.value) || 0 : event.target.value;
    setInputs({ ...inputs, [field]: value });
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ 
        p: 1.5, 
        bgcolor: '#e0e0e0', 
        color: 'black', 
        textAlign: 'center',
        boxShadow: '0px 2px 8px rgba(0,0,0,0.15)'
      }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image src="/logo.png" alt="BESS Logo" width={32} height={32} style={{ marginRight: '8px' }} />
          BESS Formula Handbook
        </Typography>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', p: 1, gap: 1 }}>
        {/* LEFT PANEL: INPUTS (35%) */}
        <Paper 
          elevation={3} 
          sx={{ 
            width: '35%', 
            overflowY: 'auto', 
            p: 2,
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px' }
          }}
        >
          {/* Cell Specifications */}
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
            Cell Specifications
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          
          <TextField
            fullWidth
            size="small"
            margin="dense"
            label="Chemistry"
            value={inputs.cellChemistry}
            onChange={handleInputChange('cellChemistry')}
          />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Voltage"
              type="number"
              value={inputs.cellVoltage}
              onChange={handleInputChange('cellVoltage')}
              InputProps={{ endAdornment: <InputAdornment position="end"><Typography variant="caption">V</Typography></InputAdornment> }}
              inputProps={{ step: 0.1 }}
            />
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Capacity"
              type="number"
              value={inputs.cellCapacity}
              onChange={handleInputChange('cellCapacity')}
              InputProps={{ endAdornment: <InputAdornment position="end"><Typography variant="caption">Ah</Typography></InputAdornment> }}
            />
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Max V"
              type="number"
              value={inputs.cellMaxVoltage}
              onChange={handleInputChange('cellMaxVoltage')}
              InputProps={{ endAdornment: <InputAdornment position="end"><Typography variant="caption">V</Typography></InputAdornment> }}
              inputProps={{ step: 0.01 }}
            />
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Min V"
              type="number"
              value={inputs.cellMinVoltage}
              onChange={handleInputChange('cellMinVoltage')}
              InputProps={{ endAdornment: <InputAdornment position="end"><Typography variant="caption">V</Typography></InputAdornment> }}
              inputProps={{ step: 0.01 }}
            />
          </Box>

          {/* Module Topology */}
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mt: 2, mb: 1 }}>
            Module Topology
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Series Cells"
              type="number"
              value={inputs.seriesCells}
              onChange={handleInputChange('seriesCells')}
            />
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Parallel Cells"
              type="number"
              value={inputs.parallelCells}
              onChange={handleInputChange('parallelCells')}
            />
          </Box>

          {/* System Topology */}
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mt: 2, mb: 1 }}>
            System Topology
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Series Modules"
              type="number"
              value={inputs.seriesModules}
              onChange={handleInputChange('seriesModules')}
            />
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Parallel Modules"
              type="number"
              value={inputs.parallelModules}
              onChange={handleInputChange('parallelModules')}
            />
          </Box>

          {/* System Targets */}
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mt: 2, mb: 1 }}>
            System Targets
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Target Energy"
              type="number"
              value={inputs.targetEnergy}
              onChange={handleInputChange('targetEnergy')}
              InputProps={{ endAdornment: <InputAdornment position="end"><Typography variant="caption">kWh</Typography></InputAdornment> }}
            />
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Rack Energy"
              type="number"
              value={inputs.targetRackEnergy}
              onChange={handleInputChange('targetRackEnergy')}
              InputProps={{ endAdornment: <InputAdornment position="end"><Typography variant="caption">kWh</Typography></InputAdornment> }}
            />
          </Box>

          {/* Performance */}
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mt: 2, mb: 1 }}>
            Performance
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="DOD"
              type="number"
              value={inputs.dod}
              onChange={handleInputChange('dod')}
              inputProps={{ step: 0.01, min: 0, max: 1 }}
            />
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="C-Rate"
              type="number"
              value={inputs.cRate}
              onChange={handleInputChange('cRate')}
              InputProps={{ endAdornment: <InputAdornment position="end"><Typography variant="caption">C</Typography></InputAdornment> }}
              inputProps={{ step: 0.1 }}
            />
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Efficiency"
              type="number"
              value={inputs.efficiency}
              onChange={handleInputChange('efficiency')}
              inputProps={{ step: 0.01, min: 0, max: 1 }}
            />
          </Box>

          {/* BMS & Protection */}
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mt: 2, mb: 1 }}>
            BMS & Protection
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Cells/IC"
              type="number"
              value={inputs.cellsPerIC}
              onChange={handleInputChange('cellsPerIC')}
            />
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Max IC/Chain"
              type="number"
              value={inputs.maxICPerChain}
              onChange={handleInputChange('maxICPerChain')}
            />
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Safety Margin"
              type="number"
              value={inputs.protectionMargin}
              onChange={handleInputChange('protectionMargin')}
              InputProps={{ endAdornment: <InputAdornment position="end"><Typography variant="caption">%</Typography></InputAdornment> }}
            />
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Peak Multiplier"
              type="number"
              value={inputs.peakMultiplier}
              onChange={handleInputChange('peakMultiplier')}
              inputProps={{ step: 0.1 }}
            />
          </Box>
          
          <TextField
            fullWidth
            size="small"
            margin="dense"
            label="Pack Resistance"
            type="number"
            value={inputs.packResistanceMilliOhm}
            onChange={handleInputChange('packResistanceMilliOhm')}
            InputProps={{ endAdornment: <InputAdornment position="end"><Typography variant="caption">mΩ</Typography></InputAdornment> }}
          />
        </Paper>

        {/* RIGHT PANEL: RESULTS (65%) */}
        <Paper 
          elevation={3} 
          sx={{ 
            width: '65%', 
            overflowY: 'auto', 
            p: 2,
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px' }
          }}
        >
          {/* Status Alerts */}
          <Box sx={{ mb: 2 }}>
            <Alert 
              severity={results.designStatus === 'Optimal' ? 'success' : results.designStatus === 'Increase Modules' ? 'error' : 'warning'}
              icon={results.designStatus === 'Optimal' ? undefined : <WarningAmberIcon />}
              sx={{ mb: 1, py: 0.5, fontSize: '0.875rem' }}
            >
              <Typography variant="body2">
                <strong>{results.designStatus}</strong> (Required: {results.requiredModules}, Designed: {results.totalModules})
              </Typography>
            </Alert>
            
            <Alert 
              severity={results.energyStatus === 'Energy Target Met' ? 'success' : 'error'}
              sx={{ py: 0.5, fontSize: '0.875rem' }}
            >
              <Typography variant="body2">
                {results.energyStatus} (Usable: {results.usableEnergyKwh.toFixed(2)} kWh)
              </Typography>
            </Alert>
          </Box>

          {/* Key Metrics Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 2 }}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>Pack Energy</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{results.packEnergyKwh.toFixed(2)}</Typography>
                <Typography variant="caption">kWh</Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>Usable Energy</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{results.usableEnergyKwh.toFixed(2)}</Typography>
                <Typography variant="caption">kWh ({(inputs.dod * 100).toFixed(0)}% DOD)</Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>Max Power</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{results.maxPowerKw.toFixed(2)}</Typography>
                <Typography variant="caption">kW</Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Cell & Module Data */}
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
            Cell & Module Configuration
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 2 }}>
            {[
              { label: 'Cell Voltage', value: results.outputCellVoltage.toFixed(2), unit: 'V' },
              { label: 'Cell Capacity', value: results.outputCellCapacity.toFixed(1), unit: 'Ah' },
              { label: 'Cell Energy', value: results.cellEnergyWh.toFixed(2), unit: 'Wh' },
              { label: 'Cells Per Module', value: results.cellsPerModule, unit: '' },
              { label: 'Module Voltage', value: results.moduleVoltage.toFixed(1), unit: 'V' },
              { label: 'Module Capacity', value: results.moduleCapacity.toFixed(1), unit: 'Ah' },
              { label: 'Module Energy', value: results.moduleEnergyKwh.toFixed(2), unit: 'kWh' },
              { label: 'Total Modules', value: results.totalModules, unit: '' },
              { label: 'Total Cells', value: results.totalCellCount, unit: '' },
            ].map((item, idx) => (
              <Box key={idx} sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.value} {item.unit}</Typography>
              </Box>
            ))}
          </Box>

          {/* Pack Specifications */}
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
            Pack Specifications
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 2 }}>
            {[
              { label: 'Pack Voltage', value: results.packVoltage.toFixed(1), unit: 'V' },
              { label: 'Pack Capacity', value: results.packCapacity.toFixed(1), unit: 'Ah' },
              { label: 'Operating Range', value: results.operatingRange, unit: '' },
              { label: 'Max Voltage', value: results.maxPackVoltage.toFixed(1), unit: 'V' },
              { label: 'Min Voltage', value: results.minPackVoltage.toFixed(1), unit: 'V' },
            ].map((item, idx) => (
              <Box key={idx} sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.value} {item.unit}</Typography>
              </Box>
            ))}
          </Box>

          {/* Rack Architecture */}
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
            Rack Architecture
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 2 }}>
            {[
              { label: 'Rack Count', value: results.rackCount, unit: '' },
              { label: 'Energy/Rack', value: results.energyPerRack.toFixed(1), unit: 'kWh' },
              { label: 'Modules/Rack', value: results.modulesPerRack.toFixed(1), unit: '' },
            ].map((item, idx) => (
              <Box key={idx} sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.value} {item.unit}</Typography>
              </Box>
            ))}
          </Box>

          {/* Electrical Performance */}
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
            Electrical Performance
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 2 }}>
            {[
              { label: 'Max Current', value: results.maxCurrent.toFixed(1), unit: 'A' },
              { label: 'Peak Current', value: results.peakCurrent.toFixed(1), unit: 'A' },
              { label: 'Discharge Time', value: results.dischargeTimeHours.toFixed(2), unit: 'h' },
              { label: 'Pack Resistance', value: results.packResistanceOhms.toFixed(4), unit: 'Ω' },
              { label: 'Heat Loss', value: results.heatLossKw.toFixed(3), unit: 'kW' },
            ].map((item, idx) => (
              <Box key={idx} sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.value} {item.unit}</Typography>
              </Box>
            ))}
          </Box>

          {/* BMS & Protection */}
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
            BMS & Protection
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
            {[
              { label: 'Total CMUs', value: results.totalCMU, unit: '' },
              { label: 'Pack Monitor Count', value: results.packMonitorCount, unit: '' },
              { label: 'ICs/Rack', value: results.icPerRack, unit: '' },
              { label: 'Daisy Chains', value: results.daisyChains, unit: '' },
              { label: 'ICs/Chain', value: results.icPerChain, unit: '' },
              { label: 'Contactor Rating', value: results.contactorRating.toFixed(1), unit: 'A' },
              { label: 'Fuse Rating', value: results.fuseRating.toFixed(1), unit: 'A' },
            ].map((item, idx) => (
              <Box key={idx} sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.value} {item.unit}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
