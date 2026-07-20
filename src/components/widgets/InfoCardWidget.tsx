import type { WidgetProps } from '@rjsf/utils'
import type { SystemStyleObject } from '@chakra-ui/react'
import {
  Box,
  Field,
  Flex,
  List,
  Text,
} from '@chakra-ui/react'

type InfoCardRow = {
  /** Left-hand label shown in bold (e.g. "Name:"). */
  label: string
  /** Right-hand value text (e.g. "Oscar Diaz"). */
  value: string
}

/** A single body block: a paragraph, an (un)ordered list, or a group of label/value rows. */
type InfoCardBlock =
  | { type: 'paragraph', text: string }
  | { type: 'list', ordered: boolean, items: string[] }
  | { type: 'rows', rows: InfoCardRow[] }

/** Teal "summary card" look used when the uiSchema provides no `customStyles`. */
const DEFAULT_STYLES: SystemStyleObject = {
  bg: '#e8f7f8',
  border: '1px solid #4bbcc4',
  borderRadius: '12px',
  padding: '20px 24px',
}

/** Coerce loosely-typed ui:options rows into a clean {label, value}[] list. */
function parseRows(raw: unknown): InfoCardRow[] {
  if (!Array.isArray(raw)) {
    return []
  }
  return raw
    .map((row) => {
      if (typeof row !== 'object' || row === null) {
        return null
      }
      const { label, value } = row as Record<string, unknown>
      return {
        label: typeof label === 'string' ? label : '',
        value: typeof value === 'string' ? value : '',
      }
    })
    .filter((row): row is InfoCardRow => row !== null && (row.label !== '' || row.value !== ''))
}

/** Render a group of label/value rows (label left, value right), one per line. */
function InfoCardRows({ rows }: { rows: InfoCardRow[] }) {
  return rows.map((row, i) => (
    <Flex
      key={i}
      align="baseline"
      justify="space-between"
      gap={4}
      py={2}
      css={{
        borderTop: i === 0 ? 'none' : '1px solid rgba(0, 0, 0, 0.08)',
        _dark: { borderTop: i === 0 ? 'none' : '1px solid rgba(255, 255, 255, 0.12)' },
      }}
    >
      <Text as="span" fontWeight="700" flexShrink={0}>
        {row.label}
      </Text>
      <Text as="span" textAlign="right">
        {row.value}
      </Text>
    </Flex>
  ))
}

/** Coerce a value into a clean list of non-empty strings. */
function parseStringList(raw: unknown): string[] {
  if (!Array.isArray(raw)) {
    return []
  }
  return raw.filter((s): s is string => typeof s === 'string' && s !== '')
}

/**
 * Coerce loosely-typed ui:options content into a clean list of body blocks.
 * Accepts, per entry:
 *   - a bare string                        → paragraph
 *   - { type: 'paragraph', text }          → paragraph
 *   - { type: 'list', ordered?, items }    → list (ordered defaults to false)
 *   - { type: 'rows', rows }               → group of label/value rows
 * Entries are otherwise inferred from shape: an `items` array implies a list,
 * a `rows` array implies a rows block, a `text` string implies a paragraph.
 */
function parseContent(raw: unknown): InfoCardBlock[] {
  if (!Array.isArray(raw)) {
    return []
  }
  return raw
    .map((block): InfoCardBlock | null => {
      if (typeof block === 'string') {
        return block !== '' ? { type: 'paragraph', text: block } : null
      }
      if (typeof block !== 'object' || block === null) {
        return null
      }
      const { type, text, ordered, items, rows } = block as Record<string, unknown>
      if (type === 'rows' || (type === undefined && Array.isArray(rows))) {
        const parsedRows = parseRows(rows)
        return parsedRows.length > 0
          ? { type: 'rows', rows: parsedRows }
          : null
      }
      if (type === 'list' || (type === undefined && Array.isArray(items))) {
        const parsedItems = parseStringList(items)
        return parsedItems.length > 0
          ? { type: 'list', ordered: ordered === true, items: parsedItems }
          : null
      }
      if (type === 'paragraph' || (type === undefined && typeof text === 'string')) {
        return typeof text === 'string' && text !== ''
          ? { type: 'paragraph', text }
          : null
      }
      return null
    })
    .filter((block): block is InfoCardBlock => block !== null)
}

/**
 * Purely presentational widget: renders a titled summary card with a header row
 * (optional icon + title) followed by label/value rows — the label sits on the
 * left, the value on the right. Holds no value and is excluded from formData.
 *
 * All config is read from `ui:options` (RJSF's channel for custom widget
 * options), surfaced here as `props.options`:
 *   'ui:widget': 'InfoCardWidget'
 *   'ui:options':
 *     title:        card heading (e.g. "Student Information")
 *     icon:         optional emoji/text shown before the title (e.g. "📋")
 *     content:      array of body blocks rendered below the title — each a
 *                   paragraph ({ type: 'paragraph', text }), an ordered/unordered
 *                   list ({ type: 'list', ordered?, items }), or a group of
 *                   label/value rows ({ type: 'rows', rows }); bare strings are paragraphs
 *     customStyles: Chakra SystemStyleObject applied to the card container (bg, border, padding, …)
 */
export default function InfoCardWidget(props: WidgetProps) {
  const options = (props.options ?? {}) as Record<string, unknown>
  const styles = (options.customStyles as SystemStyleObject | undefined) ?? DEFAULT_STYLES
  // Prefer an explicit ui:options.title, else fall back to the schema title RJSF passes as `label`.
  const title = (typeof options.title === 'string' && options.title)
    || (typeof props.label === 'string' ? props.label : '')
    || (typeof props.schema?.title === 'string' ? props.schema.title : '')
  const icon = typeof options.icon === 'string' ? options.icon : ''
  const content = parseContent(options.content)

  if (!title && content.length === 0) {
    return null
  }

  const hasBody = content.length > 0

  return (
    <Field.Root className='eg-info-card-widget'>
      <Box
        w="full"
        my={2}
        css={{
          color: '#333',
          _dark: { color: 'gray.100' },
          ...styles,
        }}
      >
        {title && (
          <Flex align="center" gap={2} mb={hasBody ? 4 : 0}>
            {icon && (
              <Text as="span" fontSize="1.25rem" lineHeight={1}>
                {icon}
              </Text>
            )}
            <Text
              as="h3"
              fontWeight="700"
              fontSize="1.125rem"
              color="#1799a6"
              _dark={{ color: 'teal.200' }}
            >
              {title}
            </Text>
          </Flex>
        )}

        {content.map((block, i) => {
          // Keep the first body block flush with the title above it;
          // give subsequent blocks breathing room.
          const mt = i === 0 ? 0 : 3
          if (block.type === 'rows') {
            return (
              <Box key={i} mt={mt}>
                <InfoCardRows rows={block.rows} />
              </Box>
            )
          }
          if (block.type === 'list') {
            return (
              <List.Root
                key={i}
                as={block.ordered ? 'ol' : 'ul'}
                ps="20px"
                mt={mt}
                gap="4px"
              >
                {block.items.map((item, j) => (
                  <List.Item key={j}>{item}</List.Item>
                ))}
              </List.Root>
            )
          }
          return (
            <Text key={i} mt={mt} lineHeight={1.6}>
              {block.text}
            </Text>
          )
        })}
      </Box>
    </Field.Root>
  )
}
