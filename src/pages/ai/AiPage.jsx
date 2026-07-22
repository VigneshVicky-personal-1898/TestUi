// AI-ASSISTED: Cursor
// PROMPT: AI chat with stream, stop, regenerate, copy, like/dislike, history
// ACCEPTED-BY: vignesh
import { useState, useRef, useEffect } from 'react'
import {
  Box, Paper, TextField, IconButton, Typography, Stack, Avatar, Chip, CircularProgress,
  Button, Tooltip, Drawer, List, ListItemButton, ListItemText, Divider,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import StopIcon from '@mui/icons-material/Stop'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import RefreshIcon from '@mui/icons-material/Refresh'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined'
import HistoryIcon from '@mui/icons-material/History'
import ReactMarkdown from 'react-markdown'
import { PageHeader } from '../../components/common/PageHeader'
import { aid, btn, field } from '../../utils/automation'

const REPLIES = [
  `Here's a **sample response** for automation practice:\n\n- Item one\n- Item two\n\n\`\`\`javascript\nconst greeting = 'Hello from AI';\nconsole.log(greeting);\n\`\`\``,
  `I found **3 matching test cases**:\n\n| ID | Name | Status |\n|----|------|--------|\n| TC-01 | Login | Pass |\n| TC-02 | Checkout | Fail |\n\nRegenerate the failed case?`,
  `OTP flow:\n1. Enter credentials\n2. Wait for OTP\n3. Type \`123456\`\n4. Assert dashboard\n\n> Use explicit waits.`,
]

export default function AiPage() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hi! I am the **TestUi AI** playground. Ask me anything.' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [promptHistory, setPromptHistory] = useState([])
  const [feedback, setFeedback] = useState({})
  const stopRef = useRef(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamText, typing])

  const streamReply = async (reply) => {
    stopRef.current = false
    setTyping(true)
    setStreamText('')
    for (let i = 0; i <= reply.length; i += 3) {
      if (stopRef.current) {
        setMessages((m) => [...m, { id: Date.now() + 1, role: 'assistant', content: reply.slice(0, i) + '\n\n*(stopped)*' }])
        setStreamText('')
        setTyping(false)
        return
      }
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 25))
      setStreamText(reply.slice(0, i))
    }
    setMessages((m) => [...m, { id: Date.now() + 1, role: 'assistant', content: reply }])
    setStreamText('')
    setTyping(false)
  }

  const send = async (text = input) => {
    if (!text.trim() || typing) return
    const userMsg = { id: Date.now(), role: 'user', content: text.trim() }
    setMessages((m) => [...m, userMsg])
    setPromptHistory((h) => [text.trim(), ...h.filter((x) => x !== text.trim())].slice(0, 20))
    setInput('')
    const reply = REPLIES[messages.length % REPLIES.length]
    await streamReply(reply)
  }

  const regenerate = async () => {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    if (!lastUser || typing) return
    setMessages((m) => {
      const copy = [...m]
      if (copy[copy.length - 1]?.role === 'assistant') copy.pop()
      return copy
    })
    await streamReply(REPLIES[Math.floor(Math.random() * REPLIES.length)])
  }

  const copyLast = async () => {
    const last = [...messages].reverse().find((m) => m.role === 'assistant')
    if (last) await navigator.clipboard.writeText(last.content)
  }

  return (
    <Box {...aid('ai-page')}>
      <PageHeader
        pageId="ai"
        title="AI Test Playground"
        subtitle="Streaming, stop, regenerate, markdown/code, copy, like/dislike, prompt history"
        breadcrumbs={['AI Playground']}
        actions={(
          <>
            <Button startIcon={<HistoryIcon />} {...btn('ai-btn-history')} onClick={() => setHistoryOpen(true)}>History</Button>
            <Button startIcon={<RefreshIcon />} {...btn('ai-btn-regenerate')} onClick={regenerate} disabled={typing}>Regenerate</Button>
            <Button startIcon={<ContentCopyIcon />} {...btn('ai-btn-copy')} onClick={copyLast}>Copy</Button>
          </>
        )}
      />

      <Paper sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }} {...aid('ai-chat-window')}>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }} {...aid('ai-messages')}>
          {messages.map((msg) => (
            <Stack
              key={msg.id}
              direction="row"
              spacing={1.5}
              sx={{ mb: 2, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
              {...aid(`ai-message-${msg.id}`)}
            >
              {msg.role === 'assistant' && <Avatar sx={{ bgcolor: 'primary.main' }}><SmartToyIcon /></Avatar>}
              <Box sx={{ maxWidth: '75%' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    bgcolor: msg.role === 'user' ? 'primary.main' : 'action.hover',
                    color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                  }}
                  {...aid(msg.role === 'assistant' ? `ai-response-card-${msg.id}` : `user-message-card-${msg.id}`)}
                >
                  {msg.role === 'assistant' ? (
                    <Box className="markdown-body" {...aid(`ai-markdown-${msg.id}`)}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </Box>
                  ) : (
                    <Typography variant="body2">{msg.content}</Typography>
                  )}
                </Paper>
                {msg.role === 'assistant' && (
                  <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                    <IconButton size="small" {...btn(`ai-btn-like-${msg.id}`)} onClick={() => setFeedback((f) => ({ ...f, [msg.id]: 'like' }))}>
                      <ThumbUpAltOutlinedIcon fontSize="small" color={feedback[msg.id] === 'like' ? 'primary' : 'inherit'} />
                    </IconButton>
                    <IconButton size="small" {...btn(`ai-btn-dislike-${msg.id}`)} onClick={() => setFeedback((f) => ({ ...f, [msg.id]: 'dislike' }))}>
                      <ThumbDownAltOutlinedIcon fontSize="small" color={feedback[msg.id] === 'dislike' ? 'error' : 'inherit'} />
                    </IconButton>
                    <Chip size="small" label={feedback[msg.id] || 'feedback'} {...aid(`ai-feedback-${msg.id}`)} />
                  </Stack>
                )}
              </Box>
              {msg.role === 'user' && <Avatar sx={{ bgcolor: 'secondary.main' }}><PersonIcon /></Avatar>}
            </Stack>
          ))}

          {typing && (
            <Stack direction="row" spacing={1.5} sx={{ mb: 2 }} {...aid('ai-typing')}>
              <Avatar sx={{ bgcolor: 'primary.main' }}><SmartToyIcon /></Avatar>
              <Paper sx={{ p: 1.5, maxWidth: '75%', bgcolor: 'action.hover' }} {...aid('ai-typing-card')}>
                {streamText ? (
                  <Box {...aid('ai-streaming-text')}>
                    <ReactMarkdown>{streamText}</ReactMarkdown>
                    <Chip size="small" label="streaming..." sx={{ mt: 1 }} {...aid('ai-typing-indicator')} />
                  </Box>
                ) : (
                  <CircularProgress size={18} />
                )}
              </Paper>
            </Stack>
          )}
          <div ref={bottomRef} />
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }} {...aid('ai-input-bar')}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
            disabled={typing}
            {...field('ai-input', 'aiPrompt')}
          />
          {typing ? (
            <IconButton color="error" onClick={() => { stopRef.current = true }} {...btn('ai-btn-stop', 'Stop response')}>
              <StopIcon />
            </IconButton>
          ) : (
            <IconButton color="primary" onClick={() => send()} disabled={!input.trim()} {...btn('ai-btn-send', 'Send')}>
              <SendIcon />
            </IconButton>
          )}
        </Box>
      </Paper>

      <Drawer anchor="right" open={historyOpen} onClose={() => setHistoryOpen(false)} {...aid('ai-history-drawer')}>
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6">Prompt History</Typography>
          <Divider sx={{ my: 1 }} />
          <List dense {...aid('ai-prompt-history')}>
            {promptHistory.map((p, i) => (
              <ListItemButton key={i} onClick={() => { setInput(p); setHistoryOpen(false) }} {...aid(`ai-history-item-${i}`)}>
                <ListItemText primary={p} primaryTypographyProps={{ noWrap: true }} />
              </ListItemButton>
            ))}
          </List>
          <Typography variant="subtitle2" sx={{ mt: 2 }}>Conversation ({messages.length} messages)</Typography>
          <Typography variant="caption" {...aid('ai-conversation-count')}>{messages.filter((m) => m.role === 'user').length} user turns</Typography>
        </Box>
      </Drawer>
    </Box>
  )
}
