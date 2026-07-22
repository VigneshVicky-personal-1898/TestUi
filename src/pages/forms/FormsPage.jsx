// AI-ASSISTED: Cursor
// PROMPT: Add option() automation attrs to Forms MenuItems
// ACCEPTED-BY: vignesh
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Box, Paper, TextField, Button, FormControlLabel, Radio, RadioGroup, Checkbox,
  Switch, FormControl, FormLabel, FormGroup, FormHelperText, Chip, Stack,
  Autocomplete, Typography, Alert, MenuItem, Grid, Divider,
} from '@mui/material'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import EventIcon from '@mui/icons-material/Event'
import TuneIcon from '@mui/icons-material/Tune'
import NotesIcon from '@mui/icons-material/Notes'
import DataObjectIcon from '@mui/icons-material/DataObject'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SendIcon from '@mui/icons-material/Send'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { PageHeader, PageContainer } from '../../components/common/PageHeader'
import { SUGGESTIONS } from '../../data/mockData'
import { aid, btn, field, control, dyn, option, optId } from '../../utils/automation'

function FormSection({ icon: Icon, step, title, description, children, testId }) {
  return (
    <Paper
      elevation={0}
      {...aid(testId)}
      sx={{
        p: { xs: 2.5, md: 3 },
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        height: '100%',
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
            : 'linear-gradient(180deg, #132f4c 0%, #0f2439 100%)',
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2.5 }}>
        <Box
          sx={{
            width: 40, height: 40, borderRadius: 1.5, display: 'grid', placeItems: 'center',
            bgcolor: 'primary.main', color: 'primary.contrastText', flexShrink: 0,
          }}
          {...aid(dyn(testId, 'icon'))}
        >
          <Icon fontSize="small" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" color="primary" sx={{ lineHeight: 1, letterSpacing: 1.2 }}>
            Section {step}
          </Typography>
          <Typography variant="h6" sx={{ lineHeight: 1.3 }} {...aid(dyn(testId, 'title'))}>{title}</Typography>
          <Typography variant="body2" color="text.secondary">{description}</Typography>
        </Box>
      </Stack>
      {children}
    </Paper>
  )
}

function SafeDateRange({ value, onChange }) {
  return (
    <Grid container spacing={2} {...aid('forms-date-range')}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <DatePicker
          label="Start Date"
          value={value?.[0] || null}
          onChange={(v) => onChange([v, value?.[1] || null])}
          slotProps={{ textField: { fullWidth: true, ...field('forms-date-range-start', 'dateRangeStart') } }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <DatePicker
          label="End Date"
          value={value?.[1] || null}
          onChange={(v) => onChange([value?.[0] || null, v])}
          slotProps={{ textField: { fullWidth: true, ...field('forms-date-range-end', 'dateRangeEnd') } }}
        />
      </Grid>
    </Grid>
  )
}

export default function FormsPage() {
  const [submitted, setSubmitted] = useState(null)
  const [chips, setChips] = useState(['React', 'Playwright'])
  const [chipInput, setChipInput] = useState('')
  const [richText, setRichText] = useState('<p>Write something <strong>rich</strong>...</p>')
  const [dateRange, setDateRange] = useState([null, null])

  const { register, handleSubmit, control: formControl, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      fullName: '', bio: '', gender: 'other', newsletter: false, terms: false,
      notifications: true, country: '', skills: [], fruit: null, birthDate: null, meetingTime: null,
    },
  })

  const watchedName = watch('fullName')
  const watchedCountry = watch('country')

  const onSubmit = (data) => {
    setSubmitted({
      ...data,
      chips,
      richText,
      dateRange: dateRange.map((d) => d?.format?.('YYYY-MM-DD') || null),
      birthDate: data.birthDate?.format?.('YYYY-MM-DD'),
      meetingTime: data.meetingTime?.format?.('HH:mm'),
    })
  }

  const handleReset = () => {
    reset()
    setSubmitted(null)
    setChips(['React', 'Playwright'])
    setChipInput('')
    setRichText('<p>Write something <strong>rich</strong>...</p>')
    setDateRange([null, null])
  }

  const addChip = () => {
    if (chipInput.trim() && !chips.includes(chipInput.trim())) {
      setChips([...chips, chipInput.trim()])
      setChipInput('')
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <PageContainer pageId="forms-page">
        <Box sx={{ pb: 4 }}>
          <PageHeader
            pageId="forms"
            title="Forms Playground"
            subtitle="Practice every common input type used in enterprise automation"
            breadcrumbs={['Forms']}
          />

          {submitted && (
            <Alert
              severity="success"
              sx={{ mb: 2.5 }}
              onClose={() => setSubmitted(null)}
              {...aid('forms-alert-success')}
            >
              Form submitted successfully. Payload is shown in the review panel.
            </Alert>
          )}

          <Box
            component="form"
            name="forms-playground"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            {...aid('forms-playground')}
          >
            <Grid container spacing={2.5} alignItems="flex-start">
              <Grid size={{ xs: 12, lg: 8 }}>
                <Stack spacing={2.5}>
                  <FormSection icon={PersonOutlinedIcon} step="01" title="Basic Inputs" description="Text, textarea, radio, checkbox, and toggle" testId="forms-section-basic">
                    <Grid container spacing={2.5}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          label="Full Name"
                          fullWidth
                          error={!!errors.fullName}
                          helperText={errors.fullName?.message || 'Required · min 2 characters'}
                          {...field('forms-input-fullname', 'fullName')}
                          {...register('fullName', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 chars' } })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl error={!!errors.gender} fullWidth {...aid('forms-radio-gender')}>
                          <FormLabel sx={{ mb: 0.5 }}>Gender</FormLabel>
                          <Controller
                            name="gender"
                            control={formControl}
                            render={({ field: rhf }) => (
                              <RadioGroup row {...rhf} {...aid('forms-radio-group-gender')}>
                                <FormControlLabel value="male" control={<Radio {...control('forms-radio-male', 'gender')} />} label="Male" />
                                <FormControlLabel value="female" control={<Radio {...control('forms-radio-female', 'gender')} />} label="Female" />
                                <FormControlLabel value="other" control={<Radio {...control('forms-radio-other', 'gender')} />} label="Other" />
                              </RadioGroup>
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid size={12}>
                        <TextField
                          label="Bio"
                          fullWidth
                          multiline
                          rows={4}
                          helperText="Optional · max 500 characters"
                          {...field('forms-input-bio', 'bio')}
                          {...register('bio', { maxLength: { value: 500, message: 'Max 500 chars' } })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 7 }}>
                        <FormGroup row sx={{ gap: 1 }} {...aid('forms-checkbox-group')}>
                          <FormControlLabel
                            control={<Checkbox {...control('forms-checkbox-newsletter', 'newsletter')} {...register('newsletter')} />}
                            label="Subscribe to newsletter"
                          />
                          <FormControlLabel
                            control={<Checkbox {...control('forms-checkbox-terms', 'terms')} {...register('terms', { required: 'You must accept terms' })} />}
                            label="Accept terms *"
                          />
                        </FormGroup>
                        {errors.terms && <FormHelperText error {...aid('forms-error-terms')}>{errors.terms.message}</FormHelperText>}
                      </Grid>
                      <Grid size={{ xs: 12, md: 5 }}>
                        <Box sx={{ px: 2, py: 1, borderRadius: 1.5, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', height: '100%' }} {...aid('forms-toggle-box')}>
                          <FormControlLabel
                            sx={{ m: 0 }}
                            control={
                              <Controller
                                name="notifications"
                                control={formControl}
                                render={({ field: rhf }) => (
                                  <Switch
                                    checked={rhf.value}
                                    onChange={(e) => rhf.onChange(e.target.checked)}
                                    {...control('forms-toggle-notifications', 'notifications')}
                                  />
                                )}
                              />
                            }
                            label="Enable notifications"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </FormSection>

                  <FormSection icon={EventIcon} step="02" title="Date & Time" description="Single date, time, and date-range pickers" testId="forms-section-datetime">
                    <Grid container spacing={2.5}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                          name="birthDate"
                          control={formControl}
                          render={({ field: rhf }) => (
                            <DatePicker
                              label="Birth Date"
                              value={rhf.value}
                              onChange={rhf.onChange}
                              slotProps={{ textField: { fullWidth: true, ...field('forms-datepicker-birth', 'birthDate') } }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                          name="meetingTime"
                          control={formControl}
                          render={({ field: rhf }) => (
                            <TimePicker
                              label="Meeting Time"
                              value={rhf.value}
                              onChange={rhf.onChange}
                              slotProps={{ textField: { fullWidth: true, ...field('forms-timepicker-meeting', 'meetingTime') } }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={12}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Date Range</Typography>
                        <SafeDateRange value={dateRange} onChange={setDateRange} />
                      </Grid>
                    </Grid>
                  </FormSection>

                  <FormSection icon={TuneIcon} step="03" title="Select & Suggest" description="Dropdown, multi-select, autosuggest, and chips" testId="forms-section-select">
                    <Grid container spacing={2.5}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          select
                          label="Country"
                          fullWidth
                          defaultValue=""
                          error={!!errors.country}
                          helperText={errors.country?.message}
                          {...field('forms-select-country', 'country')}
                          {...register('country', { required: 'Select a country' })}
                        >
                          <MenuItem value="" {...option(optId('forms-select-country', 'empty'))}>Select...</MenuItem>
                          <MenuItem value="us" {...option(optId('forms-select-country', 'us'))}>United States</MenuItem>
                          <MenuItem value="uk" {...option(optId('forms-select-country', 'uk'))}>United Kingdom</MenuItem>
                          <MenuItem value="in" {...option(optId('forms-select-country', 'in'))}>India</MenuItem>
                          <MenuItem value="de" {...option(optId('forms-select-country', 'de'))}>Germany</MenuItem>
                          <MenuItem value="jp" {...option(optId('forms-select-country', 'jp'))}>Japan</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                          name="fruit"
                          control={formControl}
                          render={({ field: rhf }) => (
                            <Autocomplete
                              options={SUGGESTIONS}
                              value={rhf.value}
                              onChange={(_, v) => rhf.onChange(v)}
                              {...aid('forms-autosuggest-fruit')}
                              renderInput={(params) => (
                                <TextField {...params} label="Fruit (Auto Suggest)" {...field('forms-input-fruit', 'fruit')} />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={12}>
                        <Controller
                          name="skills"
                          control={formControl}
                          render={({ field: rhf }) => (
                            <Autocomplete
                              multiple
                              options={['JavaScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'TypeScript']}
                              value={rhf.value || []}
                              onChange={(_, v) => rhf.onChange(v)}
                              {...aid('forms-multiselect-skills')}
                              renderInput={(params) => (
                                <TextField {...params} label="Skills (Multi-select)" {...field('forms-input-skills', 'skills')} />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={12}>
                        <Box
                          {...aid('forms-chips')}
                          sx={{ p: 2, borderRadius: 1.5, border: '1px dashed', borderColor: 'divider', bgcolor: 'action.hover' }}
                        >
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>Tags / Chips</Typography>
                          <Stack direction="row" spacing={1} useFlexGap sx={{ mb: 1.5, flexWrap: 'wrap' }}>
                            {chips.map((c) => (
                              <Chip
                                key={c}
                                label={c}
                                onDelete={() => setChips(chips.filter((x) => x !== c))}
                                {...aid(dyn('forms-chip', c.toLowerCase()))}
                              />
                            ))}
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <TextField
                              size="small"
                              fullWidth
                              value={chipInput}
                              onChange={(e) => setChipInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addChip())}
                              placeholder="Add a tag and press Enter"
                              {...field('forms-input-chip', 'chipInput')}
                            />
                            <Button variant="outlined" onClick={addChip} {...btn('forms-btn-chip-add', 'Add chip')} sx={{ whiteSpace: 'nowrap' }}>
                              Add
                            </Button>
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  </FormSection>

                  <FormSection icon={NotesIcon} step="04" title="Rich Text Editor" description="Formatted content with bold, lists, and links" testId="forms-section-richtext">
                    <Box
                      {...aid('forms-richtext')}
                      sx={{
                        '& .ql-toolbar': { borderTopLeftRadius: 8, borderTopRightRadius: 8, bgcolor: 'action.hover' },
                        '& .ql-container': { minHeight: 160, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, fontFamily: 'inherit' },
                      }}
                    >
                      <ReactQuill theme="snow" value={richText} onChange={setRichText} />
                    </Box>
                  </FormSection>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, lg: 4 }}>
                <Box sx={{ position: { lg: 'sticky' }, top: { lg: 88 }, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Paper
                    elevation={0}
                    {...aid('forms-review-panel')}
                    sx={{
                      p: 2.5, border: 1, borderColor: 'divider', borderRadius: 2,
                      background: (theme) =>
                        theme.palette.mode === 'light'
                          ? 'linear-gradient(160deg, #e8eef7 0%, #ffffff 55%)'
                          : 'linear-gradient(160deg, #0d2744 0%, #132f4c 55%)',
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <DataObjectIcon color="primary" fontSize="small" />
                      <Typography variant="h6">Review</Typography>
                    </Stack>
                    <Stack spacing={1.25}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">Name</Typography>
                        <Typography variant="body2" fontWeight={600} noWrap {...aid('forms-review-name')}>{watchedName || '—'}</Typography>
                      </Box>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">Country</Typography>
                        <Typography variant="body2" fontWeight={600} {...aid('forms-review-country')}>{watchedCountry || '—'}</Typography>
                      </Box>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">Tags</Typography>
                        <Typography variant="body2" fontWeight={600} {...aid('forms-review-tags-count')}>{chips.length}</Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                      <Button type="submit" variant="contained" fullWidth startIcon={<SendIcon />} {...btn('forms-btn-submit', 'Submit form')}>
                        Submit
                      </Button>
                      <Button type="button" variant="outlined" fullWidth startIcon={<RestartAltIcon />} onClick={handleReset} {...btn('forms-btn-reset', 'Reset form')}>
                        Reset
                      </Button>
                    </Stack>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 2.5, border: 1, borderColor: 'divider', borderRadius: 2, minHeight: 220 }} {...aid('forms-payload-panel')}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Submitted Payload</Typography>
                    {submitted ? (
                      <Box
                        component="pre"
                        {...aid('forms-payload-json')}
                        sx={{
                          m: 0, p: 1.5, bgcolor: 'action.hover', borderRadius: 1, overflow: 'auto',
                          fontSize: 11, maxHeight: 360, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                        }}
                      >
                        {JSON.stringify(submitted, null, 2)}
                      </Box>
                    ) : (
                      <Box sx={{ py: 5, textAlign: 'center', color: 'text.secondary', border: '1px dashed', borderColor: 'divider', borderRadius: 1.5 }} {...aid('forms-payload-empty')}>
                        <Typography variant="body2">Submit the form to inspect JSON output</Typography>
                      </Box>
                    )}
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </PageContainer>
    </LocalizationProvider>
  )
}
