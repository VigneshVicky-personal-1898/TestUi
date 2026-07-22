// AI-ASSISTED: Cursor
// PROMPT: Migrate interactive controls to automation helpers (id/name/data-testid/aria-label)
// ACCEPTED-BY: vignesh

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSnackbar } from 'notistack'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  Box, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography,
  Tooltip, Accordion, AccordionSummary, AccordionDetails, Tabs, Tab, Stepper, Step,
  StepLabel, Stack, Card, CardMedia, CardContent, IconButton, Popover, Snackbar, Alert,
  List, ListItem, ListItemText, CircularProgress,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { PageHeader } from '../../components/common/PageHeader'
import { aid, btn, iconBtn, dyn } from '../../utils/automation'

const CAROUSEL = [
  { title: 'Slide 1', img: 'https://picsum.photos/seed/c1/800/300' },
  { title: 'Slide 2', img: 'https://picsum.photos/seed/c2/800/300' },
  { title: 'Slide 3', img: 'https://picsum.photos/seed/c3/800/300' },
]

function DraggableItem({ id, text, index, moveItem }) {
  const ref = useRef(null)
  const [, drop] = useDrop({
    accept: 'CARD',
    hover(item) {
      if (item.index === index) return
      moveItem(item.index, index)
      item.index = index
    },
  })
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { id, index },
    collect: (m) => ({ isDragging: m.isDragging() }),
  })
  drag(drop(ref))
  return (
    <Paper ref={ref} sx={{ p: 1.5, mb: 1, opacity: isDragging ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: 1, cursor: 'grab' }} {...aid(dyn('dnd-item', id))}>
      <DragIndicatorIcon color="action" />
      <Typography>{text}</Typography>
    </Paper>
  )
}

export default function AdvancedPage() {
  const { enqueueSnackbar } = useSnackbar()
  const [modalOpen, setModalOpen] = useState(false)
  const [popupAnchor, setPopupAnchor] = useState(null)
  const [snackOpen, setSnackOpen] = useState(false)
  const [tab, setTab] = useState(0)
  const [step, setStep] = useState(0)
  const [slide, setSlide] = useState(0)
  const [items, setItems] = useState([
    { id: 1, text: 'Drag me A' },
    { id: 2, text: 'Drag me B' },
    { id: 3, text: 'Drag me C' },
    { id: 4, text: 'Drag me D' },
  ])
  const [scrollItems, setScrollItems] = useState(Array.from({ length: 20 }, (_, i) => i + 1))
  const [loadingMore, setLoadingMore] = useState(false)
  const sentinelRef = useRef(null)

  const moveItem = useCallback((from, to) => {
    setItems((prev) => {
      const next = [...prev]
      const [removed] = next.splice(from, 1)
      next.splice(to, 0, removed)
      return next
    })
  }, [])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingMore) {
        setLoadingMore(true)
        setTimeout(() => {
          setScrollItems((prev) => [...prev, ...Array.from({ length: 10 }, (_, i) => prev.length + i + 1)])
          setLoadingMore(false)
        }, 800)
      }
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [loadingMore])

  return (
    <DndProvider backend={HTML5Backend}>
      <Box {...aid('advanced-page')}>
        <PageHeader pageId="advanced" title="Advanced Components" subtitle="Modal, popup, toast, snackbar, tooltip, accordion, tabs, stepper, carousel, drag & drop, infinite scroll" breadcrumbs={['Advanced']} />

        <Stack spacing={3}>
          <Paper sx={{ p: 2 }} {...aid('feedback-section')}>
            <Typography variant="h6" gutterBottom>Feedback</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button variant="contained" onClick={() => setModalOpen(true)} {...btn('open-modal')}>Open Modal</Button>
              <Button variant="outlined" onClick={(e) => setPopupAnchor(e.currentTarget)} {...btn('open-popup')}>Open Popup</Button>
              <Button onClick={() => enqueueSnackbar('Toast message from notistack!', { variant: 'success' })} {...btn('show-toast')}>Show Toast</Button>
              <Button onClick={() => setSnackOpen(true)} {...btn('show-snackbar')}>Show Snackbar</Button>
              <Tooltip title="I am a tooltip" {...aid('tooltip-wrap')}>
                <Button {...btn('tooltip-trigger')}>Hover Tooltip</Button>
              </Tooltip>
            </Stack>
          </Paper>

          <Paper sx={{ p: 2 }} {...aid('accordion-section')}>
            <Typography variant="h6" gutterBottom>Accordion</Typography>
            {['Section One', 'Section Two', 'Section Three'].map((t, i) => (
              <Accordion key={t} {...aid(dyn('accordion', i))}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} {...aid(dyn('accordion-summary', i))}>
                  <Typography>{t}</Typography>
                </AccordionSummary>
                <AccordionDetails {...aid(dyn('accordion-details', i))}>
                  Content for {t}. Useful for testing expand/collapse locators.
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>

          <Paper sx={{ p: 2 }} {...aid('tabs-section')}>
            <Typography variant="h6" gutterBottom>Tabs</Typography>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} {...aid('advanced-tabs')}>
              <Tab label="Overview" {...btn('tab-0')} />
              <Tab label="Details" {...btn('tab-1')} />
              <Tab label="Settings" {...btn('tab-2')} />
            </Tabs>
            <Box sx={{ p: 2 }} {...aid(dyn('tab-panel', tab))}>
              Panel content for tab {tab + 1}
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }} {...aid('stepper-section')}>
            <Typography variant="h6" gutterBottom>Stepper</Typography>
            <Stepper activeStep={step} {...aid('advanced-stepper')}>
              {['Account', 'Profile', 'Review', 'Done'].map((label) => (
                <Step key={label}><StepLabel>{label}</StepLabel></Step>
              ))}
            </Stepper>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button disabled={step === 0} onClick={() => setStep(step - 1)} {...btn('stepper-back')}>Back</Button>
              <Button variant="contained" disabled={step === 3} onClick={() => setStep(step + 1)} {...btn('stepper-next')}>Next</Button>
            </Stack>
          </Paper>

          <Paper sx={{ p: 2 }} {...aid('carousel-section')}>
            <Typography variant="h6" gutterBottom>Carousel</Typography>
            <Box sx={{ position: 'relative' }} {...aid('carousel')}>
              <Card>
                <CardMedia component="img" height="220" image={CAROUSEL[slide].img} alt={CAROUSEL[slide].title} {...aid('carousel-image')} />
                <CardContent><Typography>{CAROUSEL[slide].title}</Typography></CardContent>
              </Card>
              <IconButton
                sx={{ position: 'absolute', left: 8, top: '40%' }}
                onClick={() => setSlide((slide + CAROUSEL.length - 1) % CAROUSEL.length)}
                {...iconBtn('carousel-prev', 'Previous slide')}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <IconButton
                sx={{ position: 'absolute', right: 8, top: '40%' }}
                onClick={() => setSlide((slide + 1) % CAROUSEL.length)}
                {...iconBtn('carousel-next', 'Next slide')}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }} {...aid('dnd-section')}>
            <Typography variant="h6" gutterBottom>Drag & Drop</Typography>
            {items.map((item, index) => (
              <DraggableItem key={item.id} id={item.id} text={item.text} index={index} moveItem={moveItem} />
            ))}
          </Paper>

          <Paper sx={{ p: 2 }} {...aid('infinite-scroll-section')}>
            <Typography variant="h6" gutterBottom>Infinite Scroll</Typography>
            <Box sx={{ height: 240, overflow: 'auto' }} {...aid('infinite-scroll-container')}>
              <List>
                {scrollItems.map((n) => (
                  <ListItem key={n} {...aid(dyn('scroll-item', n))}>
                    <ListItemText primary={`Infinite item #${n}`} />
                  </ListItem>
                ))}
              </List>
              <Box ref={sentinelRef} sx={{ py: 2, textAlign: 'center' }} {...aid('scroll-sentinel')}>
                {loadingMore && <CircularProgress size={24} />}
              </Box>
            </Box>
          </Paper>
        </Stack>

        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} {...aid('advanced-modal')}>
          <DialogTitle>Example Modal</DialogTitle>
          <DialogContent><Typography>Modal content for automation practice.</Typography></DialogContent>
          <DialogActions>
            <Button onClick={() => setModalOpen(false)} {...btn('modal-close')}>Close</Button>
            <Button variant="contained" onClick={() => setModalOpen(false)} {...btn('modal-confirm')}>Confirm</Button>
          </DialogActions>
        </Dialog>

        <Popover open={Boolean(popupAnchor)} anchorEl={popupAnchor} onClose={() => setPopupAnchor(null)} {...aid('advanced-popup')}>
          <Box sx={{ p: 2, maxWidth: 240 }}>
            <Typography>Popup / Popover content</Typography>
            <Button size="small" onClick={() => setPopupAnchor(null)} {...btn('popup-close')}>Close</Button>
          </Box>
        </Popover>

        <Snackbar open={snackOpen} autoHideDuration={4000} onClose={() => setSnackOpen(false)} {...aid('advanced-snackbar')}>
          <Alert severity="info" onClose={() => setSnackOpen(false)}>This is a snackbar message</Alert>
        </Snackbar>
      </Box>
    </DndProvider>
  )
}
