// AI-ASSISTED: Cursor
// PROMPT: Expand automation helpers for options, links, selects, icons, and full attr sets
// ACCEPTED-BY: vignesh
/**
 * TestUi automation identifier convention
 * ---------------------------------------
 * Pattern:  {module}-{element}[-{qualifier}]
 * Examples: login-email, users-btn-add, nav-link-dashboard, header-btn-theme
 *
 * Rules:
 * - Prefer kebab-case, lowercase, no spaces
 * - Module prefix always present (login, users, header, nav, …)
 * - Interactive controls expose id + data-testid (same value)
 * - Form fields also set name (stable field name)
 * - Dynamic rows use entity id: users-row-{id}, users-btn-edit-{id}
 * - Prefer helpers over hand-rolled attributes so id/name/data-testid/aria-label stay in sync
 */

/** Element attrs: id + data-testid (same stable value). */
export function aid(id) {
  return { id, 'data-testid': id }
}

/** Button / clickable attrs with optional accessible name. */
export function btn(id, ariaLabel) {
  return {
    id,
    name: id,
    'data-testid': id,
    ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
  }
}

/**
 * IconButton attrs — always prefer an aria-label for icon-only controls.
 */
export function iconBtn(id, ariaLabel) {
  return {
    id,
    name: id,
    'data-testid': id,
    'aria-label': ariaLabel || id,
  }
}

/**
 * Link / anchor attrs (RouterLink, MUI Link, <a>).
 */
export function link(id, ariaLabel) {
  return {
    id,
    'data-testid': id,
    ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
  }
}

/**
 * MUI TextField-friendly attrs.
 * Sets wrapper data-testid and html input id/name/data-testid.
 */
export function field(id, name = id) {
  return {
    id,
    name,
    'data-testid': id,
    slotProps: {
      htmlInput: {
        id,
        name,
        'data-testid': id,
      },
    },
  }
}

/**
 * Native <input> / file input attrs (when not using TextField).
 */
export function input(id, name = id) {
  return {
    id,
    name,
    'data-testid': id,
  }
}

/**
 * MUI Select / native select attrs.
 * Use with InputLabel htmlFor matching id when possible.
 */
export function select(id, name = id, ariaLabel) {
  return {
    id,
    name,
    'data-testid': id,
    inputProps: {
      id,
      name,
      'data-testid': id,
      ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
    },
    ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
  }
}

/**
 * MenuItem / option attrs under a Select.
 * Prefer dyn(parentId, 'option', value) for uniqueness.
 */
export function option(id, ariaLabel) {
  return {
    id,
    'data-testid': id,
    ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
  }
}

/** Checkbox / radio / switch control attrs. */
export function control(id, name = id, ariaLabel) {
  return {
    id,
    name,
    'data-testid': id,
    inputProps: {
      id,
      name,
      'data-testid': id,
      ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
    },
    ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
  }
}

/**
 * Table / row / cell container attrs.
 */
export function table(id) {
  return aid(id)
}

/** Build dynamic id segments safely. */
export function dyn(base, ...parts) {
  return [base, ...parts.map((p) => String(p).replace(/\s+/g, '-').toLowerCase())].join('-')
}

/**
 * Convenience: option id from select id + value.
 * e.g. opt('users-filter-role', 'admin') → users-filter-role-option-admin
 */
export function optId(selectId, value) {
  return dyn(selectId, 'option', value)
}
