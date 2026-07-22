// AI-ASSISTED: Cursor
// PROMPT: Add option() automation attrs to advanced forms MenuItems
// ACCEPTED-BY: vignesh

import { useEffect, useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import {
  Box, Paper, TextField, Button, MenuItem, Stack, Typography, Alert, Divider, IconButton, LinearProgress,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { PageHeader, PageContainer } from '../../components/common/PageHeader'
import { aid, btn, field, option, optId } from '../../utils/automation'

const JSON_SCHEMA = [
  { name: 'projectName', label: 'Project Name', type: 'text', required: true },
  { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High'] },
  { name: 'budget', label: 'Budget', type: 'number' },
  { name: 'notes', label: 'Notes', type: 'textarea' },
]

export default function FormsAdvancedPage() {
  const [usernameStatus, setUsernameStatus] = useState('')
  const { register, handleSubmit, watch, control, formState: { errors }, reset } = useForm({
    defaultValues: {
      country: '', state: '', username: '', email: '', password: '',
      addresses: [{ line: '' }], phones: [{ number: '' }], emails: [{ value: '' }],
      dynamic: { projectName: '', priority: 'Medium', budget: 0, notes: '' },
    },
  })
  const addr = useFieldArray({ control, name: 'addresses' })
  const phones = useFieldArray({ control, name: 'phones' })
  const emails = useFieldArray({ control, name: 'emails' })
  const country = watch('country')
  const username = watch('username')
  const password = watch('password')
  const [payload, setPayload] = useState(null)

  useEffect(() => {
    if (!username || username.length < 3) { setUsernameStatus(''); return }
    setUsernameStatus('checking')
    const t = setTimeout(() => {
      setUsernameStatus(username.toLowerCase() === 'admin' ? 'taken' : 'available')
    }, 700)
    return () => clearTimeout(t)
  }, [username])

  const strength = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(password || '')).length * 25

  return (
    <PageContainer pageId="forms-advanced-page">
      <PageHeader pageId="forms-advanced" title="Advanced Forms" subtitle="Conditional fields, JSON-driven form, repeatable sections, async/regex validation" breadcrumbs={['Forms Advanced']} />
      <Box component="form" onSubmit={handleSubmit((d) => setPayload(d))} {...aid('forms-adv-form')}>
        <Stack spacing={2}>
          <Paper sx={{ p: 2 }} {...aid('forms-adv-conditional')}>
            <Typography variant="h6">Conditional Fields</Typography>
            <TextField select fullWidth label="Country" defaultValue="" sx={{ mt: 1 }} {...field('forms-adv-country', 'country')} {...register('country', { required: true })}>
              <MenuItem value="" {...option(optId('forms-adv-country', 'empty'))}>Select</MenuItem>
              <MenuItem value="India" {...option(optId('forms-adv-country', 'India'))}>India</MenuItem>
              <MenuItem value="USA" {...option(optId('forms-adv-country', 'USA'))}>USA</MenuItem>
              <MenuItem value="Germany" {...option(optId('forms-adv-country', 'Germany'))}>Germany</MenuItem>
            </TextField>
            {country === 'India' ? (
              <TextField fullWidth sx={{ mt: 2 }} label="State (India)" {...field('forms-adv-state', 'state')} {...register('state', { required: 'State required for India' })}
                error={!!errors.state} helperText={errors.state?.message} {...aid('forms-adv-state-visible')} />
            ) : (
              <Typography variant="caption" color="text.secondary" {...aid('forms-adv-state-hidden')}>State field hidden (country ≠ India)</Typography>
            )}
          </Paper>

          <Paper sx={{ p: 2 }} {...aid('forms-adv-validation')}>
            <Typography variant="h6">Validation Rules</Typography>
            <TextField fullWidth sx={{ mt: 1 }} label="Username (async)" {...field('forms-adv-username', 'username')} {...register('username', { required: true, minLength: 3 })}
              helperText={usernameStatus === 'checking' ? 'Checking…' : usernameStatus === 'taken' ? 'Username taken (server)' : usernameStatus === 'available' ? 'Available' : 'Async + duplicate check'}
              error={usernameStatus === 'taken'} />
            {usernameStatus === 'checking' && <LinearProgress {...aid('forms-adv-username-loading')} />}
            <TextField fullWidth sx={{ mt: 2 }} label="Email" {...field('forms-adv-email', 'email')} {...register('email', { required: true, pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} error={!!errors.email} helperText={errors.email?.message} />
            <TextField fullWidth type="password" sx={{ mt: 2 }} label="Password" {...field('forms-adv-password', 'password')} {...register('password', { required: true, minLength: 8 })} />
            <LinearProgress sx={{ mt: 1 }} variant="determinate" value={strength} {...aid('forms-adv-password-strength')} />
          </Paper>

          <Paper sx={{ p: 2 }} {...aid('forms-adv-repeatable')}>
            <Typography variant="h6">Repeatable Sections</Typography>
            {addr.fields.map((f, i) => (
              <Stack key={f.id} direction="row" spacing={1} sx={{ mt: 1 }}>
                <TextField fullWidth label={`Address ${i + 1}`} {...field(`forms-adv-address-${i}`, `addresses.${i}.line`)} {...register(`addresses.${i}.line`)} />
                <IconButton {...btn(`forms-adv-btn-del-address-${i}`)} onClick={() => addr.remove(i)}><DeleteIcon /></IconButton>
              </Stack>
            ))}
            <Button startIcon={<AddIcon />} {...btn('forms-adv-btn-add-address')} onClick={() => addr.append({ line: '' })}>Add Address</Button>
            <Divider sx={{ my: 2 }} />
            {phones.fields.map((f, i) => (
              <Stack key={f.id} direction="row" spacing={1} sx={{ mt: 1 }}>
                <TextField fullWidth label={`Phone ${i + 1}`} {...field(`forms-adv-phone-${i}`, `phones.${i}.number`)} {...register(`phones.${i}.number`)} />
                <IconButton {...btn(`forms-adv-btn-del-phone-${i}`)} onClick={() => phones.remove(i)}><DeleteIcon /></IconButton>
              </Stack>
            ))}
            <Button startIcon={<AddIcon />} {...btn('forms-adv-btn-add-phone')} onClick={() => phones.append({ number: '' })}>Add Phone</Button>
            <Divider sx={{ my: 2 }} />
            {emails.fields.map((f, i) => (
              <Stack key={f.id} direction="row" spacing={1} sx={{ mt: 1 }}>
                <TextField fullWidth label={`Email ${i + 1}`} {...field(`forms-adv-extra-email-${i}`, `emails.${i}.value`)} {...register(`emails.${i}.value`)} />
                <IconButton {...btn(`forms-adv-btn-del-email-${i}`)} onClick={() => emails.remove(i)}><DeleteIcon /></IconButton>
              </Stack>
            ))}
            <Button startIcon={<AddIcon />} {...btn('forms-adv-btn-add-email')} onClick={() => emails.append({ value: '' })}>Add Email</Button>
          </Paper>

          <Paper sx={{ p: 2 }} {...aid('forms-adv-dynamic')}>
            <Typography variant="h6">Dynamic Form (from JSON)</Typography>
            {JSON_SCHEMA.map((f) => (
              f.type === 'select' ? (
                <TextField key={f.name} select fullWidth sx={{ mt: 1 }} label={f.label} defaultValue={f.options[1]} {...field(`forms-adv-dyn-${f.name}`, `dynamic.${f.name}`)} {...register(`dynamic.${f.name}`, { required: f.required })}>
                  {f.options.map((o) => <MenuItem key={o} value={o} {...option(optId(`forms-adv-dyn-${f.name}`, o))}>{o}</MenuItem>)}
                </TextField>
              ) : (
                <TextField key={f.name} fullWidth sx={{ mt: 1 }} multiline={f.type === 'textarea'} rows={f.type === 'textarea' ? 3 : 1} type={f.type === 'number' ? 'number' : 'text'} label={f.label}
                  {...field(`forms-adv-dyn-${f.name}`, `dynamic.${f.name}`)} {...register(`dynamic.${f.name}`, { required: f.required })} />
              )
            ))}
          </Paper>

          <Stack direction="row" spacing={1}>
            <Button type="submit" variant="contained" {...btn('forms-adv-btn-submit')}>Submit</Button>
            <Button type="button" {...btn('forms-adv-btn-reset')} onClick={() => { reset(); setPayload(null) }}>Reset</Button>
          </Stack>
          {payload && <Alert {...aid('forms-adv-payload')}><pre style={{ margin: 0, fontSize: 12 }}>{JSON.stringify(payload, null, 2)}</pre></Alert>}
        </Stack>
      </Box>
    </PageContainer>
  )
}
