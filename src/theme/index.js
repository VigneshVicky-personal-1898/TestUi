// AI-ASSISTED: Cursor
// PROMPT: Clean professional Soft UI with muted teal accents
// ACCEPTED-BY: vignesh
import { createTheme, alpha } from '@mui/material/styles'

/** Restrained Soft UI — light dual shadows, teal accent, balanced contrast. */
export const neu = {
  light: {
    bg: '#f0f2f5',
    surface: '#f0f2f5',
    text: '#374151',
    textMuted: '#6b7280',
    accent: '#0d9488',
    accentSoft: 'rgba(13, 148, 136, 0.12)',
    raised: '4px 4px 10px #d5dae0, -4px -4px 10px #ffffff',
    raisedSm: '2px 2px 6px #d5dae0, -2px -2px 6px #ffffff',
    raisedLg: '6px 6px 14px #d5dae0, -6px -6px 14px #ffffff',
    inset: 'inset 2px 2px 6px #d5dae0, inset -2px -2px 6px #ffffff',
    insetSm: 'inset 1px 1px 4px #d5dae0, inset -1px -1px 4px #ffffff',
  },
  dark: {
    bg: '#1e293b',
    surface: '#1e293b',
    text: '#e2e8f0',
    textMuted: '#94a3b8',
    accent: '#2dd4bf',
    accentSoft: 'rgba(45, 212, 191, 0.14)',
    raised: '4px 4px 10px #111827, -4px -4px 10px #2a3a52',
    raisedSm: '2px 2px 6px #111827, -2px -2px 6px #2a3a52',
    raisedLg: '6px 6px 14px #111827, -6px -6px 14px #2a3a52',
    inset: 'inset 2px 2px 6px #111827, inset -2px -2px 6px #2a3a52',
    insetSm: 'inset 1px 1px 4px #111827, inset -1px -1px 4px #2a3a52',
  },
}

export function createAppTheme(mode = 'light') {
  const n = neu[mode] || neu.light
  const isLight = mode === 'light'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: n.accent,
        dark: isLight ? '#0f766e' : '#5eead4',
        light: isLight ? '#14b8a6' : '#99f6e4',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isLight ? '#64748b' : '#94a3b8',
        contrastText: '#ffffff',
      },
      background: {
        default: n.bg,
        paper: n.surface,
      },
      text: {
        primary: n.text,
        secondary: n.textMuted,
      },
      divider: isLight ? 'rgba(51, 65, 85, 0.1)' : 'rgba(255,255,255,0.1)',
      success: { main: isLight ? '#16a34a' : '#4ade80' },
      warning: { main: isLight ? '#ca8a04' : '#facc15' },
      error: { main: isLight ? '#dc2626' : '#f87171' },
      info: { main: isLight ? '#0284c7' : '#38bdf8' },
      action: {
        hover: isLight ? 'rgba(51, 65, 85, 0.04)' : 'rgba(255,255,255,0.04)',
        selected: n.accentSoft,
      },
    },
    typography: {
      fontFamily: '"Nunito", "IBM Plex Sans", "Segoe UI", sans-serif',
      h4: { fontWeight: 700, letterSpacing: '-0.01em' },
      h5: { fontWeight: 700, letterSpacing: '-0.01em' },
      h6: { fontWeight: 650 },
      button: { textTransform: 'none', fontWeight: 650 },
      subtitle1: { fontWeight: 650 },
      overline: { fontWeight: 700, letterSpacing: '0.06em' },
    },
    shape: { borderRadius: 12 },
    spacing: 8,
    shadows: [
      'none',
      n.raisedSm,
      n.raisedSm,
      n.raised,
      n.raised,
      n.raised,
      n.raised,
      n.raisedLg,
      n.raisedLg,
      n.raisedLg,
      n.raisedLg,
      n.raisedLg,
      n.raisedLg,
      n.raisedLg,
      n.raisedLg,
      n.raisedLg,
      n.raisedLg,
      n.raisedLg,
      n.raisedLg,
      n.raisedLg,
      n.raisedLg,
      n.raisedLg,
      n.raisedLg,
      n.raisedLg,
      n.raisedLg,
    ],
    customShadows: {
      neuRaised: n.raised,
      neuRaisedSm: n.raisedSm,
      neuRaisedLg: n.raisedLg,
      neuInset: n.inset,
      neuInsetSm: n.insetSm,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            backgroundColor: n.bg,
            color: n.text,
          },
          '::-webkit-scrollbar': { width: 8, height: 8 },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: isLight ? '#c8d0db' : '#3a4a5e',
            borderRadius: 8,
          },
          '::-webkit-scrollbar-track': {
            backgroundColor: n.bg,
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 650,
            borderRadius: 10,
            padding: '7px 16px',
            transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
          },
          contained: {
            backgroundColor: n.accent,
            boxShadow: n.raisedSm,
            color: '#fff',
            '&:hover': {
              backgroundColor: isLight ? '#0f766e' : '#5eead4',
              boxShadow: n.raisedSm,
            },
            '&:active': {
              boxShadow: n.insetSm,
            },
            '&.Mui-disabled': {
              boxShadow: 'none',
              color: alpha('#fff', 0.5),
            },
          },
          outlined: {
            border: 'none',
            backgroundColor: n.surface,
            boxShadow: n.raisedSm,
            color: n.text,
            '&:hover': {
              border: 'none',
              backgroundColor: n.surface,
              boxShadow: n.insetSm,
            },
          },
          text: {
            color: n.text,
            '&:hover': {
              backgroundColor: alpha(n.accent, 0.08),
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              backgroundColor: alpha(n.accent, 0.08),
            },
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: n.surface,
            boxShadow: n.raisedSm,
            borderRadius: 12,
            border: 'none',
          },
          outlined: {
            border: 'none',
            boxShadow: n.raisedSm,
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundColor: n.surface,
            boxShadow: n.raisedSm,
            borderRadius: 12,
            border: 'none',
            backgroundImage: 'none',
          },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0, color: 'transparent' },
        styleOverrides: {
          root: {
            backgroundColor: n.surface,
            backgroundImage: 'none',
            boxShadow: 'none',
            color: n.text,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            backgroundColor: n.surface,
            border: 'none',
            boxShadow: n.raisedSm,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            marginBottom: 2,
            transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
            '&.Mui-selected': {
              backgroundColor: n.accentSoft,
              color: n.accent,
              boxShadow: n.insetSm,
              '& .MuiListItemIcon-root': { color: n.accent },
              '&:hover': {
                backgroundColor: n.accentSoft,
              },
            },
            '&:hover': {
              backgroundColor: alpha(n.accent, 0.06),
            },
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: 60,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            backgroundColor: n.surface,
            boxShadow: n.insetSm,
            transition: 'box-shadow 0.2s ease',
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&.Mui-focused': {
              boxShadow: n.inset,
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            },
          },
          input: {
            paddingTop: 11,
            paddingBottom: 11,
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 650,
            border: 'none',
            boxShadow: 'none',
          },
          outlined: {
            border: 'none',
            backgroundColor: alpha(n.text, 0.05),
            boxShadow: 'none',
          },
          filled: {
            boxShadow: 'none',
          },
          colorPrimary: {
            backgroundColor: n.accentSoft,
            color: n.accent,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 14,
            boxShadow: n.raisedLg,
            backgroundImage: 'none',
          },
        },
      },
      MuiAccordion: {
        defaultProps: { elevation: 0, disableGutters: true },
        styleOverrides: {
          root: {
            backgroundColor: n.surface,
            boxShadow: n.raisedSm,
            borderRadius: '12px !important',
            border: 'none',
            '&::before': { display: 'none' },
            '&.Mui-expanded': {
              margin: 0,
              boxShadow: n.raisedSm,
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            display: 'none',
          },
          root: {
            minHeight: 40,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            minHeight: 36,
            marginRight: 4,
            textTransform: 'none',
            fontWeight: 650,
            '&.Mui-selected': {
              backgroundColor: n.accentSoft,
              color: n.accent,
            },
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            boxShadow: n.raisedSm,
            borderRadius: 12,
            backgroundColor: n.surface,
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 700,
              color: n.textMuted,
              backgroundColor: 'transparent',
              borderBottom: `1px solid ${isLight ? 'rgba(51,65,85,0.1)' : 'rgba(255,255,255,0.1)'}`,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${isLight ? 'rgba(51,65,85,0.07)' : 'rgba(255,255,255,0.07)'}`,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: alpha(n.accent, 0.04),
            },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            boxShadow: 'none',
            border: 'none',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            fontWeight: 650,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isLight ? 'rgba(51, 65, 85, 0.1)' : 'rgba(255,255,255,0.1)',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            fontWeight: 600,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 10,
            boxShadow: n.raisedLg,
            marginTop: 6,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: '2px 4px',
            '&.Mui-selected': {
              backgroundColor: n.accentSoft,
              color: n.accent,
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          track: {
            borderRadius: 10,
            backgroundColor: isLight ? '#c8d0db' : '#3a4a5e',
            opacity: 1,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            height: 6,
            backgroundColor: isLight ? alpha(n.accent, 0.12) : alpha(n.accent, 0.2),
            boxShadow: 'none',
          },
          bar: {
            borderRadius: 6,
          },
        },
      },
      MuiPaginationItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&.Mui-selected': {
              backgroundColor: n.accentSoft,
              color: n.accent,
            },
          },
        },
      },
    },
  })
}
